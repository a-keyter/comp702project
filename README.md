# Bi-Directional Feedback for Assessments

## Project Description
This project implements an online assessment platform with bi-directional feedback using Large Language Models (LLMs). It aims to provide personalized feedback to students on their performance and insights to teachers based on aggregate student performance.

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
- Jest and Cypress for testing

## Prerequisites
- Node.js (v14 or later)
- PostgreSQL database
- OpenAI API key (for LLM integration)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/a-keyter/comp702project.git
   cd comp702project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
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

## Running Tests
- To run Jest tests:
  ```
  npm test
  ```

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
- `/tests`: Jest and Cypress test files


## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments
- This project was developed as part of an MSc thesis at [Your University Name].
- Special thanks to Olga Anosova for supervision and guidance.