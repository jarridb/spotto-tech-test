# Research: Dashboard Implementation

**Feature**: Dashboard Implementation  
**Date**: 2025-01-27  
**Phase**: Phase 0 - Research & Decision Making

## Research Questions

### 1. Shadcn/ui Card Component Usage

**Question**: Best practices for using Shadcn/ui Card component for dashboard layouts?

**Findings**:
- Shadcn/ui Card provides CardHeader, CardTitle, CardDescription, CardContent, CardFooter structure
- Cards are flexible containers that can hold any content
- Best practice: Use CardHeader for title, CardContent for main content, CardFooter for actions
- Cards can be styled with Tailwind classes for consistent spacing and borders
- Multiple cards can be arranged in a grid using CSS Grid or Flexbox

**Decision**: Use Shadcn/ui Card component as base structure. Use CardHeader for card titles, CardContent for metrics and progress bars, CardFooter for action buttons (like "View All"). Arrange cards in responsive grid layout.

**Rationale**: Shadcn/ui Card provides semantic structure and consistent styling. Flexible enough for different card content types while maintaining visual consistency.

**Alternatives Considered**:
- Custom card components: More code, less consistency
- Third-party dashboard library: Adds dependency, may conflict with Shadcn/ui styling

---

### 2. Progress Bar Component Patterns

**Question**: How to implement accessible, visually accurate progress bars?

**Findings**:
- HTML5 `<progress>` element provides semantic progress indication with built-in accessibility
- Custom div-based progress bars require ARIA attributes (role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax)
- Progress bars should show percentage both visually and textually
- Color coding (green for good, yellow for medium, red for low) improves visual understanding
- Subtle animations on load are acceptable but not required

**Decision**: Use custom div-based progress bar with proper ARIA attributes for flexibility and styling control. Display percentage text alongside visual bar. Use color coding: green (high coverage), yellow (medium), red (low).

**Rationale**: Custom progress bars provide better visual control and styling flexibility while maintaining accessibility through ARIA attributes.

**Alternatives Considered**:
- HTML5 progress element: Less styling flexibility, limited visual customization
- Third-party progress bar library: Unnecessary dependency for simple progress bars

---

### 3. Responsive Grid Layouts

**Question**: Best practices for 3-column desktop, stacked mobile layout?

**Findings**:
- CSS Grid provides clean, semantic layout for card grids
- Tailwind CSS Grid utilities (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) handle responsive breakpoints
- Flexbox can also work but Grid is more appropriate for card layouts
- Cards should have consistent heights or allow natural flow
- Gap utilities provide consistent spacing between cards

**Decision**: Use CSS Grid with Tailwind responsive utilities. Layout: 1 column on mobile, 2 columns on tablet, 3 columns on desktop. Use consistent gap spacing.

**Rationale**: CSS Grid is semantic for card layouts, Tailwind utilities provide responsive breakpoints, and consistent gaps maintain visual harmony.

**Alternatives Considered**:
- Flexbox: Works but less semantic for grid layouts
- Fixed-width cards: Doesn't adapt well to different screen sizes

---

### 4. Currency Formatting

**Question**: Locale-aware currency formatting patterns?

**Findings**:
- JavaScript Intl.NumberFormat provides locale-aware currency formatting
- Format: `new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)`
- Handles decimal places, thousand separators, currency symbols automatically
- Can be configured for different locales and currencies
- Returns formatted string ready for display

**Decision**: Use Intl.NumberFormat for all currency formatting. Default to 'en-US' locale with USD currency. Format all monthly cost values consistently.

**Rationale**: Native browser API, no dependencies, handles all formatting edge cases, supports internationalization if needed later.

**Alternatives Considered**:
- Manual formatting: Error-prone, doesn't handle edge cases
- Third-party library: Unnecessary dependency for native browser capability

---

### 5. Dashboard Data Refresh Patterns

**Question**: Query invalidation strategies for dashboard updates?

**Findings**:
- TanStack Query provides `queryClient.invalidateQueries()` for cache invalidation
- When resources are updated (tag edits), invalidate coverage query
- TanStack Query automatically refetches invalidated queries
- Can use `refetchOnWindowFocus` for automatic refresh on tab focus
- Manual refresh button provides user control

**Decision**: Use TanStack Query's query invalidation when resources are updated. Invalidate coverage query after tag updates. Optionally provide manual refresh button for user control. Use `refetchOnWindowFocus: true` for automatic refresh when user returns to tab.

**Rationale**: TanStack Query handles cache invalidation and refetching automatically. Provides good balance between automatic updates and user control.

**Alternatives Considered**:
- Polling: Unnecessary network requests, poor UX
- WebSocket: Overkill for this use case, adds complexity

---

### 6. Empty State Patterns

**Question**: Best practices for empty states in dashboard cards?

**Findings**:
- Empty states should be informative and actionable
- Use consistent empty state component pattern across all cards
- Show helpful message explaining why state is empty
- Provide action if applicable (e.g., "All resources are compliant" is informational)
- Use subtle visual treatment (lighter text, icon if appropriate)

**Decision**: Create consistent empty state pattern. Display clear message (e.g., "All resources are compliant" for non-compliant card). Use subtle styling to differentiate from active content. No action needed for informational empty states.

**Rationale**: Consistent empty states improve UX and reduce cognitive load. Clear messaging helps users understand the state.

**Alternatives Considered**:
- Hide cards when empty: Loses context, users may wonder where cards went
- Different empty state per card: Inconsistent, harder to maintain

---

## Technology Decisions Summary

| Area | Decision | Rationale |
|------|----------|-----------|
| Card Component | Shadcn/ui Card | Semantic structure, consistent styling |
| Progress Bar | Custom div with ARIA | Flexibility, accessibility, visual control |
| Grid Layout | CSS Grid with Tailwind | Semantic, responsive, consistent spacing |
| Currency Format | Intl.NumberFormat | Native API, locale-aware, no dependencies |
| Data Refresh | TanStack Query invalidation | Automatic refetching, user control option |
| Empty States | Consistent component pattern | Better UX, maintainability |

## Implementation Notes

- All decisions align with existing tech stack (React, TanStack Query, Shadcn/ui, Tailwind CSS)
- No new dependencies required
- Patterns follow existing codebase conventions from Step 2 Setup
- All decisions support accessibility and responsive design requirements

## References

- Shadcn/ui Components: Card
- MDN Web Docs: Intl.NumberFormat
- MDN Web Docs: ARIA progressbar role
- TanStack Query Documentation: Query Invalidation
- Tailwind CSS Documentation: Grid Layout

---

**Research Status**: Complete  
**All NEEDS CLARIFICATION markers resolved**: N/A (no markers in spec)  
**Ready for**: Phase 1 - Design & Contracts

