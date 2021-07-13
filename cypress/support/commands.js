Cypress.Commands.add('login', () => {
    cy.request('POST', '/api/auth/login/', {
        username: Cypress.env('username'),
        password: Cypress.env('password'),
    })
})
