# Quiz App

This project is an implementation of an online quiz web app, which can host as many players as needed.

## Technologies Used

- Frontend: React, TypeScript, Redux
- Backend: NodeJS, TypeScript, ExpressJS, Redis

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```
   bash
   git clone https://github.com/dleclercpro/LiquorsOfTheWorld.git
   ```

2. Install dependencies:

  ```
  sh /Scripts/install.sh
  ```

3. Run the server:

  ```
  cd /Apps/Server
  npm start
  ```

4. Run the client:

  ```
  cd /Apps/Client
  npm start
  ```

5. Open your browser and navigate to: `http://localhost:4000` to use the application.

## Building Docker Images

To build the project's Docker images, run the following command:

  ```
  sh /Scripts/build.sh
  ```

This script will build the Docker images based on the Dockerfiles provided in the repository.

## Contributing
Contributions are welcome! If you find any issues or want to improve the application, feel free to submit a pull request.

## Contact
For any inquiries or feedback, please contact d.leclerc.pro@gmail.com.
