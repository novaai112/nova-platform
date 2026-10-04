import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Search, Send, Paperclip, Image as ImageIcon, Smile, MoreVertical,
  Phone, Video, Check, CheckCheck, User, ArrowLeft, X, Sparkles,
  FileText, Download, MessageSquare, Bot, Circle, ShieldCheck, Heart, ThumbsUp, Flame
} from "lucide-react";

const INITIAL_CONTACTS = [
  {
    id: "james_derrick",
    name: "James Derrick",
    email: "james.derrick@synopsys.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    role: "ADMIN",
    online: true,
    lastSeen: "Online",
    unread: 1,
    lastMessage: "Welcome to the Nova Community forum! Let me know if you need help with any simulation.",
    lastMessageTime: "10:30 AM"
  },
  {
    id: "nova_ai",
    name: "Nova AI Engineering Copilot",
    email: "ai@nova.platform",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=250",
    role: "AI BOT",
    online: true,
    lastSeen: "Always Active",
    unread: 0,
    lastMessage: "I can help you review ASME Section VIII calculations, nozzle FEA, or mesh configs.",
    lastMessageTime: "Yesterday"
  },
  {
    id: "marian_kuban",
    name: "Marian Kuban",
    email: "marian.kuban@ansys.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    role: "FEA SPECIALIST",
    online: false,
    lastSeen: "Last seen 2h ago",
    unread: 0,
    lastMessage: "The local PWHT analysis script has been updated with the latest ASME code formulas.",
    lastMessageTime: "Oct 4"
  },
  {
    id: "josh_mcleod",
    name: "Josh McLeod",
    email: "josh.mcleod@ansys.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    role: "MEMBER",
    online: true,
    lastSeen: "Online",
    unread: 0,
    lastMessage: "Have you tested the new CAD AI geometry feature yet?",
    lastMessageTime: "Oct 3"
  }
];

const EMOJI_REACTIONS = ["❤️", "👍", "🔥", "😂", "🚀", "💡"];

