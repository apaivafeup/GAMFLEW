beforeEach('login', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })
    cy.visit('http://localhost:5173/')
    cy.get('#exampleInputUsername').type('professor')
    cy.get('#exampleInputPassword').type('password')
    cy.get('#login-button').click()
    cy.wait(1000)
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:5173/#/challenges')
})



describe("challenge 2.8", () => {
    it('pass challenge 2.8', () => {
        cy.get('#challenge-26-play').click().wait(1000)

        cy.get('#add-button').click()
        cy.get('#board-box-0-1').click().click()
        cy.get('#board-box-4-0').click()
        cy.get('#add-button').click()
        cy.get('#next-button').click()
        // Third section
        cy.get('#go-button').click()
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)
        cy.get('.alert-success').should('be.visible')
    })

    it('fail challenge 2.8', () => {
        cy.get('#challenge-26-play').click().wait(1000)

        cy.get('#next-button').click()
        // Third section
        cy.get('#go-button').click()
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)
        cy.get('.alert-danger').should('be.visible')
    })
})



