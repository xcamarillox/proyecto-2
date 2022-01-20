import auxFunctions from './aux-folder/aux-functions.js';
import { configVars, domElements } from './aux-folder/config.js';

let logMessagesEnabled = configVars.logMessagesEnabled;

let myLists = auxFunctions.getData("myLists");
let myDefaults = auxFunctions.getData("myDefaults");

console.log(myLists[20]);
console.log(myDefaults.objetonuevo);
console.log(myLists[myDefaults.objetonuevo]);
//console.log(lists[40].tasks)

auxFunctions.refresh(myLists, myDefaults);