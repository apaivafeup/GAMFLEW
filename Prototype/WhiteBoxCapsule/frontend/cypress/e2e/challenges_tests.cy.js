describe("test file 1", () => {
    describe("challenge 1.1", () => {
        // Pass Test Case for Challenge 1.1
        it('pass challenge 1.1', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            // Step 3: Click on the element with the ID #challenge-card-4
            cy.get('#challenge-card-2').click()

            // Step 4: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 5: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 6: Move red piece from (2, 0) to (5, 4)
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-5-4').click()

            // Step 7: Click on the element with the ID #go-button for "Go!"
            cy.get('#go-button').click()

            // Step 8: Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible')
        })

        // Fail Test Case for Challenge 1.1
        it('fail challenge 1.1', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            // Step 3: Click on the element with the ID #challenge-card-4
            cy.get('#challenge-card-2').click()

            // Step 4: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 5: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 6: Move red piece from (2, 0) to (3, 4)
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-4').click()

            // Step 7: Click on the element with the ID #go-button for "Go!"
            cy.get('#go-button').click()

            // Step 8: Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible')
        })

    })


    describe("challenge 1.2", () => {
        it('fail challenge 1.2', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            // Step 3: Click on the element with the ID #challenge-card-4
            cy.get('#challenge-card-3').click()

            // Step 4: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 5: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 6: Move red piece from (2, 0) to (3, 4)
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-4').click()

            // Step 7: Click on the element with the ID #next-button for "next"
            cy.get('#next-button').click()

            // Step 8: Move red piece from (2, 0) to (3, 4)
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-3-4').click()

            // Step 9: Click on the element with the ID #go-button for "Go!"
            cy.get('#go-button').click()

            // Step 10: Verify the expected message
            cy.get('.alert-danger').should('be.visible')
        })



        it('pass challenge 1.2', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            // Step 3: Click on the element with the ID #challenge-card-4
            cy.get('#challenge-card-3').click()

            // Step 4: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 5: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 6: Move red piece from (2, 0) to (5, 4)
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-5-4').click()

            // Step 7: Click on the element with the ID #next-button for "next"
            cy.get('#next-button').click()

            // Step 8: Move red piece from (2, 0) to (5, 0)
            cy.get('#board-box-2-0').click()
            cy.get('#board-box-5-0').click()

            // Step 9: Click on the element with the ID #go-button for "Go!"
            cy.get('#go-button').click()

            // Step 10: Verify the expected message
            cy.get('.alert-success').should('be.visible')
        })


    })

});

