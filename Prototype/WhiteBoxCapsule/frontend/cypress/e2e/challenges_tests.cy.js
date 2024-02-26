beforeEach('login', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#exampleInputUsername').type('professor@prototype.com')
    cy.get('#exampleInputPassword').type('password')
    cy.get('#login-button').click({force: true})
    cy.viewport(1920, 1080)
    cy.wait(1000)
})

describe("test file 1", () => {
    describe("challenge 1.1", () => {
        // Pass Test Case for Challenge 1.1
        it('pass challenge 1.1', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-1').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('.game-board-out > .box').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })

        // Fail Test Case for Challenge 1.1
        it('fail challenge 1.1', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-1').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })

    })

    describe("challenge 1.2", () => {
        // Pass Test Case for Challenge 1.1
        it('pass challenge 1.2', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-2').click()
            
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
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-2').click()
            
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
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-3').click()
            
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
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-3').click()
            
            cy.get('#next-button').click().click().click().click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })

    })

    describe("challenge 1.4", () => {
        it('pass challenge 1.4', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-4').click()
            
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-3').click()
    
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.4', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-4').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    
    })

    describe("challenge 1.5", () => {
        it('pass challenge 1.5', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-5').click()
            
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-3').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
    
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.5', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-5').click()
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.6", () => {
        it('pass challenge 1.6', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-6').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
    
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.6', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-6').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.7", () => {
        it('pass challenge 1.7', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-7').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
    
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.7', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-7').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.8", () => {
        it('pass challenge 1.8', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-8').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-4-2').click()
    
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.8', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-8').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.9", () => {
        it('pass challenge 1.9', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-9').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-4-2').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-5-3').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.9', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-9').click()
            
            cy.get('#next-button').click().click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.10", () => {
        it('pass challenge 1.10', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-10').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.10', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-10').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.11", () => {
        it('pass challenge 1.11', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-11').click()
            
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-3-1').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.11', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-11').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.12", () => {
        it('pass challenge 1.12', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-12').click()
            
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-3-1').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#next-button').click()
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.12', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-12').click()
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.13", () => {
        it('pass challenge 1.13', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-13').click()
            
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-4-2').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.13', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-13').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.14", () => {
        it('pass challenge 1.14', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-14').click()
            
            cy.get('#board-box-1-1').click()
            cy.get('#board-box-3-3').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.14', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-14').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.15", () => {
        it('pass challenge 1.15', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-15').click()
            
            cy.get('#board-box-5-3').click()
            cy.get('#board-box-3-3').click()
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-4-4').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.15', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-15').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.16", () => {
        it('pass challenge 1.16', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-16').click()
            
            cy.get('#board-box-1-1').click()
            cy.get('#board-box-3-3').click()
            cy.get('#next-button').click()
            cy.get('#board-box-5-3').click()
            cy.get('#board-box-3-3').click()
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-4-4').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.16', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-16').click()
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.17", () => {
        it('pass challenge 1.17', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-17').click()
            
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-2-2').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.17', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-17').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 1.18", () => {
        it('pass challenge 1.18', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-18').click()
            
            cy.get('#board-box-2-2').click()
            cy.get('#board-box-4-4').click()
            cy.get('#next-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-2-2').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 1.18', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#challenge-card-18').click()
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })
})

describe('test file 2', () => {
    describe("challenge 2.1", () => {
        it('pass challenge 2.1', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-19').click()
            
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.1', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-19').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.2", () => {
        it('pass challenge 2.2', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-20').click()
            
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
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.2', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-20').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.3", () => {
        it('pass challenge 2.3', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-21').click()
            
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
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.3', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-21').click()
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })
    
    describe("challenge 2.4", () => {
        it('pass challenge 2.4', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-22').click()
            
            cy.get('#add-button').click()
            cy.get('#board-box-5-0').click().click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.4', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-22').click()
            
            cy.get('#next-button').click().click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.5", () => {
        it('pass challenge 2.5', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-23').click()
            
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
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.5', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-23').click()
            
            cy.get('#next-button').click().click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.6", () => {
        it('pass challenge 2.6', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-24').click()
            
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
            
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.6', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-24').click().wait(1000)
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.7", () => {
        it('pass challenge 2.7', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-25').click().wait(1000)
    
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
            cy.get('#board-box-0-3').click().click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
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
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.7', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-25').click().wait(1000)
    
            cy.get('#next-button').click().click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.8", () => {
        it('pass challenge 2.8', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-26').click()
            
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click().click()
            cy.get('#board-box-4-0').click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.8', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-26').click()
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.9", () => {
        it('pass challenge 2.9', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-27').click()
            
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
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.9', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-27').click()
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.10", () => {
        it('pass challenge 2.10', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-28').click()
            
            cy.get('#board-box-1-1').click()
            cy.get('#board-box-1-0').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.10', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-28').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.11", () => {
        it('pass challenge 2.11', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-29').click()
            
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-0-1').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.11', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-29').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.12", () => {
        it('pass challenge 2.12', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-30').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.12', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-30').click()
            
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
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.13", () => {
        it('pass challenge 2.13', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-31').click()
            
            cy.get('#add-button').click()
            cy.get('#board-box-1-0').click()
            cy.get('#board-box-0-0').click().click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.13', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-31').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.14", () => {
        it('pass challenge 2.14', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-32').click()
            
            cy.get('#add-button').click()
            cy.get('#board-box-1-0').click()
            cy.get('#board-box-0-0').click().click()
            cy.get('#add-button').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-1-0').click()
            cy.get('#board-box-0-0').click().click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.14', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-32').click()
            
            cy.get('#next-button').click()
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })

    describe("challenge 2.15", () => {
        it('pass challenge 2.15', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-33').click()
            
            cy.get('#add-button').click().wait(100)
            cy.get('#board-box-0-1').click().click()
            cy.get('#board-box-0-3').click().click()
            cy.get('#board-box-0-5').click().click()
            cy.get('#board-box-0-7').click().click()
            cy.get('#board-box-1-0').click().click()
            cy.get('#board-box-1-2').click().click()
            cy.get('#board-box-1-4').click().click()
            cy.get('#board-box-1-6').click().click()
            cy.get('#board-box-2-1').click().click()
            cy.get('#board-box-2-3').click().click()
            cy.get('#board-box-2-5').click().click()
            cy.get('#board-box-2-7').click().click()
            cy.get('#board-box-3-0').click().click()
            cy.get('#board-box-3-1').click().click()
            cy.get('#board-box-3-2').click().click()
            cy.get('#board-box-3-3').click().click()
            cy.get('#board-box-3-4').click().click()
            cy.get('#board-box-3-5').click().click()
            cy.get('#board-box-3-6').click().click()
            cy.get('#board-box-3-7').click().click()
            cy.get('#board-box-4-0').click()
            cy.get('#board-box-4-1').click()
            cy.get('#board-box-4-2').click()
            cy.get('#board-box-4-3').click()
            cy.get('#board-box-4-4').click()
            cy.get('#board-box-4-5').click()
            cy.get('#board-box-4-6').click()
            cy.get('#board-box-4-7').click()
            cy.get('#board-box-5-0').click()
            cy.get('#board-box-5-2').click()
            cy.get('#board-box-5-4').click()
            cy.get('#board-box-5-6').click()
            cy.get('#board-box-6-1').click()
            cy.get('#board-box-6-3').click()
            cy.get('#board-box-6-5').click()
            cy.get('#board-box-6-7').click()
            cy.get('#board-box-7-0').click()
            cy.get('#board-box-7-2').click()
            cy.get('#board-box-7-4').click()
            cy.get('#board-box-7-6').click()
            cy.get('#go-button').click()
            cy.get('.alert-success').should('be.visible')
        })
    
        it('fail challenge 2.15', () => {
            
            cy.get('#single-player-button').click().wait(1000)
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-33').click()
            
            cy.get('#go-button').click()
            cy.get('.alert-danger').should('be.visible')
        })
    })
})