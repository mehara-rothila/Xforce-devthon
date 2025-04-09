# ✨ XForce Devthon Learning Platform - Frontend ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-cyan?logo=tailwind-css)](https://tailwindcss.com/)

<div align="center">

**A modern, interactive educational platform built for Sri Lankan A/Level students offering gamified learning experiences, personalized progress tracking, and collaborative knowledge sharing.**

[Key Features](#-key-features) • 
[Tech Stack](#-tech-stack) • 
[Project Structure](#-project-structure) • 
[Getting Started](#-getting-started) • 
[Configuration Guide](#-configuration-guide) • 
[API Integration](#-api-integration) • 
[Deployment](#-deployment)

</div>

## 🌟 Introduction

The XForce Devthon Learning Platform provides a comprehensive educational experience, combining structured learning materials, interactive quizzes, community discussions, and gamified progress tracking. This repository contains the frontend implementation built with Next.js, React, and TypeScript, designed to deliver a responsive, accessible, and engaging user interface.

## 🚀 Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🔐 User Authentication</h3>
      <ul>
        <li>Secure JWT-based authentication flow</li>
        <li>Registration with subject preferences</li>
        <li>Password reset via email OTP</li>
        <li>Persistent login with token refresh</li>
        <li>Protected routes with role-based access</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📊 Student Dashboard</h3>
      <ul>
        <li>Personalized progress metrics and visualizations</li>
        <li>Achievement showcase with unlocking animation</li>
        <li>Activity feed of recent learning actions</li>
        <li>Study streak calendar with gamified rewards</li>
        <li>AI-powered learning recommendations</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📚 Subject Exploration</h3>
      <ul>
        <li>Visual subject cards with progress indicators</li>
        <li>Hierarchical topic organization within subjects</li>
        <li>Detailed subject view with associated resources</li>
        <li>Pagination with filter options</li>
        <li>Responsive grid/list toggle view</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📄 Resource Library</h3>
      <ul>
        <li>Multi-category filter system (Past Papers, Notes, etc.)</li>
        <li>Subject and topic-specific filtering</li>
        <li>Advanced search with debounced input</li>
        <li>Multiple sort options (Downloads, Date, Name)</li>
        <li>Direct download with progress tracking</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🧠 Quiz Hub</h3>
      <ul>
        <li>Interactive quiz taking interface with timing</li>
        <li>Multi-difficulty filter (Easy, Medium, Hard)</li>
        <li>Subject-specific quiz selection</li>
        <li>Score tracking with detailed results</li>
        <li>Explanation view for each question</li>
      </ul>
    </td>
    <td width="50%">
      <h3>💬 Discussion Forum</h3>
      <ul>
        <li>Category-based discussion organization</li>
        <li>Topic creation with rich text editor</li>
        <li>Reply system with upvote/downvote</li>
        <li>"Best Answer" marking functionality</li>
        <li>Recent/hot topics view with statistics</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⚙️ Admin Panel</h3>
      <ul>
        <li>Comprehensive content management system</li>
        <li>Quiz creation with dynamic question builder</li>
        <li>Subject & topic hierarchical management</li>
        <li>Resource upload with metadata editing</li>
        <li>Forum moderation tools</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🎨 Theming & UI</h3>
      <ul>
        <li>Dark/Light mode toggle with system preference detection</li>
        <li>Responsive design for all screen sizes</li>
        <li>Smooth transitions and loading states</li>
        <li>Comprehensive error handling with feedback</li>
        <li>Accessibility-focused interactive elements</li>
      </ul>
    </td>
  </tr>
</table>

## 💻 Tech Stack

<table>
  <tr>
    <td width="33%"><strong>Core Technologies</strong></td>
    <td width="33%"><strong>UI & Styling</strong></td>
    <td width="33%"><strong>State & Data</strong></td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>Next.js 14.1 (App Router)</li>
        <li>React 18.2</li>
        <li>TypeScript 5.0+</li>
        <li>Node.js (18.x/20.x LTS)</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Tailwind CSS 3.4+</li>
        <li>Responsive design principles</li>
        <li>Custom icon components</li>
        <li>CSS animations & transitions</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>React Context API</li>
        <li>Axios with interceptors</li>
        <li>LocalStorage for preferences</li>
        <li>Form validation with custom hooks</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="33%"><strong>Development Tools</strong></td>
    <td width="33%"><strong>Performance Optimizations</strong></td>
    <td width="33%"><strong>Utility Libraries</strong></td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>ESLint</li>
        <li>Prettier</li>
        <li>Git Hooks</li>
        <li>VS Code configuration</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Next.js Image optimization</li>
        <li>Dynamic imports</li>
        <li>Debounced search inputs</li>
        <li>Virtualized lists for large data</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>date-fns</li>
        <li>React Icons</li>
        <li>clsx/tailwind-merge</li>
        <li>Chart.js for visualizations</li>
      </ul>
    </td>
  </tr>
</table>

## 📂 Project Structure

```
learning-platform/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Authentication pages (grouped route)
│   │   │   ├── login/        # Login page with form and social auth
│   │   │   └── register/     # Registration page with subject selection
│   │   │
│   │   ├── admin/            # Admin dashboard and management
│   │   │   ├── page.tsx      # Main admin dashboard
│   │   │   ├── QuizList.tsx  # Quiz management components
│   │   │   ├── QuizForm.tsx  # Quiz creation/editing forms
│   │   │   └── ...           # Other admin components
│   │   │
│   │   ├── context/          # React Context providers
│   │   │   ├── AuthContext.tsx  # Authentication state management
│   │   │   └── DarkModeContext.tsx # Theme preference management
│   │   │
│   │   ├── dashboard/        # User dashboard pages & components
│   │   │   ├── page.tsx       # Main dashboard view
│   │   │   ├── AchievementsTab.tsx  # Achievements display
│   │   │   ├── ProgressTab.tsx      # Learning progress tracking
│   │   │   └── RecommendationsSection.tsx  # AI recommendations
│   │   │
│   │   ├── forum/            # Forum pages
│   │   │   ├── page.tsx      # Forums overview
│   │   │   ├── category/[id]/page.tsx  # Category view
│   │   │   ├── topic/[id]/page.tsx     # Topic & replies view
│   │   │   └── new/page.tsx            # Create new topic
│   │   │
│   │   ├── profile/          # User profile page
│   │   │   └── page.tsx      # Profile and settings
│   │   │
│   │   ├── quiz/             # Quiz pages
│   │   │   ├── page.tsx      # Quiz selection page
│   │   │   └── take/page.tsx # Quiz taking interface
│   │   │
│   │   ├── resources/        # Resource library page
│   │   │   └── page.tsx      # Filterable resource view
│   │   │
│   │   ├── subjects/         # Subjects listing and detail pages
│   │   │   ├── page.tsx      # All subjects view
│   │   │   └── [subjectId]/page.tsx  # Subject detail page
│   │   │
│   │   ├── globals.css       # Global styles, Tailwind setup
│   │   └── layout.tsx        # Root layout with providers
│   │
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Base UI components (buttons, cards, etc.)
│   │   ├── forms/            # Form-specific components
│   │   ├── layout/           # Layout components (header, footer, etc.)
│   │   └── icons/            # Custom icon components
│   │
│   └── utils/                # Utility functions
│       ├── api.js            # Axios configuration with interceptors
│       ├── formatters.js     # Data formatting functions
│       └── helpers.js        # Generic helper functions
│
├── public/                   # Static assets
├── .env.local                # Local environment variables
├── package.json              # Project metadata and dependencies
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## ✅ Prerequisites

* **Node.js:** Version 18.x or 20.x (LTS).  Check with `node -v`.
* **Package Manager:** npm 8+ (`npm -v`) or Yarn 1.22+ (`yarn -v`).
* **Backend API:** Running instance of the [XForce Devthon Backend](https://github.com/mehara-rothila/Xforce-devthon-backend).
* **Web Browser:** Modern browser (Chrome, Firefox, Safari, Edge).
* **Code Editor:** VS Code recommended (with ESLint and Prettier extensions).

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mehara-rothila/Xforce-devthon.git
cd Xforce-devthon
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

### 3. Set Up Environment Variables

Create a file named `.env.local` in the project root with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Replace with your backend URL

# Authentication
NEXT_PUBLIC_JWT_EXPIRY=86400  # Token expiry in seconds (24 hours)

# Feature Flags
NEXT_PUBLIC_ENABLE_SOCIAL_AUTH=false  # Set to true when implementing social auth
```

### 4. Run the Development Server

Using npm:

```bash
npm run dev
```

Or using Yarn:

```bash
yarn dev
```

The application will be accessible at `http://localhost:3000`.

### 5. Build for Production

```bash
npm run build
# Then start the production server
npm start
```

## 🔧 Configuration Guide

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | None | Yes |
| `NEXT_PUBLIC_JWT_EXPIRY` | JWT token expiry in seconds | 86400 | No |
| `NEXT_PUBLIC_ENABLE_SOCIAL_AUTH` | Enable social authentication UI | false | No |

### Tailwind Configuration

The project uses Tailwind CSS with custom configuration for colors, dark mode, animations, and more. Key customizations can be found in `tailwind.config.ts`:

- Dark mode is enabled using the 'class' strategy
- Custom color palette aligned with the platform's design system
- Extended animation configurations for UI interactions
- Custom plugin configurations for advanced features

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates an optimized production build |
| `npm start` | Runs the production server (requires build first) |
| `npm run lint` | Runs ESLint to check for code issues |
| `npm run lint:fix` | Fixes auto-fixable ESLint issues |
| `npm run format` | Formats code with Prettier |
| `npm run type-check` | Runs TypeScript type checking |

## 🔌 API Integration

The frontend communicates with the backend API using Axios. The main API configuration is in `src/utils/api.js`, which sets up:

- Base URL configuration
- Request/response interceptors
- Authentication header management
- Error handling and response formatting

### Key API Endpoints

<table>
  <tr>
    <th>Category</th>
    <th>Endpoints</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>
      <code>/auth/login</code><br>
      <code>/auth/register</code><br>
      <code>/auth/forgot-password</code><br>
      <code>/auth/reset-password</code>
    </td>
    <td>User authentication flows including login, registration, and password reset</td>
  </tr>
  <tr>
    <td><strong>User & Dashboard</strong></td>
    <td>
      <code>/users/{userId}/dashboard-summary</code><br>
      <code>/users/{userId}/progress</code><br>
      <code>/users/{userId}/achievements</code><br>
      <code>/users/{userId}/activity</code>
    </td>
    <td>User-specific data for dashboard, progress tracking, achievements, and activity feed</td>
  </tr>
  <tr>
    <td><strong>Subjects & Learning</strong></td>
    <td>
      <code>/subjects</code><br>
      <code>/subjects/{id}</code><br>
      <code>/subjects/{id}/topics</code><br>
      <code>/subjects/{id}/progress</code>
    </td>
    <td>Subject listing, detailed information, topic structure, and user progress within subjects</td>
  </tr>
  <tr>
    <td><strong>Resources</strong></td>
    <td>
      <code>/resources</code><br>
      <code>/resources/{id}</code><br>
      <code>/resources/category-counts</code><br>
      <code>/resources/{id}/download</code>
    </td>
    <td>Resource listings with filters, detailed resource information, category statistics, and file downloads</td>
  </tr>
  <tr>
    <td><strong>Quizzes</strong></td>
    <td>
      <code>/quizzes</code><br>
      <code>/quizzes/{id}</code><br>
      <code>/quizzes/{id}/attempts</code><br>
      <code>/quizzes/subject/{subjectId}/practice</code>
    </td>
    <td>Quiz listings, detailed quiz information, submitting quiz attempts, and subject-specific practice quizzes</td>
  </tr>
  <tr>
    <td><strong>Forum</strong></td>
    <td>
      <code>/forum/categories</code><br>
      <code>/forum/categories/{id}/topics</code><br>
      <code>/forum/topics/{id}</code><br>
      <code>/forum/topics/{id}/replies</code>
    </td>
    <td>Forum categories, topics within categories, detailed topic views with replies, and reply actions</td>
  </tr>
  <tr>
    <td><strong>Rewards</strong></td>
    <td>
      <code>/rewards</code><br>
      <code>/rewards/{id}</code><br>
      <code>/rewards/{id}/redeem</code>
    </td>
    <td>Reward listings, detailed reward information, and redemption functionality</td>
  </tr>
  <tr>
    <td><strong>Admin</strong></td>
    <td>
      <code>/uploads/resource</code><br>
      <code>Various CRUD endpoints</code>
    </td>
    <td>Resource uploads and administrative CRUD operations for managing platform content</td>
  </tr>
</table>

## 🌐 Deployment

### Production Deployment

The application can be deployed to various platforms:

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy
```

### Environment Considerations

1. **API URL**: Ensure the `NEXT_PUBLIC_API_URL` is updated to point to your production backend
2. **CORS Settings**: Verify your backend allows requests from your frontend domain
3. **Build Optimization**: Use the production build with `npm run build` for optimal performance

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check that your backend server is running
   - Verify the `NEXT_PUBLIC_API_URL` value in `.env.local`
   - Ensure CORS is configured properly on the backend

2. **Authentication Issues**
   - Clear local storage and try logging in again
   - Check that JWT token is being stored correctly
   - Verify token expiration settings

3. **Build/Compilation Errors**
   - Run `npm run lint` to check for code issues
   - Ensure all dependencies are installed correctly
   - Check for TypeScript type errors with `npm run type-check`

## 📱 Browser Compatibility

The application is tested and optimized for:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Android Chrome)

## 🤝 Contributing

We welcome contributions to improve the XForce Devthon Frontend! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Projects

- [XForce Devthon Backend](https://github.com/mehara-rothila/Xforce-devthon-backend) - The Node.js/Express backend API for this platform

---

