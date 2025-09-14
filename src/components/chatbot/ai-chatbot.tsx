'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bot, Send, Loader2, X, CornerDownLeft } from 'lucide-react';
import { vehicles } from '@/lib/data';
import { recommendVehiclesViaChatbot } from '@/lib/actions';
import { Vehicle } from '@/lib/types';
import VehicleCard from '@/components/vehicles/vehicle-card';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  vehicle?: Vehicle;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I'm your personal vehicle assistant. How can I help you find the perfect car today? You can tell me about your budget, preferred brands, or family needs." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const vehicleList = JSON.stringify(vehicles.map(v => `${v.year} ${v.make} ${v.model} for ${v.price}`));
      const response = await recommendVehiclesViaChatbot({
        userInput: input,
        language: 'English',
        vehicleList,
      });
      
      const aiMessage: ChatMessage = { sender: 'ai', text: response.recommendation, vehicle: response.recommendedVehicle };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, I couldn't process that request. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <>
      <motion.div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50" />
      <motion.div
        drag
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragListener={false}
        className="fixed bottom-6 right-6 z-50"
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          className="rounded-full w-16 h-16 bg-primary text-primary-foreground shadow-2xl"
          onPointerDown={(e) => {
            e.preventDefault(); // Prevent text selection
            dragControls.start(e);
          }}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Chatbot"
        >
          <Bot className="w-8 h-8" />
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-screen max-h-screen w-screen max-w-full flex flex-col p-0">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                <span className="text-primary">AI</span> Vehicle Assistant
              </DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5"/>
              <span className="sr-only">Close Chat</span>
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'ai' && <Bot className="w-8 h-8 text-primary self-start flex-shrink-0" />}
                <div className={`rounded-lg p-3 max-w-lg ${msg.sender === 'ai' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                  <p>{msg.text}</p>
                  {msg.vehicle && (
                    <div className="mt-4 bg-background rounded-lg overflow-hidden">
                       <VehicleCard vehicle={msg.vehicle} />
                    </div>
                  )}
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex items-end gap-3">
                <Bot className="w-8 h-8 text-primary self-start" />
                <div className="rounded-lg p-3 bg-muted text-muted-foreground inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin"/>
                  <span>Thinking...</span>
                </div>
              </div>
            )}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-background">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me about cars..."
                className="w-full pr-12 pl-4 py-3 rounded-full bg-muted border focus:ring-primary focus:border-primary"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-9 h-9"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
             <p className="text-xs text-muted-foreground mt-2 ml-4 flex items-center gap-1">Press <CornerDownLeft className="w-3 h-3"/> to send</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
