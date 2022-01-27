import { dummyLists, dummyDefaultListIndex } from './dummy-data.js';
import { configVars, domElements as domE } from './config.js';

let dummyDataEnabled = configVars.dummyDataEnabled;
let localStorageEnabled = configVars.localStorageEnabled;
let logMessagesEnabled = configVars.logMessagesEnabled;

const getData = (myVar) => {
    let myData;
    if (localStorageEnabled) myData = window.localStorage.getItem(myVar);
    else if ("myLists" === myVar && dummyDataEnabled) myData = dummyLists;
    else if ("myDefaultListIndex" === myVar && dummyDataEnabled) myData = dummyDefaultListIndex;
    if (myVar === "myLists" && !Array.isArray(myData)) myData = [];
    if (myVar === "myDefaultListIndex" && isNaN(myData)) myData = 0;
    if (logMessagesEnabled) console.log("getData():", "myVar:", myVar, "myData:", myData);
    return myData;
};

const refreshApp = () => {
    let lists = window.lists;
    let defaultIndex = window.defaultListIndex;
    getEl(domE.todoList).textContent = "";
    getEl(domE.navSelect).textContent = "";
    getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectListHtmlTemplate("***   MIS LISTAS  ***"));
    for (let i = 0; i < lists.length; i++) {
        getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectListHtmlTemplate(lists[i].listName));
    }
    getEl(domE.navSelect).options[defaultIndex].selected = true;
    if (defaultIndex == 0) {
        getEl(domE.navTask).style.display = "none";
        getEl(domE.todoCortar).style.display = "none";
        getEl(domE.navErase).disabled = true;
        getEl(domE.checkAll).disabled = true;
        getEl(domE.clearAll).disabled = true;
    }
    if (defaultIndex > 0) {
        lists = lists[defaultIndex - 1].tasks;
        getEl(domE.navTask).style.display = "block";
        getEl(domE.todoCortar).style.display = "block";
        getEl(domE.navErase).disabled = false;
        getEl(domE.checkAll).disabled = false;
        getEl(domE.clearAll).disabled = false;
    }
    if (logMessagesEnabled) console.log("refreshApp():", "item:", lists);
    for (let i = 0; i < lists.length; i++) {
        getEl(domE.todoList).insertAdjacentHTML('beforeend', getItemHtmlTemplate(domE, i));
        // ******************** LISTAS ********************
        if (defaultIndex == 0) {
            getEl(domE.todoCheckbox + i).checked = false; //TODO: function to check if all tasks in list are completed
            getEl(domE.todoCheckbox + i).disabled = true;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', lists[i].listName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', lists[i].listName);
        }
        // ******************** TAREAS ********************
        if (defaultIndex > 0) {
            getEl(domE.todoCheckbox + i).checked = lists[i].finished;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', lists[i].taskName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', lists[i].taskName);
        }
        getEl(domE.textDesc + i).onclick = itemSelectionClick;
        getEl(domE.todoCheckbox + i).onclick = itemSelectionClick;
        getEl(domE.textareaDesc + i).style.display = "none";
    }
};

const itemSelectionClick = (event) => {
    let index = window.selectedItemIndex;
    if (getEl(domE.todoEditar).textContent == "Editar OK") {
        if (window.defaultListIndex == 0) {
            window.lists[index].listName = getEl(domE.textareaDesc + index).value;
        }
        if (window.defaultListIndex > 0) {
            window.lists[window.defaultListIndex - 1].tasks[index].taskName = getEl(domE.textareaDesc + index).value;
        }
        getEl(domE.todoEditar).textContent = "Editar";
    }
    if (!event.target.classList.contains(domE.todoCheckbox) &&
        getSelectedItemIndex(event.target.id) == window.selectedItemIndex)
        return;
    index = getSelectedItemIndex(event.target.id);
    if (event.target.classList.contains(domE.todoCheckbox)) {
        window.lists[window.defaultListIndex - 1].tasks[index].finished = event.target.checked;
        if (localStorageEnabled) localStorage.setItem("myDefaultListIndex", window.lists);
        if (index == window.selectedItemIndex) return;
    }
    if (window.selectedItemIndex != null) refreshApp();
    window.selectedItemIndex = index;
    getEl(domE.textDesc + index).classList.add("selected-border");
    getEl(domE.textareaDesc + index).classList.add("selected-border");
    getEl(domE.todoCheckDiv + index).classList.add("selected-border-check");
    if (logMessagesEnabled) console.log("itemSelectionClick()", event, window.selectedItemIndex, window.lists);
};

