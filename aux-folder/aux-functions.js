import { dummyLists, dummyDefaults } from './dummy-data.js';
import { configVars, domElements } from './config.js';

let dummyDataEnabled = configVars.dummyDataEnabled;
let localStorageEnabled = configVars.localStorageEnabled;
let logMessagesEnabled = configVars.logMessagesEnabled;
let templateIDs = domElements.templateIDs;

const getData = (myVar) => {
    let myData;
    if (localStorageEnabled) myData = window.localStorage.getItem(myVar);
    // --------------Name and type check coupled-------------- //
    else if ("myLists" === myVar && dummyDataEnabled) myData = dummyLists;
    else if ("myDefaults" === myVar && dummyDataEnabled) myData = dummyDefaults;
    if (!Array.isArray(myData) && myVar === "myLists") myData = [];
    if ((Array.isArray(myData) || typeof(myData) != "object") && myVar === "myDefaults") myData = {};
    // --------------Name and type check coupled-------------- //
    if (logMessagesEnabled) console.log("getData():", "myVar:", myVar, "myData:", myData);
    return myData;
};

const refreshApp = () => {
    let lists = window.myLists;
    let defaults = window.myDefaults;
    getEl(domElements.navInput).value = "";
    getEl(domElements.todoList).textContent = "";
    getEl(domElements.navSelect).textContent = "";
    getEl(domElements.navSelect).insertAdjacentHTML('beforeend', getSelectTemplate(defaults.defaultList == 0 ? "selected" : "", "Mis Listas"));
    for (let i = 0; i < lists.length; i++) {
        getEl(domElements.navSelect).insertAdjacentHTML('beforeend', getSelectTemplate(defaults.defaultList - 1 == i ? "selected" : "", lists[i].listName));
    }
    if (defaults.defaultList == 0) {
        for (let i = 0; i < lists.length; i++) {
            getEl(domElements.todoList).insertAdjacentHTML('beforeend', getTaskTemplate(templateIDs, i));
            if (logMessagesEnabled) console.log("refreshApp():", "list:", lists[i].listName, "id:", i);
            getEl(templateIDs.todoCheck + i).checked = false; //TODO: function to check if all tasks in list are completed
            getEl(templateIDs.textDesc + i).insertAdjacentHTML('beforeend', lists[i].listName);
            getEl(templateIDs.textDesc + i).onclick = selectionClick;
            getEl(templateIDs.textareaDesc + i).insertAdjacentHTML('beforeend', lists[i].listName);
        }
    }
    if (defaults.defaultList > 0) {
        let idx = defaults.defaultList - 1;
        for (let i = 0; i < lists[idx].tasks.length; i++) {
            getEl(domElements.todoList).insertAdjacentHTML('beforeend', getTaskTemplate(templateIDs, i));
            if (logMessagesEnabled) console.log("refreshApp():", "task:", lists[idx].tasks[i], "id:", i);
            getEl(templateIDs.todoCheck + i).checked = lists[idx].tasks[i].finished;
            getEl(templateIDs.textDesc + i).insertAdjacentHTML('beforeend', lists[idx].tasks[i].taskName);
            getEl(templateIDs.textDesc + i).onclick = selectionClick;
            getEl(templateIDs.textareaDesc + i).insertAdjacentHTML('beforeend', lists[idx].tasks[i].taskName);
        }
    }
};

const getEl = (id) => {
    return document.getElementById(id);
};

const getTaskTemplate = (ids, index) => {
    return `<div class="todolist-item input-group">
                <div class="todo-check input-group-text">
                    <input class="form-check-input" type="checkbox" value="" id="${ids.todoCheck + index}">
                </div>
                <div class="text-desc form-control" id="${ids.textDesc + index}"></div>
                <textarea class="form-control" id="${ids.textareaDesc + index}"></textarea>
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
    if (event.target.id == domElements.navList) {
        window.myLists.push({
            listName: getEl(domElements.navInput).value,
            tasks: []
        });
        if (logMessagesEnabled) console.log("addItemClick():", "lista", window.myLists);
    }
    if (event.target.id == domElements.navTask) {
        window.myLists[window.myDefaults.defaultList - 1].tasks.push({
            taskName: getEl(domElements.navInput).value,
            finished: false
        });
        if (logMessagesEnabled) console.log("addItemClick():", "task", window.myLists);
    }
    if (localStorageEnabled) localStorage.setItem("myLists", window.myLists);
    refreshApp();
};

const eraseTaskClick = (event) => {
    window.myLists.splice(window.myDefaults.defaultList - 1, 1);
    window.myDefaults.defaultList = 0;
    if (localStorageEnabled) {
        localStorage.setItem("myDefaults", window.myDefaults);
        localStorage.setItem("myLists", window.myLists);
    }
    if (logMessagesEnabled) console.log("eraseTaskClick():", window.myLists);
    refreshApp();
};

const allTasksClick = (event) => {
    let boolVal;
    if (event.target.classList.contains(domElements.checkAll) == true) boolVal = true;
    if (event.target.classList.contains(domElements.clearAll) == true) boolVal = false;
    //if (event.target.id == domElements.clearAll) boolVal = false;
    for (let i = 0; i < window.myLists[window.myDefaults.defaultList - 1].tasks.length; i++) {
        window.myLists[window.myDefaults.defaultList - 1].tasks[i].finished = boolVal;
    }
    if (logMessagesEnabled) console.log("allTasksClick(2):", window.myLists, boolVal);
    if (localStorageEnabled) localStorage.setItem("myLists", window.myLists);
    refreshApp();
};

const selectionClick = (event) => {
    console.log("test", window.selected);
    if (window.selected != null || window.selected != undefined) {
        window.selected.classList.remove("selected-border");
    }
    getEl(event.target.id).classList.add("selected-border");
    window.selected = getEl(event.target.id);
};

let auxFunctions = {
    getData,
    refreshApp,
    selectChange,
    addItemClick,
    eraseTaskClick,
    allTasksClick,
    selectionClick,
    getEl
};
export default auxFunctions;