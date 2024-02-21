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

  it('opens the challenge content creator', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#challenge-content-button').click()

    cy.contains('Test File')
  })

  it('submitting a code file', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.visit('http://localhost:5173/')
    cy.get('#content-creator-button').click()
    cy.contains('Existing States')
    cy.get('#code-button').click()
    cy.get('textarea').clear()
    cy.get('textarea').type('console.log("slay")')
    cy.get('#code-file-name').type('Code File Test')
    cy.get('#submit-code-file-button').click()
    cy.contains('Challenge Content Creator')
  })
})