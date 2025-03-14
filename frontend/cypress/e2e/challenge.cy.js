beforeEach('login', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#exampleInputUsername').type('professor')
    cy.get('#exampleInputPassword').type('password')
    cy.get('#login-button').click()
    cy.viewport(1920, 1080)
})

describe("Basic Functionality", () => {
    it('starts a challenge', () => {

        cy.get('#single-player-button').click()
        cy.get('#challenge-1-play').click().wait(1000)
        cy.get('.button.is-primary.is-fullwidth').should('be.visible')
    }),

        it('title appearance', () => {

            cy.get('#single-player-button').click()
            cy.get('#challenge-1-play').click().wait(1000)
            cy.contains("Challenge 1.1: Checking for Out of Bounds").should('be.visible')
        }),

        it('objective appearance', () => {

            cy.get('#single-player-button').click()
            cy.get('#challenge-1-play').click().wait(1000)
            cy.contains("Statement coverage of line 9.").should('be.visible')
        }),

        it('hint appearance', () => {

            cy.get('#single-player-button').click()
            cy.get('#challenge-1-play').click().wait(1000)
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)

            cy.contains("Hint: The condition guarding line 9 is made only using OR (||). What does that mean, logically?").should('be.visible')
        })
})

describe("Board Movement", () => {
    describe("Selecting pieces", () => {
        it('selects a red piece', () => {

            cy.get('#single-player-button').click()
            cy.get('#challenge-2-play').click().wait(1000)
            cy.get('#board-box-0-0').click()
            cy.get('.selected').should('be.visible')
        })

        it('selects a blue piece', () => {

            cy.get('#single-player-button').click()
            cy.get('#challenge-2-play').click().wait(1000)
            cy.get('#board-box-6-0').click()
            cy.get('.selected').should('be.visible')
        })
    })


    describe("Within the board", () => {
        describe("No stacking", () => {
            it('moves a red piece', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)
                cy.get('#board-box-0-0').click()
                cy.get('#board-box-5-2').click()
                cy.get('#board-box-5-2 > .red').should('be.visible')
            })

            it('moves a blue piece', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)
                cy.get('#board-box-7-1').click()
                cy.get('#board-box-5-2').click()
                cy.get('#board-box-5-2 > .blue').should('be.visible')
            })

            it('makes kings', () => {
                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)
                cy.get('#board-box-7-1').click()
                cy.get('#board-box-5-2').click()
                cy.get('#board-box-5-2 > .blue').should('be.visible')
                cy.get('#board-box-0-0').click()
                cy.get('#board-box-7-1').click()
                cy.get('#board-box-7-1 > .red').should('be.visible')
                cy.get('#board-box-7-1 > .red > ').should('be.visible')
            })
        })

        describe("With stacking", () => {
            it('moves a red piece, making a stack', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)
                cy.get('#board-box-0-0').click()
                cy.get('#board-box-7-1').click()
                cy.get('#board-box-7-1 > .piece-overlap').should('be.visible')
            })

            it('moves a blue piece, making a stack', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)
                cy.get('#board-box-7-1').click()
                cy.get('#board-box-0-0').click()
                cy.get('#board-box-0-0 > .piece-overlap').should('be.visible')
            })

            describe('Stack movement', () => {
                it('selects a stack', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)
                    cy.get('#board-box-7-1').click()
                    cy.get('#board-box-0-0').click()
                    cy.get('#board-box-0-0 > .piece-overlap').click()
                    cy.get('.small.selected').should('be.visible')
                })

                it('moves a stack (to empty spot)', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)
                    cy.get('#board-box-7-1').click()
                    cy.get('#board-box-0-0').click()
                    cy.get('#board-box-0-0 > .piece-overlap').click()
                    cy.get('#board-box-3-0').click()
                    cy.get('#board-box-4-4').click().should('be.visible')
                })

                it('moves a stack (to occupied spot)', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)
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

    describe("Outside the board", () => {
        describe("No stacking", () => {
            it('moves a red piece', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)
                cy.get('#board-box-0-0').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .red').should('be.visible')
            })

            it('moves a blue piece', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)

                cy.get('#board-box-7-1').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .blue').should('be.visible')
            })
        })

        describe("With stacking", () => {
            it('moves a red piece, making a stack', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)

                cy.get('#board-box-0-0').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .red').should('be.visible')

                cy.get('#board-box-0-2').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .piece-overlap').should('be.visible')
            })

            it('moves a blue piece, making a stack', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)

                cy.get('#board-box-7-1').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .blue').should('be.visible')

                cy.get('#board-box-7-3').click()

                cy.get('.game-board-out > .box').click()

                cy.get('.game-board-out > .box > .piece-overlap').should('be.visible')
            })

            describe('Stack movement', () => {
                it('selects a stack', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)

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

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)

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

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)

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

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000)

                cy.get('input[name="piece-stack-out-x"]').first().click().focus().type('-5')

                cy.get('#piece-stack-out-x').should('have.value', '-5')

                cy.get('#piece-stack-out-y').should('have.value', '')

                cy.get('#board-box-0-0').click()

                cy.get('.selected').should('be.visible')

                cy.get('.game-board-out > .box').click().wait(300)

                cy.get('.player-info > em').contains('Moved (0, 0) to (-5, -1).')

                cy.get('.game-board-out > .box').click().wait(300)

                cy.get('#board-box-0-0').click()

                cy.get('.player-info > em').contains('Moved (-5, -1) to (0, 0).')
            }),

                it('only column', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)

                    cy.get('#piece-stack-out-y').click().type('-5')

                    cy.get('#piece-stack-out-y').should('have.value', '-5')

                    cy.get('#piece-stack-out-x').should('have.value', '')

                    cy.get('#board-box-0-0').click()

                    cy.get('.selected').should('be.visible')

                    cy.get('.game-board-out > .box').click().wait(300)

                    cy.get('.player-info > em').contains('Moved (0, 0) to (-1, -5).')

                    cy.get('.game-board-out > .box').click().wait(300)

                    cy.get('#board-box-0-0').click()

                    cy.get('.player-info > em').contains('Moved (-1, -5) to (0, 0).')
                }),

                it('both row and column', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)

                    cy.get('#piece-stack-out-x').click().type('-5')

                    cy.get('#piece-stack-out-x').should('have.value', '-5')

                    cy.get('#piece-stack-out-y').should('have.value', '')

                    cy.get('#piece-stack-out-y').click().type('-5')

                    cy.get('#piece-stack-out-y').should('have.value', '-5')

                    cy.get('#board-box-0-0').click()

                    cy.get('.selected').should('be.visible')

                    cy.get('.game-board-out > .box').click().wait(300)

                    cy.get('.player-info > em').contains('Moved (0, 0) to (-5, -5).')
                }),

                it('move from stack, after writing', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)

                    cy.get('#piece-stack-out-x').click().type('-5')

                    cy.get('#piece-stack-out-x').should('have.value', '-5')

                    cy.get('#piece-stack-out-y').should('have.value', '')

                    cy.get('#piece-stack-out-y').click().type('-5')

                    cy.get('#piece-stack-out-y').should('have.value', '-5')

                    cy.get('#board-box-0-0').click()

                    cy.get('.selected').should('be.visible')

                    cy.get('.game-board-out > .box').click().wait(300)

                    cy.get('.player-info > em').contains('Moved (0, 0) to (-5, -5).')

                    cy.get('.game-board-out > .box').click().wait(300)

                    cy.get('#board-box-0-0').click()

                    cy.get('.player-info > em').contains('Moved (-5, -5) to (0, 0).')
                }),

                it('disabling input when occupied', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-2-play').click().wait(1000)

                    cy.get('#piece-stack-out-x').click().type('-5')

                    cy.get('#piece-stack-out-x').should('have.value', '-5')

                    cy.get('#piece-stack-out-y').should('have.value', '')

                    cy.get('#board-box-0-0').click()

                    cy.get('.selected').should('be.visible')

                    cy.get('.game-board-out > .box').click().wait(300)

                    cy.get('.player-info > em').contains('Moved (0, 0) to (-5, -1).')

                    cy.get('#piece-stack-out-x').should('have.value', '-5')

                    cy.get('#piece-stack-out-y').should('have.value', '-1')

                    cy.get('#piece-stack-out-x.disabled').should('be.visible')
                    cy.get('#piece-stack-out-y.disabled').should('be.visible')
                })
        })
    })
})




