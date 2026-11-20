// ==========================================
// 1. STATE & ARRAYS
// ==========================================
let monthlyBudget = 0;
let expenses = []; // Array of objects: { id, title, amount, category }
const categories = ["Food", "Housing", "Transport", "Utilities", "Lifestyle"];

const viewTitles = {
    "view-overview": "Budget Overview",
    "view-budget": "Monthly Budget",
    "view-expense": "Add Expense",
    "view-history": "Expense History"
};

// ==========================================
// 2. DOM ELEMENT SELECTIONS
// ==========================================
const viewTitleEl = document.getElementById("view-title");
const viewSections = document.querySelectorAll(".view-section");
const navButtons = document.querySelectorAll(".nav-btn");
const jumpButtons = document.querySelectorAll("[data-jump]");

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const budgetFeedback = document.getElementById("budget-feedback");

const expenseForm = document.getElementById("expense-form");
const expenseTitleInput = document.getElementById("expense-title");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategoryInput = document.getElementById("expense-category");
const expenseFeedback = document.getElementById("expense-feedback");

const budgetDisplay = document.getElementById("budget-display");
const spentDisplay = document.getElementById("spent-display");
const remainingDisplay = document.getElementById("remaining-display");
const usageBadge = document.getElementById("usage-badge");
const budgetPill = document.getElementById("budget-pill");
const meterFill = document.getElementById("meter-fill");
const feedbackBanner = document.getElementById("feedback-banner");

const expenseCount = document.getElementById("expense-count");
const categoryFilter = document.getElementById("category-filter");
const clearAllBtn = document.getElementById("clear-all-btn");
const expenseList = document.getElementById("expense-list");
const emptyMessage = document.getElementById("empty-message");
const categoryBreakdown = document.getElementById("category-breakdown");

// ==========================================
// 3. VIEW SWITCHING (DEDICATED SECTIONS)
// ==========================================
function switchView(viewId) {
    for (let i = 0; i < viewSections.length; i++) {
        viewSections[i].classList.remove("active");
        if (viewSections[i].id === viewId) {
            viewSections[i].classList.add("active");
        }
    }

    for (let i = 0; i < navButtons.length; i++) {
        navButtons[i].classList.remove("active");
        if (navButtons[i].getAttribute("data-view") === viewId) {
            navButtons[i].classList.add("active");
        }
    }

    if (viewTitles[viewId]) {
        viewTitleEl.textContent = viewTitles[viewId];
    }
}

// ==========================================
// 4. CALCULATIONS WITH LOOPS
// ==========================================
function calculateTotalSpent() {
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }
    return total;
}

function calculateCategoryTotal(categoryName) {
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].category === categoryName) {
            total += expenses[i].amount;
        }
    }
    return total;
}

// ==========================================
// 5. DECISION MAKING WITH CONDITIONALS
// ==========================================
function evaluateBudget(budget, spent, remaining) {
    feedbackBanner.className = "feedback";
    budgetPill.className = "pill";

    if (budget <= 0) {
        usageBadge.textContent = "0% spent";
        meterFill.style.width = "0%";
        meterFill.style.backgroundColor = "#0b8a84";
        budgetPill.classList.add("pill-neutral");
        budgetPill.textContent = "No Budget Set";
        feedbackBanner.classList.add("feedback-neutral");
        feedbackBanner.textContent = "Enter your monthly budget to start tracking your expenses.";
        return;
    }

    const percentSpent = (spent / budget) * 100;
    const barWidth = Math.min(percentSpent, 100);

    usageBadge.textContent = `${percentSpent.toFixed(0)}% spent`;
    meterFill.style.width = `${barWidth}%`;

    if (remaining < 0) {
        meterFill.style.backgroundColor = "#c0392b";
        budgetPill.classList.add("pill-danger");
        budgetPill.textContent = "Over Budget";
        feedbackBanner.classList.add("feedback-danger");
        feedbackBanner.textContent = `Budget Exceeded: You are $${Math.abs(remaining).toFixed(2)} over your monthly budget.`;
    } else if (remaining === 0) {
        meterFill.style.backgroundColor = "#d4ac0d";
        budgetPill.classList.add("pill-warning");
        budgetPill.textContent = "Limit Reached";
        feedbackBanner.classList.add("feedback-warning");
        feedbackBanner.textContent = "Budget Fully Used: You have $0.00 remaining.";
    } else if (percentSpent >= 80) {
        meterFill.style.backgroundColor = "#d4ac0d";
        budgetPill.classList.add("pill-warning");
        budgetPill.textContent = "Near Limit";
        feedbackBanner.classList.add("feedback-warning");
        feedbackBanner.textContent = `Heads Up: ${percentSpent.toFixed(0)}% of your budget used ($${remaining.toFixed(2)} left).`;
    } else {
        meterFill.style.backgroundColor = "#0b8a84";
        budgetPill.classList.add("pill-healthy");
        budgetPill.textContent = "On Track";
        feedbackBanner.classList.add("feedback-healthy");
        feedbackBanner.textContent = `Budget Healthy: $${remaining.toFixed(2)} remaining (${percentSpent.toFixed(0)}% used).`;
    }
}