describe("test file 2", () => {
    // Challenge 2.1
    describe("challenge 2.1", () => {
        // Pass Test Case for Challenge 2.1
        it('pass challenge 2.1', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            cy.get('#accordion-button-2').click()

            // Step 3: Click on the element with the ID #challenge-card-x (replace x with the correct challenge ID)
            cy.get('#challenge-card-4').click()

            // Step 4: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 5: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 6: Add Click (0, 0) Go!
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('#go-button').click()

            // Step 7: Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible')
        });

        // Fail Test Case for Challenge 2.1
        it('fail challenge 2.1', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            cy.get('#accordion-button-2').click()

            // Step 3: Click on the element with the ID #challenge-card-x (replace x with the correct challenge ID)
            cy.get('#challenge-card-4').click()

            // Step 4: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 5: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 6: Add Click (0, 0) Go!
            cy.get('#go-button').click()

            // Step 7: Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible')
        });
    });

    describe("challenge 2.2", () => {
        // Pass Test Case for Challenge 2.2
        it('pass challenge 2.2', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            // Step 3: Click on the element with the ID #accordion-button-2
            cy.get('#accordion-button-2').click()

            // Step 4: Click on the element with the ID #challenge-card-5
            cy.get('#challenge-card-5').click()

            // Step 5: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 6: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 7: Add Click (0, 0) Go!
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('#go-button').click()

            // Step 8: Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible')
        });

        // Fail Test Case for Challenge 2.2
        it('fail challenge 2.2', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            // Step 3: Click on the element with the ID #accordion-button-2
            cy.get('#accordion-button-2').click()

            // Step 4: Click on the element with the ID #challenge-card-5
            cy.get('#challenge-card-5').click()

            // Step 5: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 6: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 7: Add Click (0, 0) Go!
            cy.get('#go-button').click()

            // Step 8: Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible')
        });
    });

    describe("challenge 2.3", () => {
        // Challenge 2.3
        // Pass Test Case for Challenge 2.3
        it('pass challenge 2.3', () => {
            // Step 1-6: Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-2').click()
            cy.get('#challenge-card-7').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#go-button').click()

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });



        // Fail Test Case for Challenge 2.3
        it('fail challenge 2.3', () => {
            // Step 1: Visit the specified URL
            cy.visit('http://localhost:5173/')

            // Step 2: Click on the element with the ID #single-player-button
            cy.get('#single-player-button').click()

            // Step 3: Click on the element with the ID #accordion-button-2
            cy.get('#accordion-button-2').click()

            // Step 4: Click on the element with the ID #challenge-card-6
            cy.get('#challenge-card-6').click()

            // Step 5: Wait for the guide modal to be visible, wait for 500 milliseconds, then close the modal
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)

            // Step 6: Verify that the guide modal is not visible
            cy.get('#guide-modal').should('not.be.visible')

            // Step 7: Next
            cy.get('#next-button').click()

            // Step 8: Next
            cy.get('#next-button').click()

            // Step 9: Go!
            cy.get('#go-button').click()

            // Step 10: Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible')
        });
    });
});

describe("test file 3", () => {
    describe("challenge 3.1", () => {
        // Challenge 2.3
        // Pass Test Case for Challenge 2.3
        it('pass challenge 3.1', () => {
            // Step 1-6: Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-3').click()
            cy.get('#challenge-card-7').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#go-button').click()

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });



        // Fail Test Case for Challenge 2.3
        it('fail challenge 3.1', () => {
            // Step 1-6: Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-3').click()
            cy.get('#challenge-card-7').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#add-button').click()
            for (let x = 5; x <= 7; x++) {
                for (let y = 0; y <= 7; y++) {
                    cy.get(`#board-box-${x}-${y}`).click();
                }
            }

            cy.get('#go-button').click()

            // Step 10: Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible')
        });
    });

    describe("challenge 3.2", () => {
        // Assuming you have a loop to iterate over the coordinates
        // Pass Test Case
        it('pass challenge 3.2', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-3').click()
            cy.get('#challenge-card-8').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#add-button').click();
            for (let y = 0; y <= 7; y++) {
                cy.get(`#board-box-0-${y}`).click();
                cy.get(`#board-box-0-${y}`).click();
            }

            for (let x = 1; x <= 7; x++) {
                for (let y = 0; y <= 7; y++) {
                    cy.get(`#board-box-${x}-${y}`).click();
                }
            }

            cy.get('#add-button').click();
            cy.get('#next-button').click();
            cy.get('#add-button').click();

            for (let y = 0; y <= 1; y++) {
                cy.get(`#board-box-0-${y}`).click();
                cy.get(`#board-box-0-${y}`).click();
            }

            cy.get('#board-box-1-0').click()


            cy.get('#go-button').click();

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });

        // Fail Test Case
        it('fail challenge 3.2', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-3').click()
            cy.get('#challenge-card-8').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#next-button').click();
            cy.get('#next-button').click();
            cy.get('#go-button').click();

            // Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible');
        });

    });

    describe("challenge 3.3", () => {
        // Assuming you have a loop to iterate over the coordinates
        // Pass Test Case
        it('pass challenge 3.3', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-3').click()
            cy.get('#challenge-card-9').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#add-button').click();
            for (let y = 0; y <= 7; y++) {
                cy.get(`#board-box-2-${y}`).click();
            }

            cy.get('#add-button').click();
            cy.get('#next-button').click();
            cy.get('#add-button').click();

            for (let y = 0; y <= 7; y++) {
                cy.get(`#board-box-3-${y}`).click();
            }

            cy.get('#go-button').click();

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });

        // Fail Test Case
        it('fail challenge 3.3', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-3').click()
            cy.get('#challenge-card-9').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#next-button').click();
            cy.get('#go-button').click();

            // Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible');
        });

    });

    describe("challenge 3.4", () => {
        // Assuming you have a loop to iterate over the coordinates
        // Pass Test Case
        it('pass challenge 3.4', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-3').click()
            cy.get('#challenge-card-10').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            cy.get('#go-button').click();

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });

        // Fail Test Case
        it('fail challenge 3.4', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-3').click()
            cy.get('#challenge-card-10').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#add-button').click();

            for (let x = 0; x <= 2; x++) {
                for (let y = 0; y <= 7; y++) {
                    cy.get(`#board-box-${x}-${y}`).click();
                }
            }

            for (let x = 5; x <= 7; x++) {
                for (let y = 0; y <= 7; y++) {
                    cy.get(`#board-box-${x}-${y}`).click();
                    cy.get(`#board-box-${x}-${y}`).click();
                }
            }

            cy.get('#go-button').click();

            // Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible');
        });
    });
});

