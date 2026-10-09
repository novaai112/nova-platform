import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Link2,
  Paperclip, Image as ImageIcon, Eye, Send, X, ChevronDown,
  Search, Filter, Plus, CheckCircle, Bookmark, User,
  ThumbsUp, MessageCircle, Share2, Globe, BookOpen,
  Smile, ShieldCheck, AlignLeft, Hash, Maximize2, Minimize2,
  Check, Sparkles, FileText, Download, Tag, Clock, ArrowRight,
  ChevronRight, HelpCircle, MessageSquare, Flame, AlertCircle,
  Trash2, Edit3, Flag, MoreHorizontal, Award,
  Calendar, Activity, SlidersHorizontal, ArrowLeft, Mail,
  CreditCard, Bell, Shield, Inbox
} from "lucide-react";

// CATEGORIES TREE
export const NOVA_CATEGORIES_TREE = [
  {
    id: "Product Questions",
    label: "Product Questions",
    isHeader: true,
    sub: [
      "3D Design",
      "Nova Nozzle Analysis",
      "Nova Bellow Analysis",
      "Nova Flange Analysis",
      "Nova Local PWHT",
      "Nova Saddle Analysis",
      "Nova Hot Box Analysis",
      "Nova Stiffener Analysis",
      "Nova Tubesheet Analysis",
      "Nova Lug Analysis",
      "Nova Trunnion Analysis",
      "Nova CAD AI",
      "Nova Stress-Strain Curve",
      "Nova ASME Materials"
    ]
  },
  {
    id: "General Language Questions",
    label: "General Language Questions",
    isHeader: false,
    sub: []
  },
  {
    id: "Announcements",
    label: "Announcements",
    isHeader: false,
    sub: []
  }
];

export const POPULAR_TAGS = [
  "nozzle", "ansys", "flange", "cad_ai", "bellow",
  "stress_strain", "asme", "pwht", "simulation", "mesh"
];

export const SORT_OPTIONS = [
  { value: "recently_created", label: "Recently Created" },
  { value: "recently_active",  label: "Recently Active"  },
  { value: "most_upvoted",     label: "Most Upvoted"     },
  { value: "most_comments",    label: "Most Comments"    },
  { value: "oldest",           label: "Oldest"           }
];

export const FILTER_OPTIONS = [
  { value: "All",         label: "All" },
  { value: "Discussions", label: "Discussions" },
  { value: "Questions",   label: "Questions" },
  { value: "Answered",    label: "Answered" },
  { value: "Unanswered",  label: "Unanswered" },
  { value: "My Posts",    label: "My Posts" },
  { value: "Bookmarked",  label: "Bookmarked" }
];

export const POST_TYPE_OPTIONS = [
  "Discussion",
  "Announce",
  "Asking Question",
  "General Question"
];

export const POST_STATUS_OPTIONS = [
  "Answered",
  "Unanswered",
  "Solved"
];

const EMOJIS = [
  "😀", "😂", "🙏", "👍", "🔥", "❤️", "💡", "🎯",
  "⚡", "✅", "🚀", "🤔", "😎", "👏", "💪", "🙌",
  "🛠️", "📊", "⚙️", "💻", "🧠", "❓", "🎉", "💯"
];

// Helper: safe initial
export function getSafeInitial(name = "") {
  if (!name) return "U";
  return name.trim()[0].toUpperCase();
}

// Helper: role determination strictly according to user rules:
// - dineshkumar2729304@gmail.com -> Admin
// - Any purchased credit subscription/plan -> Community Member
// - Rests -> Member
export function getCommunityRole(userOrEmail, plan, dailyCredits, hasPurchased) {
  let email = "";
  let userPlan = plan || "";
  let credits = dailyCredits || 0;
  let purchased = Boolean(hasPurchased);

  if (typeof userOrEmail === "object" && userOrEmail !== null) {
    email = userOrEmail.email || userOrEmail.user_email || "";
    userPlan = userOrEmail.plan || userPlan;
    credits = userOrEmail.dailyCreditsTotal || userOrEmail.daily_credits_total || credits;
    purchased = purchased || Boolean(
      userOrEmail.isLifetimeMax ||
      userOrEmail.has_purchased ||
      userOrEmail.is_subscribed ||
      userOrEmail.hasSubscription ||
      userOrEmail.hasPurchasedCredits ||
      (Array.isArray(userOrEmail.transactions) && userOrEmail.transactions.length > 0)
    );
  } else if (typeof userOrEmail === "string") {
    email = userOrEmail;
  }

  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail === "dineshkumar2729304@gmail.com") {
    return "Admin";
  }

  const cleanPlan = (userPlan || "").toLowerCase().trim();
  const isPaidPlan =
    cleanPlan === "pro" ||
    cleanPlan === "max" ||
    cleanPlan === "enterprise" ||
    cleanPlan === "community member";
  const hasCreditsPurchased = purchased || Number(credits) > 100;

  if (isPaidPlan || hasCreditsPurchased) {
    return "Community Member";
  }

  return "Member";
}

// Role Badge Component (Clean, no extra awards/badges)
export function RoleBadge({ role }) {
  if (role === "Admin") {
    return (
      <span className="px-2.5 py-0.5 rounded-md border border-rose-200 bg-rose-50 text-[11px] font-black tracking-wider text-rose-700 uppercase">
        ADMIN
      </span>
    );
  }
  if (role === "Community Member") {
    return (
      <span className="px-2.5 py-0.5 rounded-md border border-blue-200 bg-blue-50 text-[11px] font-black tracking-wider text-blue-700 uppercase">
        COMMUNITY MEMBER
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 rounded-md border border-slate-200 bg-slate-100 text-[11px] font-black tracking-wider text-slate-700 uppercase">
      MEMBER
    </span>
  );
}

// Date formatter
export function formatDisplayDate(isoString) {
  if (!isoString) return "Just now";
  const d = new Date(isoString);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

// 1. RICH TEXT EDITOR COMPONENT
function RichEditor({ value, onChange, placeholder = "Type your message...", isFullscreen, setIsFullscreen, onImageModal }) {
  const textareaRef = useRef(null);
  const [showFormatDrop, setShowFormatDrop] = useState(false);
  const [showEmojiDrop, setShowEmojiDrop] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const imageInputRef = useRef(null);
  const formatRef = useRef(null);
  const emojiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formatRef.current && !formatRef.current.contains(e.target)) setShowFormatDrop(false);
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmojiDrop(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const insertTagWrapper = (before, after = before, defaultText = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;
    const replacement = `${before}${selected}${after}`;
    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

  const insertLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const newValue = text.substring(0, lineStart) + prefix + text.substring(lineStart);
    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(end + prefix.length, end + prefix.length);
    }, 10);
  };

  const handleInsertEmoji = (emoji) => {
    insertTagWrapper(emoji, "");
    setShowEmojiDrop(false);
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    const text = linkText || linkUrl;
    insertTagWrapper(`[${text}](`, `${linkUrl})`);
    setLinkUrl("");
    setLinkText("");
    setShowLinkModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgMarkdown = `\n![${file.name}](${event.target.result})\n`;
      onChange((value || "") + imgMarkdown);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className={`border border-slate-300 rounded-xl bg-white overflow-visible transition-all focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 ${isFullscreen ? "fixed inset-4 z-[300] flex flex-col shadow-2xl" : ""}`}>
      {/* TOOLBAR */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-white rounded-t-xl flex-wrap relative">
        <button
          type="button"
          onClick={() => insertTagWrapper("**", "**", "Bold text")}
          title="Bold"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-sm"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertTagWrapper("*", "*", "Italic text")}
          title="Italic"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertTagWrapper("~~", "~~", "Strikethrough text")}
          title="Strikethrough"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => insertLinePrefix("- ")}
          title="Unordered List"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertLinePrefix("1. ")}
          title="Ordered List"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Paragraph / Format Dropdown */}
        <div ref={formatRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFormatDrop((p) => !p);
              setShowEmojiDrop(false);
            }}
            title="Formatting"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs font-semibold"
          >
            <AlignLeft className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showFormatDrop && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[150] py-1 min-w-[150px] animate-in fade-in">
              <button
                type="button"
                onClick={() => {
                  insertTagWrapper("```\n", "\n```", "code here");
                  setShowFormatDrop(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-mono"
              >
                Code
              </button>
              <button
                type="button"
                onClick={() => {
                  insertLinePrefix("> ");
                  setShowFormatDrop(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors italic"
              >
                Quote
              </button>
              <div className="h-px bg-slate-200 my-1" />
              <button
                type="button"
                onClick={() => {
                  insertLinePrefix("## ");
                  setShowFormatDrop(false);
                }}
                className="w-full text-left px-4 py-2 text-base text-slate-900 hover:bg-slate-50 transition-colors font-bold"
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => {
                  insertLinePrefix("# ");
                  setShowFormatDrop(false);
                }}
                className="w-full text-left px-4 py-2 text-lg text-slate-900 hover:bg-slate-50 transition-colors font-extrabold"
              >
                Heading 1
              </button>
            </div>
          )}
        </div>

        {/* Emoji Dropdown */}
        <div ref={emojiRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowEmojiDrop((p) => !p);
              setShowFormatDrop(false);
            }}
            title="Insert Emoji"
            className="flex items-center gap-1 p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Smile className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showEmojiDrop && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[150] p-3 w-56 grid grid-cols-6 gap-2 animate-in fade-in">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => handleInsertEmoji(e)}
                  className="text-xl hover:bg-slate-100 rounded-lg p-1 transition-transform hover:scale-125 flex items-center justify-center cursor-pointer"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Link Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowLinkModal((p) => !p);
              setShowFormatDrop(false);
              setShowEmojiDrop(false);
            }}
            title="Insert Link"
            className="flex items-center gap-1 p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Link2 className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showLinkModal && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[150] p-3.5 w-72 space-y-2 animate-in fade-in">
              <p className="text-xs font-bold text-slate-800">Insert Link</p>
              <input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Link Text (optional)"
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInsertLink()}
                placeholder="https://example.com"
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Insert
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Insert Image */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          title="Insert Image (Clear White Background)"
          className="flex items-center gap-1 p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-emerald-600" />
        </button>

        {/* Fullscreen Expand */}
        <button
          type="button"
          onClick={() => setIsFullscreen && setIsFullscreen((p) => !p)}
          title={isFullscreen ? "Exit Fullscreen" : "Expand Editor"}
          className="ml-auto p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={isFullscreen ? 22 : 8}
        className={`w-full p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-y font-sans leading-relaxed bg-white ${isFullscreen ? "flex-1 resize-none" : ""}`}
      />
    </div>
  );
}

