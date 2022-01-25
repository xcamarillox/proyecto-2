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
    if (!Array.isArray(myData) && myVar === "myLists") myData = [];
    if (!isNaN(myVar) && myVar === "myDefaultListIndex") myData = 0;
    if (logMessagesEnabled) console.log("getData():", "myVar:", myVar, "myData:", myData);
    return myData;
};

const refreshApp = () => {
    let lists = window.lists;
    let defaults = window.defaultListIndex;
    getEl(domE.todoList).textContent = "";
    getEl(domE.navSelect).textContent = "";
    getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectListHtmlTemplate("***   MIS LISTAS  ***"));
    for (let i = 0; i < lists.length; i++) {
        getEl(domE.navSelect).insertAdjacentHTML('beforeend', getSelectListHtmlTemplate(lists[i].listName));
    }
    getEl(domE.navSelect).options[defaults].selected = true;
    let item;
    if (defaults == 0) {
        item = lists;
        getEl(domE.navTask).style.display = "none";
        getEl(domE.todoCortar).style.display = "none";
        getEl(domE.navErase).disabled = true;
        getEl(domE.checkAll).disabled = true;
        getEl(domE.clearAll).disabled = true;
    }
    if (defaults > 0) {
        item = lists[defaults - 1].tasks;
        getEl(domE.navTask).style.display = "block";
        getEl(domE.todoCortar).style.display = "block";
        getEl(domE.navErase).disabled = false;
        getEl(domE.checkAll).disabled = false;
        getEl(domE.clearAll).disabled = false;
    }
    if (logMessagesEnabled) console.log("refreshApp():", "item:", item);
    for (let i = 0; i < item.length; i++) {
        getEl(domE.todoList).insertAdjacentHTML('beforeend', getItemHtmlTemplate(domE, i));
        // ******************** LISTAS ********************
        if (defaults == 0) {
            getEl(domE.todoCheckbox + i).checked = false; //TODO: function to check if all tasks in list are completed
            getEl(domE.todoCheckbox + i).disabled = true;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', item[i].listName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', item[i].listName);
        }
        // ******************** TAREAS ********************
        if (defaults > 0) {
            getEl(domE.todoCheckbox + i).checked = item[i].finished;
            getEl(domE.textDesc + i).insertAdjacentHTML('beforeend', item[i].taskName);
            getEl(domE.textareaDesc + i).insertAdjacentHTML('beforeend', item[i].taskName);
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
    //refreshApp();
    window.selectedItemIndex = getSelectedItemIndex(event.target.id);
    index = window.selectedItemIndex;
    if (event.target.classList.contains(domE.todoCheckbox) == true) {
        window.lists[window.defaultListIndex - 1].tasks[index].finished = event.target.checked;
        if (localStorageEnabled) localStorage.setItem("myDefaultListIndex", window.lists);
    }
    refreshApp();
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
    window.defaultListIndex = event.srcElement.options.selectedIndex;
    if (localStorageEnabled) localStorage.setItem("myDefaultListIndex", window.defaultListIndex);
    if (logMessagesEnabled) console.log("selectListChange():", window.lists, window.defaultListIndex);
    window.selectedItemIndex = null;
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
    if (event.target.classList.contains(domE.checkAll) == true) boolVal = true;
    if (event.target.classList.contains(domE.clearAll) == true) boolVal = false;
    for (let i = 0; i < window.lists[window.defaultListIndex - 1].tasks.length; i++) {
        window.lists[window.defaultListIndex - 1].tasks[i].finished = boolVal;
    }
    if (logMessagesEnabled) console.log("allItemsClick():", window.lists, boolVal);
    if (localStorageEnabled) localStorage.setItem("myLists", window.lists);
    refreshApp();
};

const moveItemClick = (event) => {
    let item, list;
    let index = window.selectedItemIndex;
    if (index == null) return;
    if (window.defaultListIndex == 0) {
        item = window.lists[window.selectedItemIndex];
        list = window.lists;
    }
    if (window.defaultListIndex > 0) {
        item = window.lists[window.defaultListIndex - 1].tasks[index];
        list = window.lists[window.defaultListIndex - 1].tasks;
    }
    list.splice(index, 1);
    if (event.target.classList.contains(domE.todoUp) == true) {
        index = index > 0 ? index - 1 : index;
        list.splice(index, 0, item);
        window.selectedItemIndex = index;
    }
    if (event.target.classList.contains(domE.todoDown) == true) {
        if (index < list.length - 1) {
            index = index + 1;
            list.splice(index, 0, item);
            window.selectedItemIndex = index;
        } else {
            list.push(item);
            window.selectedItemIndex = list.length - 1;
        }
    }
    if (logMessagesEnabled) console.log("moveItemClick()", item, index, window.lists);
    refreshApp();
    staySelected();
};

const eraseItemClick = () => {
    let item;
    let index = window.selectedItemIndex;
    if (index == null) return;
    if (window.defaultListIndex == 0) {
        item = window.lists;
    }
    if (window.defaultListIndex > 0) {
        item = window.lists[window.defaultListIndex - 1].tasks[index];
    }
    item.splice(index, 1);
    if (logMessagesEnabled) console.log("eraseItemClick()", item, index);
    refreshApp();
};

const copyCutItemClick = (event) => {
    let item;
    let index = window.selectedItemIndex;
    if (index == null) return;
    if (window.defaultListIndex == 0) {
        item = window.lists[index];
    }
    if (window.defaultListIndex > 0) {
        item = window.lists[window.defaultListIndex - 1].tasks[index];
    }
    window.copyCutItem = {
        itemIndex: index,
        item: item,
        listIndex: window.defaultListIndex,
        comand: event.target.id
    };
    if (logMessagesEnabled) console.log("copyCutItemClick()", window.copyCutItem);
};

const pasteItemClick = () => {
    let listType, itemIndex;
    if (window.copyCutItem == null) return;
    if (window.defaultListIndex != 0 && window.copyCutItem.listIndex == 0) return;
    if (window.defaultListIndex == 0) {
        listType = window.lists;
    }
    if (window.defaultListIndex > 0) {
        listType = window.lists[window.defaultListIndex - 1].tasks;
    }
    listType.unshift(window.copyCutItem.item);
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
    let index = window.selectedItemIndex;
    if (index == null) return;
    if (getEl(domE.todoEditar).textContent == "Editar") {
        getEl(domE.textDesc + index).style.display = "none";
        getEl(domE.textareaDesc + index).style.display = "block";
        getEl(domE.todoEditar).textContent = "Editar OK";
    } else {
        getEl(domE.textDesc + index).style.display = "block";
        getEl(domE.textareaDesc + index).style.display = "none";
        getEl(domE.todoEditar).textContent = "Editar";
        getEl(domE.textDesc + index).textContent = getEl(domE.textareaDesc + index).value;
        if (window.defaultListIndex == 0) {
            window.lists[index].listName = getEl(domE.textareaDesc + index).value;
        }
        if (window.defaultListIndex > 0) {
            window.lists[window.defaultListIndex - 1].tasks[index].taskName = getEl(domE.textareaDesc + index).value;
        }
    }
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