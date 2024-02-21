describe('Challenge Content Creator', () => {
    it('opens the challenge content creator', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#content-creator-button').click()

        cy.contains('Existing States')
    })

    it('making a state', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#content-creator-button').click()

        cy.contains('Existing States')

        cy.get('#add-button').click()
        cy.get('#state-name').type('Test State')
        cy.get('#submit-button').click()
        cy.contains('Challenge Content Creator')
    })

    it('editing a state', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#content-creator-button').click()

        cy.contains('Existing States').wait(1500)

        cy.get('#board-state-select').select(3)
        cy.get('#board-state-select > #board-state-full').trigger('click', { force: true })
        cy.get('#submit-button').click()
        cy.get('#state-name').type('Test State 2')
        cy.contains('Challenge Content Creator')
    })
})