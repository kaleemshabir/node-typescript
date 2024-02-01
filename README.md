# Project README

## Overview

This project is a RESTful API built with Express and TypeScript, providing user authentication and task management features. It utilizes a MongoDB database to store user and task data.

## Project Structure

project-root/
├── config/
│   └── database.ts       // Database connection configuration
├── models/
│   ├── task.model.ts     // Task model
│   └── user.model.ts     // User model
├── routes/
│   ├── auth.route.ts     // Authentication routes
│   └── task-routes.ts    // Task management routes
├── middleware/
│   ├── async.ts         // Middleware for handling asynchronous operations
│   └── auth.ts          // Authentication middleware
├── interfaces/
│   └── req.interface.ts  // Request interface
├── seeder.ts             // Seeding script for initial data
├── index.ts              // Main application entry point
├── package.json          // Project dependencies
└── README.md             // This file


## Running the Application

1. Install dependencies:
   ```bash
   npm install

2. Create a .env file in the project root and set the following environment variable:
MONGODB_URI=your_mongodb_connection_string

3. Start the application:
 npm run dev
 The server will start running on port 5001 by default.

## Coding Styles

TypeScript is used for type safety and improved code maintainability.
Consistent indentation (2 spaces) and semicolons are used.
Descriptive variable and function names are preferred.

## Database Used
MongoDB is used for data storage
## API Endpoints

 ### Authentication

 POST /auth/register/:token : Register a new user using an invite token.
 POST /auth/login : Login a user and obtain a JWT.
 GET /auth/invite : Generate an invite token for user registration (protected endpoint).

 ### Tasks
 GET /tasks/user-tasks : Get the tasks created by the logged-in user.
 POST /tasks/user-tasks : Create a new task for the logged-in user.
 GET /tasks/list-tasks : Get all tasks (requires admin authorization).
 
## Additional Notes
 The asyncHandler middleware is used to manage asynchronous operations within routes.
 The paginate plugin is used to handle query pagination.
 The seeder.ts file can be used to create an initial admin user and tasks.

Please let me know if you have any other questions. 
