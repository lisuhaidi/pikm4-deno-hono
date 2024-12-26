# Deno Backend API

A robust backend API service built with Deno, providing endpoints for managing messages, users, and comments. This API serves as a foundation for building scalable applications with user interaction and content management capabilities.

## Tech Stack

- **Runtime**: [Deno](https://deno.land/)
- **Web Framework**: [Hono](https://hono.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ODM**: Mongoose
- **Authentication**: JWT

## Prerequisites

- Deno 1.x or higher
- MongoDB instance (local or cloud)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Copy the environment template and configure your variables:
```bash
cp .env.example .env
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/your_database
PORT=3000
```

## Development Setup

1. Install dependencies:
```bash
deno cache --lock=deno.lock --lock-write deps.ts
```

2. Start the development server:
```bash
deno task dev
```

The API will be available at `http://localhost:3000`

## Available API Routes

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create a new message
- `GET /api/messages/:id` - Get a specific message
- `PUT /api/messages/:id` - Update a message
- `DELETE /api/messages/:id` - Delete a message

### Comments
- `GET /api/comments` - Get all comments
- `POST /api/comments` - Create a new comment
- `GET /api/comments/:id` - Get a specific comment
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

## Development Commands

```bash
# Start development server with watch mode
deno task dev

# Run tests
deno task test

# Format code
deno task fmt

# Lint code
deno task lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

