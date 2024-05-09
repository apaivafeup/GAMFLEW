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

function next() {
    cy.get('#next-button').click()
}

describe('test file 1', () => {
    it('challenge 1.1', () => {
        challenge(1)
        outOfBounds(10, 10)
        move(0, 0)
        moveOut()
        submit()
    })

    it('challenge 1.2', () => {
        challenge(2)
        outOfBounds(10, 20)
        move(0, 0)
        moveOut()
        next()
        move(0, 0)
        move(0, 1)
        submit()
    })

    it('challenge 1.3', () => {
        challenge(3)
        cy.get('#board-box-2-0').click()
        cy.get('#board-box-3-1').click()
        cy.get('#next-button').click()
        cy.get('#board-box-2-0').click()
        outOfBounds(10, 30)
        cy.get('.game-board-out > .box').click()
        cy.get('#next-button').click()
        cy.get('#board-box-2-0').click()
        cy.get('#piece-stack-out-x').type('8')
        cy.get('.game-board-out > .box').click()
        cy.get('#next-button').click()
        cy.get('#board-box-2-0').click()
        cy.get('.game-board-out > .box').click()
        cy.get('#next-button').click()
        cy.get('#board-box-2-0').click()
        cy.get('#piece-stack-out-y').type('8')
        cy.get('.game-board-out > .box').click()
        submit()
    })

    it('challenge 1.4', () => {
        challenge(4)
        move(0, 0)
        move(1, 4)
        submit()
    })

    it('challenge 1.5', () => {
        challenge(5)
        move(0, 0)
        move(5, 6)
        cy.get('#next-button').click()
        cy.get('#board-box-2-0').click()
        cy.get('#board-box-3-1').click()
        submit()
    })

    it('challenge 1.6', () => {
        challenge(6)
        move(0, 0)
        move(6, 6)
        submit()
    })

    it('challenge 1.7', () => {
        challenge(7)
        move(0, 0)
        moveOut()
        moveOut()
        move(0, 0)
        submit()
    })

    it('challenge 1.8', () => {
        challenge(8)
        outOfBounds(-2, -2)
        move(0, 0)
        moveOut()
        moveOut()
        move(0, 0)
        submit()
    })

    it('challenge 1.9', () => {
        challenge(9)
        cy.get('#board-box-2-4').click()
        cy.get('#board-box-3-4').click()
        cy.get('#board-box-3-4').click()
        cy.get('#board-box-4-5').click()
        cy.get('#next-button').click()
        cy.get('#board-box-2-0').click()
        cy.get('#board-box-4-2').click()
        submit()
    })

    it('challenge 1.10', () => {
        challenge(10)
        cy.get('#board-box-1-1').click()
        move(4, 5)
        cy.get('#board-box-0-0').click()
        move(1, 1)
        submit()
    })

    it('challenge 1.11', () => {
        challenge(11)
        move(0, 0)
        move(1, 1)
        submit()
    })

    it('challenge 1.12', () => {
        challenge(12)
        move(0, 0)
        move(1, 1)
        next()
        move(5, 1)
        move(4, 0)
        submit()
    })

    it('challenge 1.13', () => {
        challenge(13)
        move(2, 0)
        move(4, 2)
        submit()
    })

    it('challenge 1.14', () => {
        challenge(14)
        move(6, 0)
        move(4, 2)
        submit()
    })

    it('challenge 1.15', () => {
        challenge(15)
        move(5, 1)
        move(3, 1)
        move(2, 0)
        move(4, 2)
        submit()
    })

    it('challenge 1.16', () => {
        challenge(16)
        move(1, 1)
        move(3, 3)
        next()
        move(0, 0)
        move(2, 2)
        submit()
    })

    it('challenge 1.17', () => {
        challenge(17)
        move(7, 1)
        move(5, 3)
        submit()
    })

    it('challenge 1.18', () => {
        challenge(18)
        move(0, 0)
        move(3, 4)
        move(3, 4)
        move(5, 6)
        next()
        move(0, 0)
        move(2, 2)
        submit()
    })
})