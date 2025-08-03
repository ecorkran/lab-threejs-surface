import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from './navbar';
import Container from './container';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-100 dark:bg-gray-800 p-4 pl-1 pr-1 shadow-md">
      <Container className="flex justify-between items-center">
        {/* Left side - Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/assets/logo/logo-surface.png"
            alt="Cosine Terrain Logo"
            width={80}
            height={24}
            className="rounded dark:border-1 dark:border-green-900"
          />
          <span className="hidden sm:inline text-md font-bold pl-3 leading-tight">Cosine Terrain</span>
        </Link>
        
        {/* Right side - Navigation */}
        <NavBar />
      </Container>
    </header>
  );
};

export default Header;
