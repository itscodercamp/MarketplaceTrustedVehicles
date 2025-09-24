'use client';

import { Logo } from '@/components/icons';

export default function PreLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center text-center gap-4">
        <p className="text-lg text-muted-foreground">Welcome to</p>
        <h1 className="text-3xl font-bold text-primary tracking-wider">
          Trusted Vehicle Marketplace
        </h1>
        <img
          src="https://media.giphy.com/media/WdzPgUxAazT2WNHA2r/giphy.gif"
          alt="Loading animation"
          width={200}
          height={200}
          className="my-4"
        />
        <p className="text-md text-muted-foreground italic">
          Boosting your experience with turbo...
        </p>
      </div>
    </div>
  );
}
