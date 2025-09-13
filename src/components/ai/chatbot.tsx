"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, GripVertical, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { recommendVehiclesViaChatbot } from '@/lib/actions';
import { vehicles as vehicleList } from '@/lib/data';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! How can I help you find the perfect car today? You can ask me in English, Hindi, Marathi, or Urdu." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // For dragging
  const chatRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 32, y: window.innerHeight - 88 - 32 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
        setPosition(pos => ({
            x: Math.min(pos.x, window.innerWidth - 384 - 32),
            y: Math.min(pos.y, window.innerHeight - 500 - 32)
        }));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chatRef.current) {
      setIsDragging(true);
      const rect = chatRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;
      
      const maxX = window.innerWidth - (chatRef.current?.offsetWidth || 0) - 32;
      const maxY = window.innerHeight - (chatRef.current?.offsetHeight || 0) - 32;

      newX = Math.max(32, Math.min(newX, maxX));
      newY = Math.max(32, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);


  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // A simple language detection heuristic
      const language = 'English'; // For simplicity, hardcoding. A more complex check could be done here.
      
      const response = await recommendVehiclesViaChatbot({
        userInput: inputValue,
        language: language,
        vehicleList: JSON.stringify(vehicleList),
      });

      const botMessage: Message = { sender: 'bot', text: response.recommendation };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <div
      ref={chatRef}
      className="fixed z-50 rounded-lg shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
        <Card className="w-96 h-[500px] flex flex-col">
          <CardHeader
            className="flex flex-row items-center justify-between p-4 bg-primary text-primary-foreground cursor-move"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-primary-foreground/50"/>
                <CardTitle className="text-lg">AI Vehicle Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    {message.sender === 'bot' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                    <div className={`max-w-xs rounded-lg p-3 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2">
                    <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="max-w-xs rounded-lg p-3 bg-secondary flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Ask about cars..."
                className="flex-1"
                autoComplete="off"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                disabled={isLoading}
              />
               <Button type="submit" size="icon" disabled={isLoading}>
                 <Send className="h-4 w-4" />
                 <span className="sr-only">Send</span>
               </Button>
            </form>
             <p className="text-xs text-muted-foreground ml-2 absolute -bottom-5 left-2">
               Press <CornerDownLeft className="inline h-3 w-3" /> to send
             </p>
          </CardFooter>
        </Card>
    </div>
  );
}
