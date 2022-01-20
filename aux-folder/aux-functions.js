import { dummyLists, dummyDefaults } from './dummy-data.js';
import { configVars, domElements } from './config.js';

let dummyDataEnabled = configVars.dummyDataEnabled;
let localStorageEnabled = configVars.localStorageEnabled;
let logMessagesEnabled = configVars.logMessagesEnabled;


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

const refresh = (lists, defaults) => {
    domElements.navInput.value = "";
    for (const task of lists[defaults.defaultList].tasks) {
        console.log(task);
    }
};



let auxFunctions = {
    getData,
    refresh
};
export default auxFunctions;