# White Box Testing Serious Game Prototype: Installation Guide

## Backend Dependencies
Starting from the folder this README file is on, open a terminal and run the following commands:
```
cd backend
pip install -r requirements.txt
```
postgres is also required. pgadmin is recommended for managing the database.

## Running the Backend API
In the same folder as before, run the following command:
```
python main.py
```
Don't close this terminal - it needs to be active for the API to work.

## Running the frontend
The frontend uses Vue, so *npm* is required. Install them if needed!
In a new terminal, run the following commands (starting from the folder this README file is on):
```
cd frontend
npm run dev
```
This runs the development mode of the frontend. It won't automatically open, most probably. Check the terminal and see if an address similar to *http://localhost:5173/* is given to you. Going there on any web browser will open the app.
Don't close the terminal - it needs to be active for the frontend to work.

## Running Cypress (end-to-end testing)
A command was defined to run Cypress:
```
npm run test
```
It will automatically open Cypress.  **Note that you need to run both the backend and the frontend for it to work!**
After this, select "End to End Testing", your browser of choice, and click on any file ("spec") to run it.

## Troubleshooting
- If the frontend runs but it's all white, you might've forgotten to run the backend.
- For any other issues, contact me! ;)