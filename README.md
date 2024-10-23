# Discusso

Backend server for an social media application built using Express, Typescript and PostgreSQL

## Features

- **User Registration**: Allow users to create new accounts and store their information in a PostgreSQL database.
- **User Authentification**: Allow users to log into their account. We use JWT, a widely-accepted standard for secure authentication, to protect user accounts.
- **Authentification**: The authentication system is entirely custom-built by me, without using any external libraries.
- **Role-Based Access Control (RBAC)**: A custom-built RBAC system allows different user roles—such as regular users, admins, moderators, and premium users—to have specific permissions for actions within the app. Ownership checks are integrated into the RBAC system, ensuring that users can only perform certain actions (like updating or deleting) on resources they own, unless they have higher-level permissions (e.g., admin rights to perform actions on any resource).
- **Discussions**: Allow users to start discussions.

## Knowledge

- Setting up an Express project with Typescript.
- Build an complete auth system from scratch.
- Proofing requests coming from external sources by ensuring they the correct type.
- Validating the fields before posting the requests.
- Setting up a PostgreSQL database and connecting it to Express apllication.
- Creating Prisma models and setting up validations and constraints for them.
- Creating complex relationships between tables using PostgreSQL.
- Using bcrypt library to hash passwords before storing them in a database.
- Learning how to use JSON Web tokens for token-based authentification.
- Using HTTP-only cookies to securely send the token.

## Technologies

- Express
- Typescript
- PostgreSQL
- Prisma ORM

## Tools

- Visual Studio Code
- webpack
- Git and Github
- npm

## Authors

- [@scridonlucas](https://www.github.com/scridonlucas)
