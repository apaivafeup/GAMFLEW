describe('Authentication', () => {
    it('logs in', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#exampleInputUsername').type('professor')
        cy.get('#exampleInputPassword').type('password')
        cy.get('#login-button').click({ force: true })
        cy.contains('Single Player').should('be.visible')
    })

    it('logs out', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#exampleInputUsername').type('professor')
        cy.get('#exampleInputPassword').type('password')
        cy.get('#login-button').click({ force: true })
        cy.contains('Single Player').should('be.visible')
        cy.get('#logout-button').click()
        cy.contains('Login').should('be.visible')
    })

    it('error page (not authorized - example)', () => {
        cy.visit('http://localhost:5173/#/challenge/1')
        cy.contains('401').should('be.visible')
    })

    it('moving from error page', () => {
        cy.visit('http://localhost:5173/#/challenge/1')
        cy.contains('401').should('be.visible')
        cy.get('#home-button').click()
        cy.contains('Login').should('be.visible')
    })

    it('registers a user', () => {
        cy.visit('http://localhost:5173/')
        cy.get('#register-link').click()
        cy.get('#name').type('Test User')
        cy.get('#username').type('testuser')
        cy.get('#email').type('test@test.com')
        cy.get('#password').type('password')
        cy.get('#password-confirm').type('password')
        cy.get('#picture').selectFile('./utils/avatar.png', { subjectType: 'input' })
        cy.get('#register-button').click()
        cy.on('window:alert', (str) => {
            expect(str).to.equal('You have successfully registered. You can now login.')
          })
    })
})