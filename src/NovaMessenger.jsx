import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Search, Send, Paperclip, Image as ImageIcon, Smile, MoreVertical,
  Phone, Video, Check, CheckCheck, User, ArrowLeft, X, Sparkles,
  FileText, Download, MessageSquare, Mic, MicOff, Volume2, PhoneOff,
  VideoOff, Pin, Trash2, Heart, ThumbsUp, Flame, AlertCircle, Plus,
  Users, ChevronDown, CheckCircle, RefreshCw, Eye
} from "lucide-react";

const EMOJI_REACTIONS = ["❤️", "👍", "🔥", "😂", "🚀", "💡"];

export default function NovaMessenger({ currentUser, initialRecipient, onClose }) {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activeRecipient, setActiveRecipient] = useState(initialRecipient || null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState(null);

  // Audio Call / Video Call State
  const [activeCall, setActiveCall] = useState(null); // { type: 'audio'|'video', status: 'ringing'|'connected', duration: 0 }
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const callTimerRef = useRef(null);

  // Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // 1. Fetch Real Registered Users from user_profiles in Supabase
  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, email, full_name, avatar_url, plan, created_at")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Exclude current user from contact list
        const myEmail = currentUser?.email || "";
        const others = data.filter((u) => u.email !== myEmail);
        setRegisteredUsers(others);

        // If no active recipient and users exist, pick the first user
        if (!activeRecipient && others.length > 0) {
          setActiveRecipient(others[0]);
        }
      }
    } catch (err) {
      console.warn("Load registered users error:", err);
    }
  }, [currentUser, activeRecipient]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // If initialRecipient was provided from profile click
  useEffect(() => {
    if (initialRecipient && initialRecipient.email) {
      setActiveRecipient(initialRecipient);
    }
  }, [initialRecipient]);

  // 2. Fetch Real Messages for the active conversation
  const loadConversationMessages = useCallback(async () => {
    if (!activeRecipient || !activeRecipient.email) {
      setMessages([]);
      return;
    }
    const myEmail = currentUser?.email || "user@nova.ai";
    const otherEmail = activeRecipient.email;

    try {
      const { data, error } = await supabase
        .from("nova_messages")
        .select("*")
        .or(`and(sender_email.eq.${myEmail},recipient_email.eq.${otherEmail}),and(sender_email.eq.${otherEmail},recipient_email.eq.${myEmail})`)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.warn("Fetch messages error:", err);
    }
  }, [activeRecipient, currentUser]);

  useEffect(() => {
    loadConversationMessages();
    // Poll for real new messages every 3 seconds
    const interval = setInterval(loadConversationMessages, 3000);
    return () => clearInterval(interval);
  }, [loadConversationMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Real Message
  const handleSendMessage = async (customText = null, attachmentData = null) => {
    const text = customText || messageText.trim();
    if (!text && !attachmentData) return;
    if (!activeRecipient || !activeRecipient.email) {
      alert("Please select a recipient to message.");
      return;
    }

    const myEmail = currentUser?.email || "user@nova.ai";
    const myName = currentUser?.name || currentUser?.full_name || "Nova User";
    const myAvatar = currentUser?.avatar || null;

    const newMsg = {
      sender_email: myEmail,
      sender_name: myName,
      sender_avatar: myAvatar,
      recipient_email: activeRecipient.email,
      recipient_name: activeRecipient.full_name || activeRecipient.name || "Engineer",
      recipient_avatar: activeRecipient.avatar_url || activeRecipient.avatar || null,
      content: text || (attachmentData?.type === "voice" ? "🎤 Voice Note" : "📎 Attachment"),
      message_type: attachmentData ? attachmentData.type : "text",
      attachment_url: attachmentData ? attachmentData.url : null,
      attachment_name: attachmentData ? attachmentData.name : null,
      attachment_size: attachmentData ? attachmentData.size : null,
      reactions: [],
      is_read: false,
      created_at: new Date().toISOString()
    };

    // Optimistic UI Update
    setMessages((prev) => [...prev, { id: "temp_" + Date.now(), ...newMsg }]);
    setMessageText("");
    setShowEmojiPicker(false);

    try {
      await supabase.from("nova_messages").insert([newMsg]);
    } catch (err) {
      console.warn("Insert real message error:", err);
    }
  };

  // 4. Toggle Reaction on Message
  const handleToggleReaction = async (msgId, emoji) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;

    const cur = msg.reactions || [];
    const exists = cur.includes(emoji);
    const updated = exists ? cur.filter((r) => r !== emoji) : [...cur, emoji];

    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, reactions: updated } : m)));

    try {
      if (!String(msgId).startsWith("temp_")) {
        await supabase.from("nova_messages").update({ reactions: updated }).eq("id", msgId);
      }
    } catch (err) {}
  };

  // 5. Delete Message
  const handleDeleteMessage = async (msgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    try {
      if (!String(msgId).startsWith("temp_")) {
        await supabase.from("nova_messages").delete().eq("id", msgId);
      }
    } catch (err) {}
  };

  // 6. Voice Note Recording using Web Audio MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = (ev) => {
          handleSendMessage("🎤 Voice Note", {
            type: "voice",
            url: ev.target.result,
            name: `voice_note_${Date.now()}.webm`,
            size: `${(audioBlob.size / 1024).toFixed(1)} KB`
          });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordingDuration((p) => p + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access is required to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordTimerRef.current);
    }
  };

  // 7. File Attachment Upload
  const handleFileUpload = (e, isImage = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleSendMessage(isImage ? `Shared an image: ${file.name}` : `Shared a file: ${file.name}`, {
        type: isImage ? "image" : "file",
        url: ev.target.result,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 8. Call Handlers
  const startCall = (type) => {
    setActiveCall({ type, status: "ringing", duration: 0 });
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: "connected" } : null));
      callTimerRef.current = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    }, 2000);
  };

  const endCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setActiveCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const filteredUsers = registeredUsers.filter((u) => {
    const name = u.full_name || u.name || u.email || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-[250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex overflow-hidden font-sans relative">
        
        {/* ================= CALL SCREEN MODAL ================= */}
        {activeCall && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-8 text-white animate-in fade-in">
            <div className="text-center space-y-2 mt-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-4 border-white/20 shadow-2xl flex items-center justify-center text-3xl font-black mx-auto overflow-hidden">
                {activeRecipient?.avatar_url || activeRecipient?.avatar ? (
                  <img src={activeRecipient.avatar_url || activeRecipient.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (activeRecipient?.full_name || activeRecipient?.name || "U")[0].toUpperCase()
                )}
              </div>
              <h3 className="text-xl font-bold">{activeRecipient?.full_name || activeRecipient?.name || "Engineer"}</h3>
              <p className="text-xs text-blue-300 font-semibold tracking-wider uppercase">
                {activeCall.status === "ringing" ? `Ringing ${activeCall.type} call...` : `Active ${activeCall.type} call • ${formatDuration(activeCall.duration)}`}
              </p>
            </div>

            {/* Video preview simulation */}
            {activeCall.type === "video" && (
              <div className="w-full max-w-md h-48 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center text-slate-500 text-xs">
                {isVideoOff ? "Camera Muted" : "HD Video Connected"}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => setIsMuted((p) => !p)}
                className={`p-4 rounded-full transition-all ${isMuted ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {activeCall.type === "video" && (
                <button
                  type="button"
                  onClick={() => setIsVideoOff((p) => !p)}
                  className={`p-4 rounded-full transition-all ${isVideoOff ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                  title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>
              )}

              <button
                type="button"
                onClick={endCall}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl hover:scale-105 transition-all"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* ================= LEFT SIDEBAR: REAL CONTACTS LIST ================= */}
        <div className="w-80 sm:w-96 border-r border-slate-200 bg-slate-50/80 flex flex-col shrink-0">
          
          {/* Top User Bar */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (currentUser?.name || currentUser?.full_name || "D")[0].toUpperCase()
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 truncate max-w-[140px]">
                  {currentUser?.name || currentUser?.full_name || "My Chats"}
                </h3>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Now
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNewChatModal(true)}
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
              title="Start New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-white border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registered engineers..."
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full font-medium"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No registered engineers found.</p>
                <p className="mt-1 text-[11px]">When new users join Nova, they appear here automatically!</p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = activeRecipient?.email === u.email;
                const displayName = u.full_name || u.name || u.email.split("@")[0];
                return (
                  <button
                    key={u.id || u.email}
                    type="button"
                    onClick={() => setActiveRecipient(u)}
                    className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/80 border-l-4 border-blue-600" : "hover:bg-slate-100/70"}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden">
                        {u.avatar_url || u.avatar ? (
                          <img src={u.avatar_url || u.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          displayName[0].toUpperCase()
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {displayName}
                        </span>
                        {u.plan && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                            {u.plan}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate font-medium">
                        {u.email}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT MAIN CHAT PANE ================= */}
        <div className="flex-1 flex flex-col bg-[#fafbfc] relative">
          
          {/* Active Contact Header */}
          {activeRecipient ? (
            <div className="px-6 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between shadow-xs z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-sm flex items-center justify-center shadow-xs overflow-hidden">
                  {activeRecipient.avatar_url || activeRecipient.avatar ? (
                    <img src={activeRecipient.avatar_url || activeRecipient.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (activeRecipient.full_name || activeRecipient.name || activeRecipient.email || "E")[0].toUpperCase()
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {activeRecipient.full_name || activeRecipient.name || activeRecipient.email.split("@")[0]}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online • Real Direct Chat
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => startCall("audio")}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startCall("video")}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all ml-2 cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Select a conversation</span>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">No messages yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Send a message to start a real-time discussion with {activeRecipient?.full_name || activeRecipient?.name || "this engineer"}.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender_email === (currentUser?.email || "user@nova.ai");
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 group ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    {!isMine && (
                      <div className="w-7 h-7 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mb-1 overflow-hidden">
                        {msg.sender_avatar ? (
                          <img src={msg.sender_avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (msg.sender_name || "U")[0].toUpperCase()
                        )}
                      </div>
                    )}

                    <div className="relative max-w-[80%] sm:max-w-md">
                      <div
                        className={`px-4 py-2.5 rounded-2xl shadow-xs text-xs sm:text-sm font-medium leading-relaxed break-words ${isMine ? "bg-[#188bf6] text-white rounded-br-xs" : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"}`}
                      >
                        {/* Voice Note Player */}
                        {msg.message_type === "voice" && msg.attachment_url && (
                          <div className="mb-2 p-2 rounded-xl bg-black/10 flex items-center gap-2">
                            <Volume2 className="w-5 h-5 shrink-0" />
                            <audio controls src={msg.attachment_url} className="w-full h-8" />
                          </div>
                        )}

                        {/* Image Attachment */}
                        {msg.message_type === "image" && msg.attachment_url && (
                          <div className="mb-2">
                            <img src={msg.attachment_url} alt="" className="max-h-56 rounded-xl object-cover" />
                          </div>
                        )}

                        {/* File Attachment */}
                        {msg.message_type === "file" && msg.attachment_url && (
                          <div className="mb-2 flex items-center gap-2 p-2 rounded-xl bg-black/10">
                            <FileText className="w-5 h-5" />
                            <span className="text-xs font-bold truncate">{msg.attachment_name}</span>
                          </div>
                        )}

                        <p>{msg.content}</p>

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

                      {/* Reactions Badges */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="absolute -bottom-2 right-2 flex items-center bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow-xs text-xs">
                          {msg.reactions.map((r, i) => (
                            <span key={i}>{r}</span>
                          ))}
                        </div>
                      )}

                      {/* Hover Actions Toolbar */}
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
                        {isMine && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-slate-400 hover:text-rose-500 p-0.5 ml-1"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2">
            {/* Emoji Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((p) => !p)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
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

            {/* Document File Picker */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="Attach File"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(e, false)}
            />

            {/* Image Picker */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="Insert Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, true)}
            />

            {/* Voice Recorder */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-xl transition-all cursor-pointer ${isRecording ? "bg-rose-600 text-white animate-pulse" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
              title={isRecording ? `Recording (${recordingDuration}s)... Click to send` : "Record Voice Note"}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder={isRecording ? `Recording voice note (${recordingDuration}s)... Press mic again to send` : "Type a real message..."}
              className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium bg-slate-50/50"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!messageText.trim() && !isRecording}
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
