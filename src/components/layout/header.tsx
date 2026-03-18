import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:gap-6 md:text-left">
      <Image
        src="/UCMlogo.png"
        alt="Universal Critique Master Logo"
        width={140}
        height={67}
        priority
      />
      <div>
        <h1 className="text-4xl font-bold text-white">
          Universal Critique Master
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Professional, objective analysis for any photographic genre.
        </p>
      </div>
    </header>
  );
};

export default Header;
