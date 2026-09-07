# 🦊 FreightFox — Enterprise Invoice Management System

A high-performance, Linear-inspired dark mode Invoice Management System built with **React 19**, **TypeScript**, and **Tailwind CSS**. Designed for operational speed, zero-latency interactions, modular component decoupling, and role-gated financial workflows.

---

## 📸 Interface & Feature Gallery

| Feature Area | Screenshot Preview |
| :--- | :--- |
| **Executive Financial Dashboard** | ![Executive Dashboard](./docs/screenshots/dashboard.png) |
| **Invoice Management Table** | ![Invoice List Table](./docs/screenshots/invoice-list.png) |
| **Multi-Faceted Filters & Date Range** | ![Filters and Date Picker](./docs/screenshots/filters.png) |
| **Invoice Details & Printable PDF** | ![Invoice Details & PDF](./docs/screenshots/invoice-details.png) |
| **Role-Based Access Control (RBAC)** | ![Role Switcher](./docs/screenshots/rbac-roles.png) |

---

## 🎯 Key Capabilities & Detailed Feature Breakdown

### 1. 📊 Executive Financial Dashboard
- **Real-Time Financial Metrics:**
  - **Total Invoices & Amount:** Aggregated monetary value and invoice count.
  - **Paid Invoices:** Total revenue collected and count of settled invoices.
  - **Pending Balance:** Outstanding receivables waiting for settlement.
  - **Overdue Invoices:** Critical past-due volume requiring billing follow-ups.
- **Recent Activity Feed:** Live list displaying recent client billings, invoice IDs, and timestamped totals.
- **Linear Design System:** Tailored dark canvas (`#010102`), border hairlines, and primary indigo accent (`#5e6ad2`).

<!-- Screenshot Area: Dashboard -->
> #### 🖼️ Dashboard Preview
> ![Executive Dashboard Screenshot](./docs/screenshots/dashboard.png)

---

### 2. 🧾 Dense Invoice Table & Interactive Rows
- **High-Density Table View:** Displays Invoice Number, Client Name, Issue Date, Status Badge, Formatted Total, and Contextual Actions.
- **Full-Row Click Navigation:** Click anywhere on an invoice row to instantly navigate to `/invoices/:id`.
- **Event-Isolated Controls:** Checkboxes, status dropdowns, and row action popovers stop event propagation to avoid accidental row navigation.
- **Status Badges:** Semantically colored status pills:
  - 🟢 **Paid:** Settled invoices.
  - 🟡 **Pending:** Awaiting client payment.
  - 🔴 **Overdue:** Past due date invoices.

<!-- Screenshot Area: Invoice Listing -->
> #### 🖼️ Invoice Table Preview
> ![Invoice List Table Screenshot](./docs/screenshots/invoice-list.png)

---

### 3. 🔍 Search, Advanced Filters & Date Range Engine
- **Instant Search:** Debounced client name and invoice number filtering across the entire dataset.
- **Date Range Picker (`react-day-picker`):**
  - **1-Click Quick Presets:** *Last 7 Days*, *Last 30 Days*, *This Month*, and *Last 90 Days* in a compact 2x2 grid.
  - **Custom Range Selection:** Interactive calendar popover allowing arbitrary start and end date boundaries.
  - **Active State Indicators & Quick Clear:** Visual indicator showing active date bounds with a 1-click `(X)` reset button.
- **Status Filter:** Filter across *All*, *Paid*, *Pending*, or *Overdue*.
- **Dedicated Sorting Menu & Header Sync:**
  - **Dedicated Sort Dropdown:** Quick-sort by *Date (Newest/Oldest)*, *Amount (High to Low / Low to High)*, *Client (A → Z / Z → A)*, *Due Date*, and *Status*.
  - **Bi-Directional Header Sync:** Clicking table headers updates the dedicated sort dropdown in real-time with visual sort arrow indicators (`ArrowUp`, `ArrowDown`, `ArrowUpDown`).

<!-- Screenshot Area: Filters & Date Picker -->
> #### 🖼️ Search & Filters Preview
> ![Filters and Date Picker Screenshot](./docs/screenshots/filters.png)

---

### 4. 📄 Smart Pagination
- **Configurable Page Density:** Switch between `10`, `20`, or `50` records per page.
- **Ellipsis Navigation:** Compact, smart page numbers (`1, 2, 3... 5`) with active indigo pill indicators.
- **Automatic Boundary Clamping:** Changing search terms, filters, or page sizes automatically resets to Page 1 to prevent empty viewport states.
- **Record Counter:** Live status counter: *"Showing X to Y of Z invoices"*.

---

### 5. 📦 Bulk Selection & Batch Operations
- **Page-Scoped Select All:** Check the table header checkbox to select/deselect all rows on the active page.
- **Context-Aware Action Buttons:**
  - **Export Selected (N):** The main export button dynamically transforms to export only selected rows when checkboxes are checked.
  - **Batch Delete (Admin Only):** Confirmation-gated mass deletion of all selected invoices.

