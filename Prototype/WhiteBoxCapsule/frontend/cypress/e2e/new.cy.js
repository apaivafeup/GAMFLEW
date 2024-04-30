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


describe("challenge 1.14", () => {
    it('pass challenge 1.14', () => {
        cy.get('#challenge-14-play').click()

        cy.get('#board-box-1-1').click()
        cy.get('#board-box-3-3').click()
        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-success').should('be.visible')
    })

    it('fail challenge 1.14', () => {
        cy.get('#challenge-14-play').click()

        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-danger').should('be.visible')
    })
})

describe("challenge 1.15", () => {
    it('pass challenge 1.15', () => {
        cy.get('#challenge-15-play').click()

        cy.get('#board-box-5-3').click()
        cy.get('#board-box-3-3').click()
        cy.get('#board-box-2-2').click()
        cy.get('#board-box-4-4').click()
        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-success').should('be.visible')
    })

    it('fail challenge 1.15', () => {
        cy.get('#challenge-15-play').click()

        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-danger').should('be.visible')
    })
})

describe("challenge 1.16", () => {
    it('pass challenge 1.16', () => {
        cy.get('#challenge-16-play').click()

        cy.get('#board-box-1-1').click()
        cy.get('#board-box-3-3').click()
        cy.get('#next-button').click()
        cy.get('#board-box-5-3').click()
        cy.get('#board-box-3-3').click()
        cy.get('#board-box-2-2').click()
        cy.get('#board-box-4-4').click()
        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-success').should('be.visible')
    })

    it('fail challenge 1.16', () => {
        cy.get('#challenge-16-play').click()

        cy.get('#next-button').click()
        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-danger').should('be.visible')
    })
})

describe("challenge 1.17", () => {
    it('pass challenge 1.17', () => {
        cy.get('#challenge-17-play').click()

        cy.get('#board-box-0-0').click()
        cy.get('#board-box-2-2').click()
        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-success').should('be.visible')
    })

    it('fail challenge 1.17', () => {
        cy.get('#challenge-17-play').click()

        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-danger').should('be.visible')
    })
})

describe("challenge 1.18", () => {
    it('pass challenge 1.18', () => {
        cy.get('#challenge-18-play').click()

        cy.get('#board-box-2-2').click()
        cy.get('#board-box-4-4').click()
        cy.get('#next-button').click()
        cy.get('#board-box-0-0').click()
        cy.get('#board-box-2-2').click()
        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-success').should('be.visible')
    })

    it('fail challenge 1.18', () => {
        cy.get('#challenge-18-play').click()

        cy.get('#next-button').click()
        cy.get('#go-button').click()

        // Third section
        cy.get('#comment-modal-textarea').type('Example comment.')
        cy.get('#comment-modal-button').click().wait(1000)
        cy.on('window:confirm', () => false)

        // Fourth section
        cy.get('.alert-danger').should('be.visible')
    })
})
