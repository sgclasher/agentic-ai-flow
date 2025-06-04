import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Database Deployment API Route
 * 
 * POST /api/database/deploy
 * Deploys the database schema to Supabase with verification
 */

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request) {
  try {
    console.log('🎯 Starting database deployment...');
    
    // Validate environment
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables'
      }, { status: 500 });
    }

    // Step 1: Test connection by checking auth users
    console.log('🔗 Testing Supabase connection...');
    try {
      const { data: authTest, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        throw new Error(`Auth test failed: ${authError.message}`);
      }
      console.log('✅ Supabase connection successful');
    } catch (connectionError) {
      return NextResponse.json({
        success: false,
        error: `Connection failed: ${connectionError.message}`
      }, { status: 500 });
    }

    // Step 2: Check existing tables
    console.log('📋 Checking existing database structure...');
    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    const tablesExist = !profileError;
    console.log(tablesExist ? '⚠️ Tables already exist' : '📋 Database ready for schema');

    // Step 3: Execute basic table creation manually
    // We'll create tables one by one for better error handling
    const deploymentResults = [];

    try {
      // Create profiles table
      if (!tablesExist) {
        console.log('📝 Creating profiles table...');
        const profileTableSQL = `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            company_name TEXT NOT NULL,
            industry TEXT,
            size TEXT,
            data JSONB NOT NULL,
            markdown TEXT,
            status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived', 'deleted')),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            created_by UUID REFERENCES auth.users(id),
            updated_by UUID REFERENCES auth.users(id)
          );
        `;
        
        // We'll use a different approach - create the table through the API
        await createTableViaAPI('profiles', profileTableSQL);
        deploymentResults.push({ table: 'profiles', status: 'created' });
      }

    } catch (tableError) {
      console.error('❌ Table creation error:', tableError.message);
      deploymentResults.push({ table: 'profiles', status: 'error', error: tableError.message });
    }

    // Step 4: Verify deployment
    console.log('🔍 Verifying deployment...');
    const { data: verifyProfiles, error: verifyError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (verifyError) {
      return NextResponse.json({
        success: false,
        error: `Verification failed: ${verifyError.message}`,
        deploymentResults
      }, { status: 500 });
    }

    console.log('✅ Database deployment verification successful');

    return NextResponse.json({
      success: true,
      message: 'Database deployment completed successfully',
      deploymentResults,
      tablesExisted: tablesExist
    });

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function createTableViaAPI(tableName, sql) {
  // For now, we'll return a placeholder
  // In a real implementation, you might use Supabase CLI or admin API
  console.log(`Creating table ${tableName}...`);
  // This is a simplified version - in practice you'd need to use Supabase admin tools
  throw new Error('Table creation requires manual setup via Supabase dashboard');
}

export async function GET(request) {
  try {
    // Health check endpoint
    const { data: authTest, error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    
    if (authError) {
      return NextResponse.json({
        status: 'error',
        error: authError.message
      }, { status: 500 });
    }

    // Check if tables exist
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    const tablesExist = !profileError;

    return NextResponse.json({
      status: 'healthy',
      connection: 'successful',
      tablesExist,
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 500 });
  }
} 