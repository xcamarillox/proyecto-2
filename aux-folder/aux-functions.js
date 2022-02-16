import { dummyLists, dummyDefaultListIndex } from './dummy-data.js';
import { configVars, domElements as domE } from './config.js';

let dummyDataEnabled = configVars.dummyDataEnabled;
let localStorageEnabled = configVars.localStorageEnabled;
let logMessagesEnabled = configVars.logMessagesEnabled;

const getData = (myVar) => {
    let myData;
    if (localStorageEnabled) myData = JSON.parse(window.localStorage.getItem(myVar));
    else if ("myLists" === myVar && dummyDataEnabled) myData = dummyLists;
    else if ("myDefaultListIndex" === myVar && dummyDataEnabled) myData = dummyDefaultListIndex;
    if (myVar === "myLists" && !Array.isArray(myData)) myData = [];
    if (myVar === "myDefaultListIndex" && (isNaN(myData) || myData == null || myData > window.lists.length)) myData = 0;
    if (localStorageEnabled) window.localStorage.setItem(myVar, JSON.stringify(myData));
    if (logMessagesEnabled) console.log("getData():", "myVar:", myVar, "myData:", myData);
    return myData;
};

const refreshApp = () => {
    let lists = window.lists;
    let defaultIndex = window.defaultListIndex;
    getEl(domE.todoList).textContent = "";
    getEl(domE.navSelect).textContent = "";
    if (lists.length == 0) getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectListHtmlTemplate("MIS LISTAS"));
    else getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectListHtmlTemplate("#. [ " + listStatus(-1, true) + " ] -> MIS LISTAS"));
    for (let i = 0; i < lists.length; i++) {
        getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectListHtmlTemplate(i + 1 + ". [ " + listStatus(i, true) + " ] -> " + lists[i].listName));
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
        getEl(domE.todoList).insertAdjacentHTML('beforeend', getItemHtmlTemplate(domE, i, defaultIndex));
        // ******************** LISTAS ********************
        if (defaultIndex == 0) {
            getEl(domE.todoCheckbox + i).checked = listStatus(i, false);
            getEl(domE.todoCheckbox + i).disabled = true;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', lists[i].listName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', lists[i].listName);
        }
        // ******************** TAREAS ********************
        if (defaultIndex > 0) {
            getEl(domE.todoCheckbox + i).checked = lists[i].finished;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', lists[i].taskName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', lists[i].taskName);
            if (lists[i].finished) getEl(domE.textDesc + i).classList.add("done");
        }
        getEl(domE.textDesc + i).onclick = itemSelectionClick;
        getEl(domE.todoCheckbox + i).onclick = itemSelectionClick;
        getEl(domE.textareaDesc + i).style.display = "none";
    }
};

const itemSelectionClick = (event) => {
    let index;
    editModeCheck(window.selectedItemIndex);
    if (!event.target.classList.contains(domE.todoCheckbox) &&
        getSelectedItemIndex(event.target.id) == window.selectedItemIndex)
        return;
    index = getSelectedItemIndex(event.target.id);
    if (event.target.classList.contains(domE.todoCheckbox)) {
        window.lists[window.defaultListIndex - 1].tasks[index].finished = event.target.checked;
        if (localStorageEnabled) window.localStorage.setItem("myLists", JSON.stringify(window.lists));
        //if (index == window.selectedItemIndex) return;
    }
    //if (window.selectedItemIndex != null) 
    refreshApp();
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
    editModeCheck(window.selectedItemIndex);
    window.selectedItemIndex = null;
    window.defaultListIndex = event.srcElement.options.selectedIndex;
    if (localStorageEnabled) window.localStorage.setItem("myDefaultListIndex", JSON.stringify(window.defaultListIndex));
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
        window.defaultListIndex = 1;
        if (localStorageEnabled) window.localStorage.setItem("myDefaultListIndex", JSON.stringify(window.defaultListIndex));
        if (logMessagesEnabled) console.log("addItemClick():", "lista", window.lists);
    }
    if (event.target.id == domE.navTask) {
        window.lists[window.defaultListIndex - 1].tasks.unshift({
            taskName: getEl(domE.navInput).value,
            finished: false
        });
        if (logMessagesEnabled) console.log("addItemClick():", "task", window.lists);
    }
    getEl(domE.navInput).value = "";
    window.selectedItemIndex = null;
    if (localStorageEnabled) window.localStorage.setItem("myLists", JSON.stringify(window.lists));
    refreshApp();
};

