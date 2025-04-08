# ✨ XForce Devthon Learning Platform - Frontend ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-cyan?logo=tailwind-css)](https://tailwindcss.com/)

Welcome to the frontend repository for the XForce Devthon Learning Platform! This application provides a rich user interface for students and administrators, built with modern web technologies. It allows users to engage with learning materials, test their knowledge with quizzes, participate in discussions, and track their progress.

## 🚀 Key Features

* **🔐 User Authentication:** Secure Login, Registration, Forgot/Reset Password flows using JWT and React Context (`AuthContext`).
* **📊 Student Dashboard:** Personalized overview with progress tracking, achievements, activity feed, study streak calendar, and AI recommendations. Includes dedicated Progress and Achievements tabs.
* **📚 Subject Exploration:** Browse available subjects with pagination and links to detailed subject pages.
* **📄 Resource Library:** Access Past Papers, Model Papers, Notes, Videos. Filter by Category/Subject, Search, Sort (Downloads, Date, A-Z), and Download resources.
* **🧠 Quiz Hub:** Browse available practice quizzes. Filter quizzes by Subject and Difficulty. Sort quizzes (Popularity, Newest, Rating, Difficulty). Links to start taking a specific quiz.
* **💬 Discussion Forum:** Engage in category-based discussions, view recent topics, and create new posts. Includes sidebar with stats and guidelines.
* **⚙️ Admin Panel:** Centralized management interface accessible only to 'admin' role users.
    * **Quiz Management:** List, Create, Edit, Delete quizzes.
    * **Subject Management:** List, Create, Edit, Deactivate subjects.
    * **Resource Management:** List, Create, Edit, Delete resources.
    * **Forum Category Management:** List, Create, Edit, Delete categories.
    * **Forum Topic Management:** View topics within a category, Delete topics.
* **🎨 Theming & UI:**
    * Toggleable Dark/Light Mode with preference persisted in `localStorage`.
    * Modern UI built with Tailwind CSS, featuring animations and responsive design.
    * Loading states and error handling across data-fetching components.

## 💻 Tech Stack

* **Framework:** Next.js 14.1 (App Router)
* **Language:** TypeScript 5.0+
* **UI Library:** React 18.2
* **Styling:** Tailwind CSS 3.4+ (`darkMode: 'class'`)
* **State Management:** React Context API (`AuthContext`, `DarkModeContext`)
* **API Communication:** Axios with Interceptors
* **Utility Libraries:** date-fns
* **Linting:** ESLint

## 📂 Project Structure

learning-platform/├── src/│   ├── app/          # Next.js App Router│   │   ├── (auth)/   # Authentication pages│   │   ├── admin/    # Admin dashboard and management components/forms/lists│   │   ├── context/  # React Context providers (Auth, DarkMode)│   │   ├── dashboard/# User dashboard pages & components│   │   ├── forum/      # Forum pages│   │   ├── profile/    # User profile page│   │   ├── quiz/       # Quiz pages│   │   ├── resources/  # Resource/Quiz library page│   │   └── subjects/   # Subjects listing and detail pages│   │   ├── globals.css # Global styles, Tailwind setup, animations, theme vars│   │   └── layout.tsx  # Root layout (wraps with Providers, includes Header)│   └── components/   # Reusable UI components│   │   └── icons/      # Icon components│   └── utils/        # Utility functions (api.js - Axios wrapper)├── public/           # Static assets├── .env.local        # Local environment variables├── package.json      # Project metadata and dependencies├── tailwind.config.ts# Tailwind CSS configuration└── tsconfig.json     # TypeScript configuration└── README.md           # This file
## ✅ Prerequisites

* **Node.js:** Version 18.x or 20.x (LTS).  Check with `node -v`.
* **Package Manager:** npm (`npm -v`) or Yarn (`yarn -v`).
* **Running Backend:** Requires a running Learning Platform Backend.

## 🚀 Getting Started

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/mehara-rothila/Xforce-devthon.git](https://github.com/mehara-rothila/Xforce-devthon.git)
    cd Xforce-devthon
    ```

2.  **Install Dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Or using Yarn:

    ```bash
    yarn install
    ```

3.  **Set Up Environment Variables:**

    * Create a file named `.env.local` in the project root.
    * Add the backend API URL:

        ```env
        # .env.local
        NEXT_PUBLIC_API_URL=[http://your-backend-api.com/api](https://www.google.com/search?q=http://your-backend-api.com/api)  # Replace with your backend URL
        ```

4.  **Run the Application:**

    Using npm:

    ```bash
    npm run dev
    ```

    Or using Yarn:

    ```bash
    yarn dev
    ```

    The application will be accessible at `http://localhost:3000`.

## 📜 Available Scripts

* `dev`: Starts the development server.
* `build`: Creates a production build.
* `start`: Starts the production server.
* `lint`: Runs ESLint.

## 🔌 API Backend Dependency

The frontend relies on a backend API for data and functionality.  Ensure the backend is running at the URL specified in `.env.local`.  Key API endpoints:

* Authentication:  `/auth/login`, `/auth/register`, etc.
* Users:  `/users/{userId}/dashboard-summary`, `/users/{userId}/activity`, etc.
* Subjects: `/subjects`, `/subjects/{id}`, `/subjects/{id}/topics`
* Resources: `/resources`, `/resources/{id}`, `/resources/category-counts`, `/resources/{id}/download`
* Quizzes: `/quizzes`, `/quizzes/{id}`, `/quizzes/subject/{subjectId}/practice`, `/quizzes/{id}/attempts`, `/quizzes/user/{userId}/attempts`
* Forum: `/forum/categories`, `/forum/categories/{categoryId}/topics`, `/forum/topics/{topicId}`, `/forum/topics/{topicId}/replies`, `/forum/replies/{replyId}/vote`, `/forum/replies/{replyId}/best`
* Rewards: `/rewards`, `/rewards/{id}`, `/rewards/{id}/redeem`, `/users/{userId}/rewards`
* Uploads: `/uploads/resource`

## 📂 Project Structure

Xforce-devthon/├── src/│   ├── app/          # Next.js App Router (Pages, Layouts, Route Groups)│   │   ├── (auth)/   # Authentication pages│   │   ├── admin/    # Admin dashboard and management components│   │   ├── context/  # React Context (Auth, DarkMode)│   │   ├── dashboard/# User dashboard│   │   ├── forum/    # Forum pages│   │   ├── profile/  # User profile│   │   ├── quiz/       # Quiz pages│   │   ├── resources/  # Resource/Quiz library│   │   └── subjects/  # Subjects pages│   │   ├── globals.css # Global styles│   │   └── layout.tsx  # Root layout│   └── components/   # Reusable React components│   │   └── icons/      # Custom icons│   └── utils/        # API utility (Axios instance)├── public/           # Static assets├── .env.local        # Environment variables├── package.json      # Project dependencies├── tailwind.config.ts# Tailwind config└── tsconfig.json     # TypeScript config