<!-- Screenshot Area: Bulk Selection -->
> #### 🖼️ Bulk Actions Preview
> ![Bulk Selection Screenshot](./docs/screenshots/bulk-actions.png)

---

### 6. 💾 CSV & PDF Export Engine
- **Bulk CSV Export:** Exports all filtered or selected invoices with CSV-compliant quote and comma escaping.
- **Single Invoice CSV:** 1-click download from individual row menus.
- **Branded Print / PDF Document (`src/utils/invoicePdf.ts`):**
  - Generates a standalone, print-ready document formatted for standard A4 paper or Save-as-PDF.
  - Includes FreightFox branding, client billing address, line items breakdown (description, qty, rate, amount), subtotal, 10% tax calculation, and total due.

<!-- Screenshot Area: Invoice Details & PDF -->
> #### 🖼️ Invoice Details & PDF Export Preview
> ![Invoice Details Screenshot](./docs/screenshots/invoice-details.png)

---

### 7. 🛡️ Role-Based Access Control (RBAC)
The application includes a global role permissions system managed via [`src/context/RoleContext.tsx`](./src/context/RoleContext.tsx) and an interactive **Role Switcher** widget in the sidebar:

```
┌─────────────────────────────────────────────────────────────┐
│                      RBAC PERMISSION MATRIX                 │
├───────────────────┬──────────────┬──────────────┬───────────┤
│ Capability        │   🛡️ Admin   │  ⚠️ Manager  │ 👁️ Viewer │
├───────────────────┼──────────────┼──────────────┼───────────┤
│ View Dashboard    │      ✅      │      ✅      │    ✅     │
│ View Invoices     │      ✅      │      ✅      │    ✅     │
│ Export CSV / PDF  │      ✅      │      ✅      │    ✅     │
│ Edit Status       │      ✅      │      ✅      │    ❌     │
│ Single Delete     │      ✅      │      ❌      │    ❌     │
│ Bulk Batch Delete │      ✅      │      ❌      │    ❌     │
└───────────────────┴──────────────┴──────────────┴───────────┘
```

#### Role Breakdown:
1. **🛡️ Admin:** Full administrative control. Can perform single/batch invoice deletions, update invoice statuses (*Paid/Pending/Overdue*), and export data.
2. **⚠️ Manager:** Operational control. Can review invoices, update statuses, and export data. **All delete actions are hidden and disabled.**
3. **👁️ Viewer:** Read-only auditor mode. Can view financial statistics and invoices, and download CSV/PDF exports. **All mutation and deletion controls are completely disabled.**

<!-- Screenshot Area: Role Switcher -->
> #### 🖼️ Role-Based Access Switcher Preview
> ![Role-Based Access Control](./docs/screenshots/rbac-roles.png)

---

## ⚡ Performance & Architecture Highlights

```
src/
├── context/
│   └── RoleContext.tsx            # Global RBAC permissions & role switcher state
├── utils/
│   ├── exportCsv.ts               # Pure CSV string escaping & download engine
│   └── invoicePdf.ts              # Standalone printable invoice document generator
├── components/
│   ├── invoices/
│   │   ├── DateRangeFilter.tsx    # Interactive calendar popover & 1-click presets
│   │   ├── InvoicePagination.tsx  # Ellipsis navigation & rows-per-page selector
│   │   ├── InvoiceTable.tsx       # Table headers, sort arrows, and row mapping
│   │   ├── InvoiceTableRow.tsx    # React.memo isolated rows for zero-waste renders
│   │   └── InvoiceToolbar.tsx     # Search bar, date filter, sort & status dropdowns
│   ├── shared/
│   │   ├── RoleSwitcher.tsx       # Sidebar interactive role switcher
│   │   └── StatusBadge.tsx        # Semantic status badge
│   └── layout/
│       ├── Layout.tsx             # App shell with unified bg-canvas
│       └── Sidebar.tsx            # Sidebar navigation & branding
└── pages/
    ├── Dashboard.tsx              # Executive financial metrics & recent activity
    ├── InvoiceList.tsx            # Clean orchestrator (~220 lines)
    └── InvoiceDetails.tsx         # Detailed breakdown, line items & status editor
```

- **Zero-Latency In-Memory Transitions:** 0ms artificial delays for snappy, instant tab navigation.
- **Decoupled Architecture:** Decomposed from a 580+ line monolithic file into single-responsibility presentational modules.
- **Granular Row Memoization (`React.memo`):** Table rows are memoized with `useCallback` stable handlers; selecting 1 row does not trigger re-renders on the other 49 rows.
- **Thinking Orb Animation:** Orbital state loader via `thinking-orbs` during initial data load.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19 + Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Vanilla Design Tokens |
| **Icons** | Lucide React |
| **Date & Calendar** | `date-fns` + `react-day-picker` |
| **Animations / Loader** | `thinking-orbs` |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/mayank543/Invoice-dashboard.git
cd Invoice-dashboard
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates production-optimized static assets in the `dist/` folder.
