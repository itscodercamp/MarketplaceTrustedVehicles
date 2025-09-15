'use client';
import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Bot, Send, Loader2, X, CornerDownLeft, RefreshCw } from 'lucide-react';
import { vehicles } from '@/lib/data';
import { recommendVehiclesViaChatbot, RecommendVehiclesViaChatbotActionOutput } from '@/lib/actions';
import { Vehicle } from '@/lib/types';
import VehicleCard from '@/components/vehicles/vehicle-card';
import { useTypingEffect } from '@/hooks/use-typing-effect';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/language-store';

interface ChatMessage {
  sender: 'user' | 'ai';
  id: string;
  response?: RecommendVehiclesViaChatbotActionOutput;
  text?: string; // for user messages
}

// Simple markdown to HTML renderer for the comparison table
const Markdown = ({ content }: { content: string }) => {
  if (!content) return null;

  const rows = content.trim().split('\n').map(row => 
    row.split('|').map(cell => cell.trim()).filter(cell => cell)
  );
  
  if (rows.length < 2) return null; // Header and at least one data row

  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Filter out the separator line if it exists
  const cleanDataRows = dataRows.filter(row => !row.every(cell => /^-+$/.test(cell)));

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm text-left bg-background border-collapse">
          <thead className="hidden md:table-header-group">
              <tr className="bg-muted/50">
                  {headers.map((header, index) => (
                      <th key={index} className="p-3 font-semibold border-b">{header}</th>
                  ))}
              </tr>
          </thead>
          <tbody>
              {cleanDataRows.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                      {/* Desktop view */}
                      <tr className="hidden md:table-row border-b">
                          {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="p-3">{cell}</td>
                          ))}
                      </tr>
                      {/* Mobile view */}
                      <tr className="grid grid-cols-2 md:hidden gap-x-2 py-3 border-b">
                          {headers.map((header, headerIndex) => (
                              <React.Fragment key={headerIndex}>
                                  <td className="font-semibold p-1">{header}</td>
                                  <td className="p-1">{row[headerIndex] || '-'}</td>
                              </React.Fragment>
                          ))}
                      </tr>
                  </React.Fragment>
              ))}
          </tbody>
      </table>
    </div>
  );
};


const initialMessage: ChatMessage = { 
  id: `ai-${Date.now()}`,
  sender: 'ai', 
  response: {
    responseType: 'general',
    responseText: "Hello! I'm your personal vehicle assistant. How can I help you find the perfect car today? You can tell me about your budget, preferred brands, or family needs.",
  }
};

const AIAssistantPopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-16 right-0 w-64"
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 bg-black/20 rounded-full text-white hover:bg-black/50"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="bg-card p-3 rounded-lg shadow-xl border relative">
          <p className="text-sm text-foreground">Hi! I am your AI assistant. Search for your dream vehicle with me.</p>
        </div>
        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-card transform rotate-45 border-b border-r" />
      </div>
    </motion.div>
  );
};


