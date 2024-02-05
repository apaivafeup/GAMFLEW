describe("test file 1", () => {
    describe("challenge 1.1", () => {
        // Pass Test Case for Challenge 1.1
        it('pass challenge 1.1', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-1').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')
            cy.get('#board-box-2-0').click()
            cy.get('.game-board-out > .box').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })

        // Fail Test Case for Challenge 1.1
        it('fail challenge 1.1', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-1').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })

    })

    describe("challenge 1.2", () => {
        // Pass Test Case for Challenge 1.1
        it('pass challenge 1.2', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-2').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')
            cy.get('#board-box-2-0').click()
            cy.get('.game-board-out > .box').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })

        // Fail Test Case for Challenge 1.1
        it('fail challenge 1.2', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-2').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })

    })

    describe("challenge 1.3", () => {
        it('pass challenge 1.3', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-3').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
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
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 1.3', () => {
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-3').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')
            cy.get('#next-button').click().click().click().click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })

    })
})