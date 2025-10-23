Nike Ecommerce Backend 🏀👟

A scalable and secure backend API for Nike ecommerce built with Node.js, Express, Prisma ORM, and PostgreSQL. Supports user authentication with JWT, product and category management, and sets a foundation for cart and payment integration.
✨ Features

    🔐 User registration and login with hashed passwords and JWT authentication

    🛍️ CRUD operations for products and categories using Prisma ORM

    🛡️ Secure API routes with authentication middleware

    🐘 PostgreSQL database with type-safe Prisma Client

    ⚙️ Environment-based configuration using dotenv

    🗂️ Structured code with controllers, routes, and middleware

🛠️ Tech Stack

    Node.js with Express.js for REST API server

    Prisma ORM for database modeling and migrations

    PostgreSQL as the relational database

    JWT for authentication tokens

    bcryptjs for password hashing

    dotenv for environment variable management

🚀 Getting Started
📋 Prerequisites

    Node.js v18+ (LTS recommended)

    PostgreSQL installed and running locally or accessible remotely

    npm or yarn package manager

📥 Installation

    Clone the repository:

bash
git clone https://github.com/yourusername/nike-backend.git
cd nike-backend

    Install dependencies:

bash
npm install

    Set up environment variables:
    Create a .env file in the project root with:

text
DATABASE_URL="postgresql://nike_user:your_password@localhost:5432/nike_ecommerce_db?schema=public"

JWT_SECRET="your_very_secure_secret_key"
PORT=5000

    Run Prisma migrations to set up the database schema:

bash
npx prisma migrate dev --name init

    Generate Prisma client:

bash
npx prisma generate

    Start the development server:

bash
npm run dev

Server running on 👉 http://localhost:5000
📡 API Endpoints
🔑 Authentication

    POST /api/auth/register
    Register a new user.
    Request JSON:

json
{ "name": "John", "email": "john@example.com", "password": "password123" }

    POST /api/auth/login
    Login and receive a JWT token.
    Request JSON:

json
{ "email": "john@example.com", "password": "password123" }

🔒 Protected Routes (Require JWT in Authorization header)

    User profile, products, categories, cart, and order routes to be implemented.

🗂️ Project Structure

text
/src
  /controllers     # Request handlers and business logic
  /routes          # API route definitions
  /middlewares     # Auth and error handling middleware
  /services        # Prisma client interactions and services
  prismaClient.js  # Prisma client instance
index.js           # Server entry point
prisma/            # Prisma schema and migration files
.env               # Environment variables

🤝 Contributing

Contributions welcome! Please open issues or pull requests for suggestions and improvements.
📜 License

This project is licensed under the MIT License.
🙏 Acknowledgments

    Prisma for the modern ORM

    Express.js for fast and minimalist server framework

    PostgreSQL for powerful relational database

    Node.js ecosystem for extensive libraries
