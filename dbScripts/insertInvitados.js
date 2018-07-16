db.Invitado.insert({
    firstName: 'Luis',
    lastName: 'Cordoba',
    secondLastName: 'Granera',
    confirmado: true,
    invitados: [{
        firstName: 'Maria',
        lastName: 'Drexler',
        secondLastName: 'Ramírez',
        confirmado: false
    }]
})

db.Invitado.insert({
    firstName: 'Kryssia',
    lastName: 'Ramirez',
    secondLastName: 'Astorga',
    confirmado: true,
    invitados: [{
        firstName: 'Hans',
        lastName: 'Drexler',
        secondLastName: 'Ramírez',
        confirmado: true
    }, {
        firstName: 'Gloriela',
        lastName: 'Martinez',
        secondLastName: 'Castro',
        confirmado: false
    }]
})