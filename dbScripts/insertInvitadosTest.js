db.Invitado.insert({
    firstName: 'Luis',
    lastName: 'Cordoba',
    secondLastName: 'Granera',
    cantidadInvitados: 2,
    invitados: [],
    code: '270993'
})

db.Invitado.insert({
    firstName: 'Familia',
    lastName: 'Granera',
    secondLastName: 'Blanco',
    cantidadInvitados: 2,
    invitados: [],
    code: '230163'
})

db.Invitado.insert({
    firstName: 'Kryssia',
    lastName: 'Ramirez',
    secondLastName: 'Astorga',
    confirmado: true,
    cantidadInvitados: 3,
    invitados: [{
        firstName: 'Hans',
        lastName: 'Drexler',
        secondLastName: 'Ramírez'
    }, {
        firstName: 'Gloriela',
        lastName: 'Martinez',
        secondLastName: 'Castro'
    }],
    code: '281271'
})