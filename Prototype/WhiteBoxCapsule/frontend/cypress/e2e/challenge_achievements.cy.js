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
    cy.contains("You have won this Challenge's achievement!").should('be.visible')
}

function blue(x, y) {
    cy.get('#board-box-' + x + '-' + y).click().click()
}

function red(x, y) {
    cy.get('#board-box-' + x + '-' + y).click()
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

function writeOut(x, y) {
    cy.get('#piece-stack-out-x').click().type(x)
    cy.get('#piece-stack-out-y').click().type(y)
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

describe('test file 4', () => {
    it('challenge 4.1', () => {
        challenge(49)
        add()
        click(5, 1)
        click(5, 1)
        click(0, 0)
        click(0, 1)
        add()
        moveTo(0, 0, 0, 1)
        submit("4.1")
    })

    it('challenge 4.2', () => {
        challenge(50)
        add()
        click(5, 1)
        click(5, 1)
        click(0, 0)
        click(0, 0)
        click(0, 1)
        click(0, 1)
        add()
        moveTo(0, 0, 0, 1)
        next()
        add()
        click(5, 1)
        click(5, 1)
        click(5, 3)
        click(5, 3)
        add()
        submit("4.2")
    })

    it('challenge 4.3', () => {
        challenge(51)
        add()
        click(5, 1)
        click(5, 1)
        click(0, 0)
        click(0, 1)
        add()
        moveTo(0, 0, 0, 1)
        next()
        add()
        click(5, 1)
        click(5, 1)
        click(5, 3)
        click(5, 3)
        add()
        submit("4.3")
    })

    it('challenge 4.4', () => {
        challenge(52)
        add()
        click(5, 1)
        click(5, 1)
        click(0, 0)
        click(0, 1)
        click(0, 1)
        add()
        moveTo(0, 0, 0, 1)
        next()
        add()
        click(5, 1)
        click(5, 1)
        click(5, 3)
        click(5, 3)
        add()
        submit("4.4")
    })

    it('challenge 4.5', () => {
        challenge(53)
        add()
        click(5, 1)
        click(5, 1)
        click(5, 3)
        click(5, 3)
        click(0, 0)
        click(0, 1)
        add()
        moveTo(0, 0, 0, 1)
        submit("4.5")
    })

    it('challenge 4.6', () => {
        challenge(54)
        add()
        click(5, 1)
        click(5, 3)
        add()
        next()
        add()
        click(5, 1)
        click(5, 1)
        click(5, 3)
        click(5, 2)
        click(5, 4)
        add()
        moveTo(5, 2, 5, 4)
        submit("4.6")
    })

    it('challenge 4.7', () => {
        challenge(55)
        add()
        click(5, 1)
        click(5, 3)
        add()
        next()
        add()
        click(5, 1)
        click(5, 1)
        click(5, 3)
        click(5, 3)
        click(5, 4)
        click(5, 4)
        add()
        submit("4.7")
    })

    it('challenge 4.8', () => {
        challenge(56)
        add()
        click(5, 1)
        click(5, 3)
        click(5, 3)
        click(5, 5)
        click(5, 6)
        add()
        submit("4.8")
    })

    it('challenge 4.9', () => {
        challenge(57)
        add()
        blue(5, 1)
        blue(5, 3)
        add()
        next()
        add()
        red(5, 3)
        red(5, 1)
        red(0, 0)
        red(0, 1)
        blue(0, 2)
        add()
        moveTo(0, 0, 0, 1)
        moveTo(0, 2, 0, 1)
        next()
        submit("4.9")
    })
})

describe('test file 5', () => {
    it('challenge 5.1', () => {
        challenge(58)
        add()
        blue(5, 1)
        red(5, 3)
        blue(0, 0)
        blue(0, 1)
        blue(0, 2)
        blue(0, 3)
        blue(0, 4)
        add()
        moveTo(0, 0, 0, 1)
        moveTo(0, 1, 0, 2)
        moveTo(0, 2, 0, 3)
        moveTo(0, 3, 0, 4)
        submit("5.1")
    })

    it('challenge 5.2', () => {
        challenge(59)
        next()
        add()
        red(0, 0)
        red(0, 1)
        red(0, 2)
        red(0, 3)
        red(0, 4)
        blue(5, 2)
        blue(5, 1)
        add()
        submit("5.2")
    })

    it('challenge 5.3', () => {
        challenge(60)
        next()
        add()
        blue(5, 1)
        blue(5, 2)
        blue(5, 3)
        blue(5, 4)
        blue(5, 5)
        red(0, 0)
        red(0, 1)
        red(0, 2)
        add()
        submit("5.3")
    })

    it('challenge 5.4', () => {
        challenge(61)
        next()
        add()
        blue(5, 1)
        blue(5, 2)
        red(0, 0)
        red(0, 1)
        red(0, 2)
        red(0, 3)
        add()
        moveTo(5, 2, 0, 0)
        moveTo(0, 0, 0, 1)
        moveTo(0, 1, 0, 2)
        moveTo(0, 2, 0, 3)
        submit("5.4")
    })

    it('challenge 5.5', () => {
        challenge(62)
        add()
        blue(5, 1)
        blue(5, 3)
        add()
        moveTo(5, 1, 5, 3)
        submit("5.5")
    })

    it('challenge 5.6', () => {
        challenge(63)
        add()
        blue(5, 1)
        blue(5, 3)
        add()
        moveTo(5, 1, 5, 3)
        click(5, 3)
        moveOut()
        submit("5.6")
    })

    it('challenge 5.7', () => {
        challenge(64)
        add()
        blue(5, 1)
        red(5, 3)
        add()
        next()
        submit("5.7")
    })

    it('challenge 5.8', () => {
        challenge(65)
        add()
        blue(5, 1)
        blue(5, 2)
        blue(5, 3)
        add()
        moveTo(5, 1, 5, 2)
        moveTo(5, 2, 5, 3)
        next()
        submit("5.8")
    })

    it('challenge 5.9', () => {
        challenge(66)
        add()
        blue(5, 1)
        blue(5, 2)
        blue(5, 3)
        blue(5, 4)
        blue(5, 5)
        red(0, 0)
        red(0, 1)
        red(0, 2)
        red(0, 3)
        red(0, 4)
        add()
        next()
        submit("5.9")
    })

    it('challenge 5.10', () => {
        challenge(67)
        add()
        blue(5, 1)
        blue(5, 2)
        add()
        submit("5.10")
    })

    it('challenge 5.11', () => {
        challenge(68)
        add()
        blue(0, 0)
        blue(0, 2)
        blue(0, 4)
        blue(0, 6)
        blue(1, 1)
        blue(1, 3)
        add()
        submit("5.11")
    })

    it('challenge 5.12', () => {
        challenge(69)
        add()
        blue(5, 1)
        add()
        submit("5.12")
    })

    it('challenge 5.13', () => {
        challenge(70)
        add()
        red(0, 0)
        blue(4, 0)
        red(4, 1)
        add()
        moveTo(4, 0, 4, 1)
        next()
        add()
        blue(5, 1)
        add()
        submit("5.13")
    })

    it('challenge 5.14', () => {
        challenge(71)
        add()
        blue(0, 0)
        blue(0, 2)
        blue(0, 4)
        add()
        next()
        add()
        blue(5, 1)
        add()
        submit("5.14")
    })

    it('challenge 5.15', () => {
        challenge(72)
        add()
        red(0, 0)
        red(0, 2)
        blue(0, 4)
        blue(0, 6)
        add()
        next()
        add()
        blue(5, 1)
        add()
        submit("5.15")
    })
})

describe('test file 6', () => {
    it('challenge 6.1', () => {
        challenge(73)
        add()
        blue(2, 1)
        blue(5, 1)
        blue(5, 5)
        add()
        submit("6.1")
    })

    it('challenge 6.2', () => {
        challenge(74)
        add()
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                red(i, j)
            }
        }
        add()
        submit("6.2")
    })

    it('challenge 6.3', () => {
        challenge(75)
        add()
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        red(4, 0)
        add()
        next()
        submit("6.3")
    })

    it('challenge 6.4', () => {
        challenge(76)
        add()
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        red(4, 0)
        add()
        next()
        for (var i = 0; i < 1; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        submit("6.4")
    })

    it('challenge 6.5', () => {
        challenge(77)
        add()
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        red(4, 0)
        add()
        next()
        submit("6.5")
    })

    it('challenge 6.6', () => {
        challenge(78)
        add()
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        add()
        next()
        add()
        for (var i = 4; i < 5; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        add()
        submit("6.6")
    })

    it('challenge 6.7', () => {
        challenge(79)
        add()
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        add()
        next()
        add()
        for (var i = 4; i < 5; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        add()
        submit("6.7")
    })

    it('challenge 6.8', () => {
        challenge(80)
        add()
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        for (var i = 4; i < 5; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        blue(0, 0)
        blue(0, 1)
        add()
        click(0, 0)
        moveOut()
        click(0, 1)
        moveOut()
        submit("6.8")
    })

    it('challenge 6.9', () => {
        challenge(81)
        add()
        for (var i = 3; i < 4; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        for (var i = 5; i < 6; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        add()
        next()
        add() 
        for (var i = 2; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        for (var i = 5; i < 6; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        add()
        submit("6.9")
    })

    it('challenge 6.10', () => {
        challenge(82)
        add()
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        for (var i = 5; i < 6; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        add()
        next()
        add() 
        for (var i = 2; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        for (var i = 5; i < 6; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        red(2, 0)
        blue(2, 1)
        add()
        moveTo(2, 0, 2, 1)
        click(2, 1)
        moveOut()
        submit("6.10")
    })

    it('challenge 6.11', () => {
        challenge(83)
        add()
        for (var i = 3; i < 4; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        for (var i = 4; i < 5; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        add()
        moveTo(7, 0, 0, 0)
        moveTo(0, 7, 7, 7)
        add()
        red(0, 7)
        blue(7, 0)
        submit("6.11")
    })

    it('challenge 6.12', () => {
        challenge(84)
        add()
        for (var i = 2; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        for (var i = 5; i < 6; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        add()
        next()
        add()
        for (var i = 3; i < 4; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        for (var i = 5; i < 6; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        add()
        next()
        add()
        for (var i = 5; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        add()
        submit("6.12")
    })

    it('challenge 6.13', () => {
        challenge(85)
        add()
        for (var i = 1; i < 3; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        add()
        next()
        add()
        for (var i = 3; i < 4; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        for (var i = 5; i < 6; i++) {
            for (var j = 0; j < 8; j++) {
                red(i, j)
            }
        }
        red(6, 0)
        add()
        next()
        add()
        for (var i = 4; i < 5; i++) {
            for (var j = 0; j < 8; j++) {
                blue(i, j)
            }
        }
        red(3, 0)
        red(3, 1)
        add()
        click(3, 0)
        moveOut()
        click(3, 1)
        moveOut()
        submit("6.13")
    })

    it('challenge 6.14', () => {
        challenge(86)
        add()
        red(7, 0)
        blue(3, 0)
        blue(3, 1)
        add()
        click(3, 0)
        moveOut()
        click(3, 1)
        moveOut()
        submit("6.14")
    })
})

describe('test file 7', () => {
    it('challenge 7.1', () => {
        challenge(87)
        add()
        blue(3, 0)
        blue(7, 0)
        blue(7, 3)
        add()
        submit("7.1")
    })

    it('challenge 7.2', () => {
        challenge(88)
        add()
        blue(4, 1)
        blue(7, 0)
        blue(7, 3)
        red(0, 0)
        red(0, 1)
        red(0, 2)
        red(0, 3)
        red(0, 4)
        add()
        submit("7.2")
    })

    it('challenge 7.3', () => {
        challenge(89)
        add()
        blue(3, 0)
        blue(7, 0)
        blue(7, 3)
        add()
        next()
        add()
        blue(4, 1)
        blue(7, 0)
        blue(7, 3)
        add()
        submit("7.3")
    })

    it('challenge 7.4', () => {
        challenge(90)
        add()
        blue(4, 0)
        blue(7, 0)
        blue(7, 3)
        add()
        next()
        add()
        blue(4, 1)
        blue(7, 0)
        blue(7, 3)
        red(0, 0)
        red(0, 7)
        red(7, 7)
        add()
        submit("7.4")
    })

    it('challenge 7.5', () => {
        challenge(91)
        add()
        blue(4, 0)
        blue(7, 0)
        blue(7, 3)
        add()
        next()
        add()
        blue(4, 1)
        blue(7, 0)
        blue(7, 3)
        red(4, 0)
        add()
        submit("7.5")
    })

    it('challenge 7.6', () => {
        challenge(92)
        add()
        blue(4, 1)
        blue(7, 0)
        blue(7, 3)
        red(4, 0)
        red(4, 2)
        add()
        moveTo(4, 2, 4, 0)
        submit("7.6")
    })

    it('challenge 7.7', () => {
        challenge(93)
        add()
        blue(3, 0)
        blue(7, 0)
        blue(5, 3)
        red(7, 7)
        add()
        submit("7.7")
    })

    it('challenge 7.8', () => {
        challenge(94)
        add()
        blue(3, 0)
        blue(7, 0)
        blue(5, 3)
        add()
        next()
        add()
        blue(5, 1)
        blue(7, 0)
        blue(7, 4)
        red(7, 7)
        add()
        writeOut(7, 8)
        click(7, 7)
        moveOut()
        submit("7.8")
    })

    it('challenge 7.9', () => {
        challenge(95)
        add()
        blue(3, 0)
        blue(7, 0)
        blue(5, 3)
        add()
        next()
        add()
        blue(5, 1)
        blue(7, 0)
        blue(7, 4)
        red(7, 7)
        add()
        writeOut(63, 63)
        click(7, 7)
        moveOut()
        submit("7.9")
    })

    it('challenge 7.10', () => {
        challenge(96)
        add()
        blue(3, 0)
        blue(7, 0)
        blue(5, 3)
        add()
        next()
        add()
        blue(5, 1)
        blue(7, 0)
        blue(7, 4)
        red(7, 3)
        red(7, 1)
        red(7, 2)
        add()
        moveTo(7, 1, 7, 3)
        moveTo(7, 2, 7, 3)
        submit("7.10")
    })

    it('challenge 7.11', () => {
        challenge(97)
        add()
        blue(3, 0)
        blue(7, 0)
        blue(5, 3)
        red(7, 7)
        add()
        writeOut(-4, 18)
        move(7, 7)
        moveOut()
        submit("7.11")
    })

    it('challenge 7.12', () => {
        challenge(98)
        add()
        red(3, 0)
        red(7, 0)
        red(5, 3)
        red(7, 7)
        red(0, 0)
        add()
        submit("7.12")
    })

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