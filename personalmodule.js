document.addEventListener("DOMContentLoaded", function () {
    const listNameInput = document.getElementById("listname-input");
    const listBtn = document.getElementById("add_list");
    const listContainer = document.getElementById("list-container");

    listBtn.addEventListener("click", addNewList);

    let draggedItem = null;

    loadListData();

    function addNewList() {
        const listNameValue = listNameInput.value.trim();
        if (listNameValue !== "") {
            const newList = document.createElement("li");
            newList.classList.add("list-item");
            newList.textContent = listNameValue;

            const deliteBtn = document.createElement("button");
            deliteBtn.classList.add("delete-btn");

            const chackBtn = document.createElement("button");
            chackBtn.classList.add("chack-btn");

            const symbolText = document.createElement("div");
            symbolText.classList.add("pencil");

            deliteBtn.addEventListener("click", function () {
                deleteList(newList);
            });

            chackBtn.addEventListener("click", function () {
                toggleActive(newList);
            });

            newList.draggable = true;
            newList.addEventListener("dragstart", handleDragStart);
            newList.addEventListener("dragover", handleDragOver);
            newList.addEventListener("dragend", handleDragEnd);
            newList.addEventListener("drop", handleDrop);

            listContainer.appendChild(newList);
            newList.appendChild(symbolText);
            newList.appendChild(chackBtn);
            newList.appendChild(deliteBtn);
            listNameInput.value = "";

            saveListData();
        }
    }

    function deleteList(item) {
        item.remove();
    
        saveListData();
    }

    function toggleActive(item) {
        if (item) {
            item.classList.toggle("active");
        }
        saveListData();
    }

    function handleDragStart(e) {
        draggedItem = e.target;
        e.target.classList.add("dragging");
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDragEnd(e) {
        e.target.classList.remove("dragging");
    }

    function handleDrop(e) {
        if (draggedItem !== e.target) {
            const newPosition = Array.from(listContainer.children).indexOf(e.target);
            if (newPosition > -1) {
                listContainer.removeChild(draggedItem);
                listContainer.insertBefore(
                    draggedItem,
                    listContainer.children[newPosition]
                );
            }
            saveListData();
        }
    }

    listContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("pencil")) {
            const listItem = e.target.parentElement;
            const isEditing = listItem.getAttribute("data-editing");

            if (isEditing === "true") {
                listItem.contentEditable = false;
                listItem.removeAttribute("data-editing");
            } else {
                listItem.contentEditable = true;
                listItem.setAttribute("data-editing", "true");
                listItem.focus();
            }
        }
    });

    listContainer.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.target.contentEditable = false;
            e.target.removeAttribute("data-editing");

            saveListData();
        }
    });

    function saveListData() {
        const listItems = listContainer.querySelectorAll(".list-item");
        const listData = [];
        listItems.forEach((item) => {
            listData.push({
                text: item.textContent,
                completed: item.classList.contains("active")
            });
        });
        localStorage.setItem("lists", JSON.stringify(listData));
    }

    function loadListData() {
        const savedLists = localStorage.getItem("lists");
        if (savedLists) {
            const parsedLists = JSON.parse(savedLists);
            parsedLists.forEach((listItem) => {
                const newList = document.createElement("li");
                newList.classList.add("list-item");
                newList.textContent = listItem.text;

                if (listItem.completed) {
                    newList.classList.add("active");
                }

                const deliteBtn = document.createElement("button");
                deliteBtn.classList.add("delete-btn");

                const chackBtn = document.createElement("button");
                chackBtn.classList.add("chack-btn");

                const symbolText = document.createElement("div");
                symbolText.classList.add("pencil");

                deliteBtn.addEventListener("click", function () {
                    deleteList(newList);
                });

                chackBtn.addEventListener("click", function () {
                    toggleActive(newList);
                });

                newList.draggable = true;
                newList.addEventListener("dragstart", handleDragStart);
                newList.addEventListener("dragover", handleDragOver);
                newList.addEventListener("dragend", handleDragEnd);
                newList.addEventListener("drop", handleDrop);

                listContainer.appendChild(newList);
                newList.appendChild(symbolText);
                newList.appendChild(chackBtn);
                newList.appendChild(deliteBtn);
            });
        }
    }

    function saveTextAsFile() {
        const listContainer = document.getElementById("list-container");
        const listItems = listContainer.querySelectorAll(".list-item");

        let textContent = "";

        listItems.forEach((item, index) => {
            const listItemText = item.textContent.trim();
            textContent += `${index + 1}. ${listItemText}\n`;
        });

        const fileName = "ToDoList.txt";

        // Створення нового Blob об'єкту з текстовим вмістом
        const blob = new Blob([textContent], { type: "text/plain" });

        // Створення посилання для завантаження
        const link = document.createElement("a");
        link.download = fileName;
        link.href = window.URL.createObjectURL(blob);
        link.click();

        // Очищення посилання з пам'яті
        window.URL.revokeObjectURL(link.href);
    }

    // Додавання обробника події для кнопки "Зберегти як TXT"
    const saveAsTxtButton = document.getElementById("save-as-txt");
    saveAsTxtButton.addEventListener("click", saveTextAsFile);
    
});


