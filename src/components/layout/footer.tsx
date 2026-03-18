import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-8 border-t border-t-white/10 py-8 text-center text-sm text-gray-500">
      <p className="mb-2">
        Concept & Development by <span className="font-semibold text-gray-300">Don Saunderson</span>.
      </p>
      <p className="mb-4 italic text-primary">
        "Built by a photographer, for photographers."
      </p>
      <p className="text-xs text-gray-600">
        &copy; {new Date().getFullYear()} Don Saunderson. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
