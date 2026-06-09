"use client";

import { getSocket } from "@/lib/socket";
import axios from "axios";
import { MessageCircle, Send, Sparkles, Loader2 } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

type ChatRole = "driver" | "user";

interface ChatMessage {
  id: string;
  sender: "driver" | "user";
  text: string;
  timestamp: string;
}

interface RideChatProps {
  bookingId: string;
  currentRole: ChatRole;
}

export function RideChat({ bookingId, currentRole }: RideChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // New States for explicit AI generation trigger
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiSender = currentRole === "driver" ? "driver" : "user";

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/chat/${bookingId}/get-all`);
      const mapped: ChatMessage[] =
        data?.messages?.map((msg: any) => ({
          id: msg._id,
          sender: msg.sender,
          text: msg.text,
          timestamp: formatTime(msg.createdAt),
        })) || [];
      setMessages(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Click handler to manually generate recommendations
  const handleGenerateSuggestions = async () => {
    if (!messages.length || generatingAI) return;
    
    const lastMessage = messages[messages.length - 1].text;
    if (!lastMessage?.trim()) return;

    try {
      setGeneratingAI(true);
      const { data } = await axios.post("/api/chat/ai-suggestions", {
        role: currentRole,
        lastMessage,
      });
      setSuggestions(data?.suggestions || []);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    } finally {
      setGeneratingAI(false);
    }
  };

  useEffect(() => {
    if (!bookingId) return;
    fetchMessages();
  }, [bookingId]);

  // Clears the old floating suggestions whenever a new message lands
  useEffect(() => {
    setSuggestions([]);
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (quickReply?: string) => {
    const messageText = (quickReply || inputMessage).trim();
    if (!messageText) return;

    try {
      setSending(true);
      const { data } = await axios.post("/api/chat/send", {
        bookingId,
        sender: apiSender,
        text: messageText,
      });

      if (data.success) {
        // setMessages((prev) => [
        //   ...prev,
        //   {
        //     id: data.message?._id || Date.now().toString(),
        //     sender: apiSender,
        //     text: messageText,
        //     timestamp: formatTime(data.message?.createdAt || new Date().toISOString()),
        //   },
        // ]);
        const socket = getSocket();
      socket.emit("chat-message", {
        bookingId,
        text: messageText,
        sender: apiSender,
      });
        setInputMessage("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };
  useEffect(() => {
    const socket = getSocket();
  
    socket.emit("join-ride", bookingId);
  
    return () => {
      socket.off("chat-message");
    };
  }, [bookingId]);
  useEffect(() => {
    const socket = getSocket();
  
    socket.on("chat-message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: data.sender,
          text: data.text,
          timestamp: formatTime(
            data.createdAt || new Date().toISOString()
          ),
        },
      ]);
    });
  
    return () => {
      socket.off("chat-message");
    };
  }, []);
  return (
    <div className="flex h-[500px] w-full flex-col rounded-2xl border border-[#bbf7d0] bg-white p-4 shadow-sm">
      {/* Header Panel */}
      <div className="mb-3 flex flex-none items-center gap-2 border-b border-[#ecfdf5] pb-3">
        <MessageCircle size={16} className="text-[#22c55e]" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">
          Ride Chat
        </h3>
        <span className="ml-auto rounded-full bg-[#f0fdf4] px-3 py-1 text-[10px] font-semibold text-[#16a34a]">
          AI Assistant Available
        </span>
      </div>

      {/* Messages Box Container */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-[#f8fffb] p-3 space-y-3">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Loading chat...
          </div>
        ) : messages.length ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === apiSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.sender === apiSender
                      ? "bg-[#22c55e] text-white"
                      : "bg-white border border-[#dcfce7] text-gray-800"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      msg.sender === apiSender ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No messages yet
          </div>
        )}
      </div>

      {/* AI Quick Reply Chips */}
      {suggestions.length > 0 && (
        <div className="flex flex-none flex-wrap gap-2 overflow-x-auto py-2">
          {suggestions.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(reply)}
              className="rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1 text-[11px] font-medium text-[#16a34a] whitespace-nowrap hover:bg-[#dcfce7]"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Action Tray Controls */}
      <div className="flex flex-none gap-2 pt-2">
        {/* Sparkle Action Trigger Button */}
        <button
          type="button"
          onClick={handleGenerateSuggestions}
          disabled={generatingAI || !messages.length}
          title="Suggest AI Replies"
          className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-3 text-[#16a34a] hover:bg-[#dcfce7] disabled:opacity-40 transition-colors flex items-center justify-center"
        >
          {generatingAI ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type message..."
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#22c55e] focus:outline-none"
        />
        
        <button
          onClick={() => handleSendMessage()}
          disabled={sending}
          className="rounded-xl bg-[#22c55e] px-4 py-2 text-white hover:bg-[#16a34a] disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}