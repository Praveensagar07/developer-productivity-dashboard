# Developer Productivity Dashboard

[![Week 1 Task 1](https://img.shields.io/badge/Innovation%20Hacks-Week%201%20Completed-emerald?style=flat-square)](https://github.com/Praveensagar07/developer-productivity-dashboard)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev)

An enterprise-grade, responsive Developer Productivity Dashboard engineered with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Built as the official submission for **Week 1 — Task 1** of the **Innovation Hacks Full Stack Development Internship**.

---

## Overview

Modern software engineering teams require centralized visibility into their project lifecycles, sprint backlogs, engineering velocity, and team contributions. 

**DevPulse** provides a unified workspace interface designed from the ground up to reflect modern SaaS UI standards (inspired by platforms like Linear, GitHub, and Jira). Rather than a generic admin panel or tutorial template, DevPulse delivers a purpose-built developer productivity command center featuring calculated metrics, responsive multi-faceted filtering, a global Command Palette (`Ctrl+K`), Kanban sprint boards, and complete state lifecycles (loading, empty, error, and dark/light modes).

---

## Features

### 1. Unified Dashboard Command Center
- **Dynamic Key Performance Indicators (KPIs)**: Total Projects, Active Projects, Total Tasks, and Completed Tasks calculated in real-time from active dataset state.
- **Productivity & Velocity Engine**: Computes productivity score (0-100), daily task closure velocity, active streak counter, and weekly milestone pace.
- **Dynamic Project Progress Tracking**: Progress percentages and bar indicators are calculated dynamically (`completedTasks / totalTasks * 100`).
- **Priority Focus Queue**: Automatically surfaces urgent (Critical / High priority) tasks for rapid execution.
- **Recent Activity Feed**: Timeline preview of team events, status transitions, and commits.

### 2. Multi-Faceted Project & Backlog Management
- **Projects Portfolio**: Filter by status (*Active, Planning, Completed, On Hold*), priority (*Critical, High, Medium, Low*), or search by name, tags, and leads.
- **Sprint Backlog**: Multi-criteria AND-predicate filtering by search query, status, priority, and project assignment with instant counter tags.
- **Dual Backlog Views**: Toggle smoothly between **List/Table View** and interactive **Kanban Board View** with dedicated status columns.
- **Task Details Modal**: Click any task to inspect full metadata, time estimates, tags, assignee info, and an interactive checklist of subtasks with real-time subtask completion progress.
- **In-Memory CRUD Operations**: Add new tasks, initialize new projects, toggle subtasks, update priorities, or delete tasks with immediate UI reactivity.

### 3. Global Command Palette & Navigation
- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Rapid fuzzy search across all projects, tasks, tags, and direct page routing.
- **Accessible Sidebar**: Desktop fixed navigation with collapsible mobile drawer, route badges, and quick user productivity stats.
- **Quick Notification Drawer**: Bell indicator previewing recent repository actions with mark-as-read controls.

### 4. Comprehensive State Handling
- **Loading States**: Custom skeleton loaders (`DashboardSkeleton`, `ProjectSkeleton`, `TaskSkeleton`) mimicking layout structure with smooth pulse animations.
- **Empty States**: Context-aware empty state illustrations and guidance for empty searches, empty backlogs, and filtered out views.
- **Error States**: Production-grade `ErrorState` with detailed messaging, retry hooks, and alert notifications.
- **State Evaluation Tools**: Interactive controls in the top header and Settings page to simulate 2.5-second loading skeletons or upstream API failures on demand.

### 5. Theming & Polish
- **Dark Mode / Light Mode / System Theme**: Instant theme switching with `localStorage` persistence and automatic system preference detection.
- **Toast Notifications**: Non-blocking accessible toast notifications for state changes, additions, and updates.

---

## Tech Stack

| Technology | Purpose | Justification |
| :--- | :--- | :--- |
| **React 18** | UI Framework | Component-based, performant, enterprise standard |
| **TypeScript (Strict)** | Language | Complete type safety across entities, props, and filters |
| **Vite 6** | Build Tool & Dev Server | Sub-second HMR and optimized Rollup production bundling |
| **Tailwind CSS 3** | Styling & Theme System | Utility-first, class-based dark mode, zero runtime CSS overhead |
| **React Router DOM 6** | Client-side Routing | Accessible declarative routing with layout nesting |
| **Lucide React** | Iconography | Clean, consistent, and tree-shakeable modern developer icons |

---

## Project Structure

```text
developer-productivity-dashboard/
├── public/                     # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── layout/            # AppLayout, Header, Sidebar
│   │   ├── projects/          # ProjectCard, NewProjectModal
│   │   ├── tasks/             # TaskCard, TaskRow, TaskBoard, TaskDetailModal, NewTaskModal
│   │   ├── states/            # EmptyState, ErrorState, LoadingSkeletons
│   │   └── ui/                # Badge, Button, Modal, ProgressBar, CommandPalette
│   ├── context/
│   │   ├── ThemeContext.tsx   # Light/dark/system theme state
│   │   ├── DataContext.tsx    # Reactive store for projects, tasks, user, activities
│   │   └── ToastContext.tsx   # Global toast alert notifications
│   ├── data/
│   │   └── mockData.ts        # Typed realistic mock dataset (5 projects, 18+ tasks)
│   ├── hooks/
│   │   ├── useFilters.ts      # Multi-criteria filter management
│   │   ├── useSearch.ts       # Fuzzy search query hook
│   │   └── useKeyboardShortcut.ts # Global Ctrl+K & Escape shortcuts
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main landing view with dynamic KPIs
│   │   ├── Projects.tsx       # Projects catalog & filters
│   │   ├── Tasks.tsx          # Task list & Kanban board
│   │   ├── Activity.tsx       # Audit log & timeline
│   │   └── Settings.tsx       # Profile, appearance & simulation controls
│   ├── types/
│   │   └── index.ts           # Strict TypeScript interfaces & types
│   ├── utils/
│   │   ├── calculations.ts    # KPI & dynamic percentage algorithms
│   │   ├── filters.ts         # Multi-criteria filter predicates
│   │   └── date.ts            # Date formatting & relative time
│   ├── App.tsx                # Route configuration & providers
│   ├── index.css              # Tailwind directives & CSS custom variables
│   └── main.tsx               # DOM hydration root
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on `v24.20.0`)
- **npm**: `v9.0.0` or higher (tested on `11.19.0`)

### Installation & Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Praveensagar07/developer-productivity-dashboard.git
   cd developer-productivity-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## Production Build

To test and compile the production bundle:

```bash
npm run build
```

This invokes TypeScript strict checks (`tsc -b`) followed by Vite optimization (`vite build`).

To preview the production build locally:

```bash
npm run preview
```

---

## Responsive Design

The application is thoroughly optimized and tested across all viewport breakpoints:

- **Mobile (320px - 430px)**: Collapsible slide-over drawer navigation, compact headers, single-column KPI and project card layouts, and touch-friendly controls.
- **Tablet (768px - 1024px)**: Responsive 2-column KPI grids, flexible split views, and scrollable data tables with sticky headers.
- **Desktop (1280px - 1440px+)**: Multi-column dashboard layout, persistent sidebar navigation, full Command Palette, and 3-column Kanban boards.

Horizontal overflow is strictly prevented with responsive wrapping and fluid grid constraints.

---

## State Handling

- **Loading State**: Demonstrated via `DashboardSkeleton`, `ProjectSkeleton`, and `TaskSkeleton`. Evaluators can trigger an active 2.5-second loading skeleton at any time using the "Demo States" dropdown in the header or the button in Settings.
- **Empty State**: Reusable `EmptyState` component with clear messaging and action buttons (e.g. "Clear Filters", "Initialize Project") for empty searches, missing tasks, or unpopulated project filters.
- **Error State**: Dedicated `ErrorState` component with error iconography, explanation, and an interactive "Retry Connection" action. Can be simulated from the Demo States menu.

---

## Accessibility (A11y)

- **Semantic Landmarks**: Semantic `<header>`, `<aside>`, `<nav>`, `<main>`, `<section>`, and `<footer>` elements.
- **Keyboard Navigation**: Full keyboard tab order, `Escape` key listeners for modals and drawers, and `Ctrl+K` for search.
- **ARIA Attributes**: `role="dialog"`, `aria-modal="true"`, `aria-valuenow`, `aria-valuemin`, and `aria-label` tags across buttons, progress bars, and modals.
- **Color Contrast**: Compliant with WCAG 2.1 AA standards for high text contrast in both light and dark modes. Status is never conveyed by color alone (always accompanied by text badges and distinctive icons).

---

## Future Integration (Weeks 2 & 3 Architecture)

The application architecture cleanly isolates:
- **Type contracts** (`src/types/index.ts`)
- **Data queries and mutations** (`src/context/DataContext.tsx`)
- **Business calculations & filters** (`src/utils/`)

In Week 2 (Backend Services) and Week 3 (Database Integration), `DataContext` can seamlessly swap mock data with REST or GraphQL API clients (e.g., Axios or TanStack Query) without modifying the presentation components.

---

## Internship Details

- **Program**: Innovation Hacks — Full Stack Development Internship
- **Stage**: Week 1 — Task 1
- **Project**: Modern Frontend Development — Developer Productivity Dashboard
- **Author**: Praveen Sagar
- **Repository**: [https://github.com/Praveensagar07/developer-productivity-dashboard](https://github.com/Praveensagar07/developer-productivity-dashboard)
