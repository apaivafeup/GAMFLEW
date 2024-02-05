describe('Home Page', () => {
  it('opens the challenge menu', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#single-player-button').click()

    cy.contains('Test File')
  })

  it('opens a challenge module', () => {
    var module = Math.ceil(Math.random(6))
    cy.visit('http://localhost:5173/')
    cy.get('#single-player-button').click()
    cy.get('#accordion-button-' + module).click().wait(500)

    cy.contains('Challenge ' + module + '.').should('be.visible')
  })

  it('opens a challenge', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#single-player-button').click()
    cy.get('.challenge-card').first().click()

    cy.get('#guide-modal')  
    .should('be.visible')

    cy.contains('When you click the')

  })
})