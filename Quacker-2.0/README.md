# Quacker: A Social Media Application

Welcome to Quacker, a lightweight social media application for sharing quick and fun messages, referred to as "quacks". This platform allows users to post content, engage with others through likes, and see the most popular posts within the community. Below is an explanation of the components of this application and how they work together to create a dynamic user experience.

## Overview

The Quacker application is structured as a full-stack web application with a front-end built in HTML, CSS, and JavaScript, and a back-end powered by Node.js and MongoDB. The application features real-time posting and updates of messages, which we refer to as "quacks".

### `index.html`

This is the main entry point of our application. It structures the web page and includes references to the CSS for styling and JavaScript for functionality. It has sections for displaying the top quacks, a submission form for new quacks, and a dynamically generated list of all quacks.

### `index.css`

The styling rules for the application's front end. It ensures that the Quacker interface is visually appealing and user-friendly.

### `index.js`

A JavaScript module that controls the interactive features of the application. It handles fetching the existing quacks, posting new quacks, and updating the UI accordingly.

### `server.js`

This is the Node.js server that uses Express.js to handle HTTP requests. It serves the static files, handles the creation of new quacks, and retrieves lists of quacks from the MongoDB database.

### `db.js`

Includes the database operations necessary for the application to interact with MongoDB. It handles the creation, retrieval, updating, and deletion of quack posts in the database.

### `QuackApi` Class

This JavaScript class contains methods for fetching and rendering the quacks from the back-end, as well as submitting new quacks to the server.

## Features

- **Real-time Posting**: Users can post new quacks using the form provided in the `index.html` file. These posts are immediately persisted to the MongoDB database and displayed to all users.
- **Top Quacks**: The application features a section that displays the most popular quacks, determined by the number of likes.
- **Live Updates**: New quacks and likes are fetched and updated in real-time, providing a dynamic and engaging user experience.

## Installation

To set up Quacker locally, you'll need to:

1. Clone the repository to your local machine.
2. Ensure Node.js and MongoDB are installed on your system.
3. Install the necessary Node.js packages using `npm install`.
4. Start the server with `npm start` or `node server.js`.

## Usage

Once the application is running, navigate to `localhost:3000` in your web browser to view and interact with the Quacker platform. 

## Contribution

Contributions to Quacker are welcome! Please feel free to fork the repository, make improvements, and submit pull requests.

## License

Quacker is open-source software licensed under the MIT license.

---

This README provides a general overview and should be expanded with more specific installation instructions, examples of usage, and contribution guidelines as the application evolves.
