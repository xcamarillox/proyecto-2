import auxFunctions from './aux-folder/aux-functions.js';
import { configVars, domElements } from './aux-folder/config.js';

auxFunctions.getEl(domElements.navSelect).onchange = auxFunctions.selectChange;

let logMessagesEnabled = configVars.logMessagesEnabled;
window.myLists = auxFunctions.getData("myLists");
window.myDefaults = auxFunctions.getData("myDefaults");

//console.log(myLists[20]);
//console.log(myDefaults.objetonuevo);
//console.log(myLists[myDefaults.objetonuevo]);
//console.log(lists[40].tasks)

auxFunctions.refreshApp(myLists, myDefaults);