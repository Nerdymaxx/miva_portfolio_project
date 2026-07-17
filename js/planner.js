document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "academic-planner-tasks";

  const form = document.getElementById("task-form");
  const titleInput = document.getElementById("task-title");
  const dueInput = document.getElementById("task-due");
  const priorityInput = document.getElementById("task-priority");
  const list = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");

  let tasks = loadTasks();
  let activeFilter = "all";

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function makeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function isOverdue(task) {
    if (!task.due || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.due) < today;
  }

  function formatDue(due) {
    if (!due) return "No due date";
    const date = new Date(due);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function getFilteredTasks() {
    if (activeFilter === "active") return tasks.filter((t) => !t.completed);
    if (activeFilter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }

  function render() {
    list.innerHTML = "";
    const filtered = getFilteredTasks();

    filtered.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.completed ? " completed" : ""}`;
      item.dataset.id = task.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", `Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`);
      checkbox.addEventListener("change", () => toggleTask(task.id));

      const body = document.createElement("div");
      body.className = "task-body";

      const title = document.createElement("div");
      title.className = "task-title";
      title.textContent = task.title;

      const meta = document.createElement("div");
      meta.className = "task-meta";

      const priorityBadge = document.createElement("span");
      priorityBadge.className = `priority-badge priority-${task.priority}`;
      priorityBadge.textContent = task.priority;

      const due = document.createElement("span");
      due.className = `task-due${isOverdue(task) ? " overdue" : ""}`;
      due.textContent = formatDue(task.due);

      meta.appendChild(priorityBadge);
      meta.appendChild(due);
      body.appendChild(title);
      body.appendChild(meta);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "task-delete-btn";
      deleteBtn.setAttribute("aria-label", `Delete "${task.title}"`);
      deleteBtn.textContent = "✕";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      item.appendChild(checkbox);
      item.appendChild(body);
      item.appendChild(deleteBtn);
      list.appendChild(item);
    });

    emptyState.classList.toggle("visible", filtered.length === 0);
    emptyState.textContent =
      tasks.length === 0
        ? "No tasks yet - add your first one above."
        : "No tasks match this filter.";
  }

  function addTask(title, due, priority) {
    tasks.unshift({
      id: makeId(),
      title,
      due: due || null,
      priority,
      completed: false,
    });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      render();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    render();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) return;

    addTask(title, dueInput.value, priorityInput.value);
    form.reset();
    priorityInput.value = "medium";
    titleInput.focus();
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      render();
    });
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);

  render();
});
