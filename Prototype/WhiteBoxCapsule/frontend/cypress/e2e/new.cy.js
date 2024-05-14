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

function moveTo(x1, y1, x2, y2) {
    cy.get('#board-box-' + x1 + '-' + y1).click()
    cy.get('#board-box-' + x2 + '-' + y2).click()
}

function click(x, y) {
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
    cy.contains("You passed, congratulations!").should('be.visible')
}

function add() {
    cy.get('#add-button').click()
}

function next() {
    cy.get('#next-button').click()
}

describe('test file 4', () => {
    it('challenge 3.14', () => {
        challenge(47)
        add()
        click(5, 1)
        click(5, 1)
        add()
        moveTo(5, 1, 0, 1)
        moveTo(0, 1, 3, 3)
        next()
        add()
        click(5, 1)
        click(5, 1)
        add()
        moveTo(5, 1, 0, 1)
        add()
        click(1, 2)
        click(1, 2)
        click(1, 0)
        click(1, 0)
        add()
        submit()
    })
})