import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { aiService } from '../services/aiService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Bonjour ! Je suis votre assistant Smart Academy. Je peux vous renseigner sur nos formations, tarifs, inscriptions et bien plus ! Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Réponses rapides
  const quickReplies: string[] = [
    "Quelles formations proposez-vous ?",
    "Combien coûte la formation IA ?", 
    "Comment m'inscrire ?",
    "Quels sont les horaires de support ?",
    "Y a-t-il des prérequis ?"
  ];

  // Scroll vers le bas automatiquement
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gestion de l'envoi de message
  const handleSendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Préparer l'historique de conversation
      const conversationHistory = messages
        .filter(msg => msg.sender !== 'system')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
          content: msg.text
        }));

      // Obtenir la réponse de l'IA
      const botResponse = await aiService.chatWithAI(inputMessage, conversationHistory);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur chatbot:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Je rencontre actuellement un problème technique. Vous pouvez nous contacter directement à borsaliaya1@gmail.com ou par téléphone au +216 XX XXX XXX.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des réponses rapides
  const handleQuickReply = (reply: string): void => {
    setInputMessage(reply);
  };

  // Rendu d'un message
  const renderMessage = (message: Message): JSX.Element => (
    <div
      key={message.id}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl p-3 ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
        }`}
      >
        <div className="flex items-center mb-1 space-x-2">
          {message.sender === 'bot' ? (
            <Bot className="w-3 h-3" />
          ) : (
            <User className="w-3 h-3" />
          )}
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.text}</div>
      </div>
    </div>
  );

  // Rendu de l'indicateur de chargement
  const renderLoadingIndicator = (): JSX.Element => (
    <div className="flex justify-start">
      <div className="max-w-[85%] bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-3 border border-gray-200">
        <div className="flex items-center space-x-2">
          <Bot className="w-3 h-3" />
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed z-50 bottom-4 left-4">
      {/* Bouton d'ouverture du chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-16 h-16 text-white transition-all duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 animate-pulse"
          title="Assistant Smart Academy"
          aria-label="Ouvrir l'assistant de chat"
        >
          <Bot className="w-8 h-8" />
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div 
          className={`bg-white rounded-2xl shadow-2xl border border-gray-200 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
          } transition-all duration-300 flex flex-col`}
          role="dialog"
          aria-label="Fenêtre de chat de l'assistant Smart Academy"
        >
          {/* En-tête */}
          <div className="flex items-center justify-between p-4 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <div>
                <span className="font-semibold">Assistant Smart Academy</span>
                <div className="text-xs opacity-80">En ligne • Prêt à aider</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 transition-colors rounded hover:bg-white/20"
                title={isMinimized ? "Agrandir" : "Réduire"}
                aria-label={isMinimized ? "Agrandir la fenêtre de chat" : "Réduire la fenêtre de chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 transition-colors rounded hover:bg-white/20"
                title="Fermer"
                aria-label="Fermer la fenêtre de chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Zone des messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto h-80">
                {messages.map(renderMessage)}
                {isLoading && renderLoadingIndicator()}
                <div ref={messagesEndRef} aria-hidden="true" />
              </div>

              {/* Réponses rapides (seulement au début de la conversation) */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <div className="mb-2 text-xs text-gray-500">💡 Questions rapides :</div>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1 text-xs text-blue-600 transition-colors border border-blue-200 rounded-full bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        type="button"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire d'envoi */}
              <form 
                onSubmit={handleSendMessage} 
                className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl"
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                    placeholder="Posez votre question sur Smart Academy..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    aria-label="Votre message"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    aria-label="Envoyer le message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-center text-gray-500">
                  💬 Assistant alimenté par Smart Academy
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;