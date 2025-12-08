const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');


function addTask() {
const taskText = taskInput.value.trim();
if (!taskText) return;


const li = document.createElement('li');
li.textContent = taskText;


// Toggle complete
li.addEventListener('click', () => {
li.classList.toggle('completed');
});


// Delete button
const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'Delete';
deleteBtn.classList.add('deleteBtn');
deleteBtn.addEventListener('click', (e) => {
e.stopPropagation(); // prevent marking completed
taskList.removeChild(li);
});


li.appendChild(deleteBtn);
taskList.appendChild(li);


taskInput.value = '';
}


addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') addTask();
});