describe("Basic Functionality", () => {
    it('starts a challenge', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#single-player-button').click()
        cy.get('.card.challenge-card').first().click()

        cy.get('#guide-modal')
            .should('be.visible')
            .wait(500)

        cy.get('#guide-modal-close-button').click().wait(500)

        cy.get('#guide-modal')
            .should('not.be.visible')

        cy.get('.button.is-primary.is-fullwidth').should('be.visible')

    }),

        it('open guide modal manually', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('.card.challenge-card').first().click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(500)

            cy.get('#guide-modal')
                .should('not.be.visible')

            cy.get('#guide-button').should('be.visible').click().wait(500)
            cy.get('#guide-modal')
                .wait(500)
                .should('be.visible')
        }),

        it('title appearance', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('.card.challenge-card').first().click() // challenge 2 has multiple test cases, so...

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(1000)

            cy.get('#guide-modal')
                .should('not.be.visible')

            cy.contains("Challenge 1.1: Checking for Out of Bounds").should('be.visible')
        }),

        it('objective appearance', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('.card.challenge-card').first().click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(1000)

            cy.get('#guide-modal')
                .should('not.be.visible')

            cy.contains("Statement coverage of line 9.").should('be.visible')
        }),

        it('hint appearance', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('.card.challenge-card').first().click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(1000)

            cy.get('#guide-modal')
                .should('not.be.visible')

            cy.wait(2500)

            cy.contains("Hint: The condition guarding line 9 is made only using OR (||). What does that mean, logically?").should('be.visible')
        })
})

describe("Board Movement", () => {
    describe("Selecting pieces", () => {
        it('selects a red piece', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(500)

            cy.get('#guide-modal')
                .should('not.be.visible')

            cy.get('#board-box-0-0').click()

            cy.get('.selected').should('be.visible')
        })

        it('selects a blue piece', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(500)

            cy.get('#guide-modal')
                .should('not.be.visible')

            cy.get('#board-box-6-0').click()

            cy.get('.selected').should('be.visible')
        })
    })


    describe("Within the board", () => {
        describe("No stacking", () => {
            it('moves a red piece', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#board-box-0-0').click()

                cy.get('#board-box-5-2').click()

                cy.get('#board-box-5-2 > .red').should('be.visible')
            })

            it('moves a blue piece', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#board-box-7-1').click()

                cy.get('#board-box-5-2').click()

                cy.get('#board-box-5-2 > .blue').should('be.visible')
            })
        })

        describe("With stacking", () => {
            it('moves a red piece, making a stack', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#board-box-0-0').click()

                cy.get('#board-box-7-1').click()

                cy.get('#board-box-7-1 > .piece-overlap').should('be.visible')
            })

            it('moves a blue piece, making a stack', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#board-box-7-1').click()

                cy.get('#board-box-0-0').click()

                cy.get('#board-box-0-0 > .piece-overlap').should('be.visible')
            })

            describe('Stack movement', () => {
                it('selects a stack', () => {
                    cy.visit('http://localhost:5173/')
                    cy.get('#single-player-button').click()
                    cy.get('#challenge-card-2').click()

                    cy.get('#guide-modal')
                        .should('be.visible')
                        .wait(500)

                    cy.get('#guide-modal-close-button').click().wait(500)

                    cy.get('#guide-modal')
                        .should('not.be.visible')
                        .wait(500)

                    cy.get('#board-box-7-1').click()

                    cy.get('#board-box-0-0').click()

                    cy.get('#board-box-0-0 > .piece-overlap').click()

                    cy.get('.small.selected').should('be.visible')
                })

                it('moves a stack (to empty spot)', () => {
                    cy.visit('http://localhost:5173/')
                    cy.get('#single-player-button').click()
                    cy.get('#challenge-card-2').click()

                    cy.get('#guide-modal')
                        .should('be.visible')
                        .wait(500)

                    cy.get('#guide-modal-close-button').click().wait(500)

                    cy.get('#guide-modal')
                        .should('not.be.visible')
                        .wait(500)

                    cy.get('#board-box-7-1').click()

                    cy.get('#board-box-0-0').click()

                    cy.get('#board-box-0-0 > .piece-overlap').click()

                    cy.get('#board-box-3-0').click()

                    cy.get('#board-box-4-4').click().should('be.visible')
                })

                it('moves a stack (to occupied spot)', () => {
                    cy.visit('http://localhost:5173/')
                    cy.get('#single-player-button').click()
                    cy.get('#challenge-card-2').click()

                    cy.get('#guide-modal')
                        .should('be.visible')
                        .wait(500)

                    cy.get('#guide-modal-close-button').click().wait(500)

                    cy.get('#guide-modal')
                        .should('not.be.visible').wait(500)

                    cy.get('#board-box-7-1').click()

                    cy.get('#board-box-0-0').click()

                    cy.get('#board-box-0-0 > .piece-overlap').click()

                    cy.get('#board-box-3-0').click()

                    cy.get('#board-box-3-0').click()

                    cy.get('#board-box-2-0').click()

                    cy.get('#board-box-2-0 > .piece-overlap').should('be.visible')
                })
            })
        })
    })
})