// ==========================================
// 6. DOM MANIPULATION & RENDERING
// ==========================================
function renderCategoryBreakdown() {
    categoryBreakdown.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        const catTotal = calculateCategoryTotal(cat);

        const li = document.createElement("li");
        li.className = "breakdown-row";
        li.innerHTML = `
            <span>${cat}</span>
            <strong>$${catTotal.toFixed(2)}</strong>
        `;
        categoryBreakdown.appendChild(li);
    }
}

function renderExpenseList() {
    const selectedCategory = categoryFilter.value;
    expenseList.innerHTML = "";

    const matchingExpenses = [];
    for (let i = 0; i < expenses.length; i++) {
        if (selectedCategory === "All" || expenses[i].category === selectedCategory) {
            matchingExpenses.push(expenses[i]);
        }
    }

    expenseCount.textContent = `${matchingExpenses.length} ${matchingExpenses.length === 1 ? "recorded expense" : "recorded expenses"}`;

    if (matchingExpenses.length === 0) {
        emptyMessage.style.display = "block";
        emptyMessage.textContent = expenses.length === 0
            ? "No expenses added yet."
            : `No expenses found in "${selectedCategory}".`;
        return;
    }

    emptyMessage.style.display = "none";

    for (let i = 0; i < matchingExpenses.length; i++) {
        const item = matchingExpenses[i];
        const li = document.createElement("li");
        li.className = "expense-item";

        li.innerHTML = `
            <div class="expense-details">
                <strong>${item.title}</strong>
                <span class="expense-tag">${item.category}</span>
            </div>
            <div class="expense-actions">
                <strong>$${item.amount.toFixed(2)}</strong>
                <button type="button" class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;

        expenseList.appendChild(li);
    }
}

function updateDashboard() {
    const totalSpent = calculateTotalSpent();
    const remaining = monthlyBudget - totalSpent;

    budgetDisplay.textContent = `$${monthlyBudget.toFixed(2)}`;
    spentDisplay.textContent = `$${totalSpent.toFixed(2)}`;
    remainingDisplay.textContent = `$${remaining.toFixed(2)}`;
    budgetFeedback.textContent = `Current saved budget: $${monthlyBudget.toFixed(2)}`;

    if (remaining < 0) {
        remainingDisplay.style.color = "#c0392b";
    } else if (remaining === 0 && monthlyBudget > 0) {
        remainingDisplay.style.color = "#8a6d0b";
    } else if (monthlyBudget > 0) {
        remainingDisplay.style.color = "#076964";
    } else {
        remainingDisplay.style.color = "#1f2937";
    }

    evaluateBudget(monthlyBudget, totalSpent, remaining);
    renderCategoryBreakdown();
    renderExpenseList();
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================
for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function () {
        const targetView = this.getAttribute("data-view");
        switchView(targetView);
    });
}

for (let i = 0; i < jumpButtons.length; i++) {
    jumpButtons[i].addEventListener("click", function () {
        const targetView = this.getAttribute("data-jump");
        switchView(targetView);
    });
}

budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const newBudget = parseFloat(budgetInput.value);

    if (isNaN(newBudget) || newBudget <= 0) {
        alert("Please enter a valid monthly budget greater than 0.");
        return;
    }

    monthlyBudget = newBudget;
    budgetInput.value = "";
    updateDashboard();
    budgetFeedback.textContent = `Budget updated to $${monthlyBudget.toFixed(2)}.`;
});

expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = expenseTitleInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;

    if (title === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense name and positive amount.");
        return;
    }

    expenses.push({
        id: Date.now(),
        title: title,
        amount: amount,
        category: category
    });

    expenseForm.reset();
    updateDashboard();
    expenseFeedback.textContent = `Added "${title}" ($${amount.toFixed(2)}) under ${category}.`;
});

expenseList.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const targetId = Number(event.target.getAttribute("data-id"));
        const keptExpenses = [];

        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].id !== targetId) {
                keptExpenses.push(expenses[i]);
            }
        }

        expenses = keptExpenses;
        updateDashboard();
    }
});

categoryFilter.addEventListener("change", function () {
    renderExpenseList();
});

clearAllBtn.addEventListener("click", function () {
    if (expenses.length === 0) {
        return;
    }
    expenses = [];
    updateDashboard();
});

// Initial render
updateDashboard();