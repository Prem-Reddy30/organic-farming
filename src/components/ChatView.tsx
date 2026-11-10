import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Filter,
  RefreshCw,
  Plus,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { ChatMessage, SourceCitation, Language } from '../types';
import { sendMessageToRAG, fetchChatHistory } from '../services/api';

interface ChatViewProps {
  initialQuery?: string;
  language: Language;
}

export const ChatView: React.FC<ChatViewProps> = ({ initialQuery, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('session_' + Date.now());
  const [sessionsList, setSessionsList] = useState<any[]>([]);

  // Filter options
  const [cropFilter, setCropFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Speech Recognition & Text-to-Speech
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Initial welcome message
  useEffect(() => {
    const welcomeText = language === 'te'
      ? 'నమస్కారం! నేను మీ ఆర్గానిక్ వ్యవసాయ AI సలహాదారుని. ఐసీఏఆర్ (ICAR), వ్యవసాయ విశ్వవిద్యాలయాలు మరియు NCOF పరిశోధనల ఆధారంగా మాత్రమే సమాధానాలు ఇస్తాను. జీవామృతం, వర్మీకంపోస్ట్, పురుగు నివారణ లేదా పంటల సాగు గురించి నన్ను అడగండి.'
      : language === 'hi'
      ? 'नमस्ते! मैं आपका प्रामाणिक जैविक कृषि सहायक हूँ। ICAR एवं सरकारी कृषि शोध संस्थानों के आधार पर ही सलाह प्रदान करता हूँ। जीवामृत, केंचुआ खाद, फसल सुरक्षा व पोषक तत्व प्रबंधन पर कोई भी प्रश्न पूछें।'
      : 'Hello! I am your Organic Farming AI Assistant grounded in verified ICAR, KVK, and University research. Ask me about Jeevamrutham, vermicomposting, biological pest controls, or organic packages of practices.';

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeText,
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_questions: [
          'How to prepare Jeevamrutham step by step?',
          'How to prepare vermicompost at home?',
          'Organic pest management in cotton',
          'How to manage fungal diseases in tomatoes naturally?'
        ]
      }
    ]);

    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [language]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          // Only auto-send when the result is final
          if (event.results[0].isFinal) {
            handleSend(transcript);
          }
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const speakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanSpeech = text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*/g, '')
      .replace(/>\s?/g, '')
      .replace(/[-*]\s/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await sendMessageToRAG(
        text,
        sessionId,
        cropFilter !== 'All' ? cropFilter : undefined,
        topicFilter !== 'All' ? topicFilter : undefined,
        regionFilter !== 'All' ? regionFilter : undefined,
        language
      );

      const aiMessage: ChatMessage = {
        id: 'ai_' + Date.now(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        language: response.language,
        used_llm: response.used_llm,
        suggested_questions: response.suggested_questions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Auto-speak: read the AI answer aloud automatically
      if (autoSpeak) {
        setTimeout(() => speakText(aiMessage.id, aiMessage.content), 300);
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `⚠️ Failed to retrieve response: ${err.message || 'Server error'}. Please check backend connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setSessionId('session_' + Date.now());
    window.speechSynthesis.cancel();
    setSpeakingMsgId(null);
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        content: language === 'te'
          ? 'కొత్త సంభాషణ ప్రారంభమైంది. మీకు ఏ పంట లేదా సేంద్రీయ ఎరువుల గురించి సహాయం కావాలి?'
          : language === 'hi'
          ? 'नई बातचीत शुरू हुई। आप किस फसल या जैविक खाद के बारे में जानना चाहते हैं?'
          : 'New conversation started. What crop or organic input can I assist you with?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_questions: [
          'How to prepare Jeevamrutham step by step?',
          'Organic nutrient management for paddy?',
          'How to manage fungal diseases in tomatoes?'
        ]
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10.5rem)] sm:h-[calc(100vh-9.5rem)] max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Bar with Filter Toggle & New Chat */}
      <div className="px-4 py-3 bg-agri-50/70 border-b border-agri-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-agri-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-forest">Grounded RAG Assistant</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                Strict Grounding Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              {cropFilter !== 'All' ? `Crop: ${cropFilter}` : 'All Crops'} • {topicFilter !== 'All' ? `Topic: ${topicFilter}` : 'All Topics'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-Speak Toggle */}
          <button
            type="button"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
              autoSpeak
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title={autoSpeak ? 'Auto-speak ON — answers will be read aloud' : 'Auto-speak OFF — tap to enable'}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoSpeak ? 'Voice ON' : 'Voice OFF'}</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
              showFilters || cropFilter !== 'All' || topicFilter !== 'All'
                ? 'bg-agri-700 text-white border-agri-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {(cropFilter !== 'All' || topicFilter !== 'All') && (
              <span className="w-2 h-2 rounded-full bg-cream-200" />
            )}
          </button>

          <button
            onClick={startNewChat}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-agri-800 hover:border-agri-300 transition-all"
            title="Start New Chat Session"
          >
            <Plus className="w-3.5 h-3.5 text-agri-600" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="p-3 bg-agri-50/90 border-b border-agri-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-agri-900 uppercase tracking-wider mb-1">
              Crop Filter
            </label>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-agri-400"
            >
              <option value="All">All Crops (General)</option>
              <option value="Paddy">Paddy / Rice (వరి / धान)</option>
              <option value="Cotton">Cotton (పత్తి / कपास)</option>
              <option value="Tomato">Tomato (టమాటా / टमाटर)</option>
              <option value="Wheat">Wheat (గోధుమ / गेहूँ)</option>
              <option value="Chickpea">Chickpea / Pulses (శనగలు)</option>
              <option value="Chilli">Chilli (మిరప / मिर्च)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-agri-900 uppercase tracking-wider mb-1">
              Farming Topic
            </label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-agri-400"
            >
              <option value="All">All Topics</option>
              <option value="Nutrient">Nutrient & Compost Management</option>
              <option value="Pest">Pest & Disease Control</option>
              <option value="Soil">Soil Health & Green Manure</option>
              <option value="Biofertilizer">Biofertilizers & Inoculants</option>
              <option value="Package of Practices">Package of Practices</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-agri-900 uppercase tracking-wider mb-1">
              State / Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-agri-400"
            >
              <option value="All">All Indian States</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjab">Punjab</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
            </select>
          </div>
        </div>
      )}

      {/* Listening Indicator Banner */}
      {isListening && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 flex items-center gap-2 text-xs text-red-700 animate-pulse">
          <Mic className="w-4 h-4" />
          <span className="font-semibold">🎤 Listening... Speak your question now</span>
          <button onClick={toggleListening} className="ml-auto text-red-600 hover:text-red-800 text-[10px] font-bold underline">Stop</button>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                msg.role === 'user'
                  ? 'bg-slate-700 shadow-xs'
                  : 'bg-gradient-to-br from-agri-700 to-forest shadow-sm'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-agri-800 text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-200/90 text-slate-800 shadow-2xs'
              }`}
            >
              {/* Header with audio read button */}
              <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-black/5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {msg.role === 'user' ? 'Farmer Inquiry' : 'Verified AI Agricultural Guidance'}
                </span>

                <div className="flex items-center gap-1.5">
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.id, msg.content)}
                      className={`p-1 rounded-md transition-colors ${
                        speakingMsgId === msg.id
                          ? 'bg-red-100 text-red-600'
                          : 'hover:bg-slate-200/60 text-slate-600'
                      }`}
                      title={speakingMsgId === msg.id ? 'Stop reading' : 'Read guidance aloud'}
                    >
                      {speakingMsgId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              </div>

              {/* Message Content Rendered */}
              <div className="prose prose-xs sm:prose-sm max-w-none text-slate-800 whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {/* Source Citations Display */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-forest">
                    <ShieldCheck className="w-3.5 h-3.5 text-agri-600" />
                    <span>Verified Knowledge Sources Used in Answer:</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {msg.sources.map((src, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2.5 rounded-xl bg-white border border-agri-100/90 shadow-2xs flex items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-agri-900 line-clamp-1">
                            {src.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {src.author || 'Agricultural Authority'} • Section/Page: {src.page_number || 1}
                          </div>
                        </div>

                        {src.source_url && (
                          <a
                            href={src.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 p-1 rounded-md text-agri-700 hover:text-forest hover:bg-agri-50"
                            title="Open original document link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Questions Pills */}
              {msg.suggested_questions && msg.suggested_questions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Suggested Next Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggested_questions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(q)}
                        className="px-2.5 py-1 rounded-lg bg-agri-50 hover:bg-agri-100 text-agri-800 text-xs font-medium border border-agri-200 transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex gap-3 max-w-2xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-agri-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-agri-600 animate-spin" />
              <span>
                Retrieving verified agricultural manuals from vector database & grounding response...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box with Voice & Send */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2"
        >
          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition-all shadow-xs ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-agri-50 text-agri-700 hover:bg-agri-100 border border-agri-200'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Voice input (Telugu / Hindi / English)'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              language === 'te'
                ? 'సేంద్రీయ వ్యవసాయంపై మీ ప్రశ్నను ఇక్కడ అడగండి...'
                : language === 'hi'
                ? 'जैविक खेती संबंधी अपना प्रश्न यहाँ लिखें...'
                : 'Ask organic farming question (e.g. How to prepare Jeevamrutham?)...'
            }
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:bg-white transition-all"
          />

          {/* Submit Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-3 rounded-2xl bg-agri-700 hover:bg-forest text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
