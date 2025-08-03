"use client"; // Required for hooks like useState, useEffect, useContext

import React from 'react'; // Remove useState, useEffect
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/themecontext'; // Import the useTheme hook
// import { Button } from '@/components/ui/button'; // Assuming Button from shadcn/ui
import { Sun, Moon } from 'lucide-react'; // Import icons

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' }, // Placeholder path
  { href: 'https://github.com/ecorkran/lab-threejs-surface', label: 'GitHub' },
];

const NavBar: React.FC = () => {
  // Get theme state and setter from context
  const { theme, setTheme } = useTheme();

  // Function to toggle between light and dark
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6" aria-label="Main Navigation">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={cn(
            'text-sm font-medium transition-colors hover:text-blue-600',
            'focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-full px-3 py-1.5' // Rounded pill style
          )}
        >
          {item.label}
        </Link>
      ))}
      {/* Theme Toggle Icon Button */}
      <button
        onClick={toggleTheme}
        className={cn( // Basic styling, consider using shadcn Button variant='ghost' size='icon'
          'ml-auto p-2 rounded-full',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring' // Keep ring, remove offset
        )}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {/* Direct rendering should now be safe */}
        {theme === 'light' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span> {/* Accessibility */}
      </button>
    </nav>
  );
};

export default NavBar;
