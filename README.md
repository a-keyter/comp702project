# Bi-Directional Feedback for Assessments

## Project Description

This project implements an online assessment platform with bi-directional feedback using Large Language Models (LLMs). 

It aims to provide personalized feedback to students on their performance and insights to teachers based on aggregate student performance.

## Features

- User authentication for teachers and students
- Creation and management of classes and assessments
- Multiple-choice question (MCQ) assessment creation and editing
- Automatic grading of assessments
- LLM-generated feedback for students and teachers
- Performance analytics and insights

## Technologies Used

- Next.js 14.2.5 (with App Router)
- React 18
- TypeScript
- Tailwind CSS
- Prisma (with PostgreSQL)
- Clerk for authentication
- LangChain for LLM integration
- Attempted use of Jest
- Successful use of Cypress for testing

## Prerequisites

- Node.js (v18.16.0 or later)
- PostgreSQL database
- Clerk API keys
- OpenAI API key (for LLM integration)

## Installation

1. Clone the repository (or unpack the .zip if downloaded):

   ```
   git clone https://github.com/a-keyter/comp702project.git
   cd comp702project
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Rename the `.env.example` file to `.env` and update the following variables:

   ```
   DATABASE_URL="your-postgresql-connection-string"
   OPENAI_API_KEY="your-openai-api-key"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   ```

4. Set up the database:

   ```
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```
   npm run dev
   ```

## Setting up API keys and Databases

### PostgreSQL database

- Create a new database.
- The original project was created using Vercel Postgres, but any other PostgreSQL database should do.
- See also [Supabase](https://supabase.com/) or [Neon](https://neon.tech/), for an altenrative, free and easy to use database provider.
- Alternatively, use Docker to run a PostgreSQL database locally.
- Get your connection string and update the `.env` file with the correct connection string.

### Clerk API keys

- Create a new application at https://clerk.com/ and update the `.env` file with the correct publishable and secret keys.

### OpenAI API key

- Create a new application at https://platform.openai.com/ and update the `.env` file with the correct API key.

## Running Tests

- To run Cypress tests:
  ```
  npm run cypress:open
  ```

## Building for Production

To build the project for production:

```
npm run build
```

To start the production server:

```
npm start
```

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: React components
- `/lib`: Utility functions and shared logic
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/styles`: Global styles and Tailwind CSS configuration
- `/tests`: Jest test files (empty, unable to configure with typescript)
- `/cypress`: Cypress test files

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- This project was developed as part of an MSc thesis at University of Liverpool.
- Special thanks to Dr. Olga Anosova for supervision and guidance.