export default function NovaMessenger({ currentUser, initialRecipient, onClose }) {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [activeContact, setActiveContact] = useState(
    initialRecipient
      ? {
          id: initialRecipient.email || "recipient_" + Date.now(),
          name: initialRecipient.name || "Community Member",
          email: initialRecipient.email || "member@nova.ai",
          avatar: initialRecipient.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          role: initialRecipient.role || "MEMBER",
          online: true,
          lastSeen: "Online"
        }
      : INITIAL_CONTACTS[0]
  );
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // If initialRecipient was passed, ensure it is in the contacts list
  useEffect(() => {
    if (initialRecipient && initialRecipient.email) {
      const existing = contacts.find((c) => c.email === initialRecipient.email);
      if (!existing) {
        const newEntry = {
          id: initialRecipient.email,
          name: initialRecipient.name || "Community Member",
          email: initialRecipient.email,
          avatar: initialRecipient.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          role: initialRecipient.role || "MEMBER",
          online: true,
          lastSeen: "Online",
          unread: 0,
          lastMessage: "Start a conversation...",
          lastMessageTime: "Just now"
        };
        setContacts((prev) => [newEntry, ...prev]);
        setActiveContact(newEntry);
      } else {
        setActiveContact(existing);
      }
    }
  }, [initialRecipient]);

  // Load messages from Supabase or localStorage
  const loadMessages = useCallback(async () => {
    if (!activeContact) return;
    const myEmail = currentUser?.email || "user@nova.ai";
    const otherEmail = activeContact.email;

    try {
      const { data, error } = await supabase
        .from("nova_messages")
        .select("*")
        .or(`and(sender_email.eq.${myEmail},recipient_email.eq.${otherEmail}),and(sender_email.eq.${otherEmail},recipient_email.eq.${myEmail})`)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        setMessages(data);
      } else {
        // Fallback default conversation messages
        const localKey = `nova_chat_${myEmail}_${otherEmail}`;
        const saved = localStorage.getItem(localKey);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          const defaults = [
            {
              id: "msg_1",
              sender_email: otherEmail,
              sender_name: activeContact.name,
              sender_avatar: activeContact.avatar,
              recipient_email: myEmail,
              recipient_name: currentUser?.name || "You",
              content: `Hello! Thanks for reaching out. How can I assist you with your Nova engineering workflows today?`,
              created_at: new Date(Date.now() - 3600000).toISOString(),
              is_read: true,
              reactions: []
            }
          ];
          setMessages(defaults);
        }
      }
    } catch (err) {
      console.warn("Load messages err:", err);
    }
  }, [activeContact, currentUser]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Send Message
  const handleSendMessage = async (customContent = null, attachmentData = null) => {
    const text = customContent || messageText.trim();
    if (!text && !attachmentData) return;

    const myEmail = currentUser?.email || "user@nova.ai";
    const myName = currentUser?.name || "Nova User";
    const myAvatar = currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250";

    const newMsg = {
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      sender_email: myEmail,
      sender_name: myName,
      sender_avatar: myAvatar,
      recipient_email: activeContact.email,
      recipient_name: activeContact.name,
      recipient_avatar: activeContact.avatar,
      content: text,
      message_type: attachmentData ? attachmentData.type : "text",
      attachment_url: attachmentData ? attachmentData.url : null,
      attachment_name: attachmentData ? attachmentData.name : null,
      reactions: [],
      is_read: true,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageText("");
    setShowEmojiPicker(false);

    // Save to local cache
    const localKey = `nova_chat_${myEmail}_${activeContact.email}`;
    try {
      const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
      localStorage.setItem(localKey, JSON.stringify([...existing, newMsg]));
    } catch (e) {}

    // Save to Supabase
    try {
      await supabase.from("nova_messages").insert([newMsg]);
    } catch (err) {
      console.warn("Supabase message insert err:", err);
    }

    // Trigger realistic AI / bot reply if chatting with Nova AI or simulated engineer
    if (activeContact.id === "nova_ai" || activeContact.email.includes("synopsys")) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMsg = {
          id: "msg_reply_" + Date.now(),
          sender_email: activeContact.email,
          sender_name: activeContact.name,
          sender_avatar: activeContact.avatar,
          recipient_email: myEmail,
          recipient_name: myName,
          content: activeContact.id === "nova_ai"
            ? `I have analyzed your message regarding "${text.slice(0, 40)}...". All ASME Section VIII stress formulas and boundary conditions look verified!`
            : `Thanks for the message! I have received your request and will follow up with details shortly.`,
          created_at: new Date().toISOString(),
          is_read: true,
          reactions: ["👍"]
        };
        setMessages((prev) => [...prev, replyMsg]);
        try {
          const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
          localStorage.setItem(localKey, JSON.stringify([...existing, replyMsg]));
        } catch (e) {}
      }, 1500);
    }
  };

  // Add Reaction to a message
  const handleToggleReaction = (msgId, emoji) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const cur = m.reactions || [];
          const exists = cur.includes(emoji);
          const updated = exists ? cur.filter((r) => r !== emoji) : [...cur, emoji];
          return { ...m, reactions: updated };
        }
        return m;
      })
    );
  };

  // File / Image Attachment handler
  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const isImg = file.type.startsWith("image/");
      handleSendMessage(isImg ? `Shared an image: ${file.name}` : `Shared a document: ${file.name}`, {
        type: isImg ? "image" : "file",
        url: ev.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex overflow-hidden font-sans">
        
        {/* LEFT SIDEBAR: CHAT LIST (WHATSAPP / TELEGRAM STYLE) */}
        <div className="w-80 sm:w-96 border-r border-slate-200 bg-slate-50/80 flex flex-col shrink-0">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                  alt="My Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{currentUser?.name || "My Chats"}</h3>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all sm:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-white border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none w-full font-medium"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 text-xs font-bold text-slate-500">
            {["all", "unread", "engineers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "hover:bg-slate-200/70"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredContacts.map((contact) => {
              const isSelected = activeContact?.id === contact.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${isSelected ? "bg-blue-50/80 border-l-4 border-blue-600" : "hover:bg-slate-100/70"}`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {contact.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                        {contact.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate leading-relaxed">
                      {contact.lastMessage}
                    </p>
                  </div>

                  {contact.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#188bf6] text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm">
                      {contact.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT MAIN CHAT PANE */}
        <div className="flex-1 flex flex-col bg-[#efeae2]/30 bg-opacity-40 relative">
          
          {/* Active Contact Header */}
          <div className="px-6 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
                />
                {activeContact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{activeContact.name}</h3>
                  {activeContact.role && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black tracking-wider uppercase">
                      {activeContact.role}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {isTyping ? (
                    <span className="text-blue-600 font-bold animate-pulse">typing...</span>
                  ) : (
                    activeContact.lastSeen
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Calling ${activeContact.name}... (Simulated WebRTC Audio Call)`)}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Starting video call with ${activeContact.name}... (Simulated Video Call)`)}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all ml-2"
                title="Close Messenger"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {/* Date divider */}
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-slate-200/80 text-slate-600 text-[11px] font-bold shadow-xs">
                Today
              </span>
            </div>

            {messages.map((msg) => {
              const isMine = msg.sender_email === (currentUser?.email || "user@nova.ai");
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 group ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine && (
                    <img
                      src={msg.sender_avatar || activeContact.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover mb-1 shrink-0"
                    />
                  )}

                  <div className="relative max-w-[80%] sm:max-w-md">
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-sm text-xs sm:text-sm font-medium leading-relaxed break-words ${isMine ? "bg-[#188bf6] text-white rounded-br-xs" : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"}`}
                    >
                      {/* Attachment preview if any */}
                      {msg.attachment_url && (
                        <div className="mb-2">
                          {msg.message_type === "image" ? (
                            <img
                              src={msg.attachment_url}
                              alt=""
                              className="max-h-56 rounded-xl object-cover border border-white/20 shadow-sm"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/10">
                              <FileText className="w-5 h-5" />
                              <span className="text-xs font-bold truncate">{msg.attachment_name}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <p>{msg.content}</p>

                      {/* Message Footer: Timestamp and Read Check */}
                      <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isMine ? "text-blue-100" : "text-slate-400"}`}>
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        {isMine && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                      </div>
                    </div>

                    {/* Reactions pill */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="absolute -bottom-2 right-2 flex items-center bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow-sm text-xs">
                        {msg.reactions.map((r, i) => (
                          <span key={i}>{r}</span>
                        ))}
                      </div>
                    )}

                    {/* Hover Reaction Toolbar */}
                    <div className="absolute top-0 right-0 -mt-7 hidden group-hover:flex items-center bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-md gap-1 z-20">
                      {EMOJI_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform text-xs p-0.5"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2">
                <img src={activeContact.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2">
            {/* Emoji Picker Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((p) => !p)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                title="Emojis"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 grid grid-cols-6 gap-2 w-56 animate-in fade-in">
                  {EMOJI_REACTIONS.concat(["🎉", "✅", "⚡", "🧠", "🤔", "👏"]).map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        setMessageText((p) => p + e);
                        setShowEmojiPicker(false);
                      }}
                      className="text-xl hover:scale-125 transition-transform p-1"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              title="Attach File"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelected}
            />

            {/* Text Input Field */}
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder="Type a message... (Press Enter to send)"
              className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium bg-slate-50/50"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!messageText.trim()}
              className="p-2.5 bg-[#188bf6] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
