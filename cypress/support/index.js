import './commands'

beforeEach(() => {
    // Login
    cy.exec('docker-compose exec -T backend ./manage.py reset_cypress')
})
