# SpendWise — Personal Budget & Expense Manager

SpendWise is an interactive personal budgeting web application built with HTML, CSS, and vanilla JavaScript. Users can navigate between dedicated views for Overview, Monthly Budget, Add Expense, and Expense History, track spending across categories, and receive real-time budget feedback.

## Improvements Made to SpendWise This Week
- Built an interactive left-sidebar navigation system that switches between dedicated spaces (**Overview**, **Monthly Budget**, **Add Expense**, and **Expense History**) rather than displaying all sections at once.
- Replaced console/prompt workflows with live forms, status badges, a progress meter, and a right-hand category breakdown panel.
- Added expense management features including category filtering, individual item removal, and a **Clear All** button.

## How Conditionals Are Used in the Project
- **Form Validation:** `if` statements ensure budget and expense amounts are positive numbers (`> 0`) and expense names are non-empty before updating state.
- **Budget Status Evaluation (`evaluateBudget`):** `if / else if / else` statements check `monthlyBudget`, `remaining` balance, and spending percentage to set the status pill, progress meter width/color, and feedback banner.
- **View Switching, Balance Styling & Empty States:** Conditionals match active view IDs, color-code remaining balances, and toggle empty-state messages when no matching expenses exist.

## How Arrays Are Used to Store Data
- All expense entries are stored in an `expenses` array (`let expenses = []`) as objects (`{ id, title, amount, category }`), and a `categories` array stores the expense categories.
- `for` loops iterate through these arrays to:
  - Sum total expenses in `calculateTotalSpent()`.
  - Calculate totals per category in `calculateCategoryTotal()` and `renderCategoryBreakdown()`.
  - Filter expenses and generate list items in `renderExpenseList()`.
  - Remove a specific item by `id` when **Remove** is clicked.

## How the DOM Is Updated
- `switchView()` toggles `.active` classes on `.view-section` panels and `.nav-btn` links and updates `#view-title`.
- `updateDashboard()` updates `.textContent` on `#budget-display`, `#spent-display`, `#remaining-display`, and `#budget-feedback`, and updates text colors.
- `evaluateBudget()` updates `#usage-badge`, `#meter-fill`, `#budget-pill`, and `#feedback-banner`.
- `renderCategoryBreakdown()` and `renderExpenseList()` clear list containers, create `<li>` elements via `document.createElement("li")`, and append them dynamically.

## How User Interactions Are Handled Through Events
- **`click` on `.nav-btn` and `[data-jump]` buttons:** Switches the active view section and updates the top header title.
- **`submit` on `#budget-form`:** Prevents page reload (`event.preventDefault()`), saves `monthlyBudget`, and updates the dashboard.
- **`submit` on `#expense-form`:** Adds a new expense object to `expenses`, resets the form, and refreshes totals, category breakdowns, and history.
- **`click` on `#expense-list`:** Uses event delegation on `.remove-btn` to read `data-id`, remove the item, and recalculate totals.
- **`change` on `#category-filter`:** Re-renders the filtered expense history immediately.
- **`click` on `#clear-all-btn`:** Clears the `expenses` array and refreshes the UI.

## Challenges Encountered and How They Were Resolved
- **Separating Views Without Losing Shared Data:** Keeping `monthlyBudget` and `expenses` in global state variables while toggling `.view-section.active` in CSS/JS allowed each tab to have its own dedicated space while keeping totals and category breakdowns synchronized.
- **Preventing Page Reloads & Handling Dynamic Buttons:** Calling `event.preventDefault()` on form submissions prevented data loss on submit, and event delegation on `#expense-list` ensured **Remove** buttons work on dynamically rendered items.