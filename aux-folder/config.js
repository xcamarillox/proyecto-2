let configVars = {
    dummyDataEnabled: true,
    localStorageEnabled: false,
    logMessagesEnabled: true,
};


let domElements = {
    navInput: document.getElementById("nav-input"),
    navAdd: document.getElementById("nav-add"),
    navTask: document.getElementById("nav-task"),
    navList: document.getElementById("nav-list"),
    navSelect: document.getElementById("nav-select"),
    navErase: document.getElementById("nav-erase"),
    todoList: document.getElementById("todo-list"),
    todoMenu: document.getElementById("todo-menu"),
    todoUp: document.getElementById("todo-up"),
    todoDown: document.getElementById("todo-down"),
    todoTools: document.getElementById("todo-tools"),
    todoBorrar: document.getElementById("todo-borrar"),
    todoCopiar: document.getElementById("todo-copiar"),
    todoMover: document.getElementById("todo-mover"),
    todoPegar: document.getElementById("todo-pegar"),
    todoEditar: document.getElementById("todo-editar"),
    todoOp1: document.getElementById("todo-op1"),
    todoOp2: document.getElementById("todo-op2"),
    checkMenu: document.getElementById("check-menu"),
    checkAll: document.getElementById("check-all"),
    clearAll: document.getElementById("clear-all"),
    modalMessage: document.getElementById("modal-message")
};


export { configVars, domElements };