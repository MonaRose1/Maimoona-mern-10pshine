# 🎨 Theme & Design Guide

## Color Palette (From Landing Page)

### Primary Colors
```
Purple (#6D5BD0) - Primary buttons, links, accents
├─ Used for: Buttons, headings, icons
├─ Hover: Slightly darker purple
└─ Gradient: Works with blue accent

Light Blue (#93C5FD) - Secondary accent
├─ Used for: Secondary elements, highlights
├─ Combines with: Purple for gradients
└─ Background: Light blue tints

Mint Green (#6EE7B7) - Success/positive actions
├─ Used for: Success states, confirmations
└─ Accent: Subtle green highlights
```

### Background Colors
```
Light Mode:
├─ Main: linear-gradient(180deg, #F3F0FF 0%, #FFFFFF 60%)
├─ Cards: rgba(255, 255, 255, 0.6) with backdrop-blur
├─ Sidebar: #FAFAFA
└─ Borders: rgba(109, 91, 208, 0.08)

Dark Mode:
├─ Main: #0F172A (dark slate)
├─ Cards: #1E293B
├─ Sidebar: #0F172A
└─ Borders: rgba(109, 91, 208, 0.2)
```

## Gradients

### Purple to Blue (Primary)
```css
background: linear-gradient(135deg, #6D5BD0, #93C5FD);
```
**Used for**: Primary buttons, CTAs, important actions

### Background Gradient (Light)
```css
background: linear-gradient(180deg, #F3F0FF 0%, #FFFFFF 60%);
```
**Used for**: Page backgrounds, full-screen containers

### Purple Glow
```css
background: radial-gradient(60% 60% at 60% 40%, rgba(147,197,253,0.5), transparent);
filter: blur(28px);
```
**Used for**: Decorative backgrounds, hero sections

## Typography

### Font Families
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
Headings: Same as primary, weight 700-800
Code: 'Courier New', monospace
```

### Font Sizes
```
Headings:
├─ H1: 2.5rem (40px) - clamp(28px, 5vw, 48px)
├─ H2: 2rem (32px) - clamp(22px, 3.4vw, 34px)
├─ H3: 1.5rem (24px)
└─ H4: 1.25rem (20px)

Body:
├─ Default: 1rem (16px)
├─ Small: 0.875rem (14px)
└─ Tiny: 0.75rem (12px)
```

## Spacing

### Padding/Margin Scale
```
Micro:    0.25rem (4px)
Small:    0.5rem (8px)
Default:  1rem (16px)
Medium:   1.5rem (24px)
Large:    2rem (32px)
XL:       3rem (48px)
XXL:      4rem (64px)
```

## Border Radius

```
Small:    0.375rem (6px)
Default:  0.5625rem (9px)
Large:    1rem (16px)
Full:     9999px (circles)
```

## Shadows

### Light Mode
```css
/* Soft shadow for cards */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Elevated shadow on hover */
box-shadow: 0 12px 30px rgba(109, 91, 208, 0.15);

/* Button shadow */
box-shadow: 0 8px 24px rgba(109, 91, 208, 0.22);
```

### Dark Mode
```css
/* Soft shadow */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);

/* Elevated shadow */
box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
```

## Animations

### Transitions
```css
/* Standard */
transition: all 0.2s ease;

/* Smooth */
transition: all 0.3s ease-in-out;

/* Transform */
transition: transform 0.15s ease, box-shadow 0.2s ease;
```

### Hover Effects
```css
/* Lift up */
transform: translateY(-2px);

/* Scale up */
transform: scale(1.01);

/* Combined */
transform: translateY(-1px) scale(1.01);
```

## Components Style Guide

### Buttons

**Primary Button**
```jsx
className="bg-gradient-to-r from-purple-600 to-blue-500 
           hover:from-purple-700 hover:to-blue-600 
           text-white font-semibold rounded-lg px-6 py-3
           shadow-lg hover:shadow-xl 
           transform hover:-translate-y-0.5 
           transition-all duration-200"
```

**Ghost Button**
```jsx
className="bg-white/60 backdrop-blur-md 
           border border-gray-200 
           hover:bg-purple-50 
           text-gray-800 rounded-lg px-4 py-2"
```

### Cards

**Standard Card**
```jsx
className="bg-white/60 backdrop-blur-md 
           border border-gray-200 
           rounded-2xl p-6 
           shadow-sm hover:shadow-lg 
           transition-all duration-200"
```

**Note Card**
```jsx
className="bg-white rounded-xl p-4 
           border border-gray-200 
           hover:shadow-md hover:border-purple-300 
           cursor-pointer transition-all"
```

### Icons

**Icon Container**
```jsx
className="rounded-full bg-gradient-to-br 
           from-purple-100 to-blue-100 
           p-8 inline-flex"
```

**Icon Color**
```jsx
className="text-purple-600"  // Primary
className="text-blue-500"     // Accent
className="text-gray-500"     // Muted
```

## Usage Examples

### Empty State
```jsx
<div className="text-center p-8">
  <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 p-8 mb-6 inline-flex">
    <FileIcon className="h-16 w-16 text-purple-600" />
  </div>
  <h3 className="text-2xl font-bold text-gray-800 mb-2">Title</h3>
  <p className="text-gray-500 max-w-sm mb-6">Description</p>
  <button className="bg-gradient-to-r from-purple-600 to-blue-500 ...">
    Action Button
  </button>
</div>
```

### Header with Gradient Text
```jsx
<h1 className="text-lg font-bold 
               bg-gradient-to-r from-purple-600 to-blue-500 
               bg-clip-text text-transparent">
  📌 Pinned Notes
</h1>
```

### Loading State
```jsx
<div className="flex items-center justify-center h-screen 
                bg-gradient-to-b from-purple-50 to-white">
  <div className="text-center">
    <div className="w-16 h-16 border-4 
                    border-purple-200 border-t-purple-600 
                    rounded-full animate-spin mb-4"></div>
    <p className="text-gray-600 font-medium">Loading...</p>
  </div>
</div>
```

## Accessibility

### Focus States
```css
focus:outline-none 
focus:ring-2 
focus:ring-purple-500 
focus:ring-offset-2
```

### Color Contrast
```
Purple (#6D5BD0) on White: AAA ✅
Purple (#6D5BD0) on Light Purple (#F3F0FF): AA ✅
White on Purple (#6D5BD0): AAA ✅
```

## Best Practices

### ✅ Do
- Use purple gradient for primary CTAs
- Apply backdrop blur for floating elements
- Add smooth hover transitions
- Use purple accent for interactive elements
- Maintain consistent border radius (1rem)

### ❌ Don't
- Mix too many gradient directions
- Use pure black (#000000)
- Skip hover states on interactive elements
- Use colors outside the palette
- Apply heavy shadows in dark mode

## Quick Reference

```css
/* Most used classes */
.gradient-bg { background: linear-gradient(180deg, #F3F0FF 0%, #FFFFFF 60%); }
.gradient-text { @apply bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent; }
.gradient-button { @apply bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600; }
.card-blur { @apply bg-white/60 backdrop-blur-md; }
.hover-lift { @apply hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200; }
```

---

**Design Philosophy**: Clean, modern, with purple as the signature color. Inspired by the landing page's gradient aesthetic and professional polish. 💜
