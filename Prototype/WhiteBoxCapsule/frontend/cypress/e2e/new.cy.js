beforeEach('login', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#exampleInputUsername').type('professor@prototype.com')
    cy.get('#exampleInputPassword').type('password')
    cy.get('#login-button').click()
    cy.viewport(1920, 1080)
    cy.wait(1000)
})

it('create new code file', () => {
    cy.get('#challenge-content-button').click()
    cy.get('#code-button').click()
    cy.get('textarea').clear().
})

