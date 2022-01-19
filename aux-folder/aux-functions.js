import { dummyData } from './dummy-data.js';
import configVars from './config.js';

let dummyDataEnabled = configVars.dummyDataEnabled;
let localStorageEnabled = configVars.localStorageEnabled;
let logMessagesEnabled = configVars.logMessagesEnabled;




const getLists = () => {
    let myLists = [];
    if (dummyDataEnabled) myLists = dummyData;
    else if (localStorageEnabled) myLists = window.localStorage.getItem('myLists');
    if (!Array.isArray(myLists)) {
        myLists = [];
    }
    if (logMessagesEnabled) console.log(myLists);
    return myLists;
};




let auxFunctions = {
    getLists
};
export default auxFunctions;