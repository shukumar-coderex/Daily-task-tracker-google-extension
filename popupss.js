// Function to add a task
function addTask() {
    const taskTitle = document.getElementById("taskTitle").value;
    const taskName = document.getElementById("taskName").value;
    const taskStatus = document.getElementById("taskStatus").value;

    // Create a task object
    const task = {
        title: taskTitle,
        tasks: {}
    };

    // Check if the taskTitle already exists in storage
    chrome.storage.local.get([taskTitle], function(result) {
        if (!result[taskTitle]) {
            result[taskTitle] = {};
        }

        // Add the new task name and status
        result[taskTitle][taskName] = taskStatus;

        // Store the updated data back in Chrome Storage
        chrome.storage.local.set(result, function() {
            console.log("Data stored successfully.");
            displayTasks();
        });
    });
}

// Function to display tasks
function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    // Retrieve data from Chrome Storage
    chrome.storage.local.get(null, function(data) {
        for (const title in data) {
            const tasks = data[title];
            for (const taskName in tasks) {
                const listItem = document.createElement("li");
                listItem.id = `task-${title}-${taskName}`;
                listItem.innerHTML = `
                    <strong>${title}</strong>: 
                    ${taskName}: ${tasks[taskName]}
                `;
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", function() {
                    editTask(title, taskName, tasks[taskName]);
                });
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", function() {
                    deleteTask(title, taskName);
                });
                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);
                taskList.appendChild(listItem);
            }
        }
    });
}

// Function to edit a task
function editTask(taskTitle, taskName, taskStatus) {
    // Replace the task name and status with input fields
    const listItem = document.getElementById(`task-${taskTitle}-${taskName}`);
    listItem.innerHTML = `
        <input type="text" id="editedName" value="${taskName}">
        <input type="text" id="editedStatus" value="${taskStatus}">
        <button onclick="saveTask('${taskTitle}', '${taskName}')">Save</button>
    `;
}

// Function to save an updated task
function saveTask(taskTitle, taskName) {
    const editedName = document.getElementById("editedName").value;
    const editedStatus = document.getElementById("editedStatus").value;

    chrome.storage.local.get([taskTitle], function(result) {
        if (result[taskTitle]) {
            result[taskTitle][editedName] = editedStatus;
            delete result[taskTitle][taskName];
            chrome.storage.local.set(result, function() {
                console.log("Task updated successfully.");
                displayTasks();
            });
        }
    });
}

// Function to delete a task
function deleteTask(taskTitle, taskName) {
    chrome.storage.local.get([taskTitle], function(result) {
        if (result[taskTitle] && result[taskTitle][taskName]) {
            delete result[taskTitle][taskName];
            chrome.storage.local.set(result, function() {
                console.log("Task deleted successfully.");
                displayTasks();
            });
        }
    });
}

// Add an event listener to the "Add Task" button
document.getElementById("addTaskButton").addEventListener("click", addTask);

// Call displayTasks to show existing data on page load
displayTasks();
