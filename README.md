# Word2Vec - Class Room Game

🎉 This repository contains a basic implementation for an interactive classroom-game using Googles Word2Vec implementation. 🎮

---

This project aims to create a dynamic and engaging learning experience for participants by challenging their word vector manipulation skills. Contestants compete in rounds where they're given a target word and a set of forbidden words. The goal is to construct formulas using words (represented as vectors) and mathematical operations, aiming to get as close to the target word as possible without using any of the banned words. The contestant with the formula closest to the target word emerges victorious in each round.

---

### Features

- Hosts (teachers, presenter) can register and create quizzes with multiple rounds, each featuring a unique target word and specific constraints on word usage
- Participants (students, attendees) can register for quizzes via a QR-code, join games, and submit their formulas during each round under a time limit
- Hosts have the ability to start quizzes, broadcast rounds, and receive live answers from players in real-time
- The server allows blazing fast verification of words to always make sure the used words exist in the vector database

### Technology Stack

- Responsive and intuitive user interface crafted using Angular implemented in TypeScript while always trying to use best practices
- Encrypted password submission and Bearer token rotation using JWT for each request to increase security
- Real time communication between Players and Hosts with Websockets and RESTful APIs
- Docker for containerization for local development and stable deployment to Dokku

---

### Prerequisites

Before getting started, make sure you have the following prerequisites:

- [Node.js](https://nodejs.org/en)
- [Angular](https://angular.io/)
- [Docker](https://www.docker.com/)

You can install Anular globally by running the following command in your shell:

```shell
npm install -g @angular/cli
```

### Installation

Follow these steps to set up the project:

1. Install prequisites
2. Clone this repository to your local machine:

   ```shell
   git clone https://gitlab.uzh.ch/ltwa-hs23/sandrinraphael.hunkeler/webappcl-client.git
   ```

3. Change into the cloned repository directory:

   ```shell
   cd webappcl-client
   ```

4. Install project dependencies:

   ```shell
   npm install
   ```

5. Build & start the web server:

   ```shell
   run start
   ```

6. Open your favorite browser and have fun! 🎉
   ```shell
   http://localhost:4200/
   ```

### Simulate remote deployment on Dokku
1. Make sure Docker Desktop is running
2. Open Powershell in repository directory
3. Build the docker image
```shell
  docker build -t webappcl-client:latest .
  ```

4. Deploy the docker image
   
```shell
   docker run -it -p 5000:5000 webappcl-client:latest 
```
5. Open browser to check the deployment
  ```shell
http://localhost:5000/
   ```

### Impressions from POV of Host

#### Registering
<img src="images/hostViewLogin.png"/>

#### home-screen
<img src="images/hostViewHome.png"/>

#### Quiz overview
<img src="images/hostViewSelectQuizzes.png"/>

#### host view while creating a quiz
<img src="images/hostViewCreateGame.png"/>

#### Lobby
<img src="images/hostViewLobby.png"/>

#### host view during game play
<img src="images/hostViewGamePlay.png"/>

#### Pedestal
<img src="images/HostViewPedestal.png"/>

### Impressions from POV of Player

#### login screen
<img src="images/registerPlayer.png"/>

#### game play
<img src="images/gamePlayPlayer3.png"/>
