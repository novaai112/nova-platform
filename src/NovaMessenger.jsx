import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Search, Send, Paperclip, Image as ImageIcon, Smile, MoreVertical,
  Phone, Video, Check, CheckCheck, User, ArrowLeft, X, Sparkles,
  FileText, Download, MessageSquare, Mic, MicOff, Volume2, VolumeX,
  PhoneOff, VideoOff, Pin, Trash2, Heart, ThumbsUp, Flame, AlertCircle,
  Plus, Users, ChevronDown, CheckCircle, RefreshCw, Eye, EyeOff, Grip,
  Hash, Radio, Settings, UserPlus, LogOut, MessageSquarePlus, UserX,
  ChevronRight, Play, Square, Info, Shield, ShieldAlert, Sparkle,
  PhoneIncoming, PhoneMissed, Clock, Edit2, Sun, Moon, Lock, Unlock,
  CheckCheck as DoubleCheck
} from "lucide-react";

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
  // Theme state: default clean white light mode with Dark Mode toggle
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

  // Navigation & View States
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConv, setActiveConv] = useState(null);
  const [activeRecipient, setActiveRecipient] = useState(initialRecipient || null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'direct' | 'groups' | 'requests'
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearchText, setChatSearchText] = useState("");

  // Modals & Panels
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const [gifResults, setGifResults] = useState([]);
  const [gifLoading, setGifLoading] = useState(false);

  // Messages & Reactions State
  const [messages, setMessages] = useState([]);
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
  const [callKeypadTyped, setCallKeypadTyped] = useState("");
  const [videoUpgradeRequested, setVideoUpgradeRequested] = useState(false);

  // Group Create State
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [groupWallpaper, setGroupWallpaper] = useState("");

  // User Blocks & Nicknames
  const [isTargetBlocked, setIsTargetBlocked] = useState(false);
  const [hasBlockedTarget, setHasBlockedTarget] = useState(false);
  const [customNickname, setCustomNickname] = useState("");

  // Refs
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

  const myEmail = currentUser?.email || "user@nova.ai";
  const myName = currentUser?.name || currentUser?.full_name || myEmail.split("@")[0];
  const myAvatar = currentUser?.avatar || currentUser?.avatar_url || null;
  const myUserId = currentUser?.id || "00000000-0000-0000-0000-000000000000";

  // Request & Acceptance status calculation
  const isPendingRequestForMe = activeConv?.is_request && activeConv?.created_by !== myUserId;
  const isPendingRequestByMe = activeConv?.is_request && activeConv?.created_by === myUserId;
  const canCallAndSend = !activeConv?.is_request || (!isPendingRequestForMe && !isPendingRequestByMe);

  // Dynamic Theme Colors
  const theme = {
    bg: isDarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900",
    modalBorder: isDarkMode ? "border-slate-800" : "border-slate-200",
    sidebarBg: isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-slate-50/95 border-slate-200",
    chatBg: isDarkMode ? "bg-slate-950" : "bg-[#f8fafc]",
    headerBg: isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-200",
    cardBg: isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
    hoverBg: isDarkMode ? "hover:bg-slate-800/60" : "hover:bg-slate-100",
    activeConvBg: isDarkMode ? "bg-blue-600/20 border-l-4 border-blue-500" : "bg-blue-50/80 border-l-4 border-blue-600",
    inputBg: isDarkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-slate-100/90 border-slate-300 text-slate-900 placeholder-slate-400",
    secondaryText: isDarkMode ? "text-slate-400" : "text-slate-500",
    iconBtn: isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900",
    incomingBubble: isDarkMode ? "bg-slate-800/95 text-slate-100 border border-slate-700/60" : "bg-white text-slate-900 border border-slate-200 shadow-sm",
    outgoingBubble: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md",
  };

  // =========================================================================
  // 1. LOAD REGISTERED USERS & PROFILES
  // =========================================================================
  const loadRegisteredUsers = useCallback(async () => {
    try {
      const { data: usersData } = await supabase
        .from("user_profiles")
        .select("id, email, full_name, avatar_url, plan, created_at")
        .order("created_at", { ascending: false });

      const { data: profsData } = await supabase
        .from("profiles")
        .select("user_id, display_name, email, avatar_url, username");

      const profMap = new Map();
      (profsData || []).forEach((p) => {
        if (p.email) profMap.set(p.email.toLowerCase(), p);
        if (p.user_id) profMap.set(p.user_id, p);
      });

      const combined = (usersData || [])
        .filter((u) => u.email?.toLowerCase() !== myEmail.toLowerCase())
        .map((u) => {
          const prof = profMap.get(u.email?.toLowerCase()) || profMap.get(u.id) || {};
          return {
            id: u.id || prof.user_id,
            user_id: u.id || prof.user_id,
            email: u.email,
            full_name: u.full_name || prof.display_name || u.email.split("@")[0],
            display_name: u.full_name || prof.display_name || u.email.split("@")[0],
            username: prof.username || u.email.split("@")[0],
            avatar_url: u.avatar_url || prof.avatar_url || null,
            plan: u.plan || "Pro"
          };
        });

      setRegisteredUsers(combined);
    } catch (err) {
      console.warn("Load registered users error:", err);
    }
  }, [myEmail]);

  useEffect(() => {
    loadRegisteredUsers();
  }, [loadRegisteredUsers]);

  // =========================================================================
  // 2. REAL PRESENCE TRACKING
  // =========================================================================
  useEffect(() => {
    if (!myEmail) return;
    const channelName = `presence-chat-global-${myEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const ch = supabase.channel(channelName, {
      config: { presence: { key: myEmail } },
    });

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      const keys = new Set(Object.keys(state));
      setOnlineUsers(keys);
    })
      .on("presence", { event: "join" }, ({ key }) => {
        setOnlineUsers((prev) => new Set([...prev, key]));
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await ch.track({ email: myEmail, online_at: new Date().toISOString() });
        }
      });

    presenceChannelRef.current = ch;
    return () => {
      supabase.removeChannel(ch);
    };
  }, [myEmail]);

  // =========================================================================
  // 3. LOAD CONVERSATIONS (DMs & GROUPS)
  // =========================================================================
  const loadConversations = useCallback(async () => {
    try {
      // 1. Fetch conversations where user is a participant
      const { data: participations } = await supabase
        .from("conversation_participants")
        .select("conversation_id, last_read_at")
        .eq("user_id", myUserId);

      const convIds = (participations || []).map((p) => p.conversation_id);

      let dbConvs = [];
      if (convIds.length > 0) {
        const { data } = await supabase
          .from("conversations")
          .select("*")
          .in("id", convIds)
          .order("updated_at", { ascending: false });
        dbConvs = data || [];
      }

      // 2. Fetch last messages for each conversation
      let lastMsgMap = {};
      if (convIds.length > 0) {
        const { data: lastMsgs } = await supabase
          .from("messages")
          .select("conversation_id, content, media_type, created_at, user_id")
          .in("conversation_id", convIds)
          .order("created_at", { ascending: false });

        (lastMsgs || []).forEach((m) => {
          if (!lastMsgMap[m.conversation_id]) {
            lastMsgMap[m.conversation_id] = m;
          }
        });
      }

      // 3. Fetch other participants for DMs
      const dmConvIds = dbConvs.filter((c) => c.type === "dm").map((c) => c.id);
      let dmPartnerMap = {};
      if (dmConvIds.length > 0) {
        const { data: dmParts } = await supabase
          .from("conversation_participants")
          .select("conversation_id, user_id")
          .in("conversation_id", dmConvIds)
          .neq("user_id", myUserId);

        const otherUserIds = [...new Set((dmParts || []).map((p) => p.user_id))];
        let profMap = {};
        if (otherUserIds.length > 0) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("user_id, display_name, avatar_url, email, username")
            .in("user_id", otherUserIds);
          (profs || []).forEach((p) => {
            profMap[p.user_id] = p;
          });
        }

        (dmParts || []).forEach((p) => {
          dmPartnerMap[p.conversation_id] = profMap[p.user_id] || {
            user_id: p.user_id,
            display_name: "Engineer",
            email: "engineer@nova.ai"
          };
        });
      }

      // Also support legacy/direct nova_messages fallback table
      const { data: directMsgs } = await supabase
        .from("nova_messages")
        .select("*")
        .or(`sender_email.eq.${myEmail},recipient_email.eq.${myEmail}`)
        .order("created_at", { ascending: false });

      const convList = [];
      const seenEmails = new Set();

      // Format DB conversations
      dbConvs.forEach((c) => {
        const other = c.type === "dm" ? dmPartnerMap[c.id] : null;
        const lastM = lastMsgMap[c.id];
        const title = c.type === "group" ? c.name || "Group" : other?.display_name || other?.username || "Direct Chat";
        const email = other?.email || null;
        if (email) seenEmails.add(email.toLowerCase());

        convList.push({
          id: c.id,
          conv_id: c.id,
          type: c.type,
          name: title,
          email: email,
          avatar: c.type === "group" ? c.avatar_url : other?.avatar_url || null,
          wallpaper_url: c.wallpaper_url || null,
          is_request: !!c.is_request,
          created_by: c.created_by,
          lastMessage: lastM?.media_type === "text" ? lastM.content : lastM?.media_type ? `📎 ${lastM.media_type}` : "No messages yet",
          lastTime: lastM?.created_at ? new Date(lastM.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
          lastRawTime: lastM?.created_at || c.updated_at || c.created_at,
          unread: 0,
          otherUser: other
        });
      });

      // Incorporate direct contacts from nova_messages
      (directMsgs || []).forEach((msg) => {
        const isMine = msg.sender_email === myEmail;
        const partnerEmail = (isMine ? msg.recipient_email : msg.sender_email)?.toLowerCase();
        if (partnerEmail && !seenEmails.has(partnerEmail)) {
          seenEmails.add(partnerEmail);
          const partnerName = isMine ? msg.recipient_name : msg.sender_name;
          const partnerAvatar = isMine ? msg.recipient_avatar : msg.sender_avatar;

          convList.push({
            id: `legacy_${partnerEmail}`,
            conv_id: null,
            type: "dm",
            name: partnerName || partnerEmail.split("@")[0],
            email: partnerEmail,
            avatar: partnerAvatar,
            wallpaper_url: null,
            is_request: false,
            created_by: null,
            lastMessage: msg.content || "Attachment",
            lastTime: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            lastRawTime: msg.created_at,
            unread: !isMine && !msg.is_read ? 1 : 0,
            otherUser: {
              email: partnerEmail,
              display_name: partnerName,
              avatar_url: partnerAvatar
            }
          });
        }
      });

      // Incorporate registered users
      registeredUsers.forEach((u) => {
        const uEmail = u.email?.toLowerCase();
        if (uEmail && !seenEmails.has(uEmail)) {
          seenEmails.add(uEmail);
          convList.push({
            id: `user_${u.id || u.email}`,
            conv_id: null,
            type: "dm",
            name: u.full_name || u.display_name || uEmail.split("@")[0],
            email: u.email,
            avatar: u.avatar_url,
            wallpaper_url: null,
            is_request: true,
            created_by: myUserId,
            lastMessage: "No messages yet",
            lastTime: "",
            lastRawTime: u.created_at || new Date().toISOString(),
            unread: 0,
            otherUser: u
          });
        }
      });

      convList.sort((a, b) => (b.lastRawTime || "").localeCompare(a.lastRawTime || ""));
      setConversations(convList);

      // Set default active if none
      if (!activeConvId && convList.length > 0) {
        if (initialRecipient?.email) {
          const matched = convList.find((c) => c.email?.toLowerCase() === initialRecipient.email.toLowerCase());
          if (matched) {
            selectConversation(matched);
          } else {
            selectConversation(convList[0]);
          }
        } else {
          selectConversation(convList[0]);
        }
      }
    } catch (err) {
      console.warn("Load conversations error:", err);
    }
  }, [myUserId, myEmail, registeredUsers, initialRecipient, activeConvId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // =========================================================================
  // 4. SELECT CONVERSATION
  // =========================================================================
  const selectConversation = (conv) => {
    setActiveConv(conv);
    setActiveConvId(conv.id);
    setActiveRecipient(conv.otherUser || { name: conv.name, email: conv.email, avatar: conv.avatar });
    setShowDetailsPanel(false);
    setReplyingTo(null);
    setSearchQuery("");

    const storedNick = localStorage.getItem(`nova_nick_${conv.id}_${myUserId}`);
    setCustomNickname(storedNick || "");

    if (conv.otherUser?.user_id) {
      checkBlockStatus(conv.otherUser.user_id);
    }
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

  const handleToggleBlock = async () => {
    const otherId = activeRecipient?.user_id || activeRecipient?.id;
    if (!otherId || !myUserId) return;

    if (hasBlockedTarget) {
      await supabase
        .from("user_blocks")
        .delete()
        .or(`and(blocker_id.eq.${myUserId},blocked_id.eq.${otherId}),and(user_id.eq.${myUserId},blocked_user_id.eq.${otherId})`);
      setHasBlockedTarget(false);
    } else {
      await supabase.from("user_blocks").insert([
        { blocker_id: myUserId, blocked_id: otherId, user_id: myUserId, blocked_user_id: otherId }
      ]);
      setHasBlockedTarget(true);
    }
  };

  // Accept Message Request
  const handleAcceptRequest = async () => {
    if (!activeConv?.conv_id) return;
    try {
      await supabase.rpc("accept_conversation_request", { _conv_id: activeConv.conv_id });
      setActiveConv((prev) => prev ? { ...prev, is_request: false } : null);
      setConversations((prev) => prev.map((c) => c.id === activeConv.id ? { ...c, is_request: false } : c));
      // Notify other user
      if (rtcChannelRef.current) {
        rtcChannelRef.current.send({
          type: "broadcast",
          event: "request-accepted",
          payload: { conversation_id: activeConv.conv_id, from: myUserId }
        });
      }
    } catch (err) {
      console.warn("Accept request error:", err);
    }
  };

  // Reject / Ignore Message Request
  const handleRejectRequest = async () => {
    if (!activeConv?.conv_id) return;
    try {
      await supabase.from("conversation_participants").delete().eq("conversation_id", activeConv.conv_id).eq("user_id", myUserId);
      setConversations((prev) => prev.filter((c) => c.id !== activeConv.id));
      setActiveConv(null);
      setActiveConvId(null);
    } catch (err) {
      console.warn("Reject request error:", err);
    }
  };

  // =========================================================================
  // 5. LOAD ACTIVE MESSAGES & REALTIME SUBSCRIPTIONS
  // =========================================================================
  const loadMessages = useCallback(async () => {
    if (!activeConv) {
      setMessages([]);
      return;
    }

    try {
      if (activeConv.conv_id) {
        const { data: msgsData } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", activeConv.conv_id)
          .order("created_at", { ascending: true });

        const msgList = msgsData || [];
        setMessages(msgList);

        const pinned = msgList.find((m) => m.is_pinned);
        setPinnedMessage(pinned || null);

        const msgIds = msgList.map((m) => m.id);
        if (msgIds.length > 0) {
          const { data: rxData } = await supabase
            .from("message_reactions")
            .select("*")
            .in("message_id", msgIds);
          setReactions(rxData || []);
        }

        const unreadMine = msgList.filter((m) => m.user_id !== myUserId);
        if (unreadMine.length > 0) {
          const readsToUpsert = unreadMine.map((m) => ({ message_id: m.id, user_id: myUserId }));
          await supabase.from("message_reads").upsert(readsToUpsert, { onConflict: "message_id,user_id", ignoreDuplicates: true });
        }
      } else if (activeConv.email) {
        const otherEmail = activeConv.email;
        const { data: directData } = await supabase
          .from("nova_messages")
          .select("*")
          .or(`and(sender_email.eq.${myEmail},recipient_email.eq.${otherEmail}),and(sender_email.eq.${otherEmail},recipient_email.eq.${myEmail})`)
          .order("created_at", { ascending: true });

        const normalized = (directData || []).map((m) => ({
          id: m.id,
          conversation_id: activeConv.id,
          user_id: m.sender_email === myEmail ? myUserId : (activeRecipient?.user_id || "other"),
          sender_email: m.sender_email,
          sender_name: m.sender_name,
          sender_avatar: m.sender_avatar,
          content: m.content,
          media_type: m.message_type || "text",
          media_url: m.attachment_url,
          media_metadata: m.attachment_name ? { name: m.attachment_name, size: m.attachment_size } : null,
          reactions: m.reactions || [],
          is_read: m.is_read,
          created_at: m.created_at
        }));

        setMessages(normalized);
      }
    } catch (err) {
      console.warn("Load messages error:", err);
    }
  }, [activeConv, myUserId, myEmail, activeRecipient]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Realtime subscription for active conversation
  useEffect(() => {
    if (!activeConv?.conv_id) return;
    const cid = activeConv.conv_id;

    const ch = supabase
      .channel(`rt-conv-v2-${cid}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${cid}` }, () => {
        loadMessages();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "message_reactions" }, () => {
        loadMessages();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations", filter: `id=eq.${cid}` }, (payload) => {
        if (payload.new) {
          setActiveConv((prev) => prev ? { ...prev, ...payload.new } : null);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "typing_indicators", filter: `conversation_id=eq.${cid}` }, async () => {
        const { data } = await supabase
          .from("typing_indicators")
          .select("user_id, updated_at")
          .eq("conversation_id", cid)
          .gt("updated_at", new Date(Date.now() - 4000).toISOString());
        const typingIds = (data || []).map((t) => t.user_id).filter((id) => id !== myUserId);
        setTypingUsers(typingIds);
      })
      .on("broadcast", { event: "webrtc-signal" }, handleWebRTCSignal)
      .on("broadcast", { event: "request-accepted" }, () => {
        setActiveConv((prev) => prev ? { ...prev, is_request: false } : null);
      })
      .subscribe();

    rtcChannelRef.current = ch;
    return () => {
      supabase.removeChannel(ch);
    };
  }, [activeConv?.conv_id, loadMessages, myUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingAttachments]);

  // =========================================================================
  // 6. SEND MESSAGE (TEXT, VOICE, MEDIA, VIEW-ONCE, REPLIES)
  // =========================================================================
  const handleSendMessage = async (customContent = null, mediaType = "text", mediaUrl = null, mediaMeta = null) => {
    const content = customContent || messageText.trim();
    if (!content && !mediaUrl && pendingAttachments.length === 0) return;
    if (isTargetBlocked || hasBlockedTarget) {
      alert("Cannot send messages in a blocked conversation.");
      return;
    }

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
          content: content || `Shared ${att.type}`,
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

        setMessages((prev) => [...prev, { id: "temp_" + Date.now(), ...msgRow }]);

        try {
          await supabase.from("messages").insert([msgRow]);
          await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
        } catch (err) {
          console.warn("Insert message error:", err);
        }
      } else {
        const legacyRow = {
          sender_email: myEmail,
          sender_name: myName,
          sender_avatar: myAvatar,
          recipient_email: activeConv?.email || activeRecipient?.email,
          recipient_name: activeRecipient?.display_name || activeRecipient?.full_name || "Engineer",
          recipient_avatar: activeRecipient?.avatar_url || null,
          content: item.content,
          message_type: item.media_type,
          attachment_url: item.media_url,
          attachment_name: item.media_metadata?.name || null,
          attachment_size: item.media_metadata?.size || null,
          reactions: [],
          is_read: false,
          created_at: new Date().toISOString()
        };

        setMessages((prev) => [...prev, { id: "temp_" + Date.now(), ...legacyRow }]);
        try {
          await supabase.from("nova_messages").insert([legacyRow]);
        } catch (err) {
          console.warn("Insert legacy message error:", err);
        }
      }
    }
  };

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    if (!activeConv?.conv_id || !myUserId) return;

    supabase.from("typing_indicators").upsert(
      { conversation_id: activeConv.conv_id, user_id: myUserId, updated_at: new Date().toISOString() },
      { onConflict: "conversation_id,user_id" }
    ).then(() => {});

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      supabase.from("typing_indicators").delete().eq("conversation_id", activeConv.conv_id).eq("user_id", myUserId);
    }, 3000);
  };

  // =========================================================================
  // 7. FILE & MEDIA UPLOAD TO 'chat-media' SUPABASE STORAGE
  // =========================================================================
  const uploadToStorage = async (file, folder = "attachments") => {
    try {
      const ext = file.name ? file.name.split(".").pop() : "bin";
      const filePath = `${myUserId}/${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("chat-media").upload(filePath, file, {
        upsert: true,
        contentType: file.type || "application/octet-stream"
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("chat-media").getPublicUrl(filePath);
      return pub.publicUrl;
    } catch (err) {
      console.warn("Upload storage error, using fallback:", err);
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

  // =========================================================================
  // 8. VOICE NOTE RECORDING (MediaRecorder + Waveform)
  // =========================================================================
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
      alert("Microphone permission required for voice notes.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      clearInterval(voiceTimerRef.current);
    }
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      clearInterval(voiceTimerRef.current);
    }
  };

  // =========================================================================
  // 9. REACTIONS, DELETION, PINNING & VIEW-ONCE
  // =========================================================================
  const handleToggleReaction = async (msgId, emoji) => {
    if (!msgId) return;
    const existing = reactions.find((r) => r.message_id === msgId && r.user_id === myUserId && r.emoji === emoji);
    if (existing) {
      setReactions((prev) => prev.filter((r) => r.id !== existing.id));
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      const newRx = { id: "rx_" + Date.now(), message_id: msgId, user_id: myUserId, emoji: emoji };
      setReactions((prev) => [...prev, newRx]);
      await supabase.from("message_reactions").insert([
        { message_id: msgId, user_id: myUserId, emoji: emoji }
      ]);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    try {
      if (!String(msgId).startsWith("temp_")) {
        await supabase.from("messages").delete().eq("id", msgId);
        await supabase.from("nova_messages").delete().eq("id", msgId);
      }
    } catch (err) {}
  };

  const handleTogglePin = async (msg) => {
    const willPin = !msg.is_pinned;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_pinned: willPin } : m)));
    setPinnedMessage(willPin ? msg : null);
    try {
      await supabase.from("messages").update({ is_pinned: willPin }).eq("id", msg.id);
    } catch (err) {}
  };

  const openSecureViewOnce = async (msg) => {
    if (msg.user_id === myUserId) {
      setSecureLightboxMsg(msg);
      return;
    }

    try {
      const { data: res } = await supabase.rpc("mark_message_viewed", {
        p_message_id: msg.id
      });
      if (res?.already_viewed) {
        alert("This view-once media has already expired.");
        return;
      }
      setSecureLightboxMsg(msg);
      loadMessages();
    } catch (err) {
      setSecureLightboxMsg(msg);
    }
  };

  // =========================================================================
  // 10. REAL WEBRTC AUDIO & VIDEO CALLING (ONLY FOR ACCEPTED USERS)
  // =========================================================================
  const handleWebRTCSignal = async (payload) => {
    const data = payload.payload;
    if (!data || data.to !== myUserId) return;

    if (data.type === "offer") {
      setIncomingCallData(data);
      setActiveCall({
        type: data.callType || "audio",
        status: "incoming",
        duration: 0,
        caller: data.callerName || "Engineer"
      });
    } else if (data.type === "answer") {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.data));
      }
      setActiveCall((prev) => (prev ? { ...prev, status: "connected" } : null));
      startCallTimer();
    } else if (data.type === "ice-candidate") {
      if (peerConnectionRef.current && data.data) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.data));
        } catch (e) {}
      }
    } else if (data.type === "end-call" || data.type === "reject-call") {
      endCallCleanup();
    } else if (data.type === "video-upgrade-request") {
      setVideoUpgradeRequested(true);
    } else if (data.type === "video-upgrade-accept") {
      upgradeToVideoTracks();
    }
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
      } else {
        if (!remoteAudioRef.current) {
          remoteAudioRef.current = new Audio();
          remoteAudioRef.current.autoplay = true;
        }
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && rtcChannelRef.current) {
        const targetUserId = activeRecipient?.user_id || activeRecipient?.id;
        rtcChannelRef.current.send({
          type: "broadcast",
          event: "webrtc-signal",
          payload: { type: "ice-candidate", from: myUserId, to: targetUserId, data: event.candidate }
        });
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const initiateCall = async (type) => {
    if (activeConv?.is_request) {
      alert("⚠️ Calls are locked until the message request is accepted by both users.");
      return;
    }

    const targetUserId = activeRecipient?.user_id || activeRecipient?.id;
    if (!targetUserId) {
      alert("Please select an active user to call.");
      return;
    }

    setActiveCall({ type, status: "calling", duration: 0 });
    setIsMicMuted(false);
    setIsSpeakerOn(false);
    setIsVideoCameraOn(true);
    setCallKeypadTyped("");

    try {
      const pc = await setupWebRTC(type);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (rtcChannelRef.current) {
        rtcChannelRef.current.send({
          type: "broadcast",
          event: "webrtc-signal",
          payload: {
            type: "offer",
            from: myUserId,
            callerName: myName,
            to: targetUserId,
            callType: type,
            data: offer
          }
        });
      }

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

  const acceptIncomingCall = async () => {
    if (!incomingCallData) return;
    const type = incomingCallData.callType || "audio";
    setActiveCall({ type, status: "connected", duration: 0 });

    try {
      const pc = await setupWebRTC(type);
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCallData.data));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (rtcChannelRef.current) {
        rtcChannelRef.current.send({
          type: "broadcast",
          event: "webrtc-signal",
          payload: { type: "answer", from: myUserId, to: incomingCallData.from, data: answer }
        });
      }
      startCallTimer();
    } catch (err) {
      startCallTimer();
    }
  };

  const rejectIncomingCall = () => {
    if (rtcChannelRef.current && incomingCallData) {
      rtcChannelRef.current.send({
        type: "broadcast",
        event: "webrtc-signal",
        payload: { type: "reject-call", from: myUserId, to: incomingCallData.from }
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

  const endCall = () => {
    if (isCallRecording) stopCallRecording();
    if (callKeypadTyped && activeConv?.conv_id) {
      handleSendMessage(`📞 Call Keypad entries: ${callKeypadTyped}`);
    }

    const targetUserId = activeRecipient?.user_id || activeRecipient?.id;
    if (rtcChannelRef.current && targetUserId) {
      rtcChannelRef.current.send({
        type: "broadcast",
        event: "webrtc-signal",
        payload: { type: "end-call", from: myUserId, to: targetUserId }
      });
    }

    if (callDuration > 0) {
      handleSendMessage(`📞 Call ended • Duration: ${formatDuration(callDuration)}`);
    }

    endCallCleanup();
  };

  const endCallCleanup = () => {
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

  const upgradeToVideoTracks = async () => {
    try {
      const vidStream = await navigator.mediaDevices.getUserMedia({ video: true });
      vidStream.getVideoTracks().forEach((track) => {
        localStreamRef.current?.addTrack(track);
        peerConnectionRef.current?.addTrack(track, localStreamRef.current);
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
      setActiveCall((prev) => (prev ? { ...prev, type: "video" } : null));
    } catch (e) {}
  };

  const startCallRecording = () => {
    try {
      const tracks = [];
      if (localStreamRef.current) tracks.push(...localStreamRef.current.getTracks());
      if (remoteStreamRef.current) tracks.push(...remoteStreamRef.current.getTracks());
      if (tracks.length === 0) return;

      const combined = new MediaStream(tracks);
      const rec = new MediaRecorder(combined);
      callRecChunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) callRecChunks.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(callRecChunks.current, { type: "audio/webm" });
        const voiceFile = new File([blob], `call_rec_${Date.now()}.webm`, { type: "audio/webm" });
        const publicUrl = await uploadToStorage(voiceFile, "recordings");
        handleSendMessage("📼 Call Recording", "voice", publicUrl, {
          name: `call_recording_${Date.now()}.webm`,
          size: `${(blob.size / 1024).toFixed(1)} KB`
        });
      };
      rec.start();
      callRecRef.current = rec;
      setIsCallRecording(true);
    } catch (err) {
      alert("Call recording failed.");
    }
  };

  const stopCallRecording = () => {
    callRecRef.current?.stop();
    callRecRef.current = null;
    setIsCallRecording(false);
  };

  // =========================================================================
  // 11. GROUP CREATION & MANAGEMENT
  // =========================================================================
  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || selectedGroupUsers.length === 0) return;

    try {
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({
          type: "group",
          name: newGroupName.trim(),
          created_by: myUserId,
          is_request: false
        })
        .select("id")
        .single();

      if (error || !conv) throw error || new Error("Failed to create group");

      const memberRows = [myUserId, ...selectedGroupUsers.map((u) => u.user_id || u.id)].map((uid) => ({
        conversation_id: conv.id,
        user_id: uid
      }));

      await supabase.from("conversation_participants").insert(memberRows);

      setShowCreateGroupModal(false);
      setNewGroupName("");
      setSelectedGroupUsers([]);
      await loadConversations();
    } catch (err) {
      alert("Error creating group: " + err.message);
    }
  };

  // =========================================================================
  // 12. TENOR GIF SEARCH
  // =========================================================================
  const searchGifs = async (query) => {
    setGifSearchQuery(query);
    if (!query.trim()) {
      setGifResults([]);
      return;
    }
    setGifLoading(true);
    try {
      const res = await fetch(`https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=LIVDSRZULELA&limit=12`);
      const json = await res.json();
      setGifResults((json.results || []).map((r) => ({ id: r.id, url: r.media[0].gif.url })));
    } catch (err) {
      console.warn("GIF fetch error:", err);
    } finally {
      setGifLoading(false);
    }
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Count pending requests for receiver
  const pendingRequestsCount = conversations.filter((c) => c.is_request && c.created_by !== myUserId).length;

  // Filtered conversation list
  const filteredConvs = conversations.filter((c) => {
    const matchSearch = (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (c.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === "direct") return c.type === "dm" && !c.is_request;
    if (activeTab === "groups") return c.type === "group";
    if (activeTab === "requests") return c.is_request;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[250] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-in fade-in">
      <div className={`${theme.cardBg} border ${theme.modalBorder} ${theme.bg} rounded-3xl shadow-2xl w-full max-w-6xl h-[88vh] flex overflow-hidden font-sans relative transition-colors duration-200`}>

        {/* ================================================================= */}
        {/* 1. CALL SCREEN OVERLAY (AUDIO / VIDEO / FACETIME / KEYPAD)         */}
        {/* ================================================================= */}
        {activeCall && (
          <div className="absolute inset-0 z-[100] bg-slate-950/98 flex flex-col items-center justify-between p-6 text-white animate-in zoom-in-95">
            {/* Keypad Overlay */}
            {showCallKeypad && (
              <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
                <button
                  onClick={() => setShowCallKeypad(false)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="text-white text-3xl font-mono tracking-widest mb-6 min-h-[44px]">
                  {callKeypadTyped || "—"}
                </div>
                <div className="grid grid-cols-3 gap-4 w-[270px]">
                  {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
                    <button
                      key={k}
                      onClick={() => setCallKeypadTyped((p) => p + k)}
                      className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 text-white text-2xl font-light border border-white/10 flex items-center justify-center transition-all"
                    >
                      {k}
                    </button>
                  ))}
                </div>
                {callKeypadTyped && (
                  <button onClick={() => setCallKeypadTyped("")} className="mt-5 text-xs text-white/60 hover:text-white underline">
                    Clear Keypad
                  </button>
                )}
              </div>
            )}

            {/* Video Streams */}
            {activeCall.type === "video" && (
              <div className="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-28 right-6 w-32 h-44 bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Top Bar Header */}
            <div className="relative z-10 text-center space-y-2 mt-6">
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-4 border-white/20 shadow-2xl flex items-center justify-center text-4xl font-black mx-auto overflow-hidden">
                {activeRecipient?.avatar_url || activeRecipient?.avatar ? (
                  <img src={activeRecipient.avatar_url || activeRecipient.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (activeRecipient?.display_name || activeRecipient?.name || "E")[0].toUpperCase()
                )}
                {activeCall.status === "connected" && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                )}
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                {customNickname || activeRecipient?.display_name || activeRecipient?.name || "Nova Engineer"}
              </h3>
              <p className={`text-sm font-semibold tracking-wider ${activeCall.status === "connected" ? "text-emerald-400" : "text-blue-300 animate-pulse"}`}>
                {activeCall.status === "calling" ? `Calling ${activeCall.type}...` : activeCall.status === "incoming" ? `Incoming ${activeCall.type} call...` : `${activeCall.type.toUpperCase()} • ${formatDuration(callDuration)}`}
              </p>
            </div>

            {/* Video Upgrade Notification */}
            {videoUpgradeRequested && (
              <div className="relative z-20 bg-slate-900/90 border border-blue-500/50 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
                <Video className="w-6 h-6 text-blue-400 animate-bounce" />
                <span className="text-xs font-bold text-white">Partner requested video upgrade</span>
                <button onClick={upgradeToVideoTracks} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold">Accept</button>
                <button onClick={() => setVideoUpgradeRequested(false)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold">Decline</button>
              </div>
            )}

            {/* In-Call Controls */}
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
                    className="p-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:scale-105 transition-all"
                    title="Accept"
                  >
                    <Phone className="w-7 h-7" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-2xl">
                  <button
                    onClick={toggleCallMute}
                    className={`p-3.5 rounded-full transition-all ${isMicMuted ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                    title={isMicMuted ? "Unmute" : "Mute"}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsSpeakerOn((p) => !p)}
                    className={`p-3.5 rounded-full transition-all ${isSpeakerOn ? "bg-blue-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                    title="Speaker"
                  >
                    {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>

                  {activeCall.type === "video" ? (
                    <button
                      onClick={toggleCallVideoCamera}
                      className={`p-3.5 rounded-full transition-all ${!isVideoCameraOn ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                      title={isVideoCameraOn ? "Camera Off" : "Camera On"}
                    >
                      {isVideoCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                  ) : (
                    <button
                      onClick={() => upgradeToVideoTracks()}
                      className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                      title="Switch to Video"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    onClick={() => isCallRecording ? stopCallRecording() : startCallRecording()}
                    className={`p-3.5 rounded-full transition-all ${isCallRecording ? "bg-rose-500 text-white animate-pulse" : "bg-white/10 hover:bg-white/20 text-white"}`}
                    title="Record Call"
                  >
                    <Radio className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setShowCallKeypad((p) => !p)}
                    className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Keypad"
                  >
                    <Grip className="w-5 h-5" />
                  </button>

                  <button
                    onClick={endCall}
                    className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl hover:scale-105 transition-all"
                    title="End Call"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. LEFT SIDEBAR: CONVERSATIONS, SEARCH & THEME TOGGLE             */}
        {/* ================================================================= */}
        <div className={`w-full sm:w-80 md:w-96 border-r ${theme.sidebarBg} flex flex-col shrink-0`}>
          {/* Top User Bar with Dark/Light Mode Switch */}
          <div className={`p-4 border-b ${theme.modalBorder} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700">
                {myAvatar ? <img src={myAvatar} alt="" className="w-full h-full object-cover" /> : myName[0].toUpperCase()}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm">{myName}</h3>
                <p className={`text-[11px] ${theme.secondaryText} truncate max-w-[130px]`}>{myEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Dark / Light Mode Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl ${theme.iconBtn} transition-all`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <button
                onClick={() => setShowNewChatModal(true)}
                className="p-2 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white transition-all"
                title="New Direct Message"
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

              {onClose && (
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl ${theme.iconBtn} transition-all`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="p-3">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-2.5 ${theme.secondaryText}`} />
              <input
                type="text"
                placeholder="Search chats or registered engineers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 ${theme.inputBg} rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className={`px-3 pb-2 flex gap-1 border-b ${theme.modalBorder}`}>
            {[
              { id: "all", label: "All Chats" },
              { id: "direct", label: "Direct" },
              { id: "groups", label: "Groups" },
              { id: "requests", label: `Requests${pendingRequestsCount > 0 ? ` (${pendingRequestsCount})` : ""}` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow" : `${theme.secondaryText} ${theme.hoverBg}`}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conversations Scroll List */}
          <div className={`flex-1 overflow-y-auto divide-y ${isDarkMode ? "divide-slate-800/40" : "divide-slate-200/60"}`}>
            {filteredConvs.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <MessageSquare className={`w-8 h-8 mx-auto ${theme.secondaryText}`} />
                <p className="text-xs font-bold">No conversations in this tab</p>
                <p className={`text-[11px] ${theme.secondaryText}`}>Click + to start chatting with any registered engineer.</p>
              </div>
            ) : (
              filteredConvs.map((c) => {
                const isSelected = activeConvId === c.id;
                const isOnline = c.email && onlineUsers.has(c.email);
                const isPendingReq = c.is_request && c.created_by !== myUserId;

                return (
                  <button
                    key={c.id}
                    onClick={() => selectConversation(c)}
                    className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${isSelected ? theme.activeConvBg : theme.hoverBg}`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-full ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-200 border-slate-300 text-slate-700"} border flex items-center justify-center font-bold text-sm overflow-hidden`}>
                        {c.avatar ? (
                          <img src={c.avatar} alt="" className="w-full h-full object-cover" />
                        ) : c.type === "group" ? (
                          <Users className="w-5 h-5 text-blue-500" />
                        ) : (
                          (c.name || "U")[0].toUpperCase()
                        )}
                      </div>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="font-bold text-xs truncate">{c.name}</h4>
                          {isPendingReq && (
                            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[9px] font-extrabold">Request</span>
                          )}
                        </div>
                        <span className={`text-[10px] ${theme.secondaryText} whitespace-nowrap ml-1`}>{c.lastTime}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className={`text-[11px] ${theme.secondaryText} truncate max-w-[170px]`}>{c.lastMessage}</p>
                        {c.unread > 0 && (
                          <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[9px] font-black">{c.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. RIGHT MAIN CHAT ROOM                                          */}
        {/* ================================================================= */}
        {activeConv ? (
          <div className={`flex-1 flex flex-col ${theme.chatBg} relative min-w-0`} style={activeConv.wallpaper_url ? { backgroundImage: `url(${activeConv.wallpaper_url})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
            {/* Wallpaper overlay */}
            {activeConv.wallpaper_url && <div className={`absolute inset-0 ${isDarkMode ? "bg-slate-950/80" : "bg-white/80"} backdrop-blur-sm pointer-events-none`} />}

            {/* Chat Room Header */}
            <div className={`relative z-10 p-3.5 border-b ${theme.headerBg} backdrop-blur-md flex items-center justify-between`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`relative w-10 h-10 rounded-full ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-200 border-slate-300 text-slate-700"} border flex items-center justify-center font-bold text-sm overflow-hidden shrink-0`}>
                  {activeConv.avatar ? (
                    <img src={activeConv.avatar} alt="" className="w-full h-full object-cover" />
                  ) : activeConv.type === "group" ? (
                    <Users className="w-5 h-5 text-blue-500" />
                  ) : (
                    (activeConv.name || "U")[0].toUpperCase()
                  )}
                  {activeConv.email && onlineUsers.has(activeConv.email) && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm truncate">
                      {customNickname || activeConv.name}
                    </h3>
                    {activeConv.type === "group" ? (
                      <span className="px-2 py-0.5 bg-blue-600/15 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold">Group</span>
                    ) : activeConv.is_request ? (
                      <span className="px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded text-[10px] font-bold">Pending Request</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] ${theme.secondaryText} truncate`}>
                    {activeConv.type === "group" ? "Multi-engineer discussion" : onlineUsers.has(activeConv.email) ? "Active now" : activeConv.email || "Active"}
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
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
                    onClick={() => setShowDetailsPanel((p) => !p)}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all`}
                    title="Contact Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* MESSAGE REQUEST ACCEPT / REJECT BANNER FOR RECEIVER */}
            {isPendingRequestForMe && (
              <div className="relative z-10 px-4 py-3 bg-amber-500/10 border-b border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top">
                <div className="flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                  <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <span className="font-extrabold">{activeConv.name}</span> wants to connect with you.
                    <p className="text-[11px] opacity-80">Accept this request to unlock direct voice/video calls, media sharing, and replies.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleAcceptRequest}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept Request
                  </button>
                  <button
                    onClick={handleRejectRequest}
                    className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* SENDER WAITING NOTICE */}
            {isPendingRequestByMe && (
              <div className="relative z-10 px-4 py-2 bg-blue-500/10 border-b border-blue-500/20 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                <span>Message request sent. Audio/video calls and direct features will unlock once <strong>{activeConv.name}</strong> accepts.</span>
              </div>
            )}

            {/* Chat In-Line Search Bar */}
            {chatSearchOpen && (
              <div className={`relative z-10 p-2 ${theme.headerBg} border-b ${theme.modalBorder} flex items-center gap-2`}>
                <Search className={`w-4 h-4 ${theme.secondaryText} ml-2`} />
                <input
                  type="text"
                  placeholder="Search in this chat transcript..."
                  value={chatSearchText}
                  onChange={(e) => setChatSearchText(e.target.value)}
                  className="flex-1 bg-transparent text-xs focus:outline-none"
                  autoFocus
                />
                <button onClick={() => { setChatSearchOpen(false); setChatSearchText(""); }} className={`p-1 ${theme.secondaryText} hover:text-slate-900 dark:hover:text-white`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Pinned Message Banner */}
            {pinnedMessage && (
              <div className="relative z-10 px-4 py-2 bg-blue-600/10 border-b border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Pin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">Pinned:</span>
                  <p className="text-[11px] truncate">{pinnedMessage.content}</p>
                </div>
                <button onClick={() => handleTogglePin(pinnedMessage)} className={`p-1 ${theme.secondaryText} hover:text-slate-900 dark:hover:text-white`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Messages Stream */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className={`h-full flex flex-col items-center justify-center ${theme.secondaryText} space-y-3`}>
                  <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-70" />
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Real-Time Encrypted Messaging</p>
                  <p className="text-xs max-w-xs text-center">
                    Send high-resolution blueprints, voice notes, engineering calculations, or initiate audio/video calls.
                  </p>
                </div>
              ) : (
                messages
                  .filter((m) => !chatSearchText || (m.content || "").toLowerCase().includes(chatSearchText.toLowerCase()))
                  .map((m) => {
                    const isMine = m.user_id === myUserId || m.sender_email === myEmail;
                    const msgRx = reactions.filter((r) => r.message_id === m.id);
                    const isViewOnceExpired = m.view_limit > 0 && m.view_count >= m.view_limit;

                    return (
                      <div key={m.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"} group`}>
                        {m.reply_to_id && (
                          <div className={`mb-1 px-3 py-1 rounded-xl text-[10px] ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"} border-l-2 border-blue-500 max-w-xs truncate`}>
                            Replying to message
                          </div>
                        )}

                        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                          {!isMine && (
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                              {m.sender_avatar ? <img src={m.sender_avatar} alt="" className="w-full h-full object-cover" /> : (m.sender_name || "E")[0].toUpperCase()}
                            </div>
                          )}

                          <div className={`relative px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${isMine ? theme.outgoingBubble + " rounded-br-xs" : theme.incomingBubble + " rounded-bl-xs"}`}>
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

                            {/* Image Attachment */}
                            {m.media_type === "image" && m.media_url && !m.view_limit && (
                              <div className="mb-2 rounded-xl overflow-hidden max-h-60">
                                <img src={m.media_url} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-95" onClick={() => window.open(m.media_url, "_blank")} />
                              </div>
                            )}

                            {/* Video Attachment */}
                            {m.media_type === "video" && m.media_url && !m.view_limit && (
                              <div className="mb-2 rounded-xl overflow-hidden max-h-60 bg-black">
                                <video src={m.media_url} controls className="w-full h-full object-contain" />
                              </div>
                            )}

                            {/* Voice Note Audio Player */}
                            {m.media_type === "voice" && m.media_url && (
                              <div className="flex items-center gap-2 my-1 bg-black/10 dark:bg-black/30 p-2 rounded-xl">
                                <audio src={m.media_url} controls className="w-48 sm:w-56 h-8" />
                              </div>
                            )}

                            {/* Generic File Attachment */}
                            {m.media_type === "file" && m.media_url && (
                              <a href={m.media_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 my-1 p-2 bg-black/10 dark:bg-black/30 hover:bg-black/20 rounded-xl transition-colors">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <div className="min-w-0">
                                  <p className="font-bold text-[11px] truncate">{m.media_metadata?.name || "Attached File"}</p>
                                  <p className="text-[9px] opacity-80">{m.media_metadata?.size || "Download"}</p>
                                </div>
                                <Download className="w-4 h-4 ml-auto" />
                              </a>
                            )}

                            {/* Sticker or GIF */}
                            {m.media_type === "gif" && m.media_url && (
                              <img src={m.media_url} alt="GIF" className="rounded-xl max-w-[200px] my-1" />
                            )}

                            {/* Text Content */}
                            {m.content && m.content !== "🎤 Voice Note" && (
                              <p className="whitespace-pre-wrap break-words">{m.content}</p>
                            )}

                            {/* Timestamp & double checkmarks */}
                            <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMine ? "text-blue-100" : theme.secondaryText}`}>
                              <span>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                              {isMine && <DoubleCheck className="w-3 h-3 text-emerald-300" />}
                            </div>
                          </div>

                          {/* Hover Action Menu */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <button onClick={() => setReplyingTo(m)} className={`p-1 rounded-full ${theme.iconBtn}`} title="Reply">
                              <MessageSquare className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleToggleReaction(m.id, "❤️")} className={`p-1 rounded-full ${theme.iconBtn} hover:text-rose-500`} title="Love">
                              <Heart className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleTogglePin(m)} className={`p-1 rounded-full ${theme.iconBtn} hover:text-blue-500`} title="Pin">
                              <Pin className="w-3 h-3" />
                            </button>
                            {isMine && (
                              <button onClick={() => handleDeleteMessage(m.id)} className={`p-1 rounded-full ${theme.iconBtn} hover:text-rose-500`} title="Delete">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Reaction Badges */}
                        {msgRx.length > 0 && (
                          <div className={`flex items-center gap-1 mt-1 px-2 ${isMine ? "mr-2" : "ml-9"}`}>
                            {Array.from(new Set(msgRx.map((r) => r.emoji))).map((emoji) => {
                              const count = msgRx.filter((r) => r.emoji === emoji).length;
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => handleToggleReaction(m.id, emoji)}
                                  className={`px-1.5 py-0.5 rounded-full ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300 shadow-sm"} border text-[10px] font-bold flex items-center gap-1 hover:scale-110 transition-transform`}
                                >
                                  <span>{emoji}</span>
                                  <span className={theme.secondaryText}>{count}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="px-4 py-1.5 text-[11px] text-blue-600 dark:text-blue-400 italic flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Engineer is typing...</span>
              </div>
            )}

            {/* Staged Attachments Preview Bar */}
            {pendingAttachments.length > 0 && (
              <div className={`relative z-10 px-4 py-2 ${theme.headerBg} border-t ${theme.modalBorder} flex items-center gap-3 overflow-x-auto`}>
                {pendingAttachments.map((att, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-blue-500/50 shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    {att.type === "image" ? (
                      <img src={att.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-blue-500" />
                    )}
                    <button
                      onClick={() => setPendingAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Replying Banner */}
            {replyingTo && (
              <div className={`relative z-10 px-4 py-2 ${theme.headerBg} border-t ${theme.modalBorder} flex items-center justify-between`}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1 h-8 bg-blue-600 rounded-full shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Replying to message</p>
                    <p className={`text-[11px] ${theme.secondaryText} truncate`}>{replyingTo.content}</p>
                  </div>
                </div>
                <button onClick={() => setReplyingTo(null)} className={`p-1 ${theme.secondaryText} hover:text-slate-900 dark:hover:text-white`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* EMOJI / STICKER / GIF PICKERS */}
            {showEmojiPicker && (
              <div className={`relative z-20 p-3 ${theme.headerBg} border-t ${theme.modalBorder} max-h-48 overflow-y-auto`}>
                <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-2 mb-2`}>
                  <span className="text-xs font-bold">Emoji Picker</span>
                  <button onClick={() => setShowEmojiPicker(false)}><X className="w-4 h-4" /></button>
                </div>
                {Object.entries(EMOJI_CATEGORIES).map(([cat, emojis]) => (
                  <div key={cat} className="mb-2">
                    <p className={`text-[10px] font-bold ${theme.secondaryText} uppercase tracking-wider mb-1`}>{cat}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {emojis.map((em) => (
                        <button key={em} onClick={() => setMessageText((p) => p + em)} className="text-lg hover:scale-125 transition-transform">
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showStickerPicker && (
              <div className={`relative z-20 p-3 ${theme.headerBg} border-t ${theme.modalBorder} max-h-48 overflow-y-auto`}>
                <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-2 mb-2`}>
                  <span className="text-xs font-bold">Animated Stickers</span>
                  <button onClick={() => setShowStickerPicker(false)}><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {STICKER_PACKS.map((stk) => (
                    <button
                      key={stk.id}
                      onClick={() => handleSendMessage(`Sticker: ${stk.name}`, "gif", stk.url)}
                      className={`p-1 ${theme.iconBtn} rounded-xl flex items-center justify-center hover:scale-105 transition-all`}
                    >
                      <img src={stk.url} alt={stk.name} className="w-16 h-16 object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showGifPicker && (
              <div className={`relative z-20 p-3 ${theme.headerBg} border-t ${theme.modalBorder} max-h-56 overflow-y-auto`}>
                <div className={`flex items-center gap-2 border-b ${theme.modalBorder} pb-2 mb-2`}>
                  <Search className={`w-4 h-4 ${theme.secondaryText}`} />
                  <input
                    type="text"
                    placeholder="Search Tenor GIFs..."
                    value={gifSearchQuery}
                    onChange={(e) => searchGifs(e.target.value)}
                    className="flex-1 bg-transparent text-xs focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => setShowGifPicker(false)}><X className="w-4 h-4" /></button>
                </div>
                {gifLoading ? (
                  <div className={`p-4 text-center text-xs ${theme.secondaryText}`}>Searching GIFs...</div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {gifResults.map((gif) => (
                      <button
                        key={gif.id}
                        onClick={() => handleSendMessage("GIF", "gif", gif.url)}
                        className="rounded-xl overflow-hidden hover:opacity-90 hover:scale-105 transition-all h-20 bg-slate-200 dark:bg-slate-800"
                      >
                        <img src={gif.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Chat Composer Input */}
            <div className={`relative z-10 p-3 border-t ${theme.modalBorder} ${theme.headerBg} backdrop-blur-md`}>
              {isRecordingVoice ? (
                <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/40 p-3 rounded-2xl animate-pulse">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                    <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">{formatDuration(voiceDuration)}</span>
                    <span className="text-xs text-rose-500">Recording voice note...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={cancelVoiceRecording} className={`px-3 py-1.5 ${theme.iconBtn} text-xs font-bold rounded-xl`}>
                      Cancel
                    </button>
                    <button onClick={stopVoiceRecording} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1">
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
                    title="Attach Files"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewOnceMode((p) => !p)}
                    className={`p-2.5 rounded-xl transition-all shrink-0 ${viewOnceMode ? "bg-amber-500 text-white font-bold" : theme.iconBtn}`}
                    title={viewOnceMode ? "View-Once Active" : "Enable View-Once"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { setShowEmojiPicker((p) => !p); setShowStickerPicker(false); setShowGifPicker(false); }}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all shrink-0`}
                    title="Emojis"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { setShowStickerPicker((p) => !p); setShowEmojiPicker(false); setShowGifPicker(false); }}
                    className={`p-2.5 rounded-xl ${theme.iconBtn} transition-all shrink-0`}
                    title="Stickers"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { setShowGifPicker((p) => !p); setShowEmojiPicker(false); setShowStickerPicker(false); }}
                    className={`px-2.5 py-1.5 rounded-xl ${theme.iconBtn} font-bold text-[11px] transition-all shrink-0`}
                    title="GIFs"
                  >
                    GIF
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    placeholder={isPendingRequestForMe ? "Accept request above to reply..." : viewOnceMode ? "Add a view-once note..." : "Type your message..."}
                    value={messageText}
                    disabled={isPendingRequestForMe}
                    onChange={handleTextChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className={`flex-1 ${theme.inputBg} rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />

                  {/* Voice Note or Send Button */}
                  {messageText.trim() || pendingAttachments.length > 0 ? (
                    <button
                      onClick={() => handleSendMessage()}
                      className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:scale-105 transition-all shrink-0"
                      title="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={startVoiceRecording}
                      disabled={isPendingRequestForMe}
                      className={`p-2.5 rounded-2xl ${theme.iconBtn} hover:bg-blue-600 hover:text-white transition-all shrink-0 disabled:opacity-40`}
                      title="Hold to Record Voice Note"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${theme.secondaryText} space-y-3`}>
            <MessageSquare className="w-12 h-12 opacity-50" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">Nova Real-Time Messenger</h3>
            <p className="text-xs max-w-sm">
              Select an engineer from the left sidebar or start a new conversation.
            </p>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. DETAILS / USER PROFILE PANEL                                   */}
        {/* ================================================================= */}
        {showDetailsPanel && activeRecipient && (
          <div className={`w-72 border-l ${theme.sidebarBg} p-5 flex flex-col space-y-5 animate-in slide-in-from-right`}>
            <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
              <h4 className="font-extrabold text-sm">Contact Info</h4>
              <button onClick={() => setShowDetailsPanel(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto overflow-hidden border-2 border-slate-300 dark:border-slate-700">
                {activeRecipient.avatar_url || activeRecipient.avatar ? (
                  <img src={activeRecipient.avatar_url || activeRecipient.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (activeRecipient.display_name || activeRecipient.name || "E")[0].toUpperCase()
                )}
              </div>
              <h3 className="font-extrabold text-base">{customNickname || activeRecipient.display_name || activeRecipient.name}</h3>
              <p className={`text-xs ${theme.secondaryText}`}>{activeRecipient.email}</p>
              <span className="inline-block px-2.5 py-0.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold">
                {activeRecipient.plan || "Engineer"}
              </span>
            </div>

            <div className={`p-3 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-2xl border space-y-2`}>
              <label className={`text-[11px] font-bold ${theme.secondaryText}`}>Private Nickname</label>
              <input
                type="text"
                placeholder="e.g. Lead FEA"
                value={customNickname}
                onChange={(e) => {
                  setCustomNickname(e.target.value);
                  localStorage.setItem(`nova_nick_${activeConv?.id}_${myUserId}`, e.target.value);
                }}
                className={`w-full px-2.5 py-1.5 ${theme.inputBg} rounded-xl text-xs focus:outline-none`}
              />
            </div>

            <div className="mt-auto space-y-2">
              <button
                onClick={handleToggleBlock}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${hasBlockedTarget ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-rose-500/15 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white"}`}
              >
                <UserX className="w-4 h-4" />
                {hasBlockedTarget ? "Unblock User" : "Block User"}
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. GROUP SETTINGS MODAL                                           */}
        {/* ================================================================= */}
        {showGroupSettings && activeConv && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4`}>
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
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
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
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
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
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {(u.full_name || u.email)[0].toUpperCase()}
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
                        className="px-2.5 py-1 bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white rounded-lg text-[11px] font-bold"
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
        {/* 6. CREATE GROUP MODAL                                             */}
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
                  className={`w-full px-3.5 py-2.5 mt-1 ${theme.inputBg} rounded-xl text-xs focus:outline-none`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold ${theme.secondaryText}`}>Select Members ({selectedGroupUsers.length})</label>
                <div className={`max-h-48 overflow-y-auto divide-y ${theme.modalBorder} mt-2`}>
                  {registeredUsers.map((u) => {
                    const isSel = selectedGroupUsers.some((s) => (s.id || s.user_id) === (u.id || u.user_id));
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setSelectedGroupUsers((prev) => isSel ? prev.filter((s) => (s.id || s.user_id) !== (u.id || u.user_id)) : [...prev, u]);
                        }}
                        className={`w-full p-2.5 flex items-center justify-between rounded-xl transition-all ${isSel ? "bg-blue-600/20 text-blue-600 dark:text-white" : theme.hoverBg}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 font-bold text-xs flex items-center justify-center">
                            {(u.full_name || u.email)[0].toUpperCase()}
                          </div>
                          <span className="text-xs font-bold">{u.full_name || u.email}</span>
                        </div>
                        {isSel && <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || selectedGroupUsers.length === 0}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-2xl shadow-xl transition-all"
              >
                Create Group
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. NEW DIRECT MESSAGE MODAL                                       */}
        {/* ================================================================= */}
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.cardBg} ${theme.bg} rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4`}>
              <div className={`flex items-center justify-between border-b ${theme.modalBorder} pb-3`}>
                <h3 className="font-extrabold text-base">New Conversation</h3>
                <button onClick={() => setShowNewChatModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <p className={`text-xs ${theme.secondaryText}`}>Select any registered engineer in the Nova platform:</p>

              <div className={`max-h-64 overflow-y-auto divide-y ${theme.modalBorder}`}>
                {registeredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      selectConversation({
                        id: `user_${u.id}`,
                        conv_id: null,
                        type: "dm",
                        name: u.full_name || u.display_name || u.email,
                        email: u.email,
                        avatar: u.avatar_url,
                        is_request: true,
                        created_by: myUserId,
                        otherUser: u
                      });
                      setShowNewChatModal(false);
                    }}
                    className={`w-full p-3 flex items-center gap-3 ${theme.hoverBg} rounded-2xl transition-colors text-left`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {(u.full_name || u.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{u.full_name || u.display_name || u.email}</h4>
                      <p className={`text-[11px] ${theme.secondaryText}`}>{u.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 8. SECURE VIEW-ONCE LIGHTBOX                                      */}
        {/* ================================================================= */}
        {secureLightboxMsg && (
          <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-6 animate-in zoom-in-95">
            <button
              onClick={() => setSecureLightboxMsg(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                <Eye className="w-4 h-4" /> Self-Destructing View-Once Media
              </div>
            </div>
            {secureLightboxMsg.media_type === "video" ? (
              <video src={secureLightboxMsg.media_url} autoPlay controls className="max-w-2xl max-h-[70vh] rounded-2xl shadow-2xl" />
            ) : (
              <img src={secureLightboxMsg.media_url} alt="" className="max-w-2xl max-h-[70vh] rounded-2xl shadow-2xl object-contain" />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
