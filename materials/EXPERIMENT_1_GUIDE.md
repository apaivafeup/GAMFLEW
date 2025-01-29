# Gamflew: Validation Experiment

- Before anything else, welcome everyone that appears and make sure everyone is settled and paying attention.
- For remote participants, make sure they can hear you.

## Part 1 - Explaining The Experiment
- The experiment is programmed for around 2h.
- Preparation is expected from people, and if they haven't done it, you should be ready to provide them with whatever they need (USB pen with Docker Desktop + Gamflew zip file).
- Before they interact with the game, they are expected to answer a short and anonymous pre-questionnaire.
- After the pre-questionnaire, around 15 minutes will be reserved to explain the different concepts that are related to the serious game.
- Then, they'll have 1h to solve 5 separate challenges, and they can also explore more out of the existing challenges if they so wish *after* they finish the 5 given challenges.
- We'll finish the 1h with some instructions to collect data from the experiment through the database included in the docker containers.
- Finally, they'll answer a post-questionnaire and a short exam to evaluate their knowledge of the covered concepts.

## Part 2 - White-box Testing Explanation
- The short presentation just covers:
    - Definition of White box testing.
    - Code Coverage concepts:
        - Statement coverage.
        - Decision coverage.
        - Condition coverage.
        - Condition/decision coverage.
        - Modified condition/decision coverage.
    - For each of the code coverage concepts, there is a simple example to explain it all.
    - Explaining how the code coverage is used in the game and the basic elements of the game (code file, board state, adding and moving pieces, multiple test cases and submitting an attempt).
        - Code files are code snippets for which they're expected to hit code coverage objectives.
        - To hit those code coverage objectives, they interact with the board, changing its state with movements and adding and removing pieces (ask them to see "How to Play" for explanation on certain mechanics).
        - For challenges with multiple test cases, each test case can be accessed using "Next" and "Previous", only on the final test case can they verify their submission.
        - Each passed challenge should be commented - without commenting, it won't be counted. They don't have to submit failed attempts, but they also can and are encouraged if they feel like it.


## Part 3 - Playing the Game

### Part 3.1 - Recommended Challenges
There are only 5 challenges the players need to finish:
* Challenge 1.1 (example of a statement coverage challenge)
* Challenge 1.2 (example of a decision coverage challenge)
* Challenge 2.8 (example of condition coverage)
* Challenge 2.7 (example of condition/decision coverage)
* Challenge 2.4 (example of modified condition/decision coverage)

### Part 3.2 - Collecting Quick Information
- The users will be instructed to open pgAdmin and allow for a screenshot to be taken of their Attempts table, which comprises all the attempts they made.
- Beyond this, they will be asked directly:
    - which challenge they found the easiest
    - which challenge they found the hardest
    - an estimate of how much time per challenge did they take, on average.

## Part 4 - Post Questionnaire and Exam
The post questionnaire and exams are applied using Google Forms.