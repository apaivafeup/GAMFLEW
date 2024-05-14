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

describe('test file 2', () => {   
    it('challenge 2.1', () => {
        challenge(19)
        add()
        click(3, 0)
        click(4, 1)
        click(4, 1)
        add()
        submit()
    })

    it('challenge 2.2', () => {
        challenge(20)
        add()
        for (let i = 5; i < 8; i = i + 1) {
            if (i == 5 || i == 7) {
                for (let j = 1; j <= 7; j = j + 2) {
                    cy.get('#board-box-' + i + '-' + j).click()
                }
            } else {
                for (let j = 0; j <= 7; j = j + 2) {
                    cy.get('#board-box-' + i + '-' + j).click()
                }
            }
        }
        for (let i = 0; i < 3; i = i + 1) {
            if (i == 1) {
                for (let j = 1; j <= 7; j = j + 2) {
                    cy.get('#board-box-' + i + '-' + j).click().click()
                }
            } else {
                for (let j = 0; j <= 7; j = j + 2) {
                    cy.get('#board-box-' + i + '-' + j).click().click()
                }
            }
        }
        add()
        submit()
    })

    it('challenge 2.3', () => {
        challenge(21)
        add()
        click(3, 0)
        click(3, 0)
        click(3, 2)
        click(3, 2)
        click(3, 4)
        click(3, 4)
        click(0, 1)
        add()
        next()
        submit()
    })

    it('challenge 2.4', () => {
        challenge(22)
        cy.get('#add-button').click()
        cy.get('#board-box-5-0').click().click()
        cy.get('#add-button').click()
        cy.get('#next-button').click()
        add()
        for (var i = 4; i < 5; i++) {
            for (var j = 0; j <= 7; j++) {
                click(i, j)
            }
        }
        add()
        cy.get('#next-button').click()
        submit()
    })

    it('challenge 2.5', () => {
        challenge(23)
        add()
        for (let i = 0; i < 3; i = i + 1) {
            if (i % 2 != 0) {
                for (let j = 1; j <= 7; j = j + 2) {
                    cy.get('#board-box-' + i + '-' + j).click().click()
                }
            } else {
                for (let j = 0; j <= 7; j = j + 2) {
                    cy.get('#board-box-' + i + '-' + j).click().click()
                }
            }
        }
        add()
        cy.get('#next-button').click()
        add()
        for (let i = 5; i < 8; i = i + 1) {
            if (i % 2 != 0) {
                for (let j = 1; j <= 7; j = j + 2) {
                    cy.get('#board-box-' + i + '-' + j).click()
                }
            } else {
                for (let j = 0; j <= 7; j = j + 2) {
                    cy.get('#board-box-' + i + '-' + j).click()
                }
            }
        }
        add()
        cy.get('#next-button').click()
        add()
        click(0, 0)
        click(0, 0)
        click(0, 1)
        submit()
    })

    it('challenge 2.6', () => {
        challenge(24)
        cy.get('#add-button').click()
        click(0, 0)
        click(1, 1)
        click(2, 2)
        click(2, 2)
        click(3, 3)
        click(3, 3)
        click(4, 4)
        click(4, 4)
        click(5, 5)
        click(5, 5)
        click(6, 6)
        click(6, 6)
        click(7, 7)
        click(7, 7)
        cy.get('#add-button').click()
        cy.get('#next-button').click()
        cy.get('#add-button').click()
        submit()
    })

    it('challenge 2.7', () => {
        challenge(25)
        cy.get('#next-button').click()
        cy.get('#add-button').click()
        cy.get('#board-box-0-1').click()
        cy.get('#board-box-0-3').click().click()
        cy.get('#board-box-0-5').click()
        cy.get('#board-box-0-7').click().click()
        cy.get('#add-button').click()
        submit()
    })

    it('challenge 2.8', () => {
        challenge(26)
        add()
        click(0, 0)
        click(0, 0)
        click(0, 4)
        click(0, 4)
        click(0, 6)
        click(0, 6)
        click(4, 0)
        click(4, 0)
        add()
        next()
        add()
        click(4, 0)
        add()
        submit()
    })

    it('challenge 2.9', () => {
        challenge(27)
        add()
        click(0, 0)
        click(0, 2)
        click(0, 4)
        click(0, 6)
        click(1, 1)
        click(4, 0)
        click(4, 0)
        click(4, 1)
        click(4, 1)
        add()
        next()
        submit()
    })

    it('challenge 2.10', () => {
        challenge(28)
        click(0, 0)
        click(2, 3)
        click(2, 3)
        click(1, 0)
        submit()
    })

    it('challenge 2.11', () => {
        challenge(29)
        add()
        click(1, 1)
        click(1, 1)
        click(1, 3)
        click(1, 3)
        add()
        click(0, 0)
        click(0, 1)
        submit()
    })

    it('challenge 2.12', () => {
        challenge(30)
        click(0, 0)
        click(2, 7)
        click(2, 7)
        click(1, 0)
        submit()
    })

    it('challenge 2.13', () => {
        challenge(31)
        add()
        for (var i = 0; i < 1; i++) {
            for (var j = 0; j < 8; j++) {
                click(i, j)
                click(i, j)
            }
        }
        for (var i = 1; i < 2; i++) {
            for (var j = 0; j < 7; j++) {
                click(i, j)
            }
        }
        add()
        submit()
    })

    it('challenge 2.14', () => {
        challenge(32)
        add()
        click(1, 0)
        click(0, 0)
        click(0, 0)
        add()
        next()
        add()
        click(0, 0)
        click(0, 0)
        click(0, 1)
        click(0, 1)
        click(0, 2)
        click(0, 2)
        click(0, 3)
        click(0, 3)
        click(0, 4)
        click(0, 4)
        click(0, 5)
        click(0, 5)
        click(0, 6)
        click(0, 6)
        click(1, 0)
        click(1, 1)
        click(1, 2)
        click(1, 3)
        click(1, 4)
        click(1, 5)
        click(1, 6)
        add()
        submit()
    })

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

describe('test file 3', () => {
    it('challenge 3.1', () => {
        challenge(34)
        add()
        click(0, 0)
        add()
        click(0, 0)
        click(7, 0)
        submit()
    })

    it('challenge 3.2', () => {
        challenge(35)
        add()
        click(0, 0)
        add()
        click(0, 0)
        click(7, 0)
        click(7, 0)
        click(3, 1)
        add()
        click(2, 0)
        click(4, 2)
        add()
        submit()
    })

    it('challenge 3.3', () => {
        challenge(36)
        add()
        click(5, 1)
        click(5, 1)
        click(0, 0)
        click(0, 2)
        click(0, 3)
        click(0, 4)
        click(0, 5)
        add()
        click(5, 1)
        click(0, 1)
        next()
        add()
        click(5, 1)
        add()
        submit()
    })

    it('challenge 3.4', () => {
        challenge(37)
        add()
        click(5, 1)
        click(5, 1)
        click(1, 0)
        click(1, 0)
        click(2, 1)
        click(2, 1)
        click(3, 1)
        click(3, 1)
        add()
        click(5, 1)
        click(0, 0)
        click(1, 0)
        click(0, 1)
        click(2, 1)
        click(0, 2)
        click(3, 1)
        click(0, 3)
        next()
        add()
        click(5, 1)
        add()
        submit()
    })

    it('challenge 3.5', () => {
        challenge(38)
        add()
        click(5, 1)
        click(5, 1)
        click(5, 2)
        click(5, 2)
        click(5, 3)
        click(5, 4)
        add()
        submit()
    })

    it('challenge 3.6', () => {
        challenge(39)
        add()
        click(5, 1)
        click(5, 1)
        click(5, 2)
        click(5, 2)
        click(5, 3)
        click(5, 3)
        click(5, 4)
        click(5, 5)
        click(5, 6)
        add()
        submit()
    })

    it('challenge 3.7', () => {
        challenge(40)
        add()
        click(5, 1)
        click(5, 1)
        click(5, 2)
        add()
        next()
        add()
        click(5, 1)
        add()
        submit()
    })

    it('challenge 3.8', () => {
        challenge(41)
        add()
        click(5, 1)
        click(5, 1)
        click(0, 0)
        click(0, 2)
        click(0, 3)
        click(0, 4)
        add()
        moveTo(5, 1, 0, 1)
        next()
        add()
        click(5, 1)
        add()
        submit()
    })

    it('challenge 3.9', () => {
        challenge(42)
        add()
        click(5, 1)
        click(0, 0)
        click(0, 0)
        click(0, 1)
        click(0, 1)
        click(0, 2)
        click(0, 2)
        add()
        submit()
    })

    it('challenge 3.10', () => {
        challenge(43)
        add()
        click(5, 1)
        add()
        next()
        add()
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j <= 7; j = j + 2) {
                if (i % 2 == 0) {
                    click(i, j)
                } else {
                    click(i, j + 1)
                
                }
            }
        }
        click(0, 1)
        click(0, 3)
        click(0, 5)
        click(0, 7)
        click(0, 1)
        click(0, 3)
        click(0, 5)
        click(0, 7)
        add()
        submit()
    })

    it('challenge 3.11', () => {
        challenge(44)
        add()
        click(5, 1)
        add()
        next()
        add()
        click(5, 1)
        click(5, 1)
        click(5, 2)
        add()
        submit()
    })

    it('challenge 3.12', () => {
        challenge(45)
        add()
        click(5, 1)
        click(5, 2)
        click(5, 3)
        click(5, 4)
        click(5, 5)
        click(5, 5)
        click(5, 6)
        click(5, 6)
        click(5, 7)
        click(5, 7)
        add()
        next()
        add()
        click(5, 1)
        click(5, 1)

        add()
        submit()
    })

    it('challenge 3.13', () => {
        challenge(46)
        add()
        click(5, 1)
        click(5, 1)
        click(5, 2)
        click(5, 2)
        click(5, 3)
        click(5, 3)
        click(5, 4)
        click(5, 4)
        click(5, 5)
        click(5, 5)
        click(6, 1)
        click(6, 2)
        click(6, 3)
        click(6, 4)
        click(6, 5)
        add()
        next()
        add()
        click(5, 1)
        click(5, 1)
        add()
        submit()
    })

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

    it('challenge 3.15', () => {
        challenge(48)
        add()
        click(5, 1)
        click(5, 1)
        click(4, 0)
        add()
        next()
        add()
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j <= 7; j = j + 2) {
                if (i % 2 == 0) {
                    click(i, j)
                    click(i, j)
                } else {
                    click(i, j + 1)
                    click(i, j + 1)
                }
            }
        }
        add()
        submit()
    })
})

