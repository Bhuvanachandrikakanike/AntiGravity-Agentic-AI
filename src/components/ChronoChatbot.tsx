import React, { useState, useRef, useEffect } from 'react';
import { BRASS_EMBLEM_URL, USER_AVATAR_URL } from '../data/initialData';
import { playMechanicalClick, playStampSound } from '../utils/audio';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface ChronoChatbotProps {
  currentCalories: number;
  targetCalories: number;
  waterMl: number;
  targetWaterMl: number;
  fastingActive: boolean;
  fastingElapsedText: string;
  soundEnabled: boolean;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

const PROMPT_SUGGESTIONS = [
  'How should I allocate my remaining kilocalories today?',
  'Analyze my current protein and carbohydrate ratio.',
  'What electrolytes should I consume during my 16h fast?',
  'Suggest an artisanal dinner under 500 kcal with 35g protein.',
];

export const ChronoChatbot: React.FC<ChronoChatbotProps> = ({
  currentCalories,
  targetCalories,
  waterMl,
  targetWaterMl,
  fastingActive,
  fastingElapsedText,
  soundEnabled,
  isOpenAsModal = false,
  onCloseModal,
}) => {
  // Model and persona selection
  // gemini-3.5-flash: general tasks
  // gemini-3.1-flash-lite: tasks that should happen fast
  // gemini-3.1-pro-preview: particularly complex tasks
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [selectedPersona, setSelectedPersona] = useState<'metabolic-horologist' | 'rapid-aide' | 'chrono-physician'>('metabolic-horologist');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Greetings, Traveler of the Horological Ledger. I am your Chrono-Nutritional Advisor.\n\nYour escapement currently registers **${currentCalories.toLocaleString()} kcal** logged against your **${targetCalories.toLocaleString()} kcal** daily equilibrium (${targetCalories - currentCalories > 0 ? `${targetCalories - currentCalories} kcal remaining` : 'caloric surplus reached'}). Your ChronoHydra vessel stands at **${waterMl.toLocaleString()} mL / ${targetWaterMl.toLocaleString()} mL**.\n\nHow may I adjust your metabolic balances today?`,
      timestamp: '08:30 AM',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleModelChange = (model: 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview') => {
    playMechanicalClick(soundEnabled);
    setSelectedModel(model);
    if (model === 'gemini-3.1-flash-lite') {
      setSelectedPersona('rapid-aide');
    } else if (model === 'gemini-3.1-pro-preview') {
      setSelectedPersona('chrono-physician');
    } else {
      setSelectedPersona('metabolic-horologist');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    playMechanicalClick(soundEnabled);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: timeStr,
    };

    const newThread = [...messages, userMessage];
    setMessages(newThread);
    setInputPrompt('');
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newThread.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          persona: selectedPersona,
          dailyContext: {
            calories: currentCalories,
            targetCalories,
            waterMl,
            targetWaterMl,
            fastingActive,
            fastingElapsed: fastingElapsedText,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'The Horological Escapement encountered an error.');
      }

      playStampSound(soundEnabled);
      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'The escapement registered silence.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.warn('Chat request fallback:', err);
      setApiError(err.message || 'Error communicating with Gemini');

      // Local graceful horological advisory fallback if offline / key issue
      const fallbackReply = generateLocalChronoAdvice(text, currentCalories, targetCalories, waterMl, targetWaterMl);
      const fallbackMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: `${selectedModel} (Local Balance)`,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Local fallback responder for seamless continuity
  const generateLocalChronoAdvice = (
    query: string,
    cal: number,
    targetCal: number,
    water: number,
    targetWater: number
  ): string => {
    const remaining = targetCal - cal;
    const lower = query.toLowerCase();

    if (lower.includes('remaining') || lower.includes('eat') || lower.includes('calorie')) {
      return `Based on your Caloric Chronometer calibration, you have precisely **${remaining.toLocaleString()} kilocalories** remaining to achieve equilibrium today. \n\n*Recommended Horological Allocation:*\n• **Protein Target:** Prioritize lean poultry, poached eggs, or Icelandic skyr (approx 35g-45g protein).\n• **Carbohydrate Timing:** Pair with roasted sweet potato or steamed quinoa for steady glycemia.\n• **Lipid Moderation:** 1 tablespoon of extra virgin olive oil or ghee.\n\nThis will align your basal metabolic escapement smoothly before midnight.`;
    }

    if (lower.includes('water') || lower.includes('hydration') || lower.includes('fluid')) {
      const remainingWater = Math.max(0, targetWater - water);
      return `Your ChronoHydra Chamber currently stands at **${water.toLocaleString()} mL**, requiring **${remainingWater.toLocaleString()} mL** to reach complete saturation. \n\nWe advise two 500 mL infusions spaced 90 minutes apart to optimize cellular osmolarity without stressing renal clearance.`;
    }

    if (lower.includes('fast') || lower.includes('electrolyte')) {
      return `During your fasting window, cellular autophagy and mitochondrial turnover accelerate once you pass the 14-hour threshold. \n\nMaintain cellular volume with 500mg sodium and 200mg potassium dissolved in warm water to prevent escapement fatigue.`;
    }

    return `The Chronometer balances register your inquiry regarding: "${query}". \n\nTo preserve metabolic equilibrium, maintain steady circadian meal spacing, honor your **${remaining.toLocaleString()} kcal** allowance, and replenish your ChronoHydra chamber to the 3,000 mL mark before the evening chime strikes.`;
  };

  const handleClearChat = () => {
    playMechanicalClick(soundEnabled);
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `Folio ledger cleared. The horological escapement is reset to neutral. How may I advise your metabolic trajectory?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  return (
    <div className={`flex flex-col h-full bg-[#fff8f6] rounded-xl border border-[#d8c3b4]/60 shadow-xl overflow-hidden ${isOpenAsModal ? 'max-h-[85vh]' : ''}`}>
      {/* Header Deck: Persona & Model Selection */}
      <div className="bg-[#ffe9e2] p-4 border-b border-[#d8c3b4]/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-lg bg-white shadow-inner flex items-center justify-center border border-[#d8c3b4]/30">
            <img
              src={BRASS_EMBLEM_URL}
              alt="Chrono Advisor Emblem"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Newsreader',serif] text-xl font-bold text-[#2a170f] leading-tight">
                Chrono-Nutritional Gemini Oracle
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#176a30] animate-pulse" title="Engine Active" />
            </div>
            <span className="font-['Fira_Sans',sans-serif] text-[11px] text-[#857467]">
              Multi-Turn Metabolic Guidance &amp; Caloric Deliberation
            </span>
          </div>
        </div>

        {/* Model Selector Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-lg bg-[#fff1ec] border border-[#d8c3b4]/50 shadow-inner">
            <button
              type="button"
              onClick={() => handleModelChange('gemini-3.5-flash')}
              className={`px-2.5 py-1 rounded text-[11px] font-['Fira_Sans',sans-serif] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedModel === 'gemini-3.5-flash'
                  ? 'bg-[#a76526] text-white shadow-sm'
                  : 'text-[#857467] hover:text-[#2a170f]'
              }`}
              title="General nutritional wisdom & daily tracking (gemini-3.5-flash)"
            >
              General • 3.5 Flash
            </button>
            <button
              type="button"
              onClick={() => handleModelChange('gemini-3.1-flash-lite')}
              className={`px-2.5 py-1 rounded text-[11px] font-['Fira_Sans',sans-serif] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-[#176a30] text-white shadow-sm'
                  : 'text-[#857467] hover:text-[#2a170f]'
              }`}
              title="High-speed rapid checks & calorie estimation (gemini-3.1-flash-lite)"
            >
              Rapid • Lite
            </button>
            <button
              type="button"
              onClick={() => handleModelChange('gemini-3.1-pro-preview')}
              className={`px-2.5 py-1 rounded text-[11px] font-['Fira_Sans',sans-serif] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedModel === 'gemini-3.1-pro-preview'
                  ? 'bg-[#0062a1] text-white shadow-sm'
                  : 'text-[#857467] hover:text-[#2a170f]'
              }`}
              title="Complex metabolic reasoning & biochemistry (gemini-3.1-pro-preview)"
            >
              Pro Reasoning
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-white hover:bg-[#ffe2d8] text-[#857467] hover:text-[#894d0d] border border-[#d8c3b4]/40 cursor-pointer"
            title="Reset Folio Thread"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
          </button>

          {isOpenAsModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="p-1.5 rounded-lg bg-white hover:bg-[#ffe2d8] text-[#857467] hover:text-[#2a170f] border border-[#d8c3b4]/40 cursor-pointer"
              title="Close Advisor Drawer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Telemetry Banner (Grounded Context) */}
      <div className="bg-[#fff1ec] px-4 py-2 border-b border-[#d8c3b4]/40 flex flex-wrap items-center justify-between text-[11px] font-['Fira_Sans',sans-serif] text-[#524439] gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#894d0d]" />
            Caloric Balance: {currentCalories.toLocaleString()} / {targetCalories.toLocaleString()} kcal
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0062a1]" />
            Hydration: {waterMl.toLocaleString()} / {targetWaterMl.toLocaleString()} mL
          </span>
          <span className="flex items-center gap-1 font-semibold text-[#176a30]">
            <span className="w-2 h-2 rounded-full bg-[#176a30]" />
            Fast: {fastingActive ? fastingElapsedText : 'Paused'}
          </span>
        </div>
        <span className="text-[10px] text-[#857467] uppercase font-bold tracking-widest">
          Grounded In Daily Ledger
        </span>
      </div>

      {apiError && (
        <div className="bg-[#ffe2d8] px-4 py-2 text-xs text-[#894d0d] flex items-center justify-between border-b border-[#ffdbce]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>{apiError} (Serving cached horological guidance)</span>
          </div>
          <button
            type="button"
            onClick={() => setApiError(null)}
            className="text-[10px] font-bold uppercase underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-[#fff8f6]/60">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] md:max-w-[78%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar Icon */}
              <div className="shrink-0 pt-1">
                {isUser ? (
                  <div className="w-8 h-8 rounded-full bg-[#2a170f] p-0.5 shadow border border-[#ffdcc2]">
                    <img
                      src={USER_AVATAR_URL}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#a76526] p-1 shadow flex items-center justify-center border border-[#ffdcc2]">
                    <img
                      src={BRASS_EMBLEM_URL}
                      alt="Oracle Emblem"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="font-['Newsreader',serif] text-xs font-semibold text-[#2a170f]">
                    {isUser ? 'Log Officer' : 'Master Horologist'}
                  </span>
                  <span className="text-[10px] font-['Fira_Sans',sans-serif] text-[#857467]">
                    {msg.timestamp}
                  </span>
                  {!isUser && msg.modelUsed && (
                    <span className="px-1.5 py-0.2 rounded bg-[#ffe9e2] text-[9px] font-mono text-[#894d0d] border border-[#d8c3b4]/30">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>

                <div
                  className={`p-4 rounded-xl shadow-md text-sm leading-relaxed whitespace-pre-wrap font-['Fira_Sans',sans-serif] ${
                    isUser
                      ? 'bg-[#2a170f] text-[#fff8f6] rounded-tr-none border border-[#6d3a00]'
                      : 'bg-[#fff1ec] text-[#2a170f] rounded-tl-none border border-[#d8c3b4]/50 shadow-inner'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[75%] mr-auto items-center">
            <div className="w-8 h-8 rounded-full bg-[#a76526] p-1 shadow flex items-center justify-center border border-[#ffdcc2] animate-spin">
              <span className="material-symbols-outlined text-white text-sm">settings</span>
            </div>
            <div className="bg-[#fff1ec] px-4 py-3 rounded-xl border border-[#d8c3b4]/50 shadow-inner flex items-center gap-2 text-xs text-[#894d0d] font-semibold">
              <span className="animate-pulse">Consulting the {selectedModel} Escapement...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Shelf */}
      <div className="bg-[#ffe9e2]/80 px-4 py-2 border-t border-[#d8c3b4]/40 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] text-[#857467] uppercase font-bold whitespace-nowrap shrink-0">
          Inquire:
        </span>
        {PROMPT_SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(sug)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-[#ffe2d8] text-[11px] text-[#2a170f] border border-[#d8c3b4]/40 whitespace-nowrap shrink-0 transition-colors shadow-xs cursor-pointer font-medium disabled:opacity-50"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Deck */}
      <div className="p-3 md:p-4 bg-white border-t border-[#d8c3b4]/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            placeholder={`Inquire with ${selectedModel} (e.g. 'How should I break my fast?')...`}
            className="flex-1 bg-[#fff1ec] px-4 py-2.5 rounded-lg border border-[#d8c3b4] font-['Fira_Sans',sans-serif] text-sm text-[#2a170f] placeholder-[#857467] focus:outline-[#894d0d] shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#2e1500] font-['Fira_Sans',sans-serif] text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-105 active:translate-y-0.5 border border-[#ffdcc2]/40 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">send</span>
            <span className="hidden sm:inline">Deliberate</span>
          </button>
        </form>
      </div>
    </div>
  );
};
