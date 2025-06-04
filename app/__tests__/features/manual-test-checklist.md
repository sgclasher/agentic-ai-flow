# Manual Test Checklist for MVP

## Quick Feature Verification

Run these tests after making changes to verify everything still works:

### 1. ServiceNow Flow Visualization ✓
- [ ] Can load the home page without errors
- [ ] ServiceNow connector form displays when no data
- [ ] Can enter instance URL and scope ID
- [ ] Flow visualizer displays after connection
- [ ] Can expand/collapse nodes
- [ ] Can switch layout (LR/TB)
- [ ] Refresh button works
- [ ] Error messages display and can be dismissed

### 2. Client Profile Management ✓
- [ ] Can navigate to /profiles
- [ ] "New Profile" button opens wizard
- [ ] Can complete all 8 steps of wizard
- [ ] Profile saves and appears in list
- [ ] Can load demo data (4 industry profiles)
- [ ] Can click on profile to view details
- [ ] Profile details show all tabs
- [ ] Markdown preview works

### 3. AI Timeline Generation ✓
- [ ] Can navigate to /timeline
- [ ] Business profile modal opens if no data
- [ ] Can fill out business profile form
- [ ] Timeline generates after form submission
- [ ] Metrics widget displays and floats
- [ ] Can switch between scenarios (Conservative/Balanced/Aggressive)
- [ ] Timeline phases are expandable
- [ ] Scroll spy navigation works

### 4. Integration Points ✓
- [ ] Profile creation automatically offers timeline generation
- [ ] Timeline can be generated from existing profile
- [ ] Navigation between features works smoothly
- [ ] Data persists in localStorage

## Quick Smoke Test Command

Run this to verify basic functionality:
```bash
npm run test:features -- simple-smoke-tests.js
```

## Full Test Suite (When Needed)

For more comprehensive testing:
```bash
npm test
```

## Manual Testing Tips

1. **Use Chrome DevTools** - Check console for errors
2. **Test in Incognito** - Ensures clean localStorage
3. **Test Mobile View** - Use responsive mode
4. **Test Error States** - Enter invalid data
5. **Test Loading States** - Use network throttling

## Common Issues to Check

- [ ] No console errors on page load
- [ ] All API calls complete successfully
- [ ] UI is responsive on mobile
- [ ] Forms validate properly
- [ ] Navigation doesn't break back button
- [ ] Data persists after refresh 