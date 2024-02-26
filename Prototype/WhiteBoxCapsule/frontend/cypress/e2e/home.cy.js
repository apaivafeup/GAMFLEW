beforeEach('login', () => {
  cy.visit('http://localhost:5173/')
  cy.get('#exampleInputUsername').type('professor@prototype.com')
  cy.get('#exampleInputPassword').type('password')
  cy.get('#login-button').click({ force: true })
  cy.viewport(1920, 1080)
  cy.wait(1000)
})

describe('Home Page', () => {
  it('shows loading page', () => {
    cy.visit('http://localhost:5173/#/loading')
    cy.wait(1000)
    cy.contains('Loading...')
  })

  it('opens the challenge menu', () => {

    cy.get('#single-player-button').click()

    cy.contains('Test File')
  })

  it('opens a challenge module', () => {
    var module = Math.ceil(Math.random(6))

    cy.get('#single-player-button').click()
    cy.get('#accordion-button-' + module).click().wait(500)

    cy.contains('Challenge ' + module + '.').should('be.visible')
  })

  it('opens a challenge', () => {

    cy.get('#single-player-button').click()
    cy.get('.challenge-card').first().click()

    cy.contains('Out of Bounds').should('be.visible')

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