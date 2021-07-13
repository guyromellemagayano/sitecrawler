describe('Sites page', () => {
    beforeEach(() => {
        cy.login()
    })

    it('No available sites on first login', () => {
        cy.visit('/sites/')
        cy.get('h3').should('contain', 'No Available Sites')
    })
})
