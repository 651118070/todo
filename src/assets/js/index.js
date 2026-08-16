const btn = document.querySelector("#add");
const backdrop = document.querySelector("#backdrop");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#closeModal");

const cardContainer = document.querySelector(".cardContainer");

const search = document.querySelector("#search");
const filter = document.querySelector("#filter");

const totalPage = document.querySelector("#totalPage");
const curentPage = document.querySelector("#pageNumber");

const prev = document.querySelector("#prev");
const next = document.querySelector("#next");

const form = document.querySelector("#form");
const title = document.querySelector("#title");
const check = document.querySelector("#check");
const soumettre = document.querySelector("#soumettre");

const loading = document.querySelector("#loading");

const taskPerPage = 10;

let currentPage = 1;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let filteredTasks = tasks;
let editingTaskId = null;

let totalPages = Math.ceil(
    filteredTasks.length / taskPerPage
);




const titleRegex = /^[A-Za-z\s]+$/;

function hideModal() {

    modal.classList.add("hidden");

}


btn.addEventListener("click", () => {

    modal.classList.remove("hidden");

});


backdrop.addEventListener(
    "click",
    hideModal
);


closeModal.addEventListener(
    "click",
    hideModal
);

function checkForm(input, regex, message) {

    const validation = regex.test(input.value);

    let error =
        input.parentElement.querySelector(".error");

    if (!validation) {

        if (!error) {

            error = document.createElement("span");

            error.className =
                "error text-red-500 text-sm";

            input.parentElement.appendChild(error);
        }

        error.textContent = message;

        return false;
    }

    if (error) {
        error.remove();
    }

    return true;
}

title.addEventListener("input", () => {

    checkForm(
        title,
        titleRegex,
        "Le titre doit contenir uniquement des lettres"
    );

});

title.addEventListener("blur", () => {

    checkForm(
        title,
        titleRegex,
        "Le titre doit contenir uniquement des lettres"
    );

});


async function getTasks() {

    try {

        loading.classList.remove(
            "hidden"
        );


        const response = await fetch(
            "https://jsonplaceholder.typicode.com/todos"
        );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch tasks"
            );

        }


        const data = await response.json();

        tasks = data;


        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );


        filteredTasks = tasks;

        currentPage = 1;


        displayTasks(filteredTasks);


    } catch (error) {

        console.error(
            "Error fetching tasks:",
            error
        );


        cardContainer.innerHTML = `
            <p class="text-red-500">
                Impossible de charger les tâches.
            </p>
        `;


    } finally {

        loading.classList.add(
            "hidden"
        );

    }

}
getTasks();



function displayTasks(data = filteredTasks) {

    cardContainer.innerHTML = "";

   
    totalPages = Math.ceil(
        data.length / taskPerPage
    );


  
    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }



    const start = (currentPage - 1) * taskPerPage;

    const end = start + taskPerPage;

    const taskDisplay = data.slice(start, end);


    if (taskDisplay.length === 0) {

        cardContainer.innerHTML = `
            <p class="text-gray-500 text-xl">
                Aucune tâche disponible
            </p>
        `;

        totalPage.textContent = totalPages;

        curentPage.textContent =
            `Page ${currentPage} /`;

        updatePaginationButtons();

        return;
    }


   
    taskDisplay.forEach((t) => {

        const card = document.createElement("div");

        card.className = `
            bg-white
            border border-gray-200
            rounded-xl
            p-5
            shadow-sm
            hover:shadow-md
            transition
            w-full
            max-w-md
        `;


        card.innerHTML = `

            <div class="flex justify-between items-start gap-4 mb-4">

                <div>

                    <span class="text-xs text-gray-400">
                        Task #${t.id}
                    </span>

                    <h2 class="text-xs w-full font-semibold text-gray-800 mt-1">
                        ${t.title}
                    </h2>

                </div>


                <span
                    class="
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-semibold

                        ${
                            t.completed
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                        }
                    "
                >

                    ${
                        t.completed
                            ? "Completed"
                            : "Pending"
                    }

                </span>

            </div>


            <div
                class="
                    flex
                    justify-between
                    items-center
                    pt-3
                    border-t
                    border-gray-100
                "
            >

                <div>

                    <p class="text-xs text-gray-400">
                        User ID
                    </p>

                    <p class="font-medium text-gray-700">
                        ${t.userId ?? "-"}
                    </p>

                </div>


                <div>

                    <p class="text-xs text-gray-400">
                        Task ID
                    </p>

                    <p class="font-medium text-gray-700">
                        #${t.id}
                    </p>

                </div>

            </div>


            <div class="flex gap-2 mt-5">

                <button onclick="editTask(${t.id})"
                    class="
                        text-black
                        relative
                        w-8
                        h-8
                        flex
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-100
                        hover:bg-blue-100

                        before:absolute
                        before:content-['modifier']
                        before:text-xs
                        before:bg-gray-600
                        before:text-white
                        before:p-1
                        before:rounded-lg
                        before:transition-opacity
                        before:pointer-events-none
                        before:opacity-0
                        hover:before:opacity-100
                        before:bottom-[90%]
                    "
                >

                    <i class="fa-solid fa-pen text-xs"></i>

                </button>


                <button onclick="deleteTask(${t.id})"
                    class="
                        text-black
                        relative
                        w-8
                        h-8
                        flex
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-100
                        hover:bg-red-100

                        before:absolute
                        before:content-['supprimer']
                        before:text-xs
                        before:bg-gray-600
                        before:text-white
                        before:p-1
                        before:rounded-lg
                        before:transition-opacity
                        before:pointer-events-none
                        before:opacity-0
                        hover:before:opacity-100
                        before:bottom-[90%]
                    "
                >

                    <i class="fa-solid fa-trash text-xs"></i>

                </button>

            </div>
        `;


        cardContainer.appendChild(card);

    });


 
    totalPage.textContent = totalPages;

    curentPage.textContent =
        `Page ${currentPage} /`;



   

}





