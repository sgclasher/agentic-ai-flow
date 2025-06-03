-- Agentic AI Flow Visualizer Database Schema
-- Complete schema supporting modular, AI-native architecture
-- Includes Row Level Security (RLS) for multi-tenant security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Profiles table - Core client digital twins
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  data JSONB NOT NULL, -- Flexible schema for evolving requirements
  markdown TEXT, -- AI-compatible format for anti-hallucination
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Profile versions table - Audit trail & versioning
CREATE TABLE profile_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  changes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Timelines table - Generated AI timelines
CREATE TABLE timelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scenario_type TEXT NOT NULL CHECK (scenario_type IN ('conservative', 'balanced', 'aggressive')),
  data JSONB NOT NULL,
  generated_by TEXT, -- AI provider used
  cost_usd DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- AI conversations table - LLM interaction history and cost tracking
CREATE TABLE ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  conversation_type TEXT, -- 'timeline_generation', 'insights', 'recommendations'
  input_data JSONB,
  output_data JSONB,
  tokens_used INTEGER,
  cost_usd DECIMAL(10,4),
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations table - Vendor-agnostic connections
CREATE TABLE integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL, -- 'servicenow', 'salesforce', 'otter_ai', etc.
  vendor TEXT NOT NULL,
  config JSONB NOT NULL, -- Encrypted configuration
  credentials_id UUID, -- Reference to Supabase Vault
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table - PDFs, meeting notes, exports
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'pdf', 'meeting_notes', 'export'
  file_path TEXT, -- Supabase Storage path
  metadata JSONB,
  source_integration UUID REFERENCES integrations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Features table - Modular feature flags
CREATE TABLE features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User features table - User-specific feature flags
CREATE TABLE user_features (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  config JSONB,
  PRIMARY KEY (user_id, feature_id)
);

-- Audit logs table - Comprehensive activity tracking
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profile indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_company_name ON profiles(company_name);
CREATE INDEX idx_profiles_industry ON profiles(industry);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_updated_at ON profiles(updated_at);

-- Profile versions indexes
CREATE INDEX idx_profile_versions_profile_id ON profile_versions(profile_id);
CREATE INDEX idx_profile_versions_created_at ON profile_versions(created_at);

-- Timeline indexes
CREATE INDEX idx_timelines_profile_id ON timelines(profile_id);
CREATE INDEX idx_timelines_created_at ON timelines(created_at);
CREATE INDEX idx_timelines_scenario_type ON timelines(scenario_type);

-- AI conversation indexes
CREATE INDEX idx_ai_conversations_profile_id ON ai_conversations(profile_id);
CREATE INDEX idx_ai_conversations_provider ON ai_conversations(provider);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at);

-- Integration indexes
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_integrations_type ON integrations(integration_type);
CREATE INDEX idx_integrations_status ON integrations(status);

-- Document indexes
CREATE INDEX idx_documents_profile_id ON documents(profile_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- Audit log indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);

-- Full-text search indexes
CREATE INDEX idx_profiles_company_name_trgm ON profiles USING gin(company_name gin_trgm_ops);
CREATE INDEX idx_profiles_data_gin ON profiles USING gin(data);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profiles" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Profile versions RLS policies  
CREATE POLICY "Users can view versions of their profiles" ON profile_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_versions.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert versions of their profiles" ON profile_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_versions.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Timelines RLS policies
CREATE POLICY "Users can view timelines of their profiles" ON timelines
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = timelines.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert timelines for their profiles" ON timelines
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = timelines.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- AI conversations RLS policies
CREATE POLICY "Users can view AI conversations for their profiles" ON ai_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = ai_conversations.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert AI conversations for their profiles" ON ai_conversations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = ai_conversations.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Integrations RLS policies
CREATE POLICY "Users can manage their own integrations" ON integrations
  FOR ALL USING (auth.uid() = user_id);

-- Documents RLS policies
CREATE POLICY "Users can view documents for their profiles" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = documents.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents for their profiles" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = documents.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- User features RLS policies
CREATE POLICY "Users can manage their own feature settings" ON user_features
  FOR ALL USING (auth.uid() = user_id);

