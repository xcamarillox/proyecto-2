import { dummyLists, dummyDefaults } from './dummy-data.js';
import { configVars, domElements as domE } from './config.js';

let dummyDataEnabled = configVars.dummyDataEnabled;
let localStorageEnabled = configVars.localStorageEnabled;
let logMessagesEnabled = configVars.logMessagesEnabled;
let tIDs = domE.templateIDs;

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
    if (defaults.defaultList == 0) {
        for (let i = 0; i < lists.length; i++) {
            getEl(domE.todoList).insertAdjacentHTML('beforeend', getTaskTemplate(tIDs, i));
            if (logMessagesEnabled) console.log("refreshApp():", "list:", lists[i].listName, "id:", i);
            getEl(tIDs.todoCheck + i).checked = false; //TODO: function to check if all tasks in list are completed
            getEl(tIDs.todoCheck + i).disabled = true;
            getEl(tIDs.textDesc + i).insertAdjacentHTML('beforeend', lists[i].listName);
            getEl(tIDs.textDesc + i).onclick = selectionClick;
            getEl(tIDs.todoCheck + i).onclick = selectionClick;
            getEl(tIDs.textareaDesc + i).insertAdjacentHTML('beforeend', lists[i].listName);
            getEl(tIDs.textareaDesc + i).style.display = "none";
        }
    }
    if (defaults.defaultList > 0) {
        let idx = defaults.defaultList - 1;
        for (let i = 0; i < lists[idx].tasks.length; i++) {
            getEl(domE.todoList).insertAdjacentHTML('beforeend', getTaskTemplate(tIDs, i));
            if (logMessagesEnabled) console.log("refreshApp():", "task:", lists[idx].tasks[i], "id:", i);
            getEl(tIDs.todoCheck + i).checked = lists[idx].tasks[i].finished;
            getEl(tIDs.textDesc + i).insertAdjacentHTML('beforeend', lists[idx].tasks[i].taskName);
            getEl(tIDs.textDesc + i).onclick = selectionClick;
            getEl(tIDs.todoCheck + i).onclick = selectionClick;
            getEl(tIDs.textareaDesc + i).insertAdjacentHTML('beforeend', lists[idx].tasks[i].taskName);
            getEl(tIDs.textareaDesc + i).style.display = "none";
        }
    }
};

const selectionClick = (event) => {
    let index;
    if (window.selectedIndex != null || window.selectedIndex != undefined) {
        index = window.selectedIndex;
        getEl(tIDs.textDesc + index).classList.remove("selected-border");
        getEl(tIDs.textareaDesc + index).classList.remove("selected-border");
        getEl(tIDs.todoCheckDiv + index).classList.remove("selected-border-check");
    }
    window.selectedIndex = getSelectedIndex(event.target.id);
    index = window.selectedIndex;
    getEl(tIDs.textDesc + index).classList.add("selected-border");
    getEl(tIDs.textareaDesc + index).classList.add("selected-border");
    getEl(tIDs.todoCheckDiv + index).classList.add("selected-border-check");
    if (logMessagesEnabled) console.log("selectionClick(2)", event, window.selectedIndex);
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
    let index = window.selectedIndex;
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
    let index = window.selectedIndex;
    if (index == null) return;
    let item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
    window.myLists[window.myDefaults.defaultList - 1].tasks.splice(index, 1);
    if (logMessagesEnabled) console.log("eraseTaskClick()", item, index);
    refreshApp();
};

const copyCutTaskClick = (event) => {
    let index = window.selectedIndex;
    if (index == null) return;
    let item = window.myLists[window.myDefaults.defaultList - 1].tasks[index];
    if (logMessagesEnabled) console.log("copyTaskClick()", item, index);
    //refreshApp();
};

const pasteTaskClick = (event) => {
    let index = window.selectedIndex();
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