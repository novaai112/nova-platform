import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "./supabaseClient";
import { chatSounds } from "./chatSounds";
import VoiceNotePlayer from "./VoiceNotePlayer";
import {
  Search, Send, Paperclip, Image as ImageIcon, Smile, MoreVertical,
  Phone, Video, Check, CheckCheck, User, ArrowLeft, X, Sparkles,
  FileText, Download, MessageSquare, Mic, MicOff, Volume2, VolumeX,
  PhoneOff, VideoOff, Pin, Trash2, Heart, ThumbsUp, Flame, AlertCircle,
  Plus, Users, ChevronDown, CheckCircle, RefreshCw, Eye, EyeOff, Grip,
  Hash, Radio, Settings, UserPlus, LogOut, MessageSquarePlus, UserX,
  ChevronRight, Play, Square, Info, Shield, ShieldAlert, Sparkle,
  PhoneIncoming, PhoneMissed, Clock, Edit2, Sun, Moon, Lock, Unlock,
  CheckCheck as DoubleCheck, Zap, Award, ExternalLink, UserCheck,
  Maximize2, Minimize2, ScreenShare, ScreenShareOff, Share2, Star,
  Copy, Code, Palette, Volume1, Bell, BellOff, PhoneOutgoing,
  CornerUpLeft, CornerUpRight, ChevronUp, Pause
} from "lucide-react";

const WALLPAPER_PRESETS = [
  { id: "glass", name: "Cyber Glass", bgClass: "bg-slate-900/60 backdrop-blur-md", preview: "from-slate-900 to-indigo-950" },
  { id: "whatsapp", name: "WhatsApp Doodle", bgClass: "bg-[#0b141a]", preview: "from-emerald-950 to-slate-900" },
  { id: "telegram", name: "Telegram Starfield", bgClass: "bg-[#0f1926]", preview: "from-blue-950 to-slate-900" },
  { id: "instagram", name: "Instagram Sunset", bgClass: "bg-gradient-to-br from-slate-950 via-purple-950/50 to-pink-950/40", preview: "from-purple-900 via-pink-900 to-amber-900" },
  { id: "stealth", name: "AMOLED Stealth", bgClass: "bg-black", preview: "from-black to-slate-950" },
  { id: "emerald", name: "Emerald ASME", bgClass: "bg-gradient-to-b from-[#021814] to-[#042822]", preview: "from-emerald-950 to-teal-950" },
];

const WALLPAPER_STYLES = {
  glass: { id: "glass", name: "Cyber Glass", bgClass: "bg-slate-900/60 backdrop-blur-md" },
  whatsapp: { id: "whatsapp", name: "WhatsApp Classic", bgClass: "bg-[#0b141a]" },
  telegram: { id: "telegram", name: "Telegram Dark", bgClass: "bg-[#0f1926]" },
  instagram: { id: "instagram", name: "Instagram Glow", bgClass: "bg-gradient-to-br from-slate-950 via-purple-950/40 to-pink-950/30" },
  stealth: { id: "stealth", name: "AMOLED Stealth", bgClass: "bg-black" },
  emerald: { id: "emerald", name: "Emerald ASME", bgClass: "bg-gradient-to-b from-[#021814] to-[#042822]" },
};

const EMOJI_REACTIONS = ["❤️", "👍", "🔥", "😂", "🚀", "💡", "🎉", "👏"];

const EMOJI_CATEGORIES = {
  Smileys: ["😀","😃","😄","😁","😆","😅","😂","🤣","🥲","☺️","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🫣","🤭","🤫","🤥","😶","😐","😑","😬","🫠","🙄","😯","😦","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤠","😈","👿","💩","👻","💀","👽","🤖","🎃"],
  Gestures: ["👋","🤚","🖐","✋","🖖","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💪","👀","🧠"],
  Animals: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐴","🦄","🐝","🐛","🦋","🐙","🐬","🐳","🦈","🐊","🐘","🦒","🐕"],
  Food: ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍒","🍑","🍍","🥥","🥝","🍅","🥑","🥦","🌽","🥕","🍞","🥐","🧀","🍳","🥓","🥩","🍗","🍔","🍟","🍕","🥪","🌮","🍜","🍣","🍿","🍩","🍪","🍫","☕️","🧃","🍺","🥂"],
  Hearts: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝"]
};

