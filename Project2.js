let taskInput=document.querySelector("#taskInput");
let timeInput=document.querySelector("#timeInput");
let addbtn =document.querySelector("#addbtn");
let taskList=document.querySelector("#taskList");
let searchInput=document.querySelector("#searchInput");
let allBtn=document.querySelector("#allBtn");
let completedBtn=document.querySelector("#completedBtn");
let pendingBtn=document.querySelector("#pendingBtn");
let clearBtn=document.querySelector("#clearBtn");


let task=[];
let idcounter=0;
let editId=null;
let currentFilter="all";
 
function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(task));
}
function loadTasks(){
    let savedTasks=localStorage.getItem("tasks");
    if(savedTasks){
        task=JSON.parse(savedTasks);
        if(task.length>0){
        idcounter=task[task.length-1].id+1;
        }
    }

    
    renderTask();
}
loadTasks();

function sortTasks(){
    task.sort(function(a,b){
        return a.time.localeCompare(b.time);
    });
}



function updateStats(){
    let total=task.length;
    let completed=task.filter(t=>t.completed).length;
    let pending=total-completed;

    document.querySelector("#stats").innerText=
    `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}



function clearCompleted(){
    task=task.filter(function(item){
        return !item.completed;
    });
    saveTasks();
    renderTask();
}

clearBtn.addEventListener("click",clearCompleted);

function renderTask(){
        sortTasks();
        taskList.innerHTML="";
        let searchValue=searchInput.value.toLowerCase();
        task.filter(function(item){
            let matchSearch=item.task.toLowerCase().includes(searchValue);
            let matchStatus=true;
            if(currentFilter==="completed"){
                matchStatus=item.completed===true;
            }
            else if(currentFilter==="pending"){
                matchStatus=item.completed===false;
            }
            return matchSearch && matchStatus;
            //return item.task.toLowerCase().includes(searchValue);
            
        })
        
        .forEach(function(item){
            let li=document.createElement("li");
            li.innerText=item.task+"-"+item.time;

            //style for complete task
            if(item.completed){
                li.style.textDecoration="line-through";
            }else{
                li.style.textDecoration="none";
            }
            //delete button
            let deletebtn=document.createElement("button");
            deletebtn.innerText="Delete";
            deletebtn.addEventListener("click",function(){
                task=task.filter(function(t){
                    return t.id!=item.id;
                });
                renderTask();
                saveTasks();
            });
            //complete button
            let completeBtn=document.createElement("button");
            completeBtn.innerText=item.completed ? "undo":"complete";

            completeBtn.addEventListener("click",function(){
             item.completed=!item.completed;
               saveTasks();
               renderTask();

            });
            

            let editBtn=document.createElement("button");
            editBtn.innerText="Edit";
            editBtn.addEventListener("click",function(){
                taskInput.value=item.task;
                timeInput.value=item.time;
                editId=item.id;
                addbtn.innerText="Update";
            });
            li.appendChild(deletebtn);
            li.appendChild(completeBtn);
            li.appendChild(editBtn);
            taskList.appendChild(li);

        });
        updateStats();
    }

addbtn.addEventListener("click",function(){
    let taskValue=taskInput.value;
    let timeValue=timeInput.value;

    if(taskValue===""|| timeValue===""){
        alert("please enter task and time");
        return;
    }
    if(editId!==null){
        task=task.map(function(item){
            if(item.id===editId){
                return {
                    ...item,
                    task:taskValue,
                    time:timeValue
                };
            }
            return item;
        });
        editId=null;
        addbtn.innerText="Add task";
    }
    else{
    let newTask={
        id:idcounter++,
        task:taskValue,
        time:timeValue,
        completed:false
    };
    task.push(newTask);
}
    

    renderTask();
    saveTasks();

    taskInput.value="";
    timeInput.value="";
 

});
searchInput.addEventListener("input",function(){
     renderTask();
   });
   allBtn.addEventListener("click",function(){
    currentFilter="all";
     renderTask();
   });
   completedBtn.addEventListener("click",function(){
    currentFilter="completed";
     renderTask();
   });
   pendingBtn.addEventListener("click",function(){
    currentFilter="pending";
     renderTask();
   });

