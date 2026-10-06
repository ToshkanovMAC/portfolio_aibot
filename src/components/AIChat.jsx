import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/aiService';

const AIChat = ({ onDownloadCV }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Assalomu alaykum! Men **Toshkanov Ulug'bekning AI Yordamchisiman** 🤖✨.\n\nUlug'bekning loyihalari, ko'nikmalari, ta'limi yoki bog'lanish haqida qanday yordam bera olaman?",
      suggestions: ["Ko'nikmalari qanday?", "Loyihalari haqida", "CV yuklash", "Bog'lanish"]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  // Web Speech API orqali ovozli o'qish (agar yoqilgan bo'lsa)
  const speakText = (text) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Markdown va linklarni tozalash
      const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_#`•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  const handleActionClick = (action) => {
    if (!action) return;
    if (action.startsWith('scroll-')) {
      const sectionId = action.replace('scroll-', '');
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Mobilda chatni yopib sahifani ko'rsatish
        if (window.innerWidth < 640) {
          setIsOpen(false);
        }
      }
    } else if (action === 'trigger-cv') {
      if (onDownloadCV) {
        onDownloadCV();
      } else {
        window.location.href = '/cv';
      }
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const chatHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await sendChatMessage(text, chatHistory);

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text,
        action: response.action,
        actionText: response.actionText,
        suggestions: response.suggestions
      };

      setMessages((prev) => [...prev, aiMessage]);
      speakText(response.text);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "Kechirasiz, xatolik yuz berdi. Iltimos qayta urinib ko'ring yoki to'g'ridan-to'g'ri Telegram orqali bog'laning: [@mufizm](https://t.me/mufizm).",
          suggestions: ["Ko'nikmalari", "Bog'lanish"]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: "Suhbat tozalandi. Menga Toshkanov Ulug'bek haqida istalgan savolingizni berishingiz mumkin!",
        suggestions: ["Ulug'bek kim?", "Ko'nikmalari", "Loyihalar", "Bog'lanish"]
      }
    ]);
  };

  // Markdown formatlash (linklar, bold, bullet)
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Markdown linklarni [nomi](url) o'girish
      const parts = [];
      let lastIdx = 0;
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIdx) {
          parts.push(line.substring(lastIdx, match.index));
        }
        parts.push(
          <a
            key={match.index}
            href={match[2]}
            target={match[2].startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="text-accent3 underline font-medium hover:text-accent2 transition-colors inline-flex items-center gap-1"
          >
            {match[1]}
            {match[2].startsWith('http') && <i className="fas fa-external-link-alt text-[0.7em]"></i>}
          </a>
        );
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < line.length) {
        parts.push(line.substring(lastIdx));
      }

      // Bold **text**
      const processedElements = parts.map((part, pIdx) => {
        if (typeof part !== 'string') return part;
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith('**') && bPart.endsWith('**')) {
            return (
              <strong key={`${pIdx}-${bIdx}`} className="text-white font-semibold">
                {bPart.slice(2, -2)}
              </strong>
            );
          }
          return bPart;
        });
      });

      return (
        <div key={idx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.25rem] leading-relaxed'}>
          {processedElements.length > 0 ? processedElements : ' '}
        </div>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[999] font-dm">
      {/* Suzuvchi AI Tugmasi (Floating Button) */}
      {!isOpen && (
        <div className="relative group">
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-accent text-[9px] text-white font-bold items-center justify-center">1</span>
            </span>
          )}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="AI Yordamchini ochish"
            className="relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-grad text-white shadow-[0_8px_30px_rgba(108,99,255,0.45)] hover:shadow-[0_12px_40px_rgba(56,189,248,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer"
          >
            <div className="relative w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i className="fas fa-robot text-base text-white animate-pulse"></i>
              <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-25"></div>
            </div>
            <div className="text-left hidden sm:block pr-1">
              <div className="text-xs font-bold font-syne tracking-wide flex items-center gap-1.5">
                <span>Toshkanov AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[11px] text-white/80 font-light">Savol bering!</div>
            </div>
          </button>
        </div>
      )}

      {/* AI Chat oynasi (Window Modal) */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] md:w-[430px] h-[580px] max-h-[85vh] bg-[#0e0e17]/95 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(108,99,255,0.2)] flex flex-col overflow-hidden animate-fade-up">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#171728] to-[#12121f] border-b border-border/60 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-grad p-[2px] shadow-[0_0_15px_rgba(108,99,255,0.4)]">
                <div className="w-full h-full bg-[#0a0a0f] rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-accent3 text-lg"></i>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a0f] rounded-full"></span>
              </div>
              <div>
                <div className="font-syne font-bold text-sm text-text flex items-center gap-1.5">
                  Toshkanov AI
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-accent/20 text-accent2 rounded-md border border-accent/30">Assistant</span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online · Portfolio bo'yicha yordamchi
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1 text-muted">
              {/* Ovozli o'qish yoqish/o'chirish */}
              {'speechSynthesis' in window && (
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  title={speechEnabled ? "Ovozli o'qishni o'chirish" : "Ovozli o'qishni yoqish"}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer ${
                    speechEnabled ? 'bg-accent/20 text-accent3' : 'hover:bg-card hover:text-text'
                  }`}
                >
                  <i className={`fas ${speechEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
                </button>
              )}

              {/* Tozalash */}
              <button
                onClick={handleClearChat}
                title="Suhbatni tozalash"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs hover:bg-card hover:text-text transition-colors cursor-pointer"
              >
                <i className="fas fa-trash-can"></i>
              </button>

              {/* Yopish */}
              <button
                onClick={() => setIsOpen(false)}
                title="Yopish"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer ml-1"
              >
                <i className="fas fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] ${
                    msg.sender === 'user'
                      ? 'bg-grad text-white rounded-tr-none shadow-[0_4px_15px_rgba(108,99,255,0.25)]'
                      : 'bg-card/90 border border-border/80 text-text/90 rounded-tl-none shadow-sm'
                  }`}
                >
                  {renderFormattedText(msg.text)}

                  {/* Interaktiv Action Tugmasi (masalan, bo'limga o'tish yoki CV yuklash) */}
                  {msg.action && (
                    <button
                      onClick={() => handleActionClick(msg.action)}
                      className="mt-3 w-full py-2 px-3 bg-accent/20 hover:bg-accent/30 text-accent2 border border-accent/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <i className={msg.action === 'trigger-cv' ? 'fas fa-file-pdf' : 'fas fa-arrow-right'}></i>
                      {msg.actionText || "Bo'limga o'tish"}
                    </button>
                  )}
                </div>

                {/* AI tomonidan tavsiya etilgan tezkor savollar */}
                {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.suggestions.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(suggestion)}
                        disabled={isTyping}
                        className="text-[11px] bg-[#161622] hover:bg-accent/20 text-muted hover:text-accent3 border border-border/60 hover:border-accent/40 rounded-full px-3 py-1 transition-all cursor-pointer hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        ⚡ {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 bg-card/80 border border-border/60 rounded-2xl rounded-tl-none px-4 py-3 w-fit">
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-accent2 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-accent3 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[11px] text-muted ml-1">AI javob yozmoqda...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Form */}
          <div className="p-3 bg-[#11111a] border-t border-border/60">
            <div className="flex items-center gap-2 bg-card border border-border/80 rounded-xl px-3 py-1.5 focus-within:border-accent transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ulug'bek haqida savol bering..."
                disabled={isTyping}
                className="flex-1 bg-transparent text-text text-[13px] outline-none placeholder:text-muted/60 disabled:opacity-50 py-1.5"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                aria-label="Xabar yuborish"
                className="w-8 h-8 rounded-lg bg-grad text-white flex items-center justify-center text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 cursor-pointer flex-shrink-0"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <div className="text-[10px] text-muted/60 text-center mt-1.5 font-light">
              Toshkanov AI · Gemini & Portfolio Knowledge Base
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
