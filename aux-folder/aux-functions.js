import { dummyLists, dummyDefaults } from './dummy-data.js';
import { configVars, domElements as domE } from './config.js';

let dummyDataEnabled = configVars.dummyDataEnabled;
let localStorageEnabled = configVars.localStorageEnabled;
let logMessagesEnabled = configVars.logMessagesEnabled;

const getData = (myVar) => {
    let myData;
    if (localStorageEnabled) myData = window.localStorage.getItem(myVar);
    else if ("myLists" === myVar && dummyDataEnabled) myData = dummyLists;
    else if ("myDefaults" === myVar && dummyDataEnabled) myData = dummyDefaults;
    if (!Array.isArray(myData) && myVar === "myLists") myData = [];
    if ((Array.isArray(myData) || typeof(myData) != "object") && myVar === "myDefaults") myData = {};
    if (logMessagesEnabled) console.log("getData():", "myVar:", myVar, "myData:", myData);
    return myData;
};

const refreshApp = () => {
    let lists = window.myLists;
    let defaults = window.myDefaults;
    getEl(domE.todoList).textContent = "";
    getEl(domE.navSelect).textContent = "";
    getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectTemplate("***   MIS LISTAS  ***"));
    for (let i = 0; i < lists.length; i++) {
        getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectTemplate(lists[i].listName));
    }
    getEl(domE.navSelect).options[defaults.defaultList].selected = true;
    let item;
    if (defaults.defaultList == 0) {
        item = lists;
        getEl(domE.navTask).style.display = "none";
        getEl(domE.navErase).disabled = true;
        getEl(domE.checkAll).disabled = true;
        getEl(domE.clearAll).disabled = true;
    }
    if (defaults.defaultList > 0) {
        item = lists[defaults.defaultList - 1].tasks;
        getEl(domE.navTask).style.display = "block";
        getEl(domE.navErase).disabled = false;
        getEl(domE.checkAll).disabled = false;
        getEl(domE.clearAll).disabled = false;
    }
    if (logMessagesEnabled) console.log("refreshApp():", "item:", item);
    for (let i = 0; i < item.length; i++) {
        getEl(domE.todoList).insertAdjacentHTML('beforeend', getTaskTemplate(domE, i));
        // ******************** LISTAS ********************
        if (defaults.defaultList == 0) {
            getEl(domE.todoCheckbox + i).checked = false; //TODO: function to check if all tasks in list are completed
            getEl(domE.todoCheckbox + i).disabled = true;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', item[i].listName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', item[i].listName);
        }
        // ******************** TAREAS ********************
        if (defaults.defaultList > 0) {
            getEl(domE.todoCheckbox + i).checked = item[i].finished;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', item[i].taskName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', item[i].taskName);
        }
        getEl(domE.textDesc + i).onclick = selectionClick;
        getEl(domE.todoCheckbox + i).onclick = selectionClick;
        getEl(domE.textareaDesc + i).style.display = "none";
    }
};

const selectionClick = (event) => {
    let index = window.selectedItemIndex;
    if (getEl(domE.todoEditar).textContent == "Editar OK") {
        if (window.myDefaults.defaultList == 0) {
            window.myLists[index].listName = getEl(domE.textareaDesc + index).value;
        }
        if (window.myDefaults.defaultList > 0) {
            window.myLists[window.myDefaults.defaultList - 1].tasks[index].taskName = getEl(domE.textareaDesc + index).value;
        }
        getEl(domE.todoEditar).textContent = "Editar";
    }
    refreshApp();
    window.selectedItemIndex = getSelectedItemIndex(event.target.id);
    index = window.selectedItemIndex;
    if (event.target.classList.contains(domE.todoCheckbox) == true) {
        window.myLists[window.myDefaults.defaultList - 1].tasks[index].finished = event.target.checked;
        if (localStorageEnabled) localStorage.setItem("myDefaults", window.myLists);
    }
    getEl(domE.textDesc + index).classList.add("selected-border");
    getEl(domE.textareaDesc + index).classList.add("selected-border");
    getEl(domE.todoCheckDiv + index).classList.add("selected-border-check");
    if (logMessagesEnabled) console.log("selectionClick()", event, window.selectedItemIndex, window.myLists);
};

const getTaskTemplate = (ids, index) => {
    return `<div class="todolist-item input-group">
                <div class="todo-check input-group-text" id="${ids.todoCheckDiv + index}">
                    <input class="todo-checkbox form-check-input" type="checkbox" value="" id="${ids.todoCheckbox + index}">
                </div>
                <textarea class="form-control" id="${ids.textareaDesc + index}"></textarea>
                <div class="text-desc form-control" id="${ids.textDesc + index}"></div>
            </div>`;
};

const getSelectTemplate = (list) => {
    return `<option>${list}</option>`;
};

const selectChange = (event) => {
    window.myDefaults.defaultList = event.srcElement.options.selectedIndex;
    if (localStorageEnabled) localStorage.setItem("myDefaults", window.myDefaults);
    if (logMessagesEnabled) console.log("selectChange():", window.myLists, window.myDefaults);
    refreshApp();
};

const addItemClick = (event) => {
    if (getEl(domE.navInput).value.trim() == "") {
        getEl(domE.navInput).value = "";
        return;
    }
    if (event.target.id == domE.navList) {
        window.myLists.unshift({
            listName: getEl(domE.navInput).value,
            tasks: []
        });
        if (logMessagesEnabled) console.log("addItemClick():", "lista", window.myLists);
    }
    if (event.target.id == domE.navTask) {
        window.myLists[window.myDefaults.defaultList - 1].tasks.unshift({
            taskName: getEl(domE.navInput).value,
            finished: false
        });
        if (logMessagesEnabled) console.log("addItemClick():", "task", window.myLists);
    }
    if (localStorageEnabled) localStorage.setItem("myLists", window.myLists);
    getEl(domE.navInput).value = "";
    refreshApp();
};

