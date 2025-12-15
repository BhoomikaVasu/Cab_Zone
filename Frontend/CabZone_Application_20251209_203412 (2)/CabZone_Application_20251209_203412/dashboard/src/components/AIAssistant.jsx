import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your AI Fleet Assistant. I can help you with driver information, document status, vehicle details, and analytics. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'Show drivers with expiring licenses',
    'Which vehicles need maintenance?',
    'Total earnings this month',
    'List pending documents',
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        text: generateAIResponse(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('expiring') || lowerQuery.includes('license')) {
      return "Based on current data, 3 drivers have licenses expiring within 30 days:\n\n1. Vijay Singh - Expires on 2024-03-15\n2. Rajesh Kumar - Expires on 2024-04-20\n3. Amit Sharma - Expires on 2024-05-10\n\nWould you like me to send renewal reminders to them?";
    } else if (lowerQuery.includes('maintenance') || lowerQuery.includes('vehicle')) {
      return "2 vehicles require immediate maintenance:\n\n1. MH-03-EF-9012 - Currently in maintenance\n2. MH-01-AB-1234 - Service due in 5 days\n\nAdditionally, 3 vehicles have upcoming scheduled maintenance within the next 2 weeks.";
    } else if (lowerQuery.includes('earnings') || lowerQuery.includes('revenue')) {
      return "This month's financial summary:\n\n💰 Total Earnings: ₹3,45,890\n📊 Compared to last month: +12.5% increase\n🚗 Average per vehicle: ₹7,206\n👨‍✈️ Top earning driver: Suresh Patil (₹95,000)\n\nWould you like a detailed breakdown?";
    } else if (lowerQuery.includes('document') || lowerQuery.includes('pending')) {
      return "Current document status:\n\n📄 Total pending: 7 documents\n⚠️ Expired: 1 (Vijay Singh's license)\n🔄 Awaiting verification: 2\n✅ Recently uploaded: 23\n\nShall I show you the specific documents that need attention?";
    } else {
      return "I can help you with:\n\n• Driver and vehicle information\n• Document status and verification\n• Earnings and analytics\n• Maintenance schedules\n• Performance metrics\n\nPlease ask me a specific question about your fleet!";
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-2xl h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">AI Fleet Assistant</h2>
                <p className="text-sm text-gray-400">Powered by Advanced Analytics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="glass-button p-2 hover:bg-red-500/20"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30'
                      : 'bg-white/10'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-purple-400" />
                      <span className="text-xs font-semibold text-purple-400">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="glass-button px-3 py-1 text-xs hover:bg-purple-500/20"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about drivers, documents, vehicles, or analytics..."
                className="glass-input flex-1"
              />
              <button
                onClick={handleSend}
                className="glass-button px-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;
