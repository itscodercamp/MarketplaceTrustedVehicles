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

export function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.836,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );
}

export function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" {...props}>
      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5z" />
      <path fill="#fff" d="M26.572,29.036h-5.485v-12.01h5.485c0,0,0-2.273,0-4.025c0-3.534,2.858-5.003,5.176-5.003 c1.51,0,2.835,0.111,3.229,0.162v4.66h-2.92c-1.45,0-1.73,0.692-1.73,1.697v2.508h4.68l-0.61,4.63h-4.07V29.036z" />
    </svg>
  );
}
