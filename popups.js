
const taskStatus = document.getElementById("taskStatus").value;
document.getElementById("addTask").addEventListener("click", addTask);

let tasks = [];


displayTask();
function addTask() {
  // console.log('click')
  const taskTitle = document.getElementById("task-title").value;
  const taskName = document.getElementById("task-name").value;
  const taskStatus = document.getElementById("taskStatus").value;
  tasks.push({ title: taskTitle, taskName: taskName, taskStatus: taskStatus });
  chrome.storage.sync.set({ mytask: tasks }, function () {
    alert("success");
  });
  //   const taskList = document.getElementById('show-task')
  // const createTaskTitle = document.createElement('h2')
  // const taskItem = document.createElement('p')
  // createTaskTitle.textContent = `${taskTitle}`
  // taskItem.textContent = `${taskName} - ${taskStatus}`
  // taskList.appendChild(createTaskTitle)
  // taskList.appendChild(taskItem)
  const taskTitleContent = document.getElementById("task-title-content");
  //   console.log(taskTitle)
  taskTitleContent.innerHTML = taskTitle;
  displayTask();
  document.getElementById("task-name").value = "";
}

function displayTask() {
  chrome.storage.sync.get("mytask", function (data) {
    tasks = [...data.mytask];
  });
  const taskList = document.getElementById("show-task");
  taskList.innerHTML = "";
  // console.log(tasks)
  tasks.forEach((task, index) => {
    // let taskItem = document.createElement("div");
    // taskItem.innerHTML = `
    //     <h4>${task.taskName} - ${task.taskStatus}</h4>
    //     <button onclick="deleteTask(${index})">Delete</button>
    //     let deleteButton = document.createElement("button");
    //   </span>
    //     `;
    // taskList.appendChild(taskItem);
    let taskItem = document.createElement("div");
    taskItem.classList.add("task-items");
    let h4 = document.createElement("h4");
    h4.textContent = `${task.taskName} - ${task.taskStatus}`;

    let deleteButton = document.createElement("button");
    let editButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    editButton.textContent = "Edit";

    // Apply the CSS class to the buttons
    deleteButton.classList.add("button");
    editButton.classList.add("button");

    deleteButton.addEventListener("click", () => deleteTask(task.taskName));
    editButton.addEventListener("click", () => editTask(index));
    taskItem.appendChild(h4);
    taskItem.appendChild(deleteButton);
    taskItem.appendChild(editButton);
    taskList.appendChild(taskItem);
  });
}

function deleteTask(taskName) {
    // console.log('btn ',taskName)
  chrome.storage.sync.get("mytask", function (data) {
    // console.log(data);
    let restTask = data.mytask.filter((task) =>task.taskName !== taskName);
        // tasks.splice(index, 1);
    // console.log(restTask)
    tasks = [...restTask]
    chrome.storage.sync.set({ mytask: restTask }, function () {
        alert("Are You Sure Want To Delete");
      });
    displayTask()
        

    //   console.log(task, index);
   
  });
//   displayTask();

}

function editTask(index) {
  const data = tasks[index];
  let updatedName = document.getElementById("task-name").value = data.taskName;
  let updatedStatus = document.getElementById("taskStatus").value = data.taskStatus;

  tasks.splice(index, 1);
  displayTask();
}







// function editData(index) {
//   alert(index);
  // const data = dataArray[index];
  // document.getElementById('name').value = data.name;
  // document.getElementById('description').value = data.description;

  // dataArray.splice(index, 1);
  // displayData();
// }

// document.getElementById('showTask').addEventListener('click', function(){
//     const allTask = tasks.map(task =>{
//         const taskItem = document.createElement('p')
//         taskItem.textContent = `${task.title} ${task.taskName}`
//         return taskItem

//     })
//     allTask.forEach(task => {
//         taskList.appendChild(task)
//     });
// })

//  document.getElementById('showTask').onclick = function(){
//     chrome.storage.sync.get('mytask', function(data){
//         alert(data.mytask)
//         data.mytask.map(newTask=> {
//             console.log(newTask.title, newTask.taskName,newTask.taskStatus)
//             taskItem.textContent = `${newTask.taskTitle} , ${newTask.taskName}`
//             taskList.appendChild(taskItem)
//         })
//     })
//  }
