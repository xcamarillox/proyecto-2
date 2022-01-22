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
    getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectTemplate(defaults.defaultList == 0 ? "selected" : "", "*** MIS LISTAS ***"));
    for (let i = 0; i < lists.length; i++) {
        getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectTemplate(defaults.defaultList - 1 == i ? "selected" : "", lists[i].listName));
    }
    let item;
    if (defaults.defaultList == 0) {
        item = lists;
        getEl(domE.navTask).style.display = "none";
        getEl(domE.navErase).disabled = true;
    }
    if (defaults.defaultList > 0) {
        item = lists[defaults.defaultList - 1].tasks;
        getEl(domE.navTask).style.display = "block";
        getEl(domE.navErase).disabled = false;
    }
    if (logMessagesEnabled) console.log("refreshApp():", "item:", item);
    for (let i = 0; i < item.length; i++) {
        getEl(domE.todoList).insertAdjacentHTML('beforeend', getTaskTemplate(domE, i));
        // ********************LISTAS
        if (defaults.defaultList == 0) {
            getEl(domE.todoCheck + i).checked = false; //TODO: function to check if all tasks in list are completed
            getEl(domE.todoCheck + i).disabled = true;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', item[i].listName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', item[i].listName);
        }
        // ********************TAREAS
        if (defaults.defaultList > 0) {
            getEl(domE.todoCheck + i).checked = item[i].finished;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', item[i].taskName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', item[i].taskName);
        }
        getEl(domE.textDesc + i).onclick = selectionClick;
        getEl(domE.todoCheck + i).onclick = selectionClick;
        getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', item[i].listName);
        getEl(domE.textareaDesc + i).style.display = "none";
    }
};

const selectionClick = (event) => {
    let index;
    if (window.selectedItemIndex != null || window.selectedItemIndex != undefined) {
        index = window.selectedItemIndex;
        getEl(domE.textDesc + index).classList.remove("selected-border");
        getEl(domE.textareaDesc + index).classList.remove("selected-border");
        getEl(domE.todoCheckDiv + index).classList.remove("selected-border-check");
    }
    window.selectedItemIndex = getSelectedIndex(event.target.id);
    index = window.selectedItemIndex;
    getEl(domE.textDesc + index).classList.add("selected-border");
    getEl(domE.textareaDesc + index).classList.add("selected-border");
    getEl(domE.todoCheckDiv + index).classList.add("selected-border-check");
    if (logMessagesEnabled) console.log("selectionClick(2)", event, window.selectedItemIndex);
};

const getTaskTemplate = (ids, index) => {
    return `<div class="todolist-item input-group">
                <div class="todo-check input-group-text" id="${ids.todoCheckDiv + index}">
                    <input class="form-check-input" type="checkbox" value="" id="${ids.todoCheck + index}">
                </div>
                <textarea class="form-control" id="${ids.textareaDesc + index}"></textarea>
                <div class="text-desc form-control" id="${ids.textDesc + index}"></div>
            </div>`;
};

const getSelectTemplate = (selected, list) => {
    return `<option ${selected}>${list}</option>`;
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
        window.myLists.push({
            listName: getEl(domE.navInput).value,
            tasks: []
        });
        if (logMessagesEnabled) console.log("addItemClick():", "lista", window.myLists);
    }
    if (event.target.id == domE.navTask) {
        window.myLists[window.myDefaults.defaultList - 1].tasks.push({
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
    //if (event.target.id == domE.clearAll) boolVal = false;
    for (let i = 0; i < window.myLists[window.myDefaults.defaultList - 1].tasks.length; i++) {
        window.myLists[window.myDefaults.defaultList - 1].tasks[i].finished = boolVal;
    }
    if (logMessagesEnabled) console.log("allTasksClick():", window.myLists, boolVal);
    if (localStorageEnabled) localStorage.setItem("myLists", window.myLists);
    refreshApp();
};

const moveItemClick = (event) => {
    let index = window.selectedItemIndex;
    if (index == null) return;
    let item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
    window.myLists[window.myDefaults.defaultList - 1].tasks.splice(index, 1);
    if (event.target.classList.contains(domE.todoUp) == true) {
        index = index > 0 ? index - 1 : index;
        window.myLists[window.myDefaults.defaultList - 1].tasks.splice(index, 0, item);
    }
    if (event.target.classList.contains(domE.todoDown) == true) {
        if (index < window.myLists[window.myDefaults.defaultList - 1].tasks.length - 1) {
            index = index + 1;
            window.myLists[window.myDefaults.defaultList - 1].tasks.splice(index, 0, item);
        } else {
            window.myLists[window.myDefaults.defaultList - 1].tasks.push(item);
        }
    }
    if (logMessagesEnabled) console.log("moveItemClick()", event, item, index);
    refreshApp();
};

const eraseTaskClick = (event) => {
    let index = window.selectedItemIndex;
    if (index == null) return;
    let item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
    window.myLists[window.myDefaults.defaultList - 1].tasks.splice(index, 1);
    if (logMessagesEnabled) console.log("eraseTaskClick()", item, index);
    refreshApp();
};

const copyCutTaskClick = (event) => {
    let index = window.selectedItemIndex;
    if (index == null) return;
    let item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
    if (logMessagesEnabled) console.log("copyTaskClick()", item, index);
    //refreshApp();
};

const pasteTaskClick = (event) => {
    let index = window.selectedItemIndex();
    if (index == null) return;
    let item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
    if (logMessagesEnabled) console.log("copyTaskClick()", item, index);
    //refreshApp();
};

const getSelectedIndex = (id) => {
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
    getEl
};
export default auxFunctions;