export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const { language } = useLanguageStore();

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowPopup(true);
    }, 10000); // Show after 10 seconds

    const hideTimer = setTimeout(() => {
        setShowPopup(false);
    }, 25000); // Hide after 15 more seconds (total 25s)

    return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
    };
  }, []);


  const { displayText, startTyping, isTyping } = useTypingEffect(1);
  const { toggleFilter } = useVehicleFilterStore();

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    setShowPopup(false);

    const userMessage: ChatMessage = { sender: 'user', text: input, id: `user-${Date.now()}` };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const vehicleList = JSON.stringify(vehicles.map(v => `${v.year} ${v.make} ${v.model} for ${v.price}, with ${v.kmsDriven} kms and ${v.fuelType} fuel type.`));
      
      const chatHistory = newMessages.slice(0, -1).map(msg => {
        if (msg.sender === 'user') {
          return { role: 'user' as const, parts: [{ text: msg.text || '' }] };
        }
        return { role: 'model' as const, parts: [{ text: msg.response?.responseText || '' }] };
      });
      
      const response = await recommendVehiclesViaChatbot({
        userInput: currentInput,
        language: language,
        vehicleList,
        chatHistory: chatHistory,
      });

      if (response.responseType === 'filter_suggestion' && response.brandToFilter) {
          const userChoice = await new Promise<'recommend' | 'filter' | null>((resolve) => {
              const confirmationMessage: ChatMessage = {
                  sender: 'ai',
                  id: `confirm-${Date.now()}`,
                  response: {
                      ...response,
                      // Custom UI for this choice
                      responseType: 'general', // To prevent rendering cards
                      responseText: response.responseText || `I can filter the list to show only ${response.brandToFilter} cars, or I can give you some recommendations in the chat. What would you prefer?`
                  },
              };
              setMessages(prev => [...prev, confirmationMessage]);
          });
          // This part is tricky without a good way to get user input from buttons in chat
          // For now, we'll just log it. A real implementation would need a state management solution (e.g. Zustand/Redux) to handle this flow.
      } else {
        const aiMessage: ChatMessage = { sender: 'ai', response, id: `ai-${Date.now()}` };
        setMessages(prev => [...prev, aiMessage]);
      }


    } catch (error) {
      const errorMessage: ChatMessage = { 
        sender: 'ai', 
        id: `err-${Date.now()}`,
        response: {
          responseType: 'general',
          responseText: "Sorry, I couldn't process that request. Please try again."
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([initialMessage]);
  };

  const handleVehicleClick = () => {
    setIsOpen(false);
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle typing effect for the last AI message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'ai' && lastMessage.id !== initialMessage.id) {
      if(lastMessage.response?.responseText) {
         startTyping(lastMessage.response.responseText);
      }
    }
  }, [messages, startTyping, initialMessage.id]);
  
   useEffect(() => {
    if (isTyping) {
      scrollToBottom();
    }
  }, [displayText, isTyping, scrollToBottom]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowPopup(false);
  };

  return (
    <>
      <motion.div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50" />
      <motion.div
        drag
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragListener={false}
        className="fixed bottom-4 right-4 z-50"
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {showPopup && <AIAssistantPopup onClose={() => setShowPopup(false)} />}
          <Button
            size="icon"
            className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-2xl transition-all"
            onPointerDown={(e) => {
              e.preventDefault();
              dragControls.start(e);
            }}
            onClick={handleOpenChat}
            aria-label="Open AI Chatbot"
          >
            <Bot className="w-7 h-7 text-primary-foreground"/>
          </Button>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl h-full sm:h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                <span className="text-primary">AI</span> Vehicle Assistant
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleClearChat}>
                <RefreshCw className="w-5 h-5"/>
                <span className="sr-only">Clear Chat</span>
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="w-5 h-5"/>
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => {
               const isLastMessage = msg.id === messages[messages.length - 1].id;
               const isAiMessage = msg.sender === 'ai';
               const showTypingEffect = isLastMessage && isAiMessage && isTyping && msg.id !== initialMessage.id;
              
              if (msg.sender === 'user') {
                return (
                   <div key={msg.id} className="flex items-end gap-3 justify-end">
                      <div className="rounded-lg p-3 max-w-lg bg-primary text-primary-foreground">
                         <p>{msg.text}</p>
                      </div>
                   </div>
                )
              }

              // AI Message
              const { response } = msg;
              if (!response) return null;

              return (
              <div key={msg.id} className="flex items-end gap-3">
                <Bot className="w-8 h-8 text-primary self-start flex-shrink-0" />
                <div className="rounded-lg p-3 max-w-lg bg-muted text-muted-foreground w-full">
                  <p className="whitespace-pre-wrap">{showTypingEffect ? displayText : response.responseText}</p>

                  {response.responseType === 'count' && response.vehicleCount !== undefined && response.brandToFilter && (
                    <div className="mt-2 text-base font-semibold">
                      I found {response.vehicleCount} car(s) from {response.brandToFilter}.
                    </div>
                  )}

                  {response.recommendedVehicles && response.recommendedVehicles.length > 0 && (
                     <div className={cn(
                       "mt-4 grid gap-4",
                       response.responseType === 'comparison' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                     )}>
                       {response.recommendedVehicles.map(vehicle => (
                         <div key={vehicle.id} className="bg-background rounded-lg overflow-hidden border">
                           <VehicleCard vehicle={vehicle} onClick={handleVehicleClick}/>
                         </div>
                       ))}
                    </div>
                  )}

                  {response.responseType === 'comparison' && response.comparisonTable && (
                      <Markdown content={response.comparisonTable} />
                  )}
                </div>
              </div>
            )})}
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
                disabled={isLoading || isTyping}
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-9 h-9"
                onClick={handleSend}
                disabled={isLoading || !input.trim() || isTyping}
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
