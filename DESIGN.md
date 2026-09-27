---
name: Academic Excellence Portal
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434751'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747782'
  outline-variant: '#c4c6d2'
  surface-tint: '#385ca5'
  primary: '#00265d'
  on-primary: '#ffffff'
  primary-container: '#0d3b82'
  on-primary-container: '#86a8f6'
  inverse-primary: '#afc6ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#002b45'
  on-tertiary: '#ffffff'
  tertiary-container: '#004267'
  on-tertiary-container: '#52b1f7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#afc6ff'
  on-primary-fixed: '#001944'
  on-primary-fixed-variant: '#1b448b'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is crafted for high-tier academic institutions, digital universities, and research-led educational platforms. The personality embodies institutional gravitas, forward-thinking dynamism, and scholarly trust. It balances the enduring authority of higher education with the accessibility and crisp clarity of modern digital tooling.

The aesthetic follows **Corporate / Modern** principles infused with clean architectural whitespace, crisp structural boundaries, and purposeful contrast. It delivers an intellectual, calm, and reassuring environment where prospective students, faculty, and enrolled learners can navigate admissions, degree tracks, syllabi, and administrative hubs with friction-free confidence.

## Colors

The palette is anchored by the deep institutional navy extracted directly from the collegiate emblem, paired with an energetic academic amber and an informational sky blue:

- **Primary (`#0D3B82`)**: Deep collegiate navy. Anchors high-priority headers, structural navigation panels, primary actions, and formal seals.
- **Secondary / Accent (`#F59E0B`)**: Radiant academic amber. Reserved for conversion anchors, application calls-to-action, scholarship badges, and honors accolades.
- **Tertiary (`#0284C7`)**: Clear sky azure. Used for interactive hyperlinks, active progress trackers, secondary tags, and navigational focus states.
- **Neutral & Surfaces**:
  - `neutral-900` (`#0F172A`): Deep slate navy for high-contrast primary typography and sharp iconography.
  - `neutral-600` (`#475569`): Muted slate for metadata, captions, and secondary copy.
  - `neutral-200` (`#E2E8F0`): Subtle architectural border dividers.
  - `surface-alt` (`#F8FAFC`): Base canvas and card background.
  - `surface-elevated` (`#FFFFFF`): Elevated cards, dropdowns, and modal dialogs.
- **Feedback Semantics**:
  - `success` (`#10B981`): Passing grades, successful submissions, and active enrollments.
  - `danger` (`#EF4444`): Overdue assignments, registration errors, and missed deadlines.

## Typography

The type system blends the contemporary, geometric geometry of **Plus Jakarta Sans** for titles and labels with the utilitarian, screen-optimized rhythm of **Inter** for sustained instructional reading.

Display headers utilize tight tracking and substantial weights to convey structure and academic authority. Body typography maintains open apertures and balanced leading to guarantee effortless readability across course materials, research journals, and campus directives.

## Layout & Spacing

The layout model uses a 12-column responsive fluid grid designed around an 8px base rhythm:

- **Desktop (≥ 1280px)**: 12 columns, `margin` of `2.5rem` to `3rem`, `gutter` of `1.5rem`. Max container width capped at `1280px` for optimal content density.
- **Tablet (768px – 1279px)**: 8 columns, `margin` of `2rem`, `gutter` of `1.25rem`. Complex academic program dashboards reflow to 2-column stacked modules.
- **Mobile (< 768px)**: 4 columns, `margin` of `1rem`, `gutter` of `1rem`. Linear stacked structure ensuring all application steps and degree requirements fit comfortably on single screens.

## Elevation & Depth

Visual hierarchy leverages a hybrid model of **low-contrast architectural outlines** and **diffused ambient shadows** tinted with navy blue:

- **Flat / Surface Level**: Structural dividers and unselected modules rely on a crisp 1px solid border (`#E2E8F0`) against the clean `#F8FAFC` background.
- **Level 1 (Cards, Course Tiles, Tables)**: `box-shadow: 0 1px 3px 0 rgba(13, 59, 130, 0.04), 0 1px 2px -1px rgba(13, 59, 130, 0.04);` bounded by a 1px border (`#E2E8F0`).
- **Level 2 (Active Dropdowns, Hovered Modules)**: `box-shadow: 0 10px 15px -3px rgba(13, 59, 130, 0.08), 0 4px 6px -4px rgba(13, 59, 130, 0.04);` with subtle upward vertical translation (`-2px`).
- **Level 3 (Modals, Admissions Overlay)**: `box-shadow: 0 20px 25px -5px rgba(13, 59, 130, 0.12), 0 8px 10px -6px rgba(13, 59, 130, 0.08);` paired with a backdrop scrim (`rgba(15, 23, 42, 0.45)`).

## Shapes

The design system incorporates **Rounded** corners (`0.5rem` / `8px` default). This radius provides a contemporary, friendly touch without sacrificing the professional discipline expected from an accredited university.

- **Standard Inputs, Badges, and Secondary Buttons**: `rounded` (`0.5rem`).
- **Cards, Panels, and Dialogue Windows**: `rounded-lg` (`1rem`).
- **Pill Tags and Floating Status Badges**: `rounded-full` (`9999px`) to emphasize badges such as "Accredited", "New Cohort", or "Online".

## Components

- **Buttons**:
  - *Primary (Institutional)*: Background `#0D3B82`, text `#FFFFFF`, font `label-md`. On hover: `#0A2E66`.
  - *Accent (Admissions / Apply)*: Background `#F59E0B`, text `#0F172A`, font `label-md`. High contrast for priority conversion. On hover: `#D97706`.
  - *Outline / Ghost*: Border 1.5px solid `#0D3B82`, text `#0D3B82`, background transparent.
- **Academic Badges & Chips**:
  - Compact height (`24px`-`28px`), `rounded-full`, uppercase `label-sm`.
  - Faculty tag: Soft sky background (`#E0F2FE`), text `#0284C7`.
  - Honors tag: Soft amber background (`#FEF3C7`), text `#B45309`.
- **Form Inputs & Search Fields**:
  - Height `44px`, background `#FFFFFF`, border 1px solid `#CBD5E1`.
  - Active focus: Border 2px solid `#0284C7`, subtle outer glow `0 0 0 3px rgba(2, 132, 199, 0.15)`.
- **Course & Faculty Cards**:
  - Surface `#FFFFFF`, border 1px solid `#E2E8F0`, rounded `1rem`. Padding `1.5rem`.
  - Top indicator ribbon or cap accent using primary deep navy. Smooth hover transition to Level 2 elevation.
- **Academic Progress Bars & Lists**:
  - Track background `#E2E8F0`, indicator bar `#0284C7` (or `#10B981` upon completion).
  - List items partitioned with 1px border `#F1F5F9` and interactive hover highlights in `#F8FAFC`.