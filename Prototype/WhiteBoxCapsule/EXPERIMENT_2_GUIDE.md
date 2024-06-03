# GANFLEW, Teacher View: Validation Experiment

This document serves as a script/guide to a validation experiment of GAMFLEW, a new serious game to teach white-box testing techiniques. Please follow the instructions below to properly proceed during the experiment.

## 1. Introduction
This experiment happens at your own pace, but, as a suggestion, one should only need at maximum 60 minutes to complete it.
There are two parts to the experiment:
1. Part 1: Playing The Game - to allow you to properly understand the game mechanics, you are provided with a small list of suggested challenges for you to complete one from the perspective of a player/student.
2. Part 2: Teacher View - after playing the game, you will be ready to take the role of a teacher and follow a short tutorial on how to create your own challenges for the game. After this, there is a questionnaire.
   1. Part 2.1: Tutorial - a step-by-step guide on how to create a challenge and overview of other features.
   2. [OPTIONAL] Part 2.2: Create Your Own Challenge - you can create your own challenge and share it with us.
   3. Part 2.3: Post-Questionnaire - a set of questions to evaluate the game and the challenge creation process, 

## 2. Part 1: Playing The Game
The game is available at [this link](https://fe.up.pt/gamflew/).

To play the game, it is required to go through authentication. For your purposes, you can simply use the following account:
- Username: `professor`
- Password: `password`

However, if you want to create your own account, you can do so by clicking on the "Register" link on the login page. After creating it, you must validate your account to be able to use it. You can do so using the account above (Login -> Validate Administrators -> Find Your User -> Click "Validate").

After authentication, you will be redirected to the game's main page. Here, click on the "Single Player" button.

You will then be in the Challenges page, where all existing challenges are listed. 99 challenges are available, but, to make it easier, we selected the following challenges:
1. Challenge 1.1 (Statement coverage, Very Easy)
2. Challenge 1.2 (Decision coverage, Easy)
3. Challenge 1.3 (Modified condition/decision coverage, Hard)
4. Challenge 2.6 (Condition/decision coverage, Normal)
5. Challenge 2.8 (Condition coveraage, Easy)

For the purpose of this experiment, we only ask you to complete one of the challenges. After this, one should be familiar enough with the game mechanics to proceed to Part 2.

### How to Play
The game is built on a simple idea: players get a challenge, containing a code and specific coverage objective. The player must then "write" test cases to achieve the coverage objective. 

To "write" test cases, there is a board, based on the game Checkers.

To keep this script short, please check the "How to Play" page (Login -> How to Play) for a detailed explanation of the mechanics (or click [here](https://fe.up.pt/gamflew/#/how-to)).

## 3. Part 2: Teacher View
After playing the game, you are ready to take the role of a teacher. This part is divided into three sections: Tutorial, Create Your Own Challenge, and Post-Questionnaire.

Know that there is a specific "Teacher View" tab on the "How to Play" page, which may be useful before this part. It's a quick read!

### 3.1 Tutorial

#### 3.1.1 The Challenge Manager Pages
This tutorial intends to guide you through the process of creating a challenge. To start, go to the "Challenge Manager" page. For this part, we invite you to open the same challenge you beat, to see how it came to be and read go through this part while checking it.

To do that, one just have to go to an existing challenge and click the "Edit" button. Obviously, to create a new challenge, one should click the "Create Challenge" button.

After opening a challenge, you will see a form with several fields. The first two are the initial board state and the code file associated with the challenge. These should be familiar to you, as they are what you are first shown when opening the challenge you played.

While in this page you can only select existing entries for the initial pair of fields, you can create new ones by going to the "Challenge Content Creator" (click [here](https://fe.up.pt/gamflew/#/challenge-content-creator)). There, you can create new board states to initialize challenges and new code files to associate with them. They're pretty self-explanatory, only requiring a name and their content (check ["How to Play"](https://fe.up.pt/gamflew/#/how-to) for more details). We will be using the page later in the tutorial.

After the first two fields, there is a pretty standard form: this is where everything is filled up (challenge title, its objective, the hint shown to struggling students, coverage type, difficulty).

