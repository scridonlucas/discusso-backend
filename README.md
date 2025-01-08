# Discusso

Backend server for an social media application built using Express, Typescript and PostgreSQL

## Features

- **User Registration**: Allow users to create new accounts and store their information in a PostgreSQL database. Passwords are encrypted using bcrypt.
- **User Authentification**: Allow users to log into their account. We use JWT, a widely-accepted standard for secure authentication, to protect user accounts.
- **Authentification**: The authentication system is entirely custom-built by me, without using any external libraries.
- **Role-Based Access Control (RBAC)**: A custom-built RBAC system allows different user roles—such as regular users, admins, moderators, and premium users—to have specific permissions for actions within the app. Ownership checks are integrated into the RBAC system, ensuring that users can only perform certain actions (like updating or deleting) on resources they own, unless they have higher-level permissions (e.g., admin rights to perform actions on any resource).
- **Custom Error Middleware**: Custom error middleware is used to handle errors and send appropriate responses to the client, handling different types of errors and providing meaningful error messages.
- **Discussions**: Allow users to start discussions. Each discussion is tied to a specific community, making it easy to explore and contribute to topics that align with users' interests. Users can interact with discussions by liking, commenting, and bookmarking them.
- **Comments, likes, and bookmarks**: Comments, likes and bookmarks are all independent resources linked to discussions. These relationships allow a discussion to have multiple comments, likes, and bookmarks, enabling detailed tracking and management of user interactions.
- **Trending Discussions**: A trending score is computed regularly, taking into account the number of interactions and how recently the discussion was created using a custom algorithm. This ensures that fresh and popular discussions receive the visibility they deserve. Every hour, the app calculates trending scores using a script/cron job that runs hourly in the background and updates the database. The results are used in Trending page from the frontend (top 15 discussions with the highest trending score are fetched).
- **Admin**: Admin permissions are designed to grant access to critical platform operations, such as managing users, moderating content, and overseeing system activities. These permissions are strictly enforced, ensuring only authorized admins can perform sensitive actions while maintaining platform security and control.
- **Favorite Stocks with Real-Time Data**: The app stores users' favorite stocks in a database table, with each entry linked to a specific user and stock ticker. This table acts as a reference for fetching real-time market data from the Alpha Vantage API (https://www.alphavantage.co). When users request their favorite stocks, the app retrieves the stored tickers, fetches live data for each one, and returns details like current price, volume, and changes. This ensures users get personalized, up-to-date stock information tailored to their preferences.

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
