import auxF from './aux-folder/aux-functions.js'; // auxFunctions
import { domElements as domE } from './aux-folder/config.js';

window.lists = auxF.getData("myLists");
window.defaultListIndex = auxF.getData("myDefaultListIndex");
window.selectedItemIndex = null;
window.copyCutItem = null;

document.getElementById(domE.navSelect).onchange = auxF.selectListChange;
document.getElementById(domE.navList).onclick = auxF.addItemClick;
document.getElementById(domE.navTask).onclick = auxF.addItemClick;
document.getElementById(domE.navErase).onclick = auxF.eraseListClick;
document.getElementById(domE.checkAll).onclick = auxF.allItemsClick;
document.getElementById(domE.clearAll).onclick = auxF.allItemsClick;
document.getElementById(domE.todoUp).onclick = auxF.moveItemClick;
document.getElementById(domE.todoDown).onclick = auxF.moveItemClick;
document.getElementById(domE.todoBorrar).onclick = auxF.eraseItemClick;
document.getElementById(domE.todoCopiar).onclick = auxF.copyCutItemClick;
document.getElementById(domE.todoCortar).onclick = auxF.copyCutItemClick;
document.getElementById(domE.todoPegar).onclick = auxF.pasteItemClick;
document.getElementById(domE.todoEditar).onclick = auxF.editItemClick;

auxF.refreshApp();