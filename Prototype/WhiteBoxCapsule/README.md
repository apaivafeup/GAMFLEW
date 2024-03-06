# White Box Testing Serious Game Prototype: Installation Guide

## Prerequisites
- You need to have Docker installed. If you don't have it installed, you can download it from [here](https://www.docker.com/products/docker-desktop).
  - Docker Desktop has everything needed. Be sure it's running before moving on.


## Installation
1. Get unzip the project files, you should have two folders: `backend` and `frontend`. Other than that, you need to have a `docker-compose.yaml` file.
2. Open a terminal and, if not there already, navigate to the folder where the `docker-compose.yaml` file is located.
3. Run the following command to start the application:
   ```bash
   docker-compose up
   ```
4. The application should be running now. You can access it by opening a web browser and going to `http://localhost:5473`.
    - You can also access it via the docker desktop GUI, by accessing the frontend port.

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
You can register your own user if you so wish. You cannot register a user with an already existing username.
