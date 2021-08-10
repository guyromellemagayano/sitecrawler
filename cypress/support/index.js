import './commands'

beforeEach(() => {
    // Login
    cy.exec('docker-compose -p web-crawl-app-cypress exec -T backend ./manage.py reset_cypress')
})
