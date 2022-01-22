let dummyDefaults = {
    defaultList: 1
};
let dummyErrorDefaults = {
    defaultList: 1
};

let dummyLists = [{
        listName: "Propositos de año nuevo",
        tasks: [{
                taskName: "hacer deporte",
                finished: false
            },
            {
                taskName: "aprender ingles",
                finished: true
            },
            {
                taskName: "dejar de fumar",
                finished: false
            }
        ]
    },
    {
        listName: "Lista del super",
        tasks: [{
                taskName: "comprar leche",
                finished: true
            },
            {
                taskName: "comprar pan",
                finished: true
            },
            {
                taskName: "pagar la luz",
                finished: false
            }
        ]
    },
    {
        listName: "Hacer diario",
        tasks: [{
                taskName: "Ir al trabajo",
                finished: true
            },
            {
                taskName: "Aprender React",
                finished: true
            },
            {
                taskName: "Aprender Git",
                finished: false
            }
        ]
    }
];

let dummyErrorLists = [{
        tasks: 40,
    },
    {
        listName: "Lista del super",
    },
    {
        tasks: [{
                taskName: "Ir al trabajo",
                finished: 40
            },
            {
                taskName: "Aprender React",
                finished: true
            },
            {
                taskName: "Aprender Git",
                finished: false
            }
        ]
    }
];



export { dummyLists, dummyDefaults, dummyErrorLists, dummyErrorDefaults };