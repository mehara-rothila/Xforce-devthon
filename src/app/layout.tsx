import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gamified Learning for Sri Lankan A/L Students',
  description: 'A platform for Sri Lankan Advanced Level students with gamified learning experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-purple-800">
                DEV<span>{"{thon}"}</span>
                <span className="text-sm align-top">2.0</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/subjects" className="text-gray-600 hover:text-purple-800">
                Subjects
              </Link>
              <Link href="/quiz" className="text-gray-600 hover:text-purple-800">
                Quizzes
              </Link>
              <Link href="/forum" className="text-gray-600 hover:text-purple-800">
                Forum
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-purple-800">
                Resources
              </Link>
              <Link href="/login" className="text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-md">
                Login
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}