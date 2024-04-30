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

describe('test file 4', () => {
    describe("challenge 4.9", () => {
        it('pass challenge 4.9', () => {
            // Section 1
            cy.get('#challenge-57-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click().click()
            cy.get('#board-box-5-3').click().click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-3').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            
            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 4.9', () => {
            // Section 1
            cy.get('#challenge-57-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click().click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })
})





