document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  document.getElementById("taskDescription").addEventListener("input", function() {
    document.getElementById("charCounter").textContent = `${this.value.length}/200`;
  });
});

function addTask() {
  const taskDescription = document.getElementById("taskDescription").value.trim();
  const taskStatus = document.getElementById("taskStatus").value;
  const taskDueDate = document.getElementById("taskDueDate").value;
  const taskPriority = document.getElementById("taskPriority").value;
  const errorMessage = document.getElementById("error-message");

  // Validation
  if (taskDescription === "") {
    errorMessage.textContent = "Task description cannot be empty!";
    return;
  }
  
  if (taskDescription.length > 200) {
    errorMessage.textContent = "Task description cannot exceed 200 characters!";
    return;
  }

  if (!taskDueDate) {
    errorMessage.textContent = "Due date is required!";
    return;
  }

  const selectedDate = new Date(taskDueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    errorMessage.textContent = "Due date cannot be in the past!";
    return;
  }

  errorMessage.textContent = "";

  // Create task
  const task = {
    description: taskDescription,
    status: taskStatus,
    dueDate: taskDueDate,
    priority: taskPriority,
    id: Date.now(),
  };

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Clear inputs
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("taskPriority").value = "Low";
  document.getElementById("charCounter").textContent = "0/200";

  showNotification("Task added successfully!", "success");
  loadTasks();
}

function loadTasks(statusFilter = "all", priorityFilter = "all") {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    return true;
  });
  renderTasks(filteredTasks);
}

function applyFilters() {
  const statusFilter = document.getElementById("statusFilter").value;
  const priorityFilter = document.getElementById("priorityFilter").value;
  loadTasks(statusFilter, priorityFilter);
}

function resetFilters() {
  document.getElementById("statusFilter").value = "all";
  document.getElementById("priorityFilter").value = "all";
  loadTasks("all", "all");
}

function renderTasks(tasksArray) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasksArray.forEach(task => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    if (task.status === "Completed") li.classList.add("completed");

    li.innerHTML = `
      <span><strong>${task.description}</strong> (${task.priority})</span>
      <span>Due: ${task.dueDate || "No date set"}</span>
      <div class="task-actions">
        <button onclick="toggleTask(${task.id})" title="Toggle Status">✅</button>
        <button onclick="editTask(${task.id})" title="Edit Task">✏️</button>
        <button onclick="deleteTask(${task.id})" title="Delete Task">❌</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function toggleTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.status = task.status === "Pending" ? "Completed" : "Pending";
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function editTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks.find(task => task.id === id);
  
  if (!task) return;

  const newDescription = prompt("Edit task description:", task.description);
  if (newDescription === null) return;

  const trimmed = newDescription.trim();
  if (!trimmed) {
    alert("Task description cannot be empty!");
    return;
  }
  if (trimmed.length > 200) {
    alert("Description cannot exceed 200 characters!");
    return;
  }

  task.description = trimmed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function searchTasks() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filteredTasks = tasks.filter(task => 
    task.description.toLowerCase().includes(searchTerm) ||
    task.priority.toLowerCase().includes(searchTerm)
  );
  renderTasks(filteredTasks);
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}