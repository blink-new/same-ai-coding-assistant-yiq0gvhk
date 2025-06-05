import { useState, useRef, useEffect } from 'react';

const messagesInitial = [
  {
    sender: "assistant",
    text: "مرحبًا! أنا مساعد Same AI البرمجي. كيف يمكنني مساعدتك اليوم؟",
  },
  {
    sender: "assistant",
    text: "يمكنك أن تطلب مني المساعدة في تصميم الواجهات، كتابة الأكواد، تصحيح الأخطاء، أو حتى الإجابة على أسئلتك البرمجية العامة.",
  },
  {
    sender: "assistant",
    text: "مثال: \"ساعدني في تصميم زر تسجيل دخول جذاب\" أو \"كيف أكتب دالة لفرز قائمة في بايثون؟\"",
  }
];

function App() {
  const [messages, setMessages] = useState(messagesInitial);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    let assistantResponseText = "شكرًا لك! أقوم بمعالجة طلبك الآن..."; // Default response

    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("تصميم") || lowerInput.includes("design")) {
      assistantResponseText =
        "بالتأكيد! يمكنني المساعدة في التصميم. صف لي ما الذي تفكر فيه؟ ما هي الألوان أو الأسلوب الذي تفضله؟";
    } else if (lowerInput.includes("انسخ") || lowerInput.includes("copy") || lowerInput.includes("clone")) {
      assistantResponseText =
        "حسنًا، يمكنني محاولة نسخ الواجهة. هل لديك رابط للموقع أو صورة للتصميم الذي تريد نسخه؟";
    } else if (
      lowerInput.includes("كود") ||
      lowerInput.includes("code") ||
      lowerInput.includes("أنشئ") ||
      lowerInput.includes("create") ||
      lowerInput.includes("اكتب") ||
      lowerInput.includes("write")
    ) {
      assistantResponseText =
        "أنا جاهز لكتابة الكود! ما هي اللغة أو التقنية التي تريد استخدامها، وما هي وظيفة الكود المطلوبة؟";
    } else if (lowerInput.includes("خطأ") || lowerInput.includes("debug") || lowerInput.includes("error") || lowerInput.includes("صحح")) {
      assistantResponseText =
        "لا مشكلة، يمكنني المساعدة في تصحيح الأخطاء. فضلاً، الصق الكود الذي به مشكلة أو صف الخطأ الذي يظهر لك.";
    } else if (lowerInput.includes("سؤال") || lowerInput.includes("question") || lowerInput.includes("كيف") || lowerInput.includes("what") || lowerInput.includes("how")) {
      assistantResponseText =
        "هذا سؤال جيد! سأحاول الإجابة عليه. ما هو سؤالك بالتحديد؟";
    } else {
      assistantResponseText = "تم استلام رسالتك! أفكر في أفضل طريقة لمساعدتك... (هنا سيظهر رد الذكاء الاصطناعي الحقيقي)";
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        sender: "assistant",
        text: assistantResponseText,
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c2b] to-[#232946]">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col glassmorphism rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white tracking-tight">Same AI Coding Assistant</h1>
          <p className="text-sm text-white/60 mt-1">مساعدك البرمجي الذكي باللغة العربية والإنجليزية</p>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-transparent">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl shadow-md text-sm whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white/20 text-white rounded-bl-none border border-white/10'
                }`}
                style={{
                  fontFamily: msg.sender === 'user' ? 'inherit' : 'monospace',
                  direction: 'rtl',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className="px-6 py-4 bg-white/10 backdrop-blur-sm border-t border-white/10 flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="اكتب سؤالك البرمجي هنا..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            dir="rtl"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
          >
            إرسال
          </button>
        </div>
      </div>
      <style>{`
        .glassmorphism {
          background: rgba(36, 40, 59, 0.7);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </div>
  );
}

export default App;