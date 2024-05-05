beforeEach('login', () => {
  cy.visit('http://localhost:5173/')
  cy.get('#exampleInputUsername').type('professor')
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
    cy.get('#challenge-content-button').click()

    cy.contains('Code')
  })
})