-- Audit logs RLS policies
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log for authenticated users
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      old_data,
      new_data
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit triggers for key tables
CREATE TRIGGER profiles_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER timelines_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON timelines
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default features
INSERT INTO features (feature_name, description, enabled, config) VALUES
  ('ai_timeline_generation', 'AI-powered timeline generation', true, '{}'),
  ('real_time_collaboration', 'Real-time profile editing and collaboration', true, '{}'),
  ('advanced_analytics', 'Advanced analytics and insights', true, '{}'),
  ('pdf_export', 'PDF export functionality', true, '{}'),
  ('meeting_notes_import', 'Import meeting notes from external services', false, '{}'),
  ('multi_llm_providers', 'Support for multiple LLM providers', true, '{}'),
  ('servicenow_integration', 'ServiceNow flow visualization', true, '{}'),
  ('audit_logging', 'Comprehensive audit logging', true, '{}');

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for profile summary with latest timeline
CREATE VIEW profile_summary AS
SELECT 
  p.id,
  p.user_id,
  p.company_name,
  p.industry,
  p.size,
  p.status,
  p.updated_at,
  (
    SELECT COUNT(*) 
    FROM timelines t 
    WHERE t.profile_id = p.id
  ) as timeline_count,
  (
    SELECT SUM(cost_usd) 
    FROM ai_conversations ac 
    WHERE ac.profile_id = p.id
  ) as total_ai_cost
FROM profiles p
WHERE p.status != 'deleted';

-- View for AI usage statistics
CREATE VIEW ai_usage_stats AS
SELECT 
  user_id,
  provider,
  COUNT(*) as conversation_count,
  SUM(tokens_used) as total_tokens,
  SUM(cost_usd) as total_cost,
  AVG(duration_ms) as avg_duration_ms,
  DATE_TRUNC('day', created_at) as usage_date
FROM ai_conversations ac
JOIN profiles p ON ac.profile_id = p.id
GROUP BY user_id, provider, DATE_TRUNC('day', created_at);

-- ============================================================================
-- SECURITY FUNCTIONS
-- ============================================================================

-- Function to check if user owns a profile
CREATE OR REPLACE FUNCTION user_owns_profile(profile_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = profile_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's AI cost for the current month
CREATE OR REPLACE FUNCTION get_monthly_ai_cost(user_id UUID DEFAULT auth.uid())
RETURNS DECIMAL AS $$
BEGIN
  RETURN COALESCE(
    (
      SELECT SUM(ac.cost_usd)
      FROM ai_conversations ac
      JOIN profiles p ON ac.profile_id = p.id
      WHERE p.user_id = user_id
      AND DATE_TRUNC('month', ac.created_at) = DATE_TRUNC('month', NOW())
    ),
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENT DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE profiles IS 'Core client digital twin profiles with flexible JSONB data structure';
COMMENT ON TABLE profile_versions IS 'Version history for profiles, enabling audit trails and rollback';
COMMENT ON TABLE timelines IS 'AI-generated transformation timelines for client profiles';
COMMENT ON TABLE ai_conversations IS 'Log of all AI interactions with cost and token tracking';
COMMENT ON TABLE integrations IS 'Vendor-agnostic integration configurations';
COMMENT ON TABLE documents IS 'File storage references for PDFs, meeting notes, and exports';
COMMENT ON TABLE features IS 'Global feature flag configuration';
COMMENT ON TABLE user_features IS 'User-specific feature flag overrides';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for compliance and debugging';

COMMENT ON COLUMN profiles.data IS 'Flexible JSONB storage for evolving profile schema requirements';
COMMENT ON COLUMN profiles.markdown IS 'Structured markdown format for AI processing and anti-hallucination';
COMMENT ON COLUMN ai_conversations.tokens_used IS 'Token count for cost tracking and optimization';
COMMENT ON COLUMN ai_conversations.cost_usd IS 'USD cost for this conversation, enables budget management';

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated; 