prev.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        displayTasks(filteredTasks);
    }

});


next.addEventListener("click", () => {

    if (currentPage < totalPages) {

        currentPage++;

        displayTasks(filteredTasks);
    }

});



function searchTask(value) {

    currentPage = 1;

    filteredTasks = tasks.filter((task) => {

        return task.title
            .toLowerCase()
            .includes(value.toLowerCase());

    });

    displayTasks(filteredTasks);
}


search.addEventListener("input", () => {

    searchTask(search.value);

});



filter.addEventListener("change", () => {

    currentPage = 1;

    filteredTasks = tasks.reduce(
        (acc, task) => {

           
            if (filter.value === "") {

                acc.push(task);
            }


          
            if (
                filter.value === "completed" &&
                task.completed
            ) {

                acc.push(task);
            }


            if (
                filter.value === "pending" &&
                !task.completed
            ) {

                acc.push(task);
            }


            return acc;

        },
        []
    );


    displayTasks(filteredTasks);

});


async function addTask(task) {

    try {

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/todos",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(task)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to add task"
            );

        }


        const data =
            await response.json();


      
    
        tasks.unshift(data);


        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );


        filteredTasks = tasks;

        currentPage = 1;


        displayTasks(filteredTasks);


        return data;


    } catch (error) {

        console.error(
            "Error adding task:",
            error
        );

    }

}


async function deleteTask(id) {

    try {

        const response = await fetch(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
            {
                method: "DELETE"
            }
        );
        let task=tasks.findIndex(t=>t.id===id)
        if(task === -1){
            return
        }
        const confirmed=confirm(`Voulez vous supprimer ${tasks[task].title}?`)
        if(confirmed){
            tasks= tasks.splice(task,1);
           localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );
        filteredTasks = filteredTasks.filter(
            (task) => task.id !== id
        );
         displayTasks(filteredTasks);
        }
        

    } catch (error) {

        console.error(
            "Error deleting task:",
            error
        );

    }

}

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


    
        const valid = checkForm(
            title,
            titleRegex,
            "Le titre doit contenir uniquement des lettres"
        );


        if (!valid) {
            return;
        }

  if (editingTaskId !== null) {
   

        const updatedTask = {

            title: title.value,

            completed: check.checked

        };
    
        


        const success = await updateTask(
            editingTaskId,
            updatedTask
        );


        if (!success) {

            soumettre.textContent = "Erreur";

            return;
        }


        soumettre.textContent = "Modifié";


        form.reset();

        editingTaskId = null;


        setTimeout(() => {

            hideModal();

            soumettre.textContent = "Ajouter";

        }, 1000);


        return;
    }

     
        const task = {

            title: title.value,

            completed: check.checked,

            userId: 1

        };


      
        await addTask(task);


       
        form.reset();


        soumettre.textContent =
            "Ajouté";


     
        setTimeout(() => {

            hideModal();
            soumettre.textContent = "Ajouter";

        }, 1000);
       
       

    }
);

function editTask(id){
    const task=tasks.find(t=>t.id===id)
    if(!task){
        return;
    }
    editingTaskId=id;
    title.value=task.title
    check.checked=task.completed;

    soumettre.textContent = "Modifier";
    modal.classList.remove("hidden");
}

async function updateTask(id, updatedTask) {

    try {

        const response = await fetch(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedTask)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        const data = await response.json();

        console.log("Updated:", data);

   
        tasks = tasks.map((task) => {

            if (task.id === id) {

                return {
                    ...task,
                    ...updatedTask
                };

            }

            return task;
        });

        
        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );
         filteredTasks = tasks;

         currentPage = 1;
         
        displayTasks(filteredTasks);

     
     

        return true;

    } catch (error) {

        console.error(
            "Error updating task:",
            error
        );

        return false;
    }
}


