
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Heart, MessageCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Footer } from '@/components/footer';
import { toast } from 'sonner';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI wedding planning assistant. I'm here to help you plan your perfect wedding. You can ask me about budgets, timelines, vendor recommendations, wedding traditions, or anything else related to your special day. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "How do I create a realistic wedding budget?",
    "What should be on my wedding planning timeline?",
    "How do I choose the perfect wedding venue?",
    "What are some unique wedding traditions I could include?",
    "How can I save money on my wedding without compromising quality?",
    "What should I consider when choosing a wedding photographer?",
  ];

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversation: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: '',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setIsLoading(false);
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                  assistantMessage.content += parsed.choices[0].delta.content;
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id ? {...assistantMessage} : msg
                    )
                  );
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      toast.error('Failed to get response from AI assistant');
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const askSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <DashboardHeader user={{ name: 'Wedding Planner' }} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              AI Wedding <span className="text-indigo-600">Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized wedding planning advice and recommendations powered by AI
            </p>
          </div>

          {/* Chat Interface */}
          <Card className="wedding-card h-96 md:h-[500px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Wedding AI Assistant</CardTitle>
                  <CardDescription>Ask me anything about wedding planning</CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 px-6">
              {messages?.map((message: any) => (
                <motion.div
                  key={message?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message?.type === 'user' 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{message?.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message?.timestamp?.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about wedding planning..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-indigo-500 hover:bg-indigo-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Suggested Questions */}
          <Card className="wedding-card mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Suggested Questions</span>
              </CardTitle>
              <CardDescription>
                Click on any question to ask the AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions?.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto p-3 justify-start hover:border-indigo-300 hover:bg-indigo-50"
                    onClick={() => askSuggestedQuestion(question)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0 text-indigo-500" />
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="wedding-card text-center">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Personalized Advice</h3>
                <p className="text-sm text-gray-600">Get recommendations tailored to your budget, style, and preferences</p>
              </CardContent>
            </Card>

            <Card className="wedding-card text-center">
              <CardContent className="p-6">
                <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Creative Ideas</h3>
                <p className="text-sm text-gray-600">Discover unique wedding ideas and creative solutions for your big day</p>
              </CardContent>
            </Card>

            <Card className="wedding-card text-center">
              <CardContent className="p-6">
                <Bot className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Ask questions anytime and get instant, helpful responses</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
