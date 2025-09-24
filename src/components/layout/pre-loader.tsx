'use client';
import Image from 'next/image';

export default function PreLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Image
        src="https://media.giphy.com/media/WdzPgUxAazT2WNHA2r/giphy.gif"
        alt="Loading animation"
        width={200}
        height={200}
        unoptimized
      />
    </div>
  );
}