const STICKER_PACKS = [
  { id: "s1", name: "Party", url: "https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif" },
  { id: "s2", name: "Cry", url: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" },
  { id: "s3", name: "Rage", url: "https://media.giphy.com/media/11tTNkNy1SdXGg/giphy.gif" },
  { id: "s4", name: "Love", url: "https://media.giphy.com/media/xT0xeQ1ZUQ0lvz2HXy/giphy.gif" },
  { id: "s5", name: "Wow", url: "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif" },
  { id: "s6", name: "Confused", url: "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif" },
  { id: "s7", name: "Laugh", url: "https://media.giphy.com/media/26n6WywJyh39n1pSp/giphy.gif" },
  { id: "s8", name: "Sleepy", url: "https://media.giphy.com/media/3o6UB5RrlQuMfZp82Y/giphy.gif" },
];

export default function NovaMessenger({ currentUser, initialRecipient, onClose }) {
  const myEmail = currentUser?.email || "user@nova.ai";
  const myName = currentUser?.name || currentUser?.full_name || myEmail.split("@")[0];
  const myAvatar = currentUser?.avatar || currentUser?.avatar_url || null;
  const myUserId = currentUser?.id || "00000000-0000-0000-0000-000000000000";

  // Light Mode (White background) by default; toggleable to Deep Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("nova_messenger_dark") === "true";
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("nova_messenger_dark", String(next));
      return next;
    });
  };

  // Instant In-Memory Cache Init for 0ms First Render
  const [conversations, setConversations] = useState(() => {
    try {
      const cached = localStorage.getItem(`nova_conv_cache_${myUserId}`);
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeConvId, setActiveConvId] = useState(() => {
    if (initialRecipient?.email) {
      return `user_${initialRecipient.id || initialRecipient.email}`;
    }
    return null;
  });
  const [activeConv, setActiveConv] = useState(() => {
    if (initialRecipient?.email) {
      const u = initialRecipient;
      const partnerName = u.full_name || u.display_name || u.name || u.email.split("@")[0];
      const realAvatar = u.avatar_url || u.avatar || null;
      return {
        id: `user_${u.id || u.email}`,
        conv_id: null,
        type: "dm",
        name: partnerName,
        email: u.email,
        avatar: realAvatar,
        avatar_url: realAvatar,
        wallpaper_url: null,
        is_request: false,
        request_status: "accepted",
        created_by: myUserId,
        lastMessage: "Start a conversation",
        lastTime: "",
        lastRawTime: new Date().toISOString(),
        unread: 0,
        otherUser: { ...u, avatar_url: realAvatar, avatar: realAvatar }
      };
    }
    return null;
  });
  const [activeRecipient, setActiveRecipient] = useState(initialRecipient || null);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const cached = localStorage.getItem("nova_registered_users_cache");
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  // Master user dictionary mapping user_id, id, and email to full user profile
  const [masterUserDict, setMasterUserDict] = useState({});

  // Profile Popover Modal state for "Profile tap to see"
  const [inspectingProfile, setInspectingProfile] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const [requestsSubTab, setRequestsSubTab] = useState("received"); // "received" | "sent"
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearchText, setChatSearchText] = useState("");

  // Modals & Panels
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showSendRequestModal, setShowSendRequestModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState("");

  // Messages & Reactions State
  const [messages, setMessages] = useState(() => {
    if (initialRecipient?.email) {
      try {
        const convId = `user_${initialRecipient.id || initialRecipient.email}`;
        const cached = localStorage.getItem(`nova_msg_cache_${convId}`);
        return cached ? JSON.parse(cached) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [messageText, setMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [viewOnceMode, setViewOnceMode] = useState(false);
  const [secureLightboxMsg, setSecureLightboxMsg] = useState(null);
  const [pendingAttachments, setPendingAttachments] = useState([]);

  // Voice Note Recording
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const voiceChunksRef = useRef([]);
  const voiceTimerRef = useRef(null);

  // WebRTC & Audio/Video Call Screen State
  const [activeCall, setActiveCall] = useState(null);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoCameraOn, setIsVideoCameraOn] = useState(true);
  const [isCallRecording, setIsCallRecording] = useState(false);
  const [showCallKeypad, setShowCallKeypad] = useState(false);
  const [videoUpgradeRequested, setVideoUpgradeRequested] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => chatSounds.isSoundEnabled());

  // Call History State
  const [callHistory, setCallHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`nova_call_history_${myUserId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [callsFilter, setCallsFilter] = useState("all"); // "all" | "missed"

  // Starred / Saved Messages State
  const [starredMessageIds, setStarredMessageIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`nova_starred_msgs_${myUserId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) { return new Set(); }
  });
  const [showStarredModal, setShowStarredModal] = useState(false);

  // Message Actions: Forwarding & Editing
  const [forwardingMessage, setForwardingMessage] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState("");

  // Desktop Windows-Style Context Menu & Chat Pinning/Muting
  const [contextMenu, setContextMenu] = useState(null);
  const [pinnedConvIds, setPinnedConvIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`nova_pinned_convs_${myUserId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) { return new Set(); }
  });
  const [mutedConvIds, setMutedConvIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`nova_muted_convs_${myUserId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) { return new Set(); }
  });
  const [messageInfoModal, setMessageInfoModal] = useState(null);

  // 3-Panel Layout & Shared Media Information State
  const [showChatInfoPanel, setShowChatInfoPanel] = useState(false);
  const [infoTab, setInfoTab] = useState("media"); // "media" | "files" | "links" | "voice"
  const [activeMediaViewer, setActiveMediaViewer] = useState(null);
  const [isNetworkOnline, setIsNetworkOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => { setIsNetworkOnline(true); showToast("🟢 Connected to network"); };
    const handleOffline = () => { setIsNetworkOnline(false); showToast("⚠️ Network offline - reconnecting..."); };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Wallpapers & Themes
  const [chatWallpaper, setChatWallpaper] = useState(() => {
    try {
      return localStorage.getItem("nova_chat_wallpaper") || "glass";
    } catch (e) { return "glass"; }
  });
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);

  // Rich Code Snippet & ASME Material Modals
  const [showCodeSnippetModal, setShowCodeSnippetModal] = useState(false);
  const [snippetCode, setSnippetCode] = useState("");
  const [snippetLang, setSnippetLang] = useState("python");
  const [showMaterialShareModal, setShowMaterialShareModal] = useState(false);

  // Toast feedback notifications
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Group Create State
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [groupWallpaper, setGroupWallpaper] = useState("");

  // User Blocks & Nicknames
  const [isTargetBlocked, setIsTargetBlocked] = useState(false);
  const [hasBlockedTarget, setHasBlockedTarget] = useState(false);
  const [customNickname, setCustomNickname] = useState("");

  // Refs for Performance, WebRTC, and Audio Ringtone
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const callTimerRef = useRef(null);
  const callRecRef = useRef(null);
  const callRecChunks = useRef([]);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const rtcChannelRef = useRef(null);
  const presenceChannelRef = useRef(null);
  const ringAudioRef = useRef(null);
  const localBcRef = useRef(null);

  // Comprehensive user map resolving real avatars, full names, and roles
  const userMap = useMemo(() => {
    const map = { ...masterUserDict };
    (registeredUsers || []).forEach((u) => {
      if (u.id) map[u.id] = { ...map[u.id], ...u };
      if (u.user_id) map[u.user_id] = { ...map[u.user_id], ...u };
      if (u.email) map[u.email.toLowerCase()] = { ...map[u.email.toLowerCase()], ...u };
    });
    if (currentUser) {
      const cur = {
        id: currentUser.id,
        user_id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.name || currentUser.full_name || myName,
        display_name: currentUser.name || currentUser.full_name || myName,
        avatar_url: currentUser.avatar || currentUser.avatar_url || myAvatar,
        avatar: currentUser.avatar || currentUser.avatar_url || myAvatar,
        plan: currentUser.plan || "Free"
      };
      if (currentUser.id) map[currentUser.id] = { ...map[currentUser.id], ...cur };
      if (currentUser.email) map[currentUser.email.toLowerCase()] = { ...map[currentUser.email.toLowerCase()], ...cur };
    }
    return map;
  }, [masterUserDict, registeredUsers, currentUser, myName, myAvatar]);

  // Request lists & counts - strictly ONLY genuine pending requests
  const incomingRequests = useMemo(() => {
    return conversations.filter(
      (c) => c.is_request && c.request_status === "pending" && c.created_by !== myUserId
    );
  }, [conversations, myUserId]);

  const outgoingRequests = useMemo(() => {
    return conversations.filter(
      (c) => c.is_request && c.request_status === "pending" && c.created_by === myUserId
    );
  }, [conversations, myUserId]);

  const pendingRequestsCount = incomingRequests.length;

  // Request & Acceptance status calculation for active chat
  const isPendingRequestForMe = Boolean(
    activeConv?.is_request && activeConv?.request_status === "pending" && activeConv?.created_by !== myUserId
  );
  const isPendingRequestByMe = Boolean(
    activeConv?.is_request && activeConv?.request_status === "pending" && activeConv?.created_by === myUserId
  );
  const canCallAndSend = !activeConv?.is_request || (!isPendingRequestForMe && !isPendingRequestByMe);

  // Filtered Shared Media for 3-Panel Info View
  const sharedMedia = useMemo(() => {
    return (messages || []).filter((m) => !m.is_deleted && (m.media_type === "image" || m.media_type === "video" || (m.media_url && String(m.media_url).match(/\.(jpeg|jpg|gif|png|webp|mp4|webm)$/i))));
  }, [messages]);

  const sharedFiles = useMemo(() => {
    return (messages || []).filter((m) => !m.is_deleted && (m.media_type === "file" || m.media_type === "code" || m.media_type === "material" || (m.media_url && !String(m.media_type).match(/(image|video|voice)/))));
  }, [messages]);

  const sharedVoice = useMemo(() => {
    return (messages || []).filter((m) => !m.is_deleted && (m.media_type === "voice" || m.content === "🎤 Voice Note"));
  }, [messages]);

  const sharedLinks = useMemo(() => {
    const list = [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    (messages || []).forEach((m) => {
      if (m.content && !m.is_deleted) {
        const matches = m.content.match(urlRegex);
        if (matches) {
          matches.forEach((url) => list.push({ url, created_at: m.created_at, sender_email: m.sender_email }));
        }
      }
    });
    return list;
  }, [messages]);

  // Dynamic Theme Colors: Clean White Light Mode (Default) / Deep Dark Mode
  const theme = {
    bg: isDarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900",
    modalBorder: isDarkMode ? "border-slate-800" : "border-slate-200",
    sidebarBg: isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
    chatBg: isDarkMode ? "bg-slate-950" : "bg-white",
    headerBg: isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
    cardBg: isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
    hoverBg: isDarkMode ? "hover:bg-slate-800/80" : "hover:bg-slate-100",
    activeConvBg: isDarkMode ? "bg-blue-600/25 border-l-4 border-blue-500" : "bg-blue-50 border-l-4 border-blue-600",
    inputBg: isDarkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400",
    secondaryText: isDarkMode ? "text-slate-400" : "text-slate-600",
    iconBtn: isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900",
    incomingBubble: isDarkMode
      ? "bg-slate-900/95 text-slate-50 border border-slate-700/80 shadow-md backdrop-blur-md"
      : "bg-white/95 text-slate-900 border border-slate-300 shadow-md backdrop-blur-md",
    outgoingBubble: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-400/40",
  };

  // Web Audio Ringtone Chimes & Sound Effects for Calls & Chat
  const startRingTone = (isIncoming = false) => {
    if (isIncoming) {
      chatSounds.startIncomingRing();
    } else {
      chatSounds.startOutgoingRing();
    }
  };

  const stopRingTone = () => {
    chatSounds.stopRinging();
  };

  const toggleSoundEffects = () => {
    const next = chatSounds.toggleSound();
    setSoundEnabled(next);
    showToast(next ? "🔊 Sound effects enabled" : "🔇 Sound effects muted");
  };

  // Helper to open real user profile modal with live database stats and deep URL
  const openUserProfile = async (user) => {
    if (!user) return;
    const key = user.user_id || user.id || user.email?.toLowerCase();
    const resolved = userMap[key] || user;
    setInspectingProfile(resolved);
    try {
      const idParam = resolved.user_id || resolved.id || resolved.email;
      if (idParam) {
        window.history.pushState({ view: 'chat', inspectingUser: idParam }, '', `/chat/user/${encodeURIComponent(idParam)}`);
      }
    } catch (e) {}

    if (resolved.email) {
      try {
        const [postsRes, cmtsRes] = await Promise.all([
          supabase.from("nova_community_posts").select("id", { count: "exact" }).eq("user_email", resolved.email),
          supabase.from("nova_community_comments").select("id", { count: "exact" }).eq("user_email", resolved.email)
        ]);
        setInspectingProfile((prev) => {
          if (!prev || prev.email?.toLowerCase() !== resolved.email?.toLowerCase()) return prev;
          return {
            ...prev,
            discussionsCount: postsRes.count || 0,
            commentsCount: cmtsRes.count || 0
          };
        });
      } catch (e) {}
    }
  };

  const closeUserProfile = () => {
    setInspectingProfile(null);
    try {
      if (activeConv?.email) {
        window.history.pushState({ view: 'chat', recipient: activeConv.email }, '', `/chat?user=${encodeURIComponent(activeConv.email)}`);
      } else {
        window.history.pushState({ view: 'chat' }, '', '/chat');
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handleMessengerPopState = () => {
      const path = window.location.pathname.replace(/\/+$/, '');
      if (path.startsWith('/chat/user/')) {
        const uid = path.split('/chat/user/')[1]?.split('/')[0];
        if (uid && userMap[uid]) {
          setInspectingProfile(userMap[uid]);
        }
      } else {
        setInspectingProfile(null);
      }
    };
    window.addEventListener('popstate', handleMessengerPopState);
    return () => window.removeEventListener('popstate', handleMessengerPopState);
  }, [userMap]);

  // =========================================================================
  // 1. FAST REGISTERED USERS LOAD & CACHING WITH REAL AVATARS
  // =========================================================================
  const loadRegisteredUsers = useCallback(async () => {
    try {
      const dict = {};

      // Pre-seed core verified users so they are always visible even before network calls resolve
      const defaultUsers = [
        {
          id: "11111111-2708-4000-8000-000000000001",
          user_id: "11111111-2708-4000-8000-000000000001",
          email: "alphasquad2708@gmail.com",
          full_name: "Alpha Squad",
          display_name: "Alpha Squad",
          username: "alphasquad",
          avatar_url: null,
          avatar: null,
          plan: "Max",
          company: "Nova AI Engineering",
          created_at: "2026-01-01T00:00:00.000Z"
        },
        {
          id: "22222222-6203-4000-8000-000000000002",
          user_id: "22222222-6203-4000-8000-000000000002",
          email: "rayraunak19@gmail.com",
          full_name: "Raunak Ray",
          display_name: "Raunak Ray",
          username: "rayraunak",
          avatar_url: null,
          avatar: null,
          plan: "Max",
          company: "Nova AI Technologies",
          created_at: "2026-01-01T00:00:00.000Z"
        },
        {
          id: "33333333-2729-4000-8000-000000000003",
          user_id: "33333333-2729-4000-8000-000000000003",
          email: "dineshkumar2729304@gmail.com",
          full_name: "Dinesh Kumar Yadav",
          display_name: "Dinesh Kumar Yadav",
          username: "dineshkumar",
          avatar_url: null,
          avatar: null,
          plan: "Max",
          company: "Lead ASME FEA Specialist",
          created_at: "2026-01-01T00:00:00.000Z"
        }
      ];
      defaultUsers.forEach((u) => {
        dict[u.id] = u;
        dict[u.email.toLowerCase()] = u;
      });

      const [usersRes, profsRes] = await Promise.all([
        supabase.from("user_profiles").select("id, email, full_name, avatar_url, plan, company, created_at").order("created_at", { ascending: false }),
        supabase.from("profiles").select("user_id, display_name, email, avatar_url, username, created_at")
      ]);

      // 1. Map all records from profiles
      (profsRes.data || []).forEach((p) => {
        const emailKey = p.email?.toLowerCase();
        const idKey = p.user_id;
        const item = {
          id: p.user_id,
          user_id: p.user_id,
          email: p.email,
          full_name: p.display_name || p.username || (p.email ? p.email.split("@")[0] : "Engineer"),
          display_name: p.display_name || p.username || (p.email ? p.email.split("@")[0] : "Engineer"),
          username: p.username || (p.email ? p.email.split("@")[0] : "engineer"),
          avatar_url: p.avatar_url || null,
          avatar: p.avatar_url || null,
          plan: "Free",
          created_at: p.created_at || new Date().toISOString()
        };
        if (idKey) dict[idKey] = { ...(dict[idKey] || {}), ...item };
        if (emailKey) dict[emailKey] = { ...(dict[emailKey] || {}), ...item };
      });

      // 2. Merge and enrich with user_profiles
      (usersRes.data || []).forEach((u) => {
        const emailKey = u.email?.toLowerCase();
        const idKey = u.id;
        const existing = (idKey && dict[idKey]) || (emailKey && dict[emailKey]) || {};
        const realAv = u.avatar_url || existing.avatar_url || null;
        const merged = {
          ...existing,
          id: u.id || existing.id,
          user_id: u.id || existing.user_id,
          email: u.email || existing.email,
          full_name: u.full_name || existing.full_name || (u.email ? u.email.split("@")[0] : "Engineer"),
          display_name: u.full_name || existing.display_name || (u.email ? u.email.split("@")[0] : "Engineer"),
          avatar_url: realAv,
          avatar: realAv,
          plan: u.plan || existing.plan || "Free",
          company: u.company || existing.company || "Nova Engineering",
          created_at: u.created_at || existing.created_at
        };
        if (idKey) dict[idKey] = merged;
        if (emailKey) dict[emailKey] = merged;
      });

      setMasterUserDict(dict);

      const uniqueList = [];
      const seen = new Set();
      Object.values(dict).forEach((item) => {
        const mail = item.email?.toLowerCase();
        if (mail && !seen.has(mail)) {
          seen.add(mail);
          if (mail !== myEmail.toLowerCase()) {
            uniqueList.push(item);
          }
        }
      });

      setRegisteredUsers(uniqueList);
      try { localStorage.setItem("nova_registered_users_cache", JSON.stringify(uniqueList)); } catch (e) {}

      // Update conversations with fresh resolved avatars
      setConversations((prev) =>
        prev.map((c) => {
          const pKey = c.otherUser?.user_id || c.otherUser?.id || c.email?.toLowerCase();
          const resolved = pKey ? dict[pKey] : null;
          if (resolved) {
            const realAv = resolved.avatar_url || c.avatar;
            const realNm = c.type === "group" ? c.name : (resolved.full_name || c.name);
            return {
              ...c,
              name: realNm,
              avatar: realAv,
              avatar_url: realAv,
              otherUser: { ...c.otherUser, ...resolved, avatar_url: realAv, avatar: realAv }
            };
          }
          return c;
        })
      );

      // Update active recipient if currently viewing
      setActiveRecipient((prev) => {
        if (!prev) return prev;
        const pKey = prev.user_id || prev.id || prev.email?.toLowerCase();
        const resolved = pKey ? dict[pKey] : null;
        return resolved ? { ...prev, ...resolved, avatar_url: resolved.avatar_url || prev.avatar_url, avatar: resolved.avatar_url || prev.avatar } : prev;
      });
    } catch (err) {
      console.warn("Load users fallback warning:", err);
      const fallbackList = [
        {
          id: "11111111-2708-4000-8000-000000000001",
          user_id: "11111111-2708-4000-8000-000000000001",
          email: "alphasquad2708@gmail.com",
          full_name: "Alpha Squad",
          display_name: "Alpha Squad",
          plan: "Max",
          company: "Nova AI Engineering"
        },
        {
          id: "22222222-6203-4000-8000-000000000002",
          user_id: "22222222-6203-4000-8000-000000000002",
          email: "rayraunak19@gmail.com",
          full_name: "Raunak Ray",
          display_name: "Raunak Ray",
          plan: "Max",
          company: "Nova AI Technologies"
        }
      ].filter(u => u.email.toLowerCase() !== myEmail.toLowerCase());
      setRegisteredUsers(fallbackList);
    }
  }, [myEmail]);

  useEffect(() => {
    loadRegisteredUsers();
  }, [loadRegisteredUsers]);

  // =========================================================================
  // 2. REAL-TIME PRESENCE (LIGHTNING FAST)
  // =========================================================================
  useEffect(() => {
    if (!myEmail) return;
    const channelName = "presence-chat-global-v1";
    const ch = supabase.channel(channelName, {
      config: { presence: { key: myEmail.toLowerCase() } },
    });

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      setOnlineUsers(new Set(Object.keys(state).map((k) => k.toLowerCase())));
    })
      .on("presence", { event: "join" }, ({ key }) => {
        setOnlineUsers((prev) => new Set([...prev, key.toLowerCase()]));
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(key.toLowerCase());
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await ch.track({ email: myEmail.toLowerCase(), online_at: new Date().toISOString() });
        }
      });

    presenceChannelRef.current = ch;
    return () => {
      supabase.removeChannel(ch);
    };
  }, [myEmail]);

  // =========================================================================
  // 3. FAST BATCH CONVERSATIONS LOADER & CACHING
  // =========================================================================
  const loadConversations = useCallback(async () => {
    try {
      // 0ms Instant synchronous population from local registered users and initialRecipient
      const initialConvs = [];
      const initSeen = new Set();
      if (initialRecipient?.email) {
        const initEmail = initialRecipient.email.toLowerCase();
        initSeen.add(initEmail);
        const partnerName = initialRecipient.full_name || initialRecipient.display_name || initEmail.split("@")[0];
        initialConvs.push({
          id: `user_${initialRecipient.id || initEmail}`,
          conv_id: null,
          type: "dm",
          name: partnerName,
          email: initialRecipient.email,
          avatar: initialRecipient.avatar_url || initialRecipient.avatar || null,
          avatar_url: initialRecipient.avatar_url || initialRecipient.avatar || null,
          wallpaper_url: null,
          is_request: false,
          request_status: "accepted",
          created_by: myUserId,
          lastMessage: "Start a conversation",
          lastTime: "",
          lastRawTime: new Date().toISOString(),
          unread: 0,
          otherUser: { ...initialRecipient, avatar_url: initialRecipient.avatar_url || initialRecipient.avatar || null }
        });
      }
      (registeredUsers || []).forEach((u) => {
        if (!u.email || u.email.toLowerCase() === myEmail.toLowerCase()) return;
        const uEmail = u.email.toLowerCase();
        if (!initSeen.has(uEmail)) {
          initSeen.add(uEmail);
          const partnerName = u.full_name || u.display_name || uEmail.split("@")[0];
          initialConvs.push({
            id: `user_${u.id || uEmail}`,
            conv_id: null,
            type: "dm",
            name: partnerName,
            email: u.email,
            avatar: u.avatar_url || u.avatar || null,
            avatar_url: u.avatar_url || u.avatar || null,
            wallpaper_url: null,
            is_request: false,
            request_status: "accepted",
            created_by: myUserId,
            lastMessage: "Start a conversation",
            lastTime: "",
            lastRawTime: "2020-01-01T00:00:00.000Z",
            unread: 0,
            otherUser: { ...u }
          });
        }
      });
      if (initialConvs.length > 0) {
        setConversations((prev) => (prev.length === 0 ? initialConvs : prev));
        if (!activeConvId) {
          if (initialRecipient?.email) {
            const m = initialConvs.find(c => c.email?.toLowerCase() === initialRecipient.email.toLowerCase());
            if (m) selectConversation(m);
            else selectConversation(initialConvs[0]);
          } else {
            selectConversation(initialConvs[0]);
          }
        }
      }

      const { data: participations } = await supabase
        .from("conversation_participants")
        .select("conversation_id, last_read_at")
        .eq("user_id", myUserId);

      const convIds = (participations || []).map((p) => p.conversation_id);

      let dbConvs = [];
      let lastMsgMap = {};
      let dmPartnerMap = {};

      if (convIds.length > 0) {
        const [convsRes, msgsRes, partsRes] = await Promise.all([
          supabase.from("conversations").select("*").in("id", convIds).order("updated_at", { ascending: false }),
          supabase.from("messages").select("conversation_id, content, media_type, media_metadata, created_at, user_id").in("conversation_id", convIds).order("created_at", { ascending: false }),
          supabase.from("conversation_participants").select("conversation_id, user_id").in("conversation_id", convIds).neq("user_id", myUserId)
        ]);

        dbConvs = convsRes.data || [];

        (msgsRes.data || []).forEach((m) => {
          if (!lastMsgMap[m.conversation_id]) lastMsgMap[m.conversation_id] = m;
        });

        const otherUserIds = [...new Set((partsRes.data || []).map((p) => p.user_id))];
        if (otherUserIds.length > 0) {
          const [profsRes, userProfsRes] = await Promise.all([
            supabase.from("profiles").select("user_id, display_name, avatar_url, email, username").in("user_id", otherUserIds),
            supabase.from("user_profiles").select("id, full_name, avatar_url, email, plan, created_at").in("id", otherUserIds)
          ]);

          const pMap = {};
          (profsRes.data || []).forEach((p) => { pMap[p.user_id] = p; });
          (userProfsRes.data || []).forEach((u) => {
            const existing = pMap[u.id] || {};
            pMap[u.id] = {
              user_id: u.id,
              display_name: u.full_name || existing.display_name || u.email?.split("@")[0],
              avatar_url: u.avatar_url || existing.avatar_url || null,
              email: u.email || existing.email,
              plan: u.plan || "Pro",
              created_at: u.created_at
            };
          });

          (partsRes.data || []).forEach((p) => {
            dmPartnerMap[p.conversation_id] = pMap[p.user_id] || userMap[p.user_id] || { user_id: p.user_id, display_name: "Engineer", email: "engineer@nova.ai" };
          });
        }
      }

      // Legacy fallback
      const { data: directMsgs } = await supabase
        .from("nova_messages")
        .select("*")
        .or(`sender_email.eq.${myEmail},recipient_email.eq.${myEmail}`)
        .order("created_at", { ascending: false });

      let convList = [];
      const seenEmails = new Set();

      dbConvs.forEach((c) => {
        const other = c.type === "dm" ? dmPartnerMap[c.id] : null;
        const lastM = lastMsgMap[c.id];
        const partnerProfile = other ? (userMap[other.user_id] || userMap[other.email?.toLowerCase()] || other) : null;

        const title = c.type === "group" ? (c.name || "Group") : (partnerProfile?.full_name || partnerProfile?.display_name || partnerProfile?.username || "Direct Chat");
        const email = partnerProfile?.email || other?.email || null;
        if (email) seenEmails.add(email.toLowerCase());

        let lastPreview = "No messages yet";
        if (lastM) {
          const meta = typeof lastM.media_metadata === "string" ? (() => { try { return JSON.parse(lastM.media_metadata); } catch(e) { return {}; } })() : (lastM.media_metadata || {});
          if (lastM.media_type === "image") {
            lastPreview = `📷 ${meta.name || "Photo"}`;
          } else if (lastM.media_type === "file") {
            lastPreview = `📎 ${meta.name || "Document"}`;
          } else if (lastM.media_type === "voice") {
            lastPreview = `🎤 Voice Note`;
          } else if (lastM.media_type === "gif") {
            lastPreview = `✨ GIF`;
          } else {
            lastPreview = lastM.content || "Message";
          }
        }

        const realAvatar = c.type === "group" ? c.avatar_url : (partnerProfile?.avatar_url || partnerProfile?.avatar || other?.avatar_url || null);

        convList.push({
          id: c.id,
          conv_id: c.id,
          type: c.type,
          name: title,
          email: email,
          avatar: realAvatar,
          avatar_url: realAvatar,
          wallpaper_url: c.wallpaper_url || null,
          is_request: !!c.is_request,
          request_status: c.request_status || (c.is_request ? "pending" : "accepted"),
          created_by: c.created_by,
          lastMessage: lastPreview,
          lastTime: lastM?.created_at ? new Date(lastM.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
          lastRawTime: lastM?.created_at || c.updated_at || c.created_at,
          unread: 0,
          otherUser: { ...other, ...partnerProfile, avatar_url: realAvatar, avatar: realAvatar }
        });
      });

      (directMsgs || []).forEach((msg) => {
        const isMine = msg.sender_email === myEmail;
        const partnerEmail = (isMine ? msg.recipient_email : msg.sender_email)?.toLowerCase();
        if (partnerEmail && !seenEmails.has(partnerEmail)) {
          seenEmails.add(partnerEmail);
          const partnerProfile = userMap[partnerEmail] || {};
          const partnerName = partnerProfile.full_name || (isMine ? msg.recipient_name : msg.sender_name) || partnerEmail.split("@")[0];
          const partnerAvatar = partnerProfile.avatar_url || (isMine ? msg.recipient_avatar : msg.sender_avatar) || null;

          convList.push({
            id: `legacy_${partnerEmail}`,
            conv_id: null,
            type: "dm",
            name: partnerName,
            email: partnerEmail,
            avatar: partnerAvatar,
            avatar_url: partnerAvatar,
            wallpaper_url: null,
            is_request: false,
            request_status: "accepted",
            created_by: null,
            lastMessage: msg.content || "Attachment",
            lastTime: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            lastRawTime: msg.created_at,
            unread: !isMine && !msg.is_read ? 1 : 0,
            otherUser: { email: partnerEmail, display_name: partnerName, full_name: partnerName, avatar_url: partnerAvatar, avatar: partnerAvatar }
          });
        }
      });

      // If initialRecipient was explicitly passed from user action and not yet in list, add as active DM
      if (initialRecipient?.email) {
        const initEmail = initialRecipient.email.toLowerCase();
        if (!seenEmails.has(initEmail)) {
          seenEmails.add(initEmail);
          const u = initialRecipient;
          const realAvatar = u.avatar_url || u.avatar || null;
          const partnerName = u.full_name || u.display_name || initEmail.split("@")[0];
          convList.unshift({
            id: `user_${u.id || u.email}`,
            conv_id: null,
            type: "dm",
            name: partnerName,
            email: u.email,
            avatar: realAvatar,
            avatar_url: realAvatar,
            wallpaper_url: null,
            is_request: false,
            request_status: "not_started",
            created_by: myUserId,
            lastMessage: "Start a conversation",
            lastTime: "",
            lastRawTime: new Date().toISOString(),
            unread: 0,
            otherUser: { ...u, avatar_url: realAvatar, avatar: realAvatar }
          });
        }
      }

      // Ensure all registered engineers are available to chat with
      (registeredUsers || []).forEach((u) => {
        if (!u.email || u.email.toLowerCase() === myEmail.toLowerCase()) return;
        const uEmail = u.email.toLowerCase();
        if (!seenEmails.has(uEmail)) {
          seenEmails.add(uEmail);
          const realAvatar = u.avatar_url || u.avatar || null;
          const partnerName = u.full_name || u.display_name || uEmail.split("@")[0];
          convList.push({
            id: `user_${u.id || uEmail}`,
            conv_id: null,
            type: "dm",
            name: partnerName,
            email: u.email,
            avatar: realAvatar,
            avatar_url: realAvatar,
            wallpaper_url: null,
            is_request: false,
            request_status: "accepted",
            created_by: myUserId,
            lastMessage: "Start a conversation",
            lastTime: "",
            lastRawTime: "2020-01-01T00:00:00.000Z",
            unread: 0,
            otherUser: { ...u, avatar_url: realAvatar, avatar: realAvatar }
          });
        }
      });

      // Keep all valid conversations
      convList = convList.filter((c) => c.conv_id !== null || c.email || c.name);

      convList.sort((a, b) => (b.lastRawTime || "").localeCompare(a.lastRawTime || ""));
      setConversations(convList);
      try { localStorage.setItem(`nova_conv_cache_${myUserId}`, JSON.stringify(convList)); } catch (e) {}

      if (!activeConvId && convList.length > 0) {
        if (initialRecipient?.email) {
          const matched = convList.find((c) => c.email?.toLowerCase() === initialRecipient.email.toLowerCase());
          if (matched) selectConversation(matched);
          else selectConversation(convList[0]);
        } else {
          selectConversation(convList[0]);
        }
      }
    } catch (err) {
      console.warn("Load conversations error:", err);
    }
  }, [myUserId, myEmail, registeredUsers, initialRecipient, activeConvId, userMap]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // =========================================================================
  // 4. INSTANT CONVERSATION SELECTION WITH CACHED MESSAGES
  // =========================================================================
  function selectConversation(conv) {
    const key = conv.otherUser?.user_id || conv.otherUser?.id || conv.email?.toLowerCase();
    const resolvedUser = key ? (userMap[key] || conv.otherUser) : conv.otherUser;
    const finalAvatar = resolvedUser?.avatar_url || conv.avatar || null;
    const finalName = conv.type === "group" ? conv.name : (resolvedUser?.full_name || resolvedUser?.display_name || conv.name);

    const enrichedConv = {
      ...conv,
      name: finalName,
      avatar: finalAvatar,
      avatar_url: finalAvatar,
      otherUser: resolvedUser ? { ...resolvedUser, full_name: finalName, avatar_url: finalAvatar, avatar: finalAvatar } : conv.otherUser
    };

    setActiveConv(enrichedConv);
    setActiveConvId(conv.id);
    setActiveRecipient(enrichedConv.otherUser || { name: finalName, display_name: finalName, email: conv.email, avatar: finalAvatar, avatar_url: finalAvatar });
    setShowDetailsPanel(false);
    setReplyingTo(null);
    setSearchQuery("");

    // Load instantly from localStorage cache for 0ms transition
    try {
      const cachedMsgs = localStorage.getItem(`nova_msg_cache_${conv.id}`);
      if (cachedMsgs) {
        setMessages(JSON.parse(cachedMsgs));
      }
    } catch (e) {}

    const storedNick = localStorage.getItem(`nova_nick_${conv.id}_${myUserId}`);
    setCustomNickname(storedNick || "");

    if (enrichedConv.otherUser?.user_id) {
      checkBlockStatus(enrichedConv.otherUser.user_id);
    }

    try {
      const recipientParam = conv.email || resolvedUser?.email || conv.id;
      if (recipientParam && !window.location.pathname.includes('/chat/user/')) {
        const curSearch = new URLSearchParams(window.location.search);
        if (curSearch.get('user') !== recipientParam) {
          curSearch.set('user', recipientParam);
          window.history.pushState({ view: 'chat', recipient: recipientParam }, '', `/chat?${curSearch.toString()}`);
        }
      }
    } catch (e) {}
  };

  const checkBlockStatus = async (otherId) => {
    if (!otherId || !myUserId) return;
    try {
      const { data: b1 } = await supabase
        .from("user_blocks")
        .select("id")
        .or(`and(blocker_id.eq.${otherId},blocked_id.eq.${myUserId}),and(user_id.eq.${otherId},blocked_user_id.eq.${myUserId})`)
        .maybeSingle();
      setIsTargetBlocked(!!b1);

      const { data: b2 } = await supabase
        .from("user_blocks")
        .select("id")
        .or(`and(blocker_id.eq.${myUserId},blocked_id.eq.${otherId}),and(user_id.eq.${myUserId},blocked_user_id.eq.${otherId})`)
        .maybeSingle();
      setHasBlockedTarget(!!b2);
    } catch (err) {
      console.warn("Check block error:", err);
    }
  };

  // =========================================================================
  // 5. FAST MESSAGES LOADER & DB SYNC
  // =========================================================================
  const loadMessages = useCallback(async () => {
    if (!activeConv) return;
    try {
      if (activeConv.conv_id) {
        const [msgsRes, rxRes] = await Promise.all([
          supabase.from("messages").select("*").eq("conversation_id", activeConv.conv_id).order("created_at", { ascending: true }),
          supabase.from("message_reactions").select("*").in("message_id", messages.map((m) => m.id))
        ]);

        const rawMsgs = msgsRes.data || [];
        const normalized = rawMsgs.map((m) => {
          const isMine = m.user_id === myUserId;
          const senderInfo = userMap[m.user_id] || (isMine ? currentUser : activeRecipient);
          return {
            ...m,
            sender_name: senderInfo?.full_name || senderInfo?.display_name || senderInfo?.name || "Engineer",
            sender_avatar: senderInfo?.avatar_url || senderInfo?.avatar || null
          };
        });

        setMessages(normalized);
        if (rxRes.data) setReactions(rxRes.data);

        const pinned = normalized.find((m) => m.is_pinned);
        setPinnedMessage(pinned || null);

        try { localStorage.setItem(`nova_msg_cache_${activeConv.id}`, JSON.stringify(normalized)); } catch (e) {}

        await supabase
          .from("conversation_participants")
          .update({ last_read_at: new Date().toISOString() })
          .eq("conversation_id", activeConv.conv_id)
          .eq("user_id", myUserId);
      } else if (activeConv.email) {
        const { data: directMsgs } = await supabase
          .from("nova_messages")
          .select("*")
          .or(`and(sender_email.eq.${myEmail},recipient_email.eq.${activeConv.email}),and(sender_email.eq.${activeConv.email},recipient_email.eq.${myEmail})`)
          .order("created_at", { ascending: true });

        const normalized = (directMsgs || []).map((m) => {
          const isMine = m.sender_email === myEmail;
          const partnerProfile = userMap[activeConv.email?.toLowerCase()] || {};
          return {
            id: m.id,
            conversation_id: null,
            user_id: isMine ? myUserId : (partnerProfile.user_id || "partner"),
            content: m.content,
            media_type: m.message_type || (m.attachment_url ? "image" : "text"),
            media_url: m.attachment_url,
            media_metadata: { name: m.attachment_name, size: m.attachment_size },
            sender_name: isMine ? myName : (partnerProfile.full_name || m.sender_name || "Engineer"),
            sender_avatar: isMine ? myAvatar : (partnerProfile.avatar_url || m.sender_avatar || null),
            created_at: m.created_at,
            view_limit: 0,
            view_count: 0
          };
        });

        setMessages(normalized);
        try { localStorage.setItem(`nova_msg_cache_${activeConv.id}`, JSON.stringify(normalized)); } catch (e) {}
      }
    } catch (err) {
      console.warn("Load messages error:", err);
    }
  }, [activeConv, myUserId, myEmail, activeRecipient, userMap, currentUser, myName, myAvatar]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // =========================================================================
  // 6. REALTIME DIRECT EVENT DISPATCHING (SUB-MILLISECOND UPDATE)
  // =========================================================================
  useEffect(() => {
    if (!activeConv) return;
    const cid = activeConv.conv_id;
    const partnerEmail = activeConv.email || activeRecipient?.email;
    const channelName = cid
      ? `rt-conv-v5-${cid}`
      : `rt-dm-${[myEmail.toLowerCase(), partnerEmail?.toLowerCase()].filter(Boolean).sort().join('_').replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Instant local cross-tab / cross-window broadcast channel
    let localBc = null;
    try {
      localBc = new BroadcastChannel("nova_messenger_local_rt");
      localBcRef.current = localBc;
      localBc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === "chat_message" && payload) {
          const isRelevant =
            (cid && payload.conversation_id === cid) ||
            (payload.sender_email && partnerEmail && payload.sender_email.toLowerCase() === partnerEmail.toLowerCase()) ||
            (payload.recipient_email && payload.recipient_email.toLowerCase() === myEmail.toLowerCase());
          if (isRelevant) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.id || (m.content === payload.content && Math.abs(new Date(m.created_at || Date.now()) - new Date(payload.created_at || Date.now())) < 2000))) {
                return prev;
              }
              return [...prev.filter((m) => !String(m.id).startsWith("temp_") || m.content !== payload.content), payload];
            });
            chatSounds.playMessageReceived();
          }
          loadConversations();
        } else if (type === "chat_typing" && payload) {
          if (payload.user_email && payload.user_email.toLowerCase() !== myEmail.toLowerCase()) {
            setTypingUsers([{ user_id: payload.user_id || payload.user_email, action: payload.action || "typing" }]);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUsers([]), 3000);
          }
        } else if (type === "chat_reaction" && payload) {
          setReactions((prev) => [...prev, payload]);
        }
      };
    } catch (e) {}

    const ch = supabase
      .channel(channelName)
      .on("broadcast", { event: "chat_message" }, ({ payload }) => {
        if (!payload) return;
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.id || (m.content === payload.content && Math.abs(new Date(m.created_at || Date.now()) - new Date(payload.created_at || Date.now())) < 2000))) {
            return prev;
          }
          return [...prev.filter((m) => !String(m.id).startsWith("temp_") || m.content !== payload.content), payload];
        });
        chatSounds.playMessageReceived();
      })
      .on("broadcast", { event: "chat_typing" }, ({ payload }) => {
        if (!payload || payload.user_email === myEmail) return;
        setTypingUsers([{ user_id: payload.user_id || payload.user_email, action: payload.action || "typing" }]);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUsers([]), 3000);
      })
      .on("broadcast", { event: "chat_reaction" }, ({ payload }) => {
        if (!payload) return;
        setReactions((prev) => [...prev, payload]);
      });

    if (cid) {
      ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${cid}` }, (payload) => {
        const newMsg = payload.new;
        if (!newMsg) return;
        const senderInfo = userMap[newMsg.user_id] || (newMsg.user_id === myUserId ? currentUser : activeRecipient);
        const enriched = {
          ...newMsg,
          sender_name: senderInfo?.full_name || senderInfo?.display_name || senderInfo?.name || "Engineer",
          sender_avatar: senderInfo?.avatar_url || senderInfo?.avatar || null
        };

        setMessages((prev) => {
          const exists = prev.some((m) => m.id === enriched.id);
          if (exists) return prev;
          const filtered = prev.filter((m) => !String(m.id).startsWith("temp_") || m.content !== enriched.content);
          return [...filtered, enriched];
        });
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${cid}` }, (payload) => {
        if (!payload.new) return;
        setMessages((prev) => prev.map((m) => m.id === payload.new.id ? { ...m, ...payload.new } : m));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (payload) => {
        if (!payload.old?.id) return;
        setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "message_reactions" }, (payload) => {
        if (payload.new) setReactions((prev) => [...prev, payload.new]);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "message_reactions" }, (payload) => {
        if (payload.old?.id) setReactions((prev) => prev.filter((r) => r.id !== payload.old.id));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversations", filter: `id=eq.${cid}` }, (payload) => {
        if (payload.new) {
          setActiveConv((prev) => prev ? { ...prev, ...payload.new } : null);
          loadConversations();
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "typing_indicators", filter: `conversation_id=eq.${cid}` }, async () => {
        const { data } = await supabase
          .from("typing_indicators")
          .select("user_id, updated_at")
          .eq("conversation_id", cid)
          .gt("updated_at", new Date(Date.now() - 4000).toISOString());
        setTypingUsers((data || []).map((t) => ({ user_id: t.user_id, action: "typing" })).filter((t) => t.user_id !== myUserId));
      });
    }

    // Direct / legacy message table changes
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "nova_messages" }, (payload) => {
      const newMsg = payload.new;
      if (!newMsg) return;
      const isForMe = newMsg.recipient_email?.toLowerCase() === myEmail.toLowerCase();
      const isByMe = newMsg.sender_email?.toLowerCase() === myEmail.toLowerCase();
      const matchesActive = (isForMe && newMsg.sender_email?.toLowerCase() === partnerEmail?.toLowerCase()) ||
                            (isByMe && newMsg.recipient_email?.toLowerCase() === partnerEmail?.toLowerCase());

      if (matchesActive) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id || (m.content === newMsg.content && Math.abs(new Date(m.created_at || Date.now()) - new Date(newMsg.created_at || Date.now())) < 2000))) {
            return prev;
          }
          return [...prev.filter((m) => !String(m.id).startsWith("temp_") || m.content !== newMsg.content), newMsg];
        });
        if (isForMe) chatSounds.playMessageReceived();
      }
    })
    .on("broadcast", { event: "request-accepted" }, () => {
      setActiveConv((prev) => prev ? { ...prev, is_request: false, request_status: "accepted" } : null);
      loadConversations();
    })
    .subscribe();

    rtcChannelRef.current = ch;
    return () => {
      supabase.removeChannel(ch);
      if (localBc) {
        try { localBc.close(); } catch (e) {}
      }
    };
  }, [activeConv, myUserId, myEmail, userMap, currentUser, activeRecipient, loadConversations]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================================================================
  // 7. REAL-TIME CALL SYSTEM & GLOBAL USER SIGNALING CHANNEL
  // =========================================================================
  useEffect(() => {
    if (!myUserId || myUserId === "00000000-0000-0000-0000-000000000000") return;

    const userSignalChannel = supabase
      .channel(`nova-calls-${myUserId}`)
      .on("broadcast", { event: "call-signal" }, async ({ payload }) => {
        if (!payload) return;
        const { type, from, callerName, callType, data, convId } = payload;

        if (type === "offer") {
          const callerProfile = userMap[from] || { user_id: from, name: callerName || "Engineer" };
          setIncomingCallData(payload);
          setActiveCall({
            type: callType || "audio",
            status: "incoming",
            duration: 0,
            caller: callerProfile.full_name || callerName || "Engineer",
            callerAvatar: callerProfile.avatar_url || callerProfile.avatar || null,
            from: from
          });
          startRingTone(true);
        } else if (type === "answer") {
          stopRingTone();
          if (peerConnectionRef.current) {
            try {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
            } catch (e) {}
          }
          setActiveCall((prev) => prev ? { ...prev, status: "connected" } : null);
          startCallTimer();
        } else if (type === "ice-candidate") {
          if (peerConnectionRef.current && data) {
            try {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data));
            } catch (e) {}
          }
        } else if (type === "end-call" || type === "reject-call") {
          stopRingTone();
          endCallCleanup();
        } else if (type === "video-upgrade-request") {
          setVideoUpgradeRequested(true);
        } else if (type === "new-request") {
          loadConversations();
        } else if (type === "request-accepted") {
          loadConversations();
          setActiveConv((prev) => (prev && (prev.conv_id === convId || prev.id === convId) ? { ...prev, is_request: false, request_status: "accepted" } : prev));
        } else if (type === "request-declined") {
          loadConversations();
          setActiveConv((prev) => (prev && (prev.conv_id === convId || prev.id === convId) ? null : prev));
        }
      })
      .subscribe();

    // Also listen to database calls table for fallback signaling
    const dbCallsChannel = supabase
      .channel(`db-calls-${myUserId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "calls", filter: `callee_id=eq.${myUserId}` }, (payload) => {
        const c = payload.new;
        if (c && c.status === "ringing" && !activeCall) {
          const callerProfile = userMap[c.caller_id] || {};
          setActiveCall({
            type: c.type || c.call_type || "audio",
            status: "incoming",
            duration: 0,
            caller: callerProfile.full_name || "Engineer",
            callerAvatar: callerProfile.avatar_url || callerProfile.avatar || null,
            from: c.caller_id
          });
          startRingTone(true);
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "calls" }, (payload) => {
        if (payload.new?.status === "ended") {
          stopRingTone();
          endCallCleanup();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(userSignalChannel);
      supabase.removeChannel(dbCallsChannel);
    };
  }, [myUserId, userMap, activeCall, loadConversations]);

  const sendCallSignal = (targetUserId, signalPayload) => {
    supabase.channel(`nova-calls-${targetUserId}`).send({
      type: "broadcast",
      event: "call-signal",
      payload: signalPayload
    });
    try {
      localBcRef.current?.postMessage({
        type: "call_signal",
        payload: { ...signalPayload, to: targetUserId, toEmail: activeRecipient?.email }
      });
    } catch (e) {}
  };

  const setupWebRTC = async (type) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video"
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.cloudflare.com:3478" }
      ]
    });

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
      if (type === "video" && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      } else if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch(() => {});
      }
    };

    const targetUserId = incomingCallData?.from || activeRecipient?.user_id || activeRecipient?.id;
    pc.onicecandidate = (event) => {
      if (event.candidate && targetUserId) {
        sendCallSignal(targetUserId, {
          type: "ice-candidate",
          from: myUserId,
          to: targetUserId,
          data: event.candidate
        });
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const initiateCall = async (type = "audio", customTarget = null) => {
    const target = customTarget || activeRecipient;
    if (activeConv?.is_request && !customTarget) {
      alert("⚠️ Calls are locked until the message request is accepted by both users.");
      return;
    }

    const targetUserId = target?.user_id || target?.id;
    if (!targetUserId) {
      alert("Please select an active user to call.");
      return;
    }

    const targetProfile = userMap[targetUserId] || target;
    setActiveCall({
      type,
      status: "calling",
      duration: 0,
      caller: targetProfile.full_name || targetProfile.display_name || "Engineer",
      callerAvatar: targetProfile.avatar_url || targetProfile.avatar || null
    });
    setIsMicMuted(false);
    setIsSpeakerOn(false);
    setIsVideoCameraOn(true);
    setCallKeypadTyped("");
    startRingTone(false);

    try {
      const pc = await setupWebRTC(type);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendCallSignal(targetUserId, {
        type: "offer",
        from: myUserId,
        callerName: myName,
        to: targetUserId,
        callType: type,
        data: offer
      });

      if (activeConv?.conv_id) {
        await supabase.from("calls").insert([
          {
            conversation_id: activeConv.conv_id,
            caller_id: myUserId,
            callee_id: targetUserId,
            type: type,
            call_type: type,
            status: "ringing",
            started_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.warn("Call setup error:", err);
      startCallTimer();
    }
  };

  const initiateCallToUser = async (targetUser, type = "audio") => {
    if (!targetUser) return;
    setActiveRecipient(targetUser);
    initiateCall(type, targetUser);
  };

  const acceptIncomingCall = async () => {
    stopRingTone();
    chatSounds.playCallConnected();
    if (!incomingCallData) return;
    const type = incomingCallData.callType || "audio";
    setActiveCall({
      type,
      status: "connected",
      duration: 0,
      caller: incomingCallData.callerName || "Engineer",
      callerAvatar: userMap[incomingCallData.from]?.avatar_url || null,
      from: incomingCallData.from
    });

    try {
      const pc = await setupWebRTC(type);
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCallData.data));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      sendCallSignal(incomingCallData.from, {
        type: "answer",
        from: myUserId,
        to: incomingCallData.from,
        data: answer
      });

      startCallTimer();
    } catch (err) {
      startCallTimer();
    }
  };

  const rejectIncomingCall = () => {
    stopRingTone();
    chatSounds.playCallEnded();
    if (incomingCallData) {
      sendCallSignal(incomingCallData.from, {
        type: "reject-call",
        from: myUserId,
        to: incomingCallData.from
      });
      recordCallHistory({
        id: `call_${Date.now()}`,
        type: incomingCallData.callType || "audio",
        direction: "missed",
        callerName: incomingCallData.callerName || "Engineer",
        callerAvatar: userMap[incomingCallData.from]?.avatar_url || null,
        callerId: incomingCallData.from,
        timestamp: new Date().toISOString(),
        duration: 0
      });
    }
    endCallCleanup();
  };

  const startCallTimer = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((p) => p + 1);
    }, 1000);
  };

  const recordCallHistory = (entry) => {
    setCallHistory((prev) => {
      const updated = [entry, ...prev.slice(0, 49)];
      try {
        localStorage.setItem(`nova_call_history_${myUserId}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const endCall = () => {
    stopRingTone();
    chatSounds.playCallEnded();
    if (isCallRecording) stopCallRecording();
    if (isScreenSharing) stopScreenShare();
    if (callKeypadTyped && activeConv?.conv_id) {
      handleSendMessage(`📞 Call Keypad: ${callKeypadTyped}`);
    }

    const targetUserId = incomingCallData?.from || activeRecipient?.user_id || activeRecipient?.id;
    if (targetUserId) {
      sendCallSignal(targetUserId, {
        type: "end-call",
        from: myUserId,
        to: targetUserId
      });
    }

    if (activeConv?.conv_id) {
      supabase.from("calls").update({ status: "ended", ended_at: new Date().toISOString() }).eq("conversation_id", activeConv.conv_id);
    }

    recordCallHistory({
      id: `call_${Date.now()}`,
      type: activeCall?.type || "audio",
      direction: activeCall?.status === "incoming" ? "incoming" : "outgoing",
      callerName: activeCall?.caller || headerName || "Engineer",
      callerAvatar: activeCall?.callerAvatar || headerAvatar || null,
      callerId: targetUserId,
      timestamp: new Date().toISOString(),
      duration: callDuration
    });

    if (callDuration > 0) {
      handleSendMessage(`📞 Call ended • Duration: ${formatDuration(callDuration)}`);
    }

    endCallCleanup();
  };

  const endCallCleanup = () => {
    stopRingTone();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerConnectionRef.current?.close();
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    peerConnectionRef.current = null;
    setActiveCall(null);
    setIncomingCallData(null);
    setCallDuration(0);
    setIsMicMuted(false);
    setIsVideoCameraOn(true);
    setIsCallRecording(false);
    setShowCallKeypad(false);
    setCallKeypadTyped("");
    setVideoUpgradeRequested(false);
    setIsCallMinimized(false);
    setIsScreenSharing(false);
  };

  const toggleCallMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMicMuted(!track.enabled);
    } else {
      setIsMicMuted((p) => !p);
    }
  };

  const toggleCallVideoCamera = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsVideoCameraOn(track.enabled);
    } else {
      setIsVideoCameraOn((p) => !p);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current?.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);
        showToast("🖥️ Screen sharing active");

        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        console.warn("Screen share error:", err);
      }
    }
  };

  const stopScreenShare = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      const sender = peerConnectionRef.current?.getSenders().find((s) => s.track?.kind === "video");
      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
    }
    setIsScreenSharing(false);
    showToast("Screen sharing stopped");
  };

  const startCallRecording = () => {
    const streamToRec = localStreamRef.current;
    if (!streamToRec) return;
    try {
      const rec = new MediaRecorder(streamToRec);
      callRecRef.current = rec;
      callRecChunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) callRecChunks.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(callRecChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nova_call_rec_${Date.now()}.webm`;
        a.click();
      };
      rec.start();
      setIsCallRecording(true);
    } catch (e) {}
  };

  const stopCallRecording = () => {
    if (callRecRef.current && isCallRecording) {
      callRecRef.current.stop();
      setIsCallRecording(false);
    }
  };

  // Message Actions Helpers (Star, Copy, Forward, Edit)
  const handleToggleStar = (msgId) => {
    setStarredMessageIds((prev) => {
      const next = new Set(prev);
      if (next.has(msgId)) {
        next.delete(msgId);
        showToast("Message removed from Starred");
      } else {
        next.add(msgId);
        showToast("⭐ Message saved to Starred");
      }
      try {
        localStorage.setItem(`nova_starred_msgs_${myUserId}`, JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  const handleCopyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 Copied to clipboard");
    }).catch(() => {});
  };

  const handleStartEdit = (msg) => {
    setEditingMessageId(msg.id);
    setEditingMessageText(msg.content || "");
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !editingMessageText.trim()) return;
    const newContent = editingMessageText.trim();
    const targetId = editingMessageId;
    setEditingMessageId(null);
    setEditingMessageText("");

    setMessages((prev) =>
      prev.map((m) =>
        m.id === targetId ? { ...m, content: newContent, is_edited: true } : m
      )
    );

    if (activeConv?.conv_id) {
      await supabase
        .from("messages")
        .update({ content: newContent, is_edited: true, updated_at: new Date().toISOString() })
        .eq("id", targetId);
    }
    showToast("Message updated");
  };

  const handleForwardMessage = async (targetConvOrUser) => {
    if (!forwardingMessage || !targetConvOrUser) return;
    const msg = forwardingMessage;
    setForwardingMessage(null);

    const targetConvId = targetConvOrUser.conv_id || targetConvOrUser.id;
    if (activeConv && (activeConv.id === targetConvOrUser.id || activeConv.conv_id === targetConvId)) {
      await handleSendMessage(msg.content, msg.media_type, msg.media_url, {
        ...(msg.media_metadata || {}),
        is_forwarded: true
      });
      showToast("Forwarded message successfully");
      return;
    }

    selectConversation(targetConvOrUser);
    setTimeout(async () => {
      await handleSendMessage(msg.content, msg.media_type, msg.media_url, {
        ...(msg.media_metadata || {}),
        is_forwarded: true
      });
      showToast("Forwarded message successfully");
    }, 150);
  };

  const handleSendCodeSnippet = () => {
    if (!snippetCode.trim()) return;
    const formatted = `\`\`\`${snippetLang}\n${snippetCode.trim()}\n\`\`\``;
    handleSendMessage(formatted, "code", null, { language: snippetLang });
    setSnippetCode("");
    setShowCodeSnippetModal(false);
    showToast("Code snippet shared");
  };

  const handleSendMaterialShare = (mat) => {
    if (!mat) return;
    const content = `🧪 ASME Material: ${mat.grade} (${mat.uns})\nCategory: ${mat.category} • Spec: Tensile ${mat.tensile_su_mpa} MPa, Yield ${mat.yield_sy_mpa} MPa`;
    handleSendMessage(content, "material", null, { material: mat });
    setShowMaterialShareModal(false);
    showToast(`Shared ${mat.grade} to chat`);
  };

  // =========================================================================
  // WINDOWS-STYLE RIGHT-CLICK CONTEXT MENU & SHORTCUTS
  // =========================================================================
  const openMessageContextMenu = (e, msg) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 230;
    const menuHeight = 350;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);
    setContextMenu({ type: "message", x: Math.max(10, x), y: Math.max(10, y), message: msg });
  };

  const openConvContextMenu = (e, conv) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 210;
    const menuHeight = 220;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);
    setContextMenu({ type: "conversation", x: Math.max(10, x), y: Math.max(10, y), conv });
  };

  const handleTogglePinConv = (convId) => {
    setPinnedConvIds((prev) => {
      const next = new Set(prev);
      if (next.has(convId)) {
        next.delete(convId);
        showToast("Conversation unpinned");
      } else {
        next.add(convId);
        showToast("📌 Conversation pinned to top");
      }
      try {
        localStorage.setItem(`nova_pinned_convs_${myUserId}`, JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  const handleToggleMuteConv = (convId) => {
    setMutedConvIds((prev) => {
      const next = new Set(prev);
      if (next.has(convId)) {
        next.delete(convId);
        showToast("🔔 Notifications enabled");
      } else {
        next.add(convId);
        showToast("🔕 Conversation muted");
      }
      try {
        localStorage.setItem(`nova_muted_convs_${myUserId}`, JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  // Keyboard Shortcuts & Global Click Listener
  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu) setContextMenu(null);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setContextMenu(null);
        setReplyingTo(null);
        setEditingMessageId(null);
        setShowWallpaperModal(false);
        setShowStarredModal(false);
        setForwardingMessage(null);
        setShowCodeSnippetModal(false);
        setShowMaterialShareModal(false);
        setMessageInfoModal(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setChatSearchOpen(true);
      }
    };
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu]);

  // =========================================================================
  // 8. SEND MESSAGES & REAL FILE NAME ATTACHMENTS
  // =========================================================================
  const handleSendMessage = async (customContent = null, mediaType = "text", mediaUrl = null, mediaMeta = null) => {
    const content = customContent !== null ? customContent : messageText.trim();
    if (!content && !mediaUrl && pendingAttachments.length === 0) return;

    const currentReplying = replyingTo;
    setReplyingTo(null);
    setMessageText("");
    setShowEmojiPicker(false);
    setShowStickerPicker(false);
    setShowGifPicker(false);

    let convId = activeConv?.conv_id;
    if (!convId && activeRecipient?.user_id) {
      try {
        const { data: rpcConvId } = await supabase.rpc("get_or_create_dm", {
          _other_user: activeRecipient.user_id,
          _sender_user: myUserId
        });
        if (rpcConvId) {
          convId = rpcConvId;
          if (activeConv) activeConv.conv_id = rpcConvId;
        }
      } catch (e) {
        console.warn("RPC get_or_create_dm error:", e);
      }
    }

    const itemsToSend = [];
    if (pendingAttachments.length > 0) {
      for (const att of pendingAttachments) {
        itemsToSend.push({
          content: content || att.name,
          media_type: att.type,
          media_url: att.url,
          media_metadata: { name: att.name, size: att.size },
          view_limit: viewOnceMode ? 1 : 0
        });
      }
      setPendingAttachments([]);
      setViewOnceMode(false);
    } else {
      itemsToSend.push({
        content: content,
        media_type: mediaType,
        media_url: mediaUrl,
        media_metadata: mediaMeta,
        view_limit: viewOnceMode ? 1 : 0
      });
      setViewOnceMode(false);
    }

    for (const item of itemsToSend) {
      const tempId = "temp_" + Date.now() + "_" + Math.random().toString(36).slice(2);

      if (convId) {
        const msgRow = {
          conversation_id: convId,
          user_id: myUserId,
          content: item.content,
          media_type: item.media_type,
          media_url: item.media_url,
          media_metadata: item.media_metadata,
          reply_to_id: currentReplying?.id || null,
          view_limit: item.view_limit || 0,
          view_count: 0,
          viewer_ids: [],
          created_at: new Date().toISOString()
        };

        // 0ms Optimistic UI Display with real sender info
        setMessages((prev) => {
          const next = [
            ...prev,
            {
              id: tempId,
              ...msgRow,
              sender_name: myName,
              sender_avatar: myAvatar
            }
          ];
          try { if (activeConv?.id) localStorage.setItem(`nova_msg_cache_${activeConv.id}`, JSON.stringify(next)); } catch (e) {}
          return next;
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConv?.id || c.conv_id === convId
              ? { ...c, lastMessage: item.content || "Attachment", lastTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), lastRawTime: new Date().toISOString() }
              : c
          )
        );

        // Broadcast to Realtime channel and local cross-tab bus
        const broadcastPayload = {
          id: tempId,
          ...msgRow,
          sender_name: myName,
          sender_avatar: myAvatar,
          sender_email: myEmail,
          recipient_email: activeConv?.email || activeRecipient?.email
        };
        try {
          rtcChannelRef.current?.send({
            type: "broadcast",
            event: "chat_message",
            payload: broadcastPayload
          });
          localBcRef.current?.postMessage({
            type: "chat_message",
            payload: broadcastPayload
          });
        } catch (e) {}

        // Background database sync
        supabase.from("messages").insert([msgRow]).select("id").single().then(({ data }) => {
          if (data?.id) {
            setMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, id: data.id } : m));
          }
        });
        supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
      } else {
        const legacyRow = {
          sender_email: myEmail,
          sender_name: myName,
          sender_avatar: myAvatar,
          recipient_email: activeConv?.email || activeRecipient?.email,
          recipient_name: activeRecipient?.display_name || activeRecipient?.full_name || "Engineer",
          recipient_avatar: activeRecipient?.avatar_url || activeRecipient?.avatar || null,
          content: item.content,
          message_type: item.media_type,
          attachment_url: item.media_url,
          attachment_name: item.media_metadata?.name || null,
          attachment_size: item.media_metadata?.size || null,
          reactions: [],
          is_read: false,
          created_at: new Date().toISOString()
        };

        const legacyBroadcastPayload = {
          id: tempId,
          ...legacyRow,
          user_id: myUserId,
          media_type: item.media_type,
          media_url: item.media_url,
          media_metadata: item.media_metadata
        };

        try {
          rtcChannelRef.current?.send({
            type: "broadcast",
            event: "chat_message",
            payload: legacyBroadcastPayload
          });
          localBcRef.current?.postMessage({
            type: "chat_message",
            payload: legacyBroadcastPayload
          });
        } catch (e) {}

        setMessages((prev) => {
          const next = [...prev, { id: tempId, ...legacyRow }];
          try { if (activeConv?.id) localStorage.setItem(`nova_msg_cache_${activeConv.id}`, JSON.stringify(next)); } catch (e) {}
          return next;
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConv?.id || (c.email && c.email.toLowerCase() === (activeConv?.email || activeRecipient?.email || "").toLowerCase())
              ? { ...c, lastMessage: item.content || "Attachment", lastTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), lastRawTime: new Date().toISOString() }
              : c
          )
        );

        supabase.from("nova_messages").insert([legacyRow]).then(() => {});
      }
    }
  };

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    try {
      rtcChannelRef.current?.send({
        type: "broadcast",
        event: "chat_typing",
        payload: { user_id: myUserId, user_email: myEmail, action: "typing" }
      });
      localBcRef.current?.postMessage({
        type: "chat_typing",
        payload: { user_id: myUserId, user_email: myEmail, action: "typing" }
      });
    } catch (e) {}

    if (!activeConv?.conv_id || !myUserId) return;

    supabase.from("typing_indicators").upsert(
      { conversation_id: activeConv.conv_id, user_id: myUserId, updated_at: new Date().toISOString() },
      { onConflict: "conversation_id,user_id" }
    ).then(() => {});

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      supabase.from("typing_indicators").delete().eq("conversation_id", activeConv.conv_id).eq("user_id", myUserId);
    }, 2500);
  };

  // Upload to Storage while preserving exact original file name
  const uploadToStorage = async (file, folder = "attachments") => {
    try {
      const ext = file.name ? file.name.split(".").pop() : "bin";
      const cleanOriginalName = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_") : `file_${Date.now()}.${ext}`;
      const filePath = `${myUserId}/${folder}/${Date.now()}_${cleanOriginalName}`;
      const { error: upErr } = await supabase.storage.from("chat-media").upload(filePath, file, {
        upsert: true,
        cacheControl: "3600"
      });
      if (upErr) throw upErr;
      const { data: pubData } = supabase.storage.from("chat-media").getPublicUrl(filePath);
      return pubData.publicUrl;
    } catch (err) {
      console.warn("Storage upload error:", err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleStageFiles = async (e, type = "image") => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    e.target.value = "";

    for (const file of files) {
      const isVid = file.type.startsWith("video/");
      const isImg = file.type.startsWith("image/");
      const fileType = isVid ? "video" : isImg ? "image" : "file";
      const publicUrl = await uploadToStorage(file, fileType);

      setPendingAttachments((prev) => [
        ...prev,
        {
          file,
          preview: URL.createObjectURL(file),
          url: publicUrl,
          type: fileType,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`
        }
      ]);
    }
  };

  // Voice Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRecorderRef.current = rec;
      voiceChunksRef.current = [];

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) voiceChunksRef.current.push(e.data);
      };

      rec.onstop = async () => {
        const blob = new Blob(voiceChunksRef.current, { type: "audio/webm" });
        const voiceFile = new File([blob], `voice_${Date.now()}.webm`, { type: "audio/webm" });
        const publicUrl = await uploadToStorage(voiceFile, "voice");
        handleSendMessage("🎤 Voice Note", "voice", publicUrl, {
          name: `voice_${Date.now()}.webm`,
          size: `${(blob.size / 1024).toFixed(1)} KB`
        });
        stream.getTracks().forEach((t) => t.stop());
      };

      rec.start();
      setIsRecordingVoice(true);
      setVoiceDuration(0);
      voiceTimerRef.current = setInterval(() => {
        setVoiceDuration((p) => p + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone permission denied or not available.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    }
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      voiceChunksRef.current = [];
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    }
  };

  // View-Once Media Handlers
  const openSecureViewOnce = async (msg) => {
    setSecureLightboxMsg(msg);
    try {
      await supabase.rpc("mark_message_viewed", { p_message_id: msg.id });
      setMessages((prev) =>
        prev.map((m) => m.id === msg.id ? { ...m, view_count: (m.view_count || 0) + 1 } : m)
      );
    } catch (e) {}
  };

  // Reactions & Pins
  const handleToggleReaction = async (msgId, emoji) => {
    const existing = reactions.find((r) => r.message_id === msgId && r.emoji === emoji && r.user_id === myUserId);
    if (existing) {
      setReactions((prev) => prev.filter((r) => r.id !== existing.id));
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      const newRx = { id: "rx_" + Date.now(), message_id: msgId, user_id: myUserId, emoji };
      setReactions((prev) => [...prev, newRx]);
      try {
        rtcChannelRef.current?.send({ type: "broadcast", event: "chat_reaction", payload: newRx });
        localBcRef.current?.postMessage({ type: "chat_reaction", payload: newRx });
      } catch (e) {}
      await supabase.from("message_reactions").insert([newRx]);
    }
  };

  const handleTogglePin = async (msg) => {
    const newPinned = !msg.is_pinned;
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_pinned: newPinned } : m));
    setPinnedMessage(newPinned ? msg : null);
    if (activeConv?.conv_id) {
      await supabase.from("messages").update({ is_pinned: newPinned }).eq("id", msg.id);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    if (activeConv?.conv_id) {
      await supabase.from("messages").delete().eq("id", msgId);
    }
  };

  // =========================================================================
  // 9. REAL REQUEST LIFECYCLE: ACCEPT, DECLINE, CANCEL & SEND
  // =========================================================================
  const handleAcceptRequest = async (targetConv = null) => {
    const convToAccept = targetConv || activeConv;
    const cid = convToAccept?.conv_id || convToAccept?.id;
    if (!cid) return;

    try {
      await supabase.rpc("accept_conversation_request", { _conv_id: cid });

      setActiveConv((prev) => {
        if (!prev) return prev;
        if (prev.conv_id === cid || prev.id === cid) {
          return { ...prev, is_request: false, request_status: "accepted" };
        }
        return prev;
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.conv_id === cid || c.id === cid
            ? { ...c, is_request: false, request_status: "accepted" }
            : c
        )
      );

      if (!activeConv || (activeConv.conv_id !== cid && activeConv.id !== cid)) {
        selectConversation({ ...convToAccept, is_request: false, request_status: "accepted" });
      }

      const otherId = convToAccept.otherUser?.user_id || convToAccept.otherUser?.id || convToAccept.created_by;
      if (otherId) {
        sendCallSignal(otherId, {
          type: "request-accepted",
          from: myUserId,
          convId: cid
        });
      }

      // Insert system acceptance message directly to the conversation
      try {
        const acceptText = "🤝 Connection request accepted! You can now chat and call freely in real time.";
        const { data: insertedMsg } = await supabase.from("messages").insert({
          conversation_id: cid,
          user_id: myUserId,
          content: acceptText,
          media_type: "text",
          view_limit: 0
        }).select().maybeSingle();

        if (insertedMsg) {
          setMessages((prev) => [...prev, {
            ...insertedMsg,
            sender_name: currentUser?.name || currentUser?.full_name || "Me",
            sender_avatar: currentUser?.avatar_url || currentUser?.avatar || null
          }]);
        }
      } catch (msgErr) {
        console.warn("Accept notification message error:", msgErr);
      }
    } catch (err) {
      console.warn("Accept error:", err);
    }
  };

  const handleDeclineRequest = async (targetConv = null) => {
    const convToDecline = targetConv || activeConv;
    const cid = convToDecline?.conv_id || convToDecline?.id;
    if (!cid) return;

    try {
      await supabase.rpc("decline_conversation_request", { _conv_id: cid });

      setConversations((prev) => prev.filter((c) => c.conv_id !== cid && c.id !== cid));
      if (activeConv && (activeConv.conv_id === cid || activeConv.id === cid)) {
        setActiveConv(null);
        setActiveConvId(null);
      }

      const otherId = convToDecline.otherUser?.user_id || convToDecline.otherUser?.id || convToDecline.created_by;
      if (otherId) {
        sendCallSignal(otherId, {
          type: "request-declined",
          from: myUserId,
          convId: cid
        });
      }
    } catch (err) {
      console.warn("Decline error:", err);
    }
  };

  const handleCancelSentRequest = async (targetConv) => {
    const cid = targetConv?.conv_id || targetConv?.id;
    if (!cid) return;
    try {
      await supabase.rpc("decline_conversation_request", { _conv_id: cid });
      setConversations((prev) => prev.filter((c) => c.conv_id !== cid && c.id !== cid));
      if (activeConv && (activeConv.conv_id === cid || activeConv.id === cid)) {
        setActiveConv(null);
        setActiveConvId(null);
      }
    } catch (err) {
      console.warn("Cancel request error:", err);
    }
  };

  const handleSendRequest = async (targetUser) => {
    if (!targetUser || !myUserId) return;
    const targetUserId = targetUser.user_id || targetUser.id;
    if (!targetUserId) {
      alert("Invalid user selected");
      return;
    }

    try {
      const { data: convId, error } = await supabase.rpc("send_conversation_request", {
        _sender_id: myUserId,
        _recipient_id: targetUserId
      });
      if (error) throw error;

      sendCallSignal(targetUserId, {
        type: "new-request",
        from: myUserId,
        senderName: myName,
        senderAvatar: myAvatar,
        convId: convId
      });

      await loadConversations();

      const newConvObj = {
        id: convId,
        conv_id: convId,
        type: "dm",
        name: targetUser.full_name || targetUser.display_name || targetUser.email?.split("@")[0],
        email: targetUser.email,
        avatar: targetUser.avatar_url || targetUser.avatar,
        avatar_url: targetUser.avatar_url || targetUser.avatar,
        is_request: true,
        request_status: "pending",
        created_by: myUserId,
        otherUser: targetUser,
        lastMessage: "Connection request sent",
        lastTime: "Just now"
      };

      selectConversation(newConvObj);
      setShowNewChatModal(false);
      setShowSendRequestModal(false);
      setInspectingProfile(null);
    } catch (err) {
      console.warn("Send request error:", err);
      alert("Error sending request: " + err.message);
    }
  };

  const handleSaveNickname = (nick) => {
    setCustomNickname(nick);
    if (activeConv) {
      localStorage.setItem(`nova_nick_${activeConv.id}_${myUserId}`, nick);
    }
  };

  const handleToggleBlock = async () => {
    const targetUserId = activeRecipient?.user_id || activeRecipient?.id;
    if (!targetUserId) return;

    if (hasBlockedTarget) {
      await supabase.from("user_blocks").delete().or(`and(blocker_id.eq.${myUserId},blocked_id.eq.${targetUserId}),and(user_id.eq.${myUserId},blocked_user_id.eq.${targetUserId})`);
      setHasBlockedTarget(false);
    } else {
      await supabase.from("user_blocks").insert([
        { blocker_id: myUserId, blocked_id: targetUserId, user_id: myUserId, blocked_user_id: targetUserId }
      ]);
      setHasBlockedTarget(true);
    }
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Real Active Status of current partner
  const partnerProfile = activeRecipient ? (userMap[activeRecipient.user_id || activeRecipient.id || activeRecipient.email?.toLowerCase()] || activeRecipient) : {};
  const isCurrentPartnerOnline = partnerProfile?.email && onlineUsers.has(partnerProfile.email.toLowerCase());
  const headerAvatar = partnerProfile?.avatar_url || partnerProfile?.avatar || activeConv?.avatar || null;
  const headerName = customNickname || partnerProfile?.full_name || partnerProfile?.display_name || activeConv?.name || "Engineer";

  const filteredConvs = conversations
    .filter((c) => {
      const matchSearch = (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (c.email || "").toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (activeTab === "direct") return c.type === "dm" && !c.is_request;
      if (activeTab === "groups") return c.type === "group";
      if (activeTab === "unread") return (c.unread || 0) > 0;
      if (activeTab === "pinned") return pinnedConvIds.has(c.id);
      return true;
    })
    .sort((a, b) => {
      const aPinned = pinnedConvIds.has(a.id) ? 1 : 0;
      const bPinned = pinnedConvIds.has(b.id) ? 1 : 0;
      return bPinned - aPinned;
    });

  const renderMentionTags = (str, keyPrefix = 0) => {
    if (typeof str !== "string" || !str.includes("@")) return str;
    const parts = str.split(/(@[a-zA-Z0-9._-]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("@")) {
        return (
          <span key={`${keyPrefix}-${idx}`} className="text-sky-400 font-bold bg-sky-500/10 px-1 py-0.5 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const renderHighlightedText = (text, query) => {
    if (!text) return text;
    const cleanQuery = (query || "").trim();
    if (cleanQuery) {
      try {
        const regex = new RegExp(`(${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, i) =>
          part.toLowerCase() === cleanQuery.toLowerCase() ? (
            <mark key={i} className="bg-amber-400 text-slate-950 font-bold px-0.5 rounded shadow-xs">
              {part}
            </mark>
          ) : (
            renderMentionTags(part, i)
          )
        );
      } catch (e) {
        return renderMentionTags(text, 0);
      }
    }
    return renderMentionTags(text, 0);
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <audio ref={remoteAudioRef} autoPlay />

      {/* Main Messenger Container */}
      <div className={`${theme.cardBg} border ${theme.modalBorder} ${theme.bg} rounded-3xl shadow-2xl w-full max-w-6xl h-[88vh] flex overflow-hidden font-sans relative transition-colors duration-150`}>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[350] bg-slate-900/95 text-white px-4 py-2 rounded-full shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* 1. CALL SCREEN OVERLAY (FULL SCREEN OR MINIMIZED FLOATING PIP)    */}
        {/* ================================================================= */}
        {activeCall && !isCallMinimized && (
          <div className="absolute inset-0 z-[100] bg-slate-950/98 flex flex-col items-center justify-between p-6 text-white animate-in zoom-in-95">
            {/* Call Screen Top Bar */}
            <div className="w-full flex items-center justify-between z-20">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>End-to-End Encrypted Call</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSoundEffects}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  title={soundEnabled ? "Mute Call Sounds" : "Enable Call Sounds"}
                >
                  {soundEnabled ? <Volume1 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                </button>
                <button
                  onClick={() => setIsCallMinimized(true)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                  title="Minimize Call to Floating Window"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Minimize</span>
                </button>
              </div>
            </div>

            {showCallKeypad && (
              <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
                <button
                  onClick={() => setShowCallKeypad(false)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <h4 className="text-xl font-bold mb-4">Dialpad</h4>
                <div className="text-3xl font-mono tracking-widest mb-6 min-h-[40px] text-blue-400">
                  {callKeypadTyped || "—"}
                </div>
                <div className="grid grid-cols-3 gap-4 w-64">
                  {["1","2","3","4","5","6","7","8","9","*","0","#"].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => setCallKeypadTyped((p) => p + digit)}
                      className="w-16 h-16 rounded-full bg-white/10 hover:bg-blue-600 font-bold text-xl flex items-center justify-center transition-all"
                    >
                      {digit}
                    </button>
                  ))}
                </div>
                {callKeypadTyped && (
                  <button
                    onClick={() => setCallKeypadTyped("")}
                    className="mt-4 text-xs text-rose-400 hover:text-rose-300 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {activeCall.type === "video" && (
              <div className="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-28 right-6 w-36 h-48 bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {isScreenSharing && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <ScreenShare className="w-2.5 h-2.5" /> Screen
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Calling Status & Target HD Profile */}
            <div className="relative z-10 flex flex-col items-center space-y-4 mt-4">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-4xl font-extrabold">
                {activeCall.status === "incoming" && activeCall.callerAvatar ? (
                  <img src={activeCall.callerAvatar} alt="" className="w-full h-full object-cover" />
                ) : headerAvatar ? (
                  <img src={headerAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (activeCall.caller || headerName || "U")[0].toUpperCase()
                )}
                {activeCall.status === "connected" && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                )}
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                {activeCall.status === "incoming" ? activeCall.caller : headerName}
              </h3>
              <p className={`text-sm font-semibold tracking-wider ${activeCall.status === "connected" ? "text-emerald-400" : "text-blue-300 animate-pulse"}`}>
                {activeCall.status === "calling" ? `Calling ${activeCall.type}...` : activeCall.status === "incoming" ? `Incoming ${activeCall.type} call...` : `${activeCall.type.toUpperCase()} • ${formatDuration(callDuration)}`}
              </p>
            </div>

            {videoUpgradeRequested && (
              <div className="relative z-20 bg-slate-900/90 border border-blue-500/50 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
                <Video className="w-6 h-6 text-blue-400 animate-pulse" />
                <span className="text-xs font-bold">Caller wants to upgrade to Video Call</span>
                <button onClick={() => { setVideoUpgradeRequested(false); toggleCallVideoCamera(); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold">Accept</button>
                <button onClick={() => setVideoUpgradeRequested(false)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold">Decline</button>
              </div>
            )}

            <div className="relative z-10 flex items-center gap-4 mb-6">
              {activeCall.status === "incoming" ? (
                <div className="flex items-center gap-8">
                  <button
                    onClick={rejectIncomingCall}
                    className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl hover:scale-105 transition-all"
                    title="Decline"
                  >
                    <PhoneOff className="w-7 h-7" />
                  </button>
                  <button
                    onClick={acceptIncomingCall}
                    className="p-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:scale-105 transition-all animate-bounce"
                    title="Accept Call"
                  >
                    <Phone className="w-7 h-7" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/10">
                  <button
                    onClick={toggleCallMute}
                    className={`p-3.5 rounded-full transition-all ${isMicMuted ? "bg-rose-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                    title={isMicMuted ? "Unmute" : "Mute"}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsSpeakerOn((p) => !p)}
                    className={`p-3.5 rounded-full transition-all ${isSpeakerOn ? "bg-blue-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                    title="Speaker"
                  >
                    {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>

                  {activeCall.type === "video" ? (
                    <>
                      <button
                        onClick={toggleCallVideoCamera}
                        className={`p-3.5 rounded-full transition-all ${!isVideoCameraOn ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                        title={isVideoCameraOn ? "Camera Off" : "Camera On"}
                      >
                        {!isVideoCameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={toggleScreenShare}
                        className={`p-3.5 rounded-full transition-all ${isScreenSharing ? "bg-emerald-600 text-white shadow-lg animate-pulse" : "bg-white/10 hover:bg-white/20 text-white"}`}
                        title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
                      >
                        {isScreenSharing ? <ScreenShareOff className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowCallKeypad(true)}
                      className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                      title="Keypad"
                    >
                      <Grip className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    onClick={isCallRecording ? stopCallRecording : startCallRecording}
                    className={`p-3.5 rounded-full transition-all ${isCallRecording ? "bg-rose-600 text-white animate-pulse" : "bg-white/10 hover:bg-white/20 text-white"}`}
                    title={isCallRecording ? "Stop Recording" : "Record Call"}
                  >
                    <Square className="w-5 h-5" />
                  </button>

                  <button
                    onClick={endCall}
                    className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl hover:scale-105 transition-all ml-2"
                    title="End Call"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FLOATING PICTURE-IN-PICTURE CALL WIDGET */}
        {activeCall && isCallMinimized && (
          <div className="fixed bottom-5 right-5 z-[300] bg-slate-950/95 backdrop-blur-xl border border-blue-500/60 rounded-2xl shadow-2xl p-3 flex items-center gap-3 text-white animate-in slide-in-from-bottom duration-200">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-emerald-500 flex items-center justify-center shrink-0 font-bold">
              {headerAvatar ? (
                <img src={headerAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                (activeCall.caller || headerName || "C")[0].toUpperCase()
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-extrabold text-xs truncate max-w-[120px]">{activeCall.caller || headerName}</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-mono font-bold">
                {activeCall.status === "connected" ? formatDuration(callDuration) : "Connecting..."} • {activeCall.type.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
              <button
                onClick={toggleCallMute}
                className={`p-2 rounded-xl transition-colors ${isMicMuted ? "bg-rose-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                title={isMicMuted ? "Unmute" : "Mute"}
              >
                {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              {activeCall.type === "video" && (
                <button
                  onClick={toggleCallVideoCamera}
                  className={`p-2 rounded-xl transition-colors ${!isVideoCameraOn ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                  title={isVideoCameraOn ? "Camera Off" : "Camera On"}
                >
                  {!isVideoCameraOn ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                </button>
              )}
              <button
                onClick={() => setIsCallMinimized(false)}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                title="Maximize Call Window"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={endCall}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                title="End Call"
              >
                <PhoneOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. LEFT SIDEBAR                                                   */}
        {/* ================================================================= */}
        <div className={`w-80 sm:w-96 border-r ${theme.sidebarBg} flex flex-col shrink-0 select-none`}>
          {/* User Profile Bar & Light/Dark Mode Switch */}
          <div className={`p-4 border-b ${theme.modalBorder} flex items-center justify-between`}>
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => openUserProfile(currentUser)}
              title="Click to view your profile"
            >
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center overflow-hidden shadow-xs group-hover:scale-105 transition-transform border border-slate-200 dark:border-slate-800">
                {myAvatar ? (
                  <img src={myAvatar} alt={myName} className="w-full h-full object-cover" />
                ) : (
                  myName[0].toUpperCase()
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-xs truncate flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                  {myName} <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                </h3>
                <p className={`text-[10px] ${theme.secondaryText} truncate max-w-[120px]`}>{myEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Notifications Toggle */}
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  chatSounds.setSoundEnabled(next);
                  showToast(next ? "🔊 Chat sounds active" : "🔇 Chat sounds muted");
                }}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all`}
                title={soundEnabled ? "Mute Chat Sounds" : "Enable Chat Sounds"}
              >
                {soundEnabled ? <Volume1 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
              </button>

              {/* Wallpaper & Theme Picker */}
              <button
                onClick={() => setShowWallpaperModal(true)}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all text-purple-500 hover:text-purple-600`}
                title="Chat Theme & Wallpaper"
              >
                <Palette className="w-4 h-4" />
              </button>

              {/* Starred Messages */}
              <button
                onClick={() => setShowStarredModal(true)}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all text-amber-500 hover:text-amber-600`}
                title="Starred & Bookmarked Messages"
              >
                <Star className="w-4 h-4" />
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <button
                onClick={() => setShowSendRequestModal(true)}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all text-blue-600 dark:text-blue-400`}
                title="Send Connection Request"
              >
                <Zap className="w-4 h-4 text-amber-500" />
              </button>

              <button
                onClick={() => setShowNewChatModal(true)}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all`}
                title="Start Direct Chat"
              >
                <MessageSquarePlus className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowCreateGroupModal(true)}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all`}
                title="Create Group"
              >
                <Users className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white`}
                title="Close Messenger"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl ${theme.inputBg} border ${theme.modalBorder}`}>
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search chats or registered engineers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs w-full focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs: All / Direct / Groups / Unread / Pinned / Calls / Requests */}
          <div className={`flex items-center justify-around px-1 pb-2 border-b ${theme.modalBorder} text-[10px] font-bold overflow-x-auto`}>
            {[
              { id: "all", label: "All" },
              { id: "direct", label: "Direct" },
              { id: "groups", label: "Groups" },
              { id: "unread", label: "Unread", badge: conversations.filter((c) => (c.unread || 0) > 0).length },
              { id: "pinned", label: "Pinned", badge: pinnedConvIds.size },
              { id: "calls", label: "Calls", badge: callHistory.filter((c) => c.direction === "missed").length },
              { id: "requests", label: "Requests", badge: pendingRequestsCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-1.5 px-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : `${theme.secondaryText} hover:text-slate-900 dark:hover:text-white`
                }`}
              >
                {tab.label}
                {tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px]">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* SIDEBAR BODY: DEDICATED REQUESTS VIEW OR CONVERSATIONS LIST */}
          {activeTab === "requests" ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Requests Sub-header with toggle & Send Request button */}
              <div className={`p-2.5 border-b ${theme.modalBorder} flex items-center justify-between gap-1 bg-slate-50/50 dark:bg-slate-900/50`}>
                <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setRequestsSubTab("received")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${requestsSubTab === "received" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-black" : "text-slate-600 dark:text-slate-400"}`}
                  >
                    Received ({incomingRequests.length})
                  </button>
                  <button
                    onClick={() => setRequestsSubTab("sent")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${requestsSubTab === "sent" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-black" : "text-slate-600 dark:text-slate-400"}`}
                  >
                    Sent ({outgoingRequests.length})
                  </button>
                </div>

                <button
                  onClick={() => setShowSendRequestModal(true)}
                  className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Send a connection request to an engineer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>+ Send Request</span>
                </button>
              </div>

              {/* Requests Content Stream */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                {requestsSubTab === "received" ? (
                  incomingRequests.length === 0 ? (
                    <div className={`p-8 text-center text-xs ${theme.secondaryText} space-y-2`}>
                      <ShieldCheckIcon className="w-10 h-10 mx-auto opacity-40 text-blue-500" />
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Pending Requests</p>
                      <p className="text-[11px] max-w-xs mx-auto">
                        When another engineer sends you a connection request, it will appear here with Accept and Decline buttons.
                      </p>
                      <button
                        onClick={() => setShowSendRequestModal(true)}
                        className="mt-2 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white rounded-xl font-bold text-xs transition-all"
                      >
                        Send Connection Request
                      </button>
                    </div>
                  ) : (
                    incomingRequests.map((c) => {
                      const partnerKey = c.otherUser?.user_id || c.otherUser?.id || c.email?.toLowerCase();
                      const resolvedUser = partnerKey ? userMap[partnerKey] : null;
                      const convAvatar = c.avatar || resolvedUser?.avatar_url || resolvedUser?.avatar || null;
                      const convName = resolvedUser?.full_name || resolvedUser?.display_name || c.name || "Engineer";
                      const isUserOnline = c.email && onlineUsers.has(c.email.toLowerCase());

                      return (
                        <div
                          key={c.id}
                          onClick={() => selectConversation(c)}
                          className={`p-3 rounded-2xl border ${theme.modalBorder} ${theme.cardBg} space-y-3 shadow-xs transition-all hover:border-blue-500/40 cursor-pointer`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0" onClick={(e) => { e.stopPropagation(); openUserProfile(resolvedUser || c.otherUser); }}>
                              <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs overflow-hidden border border-slate-300 dark:border-slate-700">
                                {convAvatar ? <img src={convAvatar} alt="" className="w-full h-full object-cover" /> : (convName || "U")[0].toUpperCase()}
                              </div>
                              {isUserOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <h4 className="font-extrabold text-xs truncate text-blue-600 dark:text-blue-400">{convName}</h4>
                                <span className="text-[10px] text-slate-400">{c.lastTime}</span>
                              </div>
                              <p className={`text-[11px] ${theme.secondaryText} truncate font-medium`}>
                                Sent you a connection request
                              </p>
                            </div>
                          </div>

                          {/* Real Accept and Decline Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleAcceptRequest(c); }}
                              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDeclineRequest(c); }}
                              className="py-2 px-3 bg-rose-600/15 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" /> Decline
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  outgoingRequests.length === 0 ? (
                    <div className={`p-8 text-center text-xs ${theme.secondaryText} space-y-3`}>
                      <Clock className="w-10 h-10 mx-auto opacity-40 text-blue-500" />
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Sent Requests</p>
                      <p className="text-[11px] max-w-xs mx-auto">
                        You have not sent any pending connection requests to other engineers.
                      </p>
                      <button
                        onClick={() => setShowSendRequestModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-xs hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer"
                      >
                        + Send Request Now
                      </button>
                    </div>
                  ) : (
                    outgoingRequests.map((c) => {
                      const partnerKey = c.otherUser?.user_id || c.otherUser?.id || c.email?.toLowerCase();
                      const resolvedUser = partnerKey ? userMap[partnerKey] : null;
                      const convAvatar = c.avatar || resolvedUser?.avatar_url || resolvedUser?.avatar || null;
                      const convName = resolvedUser?.full_name || resolvedUser?.display_name || c.name || "Engineer";

                      return (
                        <div
                          key={c.id}
                          onClick={() => selectConversation(c)}
                          className={`p-3 rounded-2xl border ${theme.modalBorder} ${theme.cardBg} flex items-center justify-between gap-3 shadow-xs transition-all hover:border-blue-500/40 cursor-pointer`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0">
                              {convAvatar ? <img src={convAvatar} alt="" className="w-full h-full object-cover" /> : (convName || "U")[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs truncate">{convName}</h4>
                              <p className="text-[10px] text-amber-500 font-semibold flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 animate-spin" /> Pending Approval
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleCancelSentRequest(c); }}
                            className="px-2.5 py-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                            title="Cancel this request"
                          >
                            Cancel
                          </button>
                        </div>
                      );
                    })
                  )
                )}
              </div>
            </div>
          ) : activeTab === "calls" ? (
            /* Dedicated Calls Tab with All / Missed filters and 1-Click Callback */
            <div className="flex-1 flex flex-col min-h-0">
              <div className={`p-2.5 border-b ${theme.modalBorder} flex items-center justify-between gap-1 bg-slate-50/50 dark:bg-slate-900/50`}>
                <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setCallsFilter("all")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${callsFilter === "all" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-black" : "text-slate-600 dark:text-slate-400"}`}
                  >
                    All ({callHistory.length})
                  </button>
                  <button
                    onClick={() => setCallsFilter("missed")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${callsFilter === "missed" ? "bg-white dark:bg-slate-700 shadow-xs text-rose-600 dark:text-rose-400 font-black" : "text-slate-600 dark:text-slate-400"}`}
                  >
                    Missed ({callHistory.filter((c) => c.direction === "missed").length})
                  </button>
                </div>
                {callHistory.length > 0 && (
                  <button
                    onClick={() => {
                      setCallHistory([]);
                      localStorage.removeItem(`nova_call_history_${myUserId}`);
                      showToast("Call history cleared");
                    }}
                    className="text-[10px] text-slate-400 hover:text-rose-500 font-bold px-2 py-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
                {(callsFilter === "missed" ? callHistory.filter((c) => c.direction === "missed") : callHistory).length === 0 ? (
                  <div className={`p-8 text-center text-xs ${theme.secondaryText} space-y-2`}>
                    <Phone className="w-10 h-10 mx-auto opacity-30 text-blue-500" />
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Calls Logged</p>
                    <p className="text-[11px] max-w-xs mx-auto">
                      All your incoming, outgoing, and missed audio/video calls will appear here with 1-click redial.
                    </p>
                  </div>
                ) : (
                  (callsFilter === "missed" ? callHistory.filter((c) => c.direction === "missed") : callHistory).map((c) => {
                    const partner = c.callerId ? (userMap[c.callerId] || { id: c.callerId, full_name: c.callerName, avatar_url: c.callerAvatar }) : null;
                    const isMissed = c.direction === "missed";
                    const isIncoming = c.direction === "incoming";

                    return (
                      <div
                        key={c.id}
                        className="w-full p-3 flex items-center justify-between gap-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            onClick={() => partner && openUserProfile(partner)}
                            className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700 cursor-pointer hover:scale-105 transition-transform"
                          >
                            {c.callerAvatar ? (
                              <img src={c.callerAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (c.callerName || "E")[0].toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs truncate">{c.callerName || "Engineer"}</h4>
                            <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                              {isMissed ? (
                                <span className="flex items-center gap-1 text-rose-500 font-bold">
                                  <PhoneMissed className="w-3 h-3" /> Missed
                                </span>
                              ) : isIncoming ? (
                                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                                  <PhoneIncoming className="w-3 h-3" /> Incoming {c.duration > 0 ? `(${formatDuration(c.duration)})` : ""}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-blue-500 font-bold">
                                  <PhoneOutgoing className="w-3 h-3" /> Outgoing {c.duration > 0 ? `(${formatDuration(c.duration)})` : ""}
                                </span>
                              )}
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-400">{c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick 1-Click Callback Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              if (partner) initiateCallToUser(partner, "audio");
                              else alert("Contact details unavailable for redial");
                            }}
                            className="p-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-all cursor-pointer shadow-xs"
                            title={`Call back ${c.callerName} (Audio)`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (partner) initiateCallToUser(partner, "video");
                              else alert("Contact details unavailable for redial");
                            }}
                            className="p-2 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white transition-all cursor-pointer shadow-xs"
                            title={`Video call back ${c.callerName}`}
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Standard Conversations List for All Chats / Direct / Groups */
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredConvs.length === 0 ? (
                <div className={`p-8 text-center text-xs ${theme.secondaryText}`}>
                  <p>No conversations found</p>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="mt-3 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white rounded-xl font-bold transition-all cursor-pointer"
                  >
                    + New Conversation
                  </button>
                </div>
              ) : (
                filteredConvs.map((c) => {
                  const isSelected = activeConvId === c.id;
                  const partnerKey = c.otherUser?.user_id || c.otherUser?.id || c.email?.toLowerCase();
                  const resolvedUser = partnerKey ? userMap[partnerKey] : null;
                  const convAvatar = c.avatar || resolvedUser?.avatar_url || resolvedUser?.avatar || null;
                  const convName = c.type === "group" ? (c.name || "Group") : (resolvedUser?.full_name || resolvedUser?.display_name || c.name || "User");
                  const isUserOnline = c.email && onlineUsers.has(c.email.toLowerCase());

                  return (
                    <div
                      key={c.id}
                      data-testid="sidebar-conv-item"
                      data-conv-email={c.email || ""}
                      onClick={() => selectConversation(c)}
                      onContextMenu={(e) => openConvContextMenu(e, c)}
                      className={`w-full p-3 flex items-center gap-3 text-left transition-colors cursor-pointer ${isSelected ? theme.activeConvBg : theme.hoverBg}`}
                    >
                      {/* Real Avatar with tap to see profile */}
                      <div className="relative shrink-0" onClick={(e) => { e.stopPropagation(); openUserProfile(resolvedUser || c.otherUser || c); }}>
                        <div className={`w-11 h-11 rounded-full ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-200 border-slate-300 text-slate-700"} border flex items-center justify-center font-bold text-sm overflow-hidden hover:scale-105 transition-transform`}>
                          {convAvatar ? (
                            <img src={convAvatar} alt="" className="w-full h-full object-cover" />
                          ) : c.type === "group" ? (
                            <Users className="w-5 h-5 text-blue-500" />
                          ) : (
                            (convName || "U")[0].toUpperCase()
                          )}
                        </div>
                        {isUserOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                            {pinnedConvIds.has(c.id) && (
                              <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" title="Pinned Chat" />
                            )}
                            {mutedConvIds.has(c.id) && (
                              <BellOff className="w-3 h-3 text-slate-400 shrink-0" title="Muted" />
                            )}
                            <h4 className="font-bold text-xs truncate">{convName}</h4>
                          </div>
                          <span className={`text-[10px] ${theme.secondaryText}`}>{c.lastTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-[11px] ${theme.secondaryText} truncate max-w-[160px]`}>
                            {c.lastMessage}
                          </p>
                          {c.unread > 0 && (
                            <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                              {c.unread}
                            </span>
                          )}
                          {c.is_request && (
                            <span className="px-1.5 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded text-[9px] font-bold">
                              Request
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 3. RIGHT MAIN CHAT ROOM                                          */}
        {/* ================================================================= */}
        {activeConv ? (
          <div
            className={`flex-1 flex flex-col ${WALLPAPER_STYLES[chatWallpaper]?.bgClass || theme.chatBg} relative min-w-0 transition-colors duration-300`}
            style={activeConv.wallpaper_url ? { backgroundImage: `url(${activeConv.wallpaper_url})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
          >
            {activeConv.wallpaper_url && <div className={`absolute inset-0 ${isDarkMode ? "bg-slate-950/80" : "bg-white/80"} backdrop-blur-sm pointer-events-none`} />}

            {/* Chat Room Header with Clickable Real Profile & Real Active Status */}
            <div className={`relative z-10 p-3.5 border-b ${theme.headerBg} backdrop-blur-md flex items-center justify-between`}>
              <div
                className="flex items-center gap-3 min-w-0 cursor-pointer group"
                onClick={() => openUserProfile(partnerProfile || activeRecipient || activeConv)}
                title="Click to view full real profile"
              >
                <div className={`relative w-10 h-10 rounded-full ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-200 border-slate-300 text-slate-700"} border flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-xs`}>
                  {headerAvatar ? (
                    <img src={headerAvatar} alt="" className="w-full h-full object-cover" />
                  ) : activeConv.type === "group" ? (
                    <Users className="w-5 h-5 text-blue-500" />
                  ) : (
                    (headerName || "U")[0].toUpperCase()
                  )}
                  {isCurrentPartnerOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm truncate group-hover:text-blue-600 transition-colors">
                      {headerName}
                    </h3>
                    {activeConv.type === "group" ? (
                      <span className="px-2 py-0.5 bg-blue-600/15 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold">Group</span>
                    ) : activeConv.is_request ? (
                      isPendingRequestByMe ? (
                        <span className="px-2 py-0.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" /> Request Sent
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded text-[10px] font-bold">Pending Request</span>
                      )
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    )}
                  </div>
                  
                  {/* REAL ACTIVE STATUS */}
                  <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                    {activeConv.type === "group" ? (
                      <span className={theme.secondaryText}>Multi-engineer discussion</span>
                    ) : isCurrentPartnerOnline ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active now
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1.5 ${theme.secondaryText}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => initiateCall("audio")}
                  className={`p-2.5 rounded-xl transition-all ${canCallAndSend ? theme.iconBtn : "opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                  title={canCallAndSend ? "Start Audio Call" : "Calls are locked until request is accepted"}
                >
                  <Phone className="w-4 h-4" />
                </button>

                <button
                  onClick={() => initiateCall("video")}
                  className={`p-2.5 rounded-xl transition-all ${canCallAndSend ? theme.iconBtn : "opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                  title={canCallAndSend ? "Start Video Call" : "Video call is locked until request is accepted"}
                >
                  <Video className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setChatSearchOpen((p) => !p)}
                  className={`p-2.5 rounded-xl transition-all ${chatSearchOpen ? "bg-blue-600 text-white" : theme.iconBtn}`}
                  title="Search Messages"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowDetailsPanel((p) => !p)}
                  className={`p-2.5 rounded-xl transition-all ${showDetailsPanel ? "bg-blue-600 text-white" : theme.iconBtn}`}
                  title="Conversation Details & Shared Media"
                >
                  <Info className="w-4 h-4" />
                </button>

                {activeConv.type === "group" ? (
                  <button
                    onClick={() => setShowGroupSettings(true)}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all`}
                    title="Group Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => openUserProfile(partnerProfile || activeRecipient || activeConv)}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all`}
                    title="View Real User Profile"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* TOP REQUEST BANNER FOR RECEIVER */}
            {isPendingRequestForMe && (
              <div className="relative z-10 px-4 py-3 bg-amber-500/10 border-b border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top">
                <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-100">
                  <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <span className="font-extrabold">{activeConv.name}</span> wants to connect with you.
                    <p className="text-[11px] opacity-80">Accept this request to unlock direct voice/video calls, media sharing, and replies.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAcceptRequest(activeConv)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept Request
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(activeConv)}
                    className="px-3 py-1.5 bg-rose-600/15 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Decline
                  </button>
                </div>
              </div>
            )}

            {/* TOP BANNER FOR SENDER */}
            {isPendingRequestByMe && (
              <div className="relative z-10 px-4 py-2.5 bg-blue-500/10 border-b border-blue-500/20 text-xs text-blue-800 dark:text-blue-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin text-blue-500 shrink-0" />
                  <span>Connection request sent to <strong>{activeConv.name}</strong>. Calls & attachments are locked until accepted.</span>
                </div>
                <button
                  onClick={() => handleCancelSentRequest(activeConv)}
                  className="px-3 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>
            )}

            {/* SEARCH IN CHAT BAR */}
            {chatSearchOpen && (
              <div className={`relative z-10 p-2.5 border-b ${theme.modalBorder} ${theme.headerBg} flex items-center gap-2 animate-in slide-in-from-top`}>
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter messages in this chat..."
                  value={chatSearchText}
                  onChange={(e) => setChatSearchText(e.target.value)}
                  className="bg-transparent border-none text-xs w-full focus:outline-none"
                />
                <button onClick={() => { setChatSearchText(""); setChatSearchOpen(false); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PINNED MESSAGE BANNER */}
            {pinnedMessage && (
              <div className={`relative z-10 px-4 py-2 border-b ${theme.modalBorder} bg-blue-600/10 flex items-center justify-between text-xs`}>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 min-w-0">
                  <Pin className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-bold">Pinned:</span>
                  <p className="text-[11px] truncate">{pinnedMessage.content}</p>
                </div>
                <button onClick={() => handleTogglePin(pinnedMessage)} className={`p-1 ${theme.secondaryText} hover:text-slate-900 dark:hover:text-white`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Messages Stream with Real User Profile Avatars & Real File Names */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className={`h-full flex flex-col items-center justify-center ${theme.secondaryText} space-y-3`}>
                  <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-70" />
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Real-Time Encrypted Messaging</p>
                  <p className="text-xs max-w-xs text-center">
                    Send blueprints, voice notes, engineering calculations, or initiate audio/video calls.
                  </p>
                  {isPendingRequestForMe && (
                    <button
                      onClick={() => handleAcceptRequest(activeConv)}
                      className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-500 transition-all cursor-pointer"
                    >
                      ✓ Accept Request to Start Chatting
                    </button>
                  )}
                </div>
              ) : (
                messages
                  .filter((m) => !chatSearchText || (m.content || "").toLowerCase().includes(chatSearchText.toLowerCase()) || (m.media_metadata?.name || "").toLowerCase().includes(chatSearchText.toLowerCase()))
                  .map((m) => {
                    const isMine = m.user_id === myUserId || m.sender_email === myEmail;
                    const msgRx = reactions.filter((r) => r.message_id === m.id);
                    const isViewOnceExpired = m.view_limit > 0 && m.view_count >= m.view_limit;

                    // Resolve real sender info
                    const sender = userMap[m.user_id] || userMap[m.sender_email?.toLowerCase()] || (isMine ? currentUser : partnerProfile);
                    const senderAvatar = isMine ? (myAvatar || currentUser?.avatar) : (sender?.avatar_url || sender?.avatar || null);
                    const senderName = isMine ? myName : (sender?.full_name || sender?.display_name || sender?.name || "Engineer");

                    const meta = typeof m.media_metadata === "string" ? (() => { try { return JSON.parse(m.media_metadata); } catch(e) { return {}; } })() : (m.media_metadata || {});
                    const realFileName = meta.name || m.attachment_name || (m.media_url ? m.media_url.split("/").pop()?.replace(/^\d+_[a-z0-9]+_/, "") : null) || "File";
                    const realFileSize = meta.size || m.attachment_size || "";

                    return (
                      <div key={m.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"} group`}>
                        {m.reply_to_id && (
                          <div className={`mb-1 px-3 py-1 rounded-xl text-[10px] ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"} border-l-2 border-blue-500 max-w-xs truncate`}>
                            Replying to message
                          </div>
                        )}

                        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                          {/* Real Sender Avatar with Tap to inspect profile */}
                          {!isMine && (
                            <div
                              onClick={() => openUserProfile(sender)}
                              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer hover:scale-110 transition-transform"
                              title={`View ${senderName}'s Profile`}
                            >
                              {senderAvatar ? (
                                <img src={senderAvatar} alt={senderName} className="w-full h-full object-cover" />
                              ) : (
                                (senderName || "U")[0].toUpperCase()
                              )}
                            </div>
                          )}

                          <div
                            data-testid="message-bubble"
                            onContextMenu={(e) => openMessageContextMenu(e, m)}
                            className={`relative px-4 py-2.5 rounded-2xl text-xs leading-relaxed select-text ${isMine ? theme.outgoingBubble + " rounded-br-xs" : theme.incomingBubble + " rounded-bl-xs"}`}
                          >
                            {/* View-Once Media */}
                            {m.view_limit > 0 ? (
                              isViewOnceExpired ? (
                                <div className="flex items-center gap-2 py-1 text-slate-400 font-bold">
                                  <EyeOff className="w-4 h-4" />
                                  <span>Expired view-once media</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => openSecureViewOnce(m)}
                                  className="flex items-center gap-2 py-1 text-blue-200 hover:text-white font-bold underline"
                                >
                                  <Eye className="w-4 h-4 animate-pulse" />
                                  <span>View Once Photo / Video</span>
                                </button>
                              )
                            ) : null}

                            {/* Image Attachment with Exact File Name & Size - 100% Solid Non-Transparent Background */}
                            {m.media_type === "image" && m.media_url && !m.view_limit && (
                              <div className={`mb-2 rounded-2xl overflow-hidden p-1.5 space-y-1.5 ${isMine ? "bg-blue-800 text-white border border-blue-400/40 shadow-sm" : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm"}`}>
                                <div className="rounded-xl overflow-hidden max-h-72 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                                  <img
                                    src={m.media_url}
                                    alt={realFileName}
                                    className="w-full h-full object-contain max-h-72 cursor-pointer hover:opacity-95 transition-opacity"
                                    onClick={() => window.open(m.media_url, "_blank")}
                                  />
                                </div>
                                <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 ${isMine ? "bg-blue-900 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"} rounded-lg text-[11px]`}>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <ImageIcon className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                                    <span className="font-bold truncate max-w-[190px]" title={realFileName}>{realFileName}</span>
                                    {realFileSize && <span className="opacity-80 text-[10px]">({realFileSize})</span>}
                                  </div>
                                  <a href={m.media_url} download={realFileName} target="_blank" rel="noreferrer" className={`p-1 ${isMine ? "hover:bg-blue-800 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"} rounded transition-colors`} title={`Download ${realFileName}`}>
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            )}

                            {/* Video Attachment with Exact File Name & Size */}
                            {m.media_type === "video" && m.media_url && !m.view_limit && (
                              <div className={`mb-2 rounded-2xl overflow-hidden p-1.5 space-y-1.5 ${isMine ? "bg-blue-800 text-white border border-blue-400/40 shadow-sm" : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm"}`}>
                                <div className="rounded-xl overflow-hidden max-h-72 bg-black flex items-center justify-center">
                                  <video src={m.media_url} controls className="w-full h-full object-contain" />
                                </div>
                                <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 ${isMine ? "bg-blue-900 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"} rounded-lg text-[11px]`}>
                                  <span className="font-bold truncate max-w-[180px]">{realFileName}</span>
                                  {realFileSize && <span className="opacity-80 text-[10px]">({realFileSize})</span>}
                                </div>
                              </div>
                            )}

                            {/* Forwarded Tag */}
                            {meta?.is_forwarded && (
                              <div className="flex items-center gap-1 text-[10px] opacity-75 italic mb-1.5 font-medium">
                                <CornerUpRight className="w-3 h-3 text-sky-400 shrink-0" />
                                <span>Forwarded</span>
                              </div>
                            )}

                            {/* Voice Note Waveform Player (WhatsApp / Telegram style) */}
                            {m.media_type === "voice" && m.media_url && (
                              <div className="my-1">
                                <VoiceNotePlayer url={m.media_url} isMine={isMine} duration={meta.duration || voiceDuration} />
                              </div>
                            )}

                            {/* Interactive Code Snippet Card */}
                            {(m.media_type === "code" || (m.content && m.content.startsWith("```") && m.content.endsWith("```"))) && (
                              <div className="my-1.5 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-md max-w-lg">
                                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
                                  <div className="flex items-center gap-1.5 font-mono font-bold text-sky-400">
                                    <Code className="w-3.5 h-3.5" />
                                    <span>{meta.language || (m.content.split("\n")[0].replace("```", "") || "code")}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const rawCode = m.content.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
                                      handleCopyText(rawCode);
                                    }}
                                    className="flex items-center gap-1 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Copy Code"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </button>
                                </div>
                                <pre className="p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-60 leading-relaxed whitespace-pre">
                                  {m.content.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim()}
                                </pre>
                              </div>
                            )}

                            {/* Interactive ASME Material Card */}
                            {(m.media_type === "material" || meta.material) && (() => {
                              const mat = meta.material || {};
                              return (
                                <div className="my-1.5 p-3 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-lg text-white max-w-sm">
                                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30 mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs">ASME</span>
                                      <div>
                                        <h4 className="font-extrabold text-xs text-emerald-300">{mat.grade || "ASME Alloy"}</h4>
                                        <p className="text-[10px] text-slate-400">{mat.uns || mat.spec_num || "UNS Spec"}</p>
                                      </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                                      {mat.category || "Section II-D"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                                    <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                                      <span className="text-slate-400 block text-[9px]">Tensile Strength</span>
                                      <span className="font-mono font-bold text-emerald-400">{mat.tensile_su_mpa || "—"} MPa</span>
                                    </div>
                                    <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                                      <span className="text-slate-400 block text-[9px]">Yield Strength</span>
                                      <span className="font-mono font-bold text-sky-400">{mat.yield_sy_mpa || "—"} MPa</span>
                                    </div>
                                  </div>
                                  {mat.nominal_comp && (
                                    <p className="mt-2 text-[9px] text-slate-300 truncate">
                                      <strong className="text-slate-400">Composition:</strong> {mat.nominal_comp}
                                    </p>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Generic File Attachment with Exact File Name & Size */}
                            {m.media_type === "file" && m.media_url && (
                              <a
                                href={m.media_url}
                                download={realFileName}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex items-center gap-2.5 my-1 p-2.5 ${isMine ? "bg-blue-800 hover:bg-blue-700 text-white border border-blue-400/40 shadow-xs" : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xs"} rounded-xl transition-colors`}
                              >
                                <FileText className="w-6 h-6 text-blue-500 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-[12px] truncate max-w-[200px]" title={realFileName}>{realFileName}</p>
                                  <p className={`text-[10px] ${isMine ? "text-blue-200" : "text-slate-500 dark:text-slate-400"}`}>{realFileSize || "Download file"}</p>
                                </div>
                                <Download className="w-4 h-4 shrink-0 opacity-80 hover:opacity-100" />
                              </a>
                            )}

                            {/* Sticker or GIF */}
                            {m.media_type === "gif" && m.media_url && (
                              <img src={m.media_url} alt="GIF" className="rounded-xl max-w-[200px] my-1" />
                            )}

                            {/* Inline Message Edit or Normal Text Content */}
                            {editingMessageId === m.id ? (
                              <div className="my-1 space-y-1.5 min-w-[220px]">
                                <textarea
                                  value={editingMessageText}
                                  onChange={(e) => setEditingMessageText(e.target.value)}
                                  className="w-full p-2 rounded-xl text-xs bg-slate-900/90 text-white border border-blue-500 focus:outline-none resize-none"
                                  rows={2}
                                  autoFocus
                                />
                                <div className="flex items-center justify-end gap-1.5 text-[10px]">
                                  <button
                                    onClick={() => setEditingMessageId(null)}
                                    className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveEdit}
                                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              m.content && m.content !== "🎤 Voice Note" && m.content !== "Shared image" && m.content !== "📷 Photo" && m.content !== "📎 Attachment" && m.content !== realFileName && !m.content.startsWith("```") && (
                                <p className="whitespace-pre-wrap break-words">{renderHighlightedText(m.content, chatSearchText)}</p>
                              )
                            )}

                            {/* Timestamp, Edited Tag, Star Icon & Delivery status */}
                            <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMine ? "text-blue-100" : theme.secondaryText}`}>
                              {starredMessageIds.has(m.id) && (
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0 inline mr-0.5" />
                              )}
                              {m.is_edited && <span className="opacity-70 italic mr-0.5">(edited)</span>}
                              <span>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                              {isMine && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                            </div>

                            {/* Reaction Pills */}
                            {msgRx.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {Array.from(new Set(msgRx.map((r) => r.emoji))).map((emoji) => {
                                  const count = msgRx.filter((r) => r.emoji === emoji).length;
                                  return (
                                    <span
                                      key={emoji}
                                      onClick={() => handleToggleReaction(m.id, emoji)}
                                      className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-black/30 backdrop-blur-xs flex items-center gap-0.5 cursor-pointer hover:scale-105"
                                    >
                                      <span>{emoji}</span>
                                      <span className="font-bold text-[9px]">{count}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Upgraded Social Media Message Hover Action Bar */}
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity mb-2 bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-slate-700/60 shadow-lg">
                            {/* Emoji Reaction Selector */}
                            <div className="relative group/em">
                              <button className={`p-1.5 rounded-xl ${theme.iconBtn} hover:bg-white/10`} title="React">
                                <Smile className="w-3.5 h-3.5" />
                              </button>
                              <div className="absolute bottom-full left-0 mb-1 hidden group-hover/em:flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-full shadow-xl z-20">
                                {EMOJI_REACTIONS.map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleToggleReaction(m.id, emoji)}
                                    className="p-1 hover:scale-125 transition-transform text-sm cursor-pointer"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Reply with Quoting */}
                            <button
                              onClick={() => setReplyingTo(m)}
                              className={`p-1.5 rounded-xl ${theme.iconBtn} hover:bg-white/10`}
                              title="Reply"
                            >
                              <CornerUpLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Forward */}
                            <button
                              onClick={() => setForwardingMessage(m)}
                              className={`p-1.5 rounded-xl ${theme.iconBtn} hover:bg-white/10`}
                              title="Forward Message"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Star / Bookmark */}
                            <button
                              onClick={() => handleToggleStar(m.id)}
                              className={`p-1.5 rounded-xl ${theme.iconBtn} hover:bg-white/10 ${starredMessageIds.has(m.id) ? "text-amber-400" : ""}`}
                              title={starredMessageIds.has(m.id) ? "Unstar Message" : "Star Message"}
                            >
                              <Star className={`w-3.5 h-3.5 ${starredMessageIds.has(m.id) ? "fill-amber-400" : ""}`} />
                            </button>

                            {/* Copy Message Text */}
                            {m.content && (
                              <button
                                onClick={() => handleCopyText(m.content)}
                                className={`p-1.5 rounded-xl ${theme.iconBtn} hover:bg-white/10`}
                                title="Copy Text"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Edit (if own message and text-only) */}
                            {isMine && !m.media_url && (
                              <button
                                onClick={() => handleStartEdit(m)}
                                className={`p-1.5 rounded-xl ${theme.iconBtn} hover:bg-white/10 text-sky-400`}
                                title="Edit Message"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Pin / Unpin */}
                            <button
                              onClick={() => handleTogglePin(m)}
                              className={`p-1.5 rounded-xl ${theme.iconBtn} hover:bg-white/10`}
                              title={m.is_pinned ? "Unpin" : "Pin"}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            {isMine && (
                              <button
                                onClick={() => handleDeleteMessage(m.id)}
                                className={`p-1.5 rounded-xl ${theme.iconBtn} hover:bg-rose-500/20 text-rose-500 hover:text-rose-400`}
                                title="Delete for Everyone"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

            {/* TYPING INDICATORS */}
            {typingUsers.length > 0 && (
              <div className="relative z-10 px-4 py-1 text-[11px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span>{activeConv.name} is typing...</span>
              </div>
            )}

            {/* REPLY BANNER */}
            {replyingTo && (
              <div className={`relative z-10 p-2.5 border-t ${theme.modalBorder} bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between text-xs`}>
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Replying to message: </span>
                    <span className="text-slate-600 dark:text-slate-300">{replyingTo.content || "Attachment"}</span>
                  </div>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1 hover:text-rose-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PENDING ATTACHMENTS PREVIEW BAR - 100% Solid Background */}
            {pendingAttachments.length > 0 && (
              <div className={`relative z-10 p-2 border-t ${theme.modalBorder} flex items-center gap-2 overflow-x-auto bg-slate-100 dark:bg-slate-900`}>
                {pendingAttachments.map((att, idx) => (
                  <div key={idx} className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center shadow-xs">
                    {att.type === "image" ? (
                      <img src={att.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-blue-500" />
                    )}
                    <button
                      onClick={() => setPendingAttachments((p) => p.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-black/80 text-white rounded-full hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-white text-[8px] truncate px-1 text-center font-medium">
                      {att.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* EMOJI PICKER MODAL */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-4 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 w-72 max-h-72 overflow-y-auto animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold">Emojis</span>
                  <button onClick={() => setShowEmojiPicker(false)}><X className="w-3.5 h-3.5" /></button>
                </div>
                {Object.entries(EMOJI_CATEGORIES).map(([cat, list]) => (
                  <div key={cat} className="mb-2">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">{cat}</p>
                    <div className="grid grid-cols-7 gap-1">
                      {list.map((em) => (
                        <button
                          key={em}
                          onClick={() => setMessageText((p) => p + em)}
                          className="hover:scale-125 transition-transform text-lg p-1"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STICKER PICKER */}
            {showStickerPicker && (
              <div className="absolute bottom-20 left-12 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 w-80 max-h-72 overflow-y-auto animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold">Engineering Stickers</span>
                  <button onClick={() => setShowStickerPicker(false)}><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {STICKER_PACKS.map((stk) => (
                    <button
                      key={stk.id}
                      onClick={() => handleSendMessage(null, "gif", stk.url)}
                      className="rounded-xl overflow-hidden hover:scale-105 transition-transform border border-slate-200 dark:border-slate-800"
                    >
                      <img src={stk.url} alt={stk.name} className="w-full h-16 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GIF SEARCH PICKER */}
            {showGifPicker && (
              <div className="absolute bottom-20 left-20 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 w-80 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold">Search GIFs</span>
                  <button onClick={() => setShowGifPicker(false)}><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex gap-1 mb-2">
                  <input
                    type="text"
                    placeholder="Search GIFs..."
                    value={gifSearchQuery}
                    onChange={(e) => setGifSearchQuery(e.target.value)}
                    className={`flex-1 px-2.5 py-1.5 text-xs rounded-xl ${theme.inputBg} focus:outline-none`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {STICKER_PACKS.map((g) => (
                    <img
                      key={g.id}
                      src={g.url}
                      alt=""
                      onClick={() => handleSendMessage(null, "gif", g.url)}
                      className="w-full h-20 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* INPUT CONTROLS OR LOCKED REQUEST ACTION BAR */}
            <div className={`relative z-10 p-3 border-t ${theme.modalBorder} ${theme.headerBg} backdrop-blur-md`}>
              {isPendingRequestForMe ? (
                /* Prominent bottom Accept / Decline card for recipient */
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl animate-in slide-in-from-bottom">
                  <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-100">
                    <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="font-extrabold">{activeConv.name}</span> sent you a connection request.
                      <p className="text-[11px] opacity-80">Accept this request to unlock direct messaging, audio/video calls, and file sharing.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAcceptRequest(activeConv)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Accept Request
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(activeConv)}
                      className="px-3.5 py-2 bg-rose-600/15 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                  </div>
                </div>
              ) : isPendingRequestByMe ? (
                /* Bottom pending state for sender */
                <div className="flex items-center justify-between gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-xs text-blue-800 dark:text-blue-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
                    <span>Waiting for <strong>{activeConv.name}</strong> to accept your connection request. Calls & attachments are locked until accepted.</span>
                  </div>
                  <button
                    onClick={() => handleCancelSentRequest(activeConv)}
                    className="px-3 py-1.5 bg-rose-600/15 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Cancel Request
                  </button>
                </div>
              ) : isRecordingVoice ? (
                <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/30 rounded-2xl p-2.5 px-4 animate-pulse">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                    <Mic className="w-4 h-4 animate-bounce" />
                    <span>Recording voice note: {formatDuration(voiceDuration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={cancelVoiceRecording} className="p-2 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={stopVoiceRecording} className="p-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input ref={imageInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => handleStageFiles(e, "image")} />
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleStageFiles(e, "file")} />

                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all shrink-0`}
                    title="Upload Image/Video"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all shrink-0`}
                    title="Attach File/Document"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewOnceMode((p) => !p)}
                    className={`p-2.5 rounded-xl transition-all shrink-0 ${viewOnceMode ? "bg-amber-500 text-white" : theme.iconBtn}`}
                    title={viewOnceMode ? "View Once Enabled" : "Send as View Once"}
                  >
                    {viewOnceMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setShowEmojiPicker((p) => !p)}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all shrink-0`}
                    title="Emojis"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowStickerPicker((p) => !p)}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all shrink-0`}
                    title="Stickers"
                  >
                    <Sparkle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowGifPicker((p) => !p)}
                    className={`px-2 py-1.5 rounded-xl ${theme.iconBtn} text-[11px] font-black transition-all shrink-0`}
                    title="GIFs"
                  >
                    GIF
                  </button>

                  {/* Share Code Snippet */}
                  <button
                    onClick={() => setShowCodeSnippetModal(true)}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all shrink-0 text-sky-500 hover:text-sky-400`}
                    title="Share Code Snippet"
                  >
                    <Code className="w-4 h-4" />
                  </button>

                  {/* Share ASME Material */}
                  <button
                    onClick={() => setShowMaterialShareModal(true)}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all shrink-0 text-emerald-500 hover:text-emerald-400`}
                    title="Share ASME Material Spec"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <input
                      data-testid="chat-message-input"
                      id="chat-message-input"
                      type="text"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={handleTextChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-2xl ${theme.inputBg} border ${theme.modalBorder} text-xs focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {messageText.trim() || pendingAttachments.length > 0 ? (
                    <button
                      data-testid="chat-send-btn"
                      id="chat-send-btn"
                      onClick={() => handleSendMessage()}
                      className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
                      title="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={startVoiceRecording}
                      className={`p-2.5 rounded-2xl ${theme.iconBtn} hover:text-blue-600 transition-all shrink-0 cursor-pointer`}
                      title="Record Voice Note"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`flex-1 flex flex-col items-center justify-center ${theme.chatBg} ${theme.secondaryText} p-6 space-y-3`}>
            <MessageSquare className="w-16 h-16 text-blue-600/40" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">Nova Real-Time Messenger</h3>
            <p className="text-xs max-w-sm text-center">
              Select a conversation from the left or send a connection request to any registered engineer.
            </p>
            <button
              onClick={() => setShowSendRequestModal(true)}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" /> Send Connection Request
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. DETAILS PANEL                                                  */}
        {/* ================================================================= */}
        {showDetailsPanel && activeConv && (
          <div className={`w-80 border-l ${theme.sidebarBg} flex flex-col shrink-0 select-none animate-in slide-in-from-right duration-200 z-20`}>
            {/* Top Header */}
            <div className={`p-3.5 border-b ${theme.modalBorder} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="font-extrabold text-xs">Chat Information</h3>
              </div>
              <button onClick={() => setShowDetailsPanel(false)} className={`p-1.5 rounded-lg ${theme.iconBtn} cursor-pointer`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Card */}
            <div className={`p-4 border-b ${theme.modalBorder} flex flex-col items-center text-center space-y-2`}>
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-md flex items-center justify-center font-bold text-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {headerAvatar ? (
                  <img src={headerAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (headerName || "U")[0].toUpperCase()
                )}
                {isCurrentPartnerOnline && (
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-sm">{headerName}</h4>
                <p className={`text-[11px] ${theme.secondaryText}`}>{activeConv.email || partnerProfile?.email || "Engineer"}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleTogglePinConv(activeConv.id)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${pinnedConvIds.has(activeConv.id) ? "bg-amber-500/10 border-amber-500 text-amber-500" : `${theme.modalBorder} ${theme.hoverBg}`}`}
                >
                  <Pin className="w-3 h-3" />
                  <span>{pinnedConvIds.has(activeConv.id) ? "Pinned" : "Pin"}</span>
                </button>
                <button
                  onClick={() => handleToggleMuteConv(activeConv.id)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${mutedConvIds.has(activeConv.id) ? "bg-rose-500/10 border-rose-500 text-rose-500" : `${theme.modalBorder} ${theme.hoverBg}`}`}
                >
                  <BellOff className="w-3 h-3" />
                  <span>{mutedConvIds.has(activeConv.id) ? "Muted" : "Mute"}</span>
                </button>
                <button
                  onClick={() => setShowStarredModal(true)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${theme.modalBorder} ${theme.hoverBg}`}
                >
                  <Star className="w-3 h-3 text-amber-400" />
                  <span>Starred</span>
                </button>
              </div>
            </div>

            {/* Shared Media Tabs */}
            <div className={`flex items-center justify-around p-2 border-b ${theme.modalBorder} text-[11px] font-bold`}>
              {[
                { id: "media", label: `Media (${sharedMedia.length})` },
                { id: "files", label: `Files (${sharedFiles.length})` },
                { id: "links", label: `Links (${sharedLinks.length})` },
                { id: "voice", label: `Voice (${sharedVoice.length})` },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setInfoTab(t.id)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${infoTab === t.id ? "bg-blue-600 text-white shadow-xs font-black" : `${theme.secondaryText} hover:text-slate-900 dark:hover:text-white`}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {infoTab === "media" && (
                sharedMedia.length === 0 ? (
                  <div className={`p-6 text-center text-xs ${theme.secondaryText}`}>No photos or videos shared yet</div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {sharedMedia.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setActiveMediaViewer({ url: m.media_url, type: m.media_type, name: m.attachment_name || "Shared Media" })}
                        className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer hover:opacity-90 hover:scale-105 transition-all shadow-xs"
                      >
                        {m.media_type === "video" ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-black">
                            <Play className="w-5 h-5 text-white opacity-80" />
                          </div>
                        ) : (
                          <img src={m.media_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}

              {infoTab === "files" && (
                sharedFiles.length === 0 ? (
                  <div className={`p-6 text-center text-xs ${theme.secondaryText}`}>No files shared yet</div>
                ) : (
                  <div className="space-y-2">
                    {sharedFiles.map((m) => {
                      const meta = typeof m.media_metadata === "string" ? (() => { try { return JSON.parse(m.media_metadata); } catch(e) { return {}; } })() : (m.media_metadata || {});
                      const name = meta.name || m.attachment_name || "Document";
                      return (
                        <a
                          key={m.id}
                          href={m.media_url || "#"}
                          download={name}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-2.5 rounded-xl border ${theme.modalBorder} ${theme.hoverBg} flex items-center justify-between gap-2 transition-colors`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-bold text-xs truncate max-w-[170px]">{name}</p>
                              <p className="text-[10px] text-slate-400">{meta.size || "File"}</p>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-slate-400 hover:text-blue-500 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                )
              )}

              {infoTab === "links" && (
                sharedLinks.length === 0 ? (
                  <div className={`p-6 text-center text-xs ${theme.secondaryText}`}>No links shared yet</div>
                ) : (
                  <div className="space-y-2">
                    {sharedLinks.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2.5 rounded-xl border ${theme.modalBorder} ${theme.hoverBg} flex items-center justify-between gap-2 text-xs transition-colors`}
                      >
                        <span className="text-blue-500 truncate max-w-[210px] underline">{item.url}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                )
              )}

              {infoTab === "voice" && (
                sharedVoice.length === 0 ? (
                  <div className={`p-6 text-center text-xs ${theme.secondaryText}`}>No voice notes shared yet</div>
                ) : (
                  <div className="space-y-2">
                    {sharedVoice.map((m) => (
                      <div key={m.id} className={`p-2.5 rounded-xl border ${theme.modalBorder} ${theme.cardBg}`}>
                        <VoiceNotePlayer url={m.media_url} isMine={m.user_id === myUserId || m.sender_email === myEmail} />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Custom Nickname & Block Engineer */}
            <div className={`p-3.5 border-t ${theme.modalBorder} space-y-2.5 text-xs`}>
              <div className="space-y-1">
                <label className="font-bold text-[10px] text-slate-400">Custom Nickname</label>
                <input
                  type="text"
                  value={customNickname}
                  onChange={(e) => handleSaveNickname(e.target.value)}
                  placeholder="Set nickname..."
                  className={`w-full px-3 py-1.5 ${theme.inputBg} border ${theme.modalBorder} rounded-xl text-xs focus:outline-none`}
                />
              </div>

              {activeConv.type === "dm" && (
                <button
                  onClick={handleToggleBlock}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    hasBlockedTarget
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "bg-rose-600/15 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white"
                  }`}
                >
                  <UserX className="w-4 h-4" />
                  {hasBlockedTarget ? "Unblock Engineer" : "Block Engineer"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. REAL USER PROFILE POPOVER MODAL (PROFILE TAP TO SEE)           */}
        {/* ================================================================= */}
        {inspectingProfile && (
          <div className="fixed inset-0 z-[280] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in" onClick={() => closeUserProfile()}>
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl shadow-2xl border ${theme.modalBorder} w-full max-w-sm overflow-hidden font-sans relative p-6 pt-8 text-center flex flex-col items-center`} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => closeUserProfile()}
                className={`absolute top-4 right-4 p-1.5 ${theme.secondaryText} hover:text-slate-900 dark:hover:text-white rounded-full transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large HD Profile Avatar with Verified Badge Overlay */}
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-3xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                  {inspectingProfile.avatar_url || inspectingProfile.avatar ? (
                    <img src={inspectingProfile.avatar_url || inspectingProfile.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (inspectingProfile.full_name || inspectingProfile.display_name || inspectingProfile.name || "U")[0].toUpperCase()
                  )}
                </div>
                <span className="absolute bottom-0 right-0 bg-slate-900 text-amber-400 text-xs font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-800 shadow-xs flex items-center gap-0.5">
                  &lt;/&gt;
                </span>
              </div>

              {/* User Real Name */}
              <h3 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                {inspectingProfile.full_name || inspectingProfile.display_name || inspectingProfile.name || inspectingProfile.email?.split("@")[0]}
              </h3>

              {/* User Role / Plan Badge */}
              <span className="px-3 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 text-[11px] font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-4">
                {inspectingProfile.plan ? `${inspectingProfile.plan.toUpperCase()} MEMBER` : "VERIFIED ENGINEER"}
              </span>

              {/* Dynamic Connection Status & Actions */}
              {(() => {
                const targetKey = inspectingProfile.user_id || inspectingProfile.id || inspectingProfile.email?.toLowerCase();
                const matchedConv = conversations.find((c) => {
                  const cKey = c.otherUser?.user_id || c.otherUser?.id || c.email?.toLowerCase();
                  return cKey === targetKey;
                });

                if (inspectingProfile.email?.toLowerCase() === myEmail.toLowerCase()) {
                  return (
                    <div className="w-full py-2 px-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold mb-4">
                      This is your verified profile
                    </div>
                  );
                }

                if (!matchedConv || matchedConv.request_status === "declined" || matchedConv.request_status === "not_started") {
                  return (
                    <button
                      type="button"
                      onClick={() => handleSendRequest(inspectingProfile)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mb-4"
                    >
                      <Zap className="w-4 h-4 text-amber-300" /> Send Connection Request
                    </button>
                  );
                }

                if (matchedConv.is_request && matchedConv.created_by !== myUserId) {
                  return (
                    <div className="grid grid-cols-2 gap-2 w-full mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setInspectingProfile(null);
                          handleAcceptRequest(matchedConv);
                        }}
                        className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> Accept Request
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInspectingProfile(null);
                          handleDeclineRequest(matchedConv);
                        }}
                        className="py-2.5 px-3 bg-rose-600/15 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  );
                }

                if (matchedConv.is_request && matchedConv.created_by === myUserId) {
                  return (
                    <div className="flex items-center justify-between w-full p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-4 text-xs">
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" /> Request Sent • Pending
                      </span>
                      <button
                        onClick={() => {
                          handleCancelSentRequest(matchedConv);
                          setInspectingProfile(null);
                        }}
                        className="text-rose-500 hover:underline font-bold text-[11px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-3 gap-2 w-full mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setInspectingProfile(null);
                        selectConversation(matchedConv);
                      }}
                      className="py-2.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = inspectingProfile;
                        setInspectingProfile(null);
                        initiateCallToUser(target, "audio");
                      }}
                      className={`py-2.5 px-2 ${theme.iconBtn} rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-500" /> Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = inspectingProfile;
                        setInspectingProfile(null);
                        initiateCallToUser(target, "video");
                      }}
                      className={`py-2.5 px-2 ${theme.iconBtn} rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer`}
                    >
                      <Video className="w-3.5 h-3.5 text-blue-500" /> Video
                    </button>
                  </div>
                );
              })()}

              {/* Real Live Stats */}
              <div className="grid grid-cols-2 gap-4 w-full py-3 border-y border-slate-200 dark:border-slate-800 mb-3">
                <div>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{inspectingProfile.discussionsCount ?? 0}</p>
                  <p className="text-[11px] font-medium text-slate-400">Discussions</p>
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{inspectingProfile.commentsCount ?? 0}</p>
                  <p className="text-[11px] font-medium text-slate-400">Comments</p>
                </div>
              </div>

              {/* Real Badges Row */}
              <div className="flex items-center justify-center gap-2 py-2 border-b border-slate-200 dark:border-slate-800 w-full mb-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs" title="Verified Engineer">✓</span>
                <span className="w-8 h-8 rounded-md bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-xs" title="Code Contributor">&lt;/&gt;</span>
                <span className="w-8 h-8 rounded-md bg-slate-900 text-yellow-400 font-black text-xs flex items-center justify-center shadow-xs" title="Active Solver">⚡</span>
                <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-black text-xs flex items-center justify-center shadow-xs" title="Community Upvoter">⬆️</span>
              </div>

              {/* User Real Email & Real Active Status */}
              <div className={`text-[11px] ${theme.secondaryText} flex items-center justify-between w-full`}>
                <span className="truncate max-w-[170px]" title={inspectingProfile.email}>{inspectingProfile.email}</span>
                <span className="font-bold flex items-center gap-1">
                  {inspectingProfile.email && onlineUsers.has(inspectingProfile.email.toLowerCase()) ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active now
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Offline
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 6. SEND CONNECTION REQUEST MODAL                                  */}
        {/* ================================================================= */}
        {showSendRequestModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-base">Send Connection Request</h3>
                </div>
                <button onClick={() => setShowSendRequestModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <p className={`text-xs ${theme.secondaryText}`}>
                Select an engineer to send a direct connection request. Once accepted, you can call and chat freely.
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {registeredUsers.length === 0 ? (
                  <p className={`text-xs ${theme.secondaryText} text-center py-4`}>No other engineers found</p>
                ) : (
                  registeredUsers.map((u) => {
                    const existing = conversations.find((c) => {
                      const cKey = c.otherUser?.user_id || c.otherUser?.id || c.email?.toLowerCase();
                      return cKey === (u.user_id || u.id || u.email?.toLowerCase());
                    });
                    const isConnected = existing && !existing.is_request;
                    const isSentPending = existing && existing.is_request && existing.created_by === myUserId;
                    const isReceivedPending = existing && existing.is_request && existing.created_by !== myUserId;

                    return (
                      <div
                        key={u.id}
                        className={`w-full p-3 flex items-center justify-between gap-3 ${theme.hoverBg} rounded-2xl transition-colors`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                            {u.avatar_url || u.avatar ? (
                              <img src={u.avatar_url || u.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (u.full_name || u.email)[0].toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs truncate">{u.full_name || u.display_name || u.email}</h4>
                            <p className={`text-[10px] ${theme.secondaryText} truncate`}>{u.email}</p>
                          </div>
                        </div>

                        <div>
                          {isConnected ? (
                            <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-600 rounded-lg text-xs font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Connected
                            </span>
                          ) : isReceivedPending ? (
                            <button
                              onClick={() => {
                                setShowSendRequestModal(false);
                                handleAcceptRequest(existing);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                          ) : isSentPending ? (
                            <span className="px-2.5 py-1 bg-amber-500/15 text-amber-600 rounded-lg text-xs font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 animate-spin" /> Pending
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendRequest(u)}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300" /> Send Request
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. GROUP SETTINGS MODAL                                           */}
        {/* ================================================================= */}
        {showGroupSettings && activeConv && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <h3 className="font-extrabold text-base">Group Settings</h3>
                <button onClick={() => setShowGroupSettings(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className={`text-xs font-bold ${theme.secondaryText}`}>Group Name</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={newGroupName || activeConv.name || ""}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className={`flex-1 px-3 py-2 ${theme.inputBg} rounded-xl text-xs focus:outline-none`}
                    />
                    <button
                      onClick={async () => {
                        if (newGroupName.trim() && activeConv.conv_id) {
                          await supabase.from("conversations").update({ name: newGroupName.trim() }).eq("id", activeConv.conv_id);
                          activeConv.name = newGroupName.trim();
                          loadConversations();
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-bold ${theme.secondaryText}`}>Chat Wallpaper Image URL</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={groupWallpaper || activeConv.wallpaper_url || ""}
                      onChange={(e) => setGroupWallpaper(e.target.value)}
                      className={`flex-1 px-3 py-2 ${theme.inputBg} rounded-xl text-xs focus:outline-none`}
                    />
                    <button
                      onClick={async () => {
                        if (activeConv.conv_id) {
                          await supabase.from("conversations").update({ wallpaper_url: groupWallpaper }).eq("id", activeConv.conv_id);
                          activeConv.wallpaper_url = groupWallpaper;
                          loadConversations();
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold ${theme.secondaryText}`}>Add Registered Engineers</label>
                <div className={`max-h-40 overflow-y-auto divide-y ${theme.modalBorder} mt-2`}>
                  {registeredUsers.map((u) => (
                    <div key={u.id} className={`p-2 flex items-center justify-between ${theme.hoverBg} rounded-xl`}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                          {u.avatar_url || u.avatar ? (
                            <img src={u.avatar_url || u.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (u.full_name || u.email)[0].toUpperCase()
                          )}
                        </div>
                        <span className="text-xs font-bold">{u.full_name || u.email}</span>
                      </div>
                      <button
                        onClick={async () => {
                          if (activeConv.conv_id) {
                            await supabase.from("conversation_participants").insert([
                              { conversation_id: activeConv.conv_id, user_id: u.user_id || u.id }
                            ]);
                            alert("Added " + (u.full_name || u.email) + " to group!");
                          }
                        }}
                        className="px-2.5 py-1 bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 8. CREATE GROUP MODAL                                             */}
        {/* ================================================================= */}
        {showCreateGroupModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <h3 className="font-extrabold text-base">Create Engineering Group</h3>
                <button onClick={() => setShowCreateGroupModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <div>
                <label className={`text-xs font-bold ${theme.secondaryText}`}>Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. FEA Analysis Squad"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={`w-full mt-1 px-3 py-2 ${theme.inputBg} rounded-xl text-xs focus:outline-none`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold ${theme.secondaryText}`}>Select Engineers</label>
                <div className={`max-h-48 overflow-y-auto divide-y ${theme.modalBorder} mt-2`}>
                  {registeredUsers.map((u) => {
                    const isSel = selectedGroupUsers.includes(u.user_id || u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          const uid = u.user_id || u.id;
                          setSelectedGroupUsers((prev) =>
                            isSel ? prev.filter((id) => id !== uid) : [...prev, uid]
                          );
                        }}
                        className={`w-full p-2.5 flex items-center justify-between rounded-xl transition-all cursor-pointer ${isSel ? "bg-blue-600/20 text-blue-600 dark:text-white" : theme.hoverBg}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 font-bold text-xs flex items-center justify-center overflow-hidden">
                            {u.avatar_url || u.avatar ? (
                              <img src={u.avatar_url || u.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (u.full_name || u.email)[0].toUpperCase()
                            )}
                          </div>
                          <span className="text-xs font-bold">{u.full_name || u.email}</span>
                        </div>
                        {isSel && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={!newGroupName.trim() || selectedGroupUsers.length === 0}
                onClick={async () => {
                  try {
                    const { data: conv } = await supabase
                      .from("conversations")
                      .insert([{ type: "group", name: newGroupName.trim(), created_by: myUserId }])
                      .select("id")
                      .single();

                    if (conv?.id) {
                      const participants = [myUserId, ...selectedGroupUsers].map((uid) => ({
                        conversation_id: conv.id,
                        user_id: uid
                      }));
                      await supabase.from("conversation_participants").insert(participants);
                      setShowCreateGroupModal(false);
                      setNewGroupName("");
                      setSelectedGroupUsers([]);
                      loadConversations();
                    }
                  } catch (e) {
                    alert("Group creation error: " + e.message);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                Create Group Discussion
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 9. NEW DIRECT MESSAGE MODAL (WITH SEND REQUEST & CHAT BUTTONS)     */}
        {/* ================================================================= */}
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <h3 className="font-extrabold text-base">New Direct Message</h3>
                <button onClick={() => setShowNewChatModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {registeredUsers.length === 0 ? (
                  <p className={`text-xs ${theme.secondaryText} text-center py-4`}>No other registered engineers found</p>
                ) : (
                  registeredUsers.map((u) => {
                    const existing = conversations.find((c) => {
                      const cKey = c.otherUser?.user_id || c.otherUser?.id || c.email?.toLowerCase();
                      return cKey === (u.user_id || u.id || u.email?.toLowerCase());
                    });
                    const isConnected = existing && !existing.is_request;
                    const isSentPending = existing && existing.is_request && existing.created_by === myUserId;
                    const isReceivedPending = existing && existing.is_request && existing.created_by !== myUserId;

                    return (
                      <div
                        key={u.id}
                        className={`w-full p-3 flex items-center justify-between gap-3 ${theme.hoverBg} rounded-2xl transition-colors`}
                      >
                        <div
                          className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                          onClick={() => {
                            if (isConnected && existing) {
                              setShowNewChatModal(false);
                              selectConversation(existing);
                            } else {
                              openUserProfile(u);
                            }
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                            {u.avatar_url || u.avatar ? (
                              <img src={u.avatar_url || u.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (u.full_name || u.email)[0].toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs truncate">{u.full_name || u.display_name || u.email}</h4>
                            <p className={`text-[10px] ${theme.secondaryText} truncate`}>{u.email}</p>
                          </div>
                        </div>

                        <div>
                          {isConnected ? (
                            <button
                              onClick={() => {
                                setShowNewChatModal(false);
                                selectConversation(existing);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> Chat
                            </button>
                          ) : isReceivedPending ? (
                            <button
                              onClick={() => {
                                setShowNewChatModal(false);
                                handleAcceptRequest(existing);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                          ) : isSentPending ? (
                            <span className="px-2.5 py-1 bg-amber-500/15 text-amber-600 rounded-lg text-xs font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 animate-spin" /> Pending
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendRequest(u)}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300" /> Send Request
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 10. SECURE VIEW-ONCE LIGHTBOX                                     */}
        {/* ================================================================= */}
        {secureLightboxMsg && (
          <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-6 animate-in zoom-in-95">
            <button
              onClick={() => setSecureLightboxMsg(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-2xl max-h-[80vh] flex flex-col items-center space-y-4">
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Self-destructing after this view
              </span>
              {secureLightboxMsg.media_type === "image" ? (
                <img src={secureLightboxMsg.media_url} alt="" className="max-h-[70vh] rounded-2xl object-contain shadow-2xl" />
              ) : (
                <video src={secureLightboxMsg.media_url} controls autoPlay className="max-h-[70vh] rounded-2xl" />
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 11. WALLPAPER & THEME PICKER MODAL                                */}
        {/* ================================================================= */}
        {showWallpaperModal && (
          <div className="fixed inset-0 z-[350] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 border ${theme.modalBorder}`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" />
                  <h3 className="font-extrabold text-base">Chat Theme & Wallpaper</h3>
                </div>
                <button onClick={() => setShowWallpaperModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className={`text-xs ${theme.secondaryText}`}>Select your preferred aesthetic inspired by social media messengers:</p>
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                {WALLPAPER_PRESETS.map((wp) => (
                  <div
                    key={wp.id}
                    onClick={() => {
                      setChatWallpaper(wp.id);
                      localStorage.setItem("nova_chat_wallpaper", wp.id);
                      showToast(`Theme switched to ${wp.name}`);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      chatWallpaper === wp.id ? "border-purple-500 bg-purple-500/10 shadow-lg scale-102" : "border-slate-300 dark:border-slate-800 hover:border-slate-400"
                    }`}
                  >
                    <div className={`w-full h-16 rounded-xl bg-gradient-to-tr ${wp.preview} border border-white/10 shadow-inner flex items-center justify-center`}>
                      {chatWallpaper === wp.id && <Check className="w-6 h-6 text-white bg-purple-600 rounded-full p-1 shadow-md" />}
                    </div>
                    <span className="font-bold text-xs">{wp.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 12. FORWARD MESSAGE MODAL                                         */}
        {/* ================================================================= */}
        {forwardingMessage && (
          <div className="fixed inset-0 z-[350] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 border ${theme.modalBorder}`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-500" />
                  <h3 className="font-extrabold text-base">Forward Message</h3>
                </div>
                <button onClick={() => setForwardingMessage(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message preview snippet */}
              <div className={`p-3 rounded-2xl border ${theme.modalBorder} ${theme.inputBg} text-xs italic text-slate-300 line-clamp-3`}>
                {forwardingMessage.content || "Media Attachment"}
              </div>

              <p className="text-xs font-bold text-slate-400">Select Conversation to Forward to:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {conversations.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-500">No active conversations</p>
                ) : (
                  conversations.map((c) => (
                    <div
                      key={c.id}
                      className={`p-2.5 rounded-xl border ${theme.modalBorder} ${theme.hoverBg} flex items-center justify-between transition-colors`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                          {c.avatar ? <img src={c.avatar} alt="" className="w-full h-full object-cover" /> : (c.name || "C")[0].toUpperCase()}
                        </div>
                        <div className="truncate text-xs font-bold">{c.name}</div>
                      </div>
                      <button
                        onClick={() => handleForwardMessage(c)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" /> Send
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 13. STARRED / BOOKMARKED MESSAGES MODAL                           */}
        {/* ================================================================= */}
        {showStarredModal && (
          <div className="fixed inset-0 z-[350] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 border ${theme.modalBorder}`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3 className="font-extrabold text-base">Starred & Saved Messages</h3>
                </div>
                <button onClick={() => setShowStarredModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {messages.filter((m) => starredMessageIds.has(m.id)).length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                    <Star className="w-10 h-10 mx-auto text-amber-400/40" />
                    <p className="font-bold text-slate-200">No starred messages yet</p>
                    <p className="text-[11px] max-w-xs mx-auto">
                      Hover over any message and click the star icon to bookmark important engineering notes, specs, or calculations.
                    </p>
                  </div>
                ) : (
                  messages.filter((m) => starredMessageIds.has(m.id)).map((m) => (
                    <div key={m.id} className={`p-3 rounded-2xl border ${theme.modalBorder} ${theme.cardBg} space-y-2 shadow-xs`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-400">{m.sender_name || (m.user_id === myUserId ? "You" : "Engineer")}</span>
                        <span className="text-[10px] text-slate-400">{new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-200 break-words">{m.content || "Media Attachment"}</p>
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                        {m.content && (
                          <button
                            onClick={() => handleCopyText(m.content)}
                            className="px-2 py-1 text-[11px] text-slate-400 hover:text-white rounded hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStar(m.id)}
                          className="px-2 py-1 text-[11px] text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 flex items-center gap-1 cursor-pointer"
                        >
                          Unstar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 14. SHARE CODE SNIPPET MODAL                                      */}
        {/* ================================================================= */}
        {showCodeSnippetModal && (
          <div className="fixed inset-0 z-[350] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 border ${theme.modalBorder}`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-sky-500" />
                  <h3 className="font-extrabold text-base">Share Code Snippet</h3>
                </div>
                <button onClick={() => setShowCodeSnippetModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Language</label>
                  <select
                    value={snippetLang}
                    onChange={(e) => setSnippetLang(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs ${theme.inputBg} border ${theme.modalBorder} focus:outline-none`}
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript / React</option>
                    <option value="rust">Rust</option>
                    <option value="cpp">C++</option>
                    <option value="sql">SQL / BigQuery</option>
                    <option value="json">JSON</option>
                    <option value="matlab">MATLAB</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Code / Script</label>
                  <textarea
                    rows={8}
                    value={snippetCode}
                    onChange={(e) => setSnippetCode(e.target.value)}
                    placeholder="Paste engineering calculations, API calls, or scripts here..."
                    className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 text-emerald-300 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleSendCodeSnippet}
                  disabled={!snippetCode.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Snippet to Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 15. SHARE ASME MATERIAL MODAL                                     */}
        {/* ================================================================= */}
        {showMaterialShareModal && (
          <div className="fixed inset-0 z-[350] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 border ${theme.modalBorder}`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-extrabold text-base">Share ASME Material Specification</h3>
                </div>
                <button onClick={() => setShowMaterialShareModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className={`text-xs ${theme.secondaryText}`}>Select an ASME Section II certified material to share with live tensile/yield specs:</p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {[
                  { grade: "SA-516 Gr. 70", uns: "K02700", category: "Carbon Steel", tensile_su_mpa: 485, yield_sy_mpa: 260, nominal_comp: "C-Mn-Si Carbon Steel" },
                  { grade: "SA-240 Type 304", uns: "S30400", category: "Stainless Steel", tensile_su_mpa: 515, yield_sy_mpa: 205, nominal_comp: "18Cr-8Ni Austenitic" },
                  { grade: "SA-240 Type 316L", uns: "S31603", category: "Stainless Steel", tensile_su_mpa: 485, yield_sy_mpa: 170, nominal_comp: "16Cr-12Ni-2Mo Low Carbon" },
                  { grade: "SA-387 Gr. 11 Cl. 2", uns: "K11789", category: "Alloy Steel", tensile_su_mpa: 515, yield_sy_mpa: 310, nominal_comp: "1.25Cr-0.5Mo Pressure Vessel" },
                  { grade: "SB-443 Inconel 625", uns: "N06625", category: "Nickel Alloy", tensile_su_mpa: 827, yield_sy_mpa: 414, nominal_comp: "Ni-Cr-Mo-Cb High Temp" },
                  { grade: "SB-265 Titanium Gr. 2", uns: "R50400", category: "Titanium", tensile_su_mpa: 345, yield_sy_mpa: 275, nominal_comp: "Commercially Pure Ti" },
                ].map((mat) => (
                  <div
                    key={mat.grade}
                    onClick={() => handleSendMaterialShare(mat)}
                    className={`p-3 rounded-2xl border ${theme.modalBorder} ${theme.hoverBg} flex items-center justify-between cursor-pointer transition-colors hover:border-emerald-500/50`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-emerald-400">{mat.grade}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({mat.uns})</span>
                      </div>
                      <p className={`text-[10px] ${theme.secondaryText}`}>{mat.category} • Tensile: {mat.tensile_su_mpa} MPa, Yield: {mat.yield_sy_mpa} MPa</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                      Share
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 16. DESKTOP WINDOWS-STYLE RIGHT-CLICK CONTEXT MENU                */}
        {/* ================================================================= */}
        {contextMenu && (
          <div
            className="fixed z-[500] min-w-[210px] rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-white py-1.5 px-1 animate-in fade-in zoom-in-95 duration-100 select-none"
            style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            {contextMenu.type === "message" && (() => {
              const msg = contextMenu.message;
              const isMine = msg.user_id === myUserId || msg.sender_email === myEmail;
              const hasText = msg.content && typeof msg.content === "string" && msg.content.trim().length > 0;

              return (
                <div className="space-y-1 text-xs">
                  {/* Quick Reactions Bar */}
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800/80 mb-1">
                    {["❤️", "👍", "🔥", "😂", "🚀", "💡", "🎉"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          handleToggleReaction(msg.id, emoji);
                          setContextMenu(null);
                        }}
                        className="hover:scale-130 transition-transform p-1 cursor-pointer text-sm"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Reply */}
                  <button
                    onClick={() => {
                      setReplyingTo(msg);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5 text-sky-400" />
                    <span>Reply</span>
                  </button>

                  {/* Forward */}
                  <button
                    onClick={() => {
                      setForwardingMessage(msg);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Forward</span>
                  </button>

                  {/* Copy Text */}
                  {hasText && (
                    <button
                      onClick={() => {
                        handleCopyText(msg.content);
                        setContextMenu(null);
                      }}
                      className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copy Text</span>
                    </button>
                  )}

                  {/* Star / Unstar */}
                  <button
                    onClick={() => {
                      handleToggleStar(msg.id);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                  >
                    <Star className={`w-3.5 h-3.5 text-amber-400 ${starredMessageIds.has(msg.id) ? "fill-amber-400" : ""}`} />
                    <span>{starredMessageIds.has(msg.id) ? "Unstar Message" : "Star Message"}</span>
                  </button>

                  {/* Pin / Unpin */}
                  <button
                    onClick={() => {
                      handleTogglePin(msg);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                  >
                    <Pin className="w-3.5 h-3.5 text-purple-400" />
                    <span>{msg.is_pinned ? "Unpin from Chat" : "Pin to Chat"}</span>
                  </button>

                  {/* Edit (own text message) */}
                  {isMine && !msg.media_url && (
                    <button
                      onClick={() => {
                        handleStartEdit(msg);
                        setContextMenu(null);
                      }}
                      className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Edit Message</span>
                    </button>
                  )}

                  {/* Message Info */}
                  <button
                    onClick={() => {
                      setMessageInfoModal(msg);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium border-t border-slate-800/60 pt-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Message Info</span>
                  </button>

                  {/* Delete (if mine) */}
                  {isMine && (
                    <button
                      onClick={() => {
                        handleDeleteMessage(msg.id);
                        setContextMenu(null);
                      }}
                      className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors text-left font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete for Everyone</span>
                    </button>
                  )}
                </div>
              );
            })()}

            {contextMenu.type === "conversation" && (() => {
              const c = contextMenu.conv;
              const isPinned = pinnedConvIds.has(c.id);
              const isMuted = mutedConvIds.has(c.id);

              return (
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      selectConversation(c);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open Conversation</span>
                  </button>

                  <button
                    onClick={() => {
                      handleTogglePinConv(c.id);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                  >
                    <Pin className={`w-3.5 h-3.5 text-amber-400 ${isPinned ? "fill-amber-400" : ""}`} />
                    <span>{isPinned ? "Unpin Chat from Top" : "Pin Chat to Top"}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleToggleMuteConv(c.id);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                  >
                    {isMuted ? <Bell className="w-3.5 h-3.5 text-emerald-400" /> : <BellOff className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{isMuted ? "Unmute Notifications" : "Mute Notifications"}</span>
                  </button>

                  <button
                    onClick={() => {
                      const partner = c.otherUser || (c.email ? userMap[c.email.toLowerCase()] : null);
                      if (partner) openUserProfile(partner);
                      else showToast(`User: ${c.name || c.email}`);
                      setContextMenu(null);
                    }}
                    className="w-full px-2.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium border-t border-slate-800/60 pt-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Profile</span>
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* 17. MESSAGE INFO DIALOG (DETAILED DELIVERY, METRICS & TIMESTAMP)  */}
        {/* ================================================================= */}
        {messageInfoModal && (
          <div className="fixed inset-0 z-[400] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-sm shadow-2xl p-5 space-y-4 border ${theme.modalBorder}`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <h3 className="font-extrabold text-sm">Message Information</h3>
                </div>
                <button onClick={() => setMessageInfoModal(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold">Status</span>
                    <span className="flex items-center gap-1 text-emerald-500 font-extrabold">
                      <CheckCheck className="w-3.5 h-3.5 text-sky-400" /> Delivered & Read
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold">Sent At</span>
                    <span className="font-mono text-slate-300">
                      {new Date(messageInfoModal.created_at).toLocaleString()}
                    </span>
                  </div>
                  {messageInfoModal.is_edited && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-bold">Edited</span>
                      <span className="text-amber-400 font-semibold">Yes</span>
                    </div>
                  )}
                  {messageInfoModal.content && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-bold">Length</span>
                      <span className="text-slate-300 font-mono">
                        {messageInfoModal.content.length} characters ({messageInfoModal.content.trim().split(/\s+/).length} words)
                      </span>
                    </div>
                  )}
                  {messageInfoModal.media_type && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-bold">Attachment</span>
                      <span className="text-sky-400 uppercase font-mono">{messageInfoModal.media_type}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-[11px] max-h-36 overflow-y-auto whitespace-pre-wrap">
                  {messageInfoModal.content || "Media / attachment item"}
                </div>

                <button
                  onClick={() => setMessageInfoModal(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 18. ADVANCED FULLSCREEN MEDIA VIEWER                              */}
        {/* ================================================================= */}
        {activeMediaViewer && (
          <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-150">
            {/* Top Bar */}
            <div className="p-4 flex items-center justify-between bg-black/40 border-b border-white/10 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm truncate max-w-sm">{activeMediaViewer.name || "Shared Media"}</span>
              </div>
              <div className="flex items-center gap-3">
                {activeMediaViewer.url && (
                  <a
                    href={activeMediaViewer.url}
                    download={activeMediaViewer.name || "media"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                    title="Download Media"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setActiveMediaViewer(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 transition-colors text-white cursor-pointer"
                  title="Close Media Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Display Area */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              {activeMediaViewer.type === "video" || activeMediaViewer.url?.endsWith(".mp4") ? (
                <video src={activeMediaViewer.url} controls autoPlay className="max-w-full max-h-full rounded-2xl shadow-2xl" />
              ) : (
                <img
                  src={activeMediaViewer.url}
                  alt={activeMediaViewer.name || "Media"}
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl select-none"
                />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Icon helper for ShieldCheck
function ShieldCheckIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