describe("Board buttons", () => {
    it('reset button', () => {

        cy.get('#single-player-button').click()
        cy.get('#challenge-1-play').click().wait(1000)

        cy.get('#board-box-0-0').click()

        cy.get('#board-box-7-1').click()

        cy.get('#board-box-0-0 > .empty').should('be.visible')
        cy.get('#board-box-0-0 > .red').should('not.exist')

        cy.get('#reset-button').click()

        cy.get('#board-box-0-0 > .red').should('be.visible')
    }),

    describe('previous and next buttons', () => {
            it('next button', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-3-play').click().wait(1000) // challenge 2 has multiple test cases, so...

                cy.get('#board-box-0-0').click()

                cy.get('#board-box-7-1').click()

                cy.get('#board-box-0-0 > .empty').should('be.visible')
                cy.get('#board-box-0-0 > .red').should('not.exist')

                cy.get('#next-button').click()

                cy.get('#board-box-0-0 > .red').should('be.visible')
                cy.get('#board-box-0-0 > .empty').should('not.exist')
            }),

                it('previous button', () => {

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-3-play').click().wait(1000) // challenge 2 has multiple test cases, so...

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

                    cy.get('#single-player-button').click()
                    cy.get('#challenge-3-play').click().wait(1000) // challenge 2 has multiple test cases, so...

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

            cy.get('#single-player-button').click()
            cy.get('#challenge-2-play').click().wait(1000) // challenge 2 has multiple test cases, so...
            cy.get('#add-button').click()
            cy.get('.add-mode').should('exist')
            cy.get('#board-box-0-1').click().wait(100)
            cy.get('#board-box-0-1').find('.red').should('exist')
        }),

            it('add button (blue)', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000) // challenge 2 has multiple test cases, so...
                cy.get('#add-button').click()
                cy.get('.add-mode').should('exist')
                cy.get('#board-box-0-1').click().wait(100).click().wait(100)
                cy.get('#board-box-0-1').find('.blue').should('exist')
            }),

            it('add button (empty)', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000) // challenge 2 has multiple test cases, so...
                cy.get('#add-button').click()
                cy.get('.add-mode').should('exist')
                cy.get('#board-box-0-1').click().wait(100).click().wait(100).click().wait(100)
                cy.get('#board-box-0-1').find('.empty').should('exist')
            }),

            it('add button (occupied spot)', () => {

                cy.get('#single-player-button').click()
                cy.get('#challenge-2-play').click().wait(1000) // challenge 2 has multiple test cases, so..
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
                cy.get('#single-player-button').click()
                cy.get('#challenge-1-play').click().wait(1000) // challenge 2 has multiple test cases, so...
                cy.get('#board-box-2-0').click()
                cy.get('.game-board-out').click()
                cy.get('#go-button').click()
                cy.get('#comment-modal-textarea').type('Example comment.')
                cy.get('#comment-modal-button').click().wait(1000)
                cy.on('window:confirm', () => false)

                // Test case.
                cy.get('.alert-success').should('be.visible')
                cy.contains("You passed, congratulations!").should('be.visible')
            }),

                it('go! button (fail)', () => {
                    cy.get('#single-player-button').click()
                    cy.get('#challenge-1-play').click().wait(1000) // challenge 2 has multiple test cases, so...
                    cy.get('#go-button').click()
                    cy.get('#comment-modal-textarea').type('Example comment.')
                    cy.get('#comment-modal-button').click().wait(1000)
                    cy.contains("You didn't pass. You can keep trying, though.").should('be.visible')
                })
    }),

    it('exit button', () => {

            cy.get('#single-player-button').click()
            cy.get('#challenge-1-play').click().wait(1000) // challenge 2 has multiple test cases, so...
            cy.get('#exit-button').click()

            cy.contains('Challenges')
    })
})