describe("Outside the board", () => {
    describe("No stacking", () => {
        it('moves a red piece', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(500)

            cy.get('#guide-modal')
                .should('not.be.visible')
                .wait(500)

            cy.get('#board-box-0-0').click()

            cy.get('.game-board-out > .box').click()

            cy.get('.game-board-out > .box > .red').should('be.visible')
        })

        it('moves a blue piece', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(500)

            cy.get('#guide-modal')
                .should('not.be.visible')
                .wait(500)

            cy.get('#board-box-7-1').click()

            cy.get('.game-board-out > .box').click()

            cy.get('.game-board-out > .box > .blue').should('be.visible')
        })
    })

    describe("With stacking", () => {
        it('moves a red piece, making a stack', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(500)

            cy.get('#guide-modal')
                .should('not.be.visible')
                .wait(500)

            cy.get('#board-box-0-0').click()

            cy.get('.game-board-out > .box').click()

            cy.get('.game-board-out > .box > .red').should('be.visible')

            cy.get('#board-box-0-2').click()

            cy.get('.game-board-out > .box').click()

            cy.get('.game-board-out > .box > .piece-overlap').should('be.visible')
        })

        it('moves a blue piece, making a stack', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(500)

            cy.get('#guide-modal')
                .should('not.be.visible')
                .wait(500)

            cy.get('#board-box-7-1').click()

            cy.get('.game-board-out > .box').click()

            cy.get('.game-board-out > .box > .blue').should('be.visible')

            cy.get('#board-box-7-3').click()

            cy.get('.game-board-out > .box').click()

            cy.get('.game-board-out > .box > .piece-overlap').should('be.visible')
        })

        describe('Stack movement', () => {
            it('selects a stack', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#board-box-7-1').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .blue').should('be.visible')

                cy.get('#board-box-7-3').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .piece-overlap').should('be.visible').wait(500)

                cy.get('.game-board-out > .box').click()

                cy.get('.small.selected').should('be.visible')
            })

            it('moves a stack (to empty spot)', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#board-box-7-1').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .blue').should('be.visible')

                cy.get('#board-box-7-3').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .piece-overlap').should('be.visible').wait(500)

                cy.get('.game-board-out > .box').click()

                cy.get('.small.selected').should('be.visible')

                cy.get('#board-box-7-4').click()
            })

            it('moves a stack (to occupied spot)', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#board-box-7-1').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .blue').should('be.visible')

                cy.get('#board-box-7-3').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .piece-overlap').should('be.visible').wait(500)

                cy.get('.game-board-out > .box').click()

                cy.get('.small.selected').should('be.visible')

                cy.get('#board-box-0-0').click()

                cy.get('#board-box-0-0 > .piece-overlap').should('be.visible')
            })
        })
    })

    describe("Writing on input", () => {
        it('only row', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click()

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(500)

            cy.get('#guide-modal')
                .should('not.be.visible')
                .wait(500)

            cy.get('#piece-stack-out-x').click().type('-5')

            cy.get('#piece-stack-out-x').should('have.value', '-5')

            cy.get('#piece-stack-out-y').should('have.value', '')

            cy.get('#board-box-0-0').click()

            cy.get('.selected').should('be.visible')

            cy.get('.game-board-out > .box').click().wait(300)

            cy.get('.player-info > em').should('have.text', 'Moved (0, 0) to (-5, -1).')

            cy.get('.game-board-out > .box').click().wait(300)

            cy.get('#board-box-0-0').click()

            cy.get('.player-info > em').should('have.text', 'Moved (-5, -1) to (0, 0).')
        }),

            it('only column', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#piece-stack-out-y').click().type('-5')

                cy.get('#piece-stack-out-y').should('have.value', '-5')

                cy.get('#piece-stack-out-x').should('have.value', '')

                cy.get('#board-box-0-0').click()

                cy.get('.selected').should('be.visible')

                cy.get('.game-board-out > .box').click().wait(300)

                cy.get('.player-info > em').should('have.text', 'Moved (0, 0) to (-1, -5).')

                cy.get('.game-board-out > .box').click().wait(300)

                cy.get('#board-box-0-0').click()

                cy.get('.player-info > em').should('have.text', 'Moved (-1, -5) to (0, 0).')
            }),

            it('both row and column', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#piece-stack-out-x').click().type('-5')

                cy.get('#piece-stack-out-x').should('have.value', '-5')

                cy.get('#piece-stack-out-y').should('have.value', '')

                cy.get('#piece-stack-out-y').click().type('-5')

                cy.get('#piece-stack-out-y').should('have.value', '-5')

                cy.get('#board-box-0-0').click()

                cy.get('.selected').should('be.visible')

                cy.get('.game-board-out > .box').click().wait(300)

                cy.get('.player-info > em').should('have.text', 'Moved (0, 0) to (-5, -5).')
            }),

            it('move from stack, after writing', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#piece-stack-out-x').click().type('-5')

                cy.get('#piece-stack-out-x').should('have.value', '-5')

                cy.get('#piece-stack-out-y').should('have.value', '')

                cy.get('#piece-stack-out-y').click().type('-5')

                cy.get('#piece-stack-out-y').should('have.value', '-5')

                cy.get('#board-box-0-0').click()

                cy.get('.selected').should('be.visible')

                cy.get('.game-board-out > .box').click().wait(300)

                cy.get('.player-info > em').should('have.text', 'Moved (0, 0) to (-5, -5).')

                cy.get('.game-board-out > .box').click().wait(300)

                cy.get('#board-box-0-0').click()

                cy.get('.player-info > em').should('have.text', 'Moved (-5, -5) to (0, 0).')
            }),

            it('disabling input when occupied', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click()

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(500)

                cy.get('#guide-modal')
                    .should('not.be.visible')
                    .wait(500)

                cy.get('#piece-stack-out-x').click().type('-5')

                cy.get('#piece-stack-out-x').should('have.value', '-5')

                cy.get('#piece-stack-out-y').should('have.value', '')

                cy.get('#board-box-0-0').click()

                cy.get('.selected').should('be.visible')

                cy.get('.game-board-out > .box').click().wait(300)

                cy.get('.player-info > em').should('have.text', 'Moved (0, 0) to (-5, -1).')

                cy.get('#piece-stack-out-x').should('have.value', '')

                cy.get('#piece-stack-out-y').should('have.value', '')

                cy.get('#piece-stack-out-x.disabled').should('be.visible')
                cy.get('#piece-stack-out-y.disabled').should('be.visible')
            })
    })
})


