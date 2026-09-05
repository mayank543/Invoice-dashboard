# FreightFox — File Upload Manager

## Objective

## PROBLEM STATEMENT

Build an invoice management frontend.

## DASHBOARD

- Total invoices

- Paid invoices

- Pending amount

- Overdue invoices

## INVOICE LISTING

- Table view

- Pagination

- Sorting

- Search

- Filters:

  - Status

  - Date range

## INVOICE DETAILS

- Invoice summary

- Line items

- Download invoice button

## BONUS

- Bulk selection

- Export CSV

- Role based actions

## TESTS

- Table performance

- Form handling

- API architecture

---

# Tech Stack

- React
- TypeScript
- Tailwind CSS


No backend.

Uploads will be simulated on the client.

---

# Project Principles

## Small Components

Keep components small and focused.

Avoid large components containing UI, state management, upload logic, and utility functions together.

Each component should have one clear responsibility.

## No Large Files

Avoid files becoming unnecessarily large.

If a component starts handling multiple responsibilities, split it into smaller components/hooks/services.

## Reusable Components

Prefer reusable components instead of duplicating UI.
Prefer Online UI libraries to integrate basic need compoents like buttons, loaders etc.
Example of Ui libraries to choose from:
1. https://transitions.dev/
2. https://www.beautifului.dev/
3. https://beui.dev/
4. https://www.shadcn.io/

Examples:

- Button
- ProgressBar
- UploadItem
- StatusBadge
- Dropzone

## Separation of Concerns

Keep:

- UI → components
- Upload state → hooks
- Upload simulation → services
- Types → types
- Utility functions → utils
- Static/mock data → data

## Tailwind CSS

Use Tailwind CSS for styling.

Avoid creating unnecessary CSS files.

Use reusable Tailwind class combinations where appropriate.

## Design choices
Build interfaces that feel polished, consistent, intentional, and production-ready.

Prioritize usability and clarity over visual complexity.

The design should look like a real product, not a collection of individually styled components.
# 1. Consistency First

Maintain consistency throughout the entire application.

Keep consistent:

- Color usage

- Typography

- Spacing

- Border radius

- Shadows

- Button styles

- Input styles

- Icon styles

- Component behavior

- Hover/focus states

- Status indicators
When a design decision is made, reuse it everywhere.

# 2. Color System

Use a defined and limited color palette. NEVER USE GRADIENT AND PURPLE OR OTHER SHADE OF BLUE UNLESS ASKED FOR.

Do not choose colors independently for each component.

Define semantic colors such as:

- Primary

- Secondary

- Background

- Surface

- Border

- Text

- Muted text

- Success

- Warning

- Error

- Info



## TypeScript

Use TypeScript throughout the project.

Avoid `any` unless there is a genuine reason.

Keep shared types in dedicated files.

---

## UI Component Guidelines

- Do not manually build basic/common UI primitives from scratch when an established component is available.
- Use `shadcn/ui` for common UI components such as:
  - Buttons
  - Inputs
  - Select / Dropdown
  - Tabs
  - Dialog / Modal
  - Dropdown Menu
  - Tooltip
  - Checkbox
  - Radio Group
  - Switch
  - Slider
  - Progress
  - Skeleton / Loader
  - Table
  - Calendar / Date Picker
  - Toast / Notifications
  - Other standard UI primitives

- Prefer adding the required component through the `shadcn/ui` CLI rather than recreating it manually.
- Use other established libraries when they are more appropriate for a specific UI requirement.
- Components from `shadcn/ui` can and should be customized when necessary to match the project's design system, layout, behavior, or branding.
- Do not introduce a library for a component that is trivial and genuinely project-specific; use judgment based on complexity and reusability.
- Keep custom application-specific components separate from generic UI primitives.

### Example

Instead of creating a custom Button component from scratch:

```tsx
import { Button } from "@/components/ui/button"
npx shadcn@latest init
npx shadcn@latest add button


## State Management & Performance Guidelines

### State Management

- Keep state as local as possible. Do not use global state for data that is only required by a single component or small component tree.
- Avoid unnecessary global state and avoid creating a state-management layer unless the application actually requires it.
- Keep server/API data separate from UI state.
- Do not duplicate the same piece of state in multiple places when it can have a single source of truth.
- Prefer derived values over storing values that can be calculated from existing state.
- Keep state structures simple and predictable.
- Use React's built-in state management (`useState`, `useReducer`, Context where appropriate) for local application state unless a stronger requirement justifies another library.
- Avoid prop drilling by restructuring components or using appropriate composition/context rather than immediately introducing global state.
- Keep business logic out of presentational components where practical.

### Performance

- Avoid unnecessary re-renders.
- Keep frequently changing state close to the components that actually use it.
- Do not place rapidly changing state in a high-level/global provider unless necessary.
- Use stable keys when rendering lists.
- Avoid unnecessary calculations during every render; derive or memoize expensive computations when there is a measurable benefit.
- Avoid premature optimization. Prefer simple, readable code first and optimize actual bottlenecks.
- For large lists or tables, avoid rendering unnecessary items and use pagination or virtualization when appropriate.
- Debounce search/filter inputs when they trigger expensive operations or API requests.
- Avoid unnecessary API calls and duplicate data fetching.
- Lazy-load heavy components or features when appropriate.
- Keep component responsibilities focused so that changes in one part of the UI do not unnecessarily re-render unrelated parts.

### What to Avoid

- Do not use Redux/Zustand/etc. simply because the project has multiple components.
- Do not put all application state into a single global store.
- Do not use `useMemo` / `useCallback` everywhere without a clear reason.
- Do not store derived state unnecessarily.
- Do not duplicate API/server data into multiple independent states.
- Do not optimize for performance at the cost of unnecessarily complicated code.

### General Principle

> Keep state as local and simple as possible, minimize unnecessary rendering and data fetching, and introduce additional state-management or performance techniques only when they solve an actual problem.