const staySelected = () => {
    let index = window.selectedItemIndex;
    if (getEl(domE.todoEditar).textContent == "Editar OK") {
        getEl(domE.todoEditar).textContent = "Editar";
    }
    if (index != null) {
        getEl(domE.textDesc + index).classList.add("selected-border");
        getEl(domE.textareaDesc + index).classList.add("selected-border");
        getEl(domE.todoCheckDiv + index).classList.add("selected-border-check");
    }
};

const selectListChange = (event) => {
    window.selectedItemIndex = null;
    window.defaultListIndex = event.srcElement.options.selectedIndex;
    if (localStorageEnabled) localStorage.setItem("myDefaultListIndex", window.defaultListIndex);
    if (logMessagesEnabled) console.log("selectListChange():", window.lists, window.defaultListIndex);
    refreshApp();
};

const addItemClick = (event) => {
    if (getEl(domE.navInput).value.trim() == "") {
        getEl(domE.navInput).value = "";
        return;
    }
    if (event.target.id == domE.navList) {
        window.lists.unshift({
            listName: getEl(domE.navInput).value,
            tasks: []
        });
        if (logMessagesEnabled) console.log("addItemClick():", "lista", window.lists);
    }
    if (event.target.id == domE.navTask) {
        window.lists[window.defaultListIndex - 1].tasks.unshift({
            taskName: getEl(domE.navInput).value,
            finished: false
        });
        if (logMessagesEnabled) console.log("addItemClick():", "task", window.lists);
    }
    if (localStorageEnabled) localStorage.setItem("myLists", window.lists);
    getEl(domE.navInput).value = "";
    refreshApp();
};

const eraseListClick = (event) => {
    window.lists.splice(window.defaultListIndex - 1, 1);
    window.defaultListIndex = 0;
    if (localStorageEnabled) {
        localStorage.setItem("myDefaultListIndex", window.defaultListIndex);
        localStorage.setItem("myLists", window.lists);
    }
    if (logMessagesEnabled) console.log("eraseListClick():", window.lists);
    refreshApp();
};

const allItemsClick = (event) => {
    let boolVal;
    if (event.target.classList.contains(domE.checkAll)) boolVal = true;
    if (event.target.classList.contains(domE.clearAll)) boolVal = false;
    for (let i = 0; i < window.lists[window.defaultListIndex - 1].tasks.length; i++) {
        window.lists[window.defaultListIndex - 1].tasks[i].finished = boolVal;
    }
    if (logMessagesEnabled) console.log("allItemsClick():", window.lists, boolVal);
    if (localStorageEnabled) localStorage.setItem("myLists", window.lists);
    refreshApp();
    staySelected();
};

const moveItemClick = (event) => {
    if (window.selectedItemIndex == null) return;
    let listItem, listType;
    let itemIndex = window.selectedItemIndex;
    if (window.defaultListIndex == 0) {
        listItem = window.lists[itemIndex];
        listType = window.lists;
    }
    if (window.defaultListIndex > 0) {
        listItem = window.lists[window.defaultListIndex - 1].tasks[itemIndex];
        listType = window.lists[window.defaultListIndex - 1].tasks;
    }
    listType.splice(itemIndex, 1);
    if (event.target.classList.contains(domE.todoUp)) {
        itemIndex = itemIndex > 0 ? itemIndex - 1 : itemIndex;
        listType.splice(itemIndex, 0, listItem);
        window.selectedItemIndex = itemIndex;
    }
    if (event.target.classList.contains(domE.todoDown)) {
        if (itemIndex < listType.length - 1) {
            itemIndex = itemIndex + 1;
            listType.splice(itemIndex, 0, listItem);
            window.selectedItemIndex = itemIndex;
        } else {
            listType.push(listItem);
            window.selectedItemIndex = listType.length - 1;
        }
    }
    if (logMessagesEnabled) console.log("moveItemClick()", listItem, itemIndex, window.lists);
    refreshApp();
    staySelected();
};

const eraseItemClick = () => {
    if (window.selectedItemIndex == null) return;
    let listType;
    if (window.defaultListIndex == 0) {
        listType = window.lists;
    }
    if (window.defaultListIndex > 0) {
        listType = window.lists[window.defaultListIndex - 1].tasks;
    }
    window.selectedItemIndex = null;
    listType.splice(window.selectedItemIndex, 1);
    if (logMessagesEnabled) console.log("eraseItemClick()", listType, window.selectedItemIndex);
    refreshApp();
};