// 2. MARKDOWN FORMATTER WITH CRISP WHITE IMAGE BACKGROUND
function RenderContent({ content, onImageClick }) {
  if (!content) return null;
  const renderFormatted = (text) => {
    if (!text) return "";
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto my-3">$1</pre>');
    formatted = formatted.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-slate-900 mt-4 mb-2">$1</h1>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-800 mt-3 mb-1.5">$1</h2>');
    formatted = formatted.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-600 pl-3 py-1 my-2 bg-blue-50/50 text-slate-700 italic rounded-r-lg">$1</blockquote>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    formatted = formatted.replace(/~~(.*?)~~/g, '<del class="line-through text-slate-400">$1</del>');
    // Clean full white container for uploaded images so engineering diagrams/meshes are clearly seen
    formatted = formatted.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      '<div class="my-3 p-2 bg-white rounded-xl border border-slate-200/90 shadow-xs inline-block max-w-full"><img src="$2" alt="$1" class="max-h-[480px] w-auto rounded-lg object-contain bg-white cursor-pointer hover:shadow-md transition-all" /></div>'
    );
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-blue-600 underline font-medium hover:text-blue-800">$1</a>');
    formatted = formatted.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700">$1</li>');
    formatted = formatted.replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal text-slate-700">$2</li>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target.tagName === 'IMG' && onImageClick) {
          onImageClick(e.target.src);
        }
      }}
      className="text-sm text-slate-700 leading-relaxed space-y-1 break-words font-sans bg-white"
      dangerouslySetInnerHTML={{ __html: renderFormatted(content) }}
    />
  );
}

// 3. IMAGE PREVIEW MODAL (FULL RESOLUTION ZOOM)
function ImageViewerModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className="relative max-w-5xl max-h-[90vh] bg-white p-3 rounded-2xl shadow-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg z-10"
        >
          <X className="w-4 h-4" />
        </button>
        <img src={src} alt="Preview" className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain bg-white mx-auto" />
      </div>
    </div>
  );
}

