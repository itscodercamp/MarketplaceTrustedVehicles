import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="140"
      height="40"
      {...props}
    >
      <rect width="200" height="50" fill="transparent" />
      <path
        d="M25 10 L15 25 L25 40 L35 25 Z"
        fill="hsl(var(--primary))"
      />
      <circle cx="25" cy="25" r="5" fill="hsl(var(--background))" />
      <text
        x="50"
        y="32"
        fontFamily="Roboto, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Trusted Vehicles
      </text>
    </svg>
  );
}
