# Mobile Breakpoint Fixes TODO

## Priority Mobile Issues

### xs/sm Breakpoints (< 640px)
- [ ] Dashboard navigation sidebar: Convert to mobile drawer/sheet
- [ ] Dashboard tables: Add horizontal scroll or card view alternative  
- [ ] Stepper component: Stack vertically on mobile
- [ ] Form inputs: Increase touch target size to 44x44px minimum
- [ ] GlassCard components: Reduce padding on mobile

### Responsive Typography
- [ ] Hero headings: Scale down from `text-5xl` to `text-3xl` on mobile
- [ ] Body text: Ensure minimum 16px to prevent zoom on iOS
- [ ] Button text: Check readability on small screens

### Layout Issues
- [ ] Fixed navigation: Ensure it doesn't cover content on mobile
- [ ] Modal/dialog: Full-screen on mobile devices
- [ ] Sidebar: Implement mobile-friendly navigation pattern
- [ ] Footer: Stack elements vertically on mobile

### Touch Interactions
- [ ] Dropdown menus: Increase tap targets
- [ ] Table rows: Make tappable with clear affordance
- [ ] Form validation: Display errors inline, not tooltips

## Testing Checklist

```bash
# Use Playwright mobile emulation
pnpm exec playwright test --project=mobile-chrome
pnpm exec playwright test --project=mobile-safari

# Manual testing devices
- iPhone 13 (iOS 17)
- Samsung Galaxy S21 (Android 12)
- iPad Pro (iPadOS 17)
```

## Quick Fixes Applied

### Utility Classes to Add
```css
/* Add to components that need mobile fixes */
className="hidden sm:block"  /* Hide on mobile */
className="sm:hidden"         /* Show only on mobile */
className="text-base sm:text-lg" /* Responsive text */
className="p-4 sm:p-6"        /* Responsive padding */
```

### Components Needing Attention
1. `src/components/layout/Sidebar.tsx` - Mobile drawer
2. `src/components/Stepper.tsx` - Vertical stack
3. `src/components/ui/GlassCard.tsx` - Reduced padding
4. `src/app/(dash)/dashboard/**/page.tsx` - Responsive tables

## Implementation Plan

**Phase 1**: Critical fixes (blocking UX)
- Navigation drawer on mobile
- Touch target sizing
- Horizontal scroll for tables

**Phase 2**: Polish
- Typography scaling
- Spacing adjustments
- Animation performance

**Phase 3**: Optimization
- Lazy load images
- Reduce bundle size for mobile
- Implement responsive images

