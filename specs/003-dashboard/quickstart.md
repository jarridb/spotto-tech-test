# Quickstart: Dashboard Implementation

**Feature**: Dashboard Implementation  
**Date**: 2025-01-27  
**Phase**: Phase 1 - Design & Contracts

## Prerequisites

Before starting implementation, ensure:

- ✅ Step 1: Hello world setup complete
- ✅ Step 2: Resources list feature implemented
- ✅ Backend coverage endpoint exists (needs update for non-compliant resources)
- ✅ Frontend API client and TanStack Query hooks are configured
- ✅ Development servers can start (`npm run dev`)

## Implementation Order

### Phase 1: Backend Update

**Goal**: Update coverage endpoint to include non-compliant resources list

1. **Update Coverage Service**
   ```bash
   # Update coverage-service.ts to calculate non-compliant resources
   ```

2. **Update Coverage Endpoint**
   ```bash
   # Update coverage.ts route to include nonCompliantResources in response
   ```

3. **Test Updated Endpoint**
   ```bash
   # Test coverage endpoint returns nonCompliantResources array
   curl http://localhost:3001/api/coverage
   ```

### Phase 2: Frontend Foundation

**Goal**: Set up dashboard feature structure and API integration

1. **Create Feature Directory Structure**
   ```bash
   mkdir -p frontend/src/features/dashboard/components
   ```

2. **Create Coverage Service**
   - Create `getCoverage` API function in `frontend/src/services/coverage/api.ts`
   - Create `useCoverage` query hook in `frontend/src/services/coverage/queries.ts`

3. **Test API Integration**
   - Verify coverage data can be fetched
   - Verify TypeScript types are correct

### Phase 3: Dashboard Container

**Goal**: Create main dashboard component with responsive layout

1. **Create Dashboard Component**
   - Create `dashboard.tsx` component
   - Implement responsive grid layout (3 columns desktop, stacked mobile)
   - Integrate useCoverage hook
   - Handle loading and error states

2. **Wire Up Route**
   - Update `index.tsx` route to use dashboard component
   - Test navigation to dashboard

### Phase 4: Overview Card

**Goal**: Display overall compliance and cost coverage

1. **Create Overview Card Component**
   - Create `overview-card.tsx` component
   - Display overall compliance: "X/Y resources (Z%)"
   - Display cost coverage: "$X.XX / $Y.YY (Z%)"
   - Implement progress bars for both metrics

2. **Integrate with Dashboard**
   - Add OverviewCard to dashboard layout
   - Pass coverage data as props
   - Test display of metrics

### Phase 5: Tag Coverage Card

**Goal**: Display per-tag coverage percentages

1. **Create Tag Coverage Card Component**
   - Create `tag-coverage-card.tsx` component
   - Display all three required tags (Environment, Owner, BusinessUnit)
   - Display coverage for each tag: "X/Y (Z%)"
   - Implement progress bars for each tag

2. **Implement Tag Ordering**
   - Order tags by coverage percentage (lowest first)
   - Handle alphabetical ordering if percentages are equal

3. **Integrate with Dashboard**
   - Add TagCoverageCard to dashboard layout
   - Pass perTagCoverage data as props
   - Test display of tag coverage

### Phase 6: Non-Compliant Resources Card

**Goal**: Display top non-compliant resources by cost

1. **Create Non-Compliant Card Component**
   - Create `non-compliant-card.tsx` component
   - Display list of non-compliant resources
   - Display resource ID, cost (formatted), and status indicator
   - Implement "View All Non-Compliant Resources" button

2. **Implement Navigation**
   - Wire up "View All" button to navigate to resources list
   - Apply compliant filter when navigating
   - Test navigation works correctly

3. **Handle Empty State**
   - Display empty state when all resources are compliant
   - Show appropriate message

4. **Integrate with Dashboard**
   - Add NonCompliantCard to dashboard layout
   - Pass nonCompliantResources array as props
   - Test display of resources

### Phase 7: Progress Bar Component

**Goal**: Create reusable progress bar component

1. **Create Progress Bar Component**
   - Create `progress-bar.tsx` component
   - Implement visual progress bar (div-based)
   - Add ARIA attributes for accessibility
   - Support color variants (green/yellow/red)

2. **Implement Percentage Display**
   - Display percentage text alongside bar
   - Format percentage correctly (1 decimal place)

3. **Integrate with Cards**
   - Use ProgressBar in OverviewCard
   - Use ProgressBar in TagCoverageCard
   - Test all progress bars display correctly

### Phase 8: Integration & Polish

**Goal**: Final integration and polish

1. **Wire Up Route**
   - Ensure dashboard is accessible at `/` or `/dashboard`
   - Test navigation from sidebar

2. **Handle Loading States**
   - Show loading skeletons for each card
   - Test loading states display correctly

3. **Handle Error States**
   - Display error messages with retry option
   - Test error handling

4. **Test Responsive Design**
   - Test on desktop (3 columns)
   - Test on tablet (2 columns)
   - Test on mobile (stacked)

5. **Test Data Refresh**
   - Update a resource's tags
   - Verify dashboard refreshes automatically
   - Test manual refresh if implemented

## Testing Checklist

### Unit Tests
- [ ] Coverage service calculation logic
- [ ] Progress bar percentage calculations
- [ ] Currency formatting utilities
- [ ] Tag ordering logic

### Component Tests
- [ ] Dashboard container rendering
- [ ] Overview card rendering
- [ ] Tag coverage card rendering
- [ ] Non-compliant card rendering
- [ ] Progress bar rendering
- [ ] Empty state display

### E2E Tests
- [ ] Dashboard loads and displays all metrics
- [ ] Navigation to filtered resources list
- [ ] Error handling scenarios
- [ ] Responsive layout behavior
- [ ] Data refresh after resource update

## Common Issues & Solutions

### Issue: Coverage endpoint doesn't include nonCompliantResources
**Solution**: Update backend coverage service to calculate and return non-compliant resources array.

### Issue: Progress bars not displaying correctly
**Solution**: Ensure progress bar width is set correctly based on percentage value, check CSS styling.

### Issue: Currency formatting shows incorrect format
**Solution**: Use Intl.NumberFormat with correct locale and currency settings.

### Issue: Dashboard doesn't refresh after tag update
**Solution**: Ensure coverage query is invalidated when resources are updated. Check TanStack Query invalidation logic.

### Issue: Navigation to filtered resources doesn't work
**Solution**: Verify resources list supports compliant filter parameter. Check route navigation logic.

## Next Steps

After completing implementation:

1. Run all tests (unit, component, E2E)
2. Verify all 20 functional requirements are met
3. Verify all 3 user stories pass acceptance scenarios
4. Verify all 10 success criteria are met
5. Code review
6. Merge backend and frontend commits separately

---

**Quickstart Status**: Complete  
**Ready for**: Implementation

