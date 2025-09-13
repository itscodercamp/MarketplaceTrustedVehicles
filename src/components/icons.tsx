import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="40"
      height="40"
      {...props}
    >
      <rect width="50" height="50" rx="10" fill="hsl(var(--primary))" />
       <path
        d="M25 10 L15 25 L25 40 L35 25 Z"
        fill="hsl(var(--background))"
      />
      <circle cx="25" cy="25" r="5" fill="hsl(var(--primary))" />
    </svg>
  );
}
