// ========== Local Storage Handling ==========
function saveBoard(board) {
localStorage.setItem("task_board_v1", JSON.stringify(board));
}


function loadBoard() {
const data = localStorage.getItem("task_board_v1");
return data ? JSON.parse(data) : null;
}
// ========== Board State ==========
let board = loadBoard() || {
columns: [
{ id: "todo", title: "To Do", tasks: [] },
{ id: "progress", title: "In Progress", tasks: [] },
{ id: "done", title: "Done", tasks: [] }
]
};
// ========== DOM References ==========
const boardContainer = document.getElementById("board");
const addColumnBtn = document.getElementById("addColumnBtn");
// ========== Rendering Columns ==========
function renderBoard() {
boardContainer.innerHTML = "";


board.columns.forEach((col) => {
const colDiv = document.createElement("div");
colDiv.className = "column";
colDiv.dataset.id = col.id;


colDiv.innerHTML = `
<div class="column-header">
<input value="${col.title}" class="col-title" />
<button class="delete-col">✖</button>
</div>
<div class="task-list"></div>
<div class="add-task-btn">+ Add Task</div>
`;

const taskList = colDiv.querySelector(".task-list");


col.tasks.forEach((task) => {
const taskDiv = createTaskElement(col.id, task);
taskList.appendChild(taskDiv);
});


boardContainer.appendChild(colDiv);
});


saveBoard(board);
}
// ========== Create Task Element ==========
function createTaskElement(columnId, task) {
const taskDiv = document.createElement("div");
taskDiv.className = "task";
taskDiv.draggable = true;
taskDiv.dataset.id = task.id;


taskDiv.innerHTML = `
<strong>${task.title}</strong>
<p>${task.description || ""}</p>
<div class="task-actions">
<button class="edit">Edit</button>
<button class="delete">Delete</button>
</div>
`;
  // Drag events
taskDiv.addEventListener("dragstart", (e) => {
e.dataTransfer.setData("text/plain", JSON.stringify({ taskId: task.id, fromCol: columnId }));
});


return taskDiv;
}
// ========== Add Column ==========
addColumnBtn.addEventListener("click", () => {
const id = "col_" + Math.random().toString(36).substr(2, 9);
board.columns.push({ id, title: "New Column", tasks: [] });
renderBoard();
});
// ========== Delegated Events ==========
boardContainer.addEventListener("click", (e) => {
const colDiv = e.target.closest(".column");
if (!colDiv) return;
const colId = colDiv.dataset.id;
const column = board.columns.find((c) => c.id === colId);


// Delete column
if (e.target.classList.contains("delete-col")) {
board.columns = board.columns.filter((c) => c.id !== colId);
renderBoard();
return;
}


// Add task button
if (e.target.classList.contains("add-task-btn")) {
const title = prompt("Task title:");
if (!title) return;


const task = {
id: "task_" + Math.random().toString(36).substr(2, 9),
title,
description: ""
};


column.tasks.push(task);
renderBoard();
return;
}


// Delete task
if (e.target.classList.contains("delete")) {
const taskId = e.target.closest(".task").dataset.id;
column.tasks = column.tasks.filter((t) => t.id !== taskId);
renderBoard();
return;
}


// Edit task
if (e.target.classList.contains("edit")) {
const taskId = e.target.closest(".task").dataset.id;
const task = column.tasks.find((t) => t.id === taskId);


const newTitle = prompt("Edit title", task.title);
const newDesc = prompt("Edit description", task.description);


task.title = newTitle;
task.description = newDesc;


renderBoard();
return;
}
});
// ========== Drag & Drop Column Handling ==========
boardContainer.addEventListener("dragover", (e) => {
e.preventDefault();
const colDiv = e.target.closest(".column");
if (!colDiv) return;
});


boardContainer.addEventListener("drop", (e) => {
e.preventDefault();


const data = JSON.parse(e.dataTransfer.getData("text/plain"));
const taskId = data.taskId;
const fromCol = data.fromCol;


const toColDiv = e.target.closest(".column");
if (!toColDiv) return;


const toColId = toColDiv.dataset.id;


if (fromCol === toColId) return;


const fromColumn = board.columns.find((c) => c.id === fromCol);
const toColumn = board.columns.find((c) => c.id === toColId);


const task = fromColumn.tasks.find((t) => t.id === taskId);


fromColumn.tasks = fromColumn.tasks.filter((t) => t.id !== taskId);
toColumn.tasks.unshift(task);


renderBoard();
});


// ========== Initial Render ==========
renderBoard();