const eraseListClick = (event) => {
    window.lists.splice(window.defaultListIndex - 1, 1);
    window.defaultListIndex = 0;
    if (localStorageEnabled) {
        window.localStorage.setItem("myDefaultListIndex", JSON.stringify(window.defaultListIndex));
        window.localStorage.setItem("myLists", JSON.stringify(window.lists));
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
    if (localStorageEnabled) window.localStorage.setItem("myLists", JSON.stringify(window.lists));
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
    if (localStorageEnabled) window.localStorage.setItem("myLists", JSON.stringify(window.lists));
    if (logMessagesEnabled) console.log("moveItemClick()", listItem, itemIndex, window.lists);
    refreshApp();
    staySelected();
};

const eraseItemClick = () => {
    editModeCheck(window.selectedItemIndex);
    if (window.selectedItemIndex == null) return;
    let listType;
    if (window.defaultListIndex == 0) {
        listType = window.lists;
    }
    if (window.defaultListIndex > 0) {
        listType = window.lists[window.defaultListIndex - 1].tasks;
    }
    listType.splice(window.selectedItemIndex, 1);
    window.selectedItemIndex = null;
    if (localStorageEnabled) window.localStorage.setItem("myLists", JSON.stringify(window.lists));
    if (logMessagesEnabled) console.log("eraseItemClick()", listType, window.selectedItemIndex);
    refreshApp();
};

const copyCutItemClick = (event) => {
    editModeCheck(window.selectedItemIndex);
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
    editModeCheck(window.selectedItemIndex);
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
    listType.unshift(JSON.parse(JSON.stringify(window.copyCutItem.listItem)));
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
    if (localStorageEnabled) window.localStorage.setItem("myLists", JSON.stringify(window.lists));
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
        if (localStorageEnabled) window.localStorage.setItem("myLists", JSON.stringify(window.lists));
    }
    if (logMessagesEnabled) console.log("editItemClick()");
};

const editModeCheck = (index) => {
    if (getEl(domE.todoEditar).textContent == "Editar OK") {
        if (window.defaultListIndex == 0) {
            window.lists[index].listName = getEl(domE.textareaDesc + index).value;
        }
        if (window.defaultListIndex > 0) {
            window.lists[window.defaultListIndex - 1].tasks[index].taskName = getEl(domE.textareaDesc + index).value;
        }
        getEl(domE.todoEditar).textContent = "Editar";
        if (localStorageEnabled) window.localStorage.setItem("myLists", JSON.stringify(window.lists));
    }
};


const listStatus = (index, statusRequest) => {
    let finishedTasksCount = 0;
    if (index == -1) {
        let finishedListsCount = 0;
        for (let j = 0; j < window.lists.length; j++) {
            for (let i = 0; i < window.lists[j].tasks.length; i++) {
                if (window.lists[j].tasks[i].finished) finishedTasksCount++;
            }
            if (finishedTasksCount == window.lists[j].tasks.length && window.lists[j].tasks.length != 0) finishedListsCount++;
            finishedTasksCount = 0;
        }
        if (statusRequest) return finishedListsCount + "/" + window.lists.length;
        else return finishedListsCount == window.lists.length;
    } else {
        for (let i = 0; i < window.lists[index].tasks.length; i++) {
            if (window.lists[index].tasks[i].finished) finishedTasksCount++;
        }
        if (statusRequest) return finishedTasksCount + "/" + window.lists[index].tasks.length;
        else return (finishedTasksCount == window.lists[index].tasks.length && window.lists[index].tasks.length > 0);
    }
};

const getItemHtmlTemplate = (ids, index, listIndex) => {
    return `<div class="todolist-item input-group">
                <div class="todo-check input-group-text" id="${ids.todoCheckDiv + index}">
                    <span>${index + 1}<span>
                    <input class="todo-checkbox form-check-input" type="checkbox" value="" id="${ids.todoCheckbox + index}">
                    <span>${listIndex == 0 ?  "[" +  listStatus(index, true) + "]" :""}<span>
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