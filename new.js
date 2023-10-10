// Initialize dailyTasks with an empty array
let dailyTasks = [];

document.getElementById("updateTaskButton").style.display = "none";
document.getElementById("updateTitleButton").style.display = "none";

// Load data from Chrome extension storage on page load
chrome.storage.local.get({ dailyTasks: [] }, function (result) {
  dailyTasks = result.dailyTasks;
  // console.log(result);
  displayTasks();
});

// Function to save data to Chrome extension storage
function saveData() {
  chrome.storage.local.set({ dailyTasks }, function () {
    console.log("Data saved successfully.");
  });
}

// Function to add a task
function addTask(taskTitle, taskName, taskStatus, taskLink, date) {
  const task = {
    taskName,
    taskStatus,
    taskLink,
  };
  // console.log(date)
  if (!taskName || !taskStatus || !taskLink) {
    return alert("Get the valid input!!");
  }


  // Find the daily task by title
  // let dailyTaskTitle = dailyTasks.find((task) => task.title === taskTitle);
  let dailyTask = dailyTasks.find((task) => task.date === date);
// console.log(dailyTasks)
  if (!dailyTask) {
    dailyTask = {
      title: taskTitle,
      date: date,
      tasks: [],
    };
    dailyTasks.push(dailyTask);
  }

  dailyTask.tasks.push(task);
  saveData();
  displayTasks();
}

