# Event Hub

A full-stack Next.js application for creating, managing, and booking events. This platform allows users to create events, manage their events through a dashboard, and book tickets for events they want to attend.

## Live Links
- **Live Website Link:** [Vercel Live Site](https://event-hub-six-psi.vercel.app/)

## Admin Credentials
- Mail: admin@admin.com
- Pass: Admin@123

## Tech Stack

- **Frontend**:
  - Next.js 15.5 (App Router)
  - React 19.1
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - Shadcn UI (component library)
  - Next Themes (light/dark mode)
  - Sonner (toast notifications)

- **Backend**:
  - Next.js API Routes
  - MongoDB (native driver)
  - JWT Authentication
  - bcryptjs (password hashing)

- **Data Fetching & State Management**:
  - Server-side rendering
  - Client-side data fetching
  - Recharts (for dashboard analytics)

## Features

### Authentication
- Secure JWT-based authentication
- Protected routes for authenticated users
- User registration and login
- Password hashing with bcryptjs
- Secure token storage via httpOnly cookies

### Public Pages
- Responsive landing page with multiple sections:
  - Hero section
  - Features showcase
  - Testimonials
  - FAQ section
  - Call to Action
- About page
- Contact page
- SEO-friendly metadata

### Dashboard (Protected)
- Event management (CRUD operations)
- Analytics and statistics
- User profile management
- Booking history
- Dynamic routing for event details

### Event Management
- Create new events
- Edit existing events
- Delete events
- View event details
- Filter and search events

### Booking System
- Book tickets for events
- View booking history
- Booking confirmation
- Manage bookings

### UI/UX Features
- Responsive design (mobile, tablet, desktop)
- Light/dark theme toggle
- Loading states and spinners
- Error handling
- Toast notifications
- Animations and transitions

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- MongoDB database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mottasimsadi/event-hub
   cd event-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=your_mongodb_collection_name

   JWT_SECRET=your_jwt_secret_key

   NEXT_PUBLIC_APP_URL= By default you can add this "http://localhost:3000" but after deploying in vercel, you need to update this to the deployed link that you will get after the deploy completes
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

The application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
event-hub/
├── public/             # Static assets
├── src/
│   ├── app/            # App router pages
│   │   ├── (auth)/     # Authentication routes
│   │   ├── (dashboard)/# Dashboard routes
│   │   ├── (public)/   # Public routes
│   │   ├── api/        # API routes
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and services
│   │   ├── auth/       # Authentication utilities
│   │   ├── db/         # Database utilities
├── .env.local          # Environment variables (create this)
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```
