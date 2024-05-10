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

function challenge(challenge) {
    cy.get('#challenge-' + challenge + '-play').click()
}

function outOfBounds(x, y) {
    cy.get('#piece-stack-out-x').click().type(x)
    cy.get('#piece-stack-out-y').click().type(y)
}

function move(x, y) {
    cy.get('#board-box-' + x + '-' + y).click()
}

    cy.get('#board-box-' + x + '-' + y).click()
}

function moveOut() {
    cy.get('.game-board-out').click()
}

function submit() {
    cy.get('#go-button').click()
    cy.get('#comment-modal-textarea').type('Example comment.')
    cy.get('#comment-modal-button').click().wait(1000)
    cy.on('window:confirm', () => false)
    cy.contains("You have won this Challenge's achievement!").should('be.visible')
}

function add() {
    cy.get('#add-button').click()
}

function next() {
    cy.get('#next-button').click()
}

describe('test file 2', () => {

    it('challenge 2.15', () => {
        challenge(33)
        add()
        cy.get('#board-box-5-1').click()
        cy.get('#board-box-5-3').click()
        cy.get('#board-box-5-5').click()
        cy.get('#board-box-5-7').click()
        cy.get('#board-box-6-0').click()
        cy.get('#board-box-6-2').click()
        cy.get('#board-box-6-4').click()
        cy.get('#board-box-6-6').click()
        cy.get('#board-box-7-1').click()
        cy.get('#board-box-7-3').click()
        cy.get('#board-box-7-5').click()
        cy.get('#board-box-7-7').click()
        cy.get('#board-box-0-0').click().click()
        cy.get('#board-box-0-2').click().click()
        cy.get('#board-box-0-4').click().click()
        cy.get('#board-box-0-6').click().click()
        cy.get('#board-box-1-1').click().click()
        cy.get('#board-box-1-3').click().click()
        cy.get('#board-box-1-5').click().click()
        cy.get('#board-box-1-7').click().click()
        cy.get('#board-box-2-0').click().click()
        cy.get('#board-box-2-2').click().click()
        cy.get('#board-box-2-4').click().click()
        cy.get('#board-box-2-6').click().click()
        add()
        submit()
    })
})