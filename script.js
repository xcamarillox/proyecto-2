import auxFunctions from './aux-folder/aux-functions.js';
import { configVars, domElements } from './aux-folder/config.js';

auxFunctions.getEl(domElements.navSelect).onchange = auxFunctions.selectChange;
auxFunctions.getEl(domElements.navList).onclick = auxFunctions.addItemClick;
auxFunctions.getEl(domElements.navTask).onclick = auxFunctions.addItemClick;
auxFunctions.getEl(domElements.navErase).onclick = auxFunctions.eraseTaskClick;

window.myLists = auxFunctions.getData("myLists");
window.myDefaults = auxFunctions.getData("myDefaults");


auxFunctions.refreshApp(myLists, myDefaults);