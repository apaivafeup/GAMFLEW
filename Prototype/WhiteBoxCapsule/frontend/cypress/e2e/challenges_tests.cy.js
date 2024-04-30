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
    cy.visit('http://localhost:5173/#/challenges')
})

describe("test file 1", () => {
    describe("challenge 1.1", () => {
        // Pass Test Case for Challenge 1.1
        it('pass challenge 1.1', () => {
            // Go to challenge.
            cy.get('#challenge-1-play').click()
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('.game-board-out > .box').click()

            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 1.1', () => {
            // Go to challenge.
            cy.get('#challenge-1-play').click()
            
            // Submit solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()

            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.2", () => {
        // Pass Test Case for Challenge 1.2
        it('pass challenge 1.2', () => {
            // Go to challenge.
            cy.get('#challenge-2-play').click().wait(1000)
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('.game-board-out > .box').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })
    
        // Fail Test Case for Challenge 1.2
        it('fail challenge 1.2', () => {
            // Go to challenge.
            cy.get('#challenge-2-play').click().wait(1000)
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.3", () => {
        it('pass challenge 1.3', () => {
            // Go to challenge.
            cy.get('#challenge-3-play').click().wait(1000)
            
            // Solution.
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
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.3', () => {
            // Go to challenge.
            cy.get('#challenge-3-play').click().wait(1000)
            
            // Solution.
            cy.get('#next-button').click().click().click().click()
            
            /// Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.4", () => {
        it('pass challenge 1.4', () => {
            // Go to challenge.
            cy.get('#challenge-4-play').click().wait(1000)
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-3').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.4', () => {
            // Go to challenge.
            cy.get('#challenge-4-play').click().wait(1000)
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.5", () => {
        it('pass challenge 1.5', () => {
            // Go to challenge.
            cy.get('#challenge-5-play').click()
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-3').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
    
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.5', () => {
            // Go to challenge.
            cy.get('#challenge-5-play').click()
            
            // Solution.
            cy.get('#next-button').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.6", () => {
        it('pass challenge 1.6', () => {
            // Go to challenge.
            cy.get('#challenge-6-play').click()
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
    
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.6', () => {
            // Go to challenge.
            cy.get('#challenge-6-play').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.7", () => {
        it('pass challenge 1.7', () => {
            // Go to challenge.
            cy.get('#challenge-7-play').click()
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
    
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.7', () => {
            // Go to challenge.
            cy.get('#challenge-7-play').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.8", () => {
        it('pass challenge 1.8', () => {
            // Go to challenge.
            cy.get('#challenge-8-play').click()
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-4-2').click()
    
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.8', () => {
            // Go to challenge.
            cy.get('#challenge-8-play').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.9", () => {
        it('pass challenge 1.9', () => {
            // Go to challenge.
            cy.get('#challenge-9-play').click()
            
            // Solution.
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-4-2').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
    
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Test case.
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.9', () => {
            // Go to challenge.
            cy.get('#challenge-9-play').click()
    
            // Solution
            cy.get('#next-button').click()
            
            // Submit solution.
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            
            // Test case.
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.10", () => {
        it('pass challenge 1.10', () => {
            // Challenge Play
            cy.get('#challenge-10-play').click().wait(1000)
            
            // Solution
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
        
            // Submit solution
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
        
            // Test case
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.10', () => {
            // Challenge Play
            cy.get('#challenge-10-play').click().wait(1000)
            
            // No solution provided for fail challenge
            
            // Submit solution
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
        
            // Test case
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.11", () => {
        it('pass challenge 1.11', () => {
            // Challenge Play
            cy.get('#challenge-11-play').click().wait(1000)
            
            // Solution
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-3-1').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
        
            // Submit solution
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
        
            // Test case
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.11', () => {
            // Challenge Play
            cy.get('#challenge-11-play').click().wait(1000)
            
            // No solution provided for fail challenge
        
            // Submit solution
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
        
            // Test case
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.12", () => {
        it('pass challenge 1.12', () => {
            // Challenge Play
            cy.get('#challenge-12-play').click().wait(1000)
            
            // Solution
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-3-1').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
        
            // Submit solution
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
        
            // Test case
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.12', () => {
            // Challenge Play
            cy.get('#challenge-12-play').click().wait(1000)
            
            // No solution provided for fail challenge
            cy.get('#next-button').click()
        
            // Submit solution
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
        
            // Test case
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.13", () => {
        it('pass challenge 1.13', () => {
            // Challenge Play
            cy.get('#challenge-13-play').click().wait(1000)
            
            // Solution
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-4-2').click()
        
            // Submit solution
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
        
            // Test case
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.13', () => {
            // Challenge Play
            cy.get('#challenge-13-play').click().wait(1000)
            
            // No solution provided for fail challenge
        
            // Submit solution
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
        
            // Test case
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.14", () => {
        it('pass challenge 1.14', () => {
            cy.get('#challenge-14-play').click()
    
            cy.get('#board-box-1-1').click()
            cy.get('#board-box-3-3').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.14', () => {
            cy.get('#challenge-14-play').click()
    
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.15", () => {
        it('pass challenge 1.15', () => {
            cy.get('#challenge-15-play').click()
    
            cy.get('#board-box-5-3').click()
            cy.get('#board-box-3-3').click()
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-4-4').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.15', () => {
            cy.get('#challenge-15-play').click()
    
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.16", () => {
        it('pass challenge 1.16', () => {
            cy.get('#challenge-16-play').click()
    
            cy.get('#board-box-1-1').click()
            cy.get('#board-box-3-3').click()
            cy.get('#next-button').click()
            cy.get('#board-box-5-3').click()
            cy.get('#board-box-3-3').click()
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-4-4').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.16', () => {
            cy.get('#challenge-16-play').click()
    
            cy.get('#next-button').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.17", () => {
        it('pass challenge 1.17', () => {
            cy.get('#challenge-17-play').click()
    
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-2-2').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.17', () => {
            cy.get('#challenge-17-play').click()
    
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 1.18", () => {
        it('pass challenge 1.18', () => {
            cy.get('#challenge-18-play').click()
    
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-4-4').click()
            cy.get('#next-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-2-2').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.18', () => {
            cy.get('#challenge-18-play').click()
    
            cy.get('#next-button').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
})

describe('test file 2', () => {
    describe("challenge 2.1", () => {
        it('pass challenge 2.1', () => {
            cy.get('#challenge-19-play').click()
    
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
    
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.1', () => {
            cy.get('#challenge-19-play').click()
    
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.2", () => {
        it('pass challenge 2.2', () => {
            cy.get('#challenge-20-play').click()
    
            cy.get('#add-button').click()
    
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
    
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.2', () => {
            cy.get('#challenge-20-play').click()
    
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.3", () => {
        it('pass challenge 2.3', () => {
            cy.get('#challenge-21-play').click()
    
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
    
            cy.get('#add-button').click()
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
    
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.3', () => {
            cy.get('#challenge-21-play').click()
    
            cy.get('#next-button').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.4", () => {
        it('pass challenge 2.4', () => {
            cy.get('#challenge-22-play').click()
    
            cy.get('#add-button').click()
            cy.get('#board-box-5-0').click().click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.4', () => {
            cy.get('#challenge-22-play').click()
    
            cy.get('#next-button').click().click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.5", () => {
        it('pass challenge 2.5', () => {
            cy.get('#challenge-23-play').click()
    
            cy.get('#add-button').click()
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
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
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
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
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
            
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.5', () => {
            cy.get('#challenge-23-play').click()
    
            cy.get('#next-button').click().click()
            cy.get('#go-button').click()
    
            // Third section
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
    
            // Fourth section
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.6", () => {
        it('pass challenge 2.6', () => {
            cy.get('#challenge-24-play').click()
    
            cy.get('#add-button').click()
            for (let i = 0; i < 8; i = i + 1) {
                if (i == 3 || i == 4) {
                    continue;
                }
    
                if (i % 2 != 0) {
                    for (let j = 1; j <= 7; j = j + 2) {
                        if (i > 4)
                            cy.get('#board-box-' + i + '-' + j).click()
                        else 
                            cy.get('#board-box-' + i + '-' + j).click().click()
                    }
                } else {
                    for (let j = 0; j <= 7; j = j + 2) {
                        if (i > 4)
                            cy.get('#board-box-' + i + '-' + j).click()
                        else
                            cy.get('#board-box-' + i + '-' + j).click().click()
                    }
    
                }
            }
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.6', () => {
            cy.get('#challenge-24-play').click()
    
            cy.get('#next-button').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.7", () => {
        it('pass challenge 2.7', () => {
            cy.get('#challenge-25-play').click()
    
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
            cy.get('#board-box-0-3').click().click()
            cy.get('#add-button').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.7', () => {
            cy.get('#challenge-25-play').click()
    
            cy.get('#next-button').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.8", () => {
        it('pass challenge 2.8', () => {
            cy.get('#challenge-26-play').click().wait(1000)
    
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click().click()
            cy.get('#board-box-4-0').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.8', () => {
            cy.get('#challenge-26-play').click().wait(1000)
    
            cy.get('#next-button').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.9", () => {
        it('pass challenge 2.9', () => {
            cy.get('#challenge-27-play').click()
    
            cy.get('#add-button').click()
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
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.9', () => {
            cy.get('#challenge-27-play').click()
    
            cy.get('#next-button').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.10", () => {
        it('pass challenge 2.10', () => {
            cy.get('#challenge-28-play').click()
    
            cy.get('#board-box-1-1').click()
            cy.get('#board-box-1-0').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.10', () => {
            cy.get('#challenge-28-play').click()
    
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.11", () => {
        it('pass challenge 2.11', () => {
            cy.get('#challenge-29-play').click().wait(1000)
    
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-0-1').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.11', () => {
            cy.get('#challenge-29-play').click()
    
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.12", () => {
        it('pass challenge 2.12', () => {
    
    
    
            cy.get('#challenge-30-play').click().wait(1000)
    
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.12', () => {
    
    
    
            cy.get('#challenge-30-play').click().wait(1000)
    
            cy.get('#add-button').click()
    
            for (let i = 1; i < 2; i = i + 2) {
                for (let j = 1; j <= 7; j = j + 2) {
                    cy.get(`#board-box-${i}-${j}`).click().click()
                }
            }
    
            for (let i = 5; i <= 7; i = i + 2) {
                for (let j = 1; j <= 7; j = j + 2) {
                    cy.get(`#board-box-${i}-${j}`).click()
                }
            }
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.13", () => {
        it('pass challenge 2.13', () => {
    
    
    
            cy.get('#challenge-31-play').click().wait(1000)
    
            cy.get('#add-button').click()
            cy.get('#board-box-1-0').click()
            cy.get('#board-box-0-0').click().click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.13', () => {
    
    
    
            cy.get('#challenge-31-play').click().wait(1000)
    
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.14", () => {
        it('pass challenge 2.14', () => {
    
    
    
            cy.get('#challenge-32-play').click().wait(1000)
    
            cy.get('#add-button').click()
            cy.get('#board-box-1-0').click()
            cy.get('#board-box-0-0').click().click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-1-0').click()
            cy.get('#board-box-0-0').click().click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.14', () => {
    
    
    
            cy.get('#challenge-32-play').click().wait(1000)
    
            cy.get('#next-button').click()
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.15", () => {
        it('pass challenge 2.15', () => {
            // Section 1
            cy.get('#challenge-33-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click().click()
            cy.get('#board-box-5-3').click().click()
            cy.get('#board-box-5-5').click().click()
            cy.get('#board-box-5-7').click().click()
            cy.get('#board-box-6-0').click().click()
            cy.get('#board-box-6-2').click().click()
            cy.get('#board-box-6-4').click().click()
            cy.get('#board-box-6-6').click().click()
            cy.get('#board-box-7-1').click().click()
            cy.get('#board-box-7-3').click().click()
            cy.get('#board-box-7-5').click().click()
            cy.get('#board-box-7-7').click().click()
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-0-2').click()
            cy.get('#board-box-0-4').click()
            cy.get('#board-box-0-6').click()
            cy.get('#board-box-1-1').click()
            cy.get('#board-box-1-3').click()
            cy.get('#board-box-1-5').click()
            cy.get('#board-box-1-7').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-2-4').click()
            cy.get('#board-box-2-6').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.15', () => {
            cy.get('#challenge-33-play').click().wait(1000)
    
            // Third section
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)
            cy.get('.alert-danger').should('be.visible')
        })
    })
})

describe('test file 3', () => {
    describe("challenge 3.1", () => {
        it('pass challenge 3.1', () => {
            // Section 1
            cy.get('#challenge-34-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#board-box-0-1').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.1', () => {
            // Section 1
            cy.get('#challenge-34-play').click().wait(1000)
    
            // Section 2


            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.2", () => {
        it('pass challenge 3.2', () => {
            // Section 1
            cy.get('#challenge-35-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#board-box-0-1').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.2', () => {
            // Section 1
            cy.get('#challenge-35-play').click().wait(1000)
    
            // Section 2


            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.3", () => {
        it('pass challenge 3.3', () => {
            // Section 1
            cy.get('#challenge-36-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#board-box-0-1').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.3', () => {
            // Section 1
            cy.get('#challenge-36-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.4", () => {
        it('pass challenge 3.4', () => {
            // Section 1
            cy.get('#challenge-37-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#board-box-0-1').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.4', () => {
            // Section 1
            cy.get('#challenge-37-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.5", () => {
        it('pass challenge 3.5', () => {
            // Section 1
            cy.get('#challenge-38-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.5', () => {
            // Section 1
            cy.get('#challenge-38-play').click().wait(1000)
    
            // Section 2

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.6", () => {
        it('pass challenge 3.6', () => {
            // Section 1
            cy.get('#challenge-39-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.6', () => {
            // Section 1
            cy.get('#challenge-39-play').click().wait(1000)
    
            // Section 2

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.7", () => {
        it('pass challenge 3.7', () => {
            // Section 1
            cy.get('#challenge-40-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.7', () => {
            // Section 1
            cy.get('#challenge-40-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.8", () => {
        it('pass challenge 3.8', () => {
            // Section 1
            cy.get('#challenge-41-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#board-box-0-1').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.8', () => {
            // Section 1
            cy.get('#challenge-41-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.9", () => {
        it('pass challenge 3.9', () => {
            // Section 1
            cy.get('#challenge-42-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-5-1').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.9', () => {
            // Section 1
            cy.get('#challenge-42-play').click().wait(1000)
    
            // Section 2

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.10", () => {
        it('pass challenge 3.10', () => {
            // Section 1
            cy.get('#challenge-43-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    cy.get('#board-box-' + i + '-' + j).click()
                }
            }
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.10', () => {
            // Section 1
            cy.get('#challenge-43-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.11", () => {
        it('pass challenge 3.11', () => {
            // Section 1
            cy.get('#challenge-44-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.11', () => {
            // Section 1
            cy.get('#challenge-44-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.12", () => {
        it('pass challenge 3.12', () => {
            // Section 1
            cy.get('#challenge-45-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.12', () => {
            // Section 1
            cy.get('#challenge-45-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.13", () => {
        it('pass challenge 3.13', () => {
            // Section 1
            cy.get('#challenge-46-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.13', () => {
            // Section 1
            cy.get('#challenge-46-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.14", () => {
        it('pass challenge 3.14', () => {
            // Section 1
            cy.get('#challenge-47-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#board-box-0-1').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click()
            cy.get('#board-box-0-1').click()
            cy.get('#add-button').click()
            cy.get('#board-box-1-2').click().click()
            cy.get('#board-box-1-0').click().click()
            cy.get('#add-button').click()


            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.14', () => {
            // Section 1
            cy.get('#challenge-47-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 3.15", () => {
        it('pass challenge 3.15', () => {
            // Section 1
            cy.get('#challenge-48-play').click().wait(1000)
    
            // Section 2
            cy.get('#add-button').click()
            cy.get('#board-box-5-1').click().click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    cy.get('#board-box-' + i + '-' + j).click().click()
                }
            }
            cy.get('#add-button').click()
            
            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-success').should('be.visible')
        })

        it('fail challenge 3.15', () => {
            // Section 1
            cy.get('#challenge-48-play').click().wait(1000)
    
            // Section 2
            cy.get('#next-button').click()

            // Section 3
            cy.get('#go-button').click()
            cy.get('#comment-modal-textarea').type('Example comment.')
            cy.get('#comment-modal-button').click().wait(1000)
            cy.on('window:confirm', () => false)

            // Section 4
            cy.get('.alert-danger').should('be.visible')
        })
    })
})