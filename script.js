import auxF from './aux-folder/aux-functions.js'; // auxFunctions
import { configVars, domElements as domE } from './aux-folder/config.js';

window.myLists = auxF.getData("myLists");
window.myDefaults = auxF.getData("myDefaults");
window.selectedItemIndex = null;
window.copyCutItemID = null;

auxF.getEl(domE.navSelect).onchange = auxF.selectChange;
auxF.getEl(domE.navList).onclick = auxF.addItemClick;
auxF.getEl(domE.navTask).onclick = auxF.addItemClick;
auxF.getEl(domE.navErase).onclick = auxF.eraseListClick;
auxF.getEl(domE.checkAll).onclick = auxF.allTasksClick;
auxF.getEl(domE.clearAll).onclick = auxF.allTasksClick;
auxF.getEl(domE.todoUp).onclick = auxF.moveItemClick;
auxF.getEl(domE.todoDown).onclick = auxF.moveItemClick;
auxF.getEl(domE.todoBorrar).onclick = auxF.eraseTaskClick;
auxF.getEl(domE.todoCopiar).onclick = auxF.copyCutTaskClick;
auxF.getEl(domE.todoCortar).onclick = auxF.copyCutTaskClick;
auxF.getEl(domE.todoPegar).onclick = auxF.pasteTaskClick;
auxF.getEl(domE.todoEditar).onclick = auxF.editTaskClick;

auxF.refreshApp(myLists, myDefaults);