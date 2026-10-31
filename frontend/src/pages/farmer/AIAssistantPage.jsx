import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../../services/api';
import DisclaimerBanner from '../../components/DisclaimerBanner';
import { 
  Bot, 
  Send, 
  User, 
  ExternalLink, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "What are the early signs of Foot and Mouth Disease in cattle?",
  "Which cattle vaccinations are legally compulsory in South Africa?",
  "How can I tell African Redwater apart from Heartwater?",
  "When should young calves be vaccinated against Blackquarter?",
  "How do I submit a livestock health report on HerdGuard AI?"
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: (
        "Sawubona! I am the **HerdGuard AI Assistant**, your agricultural intelligence partner. " +
        "I provide guidance on South African cattle health, biosecurity practices, vaccination guidelines, " +
        "and platform usage based on official documentation from the Department of Agriculture (DALRRD) and ARC Onderstepoort.\n\n" +
        "How can I assist your herd today?"
      ),
      citations: [
        { title: "DALRRD & ARC Veterinary Guidelines", source_organization: "South African Agricultural Research" }
      ],
      suggested_followups: SUGGESTED_QUESTIONS.slice(0, 3)
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (queryToSend) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || loading) return;

    // Append user message
    const newMsgList = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgList);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await aiAPI.askAssistant({ query });
      setMessages([
        ...newMsgList,
        {
          sender: 'assistant',
          text: res.data.answer,
          citations: res.data.citations,
          advisory_notice: res.data.advisory_notice,
          suggested_followups: res.data.suggested_followups
        }
      ]);
    } catch (err) {
      console.error("AI assistant error:", err);
      setMessages([
        ...newMsgList,
        {
          sender: 'assistant',
          text: "I encountered an error retrieving agricultural guidance. Please check your internet connection or try rephrasing your question.",
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-800 text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-forest-300" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-charcoal">HerdGuard AI Assistant</h1>
            <p className="text-xs text-charcoal-muted">
              RAG Agricultural Intelligence Grounded in DALRRD & ARC Research
            </p>
          </div>
        </div>
      </div>

      <DisclaimerBanner message="HerdGuard AI Assistant provides agricultural biosecurity and herd management education. It does not replace an on-site clinical examination by a qualified veterinarian or Animal Health Technician." />

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-forest-700 text-white'
                  : 'bg-forest-100 text-forest-800'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-forest-800 text-white rounded-tr-none'
                  : 'bg-cream border border-gray-100 text-charcoal rounded-tl-none space-y-3'
              }`}
            >
              <div className="whitespace-pre-line font-normal">
                {msg.text}
              </div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-gray-200/60 text-[11px] text-charcoal-muted space-y-1">
                  <div className="font-bold flex items-center space-x-1 text-forest-800">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Knowledge Citations:</span>
                  </div>
                  {msg.citations.map((c, i) => (
                    <div key={i} className="pl-4">
                      • {c.title} ({c.source_organization})
                      {c.source_url && (
                        <a
                          href={c.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-1 text-forest-700 hover:underline inline-flex items-center"
                        >
                          <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {msg.suggested_followups.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-forest-50 border border-forest-200 text-forest-900 text-[11px] font-medium transition text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-cream border border-gray-100 p-3.5 rounded-2xl rounded-tl-none text-xs text-charcoal-muted flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-forest-600 animate-ping"></span>
              <span>Retrieving validated agricultural knowledge...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills if empty */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-forest-50 border border-gray-200 text-xs text-charcoal font-medium transition shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask about cattle health, symptoms, vaccines, or biosecurity protocols..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-xs text-charcoal placeholder-charcoal-muted focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="p-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold transition disabled:opacity-40"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
