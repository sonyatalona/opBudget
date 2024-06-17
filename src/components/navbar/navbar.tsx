import React from 'react';

export const NavBar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">Budgetr</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
      </ul>
    </nav>
  );
};
