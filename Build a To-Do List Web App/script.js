const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const filters = document.querySelectorAll(".filter");
const suggestionBox = document.getElementById("suggestions");

const suggestions = [
  "Buy groceries",
  "Read a book",
  "Call Mom",
  "Go for a walk",
  "Workout",
  "Complete project",
  "Water the plants",
  "Plan the weekend",
  "Reply to emails",
  "Meditate for 10 mins"
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks(filter = "all") {
  list.innerHTML = "";
  tasks
    .filter(task =>
      filter === "all" ? true : filter === "active" ? !task.completed : task.completed
    )
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <span>${task.text}</span>
        <div class="actions">
          <button onclick="toggleComplete(${index})">✅</button>
          <button onclick="editTask(${index})">✏️</button>
          <button onclick="deleteTask(${index})">❌</button>
        </div>`;
      list.appendChild(li);
    });
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  input.value = "";
  suggestionBox.innerHTML = "";
  saveAndRender();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndRender();
}

function editTask(index) {
  const newText = prompt("Edit your task", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveAndRender();
  }
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  const activeFilter = document.querySelector(".filter.active").dataset.filter;
  renderTasks(activeFilter);
}

// Filter buttons
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

// Add task
addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

// Suggestions
input.addEventListener("input", () => {
  const query = input.value.toLowerCase();
  suggestionBox.innerHTML = "";

  if (query.length === 0) return;

  const filtered = suggestions.filter(s => s.toLowerCase().includes(query));

  filtered.forEach(suggestion => {
    const li = document.createElement("li");
    li.textContent = suggestion;
    li.addEventListener("click", () => {
      input.value = suggestion;
      suggestionBox.innerHTML = "";
    });
    suggestionBox.appendChild(li);
  });
});
