# GAMFLEW

## Description
GAMFLEW is a serious game, manifested in a web application compatible with most web browsers, focused on teaching white-box testing concepts.

## Prerequisites
- The game is available for playing [here](https://fe.up.pt/gamflew/).
- To run a local version, you need to have Docker installed. If you don't have it installed, you can download it from [here](https://www.docker.com/products/docker-desktop).
  - Docker Desktop has everything needed. Be sure it's running before moving on.

## Installation (Docker)
1. After cloning this repository, you should have two folders: `backend` and `frontend`. You also need a `docker-compose.yaml` file.
2. Open a terminal and, if not there already, navigate to the folder where the `docker-compose.yaml` file is located.
3. Run the following command to start the application:
   ```bash
   docker-compose up
   ```
4. The application should be running now. You can access it by opening a web browser and going to `http://localhost:5473`.
    - You can also access it via the Docker Desktop GUI.

## Configuring pgAdmin4 (optional, but useful)
One of the containers that is created when running the `docker-compose up` command is a pgAdmin4 container. This container is used to manage the database. To access it, you need to open a web browser and go to `http://localhost:4321`. You can log in using the following credentials:
   - user@pgadmin.com
   - password

With this done, you should see the pgAdmin4 dashboard. To the left, right-click "Servers" and select ``Register`` > ``Server``. This should open a form in a "General" tab. Here, you can give the server a name - *PostgreSQL* is recommended.

After that, go to the "Connection" tab. Here, you need to fill in the following fields:
   - Host name/address: `database`
   - Port: `5432`
   - Maintenance database: `prototype`
   - Username: `postgres`
   - Password: `password`

After this, click save, and it's all done. You don't need to do anything else from pgAdmin4, but it will be used by the end of the experiment to collect data from your usage.

## Using the application

## Player User
You just need to authenticate in the frontend:
    - username: student
    - password: password
After that, you can use the application as a student. Check the instruction guide for more information.

## Teacher User
You just need to authenticate in the frontend:
    - username: professor
    - password: password
After that, you can use the application as a teacher. Check the instruction guide for more information.

### New Player User
You can register your user if you so wish. You cannot register a user with an already existing username.

## How to Play
Please check the application's Menu (shown right after authentication) to learn about the game's mechanics (click the "How to Play" button).
