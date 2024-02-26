beforeEach('login', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#exampleInputUsername').type('professor@prototype.com')
    cy.get('#exampleInputPassword').type('password')
    cy.on('uncaught:exception', (err, runnable) => {
        return false
    })
    cy.get('#login-button').click()
    cy.viewport(1920, 1080)
    cy.wait(1000)

})