describe("test file 4", () => {
    describe("challenge 4.1", () => {
        // Assuming you have a loop to iterate over the coordinates
        // Pass Test Case
        it('pass challenge 4.1', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-4').click()
            cy.get('#challenge-card-11').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-0-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
            cy.get('#board-box-0-0').click()
            cy.get('#go-button').click();

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });

        // Fail Test Case
        it('fail challenge 4.1', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-4').click()
            cy.get('#challenge-card-11').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#go-button').click();

            // Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible');
        });

    });

    describe("challenge 4.2", () => {
        // Assuming you have a loop to iterate over the coordinates
        // Pass Test Case
        it('pass challenge 4.2', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-4').click()
            cy.get('#challenge-card-12').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('.game-board-out > .box').click()
            cy.get('#go-button').click();

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });

        // Fail Test Case
        it('fail challenge 4.2', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-4').click()
            cy.get('#challenge-card-12').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#go-button').click();

            // Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible');
        });

    });

    describe("challenge 4.3", () => {
        // Assuming you have a loop to iterate over the coordinates
        // Pass Test Case
        it('pass challenge 4.3', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-4').click()
            cy.get('#challenge-card-13').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('.game-board-out > .box').click()
            cy.get('#go-button').click();

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });

        // Fail Test Case
        it('fail challenge 4.3', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-4').click()
            cy.get('#challenge-card-13').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#go-button').click();

            // Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible');
        });
    });

    describe("challenge 4.4", () => {
        // Assuming you have a loop to iterate over the coordinates
        // Pass Test Case
        it('pass challenge 4.4', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-4').click()
            cy.get('#challenge-card-14').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('#board-box-0-1').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-1').click()
            cy.get('#board-box-0-0').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('.game-board-out > .box').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click().click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()
            cy.get('.game-board-out > .box').click()
            cy.get('#next-button').click()
            cy.get('#add-button').click()
            cy.get('#board-box-0-0').click()

            cy.get('#go-button').click();

            // Verify the expected message for a successful move
            cy.get('.alert-success').should('be.visible');
        });

        // Fail Test Case
        it('fail challenge 4.4', () => {
            // Common steps for all test cases
            cy.visit('http://localhost:5173/')
            cy.get('#single-player-button').click()
            cy.get('#accordion-button-4').click()
            cy.get('#challenge-card-14').click()
            cy.get('#guide-modal').should('be.visible').wait(500)
            cy.get('#guide-modal-close-button').click().wait(1000)
            cy.get('#guide-modal').should('not.be.visible')

            // Specific test case instructions
            cy.get('#next-button').click().click().click()
            cy.get('#go-button').click();

            // Verify the expected message for a failed move
            cy.get('.alert-danger').should('be.visible');
        });

    });
});

describe("test file 5", () => {
    
});