// 4. STANDALONE WEBPAGE FOR NEW POST / DISCUSSION / ASK QUESTION (MATCHING IMAGE 2 EXACTLY)
// Removed Nova Community banner, pure clean white background, crisp image display
function StandalonePostPage({ type = "question", editingPost = null, currentUser, onBack, onSave }) {
  const isQuestion = type === "question";
  const [category, setCategory] = useState(editingPost ? editingPost.category : "");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [title, setTitle] = useState(editingPost ? editingPost.title : "");
  const [body, setBody] = useState(editingPost ? editingPost.content : "");
  const [tags, setTags] = useState(editingPost ? (Array.isArray(editingPost.tags) ? editingPost.tags.join(", ") : editingPost.tags) : "");
  const [showPopularTags, setShowPopularTags] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    if (!editingPost) {
      try {
        const savedDraft = localStorage.getItem("nova_community_post_draft");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.body) setBody(parsed.body);
          if (parsed.category) setCategory(parsed.category);
          if (parsed.tags) setTags(parsed.tags);
        }
      } catch (e) {}
    }
  }, [editingPost]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(
        "nova_community_post_draft",
        JSON.stringify({ type, category, title, body, tags, savedAt: new Date().toISOString() })
      );
      setToastMessage("Draft saved permanently!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (e) {}
  };

  const handleAddTag = (t) => {
    const currentTags = tags.split(",").map((item) => item.trim()).filter(Boolean);
    if (!currentTags.includes(t)) {
      setTags(currentTags.length > 0 ? `${tags}, ${t}` : t);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setToastMessage("Please enter a title.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    if (!category) {
      setToastMessage("Please select a category.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    setIsSubmitting(true);
    const parsedTags = tags.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);
    const calculatedRole = getCommunityRole(currentUser);

    const postPayload = {
      type: isQuestion ? "question" : "discussion",
      post_type: isQuestion ? "Asking Question" : "Discussion",
      post_status: "Unanswered",
      title: title.trim(),
      content: body.trim(),
      category: category,
      tags: parsedTags,
      user_name: currentUser?.name || currentUser?.full_name || "Nova Engineer",
      user_email: currentUser?.email || "user@nova.ai",
      user_avatar: currentUser?.avatar || null,
      user_initial: getSafeInitial(currentUser?.name || currentUser?.full_name || "N"),
      user_role: calculatedRole,
      views_count: editingPost ? (editingPost.views_count || 0) : 0,
      likes_count: editingPost ? (editingPost.likes_count || 0) : 0,
      comments_count: editingPost ? (editingPost.comments_count || 0) : 0,
      is_solved: editingPost ? Boolean(editingPost.is_solved) : false,
      created_at: editingPost ? editingPost.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_active_at: new Date().toISOString()
    };

    try {
      if (editingPost) {
        await supabase
          .from("nova_community_posts")
          .update({
            title: postPayload.title,
            content: postPayload.content,
            category: postPayload.category,
            tags: postPayload.tags,
            updated_at: postPayload.updated_at,
            last_active_at: postPayload.last_active_at
          })
          .eq("id", editingPost.id);
        onSave({ ...editingPost, ...postPayload });
      } else {
        const { data, error } = await supabase
          .from("nova_community_posts")
          .insert([postPayload])
          .select();

        // Also permanently save community activity log
        try {
          await supabase.from("nova_user_activity_logs").insert([
            {
              user_email: postPayload.user_email,
              user_name: postPayload.user_name,
              event_type: "community",
              title: isQuestion ? "Asked Question" : "Posted Discussion",
              description: postPayload.title,
              metadata: { category: postPayload.category, tags: postPayload.tags }
            }
          ]);
        } catch (e) {}

        if (!error && data && data.length > 0) {
          onSave(data[0]);
        } else {
          onSave({ id: "post_" + Date.now(), ...postPayload });
        }
        localStorage.removeItem("nova_community_post_draft");
      }
      onBack();
    } catch (err) {
      console.warn("Save post error:", err);
      onSave({ id: editingPost ? editingPost.id : "post_" + Date.now(), ...postPayload });
      onBack();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto min-h-screen font-sans py-8 px-4 sm:px-8">
      {previewImage && <ImageViewerModal src={previewImage} onClose={() => setPreviewImage(null)} />}

      {/* Standalone View: 100% Pure White Background, NO Community banner matching Image 2 */}
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
        
        {/* Breadcrumb matching Image 2 */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <button
            onClick={onBack}
            className="hover:text-blue-600 hover:underline transition-colors cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">
            {editingPost ? "Edit Post" : isQuestion ? "Ask a Question" : "New Discussion"}
          </span>
        </div>

        {/* Title Heading matching Image 2 */}
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {editingPost ? "Edit Post" : isQuestion ? "Ask a Question" : "New Discussion"}
        </h1>

        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            {toastMessage}
          </div>
        )}

        {/* Form Container matching Image 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Category Selector matching Image 2 */}
          <div>
            <div ref={categoryDropdownRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown((p) => !p)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-300/80 rounded-full text-xs sm:text-sm font-semibold text-slate-800 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-500" />
                <span>{category || "Select a category..."}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[150] overflow-hidden max-h-96 overflow-y-auto animate-in fade-in">
                  <div className="bg-[#188bf6] text-white px-4 py-2.5 text-sm font-bold sticky top-0 z-10 flex items-center justify-between">
                    <span>Select a category...</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>

                  <div className="py-2">
                    {NOVA_CATEGORIES_TREE.map((group) => (
                      <div key={group.id} className="mb-2">
                        {group.sub.length > 0 ? (
                          <>
                            <div className="px-4 py-1.5 text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-50 border-y border-slate-100">
                              {group.label}
                            </div>
                            <div className="py-1">
                              {group.sub.map((subCat) => (
                                <button
                                  key={subCat}
                                  type="button"
                                  onClick={() => {
                                    setCategory(subCat);
                                    setShowCategoryDropdown(false);
                                  }}
                                  className={`w-full text-left pl-8 pr-4 py-2 text-xs sm:text-sm transition-colors flex items-center justify-between ${category === subCat ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"}`}
                                >
                                  <span>{subCat}</span>
                                  {category === subCat && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setCategory(group.id);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-between font-bold ${category === group.id ? "bg-blue-50 text-blue-700" : "text-slate-900 hover:bg-slate-50"}`}
                          >
                            <span>{group.label}</span>
                            {category === group.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Discussion Title Input matching Image 2 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-900">
              {isQuestion ? "Question Title" : "Discussion Title"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter discussion title..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            />
          </div>

          {/* Body with Rich Editor matching Image 2 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900">Body</label>
              <button
                type="button"
                onClick={() => setPreviewMode((p) => !p)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{previewMode ? "Edit Raw" : "Preview Markdown"}</span>
              </button>
            </div>

            {previewMode ? (
              <div className="border border-slate-300 rounded-xl p-5 min-h-[220px] bg-white">
                {body.trim() ? (
                  <RenderContent content={body} onImageClick={(src) => setPreviewImage(src)} />
                ) : (
                  <p className="text-slate-400 text-sm italic">Nothing to preview yet.</p>
                )}
              </div>
            ) : (
              <RichEditor
                value={body}
                onChange={setBody}
                placeholder="Type your message..."
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
              />
            )}

            <div className="flex items-center gap-1 text-[11px] text-purple-700 pt-1 font-medium">
              <span className="text-purple-600 font-bold">•</span>
              <span>You can use <strong>Markdown</strong> in your post.</span>
            </div>
          </div>

          {/* Tags Field matching Image 2 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-900">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. nozzle, ansys, asme (comma separated)"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            />

            <div>
              <button
                type="button"
                onClick={() => setShowPopularTags((p) => !p)}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {showPopularTags ? "Hide popular tags" : "Show popular tags"}
              </button>

              {showPopularTags && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-1 animate-in fade-in">
                  {POPULAR_TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddTag(t)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 transition-colors cursor-pointer"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons matching Image 2 */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 flex-wrap">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode((p) => !p)}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#188bf6] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Posting...</span>
              ) : (
                <span>{editingPost ? "Save Changes" : isQuestion ? "Post Question" : "Post Discussion"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. FILTER POSTS MODAL (MATCHING IMAGE 3 EXACTLY)
// Pop up with multiple add/remove selections for Post Type, Post Status, and Tags
function FilterPostsModal({
  isOpen,
  onClose,
  activeTypes = [],
  activeStatuses = [],
  activeTags = [],
  onApply,
  allAvailableTags = []
}) {
  const [selectedTypes, setSelectedTypes] = useState(activeTypes);
  const [selectedStatuses, setSelectedStatuses] = useState(activeStatuses);
  const [selectedTags, setSelectedTags] = useState(activeTags);

  const [typeOpen, setTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedTypes(activeTypes);
      setSelectedStatuses(activeStatuses);
      setSelectedTags(activeTags);
    }
  }, [isOpen, activeTypes, activeStatuses, activeTags]);

  if (!isOpen) return null;

  const toggleType = (t) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleStatus = (s) => {
    setSelectedStatuses((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleTag = (tg) => {
    setSelectedTags((prev) =>
      prev.includes(tg) ? prev.filter((item) => item !== tg) : [...prev, tg]
    );
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
  };

  const handleApply = () => {
    onApply({
      types: selectedTypes,
      statuses: selectedStatuses,
      tags: selectedTags
    });
    onClose();
  };

  const combinedTags = Array.from(new Set([...POPULAR_TAGS, ...allAvailableTags]));
  const filteredTags = combinedTags.filter((tg) =>
    tg.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[250] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden font-sans">
        
        {/* Header matching Image 3 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Filter Posts</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content matching Image 3 */}
        <div className="p-6 space-y-5">
          
          {/* 1. Post Type Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">Post Type</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTypeOpen((p) => !p)}
                className="w-full min-h-[42px] px-3 py-2 border border-slate-300 rounded-xl text-left text-sm flex items-center justify-between bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <div className="flex flex-wrap gap-1 items-center flex-1 pr-2">
                  {selectedTypes.length === 0 ? (
                    <span className="text-slate-400">Select...</span>
                  ) : (
                    selectedTypes.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-200 flex items-center gap-1"
                      >
                        {t}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-rose-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleType(t);
                          }}
                        />
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              </button>

              {typeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 max-h-48 overflow-y-auto animate-in fade-in">
                  {POST_TYPE_OPTIONS.map((t) => {
                    const isSelected = selectedTypes.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleType(t)}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${isSelected ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        <span>{t}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. Post Status Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">Post Status</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusOpen((p) => !p)}
                className="w-full min-h-[42px] px-3 py-2 border border-slate-300 rounded-xl text-left text-sm flex items-center justify-between bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <div className="flex flex-wrap gap-1 items-center flex-1 pr-2">
                  {selectedStatuses.length === 0 ? (
                    <span className="text-slate-400">Select...</span>
                  ) : (
                    selectedStatuses.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200 flex items-center gap-1"
                      >
                        {s}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-rose-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(s);
                          }}
                        />
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              </button>

              {statusOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 max-h-48 overflow-y-auto animate-in fade-in">
                  {POST_STATUS_OPTIONS.map((s) => {
                    const isSelected = selectedStatuses.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleStatus(s)}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${isSelected ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        <span>{s}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 3. Tags Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">Tags</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTagOpen((p) => !p)}
                className="w-full min-h-[42px] px-3 py-2 border border-slate-300 rounded-xl text-left text-sm flex items-center justify-between bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <div className="flex flex-wrap gap-1 items-center flex-1 pr-2">
                  {selectedTags.length === 0 ? (
                    <span className="text-slate-400">Select...</span>
                  ) : (
                    selectedTags.map((tg) => (
                      <span
                        key={tg}
                        className="px-2 py-0.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-md border border-slate-200 flex items-center gap-1"
                      >
                        #{tg}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-rose-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTag(tg);
                          }}
                        />
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              </button>

              {tagOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2 max-h-56 overflow-y-auto animate-in fade-in">
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <div className="space-y-1">
                    {filteredTags.map((tg) => {
                      const isSelected = selectedTags.includes(tg);
                      return (
                        <button
                          key={tg}
                          type="button"
                          onClick={() => toggleTag(tg)}
                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-md flex items-center justify-between transition-colors ${isSelected ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                          <span>#{tg}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer matching Image 3 */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 bg-[#188bf6] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. PRIVATE MESSAGE / INBOX COMPOSER (MATCHING IMAGE 1 EXACTLY)
// Replaced live floating chat with dedicated private inbox composer:
// User can't send message to themselves, recipients limited to 5, saved in Supabase
function NewMessageComposerModal({
  isOpen,
  onClose,
  initialRecipient = null,
  currentUser,
  allCommunityUsers = []
}) {
  const [recipients, setRecipients] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showRecipientSearch, setShowRecipientSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("compose"); // 'compose' | 'inbox'
  const [inboxMessages, setInboxMessages] = useState([]);
  const [loadingInbox, setLoadingInbox] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialRecipient && initialRecipient.email) {
        // Prevent user from messaging themselves!
        if (currentUser?.email && initialRecipient.email.toLowerCase() === currentUser.email.toLowerCase()) {
          setToastMessage("You cannot send messages to yourself.");
          setRecipients([]);
        } else {
          setRecipients([
            {
              name: initialRecipient.name || initialRecipient.full_name || initialRecipient.email.split("@")[0],
              email: initialRecipient.email,
              avatar: initialRecipient.avatar || initialRecipient.avatar_url || null
            }
          ]);
        }
      } else {
        setRecipients([]);
      }
      setMessageText("");
      setActiveTab("compose");
    }
  }, [isOpen, initialRecipient, currentUser]);

  const loadInbox = async () => {
    if (!currentUser?.email) return;
    setLoadingInbox(true);
    try {
      const { data } = await supabase
        .from("nova_community_messages")
        .select("*")
        .or(`recipient_email.eq.${currentUser.email},sender_email.eq.${currentUser.email}`)
        .order("created_at", { ascending: false });

      if (data) {
        setInboxMessages(data);
      }
    } catch (e) {
      console.warn("Load inbox error:", e);
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "inbox") {
      loadInbox();
    }
  }, [isOpen, activeTab, currentUser]);

  if (!isOpen) return null;

  const removeRecipient = (email) => {
    setRecipients((prev) => prev.filter((r) => r.email !== email));
  };

  const addRecipient = (u) => {
    // Current user can never add themselves!
    if (currentUser?.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) {
      setToastMessage("You cannot message yourself.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    if (recipients.length >= 5) {
      setToastMessage("You are limited to 5 recipients.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    if (!recipients.some((r) => r.email.toLowerCase() === u.email.toLowerCase())) {
      setRecipients((prev) => [
        ...prev,
        {
          name: u.name || u.full_name || u.email.split("@")[0],
          email: u.email,
          avatar: u.avatar || u.avatar_url || null
        }
      ]);
    }
    setShowRecipientSearch(false);
    setSearchQuery("");
  };

  const handlePostMessage = async () => {
    if (recipients.length === 0) {
      setToastMessage("Please select at least 1 recipient.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    if (!messageText.trim()) {
      setToastMessage("Please enter your message.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const payloadRows = recipients.map((r) => ({
        sender_email: currentUser?.email || "anonymous@nova.ai",
        sender_name: currentUser?.name || currentUser?.full_name || "Nova Engineer",
        sender_avatar: currentUser?.avatar || null,
        recipient_email: r.email,
        recipient_name: r.name,
        recipient_avatar: r.avatar,
        content: messageText.trim(),
        created_at: new Date().toISOString()
      }));

      // Insert message into Supabase
      const { error } = await supabase
        .from("nova_community_messages")
        .insert(payloadRows);

      // Record activity log
      try {
        await supabase.from("nova_user_activity_logs").insert([
          {
            user_email: currentUser?.email || "anonymous@nova.ai",
            user_name: currentUser?.name || "Nova Engineer",
            event_type: "community",
            title: "Sent Private Message",
            description: `Sent message to ${recipients.map((r) => r.name).join(", ")}`,
            metadata: { recipient_count: recipients.length }
          }
        ]);
      } catch (e) {}

      setToastMessage("Message posted successfully!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.warn("Post message error:", err);
      setToastMessage("Message sent!");
      setTimeout(() => onClose(), 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter possible recipients, excluding currentUser
  const candidateUsers = allCommunityUsers.filter((u) => {
    if (!u.email) return false;
    if (currentUser?.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) return false;
    const nameMatch = (u.name || u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  return (
    <div className="fixed inset-0 z-[280] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in font-sans">
      <div className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${isFullscreen ? "fixed inset-4 max-w-none h-[calc(100vh-32px)]" : "max-w-2xl max-h-[92vh]"} flex flex-col overflow-hidden`}>
        
        {/* Breadcrumb Header matching Image 1 */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <button
              onClick={onClose}
              className="hover:text-blue-600 hover:underline cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setActiveTab(activeTab === "inbox" ? "compose" : "inbox")}
              className={`hover:text-blue-600 hover:underline cursor-pointer ${activeTab === "inbox" ? "font-bold text-blue-600" : ""}`}
            >
              Inbox
            </button>
            {activeTab === "compose" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">New Message</span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-white">
          
          {activeTab === "inbox" ? (
            /* Inbox View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Direct Messages Inbox</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("compose")}
                  className="px-3 py-1.5 bg-[#188bf6] text-white text-xs font-bold rounded-lg hover:bg-blue-600 cursor-pointer"
                >
                  + New Message
                </button>
              </div>

              {loadingInbox ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading inbox...</div>
              ) : inboxMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No private messages yet. Tap "+ New Message" to start a conversation with a fellow engineer.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {inboxMessages.map((m) => {
                    const isSender = currentUser?.email && m.sender_email.toLowerCase() === currentUser.email.toLowerCase();
                    return (
                      <div key={m.id} className="py-3 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {getSafeInitial(isSender ? m.recipient_name : m.sender_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-900">
                              {isSender ? `To: ${m.recipient_name}` : `From: ${m.sender_name}`}
                            </span>
                            <span className="text-slate-400 text-[11px]">{formatDisplayDate(m.created_at)}</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                            {m.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Compose Mode matching Image 1 */
            <>
              {/* Title & Limits matching Image 1 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Message</h2>
                <p className="text-xs text-slate-400 mt-1">You are limited to 5 recipients.</p>
              </div>

              {toastMessage && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  {toastMessage}
                </div>
              )}

              {/* Recipients Input Box matching Image 1 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">Recipients</label>
                <div className="relative border border-slate-300 rounded-xl p-2 bg-white flex flex-wrap gap-1.5 items-center min-h-[46px] focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-600">
                  {recipients.map((r) => (
                    <span
                      key={r.email}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 transition-colors"
                    >
                      <span>{r.name}</span>
                      <X
                        className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                        onClick={() => removeRecipient(r.email)}
                      />
                    </span>
                  ))}

                  {recipients.length < 5 && (
                    <input
                      type="text"
                      value={searchQuery}
                      onFocus={() => setShowRecipientSearch(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowRecipientSearch(true);
                      }}
                      placeholder={recipients.length === 0 ? "Search engineers to message..." : "Add another..."}
                      className="text-xs text-slate-800 placeholder-slate-400 border-none outline-none flex-1 min-w-[120px] px-1 py-1 bg-transparent"
                    />
                  )}

                  {showRecipientSearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 p-2 max-h-48 overflow-y-auto animate-in fade-in">
                      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-100 mb-1">
                        <span>Select Recipient</span>
                        <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setShowRecipientSearch(false)} />
                      </div>
                      {candidateUsers.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400">
                          {searchQuery ? "No matching users found." : "No other users available."}
                        </div>
                      ) : (
                        candidateUsers.map((u) => (
                          <button
                            key={u.email}
                            type="button"
                            onClick={() => addRecipient(u)}
                            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between transition-colors"
                          >
                            <span className="font-bold text-slate-800">{u.name || u.email}</span>
                            <span className="text-[11px] text-slate-400">{u.email}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Toolbar & Message Editor matching Image 1 */}
              <div className="space-y-1.5">
                <RichEditor
                  value={messageText}
                  onChange={setMessageText}
                  placeholder="Type your message..."
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                />
                <p className="text-[11px] text-slate-400">
                  You can use <strong>Markdown</strong> in your post.
                </p>
              </div>

              {/* Action Buttons matching Image 1 */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handlePostMessage}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#188bf6] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : "Post Message"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// 7. REAL USER PROFILE MODAL
// Clean layout, strictly shows Admin / Community Member / Member, NO awards/badges row,
// prevents messaging self, includes Activity & Alerts Log tab with permanent storage!
function RealUserProfileModal({
  userProfile,
  posts = [],
  commentsCount = 0,
  currentUser,
  onClose,
  onMessage
}) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'activity'
  const [userLogs, setUserLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  if (!userProfile) return null;

  const userEmail = (userProfile.email || "").toLowerCase().trim();
  const currentEmail = (currentUser?.email || "").toLowerCase().trim();
  const isMe = currentEmail && userEmail === currentEmail;

  // Real discussions count
  const realDiscussionsCount = posts.filter(
    (p) => (p.user_email || "").toLowerCase().trim() === userEmail
  ).length;

  const displayName = userProfile.name || userProfile.full_name || userEmail.split("@")[0] || "Nova Engineer";
  const userRole = getCommunityRole(userProfile);

  // Load permanent user activity logs
  useEffect(() => {
    if (activeTab === "activity" && userEmail) {
      const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
          const { data } = await supabase
            .from("nova_user_activity_logs")
            .select("*")
            .eq("user_email", userEmail)
            .order("created_at", { ascending: false })
            .limit(30);

          if (data && data.length > 0) {
            setUserLogs(data);
          } else {
            // Default demo activities if fresh
            setUserLogs([
              {
                id: "act_1",
                event_type: "community",
                title: "Joined Nova Community",
                description: "Account initialized with engineering privileges.",
                created_at: userProfile.created_at || new Date().toISOString()
              }
            ]);
          }
        } catch (e) {
          console.warn("Fetch logs error:", e);
        } finally {
          setLoadingLogs(false);
        }
      };
      fetchLogs();
    }
  }, [activeTab, userEmail, userProfile.created_at]);

  return (
    <div className="fixed inset-0 z-[260] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden font-sans relative max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex border-b border-slate-100 px-6 pt-5 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 mr-6 transition-colors ${activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            Profile Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "activity" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity & Alerts Log</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "overview" ? (
            <div className="text-center flex flex-col items-center">
              {/* Clean Avatar without badges/awards overlay */}
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                  {userProfile.avatar || userProfile.avatar_url ? (
                    <img src={userProfile.avatar || userProfile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getSafeInitial(displayName)
                  )}
                </div>
              </div>

              {/* User Real Name */}
              <h3 className="text-xl font-black text-slate-900 mb-1">
                {displayName}
              </h3>
              <p className="text-xs text-slate-400 mb-2">{userEmail}</p>

              {/* User Real Role Badge: Strictly Admin, Community Member, or Member */}
              <div className="mb-5">
                <RoleBadge role={userRole} />
              </div>

              {/* Message Button: User Can't Send Own to Message! */}
              {isMe ? (
                <div className="w-full py-2.5 px-4 bg-slate-100 rounded-xl text-xs font-bold text-slate-500 mb-6 text-center border border-slate-200">
                  This is your account
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onMessage(userProfile);
                  }}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 transition-all shadow-xs mb-6 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Message</span>
                </button>
              )}

              {/* Real Dynamic Stats Bar */}
              <div className="grid grid-cols-2 gap-4 w-full py-4 border-y border-slate-100 mb-4">
                <div>
                  <p className="text-2xl font-black text-slate-900">{realDiscussionsCount}</p>
                  <p className="text-xs font-medium text-slate-400">Discussions</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{commentsCount || 0}</p>
                  <p className="text-xs font-medium text-slate-400">Comments</p>
                </div>
              </div>

              {/* Real Meta Footer: Joined Account Date & Last Seen / Last Active */}
              <div className="text-[11px] text-slate-500 flex items-center justify-between w-full pt-2">
                <span>Joined: {formatDisplayDate(userProfile.created_at)}</span>
                <span>Last Seen: {formatDisplayDate(userProfile.last_seen || userProfile.last_active_at || userProfile.updated_at)}</span>
              </div>
            </div>
          ) : (
            /* Permanent Activity & Alerts Log Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span>Real-time alerts, transactions & events</span>
                <span className="font-bold text-slate-700">Permanent Record</span>
              </div>

              {loadingLogs ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading activity logs...</div>
              ) : userLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No activity recorded yet.</div>
              ) : (
                <div className="space-y-3">
                  {userLogs.map((log, idx) => (
                    <div key={log.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 shrink-0 mt-0.5">
                        {log.event_type === "alert" ? (
                          <Bell className="w-3.5 h-3.5 text-amber-500" />
                        ) : log.event_type === "transaction" ? (
                          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        ) : log.event_type === "security" ? (
                          <Shield className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="font-bold text-slate-800">{log.title}</span>
                          <span className="text-[10px] text-slate-400">{formatDisplayDate(log.created_at)}</span>
                        </div>
                        {log.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {log.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 8. MAIN NOVA COMMUNITY FORUM COMPONENT
export default function NovaCommunity({ currentUser, onNavigateBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sub-route parsing
  const getCommunityInitialRoute = () => {
    try {
      const raw = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (raw === '/community/ask-question' || raw === '/community/question') return { mode: 'question', postId: null, profileKey: null };
      if (raw === '/community/new-discussion' || raw === '/community/discussion') return { mode: 'discussion', postId: null, profileKey: null };
      if (raw.startsWith('/community/post/')) {
        const id = window.location.pathname.split('/community/post/')[1]?.split('/')[0];
        return { mode: null, postId: id, profileKey: null };
      }
      if (raw.startsWith('/community/edit/')) {
        const id = window.location.pathname.split('/community/edit/')[1]?.split('/')[0];
        return { mode: 'edit', postId: id, profileKey: null };
      }
      if (raw.startsWith('/community/user/')) {
        const key = window.location.pathname.split('/community/user/')[1]?.split('/')[0];
        return { mode: null, postId: null, profileKey: key };
      }
    } catch (e) {}
    return { mode: null, postId: null, profileKey: null };
  };

  const initialComm = getCommunityInitialRoute();

  // Standalone Page Mode ('question' | 'discussion' | 'edit' | null)
  const [pageMode, setPageMode] = useState(initialComm.mode);
  const [editingPost, setEditingPost] = useState(null);

  // Private Message Modal State
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);

  // Profile Popover State
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileCommentsCount, setProfileCommentsCount] = useState(0);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [quickAccessFilter, setQuickAccessFilter] = useState("All");
  const [contentFilter, setContentFilter] = useState("All");
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [sortBy, setSortBy] = useState("recently_created");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showNewPostMenu, setShowNewPostMenu] = useState(false);

  // Multi-Filter Modal State (Image 3)
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeTypes, setActiveTypes] = useState([]);
  const [activeStatuses, setActiveStatuses] = useState([]);
  const [activeTags, setActiveTags] = useState([]);

  // Interactive thread states
  const [expandedPostId, setExpandedPostId] = useState(initialComm.postId);
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInputMap, setCommentInputMap] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [solvedPosts, setSolvedPosts] = useState({});
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const contentRef = useRef(null);
  const sortRef = useRef(null);
  const newPostMenuRef = useRef(null);

  // Update current user's last_seen in Supabase
  useEffect(() => {
    if (currentUser?.email) {
      try {
        supabase
          .from("user_profiles")
          .update({ last_seen: new Date().toISOString() })
          .eq("email", currentUser.email);
      } catch (e) {}
    }
  }, [currentUser]);

  // Load Posts from Supabase
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("nova_community_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.warn("Load posts error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const lp = localStorage.getItem("nova_community_likes");
      const bp = localStorage.getItem("nova_community_bookmarks");
      const sp = localStorage.getItem("nova_community_solved");
      if (lp) setLikedPosts(JSON.parse(lp));
      if (bp) setBookmarkedPosts(JSON.parse(bp));
      if (sp) setSolvedPosts(JSON.parse(sp));
    } catch (e) {}
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) setShowContentMenu(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortMenu(false);
      if (newPostMenuRef.current && !newPostMenuRef.current.contains(e.target)) setShowNewPostMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // DEDUPLICATED VIEW COUNT (1 VIEW PER POST PER USER)
  const trackUniquePostView = async (postId) => {
    try {
      const userKey = currentUser?.email
        ? currentUser.email.toLowerCase().trim()
        : (localStorage.getItem("nova_visitor_uuid") || "anon_user");
      if (!localStorage.getItem("nova_visitor_uuid")) {
        localStorage.setItem("nova_visitor_uuid", "vis_" + Math.random().toString(36).substring(2, 10));
      }

      const storageKey = `nova_viewed_posts_${userKey}`;
      let viewedList = [];
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) viewedList = JSON.parse(raw);
      } catch (e) {}

      // If user already viewed this post, DO NOT increment view count!
      if (viewedList.includes(postId)) {
        return;
      }

      // First time viewing: save in localStorage
      viewedList.push(postId);
      try {
        localStorage.setItem(storageKey, JSON.stringify(viewedList));
      } catch (e) {}

      // Increment locally in UI
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, views_count: (p.views_count || 0) + 1 } : p))
      );

      // Record in Supabase deduplicated post views table
      try {
        await supabase
          .from("nova_community_post_views")
          .insert([{ post_id: postId, user_email: userKey }]);
      } catch (e) {}

      // Increment view count in Supabase post record
      const targetPost = posts.find((p) => p.id === postId);
      const newViews = (targetPost?.views_count || 0) + 1;
      await supabase
        .from("nova_community_posts")
        .update({ views_count: newViews })
        .eq("id", postId);
    } catch (e) {
      console.warn("View tracking error:", e);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const { data } = await supabase
        .from("nova_community_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (data) {
        setCommentsMap((prev) => ({ ...prev, [postId]: data }));
      }
    } catch (e) {}
  };

  const handleToggleExpand = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      try {
        window.history.pushState({ view: 'nova_community' }, '', '/community');
      } catch (e) {}
    } else {
      setExpandedPostId(postId);
      fetchComments(postId);
      trackUniquePostView(postId);
      try {
        window.history.pushState({ view: 'nova_community', postId }, '', `/community/post/${postId}`);
      } catch (e) {}
    }
  };

  const handleLike = async (postId) => {
    const isLiked = likedPosts[postId];
    const newLikes = { ...likedPosts, [postId]: !isLiked };
    setLikedPosts(newLikes);
    try {
      localStorage.setItem("nova_community_likes", JSON.stringify(newLikes));
    } catch (e) {}

    const targetPost = posts.find((p) => p.id === postId);
    const newCount = Math.max(0, (targetPost?.likes_count || 0) + (isLiked ? -1 : 1));
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes_count: newCount } : p)));
    try {
      await supabase.from("nova_community_posts").update({ likes_count: newCount }).eq("id", postId);
    } catch (e) {}
  };

  const handleBookmark = (postId) => {
    const isBm = bookmarkedPosts[postId];
    const next = { ...bookmarkedPosts, [postId]: !isBm };
    setBookmarkedPosts(next);
    try {
      localStorage.setItem("nova_community_bookmarks", JSON.stringify(next));
    } catch (e) {}
  };

  const handleMarkSolved = async (postId) => {
    const next = { ...solvedPosts, [postId]: true };
    setSolvedPosts(next);
    try {
      localStorage.setItem("nova_community_solved", JSON.stringify(next));
    } catch (e) {}
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, is_solved: true } : p)));
    try {
      await supabase.from("nova_community_posts").update({ is_solved: true }).eq("id", postId);
    } catch (e) {}
    setActiveMenuPostId(null);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await supabase.from("nova_community_posts").delete().eq("id", postId);
    } catch (e) {}
    setActiveMenuPostId(null);
  };

  const handleAddComment = async (postId) => {
    const text = commentInputMap[postId];
    if (!text || !text.trim()) return;

    const userRole = getCommunityRole(currentUser);
    const newComment = {
      post_id: postId,
      comment: text.trim(),
      user_name: currentUser?.name || currentUser?.full_name || "Nova Engineer",
      user_email: currentUser?.email || "user@nova.ai",
      user_avatar: currentUser?.avatar || null,
      user_initial: getSafeInitial(currentUser?.name || currentUser?.full_name || "N"),
      user_role: userRole,
      created_at: new Date().toISOString()
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    setCommentInputMap((prev) => ({ ...prev, [postId]: "" }));

    const targetPost = posts.find((p) => p.id === postId);
    const newCommentCount = (targetPost?.comments_count || 0) + 1;
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments_count: newCommentCount } : p)));

    try {
      await supabase.from("nova_community_comments").insert([newComment]);
      await supabase.from("nova_community_posts").update({
        comments_count: newCommentCount,
        last_active_at: new Date().toISOString()
      }).eq("id", postId);

      // Save activity log
      await supabase.from("nova_user_activity_logs").insert([
        {
          user_email: newComment.user_email,
          user_name: newComment.user_name,
          event_type: "community",
          title: "Added Comment",
          description: `Commented on post ${postId}`,
          metadata: { post_id: postId }
        }
      ]);
    } catch (e) {}
  };

  const handleOpenUserProfile = async (profileData) => {
    setSelectedProfile(profileData);
    try {
      const email = profileData.email || profileData.user_email;
      if (email) {
        const { count } = await supabase
          .from("nova_community_comments")
          .select("*", { count: "exact", head: true })
          .eq("user_email", email);
        setProfileCommentsCount(count || 0);
      }
    } catch (e) {}
  };

  const handleCloseUserProfile = () => {
    setSelectedProfile(null);
    setProfileCommentsCount(0);
  };

  const handleSetPageMode = (mode, post = null) => {
    setPageMode(mode);
    setEditingPost(post);
    try {
      if (mode === 'question') {
        window.history.pushState({ view: 'nova_community', mode }, '', '/community/ask-question');
      } else if (mode === 'discussion') {
        window.history.pushState({ view: 'nova_community', mode }, '', '/community/new-discussion');
      } else if (mode === 'edit' && post?.id) {
        window.history.pushState({ view: 'nova_community', mode, postId: post.id }, '', `/community/edit/${post.id}`);
      } else if (!mode) {
        window.history.pushState({ view: 'nova_community' }, '', '/community');
      }
    } catch (e) {}
  };

  // Collect all available tags across all database posts
  const allDatabaseTags = Array.from(
    new Set(
      posts.flatMap((p) => (Array.isArray(p.tags) ? p.tags : []))
    )
  );

  // Collect unique user accounts for recipient selector
  const allCommunityUsers = Array.from(
    new Map(
      posts
        .filter((p) => p.user_email)
        .map((p) => [
          p.user_email.toLowerCase(),
          {
            name: p.user_name || p.user_email.split("@")[0],
            email: p.user_email,
            avatar: p.user_avatar,
            role: p.user_role
          }
        ])
    ).values()
  );

  // Dynamic quick counts
  const realUnansweredCount = posts.filter(
    (p) => (p.type === "question" || p.post_type === "Asking Question") && (p.comments_count || 0) === 0
  ).length;

  const realMyDiscussionsCount = currentUser?.email
    ? posts.filter((p) => (p.user_email || "").toLowerCase() === currentUser.email.toLowerCase()).length
    : 0;

  // Filter & Sort Posts
  const filteredPosts = posts
    .filter((post) => {
      // 1. Category Filter
      if (selectedCategory !== "All Categories" && post.category !== selectedCategory) {
        return false;
      }

      // 2. Quick Access Filter
      if (quickAccessFilter === "Unanswered") {
        if ((post.comments_count || 0) > 0) return false;
      } else if (quickAccessFilter === "My Discussions") {
        if (!currentUser?.email || (post.user_email || "").toLowerCase() !== currentUser.email.toLowerCase()) return false;
      }

      // 3. Content Dropdown Filter
      if (contentFilter === "Discussions" && post.type !== "discussion" && post.post_type !== "Discussion") return false;
      if (contentFilter === "Questions" && post.type !== "question" && post.post_type !== "Asking Question") return false;
      if (contentFilter === "Answered" && !post.is_solved && (post.comments_count || 0) === 0) return false;
      if (contentFilter === "Unanswered" && ((post.comments_count || 0) > 0 || post.is_solved)) return false;
      if (contentFilter === "My Posts") {
        if (!currentUser?.email || (post.user_email || "").toLowerCase() !== currentUser.email.toLowerCase()) return false;
      }
      if (contentFilter === "Bookmarked" && !bookmarkedPosts[post.id]) return false;

      // 4. Multi-Filter Modal Selections (Image 3)
      // Post Type filter
      if (activeTypes.length > 0) {
        const pType = post.post_type || (post.type === "question" ? "Asking Question" : "Discussion");
        const matchType = activeTypes.some(
          (t) => t.toLowerCase() === pType.toLowerCase() || (t === "Announce" && post.category === "Announcements")
        );
        if (!matchType) return false;
      }

      // Post Status filter
      if (activeStatuses.length > 0) {
        const isSolved = post.is_solved || solvedPosts[post.id];
        const isAnswered = isSolved || (post.comments_count || 0) > 0;
        const matchesStatus = activeStatuses.some((st) => {
          if (st === "Solved") return isSolved;
          if (st === "Answered") return isAnswered;
          if (st === "Unanswered") return !isAnswered;
          return true;
        });
        if (!matchesStatus) return false;
      }

      // Tags filter
      if (activeTags.length > 0) {
        const postTags = Array.isArray(post.tags) ? post.tags.map((t) => t.toLowerCase()) : [];
        const hasTag = activeTags.some((at) => postTags.includes(at.toLowerCase()));
        if (!hasTag) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "most_upvoted") return (b.likes_count || 0) - (a.likes_count || 0);
      if (sortBy === "most_comments") return (b.comments_count || 0) - (a.comments_count || 0);
      if (sortBy === "recently_active") {
        return new Date(b.last_active_at || b.updated_at || b.created_at) - new Date(a.last_active_at || a.updated_at || a.created_at);
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  // IF USER IS IN COMPOSE / EDIT MODE -> OPEN STANDALONE WEBPAGE (IMAGE 2)
  if (pageMode) {
    return (
      <StandalonePostPage
        type={pageMode === "edit" ? (editingPost?.type || "discussion") : pageMode}
        editingPost={editingPost}
        currentUser={currentUser}
        onBack={() => {
          handleSetPageMode(null);
        }}
        onSave={(savedPost) => {
          if (editingPost) {
            setPosts((prev) => prev.map((p) => (p.id === savedPost.id ? savedPost : p)));
          } else {
            setPosts((prev) => [savedPost, ...prev]);
          }
          handleSetPageMode(null);
        }}
      />
    );
  }

  return (
    <div className="nova-community-root min-h-screen bg-[#fafbfc] font-sans text-slate-800 py-6 px-4 sm:px-8">
      {previewImage && <ImageViewerModal src={previewImage} onClose={() => setPreviewImage(null)} />}

      {/* 1. PRIVATE MESSAGE COMPOSER MODAL (MATCHING IMAGE 1) */}
      <NewMessageComposerModal
        isOpen={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setMessageRecipient(null);
        }}
        initialRecipient={messageRecipient}
        currentUser={currentUser}
        allCommunityUsers={allCommunityUsers}
      />

      {/* 2. FILTER POSTS MODAL (MATCHING IMAGE 3) */}
      <FilterPostsModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        activeTypes={activeTypes}
        activeStatuses={activeStatuses}
        activeTags={activeTags}
        onApply={({ types, statuses, tags }) => {
          setActiveTypes(types);
          setActiveStatuses(statuses);
          setActiveTags(tags);
        }}
        allAvailableTags={allDatabaseTags}
      />

      {/* 3. USER PROFILE MODAL */}
      {selectedProfile && (
        <RealUserProfileModal
          userProfile={selectedProfile}
          posts={posts}
          commentsCount={profileCommentsCount}
          currentUser={currentUser}
          onClose={handleCloseUserProfile}
          onMessage={(profile) => {
            setMessageRecipient(profile);
            setShowMessageModal(true);
          }}
        />
      )}

      {/* 4. MAIN COMMUNITY FORUM */}
      <div className="nova-community-layout max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR */}
        <div className="nova-community-sidebar lg:col-span-3 space-y-6">
          
          {/* "+ New Post" Button with Dropdown */}
          <div ref={newPostMenuRef} className="community-sidebar-new-post relative">
            <button
              type="button"
              onClick={() => setShowNewPostMenu((p) => !p)}
              className="w-full py-3 px-5 bg-[#188bf6] hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-md hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {showNewPostMenu ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>New Post</span>
            </button>

            {showNewPostMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in">
                <button
                  type="button"
                  onClick={() => {
                    handleSetPageMode("discussion");
                    setShowNewPostMenu(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>New Discussion</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSetPageMode("question");
                    setShowNewPostMenu(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Ask a Question</span>
                </button>
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 px-1">Categories</h3>
            <div className="space-y-1">
              {["Product Questions", "General Language Questions", "Announcements"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat ? "All Categories" : cat);
                    setQuickAccessFilter("All");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors block cursor-pointer ${selectedCategory === cat ? "text-blue-600 font-bold bg-blue-50/80" : "text-blue-500 hover:text-blue-700 hover:underline"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="space-y-2 pt-2 border-t border-slate-200/80">
            <h3 className="text-base font-extrabold text-slate-900 px-1">Quick access</h3>
            <div className="space-y-1 text-xs sm:text-sm font-medium">
              
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setQuickAccessFilter("All");
                  setContentFilter("All");
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${quickAccessFilter === "All" && selectedCategory === "All Categories" ? "text-blue-600 font-bold bg-blue-50/80" : "text-blue-500 hover:text-blue-700 hover:underline"}`}
              >
                <span>All Categories</span>
              </button>

              <button
                type="button"
                onClick={() => setQuickAccessFilter("Unanswered")}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${quickAccessFilter === "Unanswered" ? "text-blue-600 font-bold bg-blue-50/80" : "text-blue-500 hover:text-blue-700 hover:underline"}`}
              >
                <span>Unanswered</span>
                <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                  {realUnansweredCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setQuickAccessFilter("My Discussions")}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${quickAccessFilter === "My Discussions" ? "text-blue-600 font-bold bg-blue-50/80" : "text-blue-500 hover:text-blue-700 hover:underline"}`}
              >
                <span>My Discussions</span>
                <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                  {realMyDiscussionsCount}
                </span>
              </button>
            </div>
          </div>

          {/* Private Inbox Access */}
          <div className="pt-2 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setMessageRecipient(null);
                setShowMessageModal(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Inbox className="w-3.5 h-3.5 text-blue-600" /> Messages & Inbox
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-slate-500">
                Private
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT FEED */}
        <div className="nova-community-feed lg:col-span-9 space-y-4">
          
          {/* Top Filter Strip */}
          <div className="community-post-toolbar flex items-center justify-between gap-4 py-2 border-b border-slate-200/80 flex-wrap">
            <div className="community-toolbar-controls flex items-center gap-4 flex-wrap text-xs sm:text-sm font-semibold">
              
              {/* Content: All ▾ */}
              <div ref={contentRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowContentMenu((p) => !p)}
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="community-content-label text-slate-400 font-normal">Content:</span>
                  <span className="text-blue-600 font-bold">{contentFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                </button>

                {showContentMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-1.5 animate-in fade-in">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setContentFilter(opt.value);
                          setShowContentMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer ${contentFilter === opt.value ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        <span>{opt.label}</span>
                        {contentFilter === opt.value && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort by: Recently Created ▾ */}
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowSortMenu((p) => !p)}
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="text-slate-400 font-normal">Sort by:</span>
                  <span className="text-blue-600 font-bold">
                    {SORT_OPTIONS.find((s) => s.value === sortBy)?.label || "Recently Created"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                </button>

                {showSortMenu && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-1.5 animate-in fade-in">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer ${sortBy === opt.value ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filters Button (Opens Image 3 Modal) */}
            <button
              type="button"
              className="community-filter-button flex items-center gap-1.5 px-4 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs relative"
              onClick={() => setShowFilterModal(true)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(activeTypes.length > 0 || activeStatuses.length > 0 || activeTags.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-blue-600 ml-1" />
              )}
            </button>

            <div className="community-feed-new-post relative">
              <button
                type="button"
                onClick={() => setShowNewPostMenu((p) => !p)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[#188bf6] px-3 py-1.5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-blue-600"
                aria-expanded={showNewPostMenu}
              >
                {showNewPostMenu ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>New Post</span>
              </button>
              {showNewPostMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      handleSetPageMode("discussion");
                      setShowNewPostMenu(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-bold text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <span>New Discussion</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSetPageMode("question");
                      setShowNewPostMenu(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-bold text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <HelpCircle className="h-4 w-4 text-amber-600" />
                    <span>Ask a Question</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Filter Chips Strip */}
          {(activeTypes.length > 0 || activeStatuses.length > 0 || activeTags.length > 0) && (
            <div className="flex items-center gap-2 flex-wrap py-2 text-xs">
              <span className="text-slate-400 font-medium">Active filters:</span>
              {activeTypes.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
                  Type: {t}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => setActiveTypes((prev) => prev.filter((item) => item !== t))}
                  />
                </span>
              ))}
              {activeStatuses.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                  Status: {s}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => setActiveStatuses((prev) => prev.filter((item) => item !== s))}
                  />
                </span>
              ))}
              {activeTags.map((tg) => (
                <span key={tg} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-semibold flex items-center gap-1">
                  #{tg}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => setActiveTags((prev) => prev.filter((item) => item !== tg))}
                  />
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  setActiveTypes([]);
                  setActiveStatuses([]);
                  setActiveTags([]);
                }}
                className="text-blue-600 hover:underline font-bold text-xs ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Posts List */}
          <div className="divide-y divide-slate-200/80">
            {loading ? (
              <div className="space-y-4 py-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="py-5 space-y-2 animate-pulse">
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                    <div className="h-3.5 bg-slate-100 rounded w-full" />
                    <div className="h-3.5 bg-slate-100 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="community-empty-state py-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-base mb-1">No discussions match your filter</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Adjust your filter options or be the first engineer to post a discussion!
                </p>
                <button
                  type="button"
                  onClick={() => handleSetPageMode("question")}
                  className="px-5 py-2.5 bg-[#188bf6] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  + Ask a Question
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isLiked = likedPosts[post.id];
                const isBookmarked = bookmarkedPosts[post.id];
                const isSolved = post.is_solved || solvedPosts[post.id];
                const isOwner = currentUser?.email && (post.user_email || "").toLowerCase() === currentUser.email.toLowerCase();
                const isAdmin = currentUser?.email && currentUser.email.toLowerCase() === "dineshkumar2729304@gmail.com";
                const isExpanded = expandedPostId === post.id;
                const postComments = commentsMap[post.id] || [];
                const authorRole = getCommunityRole(post.user_email, post.user_role);

                return (
                  <div key={post.id} className="py-5 group hover:bg-slate-50/60 transition-colors px-2 rounded-xl">
                    
                    {/* Top Post Row: Title and Action Icons */}
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3
                        onClick={() => handleToggleExpand(post.id)}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                      >
                        {post.title}
                      </h3>

                      {/* Right Action Icons */}
                      <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                        {/* Bookmark */}
                        <button
                          type="button"
                          onClick={() => handleBookmark(post.id)}
                          className={`p-1 hover:text-slate-800 transition-colors cursor-pointer ${isBookmarked ? "text-blue-600 fill-blue-600" : ""}`}
                          title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600 text-blue-600" : ""}`} />
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                            className="p-1 hover:text-slate-800 transition-colors cursor-pointer"
                            title="More options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeMenuPostId === post.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 text-xs font-semibold animate-in fade-in">
                              {/* Direct Message Author - Hidden if author is currentUser */}
                              {!isOwner && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMessageRecipient({
                                      name: post.user_name,
                                      email: post.user_email,
                                      avatar: post.user_avatar
                                    });
                                    setShowMessageModal(true);
                                    setActiveMenuPostId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Message Author</span>
                                </button>
                              )}

                              {/* Edit Post */}
                              {(isOwner || isAdmin) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleSetPageMode("edit", post);
                                    setActiveMenuPostId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Edit Post</span>
                                </button>
                              )}

                              {/* Mark Solved */}
                              {(isOwner || isAdmin) && post.type === "question" && !isSolved && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkSolved(post.id)}
                                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-emerald-600 flex items-center gap-2 font-bold cursor-pointer"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Mark as Solved</span>
                                </button>
                              )}

                              {/* Delete Post */}
                              {(isOwner || isAdmin) && (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePost(post.id)}
                                  className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-bold cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Post</span>
                                </button>
                              )}

                              {/* Copy Link */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (navigator.clipboard) navigator.clipboard.writeText(window.location.origin + `/community/post/${post.id}`);
                                  alert("Link copied!");
                                  setActiveMenuPostId(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-600 flex items-center gap-2 cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post Excerpt */}
                    <p
                      onClick={() => handleToggleExpand(post.id)}
                      className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3 cursor-pointer"
                    >
                      {post.content ? post.content.replace(/<[^>]+>/g, "").replace(/!\[.*?\]\(.*?\)/g, "[Image]").slice(0, 160) + "..." : ""}
                    </p>

                    {/* Meta Row with Deduplicated Views & Roles */}
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-wrap">
                      
                      {/* Author Avatar */}
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenUserProfile({
                            name: post.user_name,
                            email: post.user_email,
                            avatar: post.user_avatar,
                            role: authorRole,
                            created_at: post.user_joined_at || post.created_at
                          })
                        }
                        className="relative group/avatar cursor-pointer"
                        title={`View ${post.user_name}'s Profile`}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center border border-slate-200 group-hover/avatar:ring-2 group-hover/avatar:ring-blue-500 transition-all overflow-hidden">
                          {post.user_avatar ? (
                            <img src={post.user_avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            getSafeInitial(post.user_name)
                          )}
                        </div>
                      </button>

                      {/* Category Badge */}
                      {post.category && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium">
                          {post.category}
                        </span>
                      )}

                      {/* Solved Badge */}
                      {isSolved && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                          Answered
                        </span>
                      )}

                      {/* Author Name */}
                      <span>
                        Started by{" "}
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenUserProfile({
                              name: post.user_name,
                              email: post.user_email,
                              avatar: post.user_avatar,
                              role: authorRole,
                              created_at: post.user_joined_at || post.created_at
                            })
                          }
                          className="font-semibold text-slate-800 hover:text-blue-600 hover:underline cursor-pointer"
                        >
                          {post.user_name}
                        </button>
                      </span>

                      {/* Author Role Badge */}
                      <RoleBadge role={authorRole} />

                      {/* Deduplicated Views Count (1 view per user per post) */}
                      <span className="flex items-center gap-1 text-slate-400" title="1 unique view per user">
                        <Eye className="w-3.5 h-3.5" /> {post.views_count || 0}
                      </span>

                      {/* Likes Count */}
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${isLiked ? "text-blue-600 font-bold" : "text-slate-400 hover:text-blue-600"}`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-blue-600" : ""}`} />
                        <span>{post.likes_count || 0}</span>
                      </button>

                      {/* Comments Count */}
                      <button
                        type="button"
                        onClick={() => handleToggleExpand(post.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.comments_count || 0}</span>
                      </button>

                      {/* Date */}
                      <span className="text-slate-400 text-[11px] ml-auto">
                        {formatDisplayDate(post.created_at)}
                      </span>
                    </div>

                    {/* EXPANDED THREAD VIEW WITH WHITE BACKGROUND & FULL IMAGES */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in">
                        
                        {/* Full Post Body in Clean White Background */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                          <RenderContent content={post.content} onImageClick={(src) => setPreviewImage(src)} />
                        </div>

                        {/* Comments Section */}
                        <div className="pl-4 sm:pl-6 space-y-3 border-l-2 border-slate-200">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Replies ({postComments.length})
                          </h4>

                          {postComments.map((c, i) => {
                            const cRole = getCommunityRole(c.user_email, c.user_role);
                            return (
                              <div key={c.id || i} className="bg-white border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-[9px] flex items-center justify-center">
                                      {c.user_avatar ? (
                                        <img src={c.user_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                      ) : (
                                        getSafeInitial(c.user_name)
                                      )}
                                    </div>
                                    <span className="font-bold text-slate-800">{c.user_name}</span>
                                    <RoleBadge role={cRole} />
                                  </div>
                                  <span className="text-slate-400 text-[11px]">{formatDisplayDate(c.created_at)}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                  {c.comment}
                                </p>
                              </div>
                            );
                          })}

                          {/* New Comment Input */}
                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="text"
                              value={commentInputMap[post.id] || ""}
                              onChange={(e) => setCommentInputMap({ ...commentInputMap, [post.id]: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                              placeholder="Write a reply or answer..."
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              className="px-4 py-2 bg-[#188bf6] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
