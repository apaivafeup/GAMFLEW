beforeEach('login', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#exampleInputUsername').type('professor')
    cy.get('#exampleInputPassword').type('password')
    cy.get('#login-button').click()
    cy.viewport(1920, 1080)
    cy.wait(1000)
})

describe('challenge content', () => {
    it('create new board state', () => {
        cy.get('#challenge-content-button').click()
        cy.get('#existing-states-select').select(1)
        cy.get('#default-option').click({ force: true })
        cy.get('#board-box-0-0 > .red').should('be.visible')
        cy.get('#add-button').click()
        cy.get('#board-box-0-0').click()
        cy.get('#board-box-0-0 > .blue').should('be.visible')
        cy.get('#add-button').click()
        cy.get('#state-name').type('Test State')
        cy.get('#submit-button').click()
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Board state created successfully!')
        })
        cy.reload()
        cy.get('#test-state-option').should('exist')
    })

    it('create new code file', () => {
        cy.get('#challenge-content-button').click()
        cy.get('#code-button').click()
        cy.get('textarea').clear().type('console.log("Hello, World!")')
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.get('.language-javascript').contains('console.log("Hello, World!').should('be.visible')
        cy.get('#code-file-name').type('Test File 0')
        cy.get('#submit-code-file-button').click()
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Code file created successfully!')
        })
    })
})
