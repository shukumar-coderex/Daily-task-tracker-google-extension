document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
  
    addTaskBtn.addEventListener('click', function() {
      addTask();
    });
  
    function addTask() {
      const taskTitle = document.getElementById('taskTitle').value;
      const taskName = document.getElementById('taskName').value;
      const taskStatus = document.getElementById('taskStatus').value;
      const date = new Date().toLocaleDateString()
      // console.log(date);
      const task = { title: taskTitle, name: taskName, status: taskStatus ,date: date };
  
      chrome.storage.sync.get({ tasks: [] }, function(result) {
        const tasks = result.tasks;
        tasks.push(task);     
        // console.log(tasks);
  
        chrome.storage.sync.set({ tasks: tasks }, function() {
          updateTaskList(tasks);
        });
      });
    }
  
    function updateTaskList(tasks) {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
  
      tasks.forEach(function(task, index) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <strong>Title:</strong> ${task.title}<br>
          <strong>Name:</strong> ${task.name}<br>
          <strong>Status:</strong> ${task.status}<br>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        `;
  
        const editBtn = listItem.querySelector('.editBtn');
        const deleteBtn = listItem.querySelector('.deleteBtn');
  
        editBtn.addEventListener('click', function() {
          populateFieldsForUpdate(task, index);
          showUpdateButton(task);
        });
  
        deleteBtn.addEventListener('click', function() {
          deleteTask(index);
        });
  
        taskList.appendChild(listItem);
      });
    }
  
    function populateFieldsForUpdate(task, index) {
      // console.log(task,index);
      const taskTitle = document.getElementById('taskTitle');
      const taskName = document.getElementById('taskName');
      const taskStatus = document.getElementById('taskStatus');
  
      taskTitle.value = task.title;
      taskName.value = task.name;
      taskStatus.value = task.status;
  
      // Save the current index to the "Update" button for later use
      const updateBtn = document.getElementById('updateTaskBtn');
      updateBtn.dataset.taskIndex = index;
    }
  
    function showUpdateButton(task) {
      const addTaskBtn = document.getElementById('addTaskBtn');
      addTaskBtn.style.display = 'none';
  
      const updateBtn = document.getElementById('updateTaskBtn');
      updateBtn.style.display = 'block';
      updateBtn.addEventListener('click', function() {
        // console.log(updateBtn.dataset.taskIndex);
        updateTask(parseInt(updateBtn.dataset.taskIndex), task);
      });
    }
  
    function updateTask(index, originalTask) {
      const taskTitle = document.getElementById('taskTitle').value;
      const taskName = document.getElementById('taskName').value;
      const taskStatus = document.getElementById('taskStatus').value;
  
      const updatedTask = { title: taskTitle, name: taskName, status: taskStatus };
  
      chrome.storage.sync.get({ tasks: [] }, function(result) {
        const tasks = result.tasks;
        tasks[index] = updatedTask;
  
        chrome.storage.sync.set({ tasks: tasks }, function() {
          resetForm();
          updateTaskList(tasks);
        });
      });
    }
  
    function deleteTask(index) {
      chrome.storage.sync.get({ tasks: [] }, function(result) {
        const tasks = result.tasks;
        tasks.splice(index, 1);
  
        chrome.storage.sync.set({ tasks: tasks }, function() {
          updateTaskList(tasks);
        });
      });
    }
  
    function resetForm() {
      const taskTitle = document.getElementById('taskTitle');
      const taskName = document.getElementById('taskName');
      const taskStatus = document.getElementById('taskStatus');
  
      taskTitle.value = '';
      taskName.value = '';
      taskStatus.value = '';
  
      const addTaskBtn = document.getElementById('addTaskBtn');
      addTaskBtn.style.display = 'block';
  
      const updateBtn = document.getElementById('updateTaskBtn');
      updateBtn.style.display = 'none';
    }
  
    // Initialize the "Update" button with an event listener
    // const updateBtn = document.getElementById('updateTaskBtn');
    // updateBtn.addEventListener('click', function() {
    //   const index = parseInt(this.dataset.taskIndex);
    //   updateTask(index);
    // });
  
    chrome.storage.sync.get({ tasks: [] }, function(result) {
      const tasks = result.tasks || [];
      updateTaskList(tasks);
    });
  
  
    // modal
    const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.close-modal');
  const btnsOpenModal = document.querySelectorAll('.show-modal');
  
  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };
  
  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
  
  for (let i = 0; i < btnsOpenModal.length; i++) {
    btnsOpenModal[i].addEventListener('click', openModal);
  }
  
  btnCloseModal.addEventListener('click', closeModal);
  
  overlay.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // document.addEventListener('DOMContentLoaded', function() {
  //   const addTaskBtn = document.getElementById('addTaskBtn');
  //   const taskTitle = document.getElementById('taskTitle');
  //   const taskName = document.getElementById('taskName');
  //   const taskStatus = document.getElementById('taskStatus');
  //   const taskList = document.getElementById('taskList');
  //   let editingTask = null;
  
  //   addTaskBtn.addEventListener('click', function() {
  //     if (editingTask) {
  //       updateTask();
  //     } else {
  //       addTask();
  //     }
  //   });
  
  //   function addTask() {
  //     const newTaskTitle = taskTitle.value;
  //     const newTaskName = taskName.value;
  //     const newTaskStatus = taskStatus.value;
  
  //     chrome.storage.sync.get({ tasks: [] }, function(result) {
  //       const tasks = result.tasks;
  //       let existingTask = tasks.find(task => task.taskTitle === newTaskTitle);
  
  //       if (existingTask) {
  //         existingTask.taskDetails.push({ taskName: newTaskName, taskStatus: newTaskStatus });
  //       } else {
  //         const task = {
  //           taskTitle: newTaskTitle,
  //           taskDetails: [{ taskName: newTaskName, taskStatus: newTaskStatus }]
  //         };
  //         tasks.push(task);
  //       }
  
  //       chrome.storage.sync.set({ tasks: tasks }, function() {
  //         resetForm();
  //         updateTaskList(tasks);
  //       });
  //     });
  //   }
  
  //   function updateTask() {
  //     const updatedTaskTitle = taskTitle.value;
  //     const updatedTaskName = taskName.value;
  //     const updatedTaskStatus = taskStatus.value;
  
  //     chrome.storage.sync.get({ tasks: [] }, function(result) {
  //       const tasks = result.tasks;
  
  //       // Update the task details
  //       editingTask.taskDetails[0].taskName = updatedTaskName;
  //       editingTask.taskDetails[0].taskStatus = updatedTaskStatus;
  
  //       chrome.storage.sync.set({ tasks: tasks }, function() {
  //         resetForm();
  //         updateTaskList(tasks);
  //       });
  //     });
  
  //     editingTask = null; // Reset editing task after update
  //   }
  
  //   function updateTaskList(tasks) {
  //     taskList.innerHTML = '';
  
  //     tasks.forEach(function(task, index) {
  //       const listItem = document.createElement('li');
  //       const taskDetailsHtml = task.taskDetails.map(detail =>
  //         `<strong>Task Name:</strong> ${detail.taskName}<br><strong>Task Status:</strong> ${detail.taskStatus}<br><br>`
  //       ).join('');
  
  //       listItem.innerHTML = `
  //         <strong>Task Title:</strong> ${task.taskTitle}<br>
  //         ${taskDetailsHtml}
  //         <button class="editBtn">Edit</button>
  //         <button class="deleteBtn">Delete</button>
  //       `;
  
  //       const editBtn = listItem.querySelector('.editBtn');
  //       const deleteBtn = listItem.querySelector('.deleteBtn');
  
  //       editBtn.addEventListener('click', function() {
  //         populateFieldsForUpdate(task);
  //       });
  
  //       deleteBtn.addEventListener('click', function() {
  //         deleteTask(index);
  //       });
  
  //       taskList.appendChild(listItem);
  //     });
  //   }
  
  //   function populateFieldsForUpdate(task) {
  //     taskTitle.value = task.taskTitle;
  //     const taskDetails = task.taskDetails[0]; // Take the first task detail for editing
  //     taskName.value = taskDetails.taskName;
  //     taskStatus.value = taskDetails.taskStatus;
  
  //     editingTask = task; // Set the task for editing
  //   }
  
  //   function resetForm() {
  //     taskTitle.value = '';
  //     taskName.value = '';
  //     taskStatus.value = '';
  //   }
  
  //   function deleteTask(index) {
  //     chrome.storage.sync.get({ tasks: [] }, function(result) {
  //       const tasks = result.tasks;
  //       tasks.splice(index, 1);
  
  //       chrome.storage.sync.set({ tasks: tasks }, function() {
  //         updateTaskList(tasks);
  //       });
  //     });
  //   }
  
  //   chrome.storage.sync.get({ tasks: [] }, function(result) {
  //     const tasks = result.tasks || [];
  //     updateTaskList(tasks);
  //   });
  // });
  
  
  
  
  
  
  
  
  
  // document.addEventListener('DOMContentLoaded', function() {
  //   const addTaskBtn = document.getElementById('addTaskBtn');
  //   const taskTitle = document.getElementById('taskTitle');
  //   const taskName = document.getElementById('taskName');
  //   const taskStatus = document.getElementById('taskStatus');
  //   const taskList = document.getElementById('taskList');
  //   let editingTask = null;
  
  //   addTaskBtn.addEventListener('click', function() {
  //     if (editingTask) {
  //       updateTask();
  //     } else {
  //       addTask();
  //     }
  //   });
  
  //   function addTask() {
  //     const newTaskTitle = taskTitle.value;
  //     const newTaskName = taskName.value;
  //     const newTaskStatus = taskStatus.value;
  
  //     chrome.storage.sync.get({ tasks: [] }, function(result) {
  //       const tasks = result.tasks || [];
  
  //       const existingTaskIndex = tasks.findIndex(task => task.title === newTaskTitle);
  
  //       if (existingTaskIndex !== -1) {
  //         tasks[existingTaskIndex].task.push({ name: newTaskName, status: newTaskStatus });
  //       } else {
  //         const task = {
  //           id: Date.now(),
  //           date: new Date().toLocaleDateString(),
  //           title: newTaskTitle,
  //           task: [{ name: newTaskName, status: newTaskStatus }]
  //         };
  //         tasks.push(task);
  //       }
  
  //       chrome.storage.sync.set({ tasks: tasks }, function() {
  //         resetForm();
  //         updateTaskList(tasks);
  //       });
  //     });
  //   }
  
  //   function updateTask() {
  //     const updatedTaskTitle = taskTitle.value;
  
  //     if (taskName && taskStatus) {
  //       const updatedTaskName = taskName.value;
  //       const updatedTaskStatus = taskStatus.value;
  
  //       chrome.storage.sync.get({ tasks: [] }, function(result) {
  //         const tasks = result.tasks || [];
  
  //         const taskToUpdate = tasks.find(task => task.title === editingTask.title);
  
  //         if (taskToUpdate) {
  //           const taskDetail = taskToUpdate.task.find(detail => detail.name === editingTask.taskName);
  //           if (taskDetail) {
  //             taskDetail.name = updatedTaskName;
  //             taskDetail.status = updatedTaskStatus;
  //           }
  //         }
  
  //         chrome.storage.sync.set({ tasks: tasks }, function() {
  //           resetForm();
  //           updateTaskList(tasks);
  //         });
  //       });
  //     }
  
  //     editingTask = null;
  //   }
  
  //   function updateTaskList(tasks) {
  //     taskList.innerHTML = '';
  
  //     tasks.forEach(function(task) {
  //       const listItem = document.createElement('li');
  //       const taskDetailsHtml = task.task.map((detail, index) =>
  //         `
  //         <input type="text" class="taskName" value="${detail.name}" placeholder="Task Name">
  //         <input type="text" class="taskStatus" value="${detail.status}" placeholder="Task Status">
  //         <button class="updateTaskDetailBtn" data-id="${task.id}" data-index="${index}">Update Task Detail</button>
  //         <button class="deleteTaskDetailBtn" data-id="${task.id}" data-index="${index}">Delete Task Detail</button>
  //         <br>
  //         `
  //       ).join('');
  
  //       listItem.innerHTML = `
  //         <strong>Task Title:</strong> ${task.title}<br>
  //         ${taskDetailsHtml}
  //         <hr>
  //       `;
  
  //       const updateTaskDetailBtns = listItem.querySelectorAll('.updateTaskDetailBtn');
  //       const deleteTaskDetailBtns = listItem.querySelectorAll('.deleteTaskDetailBtn');
  
  //       updateTaskDetailBtns.forEach(btn => {
  //         btn.addEventListener('click', function() {
  //           const taskIndex = parseInt(btn.getAttribute('data-id'));
  //           const detailIndex = parseInt(btn.getAttribute('data-index'));
  
  //           // Modified to get the values dynamically
  //           const newName = listItem.querySelector(`[data-id="${taskIndex}"][data-index="${detailIndex}"] .taskName`).value;
  //           const newStatus = listItem.querySelector(`[data-id="${taskIndex}"][data-index="${detailIndex}"] .taskStatus`).value;
  
  //           updateTaskDetail(taskIndex, detailIndex, newName, newStatus);
  //         });
  //       });
  
  //       deleteTaskDetailBtns.forEach(btn => {
  //         btn.addEventListener('click', function() {
  //           const taskIndex = parseInt(btn.getAttribute('data-id'));
  //           const detailIndex = parseInt(btn.getAttribute('data-index'));
  
  //           deleteTaskDetail(taskIndex, detailIndex);
  //         });
  //       });
  
  //       taskList.appendChild(listItem);
  //     });
  //   }
  
  //   function updateTaskDetail(taskIndex, detailIndex, newName, newStatus) {
  //     chrome.storage.sync.get({ tasks: [] }, function(result) {
  //       const tasks = result.tasks || [];
  
  //       const taskToUpdate = tasks.find(task => task.id === taskIndex);
  
  //       if (taskToUpdate && taskToUpdate.task.length > detailIndex) {
  //         taskToUpdate.task[detailIndex].name = newName;
  //         taskToUpdate.task[detailIndex].status = newStatus;
  
  //         chrome.storage.sync.set({ tasks: tasks }, function() {
  //           updateTaskList(tasks);
  //         });
  //       }
  //     });
  //   }
  
  //   function deleteTaskDetail(taskIndex, detailIndex) {
  //     chrome.storage.sync.get({ tasks: [] }, function(result) {
  //       const tasks = result.tasks || [];
  
  //       const taskToUpdate = tasks.find(task => task.id === taskIndex);
  
  //       if (taskToUpdate && taskToUpdate.task.length > detailIndex) {
  //         taskToUpdate.task.splice(detailIndex, 1);
  
  //         chrome.storage.sync.set({ tasks: tasks }, function() {
  //           updateTaskList(tasks);
  //         });
  //       }
  //     });
  //   }
  
  //   function resetForm() {
  //     taskTitle.value = '';
  //     taskName.value = '';
  //     taskStatus.value = '';
  //   }
  
  //   chrome.storage.sync.get({ tasks: [] }, function(result) {
  //     const tasks = result.tasks || [];
  //     updateTaskList(tasks);
  //   });
  // });


  

const dailytask = [
    {
        "title " : "task Title 1",
        "tasks" :[
            {
                "taksname" : "taks",
                "task status"  : "status",
                "task link" :  "google.com"
            },
        
            {
                "taksname" : "taks2",
                "task status"  : "status2",
                "task link" :  "google.com"
            },
        
        ]
    }
]