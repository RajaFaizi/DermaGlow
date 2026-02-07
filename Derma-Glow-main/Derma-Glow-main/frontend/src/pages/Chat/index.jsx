import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionMessages, sendChatMessage, generateReport } from "../../utils/api";
import { MessageCircle, FileText } from "lucide-react";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import { BeatLoader } from "react-spinners";

const Chat = () => {
  const location = useLocation();
  const { sessionId } = location.state;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        const sessionMessages = await getSessionMessages(sessionId);
        setMessages(sessionMessages);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [sessionId, location.state]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = { question: userInput, isUser: true };

    // Add user message immediately
    setMessages((prev) => [...prev, newMessage]);

    // Add loading message
    const loadingMessage = {
      answer: "...",
      isLoading: true,
      isUser: false,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    setUserInput("");
    scrollToBottom();

    try {
      const response = await sendChatMessage({ sessionId, message: userInput });

      // Replace loading message with actual response
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove loading message
        { answer: response.answer, isUser: false },
      ]);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      // Replace loading message with error
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { answer: "Sorry, there was an error processing your request." },
      ]);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const formattedResponse = await generateReport({ sessionId, messages });
      navigate("/report", { state: { report: formattedResponse } });
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#F8FAF5] pt-1">
      {/* Report Generation Button - Now at the top */}
      <div className="px-4 md:px-6 py-2">
        <div className="max-w-8xl mx-auto flex justify-end">
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2.5 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8A9665] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
            disabled={loading || isGeneratingReport}
          >
            <FileText size={18} />
            {isGeneratingReport ? (
              <>
                <BeatLoader color="#ffffff" size={8} />
                <span className="ml-1">Generating...</span>
              </>
            ) : (
              <span>Generate Skincare Report</span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          className="h-full px-4 md:px-6 py-4 overflow-y-auto"
          id="chat-messages"
        >
          <div className="max-w-8xl mx-auto space-y-6">
            {loading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-full min-h-[200px]">
                <BeatLoader color="#7C9C73" size={12} />
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-6 ${
                      message.isUser
                        ? "bg-[#A2AA7B] text-white shadow-lg"
                        : "bg-white text-gray-800 shadow-lg border-2 border-sage-100"
                    } ${message.isUser ? "rounded-tr-none" : "rounded-tl-none"} 
                    transform transition-all duration-200 hover:shadow-xl`}
                  >
                    {message.isLoading ? (
                      <BeatLoader color="#7C9C73" size={8} />
                    ) : message.question ? (
                      <div className="text-base md:text-lg font-medium leading-relaxed overflow-wrap-break-word word-break break-word">
                        {message.question}
                      </div>
                    ) : (
                      <MarkdownRenderer content={message.answer} />
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-sage-200 bg-white px-4 md:px-6 py-4 shadow-lg">
        <div className="w-full mx-auto">
          <form onSubmit={sendMessage} className="flex gap-3 items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 p-4 text-base border-2 border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 bg-white transition-all duration-200"
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              type="submit"
              className="px-6 py-4 bg-[#A2AA7B] text-white rounded-xl hover:bg-[#8A9665] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
              disabled={loading || !userInput.trim()}
            >
              <MessageCircle size={20} />
              <span className="hidden sm:inline font-medium">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;