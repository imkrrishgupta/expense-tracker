document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseList = document.getElementById("expense-list");
    const totalAmountDisplay = document.getElementById("total-amount");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let totalAmount = calculateTotal();

    renderExpenses();

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault(); // It prevents the default behaviour....so that we can do the things which we want
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());

        if (name !== "" && !isNaN(amount) && amount > 0){
            const newExpense = {
                id: Date.now(),
                name: name,  // We can also use it just like `name`...both means the same
                amount:amount
            }
            expenses.push(newExpense);
            saveExpensesTolocal();
            renderExpenses();
            updateTotal();

            // clear input
            expenseNameInput.value = "";
            expenseAmountInput.value = "";
        }
    })

    function renderExpenses(){
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const li = document.createElement("li");
            li.innerHTML = `
            ${expense.name} - $${expense.amount}
            <button data-id="${expense.id}">Delete</button>
            `
            expenseList.appendChild(li);
        })
    }
    
    function calculateTotal(){
        return expenses.reduce((sum, expense) => sum + expense.amount,0);
    }

    function saveExpensesTolocal(){
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function updateTotal(){ // When we are adding a new amount to the array the total is not updated so we have to update the total and the global amount of the total has been changed...now I want to display it in the text
        totalAmount = calculateTotal();
        totalAmountDisplay.textContent = totalAmount.toFixed(2);
    }

    expenseList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON"){
            const expenseId = parseInt(e.target.getAttribute("data-id"));
            expenses = expenses.filter(expense => expense.id !== expenseId);
        }

        saveExpensesTolocal();
        renderExpenses();
        updateTotal();
    })
})