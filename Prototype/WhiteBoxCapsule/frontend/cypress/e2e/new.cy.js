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

it('create a challenge', () => {
    cy.get('#challenge-manager-button').click()
    cy.contains('Create Challenge')
    cy.get('#create-challenge-button').click()
    cy.contains('Challenge Creator').should('be.visible')
    cy.get('#input-name-box').type('Test Challenge')
    cy.get('#input-description-box').type('This is a test challenge.')
    cy.get('#input-hint-box').type('This is a hint.')
    cy.get('#input-objective-box').type('Statement coverage of line 0.')
    cy.get('textarea').first().type('board.log.length > 0')
    cy.get('textarea').last().type('board.log.length > 0')
    cy.get('#board-state-select').select(1)
    cy.get('#default-option').click({force: true})
    cy.get('#board-box-0-0').click()
    cy.get('#board-box-0-1').click()
    cy.get('#go-button').click().wait(1000)
    cy.get('#submit-challenge-button').click()
    cy.on('window:alert', (str) => {
        expect(str).to.equal('Challenge submitted successfully!')
    })
})  