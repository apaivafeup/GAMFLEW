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

function blue(x, y) {
    cy.get('#board-box-' + x + '-' + y).click().click()
}

function red(x, y) {
    cy.get('#board-box-' + x + '-' + y).click()
}

function writeOut(x, y) {
    cy.get('#piece-stack-out-x').click().type(x)
    cy.get('#piece-stack-out-y').click().type(y)
}

function moveOut() {
    cy.get('.game-board-out').click()
}

function submit(challenge) {
    cy.get('#go-button').click()
    cy.get('#comment-modal-textarea').type('Example comment.')
    cy.get('#comment-modal-button').click().wait(1000)
    cy.on('window:confirm', () => false)
    cy.contains("You passed, congratulations!").should('be.visible')
    cy.contains("You have won this Challenge's achievement!").should('be.visible')
}

function add() {
    cy.get('#add-button').click()
}

function next() {
    cy.get('#next-button').click()
}

describe('test file 7', () => {
    it('challenge 7.13', () => {
        challenge(99)
        add()
        blue(0, 0)
        blue(0, 1)
        blue(0, 2)
        red(0, 3)
        red(0, 4)
        red(0, 5)
        add()
        writeOut(13, 7)
        red(0, 0)
        moveOut()
        red(0, 1)
        moveOut()
        red(0, 2)
        moveOut()
        red(0, 3)
        moveOut()
        red(0, 4)
        moveOut()
        red(0, 5)
        moveOut()
        submit("7.13")
    })
})