'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bot, Send, Loader2, X, CornerDownLeft, RefreshCw } from 'lucide-react';
import { vehicles } from '@/lib/data';
import { recommendVehiclesViaChatbot, RecommendVehiclesViaChatbotActionOutput } from '@/lib/actions';
import { Vehicle } from '@/lib/types';
import VehicleCard from '@/components/vehicles/vehicle-card';
import { useTypingEffect } from '@/hooks/use-typing-effect';

interface ChatMessage {
  sender: 'user' | 'ai';
  id: string;
  response?: RecommendVehiclesViaChatbotActionOutput;
  text?: string; // for user messages
}

// Simple markdown to HTML renderer for the comparison table
const Markdown = ({ content }: { content: string }) => {
  if (!content) return null;
  const tableHtml = content
    .replace(/\|/g, '</td><td class="px-4 py-2 border">')
    .replace(/\n/g, '</tr><tr>')
    .replace(/---/g, '') // remove separator line
    .replace(/^<\/td>/, '')
    .replace(/<tr><\/tr>/, '');
  
  return (
    <table className="w-full text-sm border-collapse border mt-4 bg-background">
      <tbody dangerouslySetInnerHTML={{ __html: `<tr>${tableHtml}</tr>` }} />
    </table>
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

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  const { displayText, startTyping, isTyping } = useTypingEffect(1);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = { sender: 'user', text: input, id: `user-${Date.now()}` };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const vehicleList = JSON.stringify(vehicles.map(v => `${v.year} ${v.make} ${v.model} for ${v.price}, with ${v.kmsDriven} kms and ${v.fuelType} fuel type.`));
      const response = await recommendVehiclesViaChatbot({
        userInput: currentInput,
        language: 'English',
        vehicleList,
      });
      
      const aiMessage: ChatMessage = { sender: 'ai', response, id: `ai-${Date.now()}` };
      setMessages(prev => [...prev, aiMessage]);

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
  }, [messages, startTyping]);
  
   useEffect(() => {
    if (isTyping) {
      scrollToBottom();
    }
  }, [displayText, isTyping, scrollToBottom]);


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
        <Button
          size="icon"
          className="rounded-full w-12 h-12 bg-primary text-primary-foreground shadow-2xl"
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Chatbot"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg h-full sm:h-[80vh] flex flex-col p-0">
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
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5"/>
                <span className="sr-only">Close Chat</span>
              </Button>
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
                  <p>{showTypingEffect ? displayText : response.responseText}</p>

                  {response.recommendedVehicles && response.recommendedVehicles.length > 0 && (
                    <div className={`mt-4 grid gap-4 ${response.responseType === 'comparison' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                       {response.recommendedVehicles.map(vehicle => (
                         <div key={vehicle.id} className="bg-background rounded-lg overflow-hidden">
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
