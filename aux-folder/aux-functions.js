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
    if (logMessagesEnabled) console.log("myVar:", myVar, "myData:", myData);
    return myData;
};

const refreshApp = (lists, defaults) => {
    getEl(domElements.navInput).value = "";
    getEl(domElements.todoList).innerHTML = "";
    getEl(domElements.navSelect).insertAdjacentHTML('beforeend', getSelectTemplate(defaults.defaultList == 0 ? "selected" : "", "Mis Listas"));
    for (let i = 0; i < lists.length; i++) {
        getEl(domElements.navSelect).insertAdjacentHTML('beforeend', getSelectTemplate(defaults.defaultList == i ? "selected" : "", lists[i].listName));
    }
    for (let i = 0; i < lists[defaults.defaultList].tasks.length; i++) {
        getEl(domElements.todoList).insertAdjacentHTML('beforeend', getTaskTemplate(templateIDs, i));
        if (logMessagesEnabled) console.log("task:", lists[defaults.defaultList].tasks[i], "id:", i);
        getEl(templateIDs.todoCheck + i).checked = lists[defaults.defaultList].tasks[i].finished;
        getEl(templateIDs.textDesc + i).insertAdjacentHTML('beforeend', lists[defaults.defaultList].tasks[i].taskName);
        getEl(templateIDs.textareaDesc + i).insertAdjacentHTML('beforeend', lists[defaults.defaultList].tasks[i].taskName);
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
    //return ``;
};

let auxFunctions = {
    getData,
    refreshApp,
    getEl
};
export default auxFunctions;