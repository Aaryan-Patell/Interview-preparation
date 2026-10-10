
const questionForm = document.getElementById("questionForm");
const questionList = document.getElementById("questionList");
const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const difficultyFilter = document.getElementById("difficultyFilter");
const clearFilters = document.getElementById("clearFilters");

// Load questions from LocalStorage
let questions = JSON.parse(localStorage.getItem("questions")) || [];

// Save questions to LocalStorage
function saveQuestions() {
    localStorage.setItem("questions", JSON.stringify(questions));
}

// Display and filter questions
function renderQuestions() {
    questionList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedStatus = statusFilter.value;
    const selectedDifficulty = difficultyFilter.value;

    const filteredQuestions = questions.filter(question => {
        return (
            question.title.toLowerCase().includes(searchText) &&
            (!selectedCategory ||
                question.category === selectedCategory) &&
            (!selectedStatus ||
                question.status === selectedStatus) &&
            (!selectedDifficulty ||
                question.difficulty === selectedDifficulty)
        );
    });

    if (filteredQuestions.length === 0) {
        questionList.textContent = questions.length === 0
            ? "No questions added yet."
            : "No matching questions found.";
    }

    filteredQuestions.forEach(question => {
        const card = document.createElement("div");
        card.className = "question-card";

        // Question details
        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = question.title;

        const info = document.createElement("p");
        info.textContent =
            `${question.category} | ${question.difficulty}`;

        const statusText = document.createElement("p");
        statusText.textContent = `Status: ${question.status}`;

        details.append(title, info, statusText);

        // Status dropdown
        const statusSelect = document.createElement("select");

        ["Pending", "In Progress", "Completed"].forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            statusSelect.appendChild(option);
        });

        statusSelect.value = question.status;

        statusSelect.addEventListener("change", () => {
            question.status = statusSelect.value;
            saveQuestions();
            renderQuestions();
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            questions = questions.filter(
                q => q.id !== question.id
            );

            saveQuestions();
            renderQuestions();
        });

        // Action buttons
        const actions = document.createElement("div");
        actions.className = "question-actions";
        actions.append(statusSelect, deleteButton);

        card.append(details, actions);
        questionList.appendChild(card);
    });

    updateDashboard();
}


function updateDashboard() {
    const total = questions.length;

    const completed = questions.filter(
        q => q.status === "Completed"
    ).length;

    const inProgress = questions.filter(
        q => q.status === "In Progress"
    ).length;

    document.getElementById("totalQuestions").textContent = total;
    document.getElementById("completedQuestions").textContent = completed;
    document.getElementById("inProgressQuestions").textContent = inProgress;

    const progress = total
        ? Math.round((completed / total) * 100)
        : 0;

    document.getElementById("progressPercent").textContent =
        `${progress}%`;
}


questionForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = document.getElementById("questionTitle").value.trim();
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const status = document.getElementById("status").value;

    if (!title || !category || !difficulty) {
        alert("Please fill in all required fields.");
        return;
    }

    questions.push({
        id: Date.now(),
        title: title,
        category: category,
        difficulty: difficulty,
        status: status
    });

    saveQuestions();
    questionForm.reset();
    renderQuestions();
});


searchInput.addEventListener("input", renderQuestions);


categoryFilter.addEventListener("change", renderQuestions);
statusFilter.addEventListener("change", renderQuestions);
difficultyFilter.addEventListener("change", renderQuestions);


clearFilters.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    statusFilter.value = "";
    difficultyFilter.value = "";

    renderQuestions();
});


renderQuestions();