// Function to display tasks
function displayTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  dailyTasks.forEach((dailyTask, index) => {
    const listItem = document.createElement("div");
    listItem.innerHTML = `<div class="title-container">
    <h2>${dailyTask.title}</h2> 
    <button class="deleteBtn">Delete</button>
    <button class="TitleEdit">Edit</button>
    
    </div>
    `;
    const deleteBtn = listItem.querySelector(".deleteBtn");
    const titleEdit = listItem.querySelector(".TitleEdit");
    deleteBtn.addEventListener("click", function () {
      deleteTask(dailyTask.title);
    });
    titleEdit.addEventListener("click", function () {
      EditTitleText(dailyTask.title, index);
    });

    const tasksList = document.createElement("ul");

    dailyTask.tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
                     ${task.taskName}
                    ${task.taskStatus}
                     <a href="${task.taskLink}" target="_blank">${task.taskLink}</a>
                     <button class="editBtn" data-index="${index}">Edit</button>
                     <button class="deleteBtn">Delete</button>
                `;

      const editBtn = taskItem.querySelector(".editBtn");
      editBtn.addEventListener("click", function () {
        updateTask(task.taskName, task.taskStatus, task.taskLink, index);
      });

      // const editBtn = taskItem.querySelector(".editBtn");

      // // Attach the click event listener to the edit button
      // editBtn.addEventListener("click", function () {

        



      //   updateTask(task.taskName, task.taskStatus, task.taskLink, index, taskIndex);
      // });

      // editBtn.addEventListener("click", function () {
      //   fillInputFieldsForEdit(task.taskName, task.taskStatus, task.taskLink);
      //   document.getElementById("updateTaskButton").style.display = "block";
      // });
      
    

      const deleteBtn = taskItem.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", function () {
        deleteSingleTask(dailyTask.title, task.taskName);
      });

      tasksList.appendChild(taskItem);
    });

    listItem.appendChild(tasksList);
    taskList.appendChild(listItem);
  });
}








function EditTitleText(inputTaskTitle, index) {
  document.getElementById("addTaskButton").style.display = "none";
  document.getElementById("updateTaskButton").style.display = "none";
  document.getElementById("taskName").style.display = "none";
  document.getElementById("taskStatus").style.display = "none";
  document.getElementById("taskLink").style.display = "none";
  document.getElementById("updateTitleButton").style.display = "block";
  // console.log(inputTaskTitle, index);

  // // console.log(taskTitle)
  const newTaskTitle = document.getElementById("taskTitle");
  newTaskTitle.value = inputTaskTitle;
  document.getElementById("updateTitleButton").addEventListener("click", function () {
      const newTaskTitle = document.getElementById("taskTitle").value;
      dailyTasks.forEach((tassk) => (tassk.title = newTaskTitle));
      saveData();
      displayTasks();


      document.getElementById("addTaskButton").style.display = "block";
      document.getElementById("taskName").style.display = "block";
      document.getElementById("taskStatus").style.display = "block";
      document.getElementById("taskLink").style.display = "block";
      document.getElementById("updateTitleButton").style.display = "none";
    });
   
}
// function updateTaskTitle(index){
//   // const newtaskTitle = document.getElementById('updateTitleButton')
//   console.log('click')
// }

function updateTask(taskName, taskStatus, taskLink, index) {
  // console.log(taskName, taskStatus,taskLink,index);
  document.getElementById("addTaskButton").style.display = "none";
  document.getElementById("updateTaskButton").style.display = "block";
  const tasksName = document.getElementById("taskName");
  const tasksStatus = document.getElementById("taskStatus");
  const tasksLink = document.getElementById("taskLink");
  tasksName.value = taskName;
  tasksStatus.value = taskStatus;
  tasksLink.value = taskLink;

  // console.log(index)
  const updatedTask = {taskName : tasksName , taskStatus : tasksStatus , taskLink : tasksStatus}

  document.getElementById("updateTaskButton").addEventListener("click", function () {
      // console.log(updatedTask)
      updateTaskItem(index);
    });
}
// document.getElementById('updateTaskButton').addEventListener('click',upada)
function updateTaskItem(index) {
  console.log(index)
  const taskName = document.getElementById("taskName").value;
  const taskStatus = document.getElementById("taskStatus").value;
  const taskLink = document.getElementById("taskLink").value;
  const newUpdatedTask = { taskName : taskName, taskStatus: taskStatus, taskLink :taskLink };
  console.log(newUpdatedTask)
  // dailyTasks.forEach((task) => (task.tasks[index] = newUpdatedTask));
  // // dailyTasks.tasks[index] = newUpdatedTask;
  // saveData();
  // displayTasks();
  document.getElementById("addTaskButton").style.display = "block";
  document.getElementById("updateTaskButton").style.display = "none";

  // document.getElementById("taskName").value = "";
  // document.getElementById("taskStatus").value = "";
  // document.getElementById("taskLink").value = "";
}

function deleteSingleTask(taskTitle, taskName) {
  const dailyTask = dailyTasks.find((task) => task.title === taskTitle);

  if (dailyTask) {
    dailyTask.tasks = dailyTask.tasks.filter(
      (task) => task.taskName !== taskName
    );
    saveData();
    displayTasks();
  }
}

function deleteTask(title) {
  dailyTasks = dailyTasks.filter((task) => task.title !== title);
  saveData();
  displayTasks();
}

// Function to save an updated task
function saveTask(taskTitle, taskName) {
  const editedName = document.getElementById("editedName").value;
  const editedStatus = document.getElementById("editedStatus").value;
  const editedLink = document.getElementById("editedLink").value;

  const dailyTask = dailyTasks.find((task) => task.title === taskTitle);
  const task = dailyTask.tasks.find((t) => t.taskName === taskName);

  if (task) {
    task.taskName = editedName;
    task.taskStatus = editedStatus;
    task.taskLink = editedLink;
    saveData();
    displayTasks();
  }
}

// Add an event listener to the "Add Task" button
document.getElementById("addTaskButton").addEventListener("click", function () {
  const taskTitle = document.getElementById("taskTitle").value;
  const taskName = document.getElementById("taskName").value;
  const taskStatus = document.getElementById("taskStatus").value;
  const taskLink = document.getElementById("taskLink").value;
  const date = new Date().toLocaleDateString();
  // const date = 9/10/2023;

  // console.log(date)
  // 10/10/2023

  addTask(taskTitle, taskName, taskStatus, taskLink, date);

  // Clear input fields after adding a task
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskName").value = "";
  document.getElementById("taskStatus").value = "";
  document.getElementById("taskLink").value = "";
});

// Modal

function openEditModal() {
  const closeModalButton = document.getElementById("closeModal");
  closeModalButton.addEventListener("click", function () {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
  });
}

// modal functionallity//

// Function to open the edit modal
// function openEditModal(dailyTask,index) {
//   const modal = document.getElementById("editModal");
//   modal.style.display = "block";

//   // Fill the input fields with task data
//   document.getElementById("editedName").value = taskName;

//   // Add event listener to the update button
//   const saveEditButton = document.getElementById("saveEditButton");
//   saveEditButton.addEventListener("click", function () {
//       saveEditedTask(taskTitle, taskName);
//   });
// }

// // Function to close the edit modal
// function closeEditModal() {
//   const modal = document.getElementById("editModal");
//   modal.style.display = "none";
// }

// // Function to save the edited task
// function saveEditedTask(taskTitle, taskName) {
//   const editedName = document.getElementById("editedName").value;

//   // Update the task data and save it (you can implement this part)
//   // ...

//   // Close the edit modal
//   closeEditModal();
// }
