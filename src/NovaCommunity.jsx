import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Link2,
  Paperclip, Image as ImageIcon, Eye, Send, X, ChevronDown,
  Search, Filter, Plus, CheckCircle, Bookmark, User,
  ThumbsUp, MessageCircle, Share2, Globe, BookOpen,
  Smile, ShieldCheck, AlignLeft, Hash, Maximize2, Minimize2,
  CornerDownRight, Check, Sparkles, FileText, Download,
  Layers, Tag, Clock, ArrowRight, ChevronRight, HelpCircle,
  MessageSquare, Flame, AlertCircle, Trash2
} from "lucide-react";

// CATEGORIES HIERARCHY AS SHOWN IN IMAGE 4
const NOVA_CATEGORIES_TREE = [
  {
    id: "Nova Product Questions",
    label: "Nova Product Questions",
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

const POPULAR_TAGS = [
  "nozzle", "ansys", "flange", "cad_ai", "bellow",
  "stress_strain", "asme", "pwht", "simulation", "mesh"
];

const SORT_OPTIONS = [
  { value: "recently_created", label: "Recently Created" },
  { value: "recently_active",  label: "Recently Active"  },
  { value: "most_upvoted",     label: "Most Upvoted"     },
  { value: "most_comments",    label: "Most Comments"    },
  { value: "oldest",           label: "Oldest"           }
];

const FILTER_OPTIONS = [
  { value: "All",         label: "All Posts" },
  { value: "Discussions", label: "Discussions Only" },
  { value: "Questions",   label: "Questions Only" },
  { value: "Solved",      label: "Solved Only" },
  { value: "Unsolved",    label: "Unsolved Only" },
  { value: "My Posts",    label: "My Posts" },
  { value: "Bookmarked",  label: "Bookmarked" }
];

const EMOJIS = [
  "😀", "😂", "🙏", "👍", "🔥", "❤️", "💡", "🎯",
  "⚡", "✅", "🚀", "🤔", "😎", "👏", "💪", "🙌",
  "🛠️", "📊", "⚙️", "💻", "🧠", "❓", "🎉", "💯"
];

const AVATAR_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-indigo-600 to-purple-600",
  "from-purple-600 to-pink-600",
  "from-emerald-600 to-teal-600",
  "from-cyan-600 to-blue-600",
  "from-amber-500 to-orange-600"
];

function getAvatarGradient(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function getInitials(name = "") {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatTimeAgo(isoString) {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

// RICH TEXT EDITOR COMPONENT (MATCHING IMAGE 5)
function RichEditor({ value, onChange, placeholder = "Type your message...", isFullscreen, setIsFullscreen }) {
  const textareaRef = useRef(null);
  const [showFormatDrop, setShowFormatDrop] = useState(false);
  const [showEmojiDrop, setShowEmojiDrop] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const formatRef = useRef(null);
  const emojiRef = useRef(null);
  const attachRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formatRef.current && !formatRef.current.contains(e.target)) setShowFormatDrop(false);
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmojiDrop(false);
      if (attachRef.current && !attachRef.current.contains(e.target)) setShowAttachMenu(false);
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
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  const handleInsertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newValue = text.substring(0, start) + emoji + text.substring(end);
    onChange(newValue);
    setShowEmojiDrop(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 10);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const textarea = textareaRef.current;
    const label = linkText.trim() || linkUrl.trim();
    const markdownLink = `[${label}](${linkUrl.trim()})`;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newValue = text.substring(0, start) + markdownLink + text.substring(end);
      onChange(newValue);
    } else {
      onChange((value || "") + "\n" + markdownLink);
    }
    setLinkUrl("");
    setLinkText("");
    setShowLinkModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      const imgMarkdown = `\n![${file.name}](${base64})\n`;
      onChange((value || "") + imgMarkdown);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setShowAttachMenu(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileMarkdown = `\n📎 **Attachment:** [${file.name} (${(file.size / 1024).toFixed(1)} KB)](#file)\n`;
    onChange((value || "") + fileMarkdown);
    e.target.value = "";
    setShowAttachMenu(false);
  };

  return (
    <div className={`border border-slate-300 rounded-xl bg-white overflow-visible transition-all focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 ${isFullscreen ? "fixed inset-4 z-[250] flex flex-col shadow-2xl" : ""}`}>
      {/* TOOLBAR MATCHING IMAGE 5 */}
      <div className="flex items-center gap-0.5 px-2.5 py-1.5 border-b border-slate-200 bg-slate-50/80 rounded-t-xl flex-wrap relative">
        {/* Bold */}
        <button
          type="button"
          onClick={() => insertTagWrapper("**", "**", "Bold text")}
          title="Bold"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors font-bold text-sm"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => insertTagWrapper("*", "*", "Italic text")}
          title="Italic"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => insertTagWrapper("~~", "~~", "Strikethrough text")}
          title="Strikethrough"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        {/* Unordered List */}
        <button
          type="button"
          onClick={() => insertLinePrefix("- ")}
          title="Unordered List"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => insertLinePrefix("1. ")}
          title="Ordered List"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        {/* Paragraph / Format Dropdown (Exact Image 5) */}
        <div ref={formatRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFormatDrop((p) => !p);
              setShowEmojiDrop(false);
              setShowAttachMenu(false);
            }}
            title="Formatting"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors text-xs font-semibold"
          >
            <AlignLeft className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showFormatDrop && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[120] py-1 min-w-[150px] animate-in fade-in slide-in-from-top-1">
              <button
                type="button"
                onClick={() => {
                  insertTagWrapper("[spoiler]", "[/spoiler]", "Spoiler content");
                  setShowFormatDrop(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
              >
                Spoiler
              </button>
              <button
                type="button"
                onClick={() => {
                  insertTagWrapper("```\n", "\n```", "code here");
                  setShowFormatDrop(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-mono"
              >
                Code
              </button>
              <button
                type="button"
                onClick={() => {
                  insertLinePrefix("> ");
                  setShowFormatDrop(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors italic"
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
                className="w-full text-left px-4 py-2 text-base text-slate-900 hover:bg-slate-100 transition-colors font-bold"
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => {
                  insertLinePrefix("# ");
                  setShowFormatDrop(false);
                }}
                className="w-full text-left px-4 py-2 text-lg text-slate-900 hover:bg-slate-100 transition-colors font-extrabold"
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
              setShowAttachMenu(false);
            }}
            title="Insert Emoji"
            className="flex items-center gap-1 p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <Smile className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showEmojiDrop && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[120] p-3 w-56 grid grid-cols-6 gap-2 animate-in fade-in slide-in-from-top-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => handleInsertEmoji(e)}
                  className="text-xl hover:bg-slate-100 rounded-lg p-1 transition-transform hover:scale-125 flex items-center justify-center"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* URL Link Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowLinkModal((p) => !p);
              setShowFormatDrop(false);
              setShowEmojiDrop(false);
              setShowAttachMenu(false);
            }}
            title="Insert Link"
            className="flex items-center gap-1 p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <Link2 className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showLinkModal && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[120] p-3.5 w-72 space-y-2 animate-in fade-in slide-in-from-top-1">
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

        {/* Attach File Dropdown */}
        <div ref={attachRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowAttachMenu((p) => !p);
              setShowFormatDrop(false);
              setShowEmojiDrop(false);
            }}
            title="Attach File"
            className="flex items-center gap-1 p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showAttachMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[120] py-1 min-w-[160px] animate-in fade-in slide-in-from-top-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Paperclip className="w-3.5 h-3.5 text-blue-600" /> Attach Document
              </button>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Insert Image
              </button>
            </div>
          )}
        </div>

        {/* Insert Image Direct Button */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          title="Insert Image"
          className="flex items-center gap-1 p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>

        {/* Fullscreen Expand Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen && setIsFullscreen((p) => !p)}
          title={isFullscreen ? "Exit Fullscreen" : "Expand Editor"}
          className="ml-auto p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* TEXTAREA INPUT */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={isFullscreen ? 20 : 6}
        className={`w-full p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-y font-sans leading-relaxed ${isFullscreen ? "flex-1 resize-none" : ""}`}
      />
    </div>
  );
}

// RENDER RICH MARKDOWN CONTENT PREVIEW
function RenderContent({ content }) {
  if (!content) return null;

  // Simple clean markdown formatter without external heavy parser
  const renderFormatted = (text) => {
    if (!text) return "";
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto my-2">$1</pre>');
    // Spoilers
    formatted = formatted.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/g, '<details class="my-2 p-2 bg-slate-100 rounded-lg text-xs cursor-pointer"><summary class="font-bold text-blue-600">Spoiler (Click to reveal)</summary><div class="mt-1 text-slate-800">$1</div></details>');
    // Headings
    formatted = formatted.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-slate-900 mt-3 mb-1">$1</h1>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-800 mt-2 mb-1">$1</h2>');
    // Blockquote
    formatted = formatted.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-600 pl-3 py-1 my-2 bg-blue-50/50 text-slate-700 italic rounded-r-lg">$1</blockquote>');
    // Bold & Italic
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    formatted = formatted.replace(/~~(.*?)~~/g, '<del class="line-through text-slate-400">$1</del>');
    // Images
    formatted = formatted.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-h-96 rounded-xl border border-slate-200 my-2 shadow-sm object-contain" />');
    // Links
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-blue-600 underline font-medium hover:text-blue-800">$1</a>');
    // Lists
    formatted = formatted.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700">$1</li>');
    formatted = formatted.replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal text-slate-700">$2</li>');
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  };

  return (
    <div
      className="text-sm text-slate-700 leading-relaxed space-y-1 break-words font-sans"
      dangerouslySetInnerHTML={{ __html: renderFormatted(content) }}
    />
  );
}

// POST FORM VIEW (MATCHING IMAGES 3, 4, 5)
function PostForm({ type = "discussion", currentUser, onClose, onPosted }) {
  const isQuestion = type === "question";
  const [category, setCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [showPopularTags, setShowPopularTags] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const categoryDropdownRef = useRef(null);

  // Restore draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("nova_community_post_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.body) setBody(parsed.body);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.tags) setTags(parsed.tags);
      }
    } catch (e) {
      console.warn("Draft restore err:", e);
    }
  }, []);

  // Handle click outside category dropdown
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
    } catch (e) {
      console.warn("Draft save err:", e);
    }
  };

  const handleAddTag = (t) => {
    const currentTags = tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
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
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const postPayload = {
      type: isQuestion ? "question" : "discussion",
      title: title.trim(),
      content: body.trim(),
      category: category,
      tags: parsedTags,
      user_name: currentUser?.name || "Nova Engineer",
      user_email: currentUser?.email || "user@nova.ai",
      user_avatar: currentUser?.avatar || null,
      user_initial: currentUser?.initial || getInitials(currentUser?.name || "Nova"),
      likes_count: 0,
      comments_count: 0,
      is_solved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from("nova_community_posts")
        .insert([postPayload])
        .select();

      if (!error && data && data.length > 0) {
        onPosted(data[0]);
      } else {
        // Fallback local persistence
        const localId = "local_post_" + Date.now();
        onPosted({ id: localId, ...postPayload });
      }

      // Clear draft on successful post
      localStorage.removeItem("nova_community_post_draft");
      onClose();
    } catch (err) {
      console.warn("Submit post err:", err);
      const localId = "local_post_" + Date.now();
      onPosted({ id: localId, ...postPayload });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-3 mb-8">
      {/* HEADER BREADCRUMB & TITLE (MATCHING IMAGE 3 & 4) */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <button
              onClick={onClose}
              className="hover:text-blue-600 hover:underline transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">
              {isQuestion ? "Ask a Question" : "New Discussion"}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isQuestion ? "Ask a Question" : "New Discussion"}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {toastMessage && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          {toastMessage}
        </div>
      )}

      {/* FORM BODY */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* CATEGORY SELECTOR (MATCHING IMAGE 4 EXACTLY) */}
        <div>
          <div ref={categoryDropdownRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full text-xs sm:text-sm font-semibold text-slate-800 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              <span>{category || "Select a category..."}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[150] overflow-hidden max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {/* Blue Top Header matching Image 4 */}
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
                                className={`w-full text-left pl-8 pr-4 py-2 text-xs sm:text-sm transition-colors flex items-center justify-between ${category === subCat ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"}`}
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

        {/* TITLE INPUT */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            {isQuestion ? "Question Title" : "Discussion Title"}
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isQuestion ? "What is your question? Be specific and clear..." : "Enter discussion title..."}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium"
          />
        </div>

        {/* BODY RICH TEXT EDITOR (MATCHING IMAGE 5) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-800">Body</label>
            <button
              type="button"
              onClick={() => setPreviewMode((p) => !p)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              {previewMode ? "Back to Edit" : "Preview Markdown"}
            </button>
          </div>

          {previewMode ? (
            <div className="border border-slate-300 rounded-xl p-5 bg-slate-50/50 min-h-[160px]">
              {body ? (
                <RenderContent content={body} />
              ) : (
                <p className="text-xs text-slate-400 italic">Nothing to preview. Type something in the editor!</p>
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

          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 inline-block" />
            <span>You can use <span className="font-semibold text-slate-700">Markdown</span> or rich text formatting in your post.</span>
          </div>
        </div>

        {/* TAGS SECTION */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            Tags
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. nozzle, ansys, asme (comma separated)"
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium"
          />

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowPopularTags((p) => !p)}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
            >
              {showPopularTags ? "Hide popular tags" : "Show popular tags"}
            </button>

            {showPopularTags && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {POPULAR_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleAddTag(t)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Hash className="w-3 h-3 text-slate-400" />
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS (MATCHING IMAGE 3, 4, 5) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-300 transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 transition-all flex items-center gap-1.5"
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode((p) => !p)}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            {previewMode ? "Edit" : "Preview"}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !category || isSubmitting}
            className="px-6 py-2.5 bg-[#188bf6] hover:bg-blue-600 disabled:opacity-50 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <span>{isQuestion ? "Ask Question" : "Post Discussion"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// POST CARD COMPONENT
function PostCard({
  post,
  currentUser,
  onLike,
  likedPosts,
  bookmarkedPosts,
  onBookmark,
  solvedPosts,
  onMarkSolved,
  onCommentAdded
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isLiked = likedPosts?.[post.id];
  const isBookmarked = bookmarkedPosts?.[post.id];
  const isSolved = post.is_solved || solvedPosts?.[post.id];
  const isQuestion = post.type === "question";
  const isOwner = currentUser?.email && post.user_email === currentUser.email;
  const isAdmin = currentUser?.email === "dineshkumar2729304@gmail.com";

  // Fetch comments for this post
  const fetchComments = useCallback(async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from("nova_community_comments")
        .select("*")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setComments(data);
      }
    } catch (e) {
      console.warn("Fetch comments err:", e);
    } finally {
      setLoadingComments(false);
    }
  }, [post.id, loadingComments]);

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments((p) => !p);
  };

  const handleAddComment = async () => {
    const text = commentInput.trim();
    if (!text) return;
    setIsSubmittingComment(true);

    const newComment = {
      post_id: post.id,
      comment: text,
      user_name: currentUser?.name || "Nova Engineer",
      user_email: currentUser?.email || "user@nova.ai",
      user_avatar: currentUser?.avatar || null,
      user_initial: currentUser?.initial || getInitials(currentUser?.name || "Nova"),
      created_at: new Date().toISOString()
    };

    // Optimistic update
    setComments((prev) => [...prev, { id: "cmt_" + Date.now(), ...newComment }]);
    setCommentInput("");

    try {
      const { data } = await supabase
        .from("nova_community_comments")
        .insert([newComment])
        .select();

      if (data && data[0]) {
        setComments((prev) =>
          prev.map((c) => (c.post_id === post.id && !c.id.startsWith("cmt_") ? c : data[0]))
        );
      }

      // Update post comments count in DB
      try {
        await supabase
          .from("nova_community_posts")
          .update({ comments_count: (post.comments_count || 0) + 1 })
          .eq("id", post.id);
      } catch (err) {}

      onCommentAdded && onCommentAdded(post.id);
    } catch (e) {
      console.warn("Insert comment err:", e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Discussion link copied to clipboard!");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* TOP ROW: AUTHOR, BADGES, TIME, BOOKMARK */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(post.user_name)} text-white font-bold text-xs flex items-center justify-center shadow-sm overflow-hidden shrink-0`}
            >
              {post.user_avatar ? (
                <img src={post.user_avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                post.user_initial || getInitials(post.user_name)
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-sm text-slate-900">{post.user_name}</span>
                {isQuestion ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-black uppercase tracking-wider">
                    Question
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
                    Discussion
                  </span>
                )}
                {isSolved && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Solved
                  </span>
                )}
                {post.category && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold">
                    {post.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookmark && onBookmark(post.id)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
            className={`p-2 rounded-xl transition-all ${isBookmarked ? "bg-amber-50 text-amber-600" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* POST TITLE */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {post.title}
        </h3>

        {/* POST CONTENT */}
        {post.content && (
          <div className="mb-4">
            <RenderContent content={post.content} />
          </div>
        )}

        {/* TAGS */}
        {post.tags && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(Array.isArray(post.tags) ? post.tags : String(post.tags).split(","))
              .filter(Boolean)
              .map((tag) => {
                const cleanedTag = String(tag).trim().replace(/^#/, "");
                return (
                  <span
                    key={cleanedTag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-md transition-colors"
                  >
                    <Hash className="w-3 h-3 text-slate-400" />
                    {cleanedTag}
                  </span>
                );
              })}
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 flex-wrap">
          {/* UPVOTE */}
          <button
            type="button"
            onClick={() => onLike && onLike(post.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${isLiked ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-slate-600 hover:bg-slate-100 border border-transparent"}`}
          >
            <ThumbsUp className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
            <span>{post.likes_count || 0}</span>
          </button>

          {/* COMMENTS TOGGLE */}
          <button
            type="button"
            onClick={handleToggleComments}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${showComments ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length > 0 ? comments.length : (post.comments_count || 0)} Replies</span>
          </button>

          {/* SHARE */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* MARK SOLVED (FOR QUESTION OWNER OR ADMIN) */}
          {(isOwner || isAdmin) && isQuestion && !isSolved && (
            <button
              type="button"
              onClick={() => onMarkSolved && onMarkSolved(post.id)}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark as Solved
            </button>
          )}
        </div>
      </div>

      {/* COMMENTS / REPLIES THREAD */}
      {showComments && (
        <div className="border-t border-slate-100 bg-slate-50/70 p-6 space-y-4 animate-in fade-in">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Discussion Replies ({comments.length})
          </h4>

          {loadingComments ? (
            <div className="space-y-2 py-2">
              <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 bg-white rounded-xl border border-slate-200/60 p-4">
              <MessageSquare className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-600">No replies yet.</p>
              <p className="text-[11px] text-slate-400">Be the first to share an answer or perspective!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(c.user_name)} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                  >
                    {c.user_avatar ? (
                      <img src={c.user_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      c.user_initial || getInitials(c.user_name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold text-slate-900">{c.user_name}</span>
                      <span className="text-[11px] text-slate-400">{formatTimeAgo(c.created_at)}</span>
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed break-words">
                      {c.comment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COMMENT COMPOSER */}
          <div className="flex items-center gap-2 pt-2">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(currentUser?.name || "U")} text-white text-xs font-bold flex items-center justify-center shrink-0`}
            >
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                currentUser?.initial || getInitials(currentUser?.name || "Nova")
              )}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
                placeholder="Write a helpful response... (Press Enter to post)"
                className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
              />
              <button
                type="button"
                onClick={handleAddComment}
                disabled={!commentInput.trim() || isSubmittingComment}
                className="px-4 py-2.5 bg-[#188bf6] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// MAIN NOVA COMMUNITY COMPONENT
export default function NovaCommunity({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const [sortBy, setSortBy] = useState("recently_created");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [filterType, setFilterType] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // "+ New Post" dropdown state (Exact Image 2)
  const [showNewPostMenu, setShowNewPostMenu] = useState(false);
  const [activeFormType, setActiveFormType] = useState(null); // 'discussion' | 'question' | null

  // Local storage cache for likes, bookmarks, and solved
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [solvedPosts, setSolvedPosts] = useState({});

  const newPostMenuRef = useRef(null);
  const topicRef = useRef(null);
  const catRef = useRef(null);
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // Load posts from Supabase permanently
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
      console.warn("Load community posts err:", err);
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

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (newPostMenuRef.current && !newPostMenuRef.current.contains(e.target)) setShowNewPostMenu(false);
      if (topicRef.current && !topicRef.current.contains(e.target)) setShowTopicDropdown(false);
      if (catRef.current && !catRef.current.contains(e.target)) setShowCategoryMenu(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortMenu(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Like Post
  const handleLike = async (postId) => {
    const isCurrentlyLiked = !!likedPosts[postId];
    const newLikedState = { ...likedPosts, [postId]: !isCurrentlyLiked };
    setLikedPosts(newLikedState);
    try {
      localStorage.setItem("nova_community_likes", JSON.stringify(newLikedState));
    } catch (e) {}

    const targetPost = posts.find((p) => p.id === postId);
    const newCount = Math.max(0, (targetPost?.likes_count || 0) + (isCurrentlyLiked ? -1 : 1));

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes_count: newCount } : p))
    );

    try {
      await supabase
        .from("nova_community_posts")
        .update({ likes_count: newCount })
        .eq("id", postId);
    } catch (err) {
      console.warn("Like update err:", err);
    }
  };

  // Handle Bookmark Post
  const handleBookmark = (postId) => {
    const newBookmarkedState = { ...bookmarkedPosts, [postId]: !bookmarkedPosts[postId] };
    setBookmarkedPosts(newBookmarkedState);
    try {
      localStorage.setItem("nova_community_bookmarks", JSON.stringify(newBookmarkedState));
    } catch (e) {}
  };

  // Handle Mark Solved
  const handleMarkSolved = async (postId) => {
    const newSolved = { ...solvedPosts, [postId]: true };
    setSolvedPosts(newSolved);
    try {
      localStorage.setItem("nova_community_solved", JSON.stringify(newSolved));
    } catch (e) {}

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, is_solved: true } : p))
    );

    try {
      await supabase
        .from("nova_community_posts")
        .update({ is_solved: true })
        .eq("id", postId);
    } catch (err) {
      console.warn("Solved update err:", err);
    }
  };

  // When a new post is created
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setActiveFormType(null);
  };

  // Filter and Sort posts
  const filteredPosts = posts
    .filter((post) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (post.title || "").toLowerCase().includes(q);
        const matchesContent = (post.content || "").toLowerCase().includes(q);
        const matchesUser = (post.user_name || "").toLowerCase().includes(q);
        const matchesCategory = (post.category || "").toLowerCase().includes(q);
        const matchesTags = Array.isArray(post.tags)
          ? post.tags.some((t) => String(t).toLowerCase().includes(q))
          : String(post.tags || "").toLowerCase().includes(q);

        if (!matchesTitle && !matchesContent && !matchesUser && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // Topic selector filter
      if (selectedTopic !== "All Topics") {
        const matchesTopic =
          post.category === selectedTopic ||
          (post.title || "").toLowerCase().includes(selectedTopic.toLowerCase());
        if (!matchesTopic) return false;
      }

      // Category filter
      if (selectedCategory !== "All") {
        if (post.category !== selectedCategory) return false;
      }

      // Type / Status filter
      if (filterType === "Discussions") return post.type !== "question";
      if (filterType === "Questions") return post.type === "question";
      if (filterType === "Solved") return post.is_solved || solvedPosts[post.id];
      if (filterType === "Unsolved") return post.type === "question" && !post.is_solved && !solvedPosts[post.id];
      if (filterType === "My Posts") return post.user_email === currentUser?.email;
      if (filterType === "Bookmarked") return bookmarkedPosts[post.id];

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "most_upvoted") return (b.likes_count || 0) - (a.likes_count || 0);
      if (sortBy === "most_comments") return (b.comments_count || 0) - (a.comments_count || 0);
      if (sortBy === "recently_active") {
        return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  // Flat list of categories for filter dropdown
  const allCategoryNames = [
    "All",
    "Nova Product Questions",
    ...NOVA_CATEGORIES_TREE[0].sub,
    "General Language Questions",
    "Announcements"
  ];

  return (
    <div className="relative z-10 min-h-screen bg-[#f8fafc] font-sans pb-16">
      {/* 1. COSMIC HERO BANNER (MATCHING IMAGE 1 EXACTLY) */}
      <div
        className="relative overflow-hidden text-white rounded-3xl shadow-2xl border border-blue-900/40 mx-auto mb-6"
        style={{
          background: "linear-gradient(135deg, #050b17 0%, #091a38 35%, #0f2b5c 70%, #081730 100%)"
        }}
      >
        {/* Glow and nebula streaks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-40%] right-[-10%] w-[650px] h-[650px] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, #6366f1 40%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-[-50%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #06b6d4 0%, #3b82f6 50%, transparent 70%)" }}
          />
          {/* Subtle star particle sparks */}
          <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping opacity-75" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-indigo-200 rounded-full animate-pulse opacity-60" />
          <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-cyan-300 rounded-full opacity-80" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-10 py-10 sm:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left: Titles & Search Bar */}
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2 drop-shadow-md">
              Nova Discussion Forum
            </h1>
            <p className="text-blue-200/90 text-xs sm:text-sm mb-6 leading-relaxed">
              Welcome to the official Nova forum! Ask questions, start discussions, and connect with other users.
            </p>

            {/* Pill Search Bar matching Image 1 */}
            <div className="relative flex items-center bg-[#0a1832]/80 border border-blue-400/30 rounded-full p-1.5 shadow-2xl backdrop-blur-xl max-w-xl">
              <Search className="w-4 h-4 text-blue-300 ml-3.5 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 bg-transparent text-white placeholder-blue-300/50 px-3 py-1.5 text-xs sm:text-sm focus:outline-none font-medium"
              />

              {/* Topic Selector inside Pill */}
              <div ref={topicRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowTopicDropdown((p) => !p)}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-bold text-blue-100 transition-all"
                >
                  <span className="truncate max-w-[90px]">{selectedTopic}</span>
                  <ChevronDown className="w-3 h-3 text-blue-200 shrink-0" />
                </button>

                {showTopicDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl z-[100] py-1.5 max-h-64 overflow-y-auto text-white">
                    {["All Topics", "3D Design", "Nozzle", "Flange", "PWHT", "Bellow", "Saddle", "CAD AI", "Materials"].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          setSelectedTopic(topic);
                          setShowTopicDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${selectedTopic === topic ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-white/10"}`}
                      >
                        <span>{topic}</span>
                        {selectedTopic === topic && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Stylized 3D glowing "N" Logo matching Image 1 */}
          <div className="relative hidden md:flex items-center justify-center pr-4">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600/30 to-indigo-500/10 border border-blue-400/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              {/* Stylized N glyph */}
              <div className="relative flex items-center justify-center">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-400 tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] select-none">
                  N
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 blur-[2px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-BANNER ACTION BAR (MATCHING IMAGE 1 & 2) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: "+ New Post" Button (or "✕ New Post" when opened) & Dropdown */}
          <div className="flex items-center gap-3 flex-wrap">
            <div ref={newPostMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowNewPostMenu((p) => !p)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#188bf6] hover:bg-blue-600 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md hover:shadow-blue-500/25 active:scale-95 cursor-pointer"
              >
                {showNewPostMenu ? (
                  <>
                    <X className="w-4 h-4 text-white" />
                    <span>New Post</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-white" />
                    <span>New Post</span>
                  </>
                )}
              </button>

              {/* Exact Image 2 Dropdown Menu */}
              {showNewPostMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[120] py-2 min-w-[200px] animate-in fade-in slide-in-from-top-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFormType("discussion");
                      setShowNewPostMenu(false);
                    }}
                    className="w-full text-left px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>New Discussion</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFormType("question");
                      setShowNewPostMenu(false);
                    }}
                    className="w-full text-left px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Ask a Question</span>
                  </button>
                </div>
              )}
            </div>

            {/* Category Dropdown */}
            <div ref={catRef} className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryMenu((p) => !p)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-all"
              >
                <span className="text-slate-400 font-normal">Category:</span>
                <span className="truncate max-w-[140px]">{selectedCategory}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showCategoryMenu && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[110] py-1.5 max-h-80 overflow-y-auto animate-in fade-in">
                  {allCategoryNames.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between ${selectedCategory === cat ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span className="truncate">{cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setShowSortMenu((p) => !p)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-all"
              >
                <span className="text-slate-400 font-normal">Sort By:</span>
                <span>{SORT_OPTIONS.find((s) => s.value === sortBy)?.label || "Recently Created"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showSortMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[110] py-1.5 animate-in fade-in">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between ${sortBy === opt.value ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Dropdown */}
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setShowFilterMenu((p) => !p)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-all"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-normal">Filter:</span>
                <span>{FILTER_OPTIONS.find((f) => f.value === filterType)?.label || "All"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[110] py-1.5 animate-in fade-in">
                  {FILTER_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => {
                        setFilterType(f.value);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between ${filterType === f.value ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span>{f.label}</span>
                      {filterType === f.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>{posts.length} Total</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{posts.filter((p) => p.is_solved || solvedPosts[p.id]).length} Solved</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. NEW DISCUSSION / ASK QUESTION FORM (WHEN OPEN) */}
      {activeFormType && (
        <PostForm
          type={activeFormType}
          currentUser={currentUser}
          onClose={() => setActiveFormType(null)}
          onPosted={handlePostCreated}
        />
      )}

      {/* 4. FEED POSTS LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/6" />
                  </div>
                </div>
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-16 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-800 mb-1">No discussions found</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "All" || filterType !== "All"
                ? "Try adjusting your search query or filters to find what you are looking for."
                : "Be the first engineer to ask a question or start a discussion in the Nova Community!"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveFormType("question")}
                className="px-5 py-2.5 bg-[#188bf6] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
              >
                Ask a Question
              </button>
              <button
                type="button"
                onClick={() => setActiveFormType("discussion")}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 transition-all"
              >
                Start Discussion
              </button>
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={handleLike}
              likedPosts={likedPosts}
              bookmarkedPosts={bookmarkedPosts}
              onBookmark={handleBookmark}
              solvedPosts={solvedPosts}
              onMarkSolved={handleMarkSolved}
              onCommentAdded={loadPosts}
            />
          ))
        )}
      </div>
    </div>
  );
}
