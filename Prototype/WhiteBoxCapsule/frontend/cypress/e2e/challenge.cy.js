describe("Basic Functionality", () => {
    it('starts a challenge', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#single-player-button').click()
        cy.get('#challenge-card-1').click()

        cy.get('#guide-modal')
            .should('be.visible')
            .wait(500)

        cy.get('#guide-modal-close-button').click().wait(500)

        cy.get('#guide-modal')
            .should('not.be.visible')

        cy.get('.button.is-primary.is-fullwidth').should('be.visible')

    })

    it('open guide modal manually', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#single-player-button').click()
        cy.get('#challenge-card-1').click()

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
    })
})

describe("Board Movement", () => {
    describe("Selecting pieces", () => {
        it('selects a red piece', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#challenge-card-1').click()
    
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
            cy.get('#challenge-card-1').click()
    
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
                cy.get('#challenge-card-1').click()

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
                cy.get('#challenge-card-1').click()

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
                cy.get('#challenge-card-1').click()

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
                cy.get('#challenge-card-1').click()

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
                    cy.get('#challenge-card-1').click()

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
                    cy.get('#challenge-card-1').click()

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
                    cy.get('#challenge-card-1').click()

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