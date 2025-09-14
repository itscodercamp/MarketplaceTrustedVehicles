'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useTypingEffect(speed = 50) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fullTextRef = useRef('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = useCallback((text: string) => {
    fullTextRef.current = text;
    setDisplayText('');
    setIsTyping(true);
  }, []);

  useEffect(() => {
    if (isTyping) {
      if (displayText.length < fullTextRef.current.length) {
        typingTimeoutRef.current = setTimeout(() => {
          setDisplayText(prev => fullTextRef.current.slice(0, prev.length + 1));
        }, speed);
      } else {
        setIsTyping(false);
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [displayText, isTyping, speed]);

  return { displayText, startTyping, isTyping };
}
