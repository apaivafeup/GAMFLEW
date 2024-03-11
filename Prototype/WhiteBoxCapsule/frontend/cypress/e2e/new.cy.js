beforeEach('login', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#exampleInputUsername').type('professor')
    cy.get('#exampleInputPassword').type('password')
    cy.on('uncaught:exception', (err, runnable) => {
        return false
    })
    cy.get('#login-button').click()
    cy.viewport(1920, 1080)
    cy.wait(1000)

})


describe("challenge 2.6", () => {
    it('pass challenge 2.6', () => {
        
        cy.get('#single-player-button').click().wait(1000)
        cy.get('#accordion-button-2').click()
        cy.get('#challenge-card-24').click()
        
        cy.get('#add-button').click()
        for (let i = 0; i < 8; i = i + 1) {
            if (i == 3 || i == 4) {
                continue;
            }

            if (i % 2 != 0) {
                for (let j = 1; j <= 7; j = j + 2) {
                    if (i > 4)
                        cy.get('#board-box-' + i + '-' + j).click()
                    else 
                        cy.get('#board-box-' + i + '-' + j).click().click()
                }
            } else {
                for (let j = 0; j <= 7; j = j + 2) {
                    if (i > 4)
                        cy.get('#board-box-' + i + '-' + j).click()
                    else
                        cy.get('#board-box-' + i + '-' + j).click().click()
                }

            }
        }
        cy.get('#add-button').click()
        cy.get('#next-button').click()
        cy.get('#add-button').click()
        
        cy.get('#go-button').click()
        cy.get('.alert-success').should('be.visible')
    })

    it('fail challenge 2.6', () => {
        
        cy.get('#single-player-button').click().wait(1000)
        cy.get('#accordion-button-2').click()
        cy.get('#challenge-card-24').click().wait(1000)
        
        cy.get('#next-button').click()
        cy.get('#go-button').click()
        cy.get('.alert-danger').should('be.visible')
    })
})