const eraseListClick = (event) => {
    window.myLists.splice(window.myDefaults.defaultList - 1, 1);
    window.myDefaults.defaultList = 0;
    if (localStorageEnabled) {
        localStorage.setItem("myDefaults", window.myDefaults);
        localStorage.setItem("myLists", window.myLists);
    }
    if (logMessagesEnabled) console.log("eraseListClick():", window.myLists);
    refreshApp();
};

const allTasksClick = (event) => {
    let boolVal;
    if (event.target.classList.contains(domE.checkAll) == true) boolVal = true;
    if (event.target.classList.contains(domE.clearAll) == true) boolVal = false;
    for (let i = 0; i < window.myLists[window.myDefaults.defaultList - 1].tasks.length; i++) {
        window.myLists[window.myDefaults.defaultList - 1].tasks[i].finished = boolVal;
    }
    if (logMessagesEnabled) console.log("allTasksClick():", window.myLists, boolVal);
    if (localStorageEnabled) localStorage.setItem("myLists", window.myLists);
    refreshApp();
};

const moveItemClick = (event) => {
    let item, list;
    let index = window.selectedItemIndex;
    if (index == null) return;
    if (window.myDefaults.defaultList == 0) {
        item = window.myLists[window.selectedItemIndex];
        list = window.myLists;
    }
    if (window.myDefaults.defaultList > 0) {
        item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
        list = window.myLists[window.myDefaults.defaultList - 1].tasks;
    }
    list.splice(index, 1);
    if (event.target.classList.contains(domE.todoUp) == true) {
        index = index > 0 ? index - 1 : index;
        list.splice(index, 0, item);
    }
    if (event.target.classList.contains(domE.todoDown) == true) {
        if (index < list.length - 1) {
            index = index + 1;
            list.splice(index, 0, item);
        } else {
            list.push(item);
        }
    }
    if (logMessagesEnabled) console.log("moveItemClick()", item, index, window.myLists);
    refreshApp();
};

const eraseTaskClick = () => {
    let item;
    let index = window.selectedItemIndex;
    if (index == null) return;
    if (window.myDefaults.defaultList == 0) {
        item = window.myLists;
    }
    if (window.myDefaults.defaultList > 0) {
        item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
    }
    item.splice(index, 1);
    if (logMessagesEnabled) console.log("eraseTaskClick()", item, index);
    refreshApp();
};

const copyCutTaskClick = (event) => {
    let item;
    let index = window.selectedItemIndex;
    if (index == null) return;
    if (window.myDefaults.defaultList == 0) {
        item = window.myLists[index];
    }
    if (window.myDefaults.defaultList > 0) {
        item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
    }
    window.copyCutItem = {
        itemIndex: index,
        item: item,
        listIndex: window.myDefaults.defaultList,
        comand: event.target.id
    };
    if (logMessagesEnabled) console.log("copyCutTaskClick()", window.copyCutItem);
};

const pasteTaskClick = () => {
    let listType, itemIndex;
    if (window.myDefaults.defaultList != 0 && window.copyCutItem.listIndex == 0) return;
    if (window.myDefaults.defaultList == 0) {
        listType = window.myLists;
    }
    if (window.myDefaults.defaultList > 0) {
        listType = window.myLists[window.myDefaults.defaultList - 1].tasks;
        //listType = window.myLists;
    }
    listType.unshift(window.copyCutItem.item);
    itemIndex = window.copyCutItem.itemIndex;
    if (window.copyCutItem.comand == "todo-cortar" && window.myDefaults.defaultList == 0) {
        window.myLists.splice(itemIndex + 1, 1);
    }
    if (window.copyCutItem.comand == "todo-cortar" && window.myDefaults.defaultList > 0) {
        window.myLists[window.copyCutItem.listIndex - 1].tasks.splice(window.myDefaults.defaultList == window.copyCutItem.listIndex ? itemIndex + 1 : itemIndex, 1);
    }
    if (logMessagesEnabled) console.log("pasteTaskClick()", listType);
    refreshApp();
};

const editTaskClick = () => {
    let index = window.selectedItemIndex;
    if (getEl(domE.todoEditar).textContent == "Editar") {
        getEl(domE.textDesc + index).style.display = "none";
        getEl(domE.textareaDesc + index).style.display = "block";
        getEl(domE.todoEditar).textContent = "Editar OK";
    } else {
        getEl(domE.textDesc + index).style.display = "block";
        getEl(domE.textareaDesc + index).style.display = "none";
        getEl(domE.todoEditar).textContent = "Editar";
        getEl(domE.textDesc + index).textContent = getEl(domE.textareaDesc + index).value;
        if (window.myDefaults.defaultList == 0) {
            window.myLists[index].listName = getEl(domE.textareaDesc + index).value;
        }
        if (window.myDefaults.defaultList > 0) {
            window.myLists[window.myDefaults.defaultList - 1].tasks[index].taskName = getEl(domE.textareaDesc + index).value;
        }
    }
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
    selectChange,
    addItemClick,
    eraseListClick,
    allTasksClick,
    selectionClick,
    moveItemClick,
    eraseTaskClick,
    copyCutTaskClick,
    pasteTaskClick,
    editTaskClick,
    getEl
};
export default auxFunctions;