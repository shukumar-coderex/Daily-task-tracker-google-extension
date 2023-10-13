let dailyTasks = [];

document.getElementById("updateTaskButton").style.display = "none";
document.getElementById("updateTitleButton").style.display = "none";




// Load data from Chrome extension storage on page load
chrome.storage.local.get({ dailyTasks: [] }, function (result) {
  dailyTasks = result.dailyTasks;
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
  if (!taskName || !taskStatus || !taskLink) {
    return alert("Get the valid input!!");
  }



  let dailyTask = dailyTasks.find((task) => task.date === date);
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
  standupTitleHide()

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

  

    titleEdit.addEventListener("click", function() {
      handleEditClick(dailyTask.title, index);
    });

    const tasksList = document.createElement("ul");

    dailyTask.tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
                     ${task.taskName} -
                    ${task.taskStatus} -
                     <a href="${task.taskLink}" target="_blank">Link</a>
                     <button class="deleteBtn">Delete</button>
                `;

     

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




function handleEditClick(inputTaskTitle, index) {
  document.getElementById("addTaskButton").style.display = "none";
  document.getElementById("updateTaskButton").style.display = "none";
  document.getElementById("taskName").style.display = "none";
  document.getElementById("taskStatus").style.display = "none";
  document.getElementById("taskLink").style.display = "none";

    document.getElementById('standupTitle').style.display = "none";
  document.getElementById('standupName').style.display = "none";
  document.getElementById('standupStatus').style.display = "none";
  document.getElementById('standupLink').style.display = "none";

  document.getElementById("updateTitleButton").style.display = "block";

  const newTaskTitle = document.getElementById("taskTitle");
  newTaskTitle.value = inputTaskTitle;

  document.getElementById("updateTitleButton").addEventListener("click", function() {
    const newTaskTitleValue = document.getElementById("taskTitle").value;
    updateTaskTitle(inputTaskTitle, newTaskTitleValue, index);

    document.getElementById("addTaskButton").style.display = "block";
    document.getElementById("taskName").style.display = "block";
    document.getElementById("taskStatus").style.display = "block";
    document.getElementById("taskLink").style.display = "block";
    document.getElementById("updateTitleButton").style.display = "none";
  });
}



//UPDATE STANDUP TITLE
function updateTaskTitle(oldTitle, newTitle, index) {
  const dailyTask = dailyTasks.find((task) => task.title === oldTitle);

  if (dailyTask) {
    dailyTask.title = newTitle;
    const titleElement = document.querySelector(`#taskList div:nth-child(${index + 1}) h2`);
    if (titleElement) {
      titleElement.innerText = newTitle;
    }

    saveData();
    displayTasks();
  }

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
  standupTitleHide()
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

  if (!isValidURL(taskLink)) {
    return alert("Enter valid url");
  } 

  addTask(taskTitle, taskName, taskStatus, taskLink, date);

  // Clear input fields after adding a task
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskName").value = "";
  document.getElementById("taskStatus").value = "";
  document.getElementById("taskLink").value = "";
});




// MODAL FOR DAILY STANDUP
document.getElementById("showModal").addEventListener("click", function () {
  document.getElementById("popup-1").classList.toggle("active");
  const dailyTaskTitle = document.getElementById("daily-task-title");
  
  const today = dailyTasks?.find((dailytask) => dailytask.date == new Date().toLocaleDateString());
  dailyTaskTitle.innerHTML = today?.title;

  const todayTaskContainer = document.getElementById("todayTask");
  today?.tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <span>${task.taskName}</span> - <span>${task.taskStatus}</span>  - 
    <a href="${task.taskLink}">Link</a>
    `;
    todayTaskContainer.appendChild(li);
  });

  const yserdayDate = document.getElementById("yesterdayTask");
  const checkDate = new Date().toLocaleDateString();
  isYesterday();
});

document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("popup-1").classList.toggle("active");
  const todayTaskContainer = document.getElementById("todayTask");
  todayTaskContainer.innerHTML = "";
  document.getElementById("yesterdayTask").innerHTML = ""
});

function isYesterday() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() - 1);
  const targetDate = formatDate(tomorrow);

  // Function to format a Date object as 'dd/mm/yy'
  function formatDate(date) {
    const dd = date.getDate().toString().padStart(2, "0");
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = date.getFullYear().toString(); // Get the last two digits of the year
    const yserdayDate = document.getElementById("yesterdayTask");
    const yesterdayTask = dailyTasks.find(tasks => tasks.date == (`${dd}/${mm}/${yyyy}`))
    yesterdayTask?.tasks.forEach(task => {
      const li = document.createElement("li");  
      li.innerHTML = `
      <span>${task.taskName}</span> - <span>${task.taskStatus}</span>  - 
      <a href="${task.taskLink}">Link</a>

      `;
      yserdayDate.appendChild(li);
    })
    

  }

}




// check input value url or not 
function isValidURL(url) {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(url);
}




// Implement input field validation for task status and task link filed.

const taskName = document.getElementById("taskName");
const taskStatus = document.getElementById("taskStatus");
const taskLink = document.getElementById("taskLink");
const addTaskButton = document.getElementById("addTaskButton");

taskName.addEventListener("input", checkInputs);
taskStatus.addEventListener("input", checkInputs);  
taskLink.addEventListener("input", checkInputs);

function checkInputs() {
  
  if ( taskStatus.value.trim() === '' || taskLink.value.trim() === '') {
    addTaskButton.style.cursor = 'not-allowed';
    addTaskButton.disabled = true;
  } else {
    addTaskButton.style.cursor= "pointer";
    addTaskButton.disabled = false;
  }
}

checkInputs();


// Standup title will appear for first time data added

function standupTitleHide(){
  const today = dailyTasks?.find((dailytask) => dailytask.date == new Date().toLocaleDateString());
  if(today){
    document.getElementById('taskTitle').style.display = "none";
    document.getElementById('standupTitle').style.display = "none"
  }
}




// copy the all post form modal
document.addEventListener('DOMContentLoaded',function(){
  const copyBtn =  document.getElementById('copy-btn');
  const copyText = document.getElementById('copy-content');
  copyBtn.addEventListener('click',function(){
    const range = document.createRange()
    range.selectNode(copyText);
    window.getSelection().removeAllRanges();

    window.getSelection().addRange(range)
    document.execCommand('copy');

    window.getSelection().removeAllRanges();
  })
})






