describe("Board buttons", () => {
    it('reset button', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#single-player-button').click()
        cy.get('.card.challenge-card').first().click()

        cy.get('#guide-modal')
            .should('be.visible')
            .wait(500)

        cy.get('#guide-modal-close-button').click().wait(1000)

        cy.get('#guide-modal')
            .should('not.be.visible')

        cy.get('#board-box-0-0').click()

        cy.get('#board-box-7-1').click()

        cy.get('#board-box-0-0 > .empty').should('be.visible')
        cy.get('#board-box-0-0 > .red').should('not.exist')

        cy.get('#reset-button').click()

        cy.get('#board-box-0-0 > .red').should('be.visible')
    }),

        describe('previous and next buttons', () => {
            it('next button', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-3').click() // challenge 2 has multiple test cases, so...

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(1000)

                cy.get('#guide-modal')
                    .should('not.be.visible')

                cy.get('#board-box-0-0').click()

                cy.get('#board-box-7-1').click()

                cy.get('#board-box-0-0 > .empty').should('be.visible')
                cy.get('#board-box-0-0 > .red').should('not.exist')

                cy.get('#next-button').click()

                cy.get('#board-box-0-0 > .red').should('be.visible')
                cy.get('#board-box-0-0 > .empty').should('not.exist')
            }),

                it('previous button', () => {
                    cy.visit('http://localhost:5173/')
                    cy.get('#single-player-button').click()
                    cy.get('#challenge-card-3').click() // challenge 2 has multiple test cases, so...

                    cy.get('#guide-modal')
                        .should('be.visible')
                        .wait(500)

                    cy.get('#guide-modal-close-button').click().wait(1000)

                    cy.get('#guide-modal')
                        .should('not.be.visible')

                    cy.get('#board-box-0-0').click()

                    cy.get('#board-box-7-1').click()

                    cy.get('#board-box-0-0 > .empty').should('be.visible')
                    cy.get('#board-box-0-0 > .red').should('not.exist')

                    cy.get('#next-button').click()

                    cy.get('#board-box-0-0 > .red').should('be.visible')
                    cy.get('#board-box-0-0 > .empty').should('not.exist')

                    cy.get('#board-box-0-2').click()

                    cy.get('#board-box-7-1').click()

                    cy.get('#previous-button').click()

                    cy.get('#board-box-0-2 > .red').should('be.visible')
                    cy.get('#board-box-0-2 > .empty').should('not.exist')
                }),

                it('previous and next buttons sequence', () => {
                    cy.visit('http://localhost:5173/')
                    cy.get('#single-player-button').click()
                    cy.get('#challenge-card-3').click() // challenge 2 has multiple test cases, so...

                    cy.get('#guide-modal')
                        .should('be.visible')
                        .wait(500)

                    cy.get('#guide-modal-close-button').click().wait(1000)

                    cy.get('#guide-modal')
                        .should('not.be.visible')

                    cy.get('#board-box-0-0').click()

                    cy.get('#board-box-7-1').click()

                    cy.get('#board-box-0-0 > .empty').should('be.visible')
                    cy.get('#board-box-0-0 > .red').should('not.exist')

                    cy.get('#next-button').click()

                    cy.get('#board-box-0-0 > .red').should('be.visible')
                    cy.get('#board-box-0-0 > .empty').should('not.exist')

                    cy.get('#board-box-0-0').click()

                    cy.get('#board-box-7-1').click()

                    cy.get('#board-box-0-2').click()

                    cy.get('#board-box-7-1').click()

                    cy.get('#previous-button').click()

                    cy.get('#board-box-0-2 > .red').should('be.visible')
                    cy.get('#board-box-0-2 > .empty').should('not.exist')

                    cy.get('#next-button').click()

                    cy.get('#board-box-7-1 > .piece-overlap').should('exist').contains('2')
                    cy.get('#board-box-0-0 > .empty').should('exist')
                    cy.get('#board-box-0-2 > .empty').should('exist')
                })
        })

    describe('add button', () => {
        it('add button (red)', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(1000)

            cy.get('#guide-modal')
                .should('not.be.visible')

            cy.get('#add-button').click()

            cy.get('.add-mode').should('exist')

            cy.get('#board-box-0-1').click().wait(100)

            cy.get('#board-box-0-1').find('.red').should('exist')
        }),

            it('add button (blue)', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(1000)

                cy.get('#guide-modal')
                    .should('not.be.visible')

                cy.get('#add-button').click()

                cy.get('.add-mode').should('exist')

                cy.get('#board-box-0-1').click().wait(100).click().wait(100)

                cy.get('#board-box-0-1').find('.blue').should('exist')
            }),

            it('add button (empty)', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(1000)

                cy.get('#guide-modal')
                    .should('not.be.visible')

                cy.get('#add-button').click()

                cy.get('.add-mode').should('exist')

                cy.get('#board-box-0-1').click().wait(100).click().wait(100).click().wait(100)

                cy.get('#board-box-0-1').find('.empty').should('exist')
            }),

            it('add button (occupied spot)', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(1000)

                cy.get('#guide-modal')
                    .should('not.be.visible')

                cy.get('#add-button').click()

                cy.get('.add-mode').should('exist')

                cy.get('#board-box-0-0').find('.red').should('exist')

                cy.get('#board-box-0-0').click().wait(100)

                cy.get('#board-box-0-0').find('.blue').should('exist')

                cy.get('#board-box-0-0').click().wait(100)

                cy.get('#board-box-0-0').find('.empty').should('exist')
            })
    }),

        describe('go! button', () => {
            it('go! button (pass)', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(1000)

                cy.get('#guide-modal')
                    .should('not.be.visible')

                cy.get('#board-box-2-0').click()

                cy.get('#board-box-5-4').click()

                cy.get('#go-button').click()

                cy.contains("You passed, congratulations! To submit your solution, click the Comment button. It's required for your score!").should('be.visible')
            }),

                it('go! button (fail)', () => {
                    cy.visit('http://localhost:5173/')
                    cy.get('#single-player-button').click()
                    cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

                    cy.get('#guide-modal')
                        .should('be.visible')
                        .wait(500)

                    cy.get('#guide-modal-close-button').click().wait(1000)

                    cy.get('#guide-modal')
                        .should('not.be.visible')

                    cy.get('#go-button').click()

                    cy.contains("You didn't pass. There's still time, though! Keep trying. ").should('be.visible')
                })
        }),

        it('exit button', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

            cy.get('#guide-modal')
                .should('be.visible')
                .wait(500)

            cy.get('#guide-modal-close-button').click().wait(1000)

            cy.get('#guide-modal')
                .should('not.be.visible')

            cy.get('#exit-button').click()

            cy.contains('Single Player')
        }),

        describe('comment button', () => {
            it('comment button (pass)', () => {
                cy.visit('http://localhost:5173/')
                cy.get('#single-player-button').click()
                cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

                cy.get('#guide-modal')
                    .should('be.visible')
                    .wait(500)

                cy.get('#guide-modal-close-button').click().wait(1000)

                cy.get('#guide-modal')
                    .should('not.be.visible')

                cy.get('#board-box-2-0').click()

                cy.get('#board-box-5-4').click()

                cy.get('#go-button').click()

                cy.contains("You passed, congratulations! To submit your solution, click the Comment button. It's required for your score!").should('be.visible')

                cy.get('#submit-modal').should('not.be.visible')

                cy.get('#comment-button').click().wait(500)

                cy.get('#submit-modal').should('be.visible')
            }),

                it('comment button (not pass)', () => {
                    cy.visit('http://localhost:5173/')
                    cy.get('#single-player-button').click()
                    cy.get('#challenge-card-2').click() // challenge 2 has multiple test cases, so...

                    cy.get('#guide-modal')
                        .should('be.visible')
                        .wait(500)

                    cy.get('#guide-modal-close-button').click().wait(1000)

                    cy.get('#guide-modal')
                        .should('not.be.visible')

                    cy.get('#go-button').click()

                    cy.get('#fail-modal').should('not.be.visible')

                    cy.get('#comment-button').click().wait(500)

                    cy.get('#fail-modal').should('be.visible')
                })
        })
})