const copyCutItemClick = (event) => {
    if (window.selectedItemIndex == null) return;
    let listItem;
    let itemIndex = window.selectedItemIndex;
    if (window.defaultListIndex == 0) {
        listItem = window.lists[itemIndex];
    }
    if (window.defaultListIndex > 0) {
        listItem = window.lists[window.defaultListIndex - 1].tasks[itemIndex];
    }
    window.copyCutItem = {
        itemIndex,
        listItem: JSON.parse(JSON.stringify(listItem)),
        listIndex: window.defaultListIndex,
        comand: event.target.id
    };
    if (logMessagesEnabled) console.log("copyCutItemClick()", window.copyCutItem);
};

const pasteItemClick = () => {
    if (window.copyCutItem == null) return;
    if (window.defaultListIndex != 0 && window.copyCutItem.listIndex == 0) return;
    if (window.defaultListIndex == 0 && window.copyCutItem.listIndex != 0) return;
    let listType, itemIndex;
    if (window.defaultListIndex == 0) {
        listType = window.lists;
    }
    if (window.defaultListIndex > 0) {
        listType = window.lists[window.defaultListIndex - 1].tasks;
    }
    listType.unshift(window.copyCutItem.listItem);
    itemIndex = window.copyCutItem.itemIndex;
    if (window.copyCutItem.comand == "todo-cortar" && window.defaultListIndex == 0) {
        window.lists.splice(itemIndex + 1, 1);
    }
    if (window.copyCutItem.comand == "todo-cortar" && window.defaultListIndex > 0) {
        window.lists[window.copyCutItem.listIndex - 1].tasks.splice(window.defaultListIndex == window.copyCutItem.listIndex ? itemIndex + 1 : itemIndex, 1);
    }
    if (logMessagesEnabled) console.log("pasteItemClick()", listType, window.selectedItemIndex);
    if (window.selectedItemIndex != null) {
        window.selectedItemIndex = 0;
    }
    window.copyCutItem = null;
    refreshApp();
    staySelected();
};

const editItemClick = () => {
    if (window.selectedItemIndex == null) return;
    let itemIndex = window.selectedItemIndex;
    if (getEl(domE.todoEditar).textContent == "Editar") {
        getEl(domE.textDesc + itemIndex).style.display = "none";
        getEl(domE.textareaDesc + itemIndex).style.display = "block";
        getEl(domE.todoEditar).textContent = "Editar OK";
    } else {
        getEl(domE.textDesc + itemIndex).style.display = "block";
        getEl(domE.textareaDesc + itemIndex).style.display = "none";
        getEl(domE.todoEditar).textContent = "Editar";
        getEl(domE.textDesc + itemIndex).textContent = getEl(domE.textareaDesc + itemIndex).value;
        if (window.defaultListIndex == 0) {
            window.lists[itemIndex].listName = getEl(domE.textareaDesc + itemIndex).value;
        }
        if (window.defaultListIndex > 0) {
            window.lists[window.defaultListIndex - 1].tasks[itemIndex].taskName = getEl(domE.textareaDesc + itemIndex).value;
        }
    }
    if (logMessagesEnabled) console.log("editItemClick()");
};

const getItemHtmlTemplate = (ids, index) => {
    return `<div class="todolist-item input-group">
                <div class="todo-check input-group-text" id="${ids.todoCheckDiv + index}">
                    <input class="todo-checkbox form-check-input" type="checkbox" value="" id="${ids.todoCheckbox + index}">
                </div>
                <textarea class="form-control" id="${ids.textareaDesc + index}"></textarea>
                <div class="text-desc form-control" id="${ids.textDesc + index}"></div>
            </div>`;
};

const getSelectListHtmlTemplate = (list) => {
    return `<option>${list}</option>`;
};

const getSelectedItemIndex = (id) => {
    let index;
    try {
        index = parseInt(id[id.length - 1]);
    } catch (error) {
        index = null;
    }
    return index;
};

const getEl = (id) => {
    return document.getElementById(id);
};

let auxFunctions = {
    getData,
    refreshApp,
    selectListChange,
    addItemClick,
    eraseListClick,
    allItemsClick,
    itemSelectionClick,
    moveItemClick,
    eraseItemClick,
    copyCutItemClick,
    pasteItemClick,
    editItemClick,
};
export default auxFunctions;