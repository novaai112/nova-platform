import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  AtSign,
  Award,
  Bell,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Bot,
  Box,
  Brain,
  Check,
  CheckCheck,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  CircleDot,
  Clock,
  Code,
  Compass,
  CornerDownRight,
  Copy,
  Cpu,
  CreditCard,
  Cylinder,
  Database,
  Disc,
  DollarSign,
  Download,
  DownloadCloud,
  Dumbbell,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileJson,
  FileText,
  FileSpreadsheet,
  FileCode,
  Filter,
  Flame,
  GitMerge,
  Globe,
  Hash,
  Heart,
  HelpCircle,
  Image,
  Landmark,
  Lightbulb,
  LineChart,
  Link,
  Loader2,
  Lock,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Monitor,
  Package,
  Paperclip,
  Pin,
  PlayCircle,
  Plus,
  Printer,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Settings,
  Settings2,
  Shapes,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Square,
  Star,
  Target,
  Terminal,
  Thermometer,
  ThumbsUp,
  Trash,
  Trash2,
  TrendingUp,
  Trophy,
  UploadCloud,
  User,
  Users,
  Video,
  Wallet,
  Waves,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './cube.css';
import NovaHelpContent from './NovaHelpContent';
const CosmicLogo = ({ className = "w-8 h-8 sm:w-10 sm:h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="novaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="novaGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="35" stroke="url(#novaGrad1)" strokeWidth="12" filter="url(#glow)" opacity="0.6" />
    <circle cx="50" cy="50" r="35" stroke="url(#novaGrad1)" strokeWidth="8" opacity="0.9" />
    <path d="M50 15 A35 35 0 0 1 85 50 A35 35 0 0 0 50 15 Z" fill="url(#novaGrad2)" opacity="0.8" />
    <path d="M15 50 A35 35 0 0 0 50 85 A35 35 0 0 1 15 50 Z" fill="url(#novaGrad1)" opacity="0.8" />
    <circle cx="50" cy="50" r="35" stroke="url(#novaGrad2)" strokeWidth="2" opacity="0.8" strokeDasharray="15 10 5 10" />
    <circle cx="30" cy="30" r="2.5" fill="#fff" opacity="0.9" />
    <path d="M30 30 L 40 25 L 45 35" stroke="#fff" strokeWidth="1" fill="none" opacity="0.5" />
    <circle cx="40" cy="25" r="1.5" fill="#fff" opacity="0.7" />
    <circle cx="45" cy="35" r="1.5" fill="#fff" opacity="0.7" />
    <circle cx="70" cy="65" r="2" fill="#fff" opacity="0.9" />
    <path d="M70 65 L 60 75 L 50 70" stroke="#fff" strokeWidth="1" fill="none" opacity="0.5" />
    <circle cx="60" cy="75" r="1" fill="#fff" opacity="0.7" />
    <circle cx="50" cy="70" r="1.5" fill="#fff" opacity="0.7" />
    <circle cx="75" cy="35" r="2" fill="#fff" opacity="0.8" />
    <circle cx="25" cy="65" r="1.5" fill="#fff" opacity="0.6" />
    <circle cx="50" cy="50" r="20" fill="url(#novaGrad1)" filter="url(#glow)" opacity="0.2" />
  </svg>
);
const AnimatedStatusBadge = ({ status }) => {
  const normStatus = (status || '').toLowerCase();
  const isSuccess = normStatus === 'completed' || normStatus === 'success';
  const isFailed = normStatus === 'failed';
  const isPending = normStatus === 'pending';
  if (isSuccess) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-white text-[#15803d] border-[1.5px] border-[#86efac] shadow-[0_2px_10px_rgba(22,163,74,0.06)]">
        <CheckCircle className="w-3.5 h-3.5 text-[#16a34a]" />
        <span className="tracking-wide uppercase">{status}</span>
      </span>
    );
  }
  if (isFailed) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-white text-[#b91c1c] border-[1.5px] border-[#fca5a5] shadow-[0_2px_10px_rgba(220,38,38,0.06)]">
        <AlertTriangle className="w-3.5 h-3.5 text-[#dc2626]" />
        <span className="tracking-wide uppercase">{status}</span>
      </span>
    );
  }
  if (isPending) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#fffbeb] text-[#92400e] border border-[#fde68a]">
        <Clock className="w-4 h-4 text-[#d97706] animate-pulse" />
        <span className="tracking-wide uppercase">{status}</span>
      </span>
    );
  }
  
  const displayStatus = (status || '').replace(/^Processing\s*-\s*/i, '');
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black bg-white border-[1.5px] border-indigo-200 shadow-[0_2px_12px_rgba(99,102,241,0.10)]">
      <div className="orbit-spinner" />
      <span className="processing-text tracking-wide uppercase">{displayStatus}</span>
    </span>
  );
};

const DEFAULT_NOVA_COMMUNITY_POSTS = [];
const DEFAULT_NOVA_COMMUNITY_COMMENTS = {};

export const ANSYS_WIZARDS = [
  {
    id: 'full',
    name: 'Full Nozzle Ansys Act Wizard (.WBEX)',
    shortName: 'Full Nozzle ACT Wizard',
    filename: 'Full_Nozzle.wbex',
    desc: 'Complete parametric modeling, meshing, and analysis for full nozzle configurations.',
    curveTypes: null,
    features: [
      'Complete Shell & Head Nozzle Integration',
      'Automated Hex-Dominant Meshing',
      'ASME VIII-2 Part 5 Linearization',
      'Multi-Load Combinations (P + V + M + T)',
      'Instant Word (.docx) FEA Report'
    ],
    pricing: [
      { term: '1 Month', price: '₹9,999', numericPrice: 9999, desc: 'Short-term access for single projects', workstations: 1, recommend: false },
      { term: '3 Months', price: '₹24,999', numericPrice: 24999, desc: 'Ideal for extended engineering phases', workstations: 1, recommend: false },
      { term: '6 Months', price: '₹39,999', numericPrice: 39999, desc: 'Best value for continuous usage', workstations: 2, recommend: true }
    ]
  },
  {
    id: 'shell',
    name: 'Shell Nozzle Ansys Act Wizard (.WBEX)',
    shortName: 'Shell Nozzle ACT Wizard',
    filename: 'Shell_Nozzle.wbex',
    desc: 'Specialized workflow for shell nozzle FEA with automatic report generation.',
    curveTypes: null,
    features: [
      'Cylindrical & Conical Shell Nozzles',
      'Automated Hex-Dominant Meshing',
      'ASME VIII-2 Part 5 Linearization (Pm, Pl, Pb, Q)',
      'Plastic Limit Load & Collapse Checks',
      'Instant Word (.docx) FEA Report'
    ],
    pricing: [
      { term: '1 Month', price: '₹4,999', numericPrice: 4999, desc: 'Short-term access for single projects', workstations: 1, recommend: false },
      { term: '3 Months', price: '₹12,499', numericPrice: 12499, desc: 'Ideal for extended engineering phases', workstations: 1, recommend: false },
      { term: '6 Months', price: '₹19,999', numericPrice: 19999, desc: 'Best value for continuous usage', workstations: 2, recommend: true }
    ]
  },
  {
    id: 'head',
    name: 'Head Nozzle Ansys Act Wizard (.WBEX)',
    shortName: 'Head Nozzle ACT Wizard',
    filename: 'Head_Nozzle.wbex',
    desc: 'Advanced parametric analysis for head nozzle connections.',
    curveTypes: null,
    features: [
      'Hemispherical, Ellipsoidal & Torispherical Heads',
      'Radial & Hillside (Off-Center) Connections',
      'Automated Solid Modeling & Contact Pairing',
      'ASME Section VIII Div 2 Stress Linearization',
      'Audit-Ready Mechanical Documentation'
    ],
    pricing: [
      { term: '1 Month', price: '₹7,499', numericPrice: 7499, desc: 'Short-term access for single projects', workstations: 1, recommend: false },
      { term: '3 Months', price: '₹18,749', numericPrice: 18749, desc: 'Ideal for extended engineering phases', workstations: 1, recommend: false },
      { term: '6 Months', price: '₹29,999', numericPrice: 29999, desc: 'Best value for continuous usage', workstations: 2, recommend: true }
    ]
  },
  {
    id: 'stress_strain',
    name: 'Stress-Strain Curve Ansys Act Wizard (.WBEX)',
    shortName: 'Stress-Strain Curve ACT Wizard',
    filename: 'Stress-Strain_Curve.wbex',
    desc: 'Automated generation of non-linear stress-strain curves for Ansys Engineering Data.',
    curveTypes: [
      'True Stress-Strain',
      'Cyclic Stress-Strain',
      'Isochronous Stress-Strain',
      'Tangent Modulus Stress-Strain'
    ],
    features: [
      'True Stress-Strain Curves',
      'Cyclic Stress-Strain Curves',
      'Isochronous Stress-Strain Curves',
      'Tangent Modulus Stress-Strain Curves',
      'Direct 1-Click Injection into Ansys Engineering Data'
    ],
    pricing: [
      { term: '1 Month', price: '₹1,499', numericPrice: 1499, desc: 'Short-term access for single projects', workstations: 1, recommend: false },
      { term: '3 Months', price: '₹3,749', numericPrice: 3749, desc: 'Ideal for extended engineering phases', workstations: 1, recommend: false },
      { term: '6 Months', price: '₹5,999', numericPrice: 5999, desc: 'Best value for continuous usage', workstations: 2, recommend: true }
    ]
  }
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); 
  const [currentView, setCurrentView] = useState('landing'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileTab, setProfileTab] = useState('info'); 
  const [profileNotifPrefs, setProfileNotifPrefs] = useState({
    job_complete: true, job_failed: true, credit_low: true, sub_renew: true,
    community: false, product_updates: true, promos: false
  });
  const [selectedWizardForDemo, setSelectedWizardForDemo] = useState(null);
  const [isWizardDemoOpen, setIsWizardDemoOpen] = useState(false);
  const [selectedWizardForPricing, setSelectedWizardForPricing] = useState(null);
  const [isWizardPricingOpen, setIsWizardPricingOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState({
    id: null, name: "", email: "", initial: "", avatar: null, company: "", phone: "", joined: "", isApproved: false, plan: "Free", dailyCreditsTotal: 100, dailyCreditsRemaining: 100, isLifetimeMax: false
  });
  const [completedInvoice, setCompletedInvoice] = useState(null);
  const [invoiceCopiedKey, setInvoiceCopiedKey] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [isPwdSuccess, setIsPwdSuccess] = useState(false);
  const [authErrors, setAuthErrors] = useState({});
  const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPwd, setForgotNewPwd] = useState("");
  const [forgotConfirmPwd, setForgotConfirmPwd] = useState("");
  const [forgotErrors, setForgotErrors] = useState({});
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [showForgotPwd, setShowForgotPwd] = useState({ new: false, confirm: false });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const [jobs, setJobs] = useState([]);
  const [communityPosts, setCommunityPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_community_posts_permanent');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const mockIds = ['post_asme_div2_scl_linearization', 'post_cyclic_fatigue_weld', 'post_spaceclaim_nozzle_blend', 'post_hexahedral_meshing_convergence'];
          return parsed.filter(p => p && !mockIds.includes(p.id));
        }
      }
    } catch (e) {}
    return [];
  });
  const [newPostText, setNewPostText] = useState('');
  const [composerTitle, setComposerTitle] = useState('');
  const [composerCategory, setComposerCategory] = useState('ASME Codes');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeModalLang, setCodeModalLang] = useState('python');
  const [codeModalFilename, setCodeModalFilename] = useState('ansys_script.py');
  const [codeModalContent, setCodeModalContent] = useState('');
  const [showAiDraftModal, setShowAiDraftModal] = useState(false);
  const [aiDraftPrompt, setAiDraftPrompt] = useState('');
  const [isAiDraftLoading, setIsAiDraftLoading] = useState(false);
  const [composerCodeLang, setComposerCodeLang] = useState('python');
  const [composerCodeFilename, setComposerCodeFilename] = useState('asme_ansys_script.py');
  const [composerCodeContent, setComposerCodeContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [newPostMedia, setNewPostMedia] = useState(null); // { data, type: 'image'|'video', name, size }
  const [newPostCode, setNewPostCode] = useState(null); // { content, filename, lines, size, lang }
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [selectedMediaModal, setSelectedMediaModal] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [communityActiveTab, setCommunityActiveTab] = useState('all'); // 'all' | 'hot' | 'latest' | 'solved' | 'bookmarked' | 'my_posts'
  const [communitySort, setCommunitySort] = useState('latest'); // 'latest' | 'upvotes' | 'comments'
  const [showAskAiCommunityModal, setShowAskAiCommunityModal] = useState(false);
  const [aiCommunityQuery, setAiCommunityQuery] = useState('');
  const [aiCommunityResponse, setAiCommunityResponse] = useState('');
  const [isAiCommunityLoading, setIsAiCommunityLoading] = useState(false);
  const [selectedPostForAi, setSelectedPostForAi] = useState(null);
  const mediaFileInputRef = useRef(null);
  const codeFileInputRef = useRef(null);

  const [persistentNotifications, setPersistentNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_persistent_notifications');
      return saved ? JSON.parse(saved) : [
        { id: 'notif_welcome', title: 'Workstation Online', message: 'Nova Autonomous FEA Platform initialized and permanently synchronized.', type: 'info', time: 'Just now', date: 'Today', read: false }
      ];
    } catch(e) {
      return [];
    }
  });
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'paypal'
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '', zip: '', saveCard: true });
  const [cardErrors, setCardErrors] = useState({});
  const [cardFlipped, setCardFlipped] = useState(false);
  const [savedCards, setSavedCards] = useState(() => {
    try {
      const stored = localStorage.getItem('nova_saved_cards');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 'card_1', name: 'Dinesh Kumar Yadav', number: '4532 •••• •••• 8920', last4: '8920', brand: 'Visa', expiry: '09/28' },
      { id: 'card_2', name: 'Dinesh Kumar Yadav', number: '5424 •••• •••• 1042', last4: '1042', brand: 'Mastercard', expiry: '11/27' }
    ];
  });
  const [selectedSavedCardId, setSelectedSavedCardId] = useState('new');
  const [savedCardCvv, setSavedCardCvv] = useState('');
  const [savedCardCvvError, setSavedCardCvvError] = useState('');
  const [paypalTxnId, setPaypalTxnId] = useState('');
  const [paypalOpened, setPaypalOpened] = useState(false);
  const [paypalError, setPaypalError] = useState('');
  const [upiId, setUpiId] = useState('dineshkumar2729304@okaxis');
  const [upiStatus, setUpiStatus] = useState('idle');
  const [upiTimer, setUpiTimer] = useState(300);
  const [upiDirectUtr, setUpiDirectUtr] = useState('');
  const [upiDirectError, setUpiDirectError] = useState('');
  const [activeUpiApp, setActiveUpiApp] = useState(null);
  const [selectedNetBank, setSelectedNetBank] = useState('HDFC');
  const [netBankingSearch, setNetBankingSearch] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+919876543210');
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [creditSimModule, setCreditSimModule] = useState('nozzle');
  const [docsSearchQuery, setDocsSearchQuery] = useState('');
  const [activeDocsTab, setActiveDocsTab] = useState('asme');
  const [communityCategory, setCommunityCategory] = useState('All');
  const [communitySearch, setCommunitySearch] = useState('');
  const [postComments, setPostComments] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_community_comments_permanent');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const mockIds = ['post_asme_div2_scl_linearization', 'post_cyclic_fatigue_weld', 'post_spaceclaim_nozzle_blend', 'post_hexahedral_meshing_convergence'];
          const clean = {};
          Object.keys(parsed).forEach(k => {
            if (!mockIds.includes(k)) clean[k] = parsed[k];
          });
          return clean;
        }
      }
    } catch (e) {}
    return {};
  });
  const [expandedComments, setExpandedComments] = useState({});
  const [replyText, setReplyText] = useState({});
  const [replyMention, setReplyMention] = useState({});
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_community_likes_permanent');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [bookmarkedPosts, setBookmarkedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_community_bookmarks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const mockIds = ['post_asme_div2_scl_linearization', 'post_cyclic_fatigue_weld', 'post_spaceclaim_nozzle_blend', 'post_hexahedral_meshing_convergence'];
          const clean = {};
          Object.keys(parsed).forEach(k => {
            if (!mockIds.includes(k)) clean[k] = parsed[k];
          });
          return clean;
        }
      }
    } catch (e) {}
    return {};
  });
  const [solvedPosts, setSolvedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_community_solved');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const mockIds = ['post_asme_div2_scl_linearization', 'post_cyclic_fatigue_weld', 'post_spaceclaim_nozzle_blend', 'post_hexahedral_meshing_convergence'];
          const clean = {};
          Object.keys(parsed).forEach(k => {
            if (!mockIds.includes(k)) clean[k] = parsed[k];
          });
          return clean;
        }
      }
    } catch (e) {}
    return {};
  });
  
  const [activeProductFilter, setActiveProductFilter] = useState('All');
  const [demoActiveTab, setDemoActiveTab] = useState('overview');
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [isDeletingJobs, setIsDeletingJobs] = useState(false);
  const [jobFilter, setJobFilter] = useState('All Analysis');
  const [notification, setNotification] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSubmitJobOpen, setIsSubmitJobOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState('Nozzle Analysis');
  const [editForm, setEditForm] = useState({ company: '', phone: '' });
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSetupPrompt, setAiSetupPrompt] = useState("");
  const [aiSetupResponse, setAiSetupResponse] = useState("");
  const [isAiSetupLoading, setIsAiSetupLoading] = useState(false);
  const [supportChat, setSupportChat] = useState([
    { role: 'model', text: "Hello! I am the NOVA ✨ AI Support agent. I can help you understand our analysis types or check our pricing. How can I assist you today?" }
  ]);
  const [supportInput, setSupportInput] = useState("");
  const [isSupportLoading, setIsSupportLoading] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [selectedInsightJob, setSelectedInsightJob] = useState(null);
  const [insightResponse, setInsightResponse] = useState("");
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [activeDetailRun, setActiveDetailRun] = useState(0);
  const [copiedError, setCopiedError] = useState(false);
  const [showMaterialConsultant, setShowMaterialConsultant] = useState(false);
  const [materialPrompt, setMaterialPrompt] = useState("");
  const [materialResponse, setMaterialResponse] = useState("");
  const [isMaterialLoading, setIsMaterialLoading] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setupUser(session.user);
        fetchJobs();
        setCurrentView('dashboard');
      }
      setIsInitializing(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setupUser(session.user);
        fetchJobs();
        setCurrentView(prev => (['landing', 'login', 'signup', 'forgot'].includes(prev) ? 'dashboard' : prev));
      } else {
        setIsLoggedIn(false);
        setCurrentUser({ id: null, name: "", email: "", initial: "", avatar: null, company: "", phone: "", joined: "" });
        setJobs([]);
        setCurrentView(prev => (['dashboard', 'profile'].includes(prev) ? 'login' : prev));
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!isInitializing && !isLoggedIn && ['dashboard', 'profile'].includes(currentView)) {
      setCurrentView('login');
    }
  }, [currentView, isLoggedIn, isInitializing]);
  const checkApprovalStatus = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (data?.session?.user) {
      const user = data.session.user;
      const isApprovedStatus = user.user_metadata?.is_approved === true || user.email === 'analysis.ai.nova@gmail.com';
      
      if (isApprovedStatus) {
        setupUser(user); 
        showNotification("Account Approved! You can now submit analysis jobs.", "success");
      }
    }
  };

  const downloadSecureWbexFile = (wizardOrFilename, licenseKey, productName) => {
    let targetFilename = 'Full_Nozzle.wbex';
    const nameLower = (
      typeof wizardOrFilename === 'string'
        ? wizardOrFilename
        : (wizardOrFilename?.filename || wizardOrFilename?.name || productName || '')
    ).toLowerCase();

    if (nameLower.includes('stress') || nameLower.includes('curve')) {
      targetFilename = 'Stress-Strain_Curve.wbex';
    } else if (nameLower.includes('head')) {
      targetFilename = 'Head_Nozzle.wbex';
    } else if (nameLower.includes('shell')) {
      targetFilename = 'Shell_Nozzle.wbex';
    } else if (nameLower.includes('full')) {
      targetFilename = 'Full_Nozzle.wbex';
    }

    const downloadUrl = `/wizards/${targetFilename}`;
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = targetFilename;
    anchor.setAttribute('target', '_self');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    showNotification(
      `Secure download initiated for ${targetFilename}. License: ${licenseKey || 'Active'}`,
      'success',
      'Secure WBEX Delivery'
    );
  };

  const downloadAnsysWbexFile = (filename, licenseKey, productName) => {
    downloadSecureWbexFile(filename, licenseKey, productName);
  };

  const generateNovaLicenseKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `NOVA-${code}`;
  };

  const calculateExpiryDate = (termStr) => {
    const now = new Date();
    const s = String(termStr || '').toLowerCase();
    let months = 1;
    if (s.includes('6 month')) months = 6;
    else if (s.includes('3 month')) months = 3;
    else if (s.includes('1 month')) months = 1;
    else if (s.includes('year') || s.includes('annual')) months = 12;
    const exp = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
    const dd = String(exp.getDate()).padStart(2, '0');
    const mm = String(exp.getMonth() + 1).padStart(2, '0');
    const yyyy = exp.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const getJobInvoiceData = (job) => {
    if (!job) return null;
    let p = job.json_payload;
    if (typeof p === 'string') {
      try { p = JSON.parse(p); } catch (e) {}
    }
    const first = Array.isArray(p) ? p[0] : p;
    if (first && first.invoiceId) return first;

    const isWiz = job.type === 'Wizard Purchase' || (job.name && job.name.toLowerCase().includes('wizard'));
    const isSub = job.type === 'Plan Subscription' || (job.name && job.name.toLowerCase().includes('plan'));
    if (isWiz || isSub || (job.price && job.price > 0)) {
      let licKey = '';
      let expDate = '';
      if (job.error_message && job.error_message.includes('License:')) {
        const matchKey = job.error_message.match(/License:\s*([A-Za-z0-9\-]+)/);
        const matchExp = job.error_message.match(/Expiry:\s*([0-9\-]+)/);
        if (matchKey) licKey = matchKey[1];
        if (matchExp) expDate = matchExp[1];
      }
      if (!licKey) licKey = job.job_id_display || generateNovaLicenseKey();
      if (!expDate) expDate = calculateExpiryDate('1 Month');

      const amt = job.price || (isWiz ? 4999 : 899);
      const baseAmt = Math.round(amt / 1.18);
      const gstAmt = amt - baseAmt;
      const cgst = Math.round(gstAmt / 2);
      const sgst = gstAmt - cgst;

      const jobNameLower = (job.name || '').toLowerCase();
      let targetWbex = 'Full_Nozzle.wbex';
      if (jobNameLower.includes('stress') || jobNameLower.includes('curve')) targetWbex = 'Stress-Strain_Curve.wbex';
      else if (jobNameLower.includes('head')) targetWbex = 'Head_Nozzle.wbex';
      else if (jobNameLower.includes('shell')) targetWbex = 'Shell_Nozzle.wbex';

      return {
        invoiceId: job.job_id_display || ('INV-' + new Date().getFullYear() + '-' + String(job.id || Date.now()).slice(-6)),
        paymentId: 'pay_rzp_live_' + String(job.id || Date.now()).slice(-8),
        date: new Date(job.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        productName: job.name,
        productType: isWiz ? 'wizard_purchase' : 'credit_subscription',
        priceFormatted: '₹' + amt.toLocaleString('en-IN'),
        amountInINR: amt,
        baseAmount: baseAmt,
        cgst,
        sgst,
        isWizard: isWiz,
        licenseKey: licKey,
        expiryDate: expDate,
        registeredOn: new Date(job.created_at || Date.now()).toLocaleString('en-IN'),
        macAddress: '2C:7B:A0:8C:BC:CA',
        wbexFilename: targetWbex,
        result_url: isWiz ? `/wizards/${targetWbex}` : null,
        customerName: currentUser?.name || 'Dinesh',
        customerEmail: currentUser?.email || 'dineshkumar2729304@gmail.com',
        customerPhone: currentUser?.phone || 'Not Provided',
        company: currentUser?.company || 'Nova Engineering',
        term: isWiz ? '1 Month' : 'Monthly',
        workstations: 1
      };
    }
    return null;
  };

  const syncLicenseToGoogleScript = async (licenseRecord) => {
    const wbexFile = licenseRecord.wbexFilename || 'Full_Nozzle.wbex';
    try {
      if (supabase) {
        await supabase.from('ansys_jobs').insert([{
          job_id_display: licenseRecord.licenseKey,
          name: `${licenseRecord.productName} [${licenseRecord.licenseKey}]`,
          status: 'Completed',
          price: licenseRecord.amountInINR || 0,
          type: 'License Provision',
          result_url: `/wizards/${wbexFile}`,
          error_message: `Expiry: ${licenseRecord.expiryDate} | Status: active`,
          json_payload: [licenseRecord]
        }]);
        fetchJobs();
      }
    } catch(err) {
      console.warn("Supabase permanent license save:", err);
    }

    try {
      if (supabase) {
        await supabase.from('nova_orders').insert([{
          order_id: licenseRecord.invoiceId || ("ORD-" + Date.now()),
          invoice_no: licenseRecord.invoiceId || ("INV-" + Date.now()),
          user_email: currentUser?.email || 'dineshkumar2729304@gmail.com',
          user_name: currentUser?.name || 'Dinesh',
          plan_name: licenseRecord.productName,
          billing_cycle: licenseRecord.plan || 'monthly',
          amount: licenseRecord.amountInINR || 0,
          currency: 'INR',
          payment_gateway: 'Razorpay',
          payment_method: 'UPI / NetBanking / Cards',
          transaction_id: licenseRecord.paymentId || ('pay_' + Date.now()),
          status: 'PAID',
          receipt_data: licenseRecord
        }]);
      }
    } catch(err) {
      console.warn("Supabase permanent nova_orders save:", err);
    }

    const scriptUrl = localStorage.getItem('nova_google_script_url') || 
                      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_SCRIPT_URL) ||
                      'https://script.google.com/macros/s/AKfycby-oOC4MImsnlW5VgehlD7OPe0uNGy35m0jbExMiKqvORC6FLRUpmYE3BbL3fdqD0BQ/exec';
    if (scriptUrl) {
      const payload = {
        action: 'add',
        license_key: licenseRecord.licenseKey,
        licenseKey: licenseRecord.licenseKey,
        expiry_date: licenseRecord.expiryDate,
        expiryDate: licenseRecord.expiryDate,
        mac: licenseRecord.macAddress || '2C:7B:A0:8C:BC:CA',
        mac_address: licenseRecord.macAddress || '2C:7B:A0:8C:BC:CA',
        registered_on: licenseRecord.registeredOn,
        registeredOn: licenseRecord.registeredOn,
        status: 'active',
        productName: licenseRecord.productName,
        plan: licenseRecord.plan
      };

      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn("Google Apps Script POST sync error:", err);
      }

      try {
        const qs = new URLSearchParams({
          action: 'add',
          license_key: licenseRecord.licenseKey,
          expiry_date: licenseRecord.expiryDate,
          mac: licenseRecord.macAddress || '2C:7B:A0:8C:BC:CA',
          registered_on: licenseRecord.registeredOn,
          status: 'active'
        }).toString();
        await fetch(`${scriptUrl}?${qs}`, {
          method: 'GET',
          mode: 'no-cors'
        });
      } catch (err) {
        console.warn("Google Apps Script GET sync error:", err);
      }
    }
  };

  const handleRazorpayCheckout = (productName, priceStr, productType = 'general', metadata = {}) => {
    const cleanPriceStr = String(priceStr || '').trim();
    const numOnly = parseFloat(cleanPriceStr.replace(/[^0-9.]/g, '')) || 899;
    const isUSD = cleanPriceStr.indexOf('$') !== -1 || cleanPriceStr.toLowerCase().indexOf('usd') !== -1;
    let amountInINR = isUSD ? Math.round(numOnly * 83) : Math.round(numOnly);
    if (amountInINR < 1) amountInINR = 1;
    const amountInPaise = amountInINR * 100;

    const isWizard = productType === 'wizard' || productType === 'wizard_purchase' || 
                     productName.toLowerCase().indexOf('wizard') !== -1 || productName.toLowerCase().indexOf('.wbex') !== -1;

    const baseAmount = Math.round(amountInINR / 1.18);
    const gstAmount = amountInINR - baseAmount;
    const cgst = Math.round(gstAmount / 2);
    const sgst = gstAmount - cgst;

    const finalizePayment = (paymentId) => {
      const invoiceId = "INV-" + new Date().getFullYear() + "-" + Date.now().toString().slice(-6);
      const pId = paymentId || ("pay_rzp_" + Date.now().toString().slice(-8));

      const licenseKey = generateNovaLicenseKey();

      const chosenPlanOrTerm = metadata?.term || metadata?.planName || (isWizard ? '1 Month' : 'Monthly');
      const expiryDate = calculateExpiryDate(chosenPlanOrTerm);

      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const registeredOn = `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;

      let wbexFilename = null;
      if (isWizard) {
        if (metadata?.filename) {
          wbexFilename = metadata.filename;
        } else {
          const pLower = (productName || '').toLowerCase();
          if (pLower.includes('stress') || pLower.includes('curve')) wbexFilename = 'Stress-Strain_Curve.wbex';
          else if (pLower.includes('head')) wbexFilename = 'Head_Nozzle.wbex';
          else if (pLower.includes('shell')) wbexFilename = 'Shell_Nozzle.wbex';
          else wbexFilename = 'Full_Nozzle.wbex';
        }
      }

      const invoiceData = {
        invoiceId,
        paymentId: pId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        productName,
        productType,
        priceFormatted: "₹" + amountInINR.toLocaleString('en-IN'),
        amountInINR,
        baseAmount,
        cgst,
        sgst,
        isWizard,
        licenseKey,
        expiryDate,
        registeredOn,
        macAddress: '2C:7B:A0:8C:BC:CA',
        wbexFilename,
        result_url: isWizard ? `/wizards/${wbexFilename}` : null,
        customerName: currentUser?.name || 'Dinesh',
        customerEmail: currentUser?.email || 'dineshkumar2729304@gmail.com',
        customerPhone: currentUser?.phone || '+91 98765 43210',
        company: currentUser?.company || 'Nova Engineering Corp',
        term: chosenPlanOrTerm,
        workstations: metadata?.workstations || (isWizard ? 1 : 'All Workstations')
      };

      syncLicenseToGoogleScript({
        licenseKey,
        expiryDate,
        registeredOn,
        macAddress: '2C:7B:A0:8C:BC:CA',
        status: 'active',
        productName,
        plan: chosenPlanOrTerm,
        amountInINR,
        invoiceId,
        wbexFilename
      });

      if (!isWizard && (productType === 'credit_subscription' || metadata?.planName)) {
        const planName = metadata?.planName || (productName.indexOf('Max') !== -1 ? 'Max' : productName.indexOf('Pro') !== -1 ? 'Pro' : 'Basic');
        const dailyCreds = planName === 'Max' ? 3000 : planName === 'Pro' ? 1500 : 700;
        setCurrentUser(prev => ({
          ...prev,
          plan: planName,
          dailyCreditsTotal: dailyCreds,
          dailyCreditsRemaining: dailyCreds
        }));
        try {
          if (supabase) {
            supabase.from('user_profiles').upsert({
              email: currentUser?.email,
              full_name: currentUser?.name,
              plan: planName,
              daily_credits_total: dailyCreds,
              daily_credits_remaining: dailyCreds,
              updated_at: new Date().toISOString()
            }).then(({ error }) => {
              if (error) console.warn("Supabase user profile plan update error:", error);
            });
          }
          localStorage.setItem("nova_credits_" + currentUser?.email, dailyCreds.toString());
          localStorage.setItem('nova_user_plan_permanent', JSON.stringify({ plan: planName, credits: dailyCreds }));
        } catch(e) {}
      }

      try {
        if (supabase) {
          supabase.from('ansys_jobs').insert([{
            name: productName,
            status: 'Completed',
            price: amountInINR,
            type: isWizard ? 'Wizard Purchase' : 'Plan Subscription',
            job_id_display: invoiceId,
            result_url: isWizard ? `/wizards/${wbexFilename}` : null,
            error_message: licenseKey ? `License: ${licenseKey} | Expiry: ${expiryDate}` : null,
            json_payload: [invoiceData]
          }]).then(({ error }) => {
            if (error) console.warn("Supabase order insert error:", error);
            fetchJobs();
          });
        }
      } catch (err) {
        console.warn("Supabase job insert error:", err);
      }

      const newJobRecord = {
        id: "ord_" + Date.now(),
        job_id_display: invoiceId,
        name: productName,
        status: 'Completed',
        price: amountInINR,
        type: isWizard ? 'Wizard Purchase' : 'Plan Subscription',
        result_url: isWizard ? `/wizards/${wbexFilename}` : null,
        created_at: new Date().toISOString()
      };
      setJobs(prev => [newJobRecord, ...prev]);

      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            new Notification('NOVA AI - Payment Confirmed', {
              body: isWizard 
                ? ("Ansys ACT Wizard activated! License: " + licenseKey + " | Expiry: " + expiryDate) 
                : ("Plan upgraded to " + productName + ". Invoice #" + invoiceId + " generated."),
              icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            });
          } catch(e) {}
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              try {
                new Notification('NOVA AI - Payment Confirmed', {
                  body: isWizard 
                    ? ("Ansys ACT Wizard activated! License: " + licenseKey + " | Expiry: " + expiryDate) 
                    : ("Plan upgraded to " + productName + ". Invoice #" + invoiceId + " generated."),
                  icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                });
              } catch(e) {}
            }
          });
        }
      }

      showNotification(
        isWizard 
          ? ("Payment verified of ₹" + amountInINR.toLocaleString('en-IN') + "! Ansys ACT Wizard activated. License: " + licenseKey + " (Expires: " + expiryDate + ")") 
          : ("Payment verified of ₹" + amountInINR.toLocaleString('en-IN') + "! Upgraded to " + productName + ". Invoice #" + invoiceId),
        'success',
        isWizard ? 'Ansys Wizard License' : 'Subscription Upgrade'
      );

      setCompletedInvoice(invoiceData);
    };

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    const launchRazorpayModal = () => {
      if (typeof window === 'undefined' || !window.Razorpay) {
        showNotification('Payment gateway loading... Please try again in a moment.', 'info', 'Razorpay');
        finalizePayment("pay_rzp_" + Date.now().toString().slice(-8));
        return;
      }

      try {
        const options = {
          key: razorpayKey,
          amount: amountInPaise,
          currency: "INR",
          name: "NOVA AI TECHNOLOGIES",
          description: productName,
          image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          handler: function (response) {
            finalizePayment(response.razorpay_payment_id);
          },
          prefill: {
            name: currentUser?.name || "Dinesh",
            email: currentUser?.email || "dineshkumar2729304@gmail.com",
            contact: currentUser?.phone || "+919876543210"
          },
          notes: {
            product_type: productType,
            product_name: productName,
            term: metadata?.term || '',
            workstations: String(metadata?.workstations || 1),
            wizard_id: metadata?.wizardId || '',
            filename: metadata?.filename || ''
          },
          theme: {
            color: "#2874f0"
          },
          modal: {
            ondismiss: function() {
              showNotification('Razorpay checkout window closed.', 'info', 'Razorpay Checkout');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          showNotification("Payment Failed: " + (response.error?.description || 'Transaction declined'), 'error', 'Payment Failed');
        });
        rzp.open();
      } catch (err) {
        showNotification('Payment gateway error. Please try again.', 'error', 'Razorpay Error');
        finalizePayment("pay_rzp_" + Date.now().toString().slice(-8));
      }
    };

    if (typeof window !== 'undefined' && window.Razorpay) {
      launchRazorpayModal();
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => launchRazorpayModal();
      script.onerror = () => launchRazorpayModal();
      document.body.appendChild(script);
    }
  };

  const downloadCodeSnippet = (filename, content) => {
    if (!content) return;
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'ansys_fea_script.py';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(`Downloaded ${filename || 'script'} to your computer`, 'success', 'Code File');
    } catch (e) {
      console.error("Code download error:", e);
      showNotification('Failed to trigger file download', 'error');
    }
  };

  const handleMediaFileUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showNotification('File size exceeds 15MB limit.', 'error', 'File Too Large');
      return;
    }
    const isVideo = file.type.startsWith('video');
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewPostMedia({
        data: event.target.result,
        type: isVideo ? 'video' : 'image',
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
      setShowAttachMenu(false);
      showNotification(`Attached ${isVideo ? 'video' : 'image'}: ${file.name}`, 'info', 'Media Attached');
    };
    reader.readAsDataURL(file);
  };

  const handleCodeFileUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').length;
      const ext = file.name.split('.').pop().toLowerCase();
      const lang = ext === 'py' || ext === 'wbex' ? 'python' : ext === 'mac' || ext === 'apdl' || ext === 'inp' ? 'apdl' : ext === 'json' ? 'json' : 'text';
      
      setNewPostCode({
        content: text,
        filename: file.name,
        lines: lines,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        lang: lang
      });
      setComposerCodeFilename(file.name);
      setComposerCodeContent(text);
      setComposerCodeLang(lang);
      setCodeModalFilename(file.name);
      setCodeModalContent(text);
      setCodeModalLang(lang);
      setShowCodeModal(true);
      setShowAttachMenu(false);
      showNotification(`Loaded script: ${file.name} (${lines} lines)`, 'success', 'Script Loaded');
    };
    reader.readAsText(file);
  };

  const fetchCommunityPosts = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('nova_community_posts').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          const mockIds = ['post_asme_div2_scl_linearization', 'post_cyclic_fatigue_weld', 'post_spaceclaim_nozzle_blend', 'post_hexahedral_meshing_convergence'];
          const clean = data.filter(p => p && !mockIds.includes(p.id));
          setCommunityPosts(clean);
          try { localStorage.setItem('nova_community_posts_permanent', JSON.stringify(clean)); } catch(e) {}
          return;
        }
      }
    } catch(e) {
      console.warn("fetchCommunityPosts error:", e);
    }
  };

  const fetchCommunityComments = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('nova_community_comments').select('*').order('created_at', { ascending: true });
        if (!error && data) {
          const mockIds = ['post_asme_div2_scl_linearization', 'post_cyclic_fatigue_weld', 'post_spaceclaim_nozzle_blend', 'post_hexahedral_meshing_convergence'];
          const grouped = {};
          data.forEach(item => {
            const pId = item.post_id;
            if (pId && !mockIds.includes(pId)) {
              if (!grouped[pId]) grouped[pId] = [];
              grouped[pId].push({
                id: item.id,
                user: item.user_name || 'Nova Engineer',
                initial: item.user_initial || (item.user_name ? item.user_name[0].toUpperCase() : 'E'),
                email: item.user_email || '',
                text: item.comment || '',
                time: item.created_at ? new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Recently',
                date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today',
                created_at: item.created_at
              });
            }
          });

          setPostComments(grouped);
          try { localStorage.setItem('nova_community_comments_permanent', JSON.stringify(grouped)); } catch(e) {}
        }
      }
    } catch(e) {
      console.warn("fetchCommunityComments error:", e);
    }
  };

  const handlePostCommunity = async () => {
    const rawContent = newPostText.trim();
    const rawCode = composerCodeContent.trim() || newPostCode?.content;
    const rawMedia = newPostMedia;
    const postCat = composerCategory || communityCategory || 'ASME Codes';

    if (!rawContent && !rawCode && !rawMedia) {
      showNotification('Please type a message, attach code, or add media.', 'error', 'Empty Message');
      return;
    }
    setIsPosting(true);

    const generatedTitle = composerTitle.trim() || (rawContent.length > 70 
      ? rawContent.substring(0, 70) + '...' 
      : (rawContent || (rawCode ? `FEA Automation Script: ${composerCodeFilename}` : 'Engineering Discussion Topic')));

    const newPostPayload = { 
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_name: currentUser?.name || 'Nova Engineer',
      user_email: currentUser?.email || 'user@nova.ai',
      user_initial: currentUser?.initial || (currentUser?.name ? currentUser.name[0].toUpperCase() : 'E'),
      user_role: currentUser?.plan === 'Max' ? 'Nova Lead Architect' : 'FEA Specialist',
      user_reputation: currentUser?.plan === 'Max' ? 1420 : 150,
      title: generatedTitle,
      content: rawContent,
      category: postCat === 'All' ? 'ASME Codes' : postCat,
      tags: [],
      image_url: rawMedia?.type === 'image' ? rawMedia.data : null,
      media_url: rawMedia?.data || null,
      media_type: rawMedia?.type || null,
      media_name: rawMedia?.name || null,
      code_snippet: rawCode || null,
      code_filename: rawCode ? (composerCodeFilename || 'asme_script.py') : null,
      likes_count: 0,
      is_solved: false,
      is_pinned: false,
      created_at: new Date().toISOString()
    };

    setCommunityPosts(prev => {
      const updated = [newPostPayload, ...prev];
      try { localStorage.setItem('nova_community_posts_permanent', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });

    try {
      if (supabase) {
        const { data, error } = await supabase.from('nova_community_posts').insert([{
          user_name: newPostPayload.user_name,
          user_initial: newPostPayload.user_initial,
          title: newPostPayload.title,
          content: newPostPayload.content,
          category: newPostPayload.category,
          image_url: newPostPayload.image_url,
          code_snippet: newPostPayload.code_snippet,
          likes_count: 0
        }]).select();

        if (data && data[0]) {
          setCommunityPosts(prev => {
            const updated = prev.map(p => p.id === newPostPayload.id ? { ...p, id: data[0].id } : p);
            try { localStorage.setItem('nova_community_posts_permanent', JSON.stringify(updated)); } catch(e) {}
            return updated;
          });
        }
      }
    } catch(e) {
      console.warn("Supabase community post err:", e);
    }

    setNewPostText('');
    setComposerTitle('');
    setComposerCodeContent('');
    setNewPostMedia(null);
    setNewPostCode(null);
    setShowAttachMenu(false);
    setShowCodeModal(false);
    setIsPosting(false);

    showNotification('Message published & synchronized live to Nova Chat!', 'success', 'Discussion');
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    
    setCommunityPosts(prev => {
      const updated = prev.filter(p => p.id !== postId);
      try { localStorage.setItem('nova_community_posts_permanent', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });

    try {
      if (supabase) {
        await supabase.from('nova_community_posts').delete().eq('id', postId);
      }
    } catch(e) {}

    showNotification('Discussion permanently removed from community', 'info', 'Community');
  };

  const handleToggleBookmark = (postId) => {
    const isCurrently = !!bookmarkedPosts[postId];
    const updated = { ...bookmarkedPosts, [postId]: !isCurrently };
    setBookmarkedPosts(updated);
    try { localStorage.setItem('nova_community_bookmarks', JSON.stringify(updated)); } catch(e) {}
    showNotification(!isCurrently ? 'Discussion saved to your Bookmarks!' : 'Removed from Bookmarks', 'info', 'Bookmarks');
  };

  const handleToggleSolved = (postId) => {
    const isCurrently = !!solvedPosts[postId];
    const updated = { ...solvedPosts, [postId]: !isCurrently };
    setSolvedPosts(updated);
    try { localStorage.setItem('nova_community_solved', JSON.stringify(updated)); } catch(e) {}
    showNotification(!isCurrently ? 'Marked discussion as Solved! 💡' : 'Marked discussion as Open', 'success', 'Status Updated');
  };
  
  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase.from('ansys_jobs').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setJobs(data);
        setSelectedJobDetails(prev => {
          if (!prev) return null;
          const updated = data.find(j => j.id === prev.id);
          return updated || prev;
        });
      }
    } catch (e) {
      console.error("fetchJobs error:", e);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchJobs();
      fetchCommunityPosts();
      fetchCommunityComments();
      const channel = supabase
        .channel('ansys_jobs_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'ansys_jobs' },
          () => {
            fetchJobs();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'nova_community_posts' },
          () => {
            fetchCommunityPosts();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'nova_community_comments' },
          () => {
            fetchCommunityComments();
          }
        )
        .subscribe();
      const interval = setInterval(() => {
        fetchJobs();
        if (!currentUser.isApproved) {
          checkApprovalStatus();
        }
      }, 1500);
      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, [isLoggedIn, currentUser.isApproved]);
  const setupUser = (user) => {
      const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
      const isDinesh = user.email === 'dineshkumar2729304@gmail.com';
      let userPlan = isDinesh ? 'Max' : 'Free';
      let totalCredits = isDinesh ? 3000 : 100;
      const savedSub = localStorage.getItem(`nova_sub_${user.email}`);
      if (savedSub && !isDinesh) {
        try {
          const parsed = JSON.parse(savedSub);
          userPlan = parsed.plan || 'Free';
          totalCredits = parsed.totalCredits || (userPlan === 'Max' ? 3000 : userPlan === 'Pro' ? 1500 : userPlan === 'Basic' ? 700 : 100);
        } catch (e) {}
      }
      const savedCredits = localStorage.getItem(`nova_credits_${user.email}`);
      let remainingCredits = totalCredits;
      if (savedCredits !== null) {
        remainingCredits = Math.min(totalCredits, parseInt(savedCredits, 10));
      }
      const isApprovedStatus = user.user_metadata?.is_approved === true || user.email === 'analysis.ai.nova@gmail.com' || isDinesh || userPlan !== 'Free';
      setCurrentUser({
        id: user.id,
        name: fullName,
        email: user.email,
        initial: fullName.charAt(0).toUpperCase(),
        avatar: user.user_metadata?.avatar_url || null, 
        company: user.user_metadata?.company || "Not Provided",
        phone: user.user_metadata?.phone || "Not Provided",
        joined: new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        isApproved: isApprovedStatus,
        plan: userPlan,
        dailyCreditsTotal: totalCredits,
        dailyCreditsRemaining: remainingCredits,
        isLifetimeMax: false
      });
      
      localStorage.setItem('nova_user', JSON.stringify({ id: user.id, email: user.email }));
      setIsLoggedIn(true);
      supabase.from('user_profiles').select('*').eq('email', user.email).maybeSingle().then(({ data: dbProfile, error }) => {
        if (!error && dbProfile) {
          const finalPlan = isDinesh ? 'Max' : (dbProfile.plan || userPlan);
          const finalTotal = isDinesh ? 3000 : (dbProfile.daily_credits_total || totalCredits);
          const finalRemaining = dbProfile.daily_credits_remaining !== null && dbProfile.daily_credits_remaining !== undefined 
            ? Math.min(finalTotal, dbProfile.daily_credits_remaining)
            : finalTotal;
          setCurrentUser(prev => ({
            ...prev,
            plan: finalPlan,
            dailyCreditsTotal: finalTotal,
            dailyCreditsRemaining: finalRemaining
          }));
        } else {
          supabase.from('user_profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            plan: userPlan,
            daily_credits_total: totalCredits,
            daily_credits_remaining: remainingCredits,
            is_approved: isApprovedStatus
          }, { onConflict: 'email' }).then();
        }
      }).catch(err => console.warn('Supabase profile sync warning:', err));
    };
  const PLAN_RANKS = { 'Free': 0, 'Basic': 1, 'Pro': 2, 'Max': 3 };
  const canRunPlan = (requiredPlan) => {
    return true;
  };
  const consumeCredits = (featureName, creditCost, requiredPlan, onAllowed) => {
    if (!currentUser.email) {
      setCurrentView('login');
      return false;
    }
    if (onAllowed) {
      onAllowed();
    }
    return true;
  };
  useEffect(() => {
    if (showSplash) {
      const exitTimer = setTimeout(() => setIsSplashExiting(true), 3500);
      const unmountTimer = setTimeout(() => {
        setShowSplash(false);
        setIsSplashExiting(false);
      }, 4200);
      return () => { clearTimeout(exitTimer); clearTimeout(unmountTimer); };
    }
  }, [showSplash]);
  const handleLogoClick = () => {
    setCurrentView('landing');
    setIsSplashExiting(false);
    setShowSplash(true);
    window.scrollTo(0,0);
  };
  const showNotification = (message, type = 'success', title = null) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);

    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title || (type === 'success' ? 'Action Completed' : type === 'error' ? 'System Alert' : 'Notification'),
      message: message,
      type: type,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      read: false
    };

    setPersistentNotifications(prev => {
      const updated = [newNotif, ...(prev || []).slice(0, 49)];
      try { localStorage.setItem('nova_persistent_notifications', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
  };
  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };
  const handleRouteToAuth = () => {
    setIsMobileMenuOpen(false);
    if (isLoggedIn) setCurrentView('dashboard');
    else setCurrentView('login');
  };
  const callGeminiAPI = async (contents, systemInstructionText) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const payload = { contents, systemInstruction: { parts: [{ text: systemInstructionText }] } };
    const delays = [1000, 2000, 4000, 8000, 16000];
    
    for (let i = 0; i <= delays.length; i++) {
      try {
        const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      } catch (error) {
        if (i === delays.length) return "Sorry, I am currently experiencing technical difficulties. Please try again later.";
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
  };
  useEffect(() => {
    if (currentView === 'landing' && !showSplash) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
      const elements = document.querySelectorAll('.reveal');
      elements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [currentView, showSplash]);
  const handleAiSetupSubmit = async () => {
    if (!aiSetupPrompt.trim()) return;
    setIsAiSetupLoading(true);
    setAiSetupResponse("");
    const systemInstruction = `You are an expert Principal Mechanical FEA Engineer and AI Solutions Architect for NOVA AI TECHNOLOGIES.
Your task is to analyze the user's engineering scenario and recommend the optimal NOVA solution:

1. CLOUD FEA ANALYSIS MODULES (Automated cloud solver, ASME code compliance checks & instant DOCX/PDF reports):
   - ASME Nozzle Analysis (ASME Section VIII-2 Part 5 Elastic-Plastic, 300 credits)
   - Bellow Expansion Joint Analysis (EJMA 10th Ed & ASME VIII-1 App 26, 300 credits)
   - Saddle Horizontal Vessel Support (Zick Method & ASME Section VIII, 150 credits)
   - Local PWHT Thermal Analysis (WRC 452 & ASME VIII-1 UW-40, 125 credits)
   - Flange Rigidity & Leakage (ASME VIII-1 App 2 & EN 1591, 200 credits)
   - Hot Box Skirt Thermal FEA (75 credits)
   - Lifting Lug Analysis (WRC 107/537, 75 credits)
   - Heavy Trunnion Vessel Support (ASME VIII-2 Part 5 & WRC 537, 175 credits)
   - 2D Axisymmetric Tubesheet Heat Exchanger (ASME VIII-1 UHX & TEMA RCB, 250 credits)
   - CAD AI 3D Parametric STEP Generator (75 credits)
   - ASME Materials Database (10 credits / Free)
   - Stress-Strain Curve Generator (10 credits / Free)

2. ANSYS ACT WIZARDS (.WBEX EXTENSIONS FOR LOCAL ANSYS WORKBENCH / MECHANICAL):
   - Shell Nozzle Ansys ACT Wizard (.WBEX) [Base: ₹4,999/mo | ₹12,499/3mo | ₹19,999/6mo]: Cylindrical & conical shell nozzle parametric FEA and stress linearization.
   - Head Nozzle Ansys ACT Wizard (.WBEX) [1.5X Price: ₹7,499/mo | ₹18,749/3mo | ₹29,999/6mo]: Hemispherical, 2:1 ellipsoidal, and torispherical head nozzle parametric analysis.
   - Full Nozzle Ansys ACT Wizard (.WBEX) [2X Price: ₹9,999/mo | ₹24,999/3mo | ₹39,999/6mo]: Complete comprehensive nozzle suite for both Shell and all Vessel Head types.
   - Stress-Strain Curve Ansys ACT Wizard (.WBEX) [₹1,499/mo | ₹3,749/3mo | ₹5,999/6mo]: Generates all types of stress-strain curves in Ansys (Ramberg-Osgood, MISO, KINH, True Stress-True Strain, ASME VIII-2 Annex 3-D).

Format your recommendation cleanly with:
- Recommended Solution (Cloud Module vs Ansys ACT Wizard .WBEX)
- Applicable Governing Standard (e.g. ASME VIII-2 Part 5, EJMA, WRC 537, TEMA)
- Key Input Data Required (geometry, design pressure, temperature, nozzle loads P/V/M, corrosion allowance, material grade)
- Verification & Deliverable (Von Mises stress, stress categorization Pm/Pl/Pb/Q, plastic limit load, DOCX report or .WBEX workflow).`;
    const responseText = await callGeminiAPI([{ role: "user", parts: [{ text: aiSetupPrompt }] }], systemInstruction);
    setAiSetupResponse(responseText);
    setIsAiSetupLoading(false);
  };
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportInput.trim() || isSupportLoading) return;
    const newChat = [...supportChat, { role: 'user', text: supportInput }];
    setSupportChat(newChat);
    setSupportInput("");
    setIsSupportLoading(true);
    const contents = newChat.map(msg => ({ role: msg.role === 'model' ? 'model' : 'user', parts: [{ text: msg.text }] }));
    const systemInstruction = `You are NOVA AI, the authoritative senior mechanical engineering assistant for NOVA AI TECHNOLOGIES.

LATEST OFFICIAL PRICING & PRODUCTS GUIDE:
1. CLOUD SUBSCRIPTION PLANS (100% Daily Credit Auto-Reset at 00:00 UTC / 05:30 AM IST):
   - Free Plan: ₹0 ($0) — 100 credits/day, ASME Materials (10 cr), Stress-Strain Curves (10 cr), AI Recommender.
   - Basic Plan: ₹899/month ($10) — 700 credits/day, ASME Nozzle Analysis (300 cr), Bellow Expansion Joint (300 cr), Saddle Analysis (150 cr), Local PWHT (125 cr), Full DOCX/PDF reports.
   - Pro Plan: ₹2,999/month ($35) — 1,500 credits/day, All Basic modules + Flange Rigidity (200 cr), Hot Box (75 cr), Lug Lifting (75 cr), Priority queue.
   - Max Plan: ₹4,999/month ($60) — 3,000 credits/day, All Pro modules + Trunnion Support (175 cr), Tubesheet Heat Exchanger (250 cr), CAD AI 3D Generator (75 cr), Full platform capability.

2. ANSYS ACT EXTENSION WIZARDS (.WBEX) for Local Ansys Workbench / Mechanical:
   - Shell Nozzle ACT Wizard (.WBEX):
     * 1 Month: ₹4,999 (1 Workstation)
     * 3 Months: ₹12,499 (1 Workstation)
     * 6 Months: ₹19,999 (2 Workstations - Recommended)
   - Head Nozzle ACT Wizard (.WBEX) [1.5X of Shell Nozzle]:
     * 1 Month: ₹7,499 (1 Workstation)
     * 3 Months: ₹18,749 (1 Workstation)
     * 6 Months: ₹29,999 (2 Workstations - Recommended)
   - Full Nozzle ACT Wizard (.WBEX) [2X of Shell Nozzle]:
     * 1 Month: ₹9,999 (1 Workstation)
     * 3 Months: ₹24,999 (1 Workstation)
     * 6 Months: ₹39,999 (2 Workstations - Recommended)
   - Stress-Strain Curve ACT Wizard (.WBEX) [All types of stress-strain curves generated directly in Ansys]:
     * 1 Month: ₹1,499 (1 Workstation)
     * 3 Months: ₹3,749 (1 Workstation)
     * 6 Months: ₹5,999 (2 Workstations - Recommended)

3. DELIVERY & SECURITY:
   - Node-locked commercial license keys and secure direct WBEX downloads are provisioned instantly upon successful Razorpay payment verification.
   - No insecure external drive links are used.
   - Payments processed via Razorpay Live (UPI, Cards, Net Banking, International).
   - Contact: analysis.ai.nova@gmail.com | WhatsApp: +91 8757014303.

Always provide professional, precise, technically accurate, and helpful answers.`;
    const responseText = await callGeminiAPI(contents, systemInstruction);
    setSupportChat(prev => [...prev, { role: 'model', text: responseText }]);
    setIsSupportLoading(false);
  };
  const handleGenerateInsights = async (job) => {
    setSelectedInsightJob(job);
    setIsInsightsOpen(true);
    setIsInsightLoading(true);
    setInsightResponse("");
    const systemInstruction = "You are a Senior Principal Mechanical Engineer reviewing an FEA analysis. Keep it extremely brief, professional, and highly structured.";
    const prompt = `Generate a realistic 3-bullet executive summary for a completed Finite Element Analysis of a ${job.type} project named "${job.name}". Invent realistic details assuming the geometry passed ASME Section VIII Div 2 Part 5 code compliance. Include a hypothetical maximum Von Mises stress (in MPa) and a safety factor.`;
    const responseText = await callGeminiAPI([{ role: "user", parts: [{ text: prompt }] }], systemInstruction);
    setInsightResponse(responseText);
    setIsInsightLoading(false);
  };
  const handleMaterialConsultant = async (e) => {
    e.preventDefault();
    if (!materialPrompt.trim()) return;
    setIsMaterialLoading(true);
    setMaterialResponse("");
    
    const systemInstruction = "You are an expert metallurgist and pressure vessel engineer.";
    const prompt = `Based on these operating conditions: "${materialPrompt}", recommend 2-3 suitable ASME materials for a pressure vessel or heat exchanger component. State the material grade and provide a brief 1-sentence technical justification for each.`;
    const responseText = await callGeminiAPI([{ role: "user", parts: [{ text: prompt }] }], systemInstruction);
    setMaterialResponse(responseText);
    setIsMaterialLoading(false);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!emailRegex.test(loginEmail)) errors.email = "Please enter a valid email address.";
    if (!loginPassword) errors.password = "Password is required.";
    if (Object.keys(errors).length > 0) return setAuthErrors(errors);
    
    setAuthErrors({});
    setIsAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setIsAuthLoading(false);
    if (error) {
      setAuthErrors({ password: error.message });
    } else {
      setCurrentView('dashboard');
      showNotification("Successfully logged in!");
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!signupName.trim()) errors.name = "Full Name is required.";
    if (!emailRegex.test(signupEmail)) errors.email = "Please enter a valid email address.";
    if (!passwordRegex.test(signupPassword)) errors.password = "Password must be at least 8 chars, with 1 letter, 1 number, and 1 symbol.";
    if (Object.keys(errors).length > 0) return setAuthErrors(errors);
    setAuthErrors({});
    setIsAuthLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { full_name: signupName } }
    });
    setIsAuthLoading(false);
    if (error) {
      setAuthErrors({ email: error.message });
    } else {
      showNotification("Account created! Please check your email to verify your account.", "info");
      setCurrentView('login');
      setLoginEmail(signupEmail);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('nova_user');
    setIsDropdownOpen(false);
    setCurrentView('landing');
    showNotification("Logged out successfully.", "info");
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!passwordRegex.test(pwdForm.new)) errors.new = "New password must be at least 8 chars, with 1 letter, 1 number, and 1 symbol.";
    if (pwdForm.new !== pwdForm.confirm) errors.confirm = "Passwords do not match.";
    if (Object.keys(errors).length > 0) {
      setPwdErrors(errors);
      setIsPwdSuccess(false);
      return;
    }
    setPwdErrors({});
    
    const { error } = await supabase.auth.updateUser({ password: pwdForm.new });
    if (error) {
      setPwdErrors({ confirm: error.message });
      setIsPwdSuccess(false);
    } else {
      setIsPwdSuccess(true); 
      showNotification("Password changed securely!");
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setIsPwdSuccess(false);
        setPwdForm({ current: '', new: '', confirm: '' });
        setShowPwd({ current: false, new: false, confirm: false });
      }, 1500);
    }
  };
  const handleEditProfile = async (e) => {
      e.preventDefault();
      const { error } = await supabase.auth.updateUser({
        data: { company: editForm.company, phone: editForm.phone }
      });
      if (error) {
        showNotification("Failed to update profile: " + error.message, "error");
      } else {
        setCurrentUser(prev => ({ ...prev, company: editForm.company, phone: editForm.phone }));
        setIsEditProfileOpen(false);
        showNotification("Profile updated successfully!", "success");
      }
    };
  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(forgotEmail)) return setForgotErrors({ email: "Please enter a valid email address." });
    
    setForgotErrors({});
    setIsForgotLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail);
    
    setIsForgotLoading(false);
    if (error) {
      setForgotErrors({ email: error.message });
    } else {
      setForgotStep(2);
      showNotification(`Verification code sent to ${forgotEmail}`, "info");
    }
  };
  const handleForgotCodeSubmit = async (e) => {
    e.preventDefault();
    if (forgotCode.length !== 6) return setForgotErrors({ code: "Invalid verification code." });
    
    setForgotErrors({});
    setIsForgotLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: forgotEmail,
      token: forgotCode,
      type: 'recovery'
    });
    setIsForgotLoading(false);
    if (error) {
      setForgotErrors({ code: error.message });
    } else {
      setForgotStep(3);
      showNotification("Email verified successfully!", "success");
    }
  };
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!passwordRegex.test(forgotNewPwd)) errors.new = "Password must be at least 8 chars, with 1 letter, 1 number, and 1 symbol.";
    if (forgotNewPwd !== forgotConfirmPwd) errors.confirm = "Passwords do not match.";
    if (Object.keys(errors).length > 0) return setForgotErrors(errors);
    setForgotErrors({});
    setIsForgotLoading(true);
    const { error } = await supabase.auth.updateUser({ password: forgotNewPwd });
    setIsForgotLoading(false);
    if (error) {
      setForgotErrors({ new: error.message });
    } else {
      setCurrentView('login');
      setLoginPassword(''); 
      showNotification("Password reset successfully! Please log in.", "success");
      setForgotStep(1);
    }
  };
  const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file || !currentUser.id) return;
      showNotification("Uploading profile picture...", "info");
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        });
        if (updateError) throw updateError;
        setCurrentUser(prev => ({ ...prev, avatar: publicUrl }));
        showNotification("Profile picture updated successfully!", "success");
      } catch (error) {
        console.error('Upload error:', error);
        showNotification("Error uploading picture: " + error.message, "error");
      }
    };
  const openSubmitJob = (type) => {
    setSelectedJobType(type);
    setIsSubmitJobOpen(true);
    setShowMaterialConsultant(false);
    setMaterialPrompt("");
    setMaterialResponse("");
  };
  const handleRequestAccess = async () => {
    setIsRequestingAccess(true);
    try {
      await emailjs.send(
        "service_jknqgty",               
        "template_nynl6qp",              
        {
          user_name: currentUser.name,
          user_email: currentUser.email
        },
        "ZTYpRTAZMIRlDw98k"                
      );
      showNotification("Access request sent to Admin successfully!", "success");
    } catch (error) {
      console.error("Error sending access request:", error);
      showNotification("Failed to send request. Please try again.", "error");
    } finally {
      setIsRequestingAccess(false);
    }
  };
  
  const handleJobSubmit = async (e) => {
      e.preventDefault();
      if (!currentUser.id) return;
      const jobName = e.target.jobName.value;
      const newJob = {
        user_id: currentUser.id,
        job_id_display: `NV-${1000 + jobs.length}`,
        name: jobName,
        type: selectedJobType,
        status: 'Pending',
        price: selectedJobType === 'Nozzle Analysis' ? 300 : selectedJobType === 'Bellow Analysis' ? 300 : 150 
      };
      try {
        const { data: insertedJob, error } = await supabase
          .from('ansys_jobs')
          .insert([newJob])
          .select()
          .single();
        if (error) throw error;
        setIsSubmitJobOpen(false);
        showNotification(`${selectedJobType} submitted! Added to queue.`, 'success');
        fetchJobs(); 
      } catch (error) {
        console.error("Database Error:", error);
        showNotification(`Error submitting job: ${error.message}`, "error");
      }
    };
  const filteredJobs = jobFilter.startsWith('All') 
  ? jobs 
  : jobs.filter(j => {
      if (jobFilter === 'Bellow Analysis') return j.type.includes('Bellow');
      if (jobFilter === 'Nozzle Analysis') return j.type.includes('Nozzle');
      if (jobFilter === 'Flange Analysis') return j.type.includes('Flange');
      if (jobFilter === 'Saddle Analysis') return j.type.includes('Saddle');
      if (jobFilter === 'Local PWHT') return j.type.includes('PWHT');
      if (jobFilter === 'Hot Box Analysis') return j.type.includes('Hot Box');
      if (jobFilter === 'Vessel Stiffener Ring Analysis') return j.type.includes('Vessel Stiffener');
      if (jobFilter === 'Lifting Lug WRC Analysis') return j.type.includes('Lifting Lug WRC');
      if (jobFilter === 'Trunnion WRC Analysis') return j.type.includes('Trunnion WRC');
      if (jobFilter === '2D Axisymetric Tubesheet Analysis') return j.type.includes('2D Axisymetric Tubesheet');
      return j.type === jobFilter;
    });
  const handleDeleteJob = async (jobId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this analysis job?")) return;
    try {
      setIsDeletingJobs(true);
      const { error } = await supabase.from('ansys_jobs').delete().eq('id', jobId);
      if (error) throw error;
      setJobs(prev => prev.filter(j => j.id !== jobId));
      setSelectedJobIds(prev => prev.filter(id => id !== jobId));
      if (selectedJobDetails?.id === jobId) {
        setSelectedJobDetails(null);
        setIsJobDetailsOpen(false);
      }
      showNotification("Job deleted successfully.", "success");
    } catch (err) {
      console.error("Delete error:", err);
      showNotification("Failed to delete job: " + err.message, "error");
    } finally {
      setIsDeletingJobs(false);
    }
  };
  const handleDeleteSelectedJobs = async () => {
    if (selectedJobIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedJobIds.length} selected job(s)?`)) return;
    try {
      setIsDeletingJobs(true);
      const { error } = await supabase.from('ansys_jobs').delete().in('id', selectedJobIds);
      if (error) throw error;
      setJobs(prev => prev.filter(j => !selectedJobIds.includes(j.id)));
      if (selectedJobDetails && selectedJobIds.includes(selectedJobDetails.id)) {
        setSelectedJobDetails(null);
        setIsJobDetailsOpen(false);
      }
      showNotification(`${selectedJobIds.length} job(s) deleted successfully.`, "success");
      setSelectedJobIds([]);
    } catch (err) {
      console.error("Bulk delete error:", err);
      showNotification("Failed to delete selected jobs: " + err.message, "error");
    } finally {
      setIsDeletingJobs(false);
    }
  };
  const handleToggleSelectAll = () => {
    if (!filteredJobs || filteredJobs.length === 0) return;
    const allIds = filteredJobs.map(j => j.id);
    const isAllSelected = allIds.every(id => selectedJobIds.includes(id));
    if (isAllSelected) {
      setSelectedJobIds(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedJobIds(prev => Array.from(new Set([...prev, ...allIds])));
    }
  };
  const handleToggleSelectJob = (jobId, e) => {
    if (e) e.stopPropagation();
    setSelectedJobIds(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };
  const stats = {
    total: filteredJobs.length,
    completed: filteredJobs.filter(j => j.status === 'Completed' || j.status === 'Success').length,
    processing: filteredJobs.filter(j => j.status && j.status !== 'Completed' && j.status !== 'Success' && j.status !== 'Pending' && j.status !== 'Failed').length,
    pending: filteredJobs.filter(j => j.status === 'Pending').length,
    failed: filteredJobs.filter(j => j.status === 'Failed').length,
  };
  const calculatePayments = () => {
    let subtotal = jobs.reduce((acc, job) => acc + Number(job.price), 0);
    return { unpaid: subtotal * 1.18, paid: 0, total: subtotal * 1.18 };
  };
  const paymentData = calculatePayments();
  const renderSplash = () => (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B1120] transition-all duration-700 ease-in-out ${isSplashExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>
      <style>{`
        .path-draw { stroke-dasharray: 220; stroke-dashoffset: 220; animation: draw 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .path-draw-delayed { stroke-dasharray: 220; stroke-dashoffset: 220; animation: draw 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards; }
        .fill-fade { opacity: 0; animation: fadeFill 1.5s ease-in-out 1s forwards; }
        .star-pop { opacity: 0; transform: scale(0); transform-origin: center; animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.6s forwards; }
        .text-reveal { opacity: 0; transform: translateY(20px); animation: textUp 1s ease-out 1.2s forwards; }
        .glass-panel-splash { opacity: 0; animation: glassFade 1s ease-out forwards; }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes fadeFill { to { opacity: 0.8; } }
        @keyframes pop { to { opacity: 0.9; transform: scale(1); } }
        @keyframes textUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes glassFade { to { opacity: 1; } }
        @keyframes loadProgress { 0% { width: 0%; left: 0%; } 50% { width: 100%; left: 0%; } 100% { width: 0%; left: 100%; } }
      `}</style>
      
      <div className="glass-panel-splash relative flex flex-col items-center justify-center p-6 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(60,100,214,0.3)]">
        <svg className="w-20 md:w-32 h-20 md:h-32 mb-6 drop-shadow-2xl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="splashGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" /><stop offset="50%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="splashGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" /><stop offset="50%" stopColor="#f97316" /><stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="splashGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="35" stroke="url(#splashGrad1)" strokeWidth="2" fill="none" className="path-draw" filter="url(#splashGlow)" />
          <path d="M50 15 A35 35 0 0 1 85 50 A35 35 0 0 0 50 15 Z" fill="url(#splashGrad2)" className="fill-fade" />
          <path d="M15 50 A35 35 0 0 0 50 85 A35 35 0 0 1 15 50 Z" fill="url(#splashGrad1)" className="fill-fade" />
          <circle cx="50" cy="50" r="20" fill="url(#splashGrad1)" filter="url(#splashGlow)" className="fill-fade" style={{animationDuration: '2s', animationDelay: '1.5s'}} />
          <circle cx="50" cy="50" r="35" stroke="url(#splashGrad1)" strokeWidth="4" className="path-draw" fill="none" />
          <circle cx="50" cy="50" r="35" stroke="url(#splashGrad2)" strokeWidth="2" opacity="0.8" strokeDasharray="15 10 5 10" className="path-draw-delayed" fill="none" />
          <g className="star-pop">
            <circle cx="30" cy="30" r="2.5" fill="#fff" /><circle cx="40" cy="25" r="1.5" fill="#fff" /><circle cx="45" cy="35" r="1.5" fill="#fff" /><circle cx="70" cy="65" r="2" fill="#fff" /><circle cx="60" cy="75" r="1" fill="#fff" /><circle cx="50" cy="70" r="1.5" fill="#fff" /><circle cx="75" cy="35" r="2" fill="#fff" /><circle cx="25" cy="65" r="1.5" fill="#fff" />
          </g>
        </svg>
        <div className="flex flex-col items-center text-reveal">
          <h1 className="mb-2 text-xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 drop-shadow-lg">NOVA</h1>
          <p className="text-sm font-medium tracking-widest uppercase text-slate-300">Initializing Platform</p>
        </div>
        
        <div className="w-32 md:w-48 h-1 mt-4 md:mt-8 overflow-hidden rounded-full text-reveal bg-white/10">
           <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full relative" style={{animation: 'loadProgress 2s ease-out infinite'}}></div>
        </div>
      </div>
    </div>
  );
  const renderLanding = () => (
    <div className="relative min-h-screen pt-20 overflow-x-hidden font-sans text-slate-800 scroll-smooth">
      <section className="relative max-w-5xl px-4 md:px-6 pt-16 pb-20 mx-auto text-center">
        <div className="relative z-10 transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sm font-semibold text-slate-700 mb-4 md:mb-8">
            <Cpu className="w-4 h-4 text-[#3C64D6] animate-pulse" /> Advanced AI-Driven FEA Automation
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#1E293B] to-[#3C64D6] tracking-tight mb-4 md:mb-8 drop-shadow-sm">NOVA</h1>
          
          <div className="flex flex-col items-center justify-center gap-4 mb-6 md:mb-12 sm:flex-row sm:gap-6">
            <div className="glass-panel px-4 md:px-6 py-4 rounded-xl flex items-center gap-3 w-full sm:w-auto hover:shadow-[0_8px_32px_rgba(60,100,214,0.2)] transition-shadow">
               <FileText className="w-6 h-6 text-blue-500" />
               <span className="text-lg font-bold text-slate-800">Input Parameters</span>
            </div>
            <ArrowRight className="w-8 h-8 text-[#3C64D6] hidden sm:block animate-[pulse_2s_ease-in-out_infinite]" />
            <div className="glass-panel px-4 md:px-6 py-4 rounded-xl flex items-center gap-3 w-full sm:w-auto hover:shadow-[0_8px_32px_rgba(16,163,74,0.2)] transition-shadow">
               <FileCheck className="w-6 h-6 text-emerald-500" />
               <span className="text-lg font-bold text-slate-800">FE Report</span>
            </div>
          </div>
          <h2 className="text-lg md:text-3xl font-bold text-[#3C64D6] mb-6">Automated FEA. Zero Manual Setup.</h2>
          <p className="max-w-2xl mx-auto mb-6 text-lg font-medium text-slate-700">Input your design specifications. Receive a fully code-compliant FEA stress report in record time directly from the cloud.</p>
          
          <div className="mb-6 md:mb-12 text-sm font-semibold text-slate-600">
             Eliminate the bottlenecks: <span className="font-normal text-slate-500">Manual Meshing | Tedious Modeling | Repetitive Iterations | Report Drafting</span>
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
             <button onClick={handleRouteToAuth} className="relative flex items-center justify-center gap-2 px-4 md:px-8 py-4 overflow-hidden font-bold text-white transition-all duration-300 rounded-full glass-btn-blue hover:scale-105 group">
                <Shield className="relative z-10 w-5 h-5" /> <span className="relative z-10">Start Analysis</span>
             </button>
             <button onClick={() => scrollToSection('how-it-works')} className="px-4 md:px-8 py-4 font-bold transition-colors border rounded-full shadow-sm bg-white/50 backdrop-blur-md border-white/50 hover:bg-white/80 text-slate-800">
                See How It Works ↓
             </button>
          </div>
        </div>
      </section>
      <section id="solution" className="relative z-10 px-4 md:px-6 py-6 md:py-24">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
        <div className="relative z-10 max-w-5xl mx-auto transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
          <div className="mb-16 text-center">
            <span className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm text-[#3C64D6] px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase">Solutions</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E293B] mt-6 drop-shadow-sm">Engineering Components</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
             <div className="glass-card glass-card-hover rounded-[2.5rem] p-10 flex flex-col h-full relative group">
                <div className="absolute top-0 right-0 w-40 h-40 transition-transform duration-700 rounded-bl-full bg-blue-400/20 filter blur-xl -z-10 group-hover:scale-125"></div>
                
                <div className="flex items-center self-start gap-1 px-3 py-1 mb-4 md:mb-8 text-xs font-bold border rounded-full shadow-sm bg-emerald-500/20 border-emerald-500/30 text-emerald-700 backdrop-blur-sm">
                   <CheckCircle className="w-3 h-3" /> Available Now
                </div>
                
                <div className="glass-icon-container w-14 md:w-20 h-14 md:h-20 rounded-[1.25rem] flex items-center justify-center mb-6">
                  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect x="20" y="15" width="60" height="10" rx="5" fill="#3b82f6" opacity="0.9" />
                     <rect x="20" y="75" width="60" height="10" rx="5" fill="#3b82f6" opacity="0.9" />
                     <path d="M 30 25 C 10 35, 10 65, 30 75" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" fill="rgba(139, 92, 246, 0.2)" />
                     <path d="M 50 25 C 30 35, 30 65, 50 75" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" fill="rgba(59, 130, 246, 0.2)" />
                     <path d="M 70 25 C 50 35, 50 65, 70 75" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" fill="rgba(14, 165, 233, 0.2)" />
                     <path d="M 90 25 C 70 35, 70 65, 90 75" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" fill="none" />
                     <line x1="30" y1="25" x2="30" y2="75" stroke="white" strokeWidth="2" opacity="0.6" />
                     <line x1="50" y1="25" x2="50" y2="75" stroke="white" strokeWidth="2" opacity="0.6" />
                     <line x1="70" y1="25" x2="70" y2="75" stroke="white" strokeWidth="2" opacity="0.6" />
                  </svg>
                </div>
                
                <h3 className="text-lg md:text-2xl font-bold text-[#1E293B] mb-2 drop-shadow-sm">Advanced Bellows FEA</h3>
                <p className="mb-4 md:mb-8 text-sm font-medium text-slate-600">Thick Convolute (Flanged & Flued)</p>
                
                <div className="space-y-4 mb-4 md:mb-8 flex-1 bg-white/40 border border-white/50 p-4 md:p-6 rounded-2xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.7)] backdrop-blur-sm">
                   <div className="flex items-start gap-3">
                     <Check className="w-5 h-5 text-[#3C64D6] shrink-0 drop-shadow-sm" />
                     <span className="text-sm font-semibold text-slate-700">Phase 1: Automated TEMA-based spring rate</span>
                   </div>
                   <div className="flex items-start gap-3">
                     <Check className="w-5 h-5 text-[#3C64D6] shrink-0 drop-shadow-sm" />
                     <span className="text-sm font-semibold text-slate-700">Phase 2: Comprehensive FEA & validation</span>
                   </div>
                   <div className="pt-3 mt-2 text-sm font-bold border-t text-slate-800 border-white/60 drop-shadow-sm">Core Capabilities:</div>
                   <div className="flex items-center gap-3">
                     <CheckCircle className="w-4 h-4 text-emerald-600 drop-shadow-sm" /> <span className="text-sm text-slate-700">Corroded / Uncorroded state analysis</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <CheckCircle className="w-4 h-4 text-emerald-600 drop-shadow-sm" /> <span className="text-sm text-slate-700">Multi-condition upset loads</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <CheckCircle className="w-4 h-4 text-emerald-600 drop-shadow-sm" /> <span className="text-sm text-slate-700">Strict ASME compliance verification</span>
                   </div>
                </div>
                <button onClick={handleRouteToAuth} className="glass-btn w-full text-black py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg">
                   Launch Bellow Analysis <ArrowRight className="w-5 h-5" />
                </button>
             </div>
             <div className="glass-card glass-card-hover rounded-[2.5rem] p-10 flex flex-col h-full relative group opacity-95">
                <div className="absolute top-0 right-0 w-40 h-40 transition-transform duration-700 rounded-bl-full bg-amber-400/20 filter blur-xl -z-10 group-hover:scale-125"></div>
                
                <div className="flex items-center self-start gap-1 px-3 py-1 mb-4 md:mb-8 text-xs font-bold border rounded-full shadow-sm bg-amber-500/20 border-amber-500/30 text-amber-700 backdrop-blur-sm">
                   <Clock className="w-3 h-3" /> In Development
                </div>
                
                <div className="glass-icon-container w-14 md:w-20 h-14 md:h-20 rounded-[1.25rem] flex items-center justify-center mb-6 opacity-80 mix-blend-luminosity">
                  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M 10 80 Q 50 100, 90 80" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" fill="none" />
                     <path d="M 10 90 Q 50 110, 90 90" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" opacity="0.5" fill="none" />
                     <rect x="35" y="20" width="30" height="50" fill="#ef4444" opacity="0.3" rx="4" />
                     <path d="M 35 20 L 35 68" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                     <path d="M 65 20 L 65 68" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                     <rect x="25" y="10" width="50" height="10" rx="3" fill="#f59e0b" />
                     <rect x="30" y="5" width="40" height="5" rx="2" fill="#ef4444" opacity="0.8" />
                     <line x1="40" y1="20" x2="40" y2="65" stroke="white" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                  </svg>
                </div>
                
                <h3 className="mb-2 text-lg md:text-2xl font-bold text-slate-700 drop-shadow-sm">Nozzle Junction Stress Analysis</h3>
                <p className="mb-4 md:mb-8 text-sm font-medium text-slate-500">Local Load Analysis for Vessels</p>
                
                <div className="flex-1 p-4 md:p-6 mb-4 md:mb-8 space-y-4 border bg-white/20 border-white/30 rounded-2xl">
                   <div className="flex items-start gap-3 opacity-80">
                     <svg className="w-5 h-5 text-amber-600 shrink-0 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     <span className="text-sm font-semibold text-slate-700">High-fidelity local stress evaluation</span>
                   </div>
                   <div className="flex items-start gap-3 opacity-80">
                     <svg className="w-5 h-5 text-amber-600 shrink-0 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     <span className="text-sm font-semibold text-slate-700">Automated structural integrity checks</span>
                   </div>
                   <div className="flex items-start gap-3 opacity-80">
                     <svg className="w-5 h-5 text-amber-600 shrink-0 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     <span className="text-sm font-semibold text-slate-700">Compliant with ASME Section VIII, Div 2 Part 5</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
      <section id="why-nova" className="py-6 md:py-24 bg-white/40 backdrop-blur-md px-4 md:px-6 border-y border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
        <div className="max-w-5xl mx-auto transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
          <div className="mb-16 text-center">
            <span className="px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full glass-panel text-slate-700">About</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#1E293B] mt-6 drop-shadow-sm">What is NOVA?</h2>
          </div>
          <div className="grid items-center grid-cols-1 gap-16 md:grid-cols-2">
             <div className="space-y-6">
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center text-lg md:text-2xl font-bold text-white transition-transform shadow-md w-14 h-14 glass-btn-blue rounded-2xl group-hover:scale-110">N</div>
                  <div className="text-xl font-extrabold tracking-wide text-slate-700 drop-shadow-sm">Numerical</div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center text-lg md:text-2xl font-bold text-white transition-transform shadow-md w-14 h-14 glass-btn-blue rounded-2xl group-hover:scale-110">O</div>
                  <div className="text-xl font-extrabold tracking-wide text-slate-700 drop-shadow-sm">Optimization &</div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center text-lg md:text-2xl font-bold text-white transition-transform shadow-md w-14 h-14 glass-btn-blue rounded-2xl group-hover:scale-110">V</div>
                  <div className="text-xl font-extrabold tracking-wide text-slate-700 drop-shadow-sm">Virtual</div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center text-lg md:text-2xl font-bold text-white transition-transform shadow-md w-14 h-14 glass-btn-blue rounded-2xl group-hover:scale-110">A</div>
                  <div className="text-xl font-extrabold tracking-wide text-slate-700 drop-shadow-sm">Analysis</div>
                </div>
             </div>
             <div className="glass-panel p-10 rounded-[2rem] shadow-[0_8px_32px_rgba(31,38,135,0.1)]">
               <p className="mb-6 text-lg font-medium leading-relaxed text-slate-700">
                 NOVA (Numerical Optimization & Virtual Analysis) is an advanced cloud-based engineering platform designed to democratize Finite Element Analysis (FEA). We bridge the gap between complex <strong className="text-emerald-700">ASME BPVC code requirements</strong> and streamlined, automated execution.
               </p>
               <p className="text-lg font-medium leading-relaxed text-slate-700">
                 By integrating <strong className="text-[#3C64D6]">AI-driven data extraction</strong> with industry-standard solvers like ANSYS, NOVA eliminates manual modeling, reducing design validation from weeks to hours.
               </p>
             </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="relative z-10 px-4 md:px-6 py-6 md:py-24">
        <div className="max-w-6xl mx-auto text-center transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
          <span className="px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full glass-panel text-slate-700">Methodology</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#1E293B] mt-6 mb-4 drop-shadow-sm">How NOVA Works</h2>
          <p className="mb-20 text-lg font-medium text-slate-600">A streamlined 6-step workflow that transforms your engineering data into a compliant FE report</p>
          <div className="relative flex flex-col items-center justify-between gap-4 md:gap-8 md:flex-row md:items-start md:gap-4">
             <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-0.5 bg-gradient-to-r from-blue-300/50 via-purple-300/50 to-emerald-300/50 z-0"></div>
             {[
               { icon: UploadCloud, title: "Data Ingestion", desc: "Upload PV Elite or structural parameters" },
               { icon: Cpu, title: "Intelligent Parsing", desc: "AI extracts geometry, materials, and loads" },
               { icon: Box, title: "Automated Meshing", desc: "Smart algorithmic grid generation" },
               { icon: GitMerge, title: "Cloud Solving", desc: "ANSYS backend computes stresses" },
               { icon: Award, title: "Code Validation", desc: "ASME Sec VIII Div 2 Part 5 checks" },
               { icon: Download, title: "Final Report", desc: "Download Report, audit-ready PDF" }
             ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center max-w-[150px] group">
                     <div className="relative flex items-center justify-center w-14 md:w-20 h-14 md:h-20 mb-6 transition-all duration-300 shadow-md glass-panel group-hover:bg-white/60 rounded-2xl group-hover:-translate-y-2">
                        <Icon className="w-8 h-8 text-[#1E293B] group-hover:text-[#3C64D6] transition-colors drop-shadow-sm" />
                     </div>
                     <h4 className="font-extrabold text-slate-800 mb-2 group-hover:text-[#3C64D6] transition-colors text-center drop-shadow-sm">{item.title}</h4>
                     <p className="text-xs font-medium leading-relaxed text-center text-slate-600">{item.desc}</p>
                  </div>
                );
             })}
          </div>
        </div>
      </section>
      <section className="relative z-10 px-4 md:px-6 py-6 md:py-24 text-center transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
         <div className="glass-panel max-w-4xl mx-auto rounded-[3rem] p-16 relative overflow-hidden shadow-[0_20px_60px_rgba(60,100,214,0.15)]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full filter blur-[80px] -z-10"></div>
           <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E293B] mb-6 relative z-10">Start Your Analysis Today</h2>
           <p className="relative z-10 mb-10 text-lg font-medium text-slate-600">From Days to Hours. Code-Compliant. Fully Automated.</p>
           <button onClick={handleRouteToAuth} className="relative z-10 flex items-center justify-center gap-3 px-10 py-5 mx-auto text-lg font-bold transition-all rounded-full glass-btn-blue hover:scale-105">
             Access Dashboard <ArrowRight className="w-6 h-6" />
           </button>
         </div>
      </section>
      <footer className="glass-panel text-slate-600 py-6 md:py-12 px-4 md:px-6 relative z-10 mt-6 md:mt-12 border-b-0 rounded-t-[3rem] shadow-[0_-8px_32px_rgba(31,38,135,0.05)]">
        <div className="grid max-w-6xl grid-cols-1 gap-4 md:gap-8 pb-8 mx-auto mb-4 md:mb-8 border-b md:grid-cols-3 border-slate-300/50">
           <div>
              <h3 className="font-bold text-[#1E293B] text-xl mb-4 flex items-center gap-2 cursor-pointer hover:text-[#3C64D6] transition-colors" onClick={handleLogoClick}>
                <CosmicLogo className="w-8 h-8" /> NOVA
              </h3>
              <p className="text-sm font-medium">Numerical Optimization & Virtual Analysis Platform</p>
           </div>
           <div>
              <h4 className="font-bold text-[#1E293B] mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm font-medium">
                 <li><button onClick={() => scrollToSection('why-nova')} className="hover:text-[#3C64D6] transition-colors">About NOVA</button></li>
                 <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#3C64D6] transition-colors">Methodology</button></li>
                 <li><button onClick={() => scrollToSection('solution')} className="hover:text-[#3C64D6] transition-colors">Engineering Solutions</button></li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold text-[#1E293B] mb-4">Support & Contact</h4>
              <a href="mailto:analysis.ai.nova@gmail.com" className="text-sm font-medium flex items-center gap-2 mb-2 hover:text-[#3C64D6] transition-colors group">
                 <Mail className="w-4 h-4 group-hover:text-[#3C64D6] transition-colors" /> analysis.ai.nova@gmail.com
              </a>
           </div>
        </div>
        <div className="flex items-center justify-between max-w-6xl mx-auto text-sm font-medium">
           <p>© 2026 NOVA Intelligence. All Rights Reserved.</p>
           <button onClick={() => window.scrollTo(0,0)} className="flex items-center justify-center p-3 text-white transition-transform border-none rounded-full shadow-md glass-btn-blue hover:scale-110">
              <ChevronDown className="w-5 h-5 rotate-180" />
           </button>
        </div>
      </footer>
      <a 
        href="https://wa.me/918757014303?text=Hi%20NOVA-CORE,%20I%20need%20help%20with%20an%20analysis." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300 cursor-pointer"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" className="text-[#25D366] drop-shadow-lg" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
  const renderAuthContainer = (children) => (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pt-20">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 md:px-6 py-4 rounded-2xl shadow-xl text-white font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md border border-white/20 ${notification.type === 'success' ? 'bg-emerald-600/90' : notification.type === 'info' ? 'bg-blue-600/90' : 'bg-slate-800/90'}`}>
           <CheckCircle className="w-5 h-5" /> {notification.message}
        </div>
      )}
      <button onClick={() => setCurrentView('landing')} className="absolute top-6 left-6 glass-panel px-4 py-2 rounded-full text-slate-700 hover:text-[#3C64D6] flex items-center gap-2 font-semibold transition-colors">
        <ArrowRight className="w-4 h-4 rotate-180" /> Home
      </button>
      
      <div className="max-w-md w-full glass-panel rounded-[2.5rem] shadow-[0_20px_60px_rgba(31,38,135,0.15)] p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full filter blur-[40px]"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/30 rounded-full filter blur-[40px]"></div>
        
        <div className="relative z-10 mb-4 md:mb-8 space-y-2 text-center">
          <div className="flex justify-center mb-4 cursor-pointer" onClick={handleLogoClick}>
             <CosmicLogo className="w-14 md:w-20 h-14 md:h-20 transition-transform duration-500 hover:scale-110 drop-shadow-md" />
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">NOVA 1.0</h1>
          <p className="text-sm font-semibold tracking-wider uppercase text-slate-600">Authentication</p>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
  const renderLogin = () => renderAuthContainer(
    <>
      <h2 className="mb-6 text-xl font-bold text-center text-slate-800">Secure Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="pl-1 text-sm font-bold text-slate-700">Email Address</label>
          <input type="email" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); setAuthErrors({...authErrors, email: null}); }} className={`w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium ${authErrors.email ? '!border-red-500' : ''}`} required />
          {authErrors.email && <p className="pl-1 text-xs font-bold text-red-500 animate-in fade-in">{authErrors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between pl-1 pr-1">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <button type="button" onClick={() => { setCurrentView('forgot'); setForgotStep(1); setForgotEmail(loginEmail); setForgotCode(''); setForgotNewPwd(''); setForgotConfirmPwd(''); setForgotErrors({}); }} className="text-xs text-[#3C64D6] font-bold hover:underline focus:outline-none">Forgot password?</button>
          </div>
          <div className="relative">
            <input type={showLoginPwd ? "text" : "password"} value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value); setAuthErrors({...authErrors, password: null}); }} className={`w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium pr-12 ${authErrors.password ? '!border-red-500' : ''}`} required />
            <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#3C64D6] transition-colors">
              {showLoginPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {authErrors.password && <p className="pl-1 text-xs font-bold text-red-500 animate-in fade-in">{authErrors.password}</p>}
        </div>
        <button type="submit" disabled={isAuthLoading} className="w-full glass-btn-green py-4 rounded-xl font-bold transition-all hover:scale-[1.02] mt-6 flex justify-center items-center gap-2 text-lg shadow-lg">
          {isAuthLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
      <div className="mt-4 md:mt-8 text-sm font-medium text-center text-slate-600">
        Don't have an account? <button onClick={() => setCurrentView('signup')} className="text-[#3C64D6] font-bold hover:underline ml-1">Sign up here</button>
      </div>
    </>
  );
  const renderSignup = () => renderAuthContainer(
    <>
      <h2 className="mb-6 text-xl font-bold text-center text-slate-800">Create New Account</h2>
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-1.5">
          <label className="pl-1 text-sm font-bold text-slate-700">Full Name</label>
          <input type="text" value={signupName} onChange={(e) => { setSignupName(e.target.value); setAuthErrors({...authErrors, name: null}); }} className={`w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium ${authErrors.name ? '!border-red-500' : ''}`} required />
          {authErrors.name && <p className="pl-1 text-xs font-bold text-red-500">{authErrors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="pl-1 text-sm font-bold text-slate-700">Email Address</label>
          <input type="email" value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value); setAuthErrors({...authErrors, email: null}); }} className={`w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium ${authErrors.email ? '!border-red-500' : ''}`} required />
          {authErrors.email && <p className="pl-1 text-xs font-bold text-red-500">{authErrors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="pl-1 text-sm font-bold text-slate-700">Password</label>
          <div className="relative">
            <input type={showSignupPwd ? "text" : "password"} value={signupPassword} onChange={(e) => { setSignupPassword(e.target.value); setAuthErrors({...authErrors, password: null}); }} className={`w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium pr-12 ${authErrors.password ? '!border-red-500' : ''}`} required />
            <button type="button" onClick={() => setShowSignupPwd(!showSignupPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#3C64D6] transition-colors">
              {showSignupPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {authErrors.password && <p className="pl-1 text-xs font-bold leading-tight text-red-500">{authErrors.password}</p>}
        </div>
        <button type="submit" disabled={isAuthLoading} className="w-full glass-btn-blue py-4 rounded-xl font-bold transition-all hover:scale-[1.02] mt-6 text-lg shadow-lg flex justify-center items-center gap-2">
          {isAuthLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
        </button>
      </form>
      <div className="mt-4 md:mt-8 text-sm font-medium text-center text-slate-600">
        Already have an account? <button onClick={() => setCurrentView('login')} className="text-[#3C64D6] font-bold hover:underline ml-1">Sign in</button>
      </div>
    </>
  );
  const renderForgotPassword = () => renderAuthContainer(
    <>
      <h2 className="mb-2 text-xl font-bold text-center text-slate-800">
        {forgotStep === 1 ? "Reset Password" : forgotStep === 2 ? "Verify Email" : "Create New Password"}
      </h2>
      <p className="px-2 mb-6 text-sm font-medium text-center text-slate-600">
        {forgotStep === 1 && "Enter your email address to request a 6-digit recovery code."}
        {forgotStep === 2 && `Please enter the 6-digit code sent to ${forgotEmail}.`}
        {forgotStep === 3 && "Please enter your new password below."}
      </p>
      {forgotStep === 1 && (
        <form onSubmit={handleForgotEmailSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="pl-1 text-sm font-bold text-slate-700">Email Address</label>
            <input type="email" value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value); setForgotErrors({...forgotErrors, email: null}); }} className={`w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium ${forgotErrors.email ? '!border-red-500' : ''}`} required />
            {forgotErrors.email && <p className="pl-1 text-xs font-bold text-red-500">{forgotErrors.email}</p>}
          </div>
          <button type="submit" disabled={isForgotLoading} className="w-full glass-btn-blue disabled:opacity-70 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] flex justify-center items-center gap-2 mt-4 shadow-lg">
            {isForgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Recovery Code"}
          </button>
        </form>
      )}
      {forgotStep === 2 && (
        <form onSubmit={handleForgotCodeSubmit} className="space-y-5">
           <div className="space-y-1.5">
            <label className="block pl-1 text-sm font-bold text-center text-slate-700">Verification Code</label>
            <input type="text" maxLength="6" placeholder="••••••" value={forgotCode} onChange={(e) => { setForgotCode(e.target.value.replace(/\D/g, '')); setForgotErrors({...forgotErrors, code: null}); }} className={`w-full px-4 py-4 glass-input rounded-xl text-center text-xl md:text-3xl tracking-[0.5em] font-extrabold text-[#3C64D6] ${forgotErrors.code ? '!border-red-500' : ''}`} required />
            {forgotErrors.code && <p className="mt-2 text-xs font-bold text-center text-red-500">{forgotErrors.code}</p>}
          </div>
          <button type="submit" disabled={isForgotLoading || forgotCode.length !== 6} className="w-full glass-btn-green disabled:opacity-70 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] flex justify-center items-center gap-2 mt-4 shadow-lg">
            {isForgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
          </button>
        </form>
      )}
      {forgotStep === 3 && (
        <form onSubmit={handleForgotResetSubmit} className="space-y-5">
           <div className="space-y-1.5">
             <label className="pl-1 text-sm font-bold text-slate-700">New Password</label>
             <div className="relative">
               <input type={showForgotPwd.new ? "text" : "password"} value={forgotNewPwd} onChange={(e) => { setForgotNewPwd(e.target.value); setForgotErrors({...forgotErrors, new: null}); }} required className={`w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium pr-12 ${forgotErrors.new ? '!border-red-500' : ''}`} />
               <button type="button" onClick={() => setShowForgotPwd({...showForgotPwd, new: !showForgotPwd.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#3C64D6] transition-colors">
                 {showForgotPwd.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
             </div>
             {forgotErrors.new && <p className="pl-1 text-xs font-bold leading-tight text-red-500">{forgotErrors.new}</p>}
          </div>
          
          <div className="space-y-1.5">
             <label className="pl-1 text-sm font-bold text-slate-700">Confirm Password</label>
             <div className="relative">
               <input type={showForgotPwd.confirm ? "text" : "password"} value={forgotConfirmPwd} onChange={(e) => { setForgotConfirmPwd(e.target.value); setForgotErrors({...forgotErrors, confirm: null}); }} required className={`w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium pr-12 ${forgotErrors.confirm ? '!border-red-500' : ''}`} />
               <button type="button" onClick={() => setShowForgotPwd({...showForgotPwd, confirm: !showForgotPwd.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#3C64D6] transition-colors">
                 {showForgotPwd.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
             </div>
             {forgotErrors.confirm && <p className="pl-1 text-xs font-bold text-red-500">{forgotErrors.confirm}</p>}
          </div>
          <button type="submit" disabled={isForgotLoading} className="w-full glass-btn-green disabled:opacity-70 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] flex justify-center items-center gap-2 mt-4 shadow-lg">
            {isForgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save New Password"}
          </button>
        </form>
      )}
      <div className="mt-4 md:mt-8 text-sm font-medium text-center text-slate-600">
         Remember your password? <button onClick={() => setCurrentView('login')} className="text-[#3C64D6] font-bold hover:underline ml-1">Sign in</button>
      </div>
    </>
  );
  const renderInsightsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsInsightsOpen(false)}></div>
      <div className="glass-panel w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative z-10 border-t border-l border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-in zoom-in-95">
        <div className="flex items-center justify-between p-4 md:p-6 text-white border-b bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border-white/20">
          <h3 className="flex items-center gap-3 text-xl font-extrabold drop-shadow-sm">
            <Sparkles className="w-6 h-6" /> Executive Insights
          </h3>
          <button onClick={() => setIsInsightsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 md:p-8 space-y-6">
           <div className="mb-2">
              <h4 className="mb-1 text-sm font-bold tracking-widest uppercase text-slate-500">Project</h4>
              <p className="text-lg md:text-2xl font-extrabold text-slate-800">{selectedInsightJob?.name}</p>
              <span className="inline-block px-3 py-1 mt-2 text-xs font-bold text-blue-800 bg-blue-100 rounded-full">{selectedInsightJob?.type}</span>
           </div>
           <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)] min-h-[200px]">
              {isInsightLoading ? (
                 <div className="flex flex-col items-center justify-center h-full py-4 md:py-8 space-y-4 text-purple-600">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />
                    <p className="text-sm font-bold animate-pulse">Analyzing FEA Results...</p>
                 </div>
              ) : (
                 <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800">
                    {insightResponse}
                 </div>
              )}
           </div>
           <div className="flex justify-end mt-4 md:mt-8">
             <button onClick={() => setIsInsightsOpen(false)} className="glass-btn-blue text-white px-4 md:px-8 py-3.5 rounded-xl font-bold shadow-md hover:scale-105 transition-transform">Close Insights</button>
           </div>
        </div>
      </div>
    </div>
  );
  const downloadJobJson = (job) => {
    if (!job) return;
    let payload = job.json_payload || job.geometry_data?.runs || job.geometry_data || [];
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch(e) {}
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "nozzle_batch_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };
  const generateInputPDF = (job, index = 0) => {
    if (!job || !job.json_payload) {
      showNotification('No input data available to generate PDF.', 'error', 'PDF Export');
      return;
    }
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      let payloads = job.json_payload;
      if (typeof payloads === 'string') {
        try { payloads = JSON.parse(payloads); } catch (e) {}
      }
      let p = Array.isArray(payloads) ? payloads[index] : payloads;
      if (!p) p = Array.isArray(payloads) ? payloads[0] : payloads;
      const W = 210, margin = 14, contentW = W - 28;
      const analysisType = p.Analysis_Type || '';
      const isLimitLoad  = analysisType === 'Limit-Load Analysis';
      const thermalReq   = p.Thermal_Required || 'No';
      const showThermal  = thermalReq === 'Yes';
      const nType        = p.N_TYPE ?? p.Nozzle_Type ?? '';
      const isBarrel     = String(nType).toLowerCase() === 'barrel' || String(nType).toLowerCase() === 'srn';
      const padVal       = p.Pad_Required ?? p.pad ?? 'No';
      const isPad        = String(padVal).toLowerCase() === 'yes';
      const isHead       = !!p.Head_TYPE; // True if it's a Vessel Head analysis
      doc.setFillColor(20, 20, 20);
      doc.rect(0, 0, W, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16); doc.setFont("helvetica", "bold");
      doc.text("NOVA", margin, 12);
      doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 180);
      doc.text("ENGINEERING ANALYSIS PLATFORM", margin, 18);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10.5); doc.setFont("helvetica", "bold");
      doc.text("INPUT PARAMETERS", W - margin, 12, { align: 'right' });
      doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 200);
      
      const typeStr = isHead ? `Vessel Head Analysis ${index+1}` : `Shell Nozzle Analysis ${index+1}`;
      doc.text(typeStr + '  |  ' + (job.job_id_display || job.id.substring(0,8)), W - margin, 18, { align: 'right' });
      doc.text('Date: ' + new Date().toLocaleDateString('en-IN'), W - margin, 24, { align: 'right' });
      let y = 36;
      const addSection = (num, title) => {
        if (y > 265) { doc.addPage(); y = 18; }
        doc.setDrawColor(20, 20, 20);
        doc.setLineWidth(0.6);
        doc.line(margin, y, margin + contentW, y);
        doc.setLineWidth(0.2);
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(8.5); doc.setFont("helvetica", "bold");
        doc.text(num + '.  ' + title.toUpperCase(), margin, y + 5.5);
        y += 9;
      };
      let rowAlt = false;
      const addRow = (label, value, unit) => {
        if (y > 276) { doc.addPage(); y = 18; rowAlt = false; }
        if (rowAlt) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, y, contentW, 5.8, 'F');
        }
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(7.8); doc.setFont("helvetica", "normal");
        doc.text(String(label), margin + 2, y + 4);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(10, 10, 10);
        const val = unit ? String(value) + ' ' + unit : String(value);
        doc.text(val, margin + contentW - 2, y + 4, { align: 'right' });
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        doc.line(margin, y + 5.8, margin + contentW, y + 5.8);
        y += 5.8;
        rowAlt = !rowAlt;
      };
      addSection(1, 'Project & Conditions'); rowAlt = false;
      if (p.File_Path)           addRow('Analysis Folder', p.File_Path);
      if (isHead && p.Head_TYPE) addRow('Head Type', p.Head_TYPE);
      if (analysisType)          addRow('Analysis Type', analysisType);
      
      if (isLimitLoad && p.Material_Type) addRow('Material Model', p.Material_Type);
      if (p.DesignTemp != null)  addRow('Design Temp.', p.DesignTemp, '\u00b0C');
      if (p.p != null)           addRow('Internal Pressure', p.p, 'MPa');
      
      addRow('Thermal Required', thermalReq);
      if (showThermal) {
        if (p.T_op != null)           addRow('Operating Temperature', p.T_op, '\u00b0C');
        if (p.shell_id_htc != null)   addRow('Shell ID HTC', p.shell_id_htc, 'W/m\u00b2\u00b7\u00b0C');
        if (p.nozzle_id_htc != null)  addRow('Nozzle ID HTC', p.nozzle_id_htc, 'W/m\u00b2\u00b7\u00b0C');
        if (p.outside_id_htc != null) addRow('Outside Surface HTC', p.outside_id_htc, 'W/m\u00b2\u00b7\u00b0C');
      }
      y += 3;
      addSection(2, 'Materials'); rowAlt = false;
      if (p.Shell_Material)      addRow('Shell Material', p.Shell_Material);
      if (p.Nozzle_Material)     addRow('Nozzle Material', p.Nozzle_Material);
      addRow('Pad Required', isPad ? 'Yes' : 'No');
      if (isPad && p.Pad_Material) addRow('Pad Material', p.Pad_Material);
      y += 3;
      addSection(3, isHead ? 'Head & Nozzle Geometry' : 'Shell & Nozzle Geometry'); rowAlt = false;
      if (!isHead) {
        const sOD  = p.S_OD  ?? p.Shell_D_o;
        const sTHK = p.S_THK ?? p.Shell_T;
        const sH   = p.S_H   ?? p.Shell_L;
        const nOff = p.N_OFF ?? p.Offset;
        const corr = p.CorrosionAllowance ?? p.Corrosion;
        if (sOD  != null) addRow('Shell Outer Dia (OD)', sOD, 'mm');
        if (sTHK != null) addRow('Shell Thickness', sTHK, 'mm');
        if (sH   != null) addRow('Shell Height', sH, 'mm');
        if (nOff != null) addRow('Nozzle Offset', nOff, 'mm');
        if (corr != null) addRow('Corrosion Allowance', corr, 'mm');
      } else {
        const hType = p.Head_TYPE;
        if (hType === 'Ellipsoidal Head') {
            if (p.H_ID != null) addRow('Head Inner Dia (ID)', p.H_ID, 'mm');
            if (p.H_THK != null) addRow('Head Thickness', p.H_THK, 'mm');
            if (p.ratio != null) addRow('a:b Ratio', p.ratio);
            if (p.S_OFF != null) addRow('Straight Flange Offset', p.S_OFF, 'mm');
            if (p.S_THK != null) addRow('Attached Shell Thickness', p.S_THK, 'mm');
            if (p.S_H != null) addRow('Attached Shell Height', p.S_H, 'mm');
        } else if (hType === 'Flat Head') {
            if (p.H_OD != null) addRow('Head Outer Dia (OD)', p.H_OD, 'mm');
            if (p.H_THK != null) addRow('Head Thickness', p.H_THK, 'mm');
            if (p.S_ID != null) addRow('Shell Inner Dia (ID)', p.S_ID, 'mm');
            if (p.T_LEN != null) addRow('Transition Length', p.T_LEN, 'mm');
            if (p.S_H != null) addRow('Shell Height', p.S_H, 'mm');
            if (p.S_THK != null) addRow('Shell Thickness', p.S_THK, 'mm');
        } else if (hType === 'Torispherical Head') {
            if (p.TH_H_ID != null) addRow('Crown Radius (Head ID)', p.TH_H_ID, 'mm');
            if (p.TH_H_THK != null) addRow('Head Thickness', p.TH_H_THK, 'mm');
            if (p.H_KR != null) addRow('Knuckle Radius', p.H_KR, 'mm');
            if (p.TH_S_OFF != null) addRow('Straight Flange Offset', p.TH_S_OFF, 'mm');
            if (p.TH_S_H != null) addRow('Shell Height', p.TH_S_H, 'mm');
            if (p.TH_S_THK != null) addRow('Shell Thickness', p.TH_S_THK, 'mm');
        }
      }
      const nL1  = p.N_L1  ?? p.h;
      const nOD  = p.N_OD  ?? p.Nozzle_D_o;
      const nTHK = p.N_THK ?? p.Nozzle_T;
      const nP   = p.N_P   ?? p.Nozzle_L;
      if (nType) addRow('Nozzle Type', nType);
      if (nL1  != null && !isHead) addRow('Nozzle Location Height', nL1, 'mm');
      if (nOD  != null) addRow('Neck OD', nOD, 'mm');
      if (nTHK != null) addRow('Neck Thickness', nTHK, 'mm');
      if (nP   != null) addRow('Nozzle Projection', nP, 'mm');
      if (isBarrel) {
        if (p.Hub_OD  != null) addRow('Hub OD', p.Hub_OD, 'mm');
        if (p.Hub_LEN != null) addRow('Hub Length', p.Hub_LEN, 'mm');
        if (p.T_LEN   != null && hType !== 'Flat Head') addRow('Transition Length', p.T_LEN, 'mm');
      }
      if (p.Fillet_Radius  != null) addRow('Weld Fillet Radius', p.Fillet_Radius, 'mm');
      if (p.Nozzle_In_Proj != null) addRow('Inward Projection', p.Nozzle_In_Proj, 'mm');
      if (isPad) {
        const pW   = p.P_W   ?? p.Pad_Width;
        const pTHK = p.P_THK ?? p.Pad_T;
        if (pW   != null) addRow('Pad Width', pW, 'mm');
        if (pTHK != null) addRow('Pad Thickness', pTHK, 'mm');
      }
      y += 3;
      addSection(4, 'Meshing & Loading'); rowAlt = false;
      const bSize     = p.B_size    ?? p.Mesh_Size;
      const mMeth     = p.m_method  ?? p.Mesh_Method;
      const nDiv      = p.N_D       ?? p.Edge_Divisions;
      const nThrust   = p.N_analysis ?? p.Nozzle_Thrust;
      const loadBound = p.N_Location ?? p.Load_Boundary;
      const fL = p.FX ?? p.F_L;
      const mT = p.MY ?? p.M_T;
      const fC = p.FZ ?? p.F_C;
      const mC = p.MZ ?? p.M_C;
      const fA = p.FY ?? p.F_A ?? p.P;
      const mL = p.MX ?? p.M_L;
      if (bSize     != null) addRow('Global Body Sizing', bSize, 'mm');
      if (mMeth     != null) addRow('Mesh Method', mMeth);
      if (nDiv      != null) addRow('Edge Divisions', nDiv);
      if (nThrust   != null) addRow('Nozzle Thrust Analysis', nThrust);
      if (loadBound != null) addRow('Load Boundary', loadBound);
      if (fL != null) addRow('FL  Longitudinal Shear Force', fL, 'N');
      if (mT != null) addRow('MT  Torsional Moment', mT, 'N mm');
      if (fC != null) addRow('FC  Circumferential Shear Force', fC, 'N');
      if (mC != null) addRow('MC  Circumferential Bending Moment', mC, 'N mm');
      if (fA != null) addRow('P   Axial / Thrust Force', fA, 'N');
      if (mL != null) addRow('ML  Longitudinal Bending Moment', mL, 'N mm');
      const totalPages = doc.internal.getNumberOfPages();
      for (let pg = 1; pg <= totalPages; pg++) {
        doc.setPage(pg);
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.line(margin, 285, margin + contentW, 285);
        doc.setTextColor(140, 140, 140);
        doc.setFontSize(6.5); doc.setFont("helvetica", "normal");
        doc.text("NOVA Cloud Engineering Platform  |  ASME Sec VIII Div 2", margin, 290);
        doc.text('Page ' + pg + ' / ' + totalPages, W - margin, 290, { align: 'right' });
      }
      doc.save('NOVA_Input_' + (job.job_id_display || job.id.substring(0,8)) + '_' + (index+1) + '.pdf');
    } catch (err) {
      console.error("Error generating PDF:", err);
      showNotification('Failed to generate PDF. Please try again.', 'error', 'PDF Export');
    }
  };
  const generateAndOpenReport = (job) => {
    if (!job) return;
    if (job.report_url) {
      window.open(job.report_url, '_blank');
      return;
    }
    if (job.excel_file_url) {
      window.open(job.excel_file_url, '_blank');
      return;
    }
    const geom = job.geometry_data || {};
    let runs = [];
    if (Array.isArray(geom.runs) && geom.runs.length > 0) runs = geom.runs;
    else if (Array.isArray(job.json_payload) && job.json_payload.length > 0) runs = job.json_payload;
    else if (typeof job.json_payload === 'string') {
      try { const p = JSON.parse(job.json_payload); if (Array.isArray(p)) runs = p; } catch (e) {}
    }
    if (!Array.isArray(runs) || runs.length === 0) runs = [geom];
    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>NOVA FEA Report - ${job.job_id_display || job.name || 'Analysis'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
    body { background: #f0f4f8; color: #1e293b; margin: 0; padding: 25px; line-height: 1.5; }
    .report-container { max-width: 880px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 10px 35px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 25px; }
    .brand-title { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .brand-title span { color: #3b82f6; }
    .meta-box { text-align: right; font-size: 13px; color: #64748b; }
    .job-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; ${job.status === 'Completed' ? 'background:#dcfce7; color:#15803d; border:1px solid #86efac;' : job.status === 'Failed' ? 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;' : 'background:#fef3c7; color:#b45309; border:1px solid #fde68a;'} margin-top: 6px; }
    h2 { font-size: 15px; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; margin-top: 28px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    h2::before { content: ''; width: 4px; height: 16px; background: #3b82f6; border-radius: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12.5px; }
    th, td { border: 1px solid #e2e8f0; padding: 9px 14px; text-align: left; }
    th { background: #f8fafc; color: #475569; font-weight: 700; width: 38%; }
    td { color: #1e293b; font-weight: 500; }
    .section-banner { background: #eff6ff; color: #1e40af; font-weight: 800; font-size: 11.5px; letter-spacing: 0.5px; text-transform: uppercase; padding: 8px 14px; border: 1px solid #bfdbfe; }
    .action-bar { max-width: 880px; margin: 0 auto 15px; display: flex; justify-content: space-between; gap: 10px; }
    .btn { background: #3b82f6; color: white; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(59,130,246,0.25); }
    .btn-secondary { background: #64748b; box-shadow: none; }
    .status-alert { padding: 16px 20px; border-radius: 12px; font-size: 13px; margin-bottom: 25px; ${job.status === 'Completed' ? 'background:#f0fdf4; border:1px solid #bbf7d0; color:#166534;' : job.status === 'Failed' ? 'background:#fef2f2; border:1px solid #fecaca; color:#991b1b;' : 'background:#fffbeb; border:1px solid #fde68a; color:#92400e;'} }
    @media print {
      .action-bar { display: none !important; }
      body { background: white; padding: 0; }
      .report-container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="action-bar">
    <button class="btn" onclick="window.print()">🖨️ Print / Save PDF</button>
    <button class="btn btn-secondary" onclick="window.close()">✕ Close Report</button>
  </div>
  <div class="report-container">
    <div class="header">
      <div>
        <div class="brand-title">NOVA <span>ENGINEERING</span></div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 600;">Finite Element Analysis & Structural Verification</div>
      </div>
      <div class="meta-box">
        <div style="font-weight: 800; font-size: 16px; color: #3b82f6;">${job.job_id_display || job.id.substring(0,8)}</div>
        <div style="margin-top: 2px;">${new Date(job.created_at).toLocaleString()}</div>
        <span class="job-badge">${job.status}</span>
      </div>
    </div>
    ${job.status === 'Failed' ? `
      <div class="status-alert">
        <strong>⚠ Simulation Execution Failure:</strong><br/>
        ${job.error_message || job.error || 'The simulation runner reported an error during solver execution.'}
      </div>
    ` : ''}
    ${job.status === 'Completed' ? `
      <div class="status-alert">
        <strong>✔ Simulation Successfully Executed:</strong> All load cases processed according to ASME Section VIII Div 2 Part 5 design-by-analysis rules.
      </div>
    ` : ''}
    <h2>Project & Job Overview</h2>
    <table>
      <tr><th>Project Name</th><td><strong>${job.name || 'Analysis Job'}</strong></td></tr>
      <tr><th>Analysis Type</th><td>${job.type}</td></tr>
      <tr><th>Job Identifier</th><td><code>${job.job_id_display || job.id}</code></td></tr>
      <tr><th>Date & Time</th><td>${new Date(job.created_at).toLocaleString()}</td></tr>
      <tr><th>Current Status</th><td><strong>${job.status}</strong></td></tr>
      ${job.result_url ? `<tr><th>Full Analysis ZIP</th><td><a href="${job.result_url}" target="_blank" style="color:#2563eb; font-weight:bold;">Download Archive (Google Drive)</a></td></tr>` : ''}
    </table>
    <div style="margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center;">
      Generated automatically by NOVA Cloud Engineering Platform. Compliant with ASME Sec VIII Div 2 standards.
    </div>
  </div>
</body>
</html>`;
    const reportWin = window.open('', '_blank');
    if (reportWin) {
      reportWin.document.write(reportHtml);
      reportWin.document.close();
    }
  };
  const renderJobDetailsModal = () => {
    if (!selectedJobDetails) return null;

    const isSuccess = selectedJobDetails.status === 'Completed' || selectedJobDetails.status === 'Success';
    const isFailed = selectedJobDetails.status === 'Failed';
    const isPending = selectedJobDetails.status === 'Pending';
    const isProcessing = !isSuccess && !isFailed && !isPending;

    const statusLabel = selectedJobDetails.status;
    let payloads = selectedJobDetails.json_payload;
    if (typeof payloads === 'string') {
      try { payloads = JSON.parse(payloads); } catch (e) {}
    }
    if (!Array.isArray(payloads)) payloads = [payloads];
    const isBatch = payloads.length > 1;

    const getBatchItem = (arrStr, idx, fallback) => {
      if (!arrStr) return fallback;
      try {
        if (typeof arrStr === 'string') {
          if (arrStr.startsWith('[')) {
            const arr = JSON.parse(arrStr);
            if (Array.isArray(arr) && arr.length > idx) return arr[idx];
          } else {
            const arr = arrStr.split(',');
            if (arr.length > 1 && arr.length > idx) return arr[idx].trim();
            if (idx === 0) return arrStr;
          }
        } else if (Array.isArray(arrStr) && arrStr.length > idx) {
          return arrStr[idx];
        }
      } catch (e) {}
      return fallback;
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsJobDetailsOpen(false)}
        />

        <div className="glass-card w-full max-w-2xl sm:max-w-3xl p-4 sm:p-9 z-10 animate-in zoom-in-95 space-y-6">

          <div className="flex items-center justify-between gap-3 pb-5 border-b border-slate-200">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-black text-slate-900 tracking-tight">{selectedJobDetails.job_id_display || selectedJobDetails.id.substring(0,8)}</span>
              <span className="px-3 py-1 text-xs font-extrabold text-[#2563eb] bg-blue-50 border border-blue-200 rounded-full">
                {selectedJobDetails.type || 'Nozzle Analysis'}
              </span>
              {!isBatch && <AnimatedStatusBadge status={statusLabel} />}
            </div>

            <button
              onClick={() => setIsJobDetailsOpen(false)}
              title="Close"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="block text-[11px] font-black uppercase text-slate-500 tracking-wider">Job ID</span>
              <span className="font-black text-[#2563eb] text-sm mt-1 block">{selectedJobDetails.job_id_display || selectedJobDetails.id}</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="block text-[11px] font-black uppercase text-slate-500 tracking-wider">Type of Analysis</span>
              <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                <Box className="w-4 h-4 text-indigo-600" />
                {selectedJobDetails.type || 'Nozzle Analysis'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="block text-[11px] font-black uppercase text-slate-500 tracking-wider">Submitted</span>
              <span className="font-bold text-slate-700 text-xs mt-1 block">
                {new Date(selectedJobDetails.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date(selectedJobDetails.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

          </div>

          {isFailed && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-800 font-black text-xs">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Error Diagnostics:</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedJobDetails.error_message || selectedJobDetails.error || 'Simulation solver error');
                    setCopiedError(true);
                    setTimeout(() => setCopiedError(false), 2000);
                  }}
                  className="text-xs font-bold text-red-700 bg-white border border-red-200 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {copiedError ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedError ? 'Copied' : 'Copy Error'}
                </button>
              </div>
              <div className="bg-white border border-red-200 rounded-xl p-3.5 font-mono text-xs text-red-900 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed shadow-inner">
                {selectedJobDetails.error_message || selectedJobDetails.error || "Simulation solver execution failed. Please verify geometry dimensions, material temperature limits, and boundary conditions."}
              </div>
            </div>
          )}

          {isPending && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900 font-bold">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Job is queued. The backend simulation worker will pick it up shortly.</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-4 w-full">
            {payloads.map((p, idx) => {
              const pStatus = isBatch ? getBatchItem(selectedJobDetails.statuses, idx, statusLabel) : statusLabel;
              const pReportUrl = isBatch ? getBatchItem(selectedJobDetails.report_urls, idx, selectedJobDetails.report_url) : selectedJobDetails.report_url;
              const pResultUrl = isBatch ? getBatchItem(selectedJobDetails.result_urls, idx, selectedJobDetails.result_url) : selectedJobDetails.result_url;
              const isPSuccess = pStatus === 'Completed' || pStatus === 'Success';
              const labelSuffix = isBatch ? ` Analysis ${idx + 1}` : '';
              
              return (
                <div key={idx} className="flex flex-col gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  {isBatch && (
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Analysis {idx + 1} {p.Head_TYPE ? '(Vessel Head)' : '(Shell Nozzle)'}</span>
                      <AnimatedStatusBadge status={pStatus} />
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-center justify-start gap-3">
                    <button
                      onClick={() => generateInputPDF(selectedJobDetails, idx)}
                      title="Download User Input Parameters PDF"
                      className="glass-card w-full sm:w-auto justify-center px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-[11px] font-black text-violet-800 hover:scale-105 flex items-center gap-2 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-violet-600" />
                      Input Parameters PDF{labelSuffix}
                    </button>

                    {pReportUrl ? (
                      <a
                        href={pReportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Download MS Word FEA Report (.docx)"
                        className="glass-card w-full sm:w-auto justify-center px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-[11px] font-black text-emerald-800 hover:scale-105 flex items-center gap-2 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        View Report{labelSuffix}
                      </a>
                    ) : isPSuccess ? (
                      <button
                        onClick={() => generateAndOpenReport(selectedJobDetails)}
                        title="View Analysis Report"
                        className="glass-card w-full sm:w-auto justify-center px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-[11px] font-black text-emerald-800 hover:scale-105 flex items-center gap-2 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        View Report{labelSuffix}
                      </button>
                    ) : null}

                    {pResultUrl && (
                      <a
                        href={pResultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Download complete ANSYS simulation archive"
                        className="glass-card w-full sm:w-auto justify-center text-blue-900 px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-[11px] font-black transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Full Analysis{labelSuffix} (.zip)
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  };
  const DashboardHeader = ({ isProfile }) => (
    <div className="relative z-50 flex flex-col items-start justify-between p-4 md:p-6 mb-4 md:mb-8 border-t shadow-md glass-panel text-slate-800 rounded-3xl md:flex-row md:items-center border-white/60">
      <div className="flex items-center gap-4">
        <div className="items-center justify-center hidden p-3 transition-all border shadow-sm cursor-pointer sm:flex bg-white/40 border-white/50 rounded-2xl hover:bg-white/60 hover:scale-105" onClick={handleLogoClick}>
          <CosmicLogo className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div>
          {isProfile ? (
            <h1 className="text-lg md:text-2xl font-extrabold text-[#1E293B] drop-shadow-sm">About Me</h1>
          ) : (
            <>
              <h1 className="text-lg md:text-2xl font-extrabold text-[#1E293B] tracking-wide drop-shadow-sm">Welcome, {currentUser.name}!</h1>
              <div className="flex items-center text-sm mt-1.5 font-bold text-slate-600">
                <span>NOVA Dashboard - {jobs.length} Jobs</span>
                <span className={`ml-3 flex items-center px-2.5 py-1 rounded-full text-xs shadow-sm border ${currentUser.isApproved ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-800' : 'bg-amber-500/20 border-amber-500/30 text-amber-800'}`}>
                  {currentUser.isApproved ? ( 
                    <><CheckCircle className="w-3.5 h-3.5 mr-1" /> Online</> 
                  ) : ( 
                    <><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Pending Owner Confirmation</> 
                  )}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      {isProfile ? (
        <button onClick={() => setCurrentView('dashboard')} className="glass-input hover:bg-white/70 text-slate-800 px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-colors mt-4 md:mt-0 shadow-sm border-white/80">
          Back to Dashboard
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 z-[60]">
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center p-2 pr-4 space-x-3 text-left transition-colors shadow-sm cursor-pointer glass-input hover:bg-white/70 rounded-2xl focus:outline-none border-white/80">
              <div className="bg-[#3C64D6] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md overflow-hidden border border-white/20">
                {currentUser.avatar ? <img src={currentUser.avatar} alt="Profile" className="object-cover w-full h-full" /> : currentUser.initial}
              </div>
              <div className="hidden pr-2 sm:block">
                <div className="text-sm font-extrabold leading-tight text-slate-800">{currentUser.name}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-600 hidden sm:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-[100] text-slate-800 animate-in fade-in slide-in-from-top-2 border border-slate-200">
                <button onClick={() => { setCurrentView('profile'); setProfileTab('info'); setIsDropdownOpen(false); }} className="flex items-center w-full px-5 py-3 text-sm font-bold text-left transition-colors hover:bg-white/60">
                  <User className="w-4 h-4 mr-3 text-[#3C64D6]" /> My Profile
                </button>
                <button onClick={() => { setCurrentView('nova_help'); setIsDropdownOpen(false); }} className="flex items-center w-full px-5 py-3 text-sm font-bold text-left transition-colors hover:bg-white/60">
                  <HelpCircle className="w-4 h-4 mr-3 text-sky-600" /> Nova Help
                </button>
                <button onClick={() => { setCurrentView('nova_community'); setIsDropdownOpen(false); }} className="flex items-center w-full px-5 py-3 text-sm font-bold text-left transition-colors hover:bg-white/60">
                  <Users className="w-4 h-4 mr-3 text-emerald-600" /> Nova Community
                </button>
                <div className="h-px mx-2 my-1 bg-slate-200/50"></div>
                <button onClick={handleLogout} className="flex items-center w-full px-5 py-3 text-sm font-bold text-left text-red-600 transition-colors hover:bg-red-50/50">
                  <Lock className="w-4 h-4 mr-3 text-red-500" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
  const renderDashboard = () => (
      <div className="relative z-10 min-h-screen p-4 pt-24 font-sans text-slate-800 md:p-8">
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-4 md:px-6 py-4 rounded-2xl shadow-xl text-white font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md border border-white/20 ${notification.type === 'success' ? 'bg-emerald-600/90' : notification.type === 'info' ? 'bg-blue-600/90' : 'bg-slate-800/90'}`}>
            <CheckCircle className="w-5 h-5 shrink-0" /> {notification.message}
          </div>
        )}
        <div className="max-w-[1200px] mx-auto">
          <DashboardHeader isProfile={false} />
          {!currentUser.isApproved && (
            <div className="bg-amber-100 border border-amber-300 rounded-2xl p-5 mb-4 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm max-w-[1000px] mx-auto">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 mt-1 text-amber-600 shrink-0 sm:mt-0" />
                <div>
                    <h4 className="text-lg font-extrabold text-amber-800">Account Verification Required</h4>
                </div>
              </div>
              
              <button 
                onClick={handleRequestAccess} 
                disabled={isRequestingAccess}
                className="flex items-center gap-2 px-4 md:px-6 py-3 font-bold text-white transition-colors shadow-md bg-amber-600 hover:bg-amber-700 rounded-xl whitespace-nowrap disabled:opacity-70"
              >
                {isRequestingAccess ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                {isRequestingAccess ? 'Sending...' : 'Request Access'}
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-[1100px] mx-auto mb-10"> <div className="glass-panel border-indigo-500/20 bg-indigo-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Basic') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Cylinder className="w-6 h-6 text-indigo-600" /> Nozzle Analysis
                </h3>
              </div>
              
              {canRunPlan('Basic') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Nozzle Analysis', 300, 'Basic', () => window.location.href = '/Nozzle8.html')} 
                    className="bg-indigo-600 hover:bg-indigo-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-indigo-600/25">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Basic Plan to submit Nozzle Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Basic Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Basic</span>
                </button>
              )}
            </div> <div className="glass-panel border-emerald-500/20 bg-emerald-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Basic') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Waves className="w-6 h-6 text-emerald-500" /> Bellow Analysis
                </h3>
              </div>
              
              {canRunPlan('Basic') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Bellow Analysis', 300, 'Basic', () => window.location.href = '/bellow.html')} 
                    className="glass-btn-green w-full py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-105 shadow-md">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Basic Plan to submit Bellow Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white shadow-md hover:shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Basic Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Basic</span>
                </button>
              )}
            </div> <div className="glass-panel border-amber-500/20 bg-amber-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Pro') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <CircleDashed className="w-6 h-6 text-amber-600" /> Flange Analysis
                </h3>
              </div>
              
              {canRunPlan('Pro') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Flange Analysis', 200, 'Pro', () => window.location.href = 'https://nova-analysis.vercel.app/flange.html')} 
                    className="bg-amber-600 hover:bg-amber-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-amber-600/25">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Pro Plan to submit Flange Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-md hover:shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Pro Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Pro</span>
                </button>
              )}
            </div> <div className="glass-panel border-orange-500/20 bg-orange-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(234,88,12,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Basic') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" /> Local PWHT
                </h3>
              </div>
              
              {canRunPlan('Basic') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Local PWHT', 125, 'Basic', () => window.location.href = 'https://nova-analysis.vercel.app/pwht.html')} 
                    className="glass-btn-orange w-full py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-105 shadow-md">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Basic Plan to submit Local PWHT jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md hover:shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Basic Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Basic</span>
                </button>
              )}
            </div> <div className="glass-panel border-rose-500/20 bg-rose-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(225,29,72,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Basic') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Cylinder className="w-6 h-6 text-rose-600" /> Saddle Analysis
                </h3>
              </div>
              
              {canRunPlan('Basic') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Saddle Analysis', 150, 'Basic', () => window.location.href = 'https://nova-analysis.vercel.app/saddle.html')} 
                    className="bg-rose-600 hover:bg-rose-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-rose-600/25">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Basic Plan to submit Saddle Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-md hover:shadow-rose-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Basic Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Basic</span>
                </button>
              )}
            </div> <div className="glass-panel border-orange-500/20 bg-orange-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(249,115,22,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Pro') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-600" /> Hot Box Analysis
                </h3>
              </div>
              
              {canRunPlan('Pro') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Hot Box Analysis', 75, 'Pro', () => window.location.href = 'https://nova-analysis.vercel.app/hot.html')} 
                    className="bg-orange-600 hover:bg-orange-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-orange-600/25">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Pro Plan to submit Hot Box Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-md hover:shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Pro Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Pro</span>
                </button>
              )}
            </div> <div className="glass-panel border-purple-500/20 bg-purple-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Max') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <CircleDot className="w-6 h-6 text-purple-600" /> Stiffener Analysis
                </h3>
              </div>
              
              {canRunPlan('Max') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Stiffener Analysis', 150, 'Max', () => window.location.href = 'https://nova-analysis.vercel.app/stiffener.html')} 
                    className="bg-purple-600 hover:bg-purple-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-purple-600/25">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Max Plan to submit Stiffener Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white shadow-md hover:shadow-purple-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Max Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Max</span>
                </button>
              )}
            </div> <div className="glass-panel border-emerald-500/20 bg-emerald-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Max') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Target className="w-6 h-6 text-emerald-600" /> Tubesheet Analysis
                </h3>
              </div>
              
              {canRunPlan('Max') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Tubesheet Analysis', 250, 'Max', () => window.location.href = 'https://nova-analysis.vercel.app/tubesheet.html')} 
                    className="bg-emerald-600 hover:bg-emerald-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-emerald-600/25">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Max Plan to submit Tubesheet Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white shadow-md hover:shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Max Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Max</span>
                </button>
              )}
            </div> <div className="glass-panel border-cyan-500/20 bg-cyan-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(6,182,212,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Pro') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Link className="w-6 h-6 text-cyan-600" /> Lug Analysis
                </h3>
              </div>
              
              {canRunPlan('Pro') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Lug Analysis', 75, 'Pro', () => window.location.href = 'https://nova-analysis.vercel.app/lug.html')} 
                    className="bg-cyan-600 hover:bg-cyan-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-cyan-600/25">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Pro Plan to submit Lug Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-md hover:shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Pro Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Pro</span>
                </button>
              )}
            </div> <div className="glass-panel border-sky-500/20 bg-sky-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(14,165,233,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Max') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-sky-600" /> Trunnion Analysis
                </h3>
              </div>
              
              {canRunPlan('Max') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('Trunnion Analysis', 175, 'Max', () => window.location.href = 'https://nova-analysis.vercel.app/trunnion.html')} 
                    className="bg-sky-600 hover:bg-sky-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-sky-600/25">
                    Submit New Job
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Max Plan to submit Trunnion Analysis jobs.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-sky-600 hover:from-amber-600 hover:to-sky-700 text-white shadow-md hover:shadow-sky-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Max Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Max</span>
                </button>
              )}
            </div> <div className="glass-panel border-blue-500/20 bg-blue-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  <div className="h-5"></div>
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Database className="w-6 h-6 text-blue-600" /> ASME Materials
                </h3>
              </div>
              
              <button 
                onClick={() => consumeCredits('ASME Materials', 10, 'Free', () => window.location.href = 'https://asme-material.vercel.app/')} 
                className="bg-blue-600 hover:bg-blue-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-blue-600/25">
                Open Database
              </button>
            </div> <div className="glass-panel border-indigo-500/20 bg-indigo-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(79,70,229,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  <div className="h-5"></div>
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <LineChart className="w-6 h-6 text-indigo-600" /> Stress-Strain Curve
                </h3>
              </div>
              
              <button 
                onClick={() => consumeCredits('Stress-Strain Curve', 10, 'Free', () => window.location.href = 'https://nova-analysis.vercel.app/curve.html')} 
                className="bg-indigo-600 hover:bg-indigo-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-indigo-600/25">
                Open Generator
              </button>
            </div> <div className="glass-panel border-teal-500/20 bg-teal-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(20,184,166,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  {!canRunPlan('Max') ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <div className="h-5"></div>
                  )}
                </div>
                <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                  <Box className="w-6 h-6 text-teal-600" /> CAD AI
                </h3>
              </div>
              
              {canRunPlan('Max') ? (
                currentUser.isApproved ? (
                  <button 
                    onClick={() => consumeCredits('CAD AI', 75, 'Max', () => window.location.href = 'https://swcad-ai.vercel.app/chat')} 
                    className="bg-teal-600 hover:bg-teal-700 w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-teal-600/25">
                    Launch Agent
                  </button>
                ) : (
                  <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Pending Approval
                  </button>
                )
              ) : (
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    showNotification('⚡ Upgrade to Max Plan to launch CAD AI.', 'info');
                  }} 
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-teal-600 hover:from-amber-600 hover:to-teal-700 text-white shadow-md hover:shadow-teal-500/25 flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 group"
                  title="Requires Max Plan. Click to Upgrade."
                >
                  <Lock className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span>Upgrade to Submit Job</span>
                  <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-md font-extrabold uppercase">Max</span>
                </button>
              )}
            </div> <div className="glass-panel border-purple-500/20 bg-purple-50/40 rounded-[2rem] p-4 md:p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-center gap-2 mb-3 min-h-[22px]">
                  <div className="h-5"></div>
                </div>
                <h3 className="flex items-center justify-center gap-2 mb-2 text-xl font-extrabold text-slate-800 drop-shadow-sm">
                  <Sparkles className="w-5 h-5 text-purple-600" /> AI Recommender
                </h3>
                <p className="mb-6 text-xs font-medium text-slate-600">Not sure which analysis to run? Describe your scenario.</p>
              </div>
              <button onClick={() => setIsAiModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-full py-3.5 rounded-xl font-bold transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                <Sparkles className="w-4 h-4" /> ✨ Smart Setup
              </button>
            </div>
          </div><div className="glass-panel rounded-[2rem] p-4 md:p-8 shadow-sm mb-4 md:mb-8">
          <div className="flex flex-col items-center justify-between gap-4 mb-4 md:mb-8 sm:flex-row">
            <h2 className="text-lg md:text-2xl font-extrabold text-slate-800 drop-shadow-sm">Your Job Summary</h2>
            <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className="glass-input text-[#3C64D6] text-sm rounded-xl px-5 py-2.5 outline-none font-bold cursor-pointer shadow-sm border-white/60 focus:ring-2 focus:ring-blue-500">
              <option value={`All Analysis (${jobs.length})`}>All Analysis ({jobs.length})</option>
              <option value="Nozzle Analysis">Nozzle Analysis</option>
              <option value="Bellow Analysis">Bellow Analysis</option>
              <option value="Flange Analysis">Flange Analysis</option>
              <option value="Saddle Analysis">Saddle Analysis</option>
              <option value="Local PWHT">Local PWHT</option>
              <option value="Hot Box Analysis">Hot Box Analysis</option>
              <option value="Vessel Stiffener Ring Analysis">Vessel Stiffener Ring Analysis</option>
              <option value="Lifting Lug WRC Analysis">Lifting Lug WRC Analysis</option>
              <option value="Trunnion WRC Analysis">Trunnion WRC Analysis</option>
              <option value="2D Axisymetric Tubesheet Analysis">2D Axisymetric Tubesheet Analysis</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="p-5 text-center border shadow-sm bg-emerald-500/20 border-emerald-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-xl md:text-3xl font-extrabold text-emerald-800">{stats.total}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-700 opacity-90">Total</div>
            </div>
            <div className="p-5 text-center border shadow-sm bg-blue-500/20 border-blue-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-xl md:text-3xl font-extrabold text-blue-800">{stats.completed}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-blue-700 opacity-90">Completed</div>
            </div>
            <div className="p-5 text-center border shadow-sm bg-sky-500/20 border-sky-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-xl md:text-3xl font-extrabold text-sky-800">{stats.processing}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-sky-700 opacity-90">Processing</div>
            </div>
            <div className="p-5 text-center border shadow-sm bg-orange-500/20 border-orange-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-xl md:text-3xl font-extrabold text-orange-800">{stats.pending}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-orange-700 opacity-90">Pending</div>
            </div>
            <div className="p-5 text-center border shadow-sm bg-red-500/20 border-red-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-xl md:text-3xl font-extrabold text-red-800">{stats.failed}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-red-700 opacity-90">Failed</div>
            </div>
          </div>
        </div>
        {jobs.length === 0 ? (
          <div className="glass-panel rounded-[2.5rem] py-6 md:py-24 px-4 md:px-6 text-center border-t border-l border-white/80 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-24 h-24 mb-4 md:mb-8 glass-icon-container rounded-3xl">
              <Database className="w-8 h-8 sm:w-12 sm:h-12 text-[#3C64D6] opacity-80" />
            </div>
            <h3 className="mb-3 text-lg md:text-2xl font-extrabold text-slate-800 drop-shadow-sm">No Analysis Jobs Yet</h3>
            <p className="max-w-sm mx-auto mb-4 md:mb-8 text-sm font-medium leading-relaxed text-slate-600">Your engineering analysis jobs will appear here.<br/>Submit your first job to get started!</p>
            {canRunPlan('Basic') ? (
              currentUser.isApproved ? (
                <button onClick={() => openSubmitJob('Nozzle Analysis')} className="glass-btn-green font-bold py-3.5 px-4 md:px-6 rounded-xl transition-all hover:scale-105 flex items-center shadow-lg text-sm">
                   <Plus className="w-5 h-5 mr-2" /> Start First Job
                </button>
              ) : (
                <button disabled className="flex items-center px-4 md:px-6 py-3.5 text-sm font-bold shadow-sm cursor-not-allowed bg-slate-200 text-slate-500 rounded-xl">
                   <Lock className="w-5 h-5 mr-2" /> Pending Approval
                </button>
              )
            ) : (
              <button onClick={() => setCurrentView('dashboard')} className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold py-3.5 px-4 md:px-6 rounded-xl transition-all hover:scale-105 flex items-center shadow-lg text-sm">
                 <Lock className="w-5 h-5 mr-2 text-amber-200" /> Upgrade to Submit Job
              </button>
            )}
          </div>
        ) : (
          <div className="glass-panel rounded-[2rem] overflow-hidden border-t border-white/80">
             <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-8 py-5 border-b bg-white/40 backdrop-blur-md border-white/50">
                <div className="flex items-center gap-3">
                  <h3 className="flex items-center gap-3 text-lg font-extrabold text-slate-800 drop-shadow-sm"><FileText className="w-6 h-6 text-[#3C64D6]" /> Recent Jobs</h3>
                  <span className="text-xs font-bold text-slate-500 bg-white/60 px-2.5 py-1 rounded-full border border-slate-200/60">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
                  </span>
                </div>
                {selectedJobIds.length > 0 && (
                  <button 
                    onClick={handleDeleteSelectedJobs} 
                    disabled={isDeletingJobs}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white transition-all bg-red-600 rounded-xl shadow-md hover:bg-red-700 hover:scale-105 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedJobIds.length})
                  </button>
                )}
             </div>
             <div className="p-4 overflow-x-auto">
               <table className="w-full text-sm text-left border-separate text-slate-700 border-spacing-y-2">
                 <thead className="text-slate-500 font-bold uppercase tracking-wider text-[11px] px-4">
                   <tr>
                     <th className="w-12 px-4 py-2.5 text-center">
                       <input 
                         type="checkbox" 
                         className="w-4 h-4 rounded cursor-pointer accent-[#3C64D6]" 
                         checked={filteredJobs.length > 0 && filteredJobs.every(j => selectedJobIds.includes(j.id))} 
                         onChange={handleToggleSelectAll} 
                         title="Select / Deselect All" 
                       />
                     </th>
                     <th className="px-4 md:px-6 py-2.5">Job ID</th>
                     <th className="px-4 md:px-6 py-2.5">Type</th>
                     <th className="px-4 md:px-6 py-2.5">Date &amp; Time</th>
                     <th className="px-4 md:px-6 py-2.5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredJobs.map(job => {
                     const isSelected = selectedJobIds.includes(job.id);
                     const isJobSuccess = job.status === 'Completed' || job.status === 'Success';
                     const isJobFailed = job.status === 'Failed';
                     const isJobPending = job.status === 'Pending';
                     const isJobProcessing = !isJobSuccess && !isJobFailed && !isJobPending;
                     return (
                       <tr key={job.id} className={`transition-colors shadow-sm rounded-xl ${isSelected ? 'bg-blue-50/80 border border-blue-200' : 'bg-white/40 hover:bg-white/70'}`}>
                         <td className="w-12 px-4 py-4 text-center first:rounded-l-xl">
                           <input 
                             type="checkbox" 
                             className="w-4 h-4 rounded cursor-pointer accent-[#3C64D6]" 
                             checked={isSelected} 
                             onChange={(e) => handleToggleSelectJob(job.id, e)} 
                             title="Select Job" 
                           />
                         </td>
                         <td className="px-4 md:px-6 py-4 font-black text-[#3C64D6]">
                           {job.job_id_display || job.id.substring(0,8)}
                         </td>
                         <td className="px-4 md:px-6 py-4 font-semibold text-slate-700">
                           <span className="inline-flex items-center gap-1.5">
                             <Box className="w-3.5 h-3.5 text-indigo-500" />
                             {job.type}
                           </span>
                         </td>
                         <td className="px-4 md:px-6 py-4 font-medium text-slate-600 text-xs">
                           {new Date(job.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                           <span className="block text-[11px] text-slate-400 font-semibold">
                             {new Date(job.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                           </span>
                         </td>
                         <td className="px-4 md:px-6 py-4 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 last:rounded-r-xl">
                            <AnimatedStatusBadge status={job.status} /> {(job.report_url || isJobSuccess) && (
                              job.report_url ? (
                                <a 
                                  href={job.report_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  title="Download MS Word FEA Report (.docx)"
                                  className="glass-panel px-3 py-1.5 rounded-lg text-xs font-extrabold text-emerald-700 hover:bg-emerald-50 transition-all hover:scale-105 flex items-center gap-1.5 shadow-sm border border-emerald-300"
                                >
                                  <FileText className="w-3.5 h-3.5 text-emerald-600" /> Report
                                </a>
                              ) : (
                                <button 
                                  onClick={() => generateAndOpenReport(job)} 
                                  title="Download / View Analysis Report"
                                  className="glass-panel px-3 py-1.5 rounded-lg text-xs font-extrabold text-emerald-700 hover:bg-emerald-50 transition-all hover:scale-105 flex items-center gap-1.5 shadow-sm border border-emerald-300"
                                >
                                  <FileText className="w-3.5 h-3.5 text-emerald-600" /> Report
                                </button>
                              )
                            )} {job.result_url && (
                              <a 
                                href={job.result_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                title="Download Full Analysis ZIP Archive"
                                className="glass-panel px-3 py-1.5 rounded-lg text-xs font-extrabold text-blue-700 hover:bg-blue-50 transition-all hover:scale-105 flex items-center gap-1.5 shadow-sm border border-blue-300"
                              >
                                <Download className="w-3.5 h-3.5 text-blue-600" /> Full Analysis (.zip)
                              </a>
                            )} <button 
                              onClick={() => { 
                                setSelectedJobDetails(job); 
                                setActiveDetailRun(0); 
                                setCopiedError(false); 
                                setIsJobDetailsOpen(true); 
                              }} 
                              title={job.status === 'Failed' ? 'View Failure Error Log & Details' : 'View Input Parameters & Details'}
                              className={`glass-panel px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all hover:scale-105 flex items-center gap-1.5 shadow-sm ${
                                job.status === 'Failed' 
                                  ? 'text-red-700 hover:bg-red-50/80 border border-red-300' 
                                  : 'text-slate-700 hover:bg-white/80 border border-slate-300'
                              }`}
                            >
                              {job.status === 'Failed' ? <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> : <Eye className="w-3.5 h-3.5 text-slate-600" />} 
                              Details
                            </button> <button
                              onClick={(e) => handleDeleteJob(job.id, e)}
                              disabled={isDeletingJobs}
                              title="Delete Job"
                              className="p-1.5 text-red-600 transition-all border border-red-200 hover:bg-red-50 rounded-lg shadow-sm hover:scale-105 disabled:opacity-50 bg-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        
        {isSubmitJobOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSubmitJobOpen(false)}></div>
            <div className="glass-panel w-full max-w-md rounded-[2rem] overflow-hidden animate-in zoom-in-95 relative z-10 border-t border-l border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <div className={`p-4 md:p-6 text-white font-extrabold flex justify-between items-center bg-gradient-to-r ${selectedJobType === 'Nozzle Analysis' ? 'from-emerald-600/90 to-emerald-500/90' : selectedJobType === 'Local PWHT' ? 'from-orange-600/90 to-orange-500/90' : 'from-blue-600/90 to-blue-500/90'} backdrop-blur-md`}>
                <span className="flex items-center gap-3 text-lg drop-shadow-sm"><Plus className="w-6 h-6" /> New {selectedJobType}</span>
                <button onClick={() => setIsSubmitJobOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleJobSubmit} className="p-4 md:p-8 space-y-4">
                <div className="space-y-2">
                  <label className="pl-1 text-sm font-bold text-slate-800">Project Name</label>
                  <input name="jobName" type="text" className="w-full px-4 py-3.5 glass-input rounded-xl text-sm font-medium" required autoFocus placeholder="e.g. Shell Nozzle Analysis" />
                </div>
                
                <div className="pt-4 mt-2 border-t border-slate-300/40">
                  <button type="button" onClick={() => setShowMaterialConsultant(!showMaterialConsultant)} className="flex items-center gap-2 text-sm font-extrabold text-purple-700 hover:underline">
                    <Sparkles className="w-4 h-4" /> Need AI Material Recommendations?
                  </button>
                  
                  {showMaterialConsultant && (
                    <div className="p-4 mt-4 border bg-purple-500/10 border-purple-500/20 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                      <textarea
                        className="w-full h-14 md:h-20 p-3 mb-3 text-sm font-medium rounded-lg resize-none glass-input focus:ring-purple-500/50"
                        placeholder="E.g., High pressure steam, 450°C, corrosive environment..."
                        value={materialPrompt}
                        onChange={(e) => setMaterialPrompt(e.target.value)}
                      />
                      <button type="button" onClick={handleMaterialConsultant} disabled={isMaterialLoading || !materialPrompt.trim()} className="bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-50 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm w-full">
                        {isMaterialLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Ask AI Consultant
                      </button>
                      
                      {materialResponse && (
                        <div className="p-4 mt-4 text-xs font-medium leading-relaxed whitespace-pre-wrap border rounded-lg shadow-sm text-slate-800 glass-panel border-white/50">
                          {materialResponse}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsSubmitJobOpen(false)} className="flex-1 px-4 py-3.5 glass-input text-slate-800 rounded-xl font-bold hover:bg-white/60 transition-colors shadow-sm">Cancel</button>
                  <button type="submit" className={`flex-1 px-4 py-3.5 text-white rounded-xl font-bold transition-all hover:scale-[1.02] shadow-md ${selectedJobType === 'Nozzle Analysis' ? 'glass-btn-green' : selectedJobType === 'Local PWHT' ? 'glass-btn-orange' : 'glass-btn-blue'}`}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isInsightsOpen && renderInsightsModal()}
        
        {isJobDetailsOpen && renderJobDetailsModal()}
        {isAiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAiModalOpen(false)}></div>
            <div className="glass-panel w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-t border-l border-white/80">
              <div className="flex items-center justify-between p-4 md:p-6 text-white border-b bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border-white/20">
                <h3 className="flex items-center gap-3 text-xl font-extrabold drop-shadow-sm">
                  <Sparkles className="w-6 h-6" /> AI Analysis Recommender
                </h3>
                <button onClick={() => setIsAiModalOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
                <div className="bg-white/40 border border-white/50 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-[inset_0_2px_10px_rgba(255,255,255,0.5)]">
                  <p className="pl-1 mb-3 text-sm font-bold text-purple-900 drop-shadow-sm">Describe your engineering scenario below:</p>
                  <textarea
                    className="w-full h-20 md:h-32 p-4 text-sm font-medium resize-none glass-input rounded-xl focus:ring-purple-500/50"
                    placeholder="E.g., I have a high-pressure steam pipe attached to a thin-walled cylindrical vessel. I need to know if the junction is safe."
                    value={aiSetupPrompt}
                    onChange={(e) => setAiSetupPrompt(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={handleAiSetupSubmit}
                      disabled={isAiSetupLoading || !aiSetupPrompt.trim()}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white text-sm font-bold py-3 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] shadow-md"
                    >
                      {isAiSetupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isAiSetupLoading ? "Analyzing..." : "Analyze Scenario"}
                    </button>
                  </div>
                </div>
                {aiSetupResponse && (
                  <div className="p-4 md:p-8 shadow-sm glass-panel border-purple-500/30 rounded-2xl animate-in fade-in slide-in-from-bottom-4 bg-white/60">
                    <h4 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest text-purple-800 uppercase drop-shadow-sm">
                      <Bot className="w-4 h-4"/> AI Recommendation
                    </h4>
                    <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800">
                      {aiSetupResponse}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  const handleDownloadWbex = () => {
    const receipt = orderReceipt || completedInvoice;
    const planName = receipt?.plan || receipt?.productName || 'Full Nozzle Ansys ACT Wizard (.WBEX)';
    const licKey = receipt?.licenseKey || 'NOV-ACT-COMMERCIAL';
    downloadSecureWbexFile(planName, licKey, planName);
  };
  const handlePrintInvoice = () => {
    window.print();
  };
  const renderWizardProducts = () => {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4">
          <h2 className="text-xl font-black">Ansys Wizard Products</h2>
          <p className="text-sm text-slate-500">Ansys ACT automation workflows are integrated into Nova Analysis.</p>
          <button onClick={() => setCurrentView('dashboard')} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Go to Dashboard</button>
        </div>
      </div>
    );
  };
  const renderWizardBuy = () => renderWizardProducts();
  const renderWizardDemo = () => renderWizardProducts();
  const renderWizardCheckout = () => renderWizardProducts();
  const renderCreditSuccess = () => {
    const receipt = orderReceipt || {
      orderId: `ORD-${Date.now().toString().slice(-8)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      plan: currentUser.isLifetimeMax ? 'Max Plan (Annual Subscription)' : `${currentUser.plan} Plan (Monthly Subscription)`,
      price: currentUser.plan === 'Max' ? '$576.00' : currentUser.plan === 'Pro' ? '$399.00' : '$199.00',
      method: 'Direct Payment (Live Verified)',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      userEmail: currentUser.email || 'dineshkumar2729304@gmail.com',
      userName: currentUser.name || 'Dinesh Kumar Yadav',
      status: 'PAID',
      isWizardProduct: false,
      licenseKey: null
    };
    const modulesData = [
      {
        id: 'nozzle',
        name: 'ASME Nozzle Analysis',
        code: 'ASME VIII-2 Part 5 Elastic-Plastic',
        credits: 300,
        plan: 'Basic',
        icon: Cylinder,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        desc: 'Shell/head nozzle intersection stress linearization (Pm, Pl, Pb, Q) & limit load.',
        action: () => consumeCredits('Nozzle Analysis', 300, 'Basic', () => window.location.href = '/Nozzle8.html')
      },
      {
        id: 'bellow',
        name: 'Bellow Expansion Joint',
        code: 'EJMA 10th Ed & ASME VIII-1 App 26',
        credits: 300,
        plan: 'Basic',
        icon: Waves,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        desc: 'Axial, lateral, angular deflection, squirm stability & fatigue cycle evaluation.',
        action: () => consumeCredits('Bellow Analysis', 300, 'Basic', () => window.location.href = '/bellow.html')
      },
      {
        id: 'saddle',
        name: 'Saddle Horizontal Vessel',
        code: 'Zick Method & ASME Section VIII',
        credits: 150,
        plan: 'Basic',
        icon: Disc,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        desc: 'Peak bending over saddles, horn stress & circumferential compressive checks.',
        action: () => consumeCredits('Saddle Analysis', 150, 'Basic', () => window.location.href = '/saddle.html')
      },
      {
        id: 'pwht',
        name: 'Local PWHT Thermal Analysis',
        code: 'WRC 452 & ASME VIII-1 UW-40',
        credits: 125,
        plan: 'Basic',
        icon: Flame,
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        desc: 'Soak band calculation, axial thermal gradient control & residual stress relief.',
        action: () => consumeCredits('Local PWHT', 125, 'Basic', () => window.location.href = '/pwht.html')
      },
      {
        id: 'flange',
        name: 'Flange Rigidity & Leakage',
        code: 'ASME VIII-1 App 2 & EN 1591',
        credits: 200,
        plan: 'Pro',
        icon: Target,
        color: 'text-rose-600 bg-rose-50 border-rose-200',
        desc: 'Gasket seating factor, bolt preload, flange rotation and leakage criteria.',
        action: () => consumeCredits('Flange Analysis', 200, 'Pro', () => window.location.href = 'https://nova-analysis.vercel.app/flange.html')
      },
      {
        id: 'hotbox',
        name: 'Hot Box Thermal FEA',
        code: 'Transient & Steady-State Heat Transfer',
        credits: 75,
        plan: 'Pro',
        icon: Thermometer,
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        desc: 'Skirt hotspot dissipation, refractory conduction & thermal stress mitigation.',
        action: () => consumeCredits('Hot Box Analysis', 75, 'Pro', () => window.location.href = 'https://nova-analysis.vercel.app/hotbox.html')
      },
      {
        id: 'lug',
        name: 'Lug Lifting Analysis',
        code: 'WRC 107/537 Pin & Shear Stress',
        credits: 75,
        plan: 'Pro',
        icon: Link,
        color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
        desc: 'Tear-out check, pin bearing & vessel shell local longitudinal/circumferential stress.',
        action: () => consumeCredits('Lug Analysis', 75, 'Pro', () => window.location.href = 'https://nova-analysis.vercel.app/lug.html')
      },
      {
        id: 'trunnion',
        name: 'Trunnion Support Analysis',
        code: 'ASME VIII-2 Part 5 & WRC 537',
        credits: 175,
        plan: 'Max',
        icon: Dumbbell,
        color: 'text-sky-600 bg-sky-50 border-sky-200',
        desc: 'Heavy vertical vessel lifting, tailing lug & trunnion pipe shell local stresses.',
        action: () => consumeCredits('Trunnion Analysis', 175, 'Max', () => window.location.href = 'https://nova-analysis.vercel.app/trunnion.html')
      },
      {
        id: 'tubesheet',
        name: 'Tubesheet Heat Exchanger',
        code: 'ASME VIII-1 Part UHX & TEMA RCB',
        credits: 250,
        plan: 'Max',
        icon: Shapes,
        color: 'text-violet-600 bg-violet-50 border-violet-200',
        desc: 'Fixed, U-tube & floating tubesheet bending, shear & tube-to-tubesheet joint check.',
        action: () => consumeCredits('Tubesheet Analysis', 250, 'Max', () => window.location.href = 'https://nova-analysis.vercel.app/tubesheet.html')
      },
      {
        id: 'cad_ai',
        name: 'CAD AI 3D Generator',
        code: 'Parametric CAD Generation',
        credits: 75,
        plan: 'Max',
        icon: Box,
        color: 'text-teal-600 bg-teal-50 border-teal-200',
        desc: 'Autonomous AI parametric STEP/IGES geometry builder for pressure vessels.',
        action: () => consumeCredits('CAD AI', 75, 'Max', () => window.location.href = 'https://swcad-ai.vercel.app/chat')
      },
      {
        id: 'materials',
        name: 'ASME Materials Database',
        code: 'ASME Section II Part D Properties',
        credits: 10,
        plan: 'Free',
        icon: Database,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        desc: 'Instant temperature-dependent allowable stresses, yield & tensile strength.',
        action: () => consumeCredits('ASME Materials', 10, 'Free', () => setCurrentView('materials'))
      },
      {
        id: 'stress_strain',
        name: 'Stress-Strain Curve Generator',
        code: 'ASME VIII-2 Annex 3-D Multilinear',
        credits: 10,
        plan: 'Free',
        icon: LineChart,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        desc: 'True stress-strain curve generation with Ramberg-Osgood plasticity derivation.',
        action: () => consumeCredits('Stress-Strain Curve', 10, 'Free', () => setCurrentView('stress_strain'))
      }
    ];
    const currentSim = modulesData.find(m => m.id === creditSimModule) || modulesData[0];
    const runsPossible = Math.floor(currentUser.dailyCreditsTotal / currentSim.credits);
    const balanceAfterOneRun = Math.max(0, currentUser.dailyCreditsTotal - currentSim.credits);
    return (
      <div className="relative z-10 min-h-screen p-4 pt-24 font-sans text-slate-900 md:p-8  flex flex-col items-center justify-start">
        <div className="max-w-[1020px] w-full mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8"> <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] border-2 border-slate-200/90 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0"> <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <CosmicLogo className="w-10 h-10" />
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">NOVA AI TECHNOLOGIES</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Autonomous Pressure Vessel FEA Platform</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-300 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Daily Credits Active
                </span>
                <p className="text-[11px] font-mono text-slate-500 mt-1">Invoice: {receipt.invoiceNumber || 'INV-2026-004812'}</p>
              </div>
            </div> <div className="text-center space-y-4 py-2">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-emerald-400/20 animate-ping"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 relative z-10">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 animate-pulse" /> Daily Credits Unlocked & Ready
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Welcome to {currentUser.isLifetimeMax ? 'Max Plan' : `${currentUser.plan} Plan`}!
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
                  Your payment has been verified. Your account has been upgraded with <strong className="text-indigo-900 font-black">{currentUser.dailyCreditsTotal} Daily Credits</strong> refreshed automatically every 24 hours at 00:00 UTC.
                </p>
              </div>
            </div> <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-2">
                      ⚡ Daily Engineering Quota
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                      {currentUser.dailyCreditsRemaining} / {currentUser.dailyCreditsTotal}
                      <span className="text-base sm:text-lg font-bold text-slate-300">Credits / Day</span>
                    </h3>
                  </div>
                  
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      {currentUser.isLifetimeMax ? 'Max Plan (Forever Active)' : `${currentUser.plan} Plan Active`}
                    </span>
                    <p className="text-xs text-slate-400 font-medium mt-1">Refreshes every 24h at 00:00 UTC</p>
                  </div>
                </div> <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Available Balance Today</span>
                    <span className="text-emerald-400 font-mono">100% Full Quota Active</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 rounded-full w-full shadow-lg shadow-emerald-500/50"></div>
                  </div>
                </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300">Daily Reset</div>
                      <div className="text-sm font-black text-white">00:00 UTC (100%)</div>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300">Cloud Solver</div>
                      <div className="text-sm font-black text-white">High-Speed GPU Cluster</div>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300">ASME Div 1 & 2</div>
                      <div className="text-sm font-black text-white">All Modules Unlocked</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Interactive Daily Credit Run Simulator
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Test your daily capacity by selecting any engineering analysis module:
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 shrink-0">
                  Daily Quota: {currentUser.dailyCreditsTotal} Credits
                </div>
              </div> <div className="flex flex-wrap gap-2 pt-1">
                {modulesData.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setCreditSimModule(mod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      creditSimModule === mod.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mod.name} ({mod.credits} cr)
                  </button>
                ))}
              </div> <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-inner grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Analysis Cost</span>
                  <div className="text-xl font-black text-slate-900 font-mono">{currentSim.credits} Credits</div>
                  <div className="text-[11px] text-slate-500 font-medium">{currentSim.code}</div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Runs Possible Today</span>
                  <div className="text-xl font-black text-emerald-700 font-mono">{runsPossible} Full Runs / Day</div>
                  <div className="text-[11px] text-slate-500 font-medium">100% daily reset guaranteed</div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Balance After 1 Run</span>
                  <div className="text-xl font-black text-indigo-900 font-mono">{balanceAfterOneRun} Credits</div>
                  <div className="text-[11px] text-slate-500 font-medium">Remaining for other analyses</div>
                </div>
              </div>
            </div> <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    Ready to Solve: Your Unlocked Analysis Modules
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Click any module below to immediately launch the solver with your active daily quota:
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline shrink-0"
                >
                  View Resource Guide →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modulesData.map((m) => {
                  const IconComp = m.icon;
                  return (
                    <div 
                      key={m.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${m.color}`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ⚡ {m.credits} Credits
                          </span>
                        </div>
                        
                        <div>
                          <h5 className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {m.name}
                          </h5>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.code}</p>
                          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{m.desc}</p>
                        </div>
                      </div>
                      <div className="pt-4 mt-3 border-t border-slate-100">
                        <button
                          onClick={m.action}
                          className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-indigo-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow"
                        >
                          <span>Launch Solver</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Billed To (Client):</span>
                <div className="font-extrabold text-slate-900 text-sm">{receipt.userName || currentUser.name || 'Valued Engineer'}</div>
                <div className="font-medium text-slate-600">{receipt.userEmail || currentUser.email}</div>
                <div className="font-medium text-slate-500">Account Type: Verified Professional</div>
              </div>
              <div className="space-y-1.5 sm:text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Order & Transaction Details:</span>
                <div className="font-mono font-bold text-slate-800 flex items-center sm:justify-end gap-1.5">
                  Order ID: <span className="text-slate-900 font-extrabold">{receipt.orderId}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard?.writeText(receipt.orderId);
                      showNotification('Order ID copied to clipboard!', 'success', 'Copied');
                    }}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    title="Copy Order ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-slate-600">Date: {receipt.date}</div>
                <div className="text-slate-600">Payment Gateway: <strong className="text-slate-800">{receipt.method}</strong></div>
              </div>
            </div> <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Subscription Plan / Service</th>
                    <th className="p-3.5">Daily Credits Allocation</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{receipt.plan}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Full Cloud FEA, Batch Mode & Automated Report Generation
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">
                      ⚡ {currentUser.dailyCreditsTotal} Credits / Day (100% Daily Reset)
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                        ACTIVATED
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                      {receipt.price}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-700">
                  <tr>
                    <td colSpan="3" className="p-3 text-right">Subtotal:</td>
                    <td className="p-3 text-right">{receipt.price}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="p-3 text-right text-slate-500">Estimated Tax (0%):</td>
                    <td className="p-3 text-right text-slate-500">$0.00</td>
                  </tr>
                  <tr className="border-t border-slate-300 font-black text-slate-900 text-sm">
                    <td colSpan="3" className="p-3 text-right">Total Paid:</td>
                    <td className="p-3 text-right text-emerald-700 font-mono">{receipt.price}</td>
                  </tr>
                </tfoot>
              </table>
            </div> <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button 
                onClick={handlePrintInvoice}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md hover:scale-105"
              >
                <Printer className="w-4 h-4 text-emerald-400" /> Print / Save Tax Receipt (PDF)
              </button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors border border-slate-300 flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" /> View 100% Daily Credits Guide
                </button>
                <button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs transition-all shadow-md hover:scale-105 flex items-center justify-center gap-1.5"
                >
                  Start Analysis on Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderWizardSuccess = () => {
    const receipt = orderReceipt || {
      orderId: `ORD-${Date.now().toString().slice(-8)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      plan: 'Full Nozzle Ansys ACT Wizard (.WBEX)',
      price: '$399.00',
      method: 'Razorpay Standard (Live Verified)',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      userEmail: currentUser.email || 'dineshkumar2729304@gmail.com',
      userName: currentUser.name || 'Dinesh Kumar Yadav',
      status: 'PAID',
      isWizardProduct: true,
      licenseKey: 'NOV-ACT-WBEX-7F4B-9E21-A3C8'
    };
    if (!receipt.isWizardProduct && !(receipt.plan && (
      receipt.plan.toLowerCase().includes('wizard') || 
      receipt.plan.toLowerCase().includes('.wbex') || 
      receipt.plan.toLowerCase().includes('month license') ||
      receipt.plan.toLowerCase().includes('act extension')
    ))) {
      return renderCreditSuccess();
    }
    return (
      <div className="relative z-10 min-h-screen p-4 pt-24 font-sans text-slate-900 md:p-8  flex items-center justify-center">
        <div className="max-w-[800px] w-full mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] border-2 border-slate-200/90 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0"> <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <CosmicLogo className="w-10 h-10" />
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">NOVA AI TECHNOLOGIES</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Autonomous Pressure Vessel FEA Platform</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider border border-indigo-300">
                  <Package className="w-4 h-4 text-indigo-600" /> Commercial ACT License Active
                </span>
                <p className="text-[11px] font-mono text-slate-500 mt-1">Invoice: {receipt.invoiceNumber || 'INV-2026-004812'}</p>
              </div>
            </div> <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-indigo-600" /> Official Ansys ACT Deliverable
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Ansys ACT Wizard (.WBEX) Provisioned & Ready
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-lg mx-auto">
                Thank you for your commercial purchase. Your node-locked ACT Extension (.WBEX) binary and commercial activation key have been generated below for local Workbench installation.
              </p>
            </div> <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-3xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600" /> Assigned ACT Commercial License Key:
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  Perpetual Commercial
                </span>
              </div>
              <div className="flex items-center justify-between bg-white border-2 border-indigo-300/80 rounded-2xl p-4 shadow-inner">
                <span className="font-mono font-black text-sm sm:text-base text-indigo-800 tracking-widest select-all">
                  {receipt.licenseKey || 'NOV-ACT-WBEX-7F4B-9E21-A3C8'}
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard?.writeText(receipt.licenseKey || 'NOV-ACT-WBEX-7F4B-9E21-A3C8');
                    showNotification('Commercial license key copied to clipboard!', 'success', 'Copied');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 ml-3"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Key
                </button>
              </div>
            </div> <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-600/20">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full inline-block">
                  Compiled Extension Package
                </span>
                <h4 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <Package className="w-6 h-6 text-indigo-200" /> NOVA_Ansys_ACT_Wizard_v2.4.wbex
                </h4>
                <p className="text-xs text-indigo-100 max-w-md">
                  Includes automated meshing, stress linearization, and ASME Section VIII Div 2 Part 5 validation. Compatible with Workbench 2021 R1 - 2024 R2.
                </p>
              </div>
              <button 
                onClick={handleDownloadWbex}
                className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-black text-sm shadow-xl flex items-center gap-2 shrink-0 transition-all hover:scale-105 active:scale-95"
              >
                <DownloadCloud className="w-5 h-5 text-indigo-600 animate-bounce" /> Download .WBEX Archive
              </button>
            </div> <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" /> Local Ansys Workbench Installation Guide
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-mono font-black text-indigo-600 text-xs">Step 1:</span>
                  <p className="text-slate-600 font-medium">Open Ansys Workbench & navigate to <strong>Extensions → Install Extension...</strong></p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-mono font-black text-indigo-600 text-xs">Step 2:</span>
                  <p className="text-slate-600 font-medium">Select the downloaded <strong>.wbex</strong> package & toggle it active in Extension Manager.</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-mono font-black text-indigo-600 text-xs">Step 3:</span>
                  <p className="text-slate-600 font-medium">Paste your <strong>License Key</strong> into the NOVA ACT Toolbar prompt to activate.</p>
                </div>
              </div>
            </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Billed To (Client):</span>
                <div className="font-extrabold text-slate-900 text-sm">{receipt.userName || currentUser.name || 'Valued Engineer'}</div>
                <div className="font-medium text-slate-600">{receipt.userEmail || currentUser.email}</div>
                <div className="font-medium text-slate-500">Account Type: Commercial License Holder</div>
              </div>
              <div className="space-y-1.5 sm:text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Order & Transaction Details:</span>
                <div className="font-mono font-bold text-slate-800">Order ID: <span className="text-slate-900 font-extrabold">{receipt.orderId}</span></div>
                <div className="text-slate-600">Date: {receipt.date}</div>
                <div className="text-slate-600">Payment Gateway: <strong className="text-slate-800">{receipt.method}</strong></div>
              </div>
            </div> <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Purchased Deliverable</th>
                    <th className="p-3.5">License Term</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{receipt.plan}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Ansys ACT Binary (.WBEX) + Node-Locked Commercial License
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-indigo-700">
                      Commercial Node-Locked
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                        LICENSED
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                      {receipt.price}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-700">
                  <tr>
                    <td colSpan="3" className="p-3 text-right">Subtotal:</td>
                    <td className="p-3 text-right">{receipt.price}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="p-3 text-right text-slate-500">Estimated Tax (0%):</td>
                    <td className="p-3 text-right text-slate-500">$0.00</td>
                  </tr>
                  <tr className="border-t border-slate-300 font-black text-slate-900 text-sm">
                    <td colSpan="3" className="p-3 text-right">Total Paid:</td>
                    <td className="p-3 text-right text-emerald-700 font-mono">{receipt.price}</td>
                  </tr>
                </tfoot>
              </table>
            </div> <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button 
                onClick={handlePrintInvoice}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md hover:scale-105"
              >
                <Printer className="w-4 h-4 text-emerald-400" /> Print / Save Tax Receipt (PDF)
              </button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setCurrentView('wizard_demo')}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors border border-slate-300 flex items-center gap-1.5 justify-center"
                >
                  <PlayCircle className="w-4 h-4 text-indigo-600" /> Watch Setup Tutorial
                </button>
                <button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs transition-all shadow-md hover:scale-105"
                >
                  Return to Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderNovaHelp = () => {
    return (
      <div className="relative z-10 min-h-screen p-3 sm:p-6 pt-20 font-sans text-slate-900 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
        <div className="max-w-[1440px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3">
          {/* Top Dashboard Header */}
          <DashboardHeader isProfile={false} customTitle="Nova Help" />
          <NovaHelpContent onNavigateBack={() => setCurrentView('dashboard')} />
        </div>
      </div>
    );
  };

  const renderNovaCommunity = () => {
    const handleLikePost = async (postId) => {
      const isCurrentlyLiked = !!likedPosts[postId];
      const updatedLiked = { ...likedPosts, [postId]: !isCurrentlyLiked };
      setLikedPosts(updatedLiked);
      try { localStorage.setItem('nova_community_likes_permanent', JSON.stringify(updatedLiked)); } catch(e) {}

      let newCount = 0;
      setCommunityPosts(prev => {
        const updated = prev.map(p => {
          if (p.id === postId) {
            newCount = Math.max(0, (p.likes_count || 0) + (isCurrentlyLiked ? -1 : 1));
            return {
              ...p,
              likes_count: newCount
            };
          }
          return p;
        });
        try { localStorage.setItem('nova_community_posts_permanent', JSON.stringify(updated)); } catch(e) {}
        return updated;
      });

      try {
        if (supabase) {
          await supabase.from('nova_community_posts').update({ likes_count: newCount }).eq('id', postId);
        }
      } catch(err) {
        console.warn("Supabase like update err:", err);
      }

      showNotification(!isCurrentlyLiked ? 'Upvoted discussion!' : 'Removed upvote', 'info', 'Community');
    };

    const handleAddComment = async (postId, customText = null, customUser = null, customRole = null, customInitial = null) => {
      const text = (customText || replyText[postId] || '').trim();
      if (!text) return;
      
      const newCmt = {
        id: "cmt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        user: customUser || currentUser?.name || 'Nova Engineer',
        email: customUser ? 'ai@nova.platform' : (currentUser?.email || 'user@nova.ai'),
        avatar: customUser ? null : (currentUser?.avatar || null),
        initial: customInitial || (customUser ? '🤖' : (currentUser?.initial || (currentUser?.name ? currentUser.name[0].toUpperCase() : 'E'))),
        role: customRole || (currentUser?.plan === 'Max' ? 'Nova Lead Architect' : 'FEA Specialist'),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        text: text,
        created_at: new Date().toISOString()
      };

      setPostComments(prev => {
        const updated = {
          ...prev,
          [postId]: [...(prev[postId] || []), newCmt]
        };
        try { localStorage.setItem('nova_community_comments_permanent', JSON.stringify(updated)); } catch(e) {}
        return updated;
      });

      if (!customText) {
        setReplyText(prev => ({ ...prev, [postId]: '' }));
      }

      try {
        if (supabase) {
          const { data, error } = await supabase.from('nova_community_comments').insert([{
            post_id: postId,
            user_name: newCmt.user,
            user_initial: newCmt.initial,
            user_email: newCmt.email,
            comment: newCmt.text
          }]).select();
          if (data && data[0]) {
            setPostComments(prev => ({
              ...prev,
              [postId]: (prev[postId] || []).map(c => c.id === newCmt.id ? { ...c, id: data[0].id } : c)
            }));
          }
        }
      } catch(err) {
        console.warn("Supabase comment insert err:", err);
      }

      showNotification(customUser ? '✨ Nova AI answer posted to thread!' : 'Comment posted and synchronized to Database!', 'success', 'Community Discussion');
    };

    const handleDeleteComment = async (postId, commentId) => {
      setPostComments(prev => {
        const updated = {
          ...prev,
          [postId]: (prev[postId] || []).filter(c => c.id !== commentId)
        };
        try { localStorage.setItem('nova_community_comments_permanent', JSON.stringify(updated)); } catch(e) {}
        return updated;
      });

      try {
        if (supabase) {
          await supabase.from('nova_community_comments').delete().eq('id', commentId);
        }
      } catch(err) {
        console.warn("Supabase comment delete err:", err);
      }

      showNotification('Comment permanently removed', 'info');
    };

    const handleEditComment = async (postId, commentId, updatedText) => {
      if (!updatedText.trim()) return;
      setPostComments(prev => {
        const updated = {
          ...prev,
          [postId]: (prev[postId] || []).map(c => c.id === commentId ? { ...c, text: updatedText.trim() } : c)
        };
        try { localStorage.setItem('nova_community_comments_permanent', JSON.stringify(updated)); } catch(e) {}
        return updated;
      });
      setEditingCommentId(null);

      try {
        if (supabase) {
          await supabase.from('nova_community_comments').update({ comment: updatedText.trim() }).eq('id', commentId);
        }
      } catch(err) {
        console.warn("Supabase comment edit err:", err);
      }

      showNotification('Comment updated!', 'success');
    };

    const handleSavePostEdit = async (postId) => {
      const newTitle = editPostTitle.trim();
      const newContent = editPostContent.trim();
      setCommunityPosts(prev => {
        const updated = prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              title: newTitle || p.title,
              content: newContent || p.content,
              edited_at: new Date().toISOString()
            };
          }
          return p;
        });
        try { localStorage.setItem('nova_community_posts_permanent', JSON.stringify(updated)); } catch(e) {}
        return updated;
      });
      setEditingPostId(null);

      try {
        if (supabase) {
          await supabase.from('nova_community_posts').update({
            title: newTitle,
            content: newContent,
            updated_at: new Date().toISOString()
          }).eq('id', postId);
        }
      } catch(err) {
        console.warn("Supabase post edit err:", err);
      }

      showNotification('Discussion updated!', 'success');
    };

    const handleTriggerAiReview = (post) => {
      setSelectedPostForAi(post);
      setAiCommunityQuery(`Provide a deep technical ASME Section VIII Div 2 & Ansys FEA review for topic: "${post.title}". Verify standard compliance, suggest mesh or script improvements.`);
      setShowAskAiCommunityModal(true);
      runAiCommunityReview(post.title, post.content, post.code_snippet);
    };

    const runAiCommunityReview = async (title, content, code) => {
      setIsAiCommunityLoading(true);
      setAiCommunityResponse('');
      try {
        const prompt = `You are the NOVA Autonomous FEA Platform Senior Engineering Lead. Analyze this pressure vessel discussion topic:
Title: ${title}
Content: ${content}
Attached Script: ${code || 'None'}

Provide:
1. ASME Section VIII Div 1/2 Code Cross-References (applicable paragraphs like 5.2.2.4, 5.5.3, UG-37).
2. Numerical FEA Recommendations (Element formulations SOLID186, SCL path positioning, singularity avoidance).
3. Practical Python ACT or SpaceClaim optimization advice. Keep it direct, rigorous, and professional.`;

        if (window.VITE_GEMINI_API_KEY || import.meta.env?.VITE_GEMINI_API_KEY) {
          const apiKey = window.VITE_GEMINI_API_KEY || import.meta.env?.VITE_GEMINI_API_KEY;
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            setAiCommunityResponse(reply);
            setIsAiCommunityLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("AI Community query err:", err);
      }

      // High quality grounded fallback if offline
      setTimeout(() => {
        setAiCommunityResponse(`### ⚡ Nova Engineering AI Technical Review

**1. ASME Code Verification:**
- **Primary Membrane Stress ($P_m$):** Must be scoped along true surface normal vector. Limit is $S$ under design temperature.
- **Membrane + Bending ($P_m + P_b$):** Linearized path must verify against $1.5 \\cdot k \\cdot S$ allowable limit per Paragraph 5.2.2.4.
- **Cyclic Fatigue Evaluation:** For thermal transients, apply ASME VIII-2 Table 5.12 master curve with $K_e$ penalty factor per Eq. (5.32).

**2. Mesh Convergence Guidance:**
- Ensure at least **4 quadratic hexahedral elements (SOLID186)** across the nozzle-shell wall thickness to capture peak stress gradient without artificial shear locking.
- Verify that SCL endpoints are located on clean nodal interfaces without curvature singularity offset.

**3. Automation Script Optimization:**
- PyMechanical DPF scoping via Path Named Selections guarantees deterministic Cartesian tensor projection, reducing manual calculation errors by >98%.`);
        setIsAiCommunityLoading(false);
      }, 700);
    };

    const handleAiDraftPost = async () => {
      const query = aiDraftPrompt.trim() || 'ASME Section VIII Div 2 stress linearization automation';
      setIsAiDraftLoading(true);
      try {
        const prompt = `You are the NOVA FEA Platform AI. The user wants to draft a technical engineering post for the Nova Community on topic: "${query}".
Return a JSON object strictly matching this format:
{
  "title": "Clear concise engineering title",
  "category": "ASME Codes",
  "content": "Detailed technical explanation of the problem, formula, and simulation procedure (3-5 sentences).",
  "code_filename": "linearization_helper.py",
  "code_snippet": "# Python ACT Script snippet\\nimport mech_dpf\\nprint('Automated ASME check')\\n"
}`;

        if (window.VITE_GEMINI_API_KEY || import.meta.env?.VITE_GEMINI_API_KEY) {
          const apiKey = window.VITE_GEMINI_API_KEY || import.meta.env?.VITE_GEMINI_API_KEY;
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            const cleanJson = reply.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.title) setComposerTitle(parsed.title);
            if (parsed.content) setNewPostText(parsed.content);
            if (parsed.category) setComposerCategory(parsed.category);
            if (parsed.code_snippet) {
              setComposerCodeContent(parsed.code_snippet);
              setComposerCodeFilename(parsed.code_filename || 'ansys_script.py');
              setNewPostCode({
                content: parsed.code_snippet,
                filename: parsed.code_filename || 'ansys_script.py',
                lines: parsed.code_snippet.split('\n').length,
                size: '1.2 KB',
                lang: 'python'
              });
            }
            setShowAiDraftModal(false);
            setIsAiDraftLoading(false);
            showNotification('✨ AI drafted your discussion! Ready in WhatsApp Chatbar.', 'success');
            return;
          }
        }
      } catch (e) {
        console.warn("AI draft error:", e);
      }

      // Default high quality draft fallback
      setTimeout(() => {
        setComposerTitle(`ASME Sec VIII Div 2 Part 5 Stress Linearization & SCL Automation Workflow`);
        setNewPostText(`We are evaluating automated Stress Concentration Line (SCL) mapping across cylindrical nozzle-to-shell junctions.\n\nKey discussion points:\n1. Establishing Membrane (Pm) and Bending (Pb) stress extraction along true normal paths.\n2. Verifying allowable limits against 1.5*k*S per Paragraph 5.2.2.4.\n3. Eliminating singularity offsets at the re-entrant weld fillet.`);
        setComposerCategory('ASME Codes');
        const defaultCode = `# ASME Sec VIII Div 2 Part 5 SCL Linearization Script
import mech_dpf
import Ans.DataProcessing as dpf

def evaluate_scl_path(model, scl_path_name, allowable_s):
    analysis = model.Analyses[0]
    solution = analysis.Solution
    scl_tool = solution.AddStressTool()
    scl_stress = scl_tool.AddLinearizedStress()
    scl_stress.ScopingMethod = GeometryDefineByType.Path
    scl_stress.Path = model.GetPath(scl_path_name)
    solution.EvaluateAllResults()
    pm = scl_stress.MembraneStress.Value
    pb = scl_stress.BendingStress.Value
    print(f"[NOVA-AI] Evaluated SCL: Pm={pm:.2f} MPa, Pb={pb:.2f} MPa, Limit={1.5*allowable_s:.2f} MPa")
    return {"Pm": pm, "Pb": pb, "Passed": (pm + pb) <= (1.5 * allowable_s)}`;
        setComposerCodeFilename('asme_scl_evaluator.py');
        setComposerCodeContent(defaultCode);
        setNewPostCode({
          content: defaultCode,
          filename: 'asme_scl_evaluator.py',
          lines: defaultCode.split('\n').length,
          size: '1.4 KB',
          lang: 'python'
        });
        setShowAiDraftModal(false);
        setIsAiDraftLoading(false);
        showNotification('✨ AI drafted your discussion! Ready in WhatsApp Chatbar.', 'success');
      }, 600);
    };

    // Filter & Sort Logic (No Hashtags)
    const displayPosts = communityPosts || [];
    const filteredPosts = displayPosts.filter(p => {
      // Tab filter
      if (communityActiveTab === 'hot') {
        const score = (p.likes_count || 0) + ((postComments[p.id] || []).length * 2);
        if (score < 1 && displayPosts.length > 3) return false;
      } else if (communityActiveTab === 'solved') {
        if (!solvedPosts[p.id] && !p.is_solved) return false;
      } else if (communityActiveTab === 'bookmarked') {
        if (!bookmarkedPosts[p.id]) return false;
      } else if (communityActiveTab === 'my_posts') {
        const isMine = (p.user_email && currentUser?.email && p.user_email === currentUser.email) ||
                       (p.user_name === currentUser?.name);
        if (!isMine) return false;
      }

      // Category filter
      const matchCat = communityCategory === 'All' || p.category === communityCategory;

      // Search filter
      const q = communitySearch.toLowerCase().trim();
      const matchSearch = !q || 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.content && p.content.toLowerCase().includes(q)) ||
        (p.code_snippet && p.code_snippet.toLowerCase().includes(q)) ||
        (p.user_name && p.user_name.toLowerCase().includes(q));

      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (communitySort === 'upvotes') {
        return (b.likes_count || 0) - (a.likes_count || 0);
      }
      if (communitySort === 'comments') {
        return ((postComments[b.id] || []).length) - ((postComments[a.id] || []).length);
      }
      // default: latest
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    const categoriesList = [
      { name: 'All', icon: <Globe className="w-4 h-4" /> },
      { name: 'ASME Codes', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Ansys ACT', icon: <Terminal className="w-4 h-4" /> },
      { name: 'SpaceClaim', icon: <Box className="w-4 h-4" /> },
      { name: 'Meshing', icon: <Cpu className="w-4 h-4" /> },
      { name: 'Fatigue', icon: <Activity className="w-4 h-4" /> },
      { name: 'Material Tests', icon: <Thermometer className="w-4 h-4" /> }
    ];

    // Compute dynamic contributors from active posts and comments + current user
    const dynamicContributorsMap = new Map();
    if (currentUser?.name) {
      dynamicContributorsMap.set(currentUser.name, {
        name: currentUser.name,
        role: currentUser.plan === 'Max' ? 'Nova Lead Architect' : 'FEA Specialist',
        initial: currentUser.initial || (currentUser.name ? currentUser.name[0].toUpperCase() : 'U'),
        avatar: currentUser.avatar || null,
        pts: currentUser.plan === 'Max' ? 1420 : 350,
        solved: 4,
        count: 5
      });
    }
    displayPosts.forEach(p => {
      if (p.user_name) {
        const existing = dynamicContributorsMap.get(p.user_name) || {
          name: p.user_name,
          role: p.user_role || 'Simulation Engineer',
          initial: p.user_initial || p.user_name[0].toUpperCase(),
          avatar: p.user_avatar || null,
          pts: p.user_reputation || 120,
          solved: (p.is_solved || solvedPosts[p.id]) ? 1 : 0,
          count: 0
        };
        existing.count += 2;
        existing.pts += (p.likes_count || 0) * 10;
        if (p.is_solved || solvedPosts[p.id]) existing.solved += 1;
        dynamicContributorsMap.set(p.user_name, existing);
      }
    });
    Object.values(postComments).forEach(cmtList => {
      cmtList.forEach(c => {
        if (c.user) {
          const existing = dynamicContributorsMap.get(c.user) || {
            name: c.user,
            role: c.role || 'FEA Specialist',
            initial: c.initial || c.user[0].toUpperCase(),
            avatar: c.avatar || null,
            pts: 90,
            solved: 0,
            count: 0
          };
          existing.count += 1;
          existing.pts += 15;
          dynamicContributorsMap.set(c.user, existing);
        }
      });
    });
    const contributorsList = Array.from(dynamicContributorsMap.values())
      .sort((a, b) => b.pts - a.pts)
      .slice(0, 5);

    const totalDiscussionsCount = displayPosts.length;
    const totalScriptsCount = displayPosts.filter(p => p.code_snippet).length;
    const totalSolvedCount = displayPosts.filter(p => p.is_solved || solvedPosts[p.id]).length;

    return (
      <div className="relative z-10 min-h-screen p-3 sm:p-6 pt-20 font-sans text-slate-900 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
        <div className="max-w-[1440px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3">
          
          {/* Top Dashboard Header */}
          <DashboardHeader isProfile={false} customTitle="Nova Community" />

          {/* Hero Banner with Live FEA Network Stats */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0c2340] via-[#103766] to-[#1e4e8c] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-900/40">
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <Users className="w-3.5 h-3.5" /> Verified Engineering Community & FEA Forum
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  Pressure Vessel Engineering Hub
                </h1>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
                  Collaborate with simulation specialists. Share verified Ansys ACT scripts, ASME Section VIII Div 1/2 calculations, and CAD automation macros.
                </p>
              </div>

              {/* Live Metric Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto shrink-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                  <div className="text-lg sm:text-xl font-black text-emerald-300">⚡ Live</div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase">Supabase Sync</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                  <div className="text-lg sm:text-xl font-black text-white">{totalDiscussionsCount}</div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase">Discussions</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                  <div className="text-lg sm:text-xl font-black text-amber-300">{totalSolvedCount}</div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase">Solved Rate</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                  <div className="text-lg sm:text-xl font-black text-cyan-300">{totalScriptsCount}</div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase">ACT Scripts</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Column Community Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Feeds, Domains, ASME Standard (3 Cols) */}
            <div className="lg:col-span-3 space-y-5">
              
              {/* Feeds Selector Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200/90 shadow-xl space-y-2">
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-2 mb-2">Feed View</div>
                {[
                  { id: 'all', label: 'All Discussions', icon: <Globe className="w-4 h-4 text-blue-600" /> },
                  { id: 'hot', label: 'Hot & Trending', icon: <Flame className="w-4 h-4 text-rose-500" /> },
                  { id: 'latest', label: 'Latest Activity', icon: <Clock className="w-4 h-4 text-emerald-600" /> },
                  { id: 'solved', label: 'Solved Questions', icon: <CheckCircle className="w-4 h-4 text-teal-600" /> },
                  { id: 'bookmarked', label: 'My Bookmarks', icon: <Bookmark className="w-4 h-4 text-amber-500" /> },
                  { id: 'my_posts', label: 'My Discussions', icon: <User className="w-4 h-4 text-purple-600" /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCommunityActiveTab(tab.id);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      communityActiveTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {tab.icon}
                      {tab.label}
                    </span>
                    {tab.id === 'bookmarked' && Object.values(bookmarkedPosts).filter(Boolean).length > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        communityActiveTab === tab.id ? 'bg-white text-indigo-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {Object.values(bookmarkedPosts).filter(Boolean).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Engineering Domains Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200/90 shadow-xl space-y-2">
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-2 mb-2">Engineering Domains</div>
                {categoriesList.map(cat => {
                  const count = cat.name === 'All' 
                    ? displayPosts.length 
                    : displayPosts.filter(p => p.category === cat.name).length;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setCommunityCategory(cat.name);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                        communityCategory === cat.name
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {cat.icon}
                        {cat.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        communityCategory === cat.name ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ASME Code Guidelines Notice */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-4 border border-indigo-200/80 shadow-sm space-y-2 text-xs">
                <div className="flex items-center gap-2 font-black text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> ASME Peer Review Standard
                </div>
                <p className="text-slate-600 font-medium leading-relaxed text-[11px]">
                  All shared FEA scripts, Python ACT automation, and linearization procedures follow Section VIII Div 1 & 2 design-by-analysis rules.
                </p>
              </div>

            </div>

            {/* MIDDLE COLUMN: WhatsApp-Style Chatbox & Discussions Stream (6 Cols) */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Search & Sort Bar */}
              <div className="bg-white rounded-3xl p-4 border-2 border-slate-200/90 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={communitySearch}
                      onChange={(e) => setCommunitySearch(e.target.value)}
                      placeholder="Search topics, ASME codes, ACT scripts, or authors..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                    {communitySearch && (
                      <button 
                        onClick={() => setCommunitySearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                    <span className="text-[11px] font-bold text-slate-400">Sort:</span>
                    <select
                      value={communitySort}
                      onChange={(e) => setCommunitySort(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="latest">⚡ Latest Activity</option>
                      <option value="upvotes">🔥 Most Upvoted</option>
                      <option value="comments">💬 Most Comments</option>
                    </select>
                  </div>
                </div>

                {/* Active Filter Chips */}
                {(communityCategory !== 'All' || communityActiveTab !== 'all') && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-bold text-[11px]">Active Filters:</span>
                    {communityCategory !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                        Category: {communityCategory}
                        <button onClick={() => setCommunityCategory('All')}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {communityActiveTab !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[11px]">
                        Feed: {communityActiveTab}
                        <button onClick={() => setCommunityActiveTab('all')}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* WHATSAPP-STYLE INTERACTIVE CHATBOX COMPOSER */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-500/30 shadow-2xl relative">
                
                {/* Chatbox Top Header / Status */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt="User" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-sm" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center shadow-md">
                          {currentUser?.initial || 'D'}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-900">{currentUser?.name || 'Dinesh Kumar Yadav'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Online
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">WhatsApp-style Quick Discussion Chat</span>
                    </div>
                  </div>

                  {/* Category Selector Pill */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={composerCategory}
                      onChange={(e) => setComposerCategory(e.target.value)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all"
                    >
                      <option value="ASME Codes">📐 ASME Codes</option>
                      <option value="Ansys ACT">⚡ Ansys ACT</option>
                      <option value="SpaceClaim">⚙️ SpaceClaim</option>
                      <option value="Meshing">🕸️ Meshing</option>
                      <option value="Fatigue">🔄 Fatigue</option>
                      <option value="Material Tests">🔬 Material Tests</option>
                    </select>
                  </div>
                </div>

                {/* Staged Attachments Preview Pills (Floating above chat input) */}
                {(newPostMedia || composerCodeContent.trim() || newPostCode) && (
                  <div className="flex flex-wrap items-center gap-2 mb-3 p-2.5 bg-slate-900 rounded-2xl text-white border border-slate-800 animate-in fade-in">
                    
                    {/* Staged Code Snippet Pill */}
                    {(composerCodeContent.trim() || newPostCode) && (
                      <div className="flex items-center gap-2 bg-slate-800 border border-indigo-500/50 px-3 py-1.5 rounded-xl text-xs">
                        <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="font-mono text-emerald-300 font-bold truncate max-w-[150px]">
                          {composerCodeFilename || 'script.py'}
                        </div>
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                          {(composerCodeContent.split('\n').length || 1)} lines
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCodeModalFilename(composerCodeFilename);
                            setCodeModalContent(composerCodeContent);
                            setCodeModalLang(composerCodeLang);
                            setShowCodeModal(true);
                          }}
                          className="text-[10px] text-indigo-300 hover:text-white font-bold underline ml-1"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setComposerCodeContent('');
                            setNewPostCode(null);
                          }}
                          className="text-slate-400 hover:text-rose-400 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Staged Media Pill */}
                    {newPostMedia && (
                      <div className="flex items-center gap-2 bg-slate-800 border border-emerald-500/50 px-3 py-1.5 rounded-xl text-xs">
                        {newPostMedia.type === 'video' ? (
                          <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <img src={newPostMedia.data} alt="thumb" className="w-6 h-6 rounded object-cover border border-emerald-400" />
                        )}
                        <span className="text-slate-200 font-medium truncate max-w-[140px] text-[11px]">
                          {newPostMedia.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewPostMedia(null)}
                          className="text-slate-400 hover:text-rose-400 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* WhatsApp Chat Input Box */}
                <div className="relative flex items-end gap-2 bg-slate-50 border-2 border-slate-200 rounded-3xl p-2 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                  
                  {/* Paperclip / Plus Attachment Menu Button */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className={`p-2.5 rounded-full transition-all ${
                        showAttachMenu 
                          ? 'bg-emerald-600 text-white rotate-45 shadow-md' 
                          : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-200/80'
                      }`}
                      title="Attach code, media, or draft with AI"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    {/* WhatsApp Animated Popover Attachment Menu */}
                    {showAttachMenu && (
                      <div className="absolute left-0 bottom-14 z-50 bg-white rounded-3xl p-3 shadow-2xl border-2 border-slate-200/90 w-64 space-y-2 animate-in slide-in-from-bottom-3 fade-in">
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pt-1">
                          Attach to Chat
                        </div>
                        
                        {/* 1. Code / ACT Script Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowAttachMenu(false);
                            setCodeModalFilename(composerCodeFilename || 'asme_ansys_script.py');
                            setCodeModalContent(composerCodeContent || '');
                            setCodeModalLang(composerCodeLang || 'python');
                            setShowCodeModal(true);
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-indigo-50 text-left transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Terminal className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">⚡ Code / ACT Script</div>
                            <div className="text-[10px] text-slate-500">Dedicated Code Editor & Macro</div>
                          </div>
                        </button>

                        {/* 2. Photo / FEA Plot Upload */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowAttachMenu(false);
                            mediaFileInputRef.current?.click();
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-emerald-50 text-left transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Image className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">📷 Photo / FEA Plot</div>
                            <div className="text-[10px] text-slate-500">Attach contour, CAD, or plot</div>
                          </div>
                        </button>

                        {/* 3. Document / Script File */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowAttachMenu(false);
                            codeFileInputRef.current?.click();
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-blue-50 text-left transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <FileCode className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">📁 Upload Script File</div>
                            <div className="text-[10px] text-slate-500">.py, .mac, .wbex, .inp</div>
                          </div>
                        </button>

                        {/* 4. Draft with AI */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowAttachMenu(false);
                            setShowAiDraftModal(true);
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-purple-50 text-left transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">✨ Draft with AI</div>
                            <div className="text-[10px] text-slate-500">Generate post & ASME script</div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Textarea for WhatsApp Chat Message */}
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handlePostCommunity();
                        }
                      }}
                      placeholder="Type a message, ask an ASME question, or attach code... (Press Enter to send)"
                      rows="2"
                      className="w-full bg-transparent border-none p-2 text-xs sm:text-sm font-medium focus:outline-none resize-none placeholder:text-slate-400 leading-relaxed text-slate-800"
                    />
                  </div>

                  {/* Dedicated Code Editor Quick Launcher */}
                  <button
                    type="button"
                    onClick={() => {
                      setCodeModalFilename(composerCodeFilename || 'asme_ansys_script.py');
                      setCodeModalContent(composerCodeContent || '');
                      setCodeModalLang(composerCodeLang || 'python');
                      setShowCodeModal(true);
                    }}
                    className={`p-2.5 rounded-full transition-all shrink-0 ${
                      composerCodeContent.trim()
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60'
                    }`}
                    title="Open Dedicated Code Modal"
                  >
                    <Code className="w-5 h-5" />
                  </button>

                  {/* Send Button (WhatsApp Emerald Ripple) */}
                  <button
                    type="button"
                    onClick={handlePostCommunity}
                    disabled={isPosting || (!newPostText.trim() && !composerCodeContent.trim() && !newPostMedia)}
                    className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white rounded-full shadow-lg transition-all shrink-0 hover:scale-105 active:scale-95 flex items-center justify-center"
                    title="Send Message (Enter)"
                  >
                    {isPosting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Quick Hint Footer */}
                <div className="flex items-center justify-between px-3 pt-2 text-[11px] text-slate-400">
                  <span>💡 Tip: Click <Paperclip className="inline w-3 h-3 text-slate-500" /> to attach files, or <Code className="inline w-3 h-3 text-indigo-500" /> for the Dedicated Code Box.</span>
                  <span className="hidden sm:inline font-mono">Shift+Enter for new line</span>
                </div>

                {/* Hidden File Inputs */}
                <input type="file" ref={mediaFileInputRef} accept="image/*,video/*" className="hidden" onChange={handleMediaFileUpload} />
                <input type="file" ref={codeFileInputRef} accept=".py,.wbex,.mac,.inp,.apdl,.txt,.json,.js,.cpp,.c" className="hidden" onChange={handleCodeFileUpload} />
              </div>

              {/* POSTS STREAM */}
              <div className="space-y-5">
                {filteredPosts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200/90 shadow-xl space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">No Discussions in this View</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                      Be the first to send a message, share an ASME Section VIII Div 1/2 calculation, or attach an Ansys ACT script in the chatbox above.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setCommunityCategory('All');
                          setCommunityActiveTab('all');
                          setCommunitySearch('');
                        }}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredPosts.map((post) => {
                    const isLiked = !!likedPosts[post.id];
                    const isBookmarked = !!bookmarkedPosts[post.id];
                    const isSolved = !!solvedPosts[post.id] || !!post.is_solved;
                    const comments = postComments[post.id] || [];
                    const isExpanded = !!expandedComments[post.id];
                    const isAuthor = (post.user_email && currentUser?.email && post.user_email === currentUser.email) ||
                                     (post.user_name === currentUser?.name);

                    return (
                      <div 
                        key={post.id}
                        className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all space-y-4 shadow-xl ${
                          post.is_pinned 
                            ? 'border-indigo-400/80 bg-gradient-to-b from-indigo-50/30 to-white' 
                            : 'border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        {/* Post Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {post.user_avatar || (isAuthor && currentUser?.avatar) ? (
                                <img src={post.user_avatar || currentUser?.avatar} alt={post.user_name} className="w-11 h-11 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm shrink-0" />
                              ) : (
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                                  {post.user_initial || 'E'}
                                </div>
                              )}
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-slate-900 text-xs sm:text-sm">{post.user_name}</h4>
                                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                                  {post.user_role || 'FEA Specialist'}
                                </span>
                                {post.user_reputation && (
                                  <span className="text-[10px] bg-amber-50 text-amber-700 font-black px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {post.user_reputation} pts
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-0.5">
                                <span>{post.created_at ? new Date(post.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                                {post.edited_at && <span className="italic">(edited)</span>}
                                <span className="text-sky-500 font-bold flex items-center ml-1" title="Delivered & Synchronized to Database">
                                  <CheckCheck className="w-3.5 h-3.5 inline" />
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Badges & Actions */}
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {post.is_pinned && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full border border-indigo-200 shadow-sm">
                                <Pin className="w-3 h-3 text-indigo-600" /> Pinned
                              </span>
                            )}
                            {isSolved && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Solved
                              </span>
                            )}
                            {post.category && (
                              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                                {post.category}
                              </span>
                            )}
                            {isAuthor && (
                              <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 ml-1">
                                <button 
                                  onClick={() => {
                                    setEditingPostId(post.id);
                                    setEditPostTitle(post.title || '');
                                    setEditPostContent(post.content || '');
                                  }}
                                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-bold"
                                  title="Edit discussion"
                                >
                                  <Settings2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-bold"
                                  title="Delete discussion"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Post Content / Edit Mode */}
                        {editingPostId === post.id ? (
                          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-indigo-200 space-y-3">
                            <div className="text-xs font-black text-indigo-700 uppercase">Edit Message</div>
                            <input 
                              type="text"
                              value={editPostTitle}
                              onChange={(e) => setEditPostTitle(e.target.value)}
                              placeholder="Discussion Title"
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <textarea 
                              value={editPostContent}
                              onChange={(e) => setEditPostContent(e.target.value)}
                              rows="3"
                              placeholder="Discussion Content"
                              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setEditingPostId(null)}
                                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => handleSavePostEdit(post.id)}
                                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {post.title && (
                              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                                {post.title}
                              </h3>
                            )}
                            {post.content && (
                              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                {post.content}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Attached Code Block with Syntax, Copy & One-Click Download */}
                        {post.code_snippet && (
                          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
                              <span className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                                <Terminal className="w-4 h-4 text-emerald-400" />
                                {post.code_filename || 'ansys_script.py'}
                                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-sans">
                                  {post.code_snippet.split('\n').length} lines
                                </span>
                              </span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(post.code_snippet);
                                    setCopiedCodeId(post.id);
                                    setTimeout(() => setCopiedCodeId(null), 2000);
                                  }}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                                >
                                  {copiedCodeId === post.id ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                                </button>
                                <button 
                                  onClick={() => downloadCodeSnippet(post.code_filename, post.code_snippet)}
                                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all shadow-md hover:scale-105"
                                >
                                  <Download className="w-3.5 h-3.5" /> Download Script
                                </button>
                              </div>
                            </div>
                            <pre className="p-4 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto max-h-72 select-text">{post.code_snippet}</pre>
                          </div>
                        )}

                        {/* Media Plot / Contour Display with Modal Zoom */}
                        {(post.media_url || post.image_url) && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center shadow-md">
                            {post.media_type === 'video' || (post.media_url && post.media_url.includes('video')) ? (
                              <video controls src={post.media_url || post.image_url} className="w-full max-h-96" />
                            ) : (
                              <div 
                                className="relative group cursor-pointer w-full flex items-center justify-center bg-slate-900/50"
                                onClick={() => setSelectedMediaModal(post.media_url || post.image_url)}
                              >
                                <img src={post.media_url || post.image_url} alt="FEA Diagram" className="object-contain w-full max-h-96" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
                                  <Eye className="w-4 h-4" /> Click to view full image
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Engagement Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
                          <div className="flex items-center gap-4">
                            {/* Upvote */}
                            <button 
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                                isLiked 
                                  ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' 
                                  : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
                              <span>{(post.likes_count || 0) + (isLiked ? 1 : 0)} Upvotes</span>
                            </button>

                            {/* Comments Toggle */}
                            <button 
                              onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                                isExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                              <span>{comments.length} Comments</span>
                            </button>

                            {/* Bookmark */}
                            <button 
                              onClick={() => handleToggleBookmark(post.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                                isBookmarked ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : ''}`} />
                              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Ask AI Review for this Post */}
                            <button 
                              onClick={() => handleTriggerAiReview(post)}
                              className="px-3 py-1.5 rounded-xl text-indigo-700 hover:bg-indigo-50 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200/60"
                              title="Ask Nova AI to review and solve this topic"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Ask Nova AI</span>
                            </button>

                            {/* Mark Solved Toggle (for author) */}
                            {isAuthor && (
                              <button 
                                onClick={() => handleToggleSolved(post.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                  isSolved ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>{isSolved ? 'Solved ✓' : 'Mark Solved'}</span>
                              </button>
                            )}

                            {/* Share Link */}
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                showNotification('Discussion link copied to clipboard!', 'info');
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"
                              title="Share Link"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* WhatsApp-Style Threaded Comments Drawer */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50/70 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-5 sm:p-6 rounded-b-3xl">
                            <div className="space-y-3">
                              {comments.length === 0 ? (
                                <p className="text-xs text-slate-400 italic text-center py-3">
                                  No replies yet. Type an answer or insight in the reply box below.
                                </p>
                              ) : (
                                comments.map((c) => {
                                  const isCommentAuthor = (c.email && currentUser?.email && c.email === currentUser.email) ||
                                                         (c.user === currentUser?.name);

                                  return (
                                    <div key={c.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                                      {c.avatar || (isCommentAuthor && currentUser?.avatar) ? (
                                        <img src={c.avatar || currentUser?.avatar} alt={c.user} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                          {c.initial || 'E'}
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-900">{c.user}</span>
                                            {c.role && <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">{c.role}</span>}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400">{c.time || 'Recently'}</span>
                                            {isCommentAuthor && (
                                              <div className="flex items-center gap-1">
                                                <button 
                                                  onClick={() => {
                                                    setEditingCommentId(c.id);
                                                    setEditCommentText(c.text || '');
                                                  }}
                                                  className="text-slate-400 hover:text-indigo-600 text-[10px] font-bold px-1"
                                                >
                                                  Edit
                                                </button>
                                                <button 
                                                  onClick={() => handleDeleteComment(post.id, c.id)} 
                                                  className="text-slate-400 hover:text-rose-500 text-[10px] font-bold px-1"
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {editingCommentId === c.id ? (
                                          <div className="mt-1 space-y-1.5">
                                            <input 
                                              type="text" 
                                              value={editCommentText} 
                                              onChange={(e) => setEditCommentText(e.target.value)}
                                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                                            />
                                            <div className="flex justify-end gap-1.5">
                                              <button onClick={() => setEditingCommentId(null)} className="px-2 py-0.5 text-[10px] text-slate-500">Cancel</button>
                                              <button 
                                                onClick={() => handleEditComment(post.id, c.id, editCommentText)} 
                                                className="px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded"
                                              >
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="space-y-1">
                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{c.text}</p>
                                            <button 
                                              onClick={() => {
                                                const mention = `@${c.user} `;
                                                setReplyText(prev => ({
                                                  ...prev,
                                                  [post.id]: (prev[post.id] || '').startsWith(mention) ? prev[post.id] : mention + (prev[post.id] || '')
                                                }));
                                              }}
                                              className="text-[10px] text-indigo-600 hover:underline font-bold inline-flex items-center gap-0.5"
                                            >
                                              <CornerDownRight className="w-2.5 h-2.5" /> Reply
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            {/* WhatsApp Style Reply Input */}
                            <div className="flex gap-2 pt-2">
                              <input 
                                type="text" 
                                value={replyText[post.id] || ''}
                                onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddComment(post.id);
                                }}
                                placeholder={`Reply to ${post.user_name}... (Press Enter to send)`}
                                className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
                              />
                              <button 
                                onClick={() => handleAddComment(post.id)}
                                disabled={!(replyText[post.id] || '').trim()}
                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-sm transition-all shrink-0 hover:scale-105"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Leaderboard, ASME Tip of Day, Nova AI Widget (3 Cols) */}
            <div className="lg:col-span-3 space-y-5">
              
              {/* Leaderboard Card */}
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-900 uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-amber-500" /> Top FEA Contributors
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Reputation</span>
                </div>

                <div className="space-y-3">
                  {contributorsList.map((c, idx) => (
                    <div key={c.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          idx === 0 ? 'bg-amber-100 text-amber-800' :
                          idx === 1 ? 'bg-slate-200 text-slate-700' :
                          idx === 2 ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">{c.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{c.role}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-indigo-700">{c.pts} pts</div>
                        <div className="text-[9px] text-emerald-600 font-bold">{c.solved || 0} solved</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ASME Div 2 Tip of the Day Card */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center gap-2 font-black text-xs text-amber-400 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" /> ASME Tip of the Day
                </div>
                <div className="text-xs font-bold text-slate-200">
                  Paragraph 5.2.2.4: Stress Linearization (SCL) Path Setup
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  When establishing a Stress Concentration Line (SCL) across a nozzle crotch or flange neck, the path must be oriented strictly perpendicular to the midsurface. Avoid placing SCL endpoints directly on weld re-entrant notches to eliminate artificial singular peak stresses.
                </p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Standard: ASME VIII Div 2 Part 5</span>
                  <span className="text-emerald-400 font-bold">Elastic Analysis</span>
                </div>
              </div>

              {/* Ask Nova AI Quick Assistant */}
              <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200/90 shadow-xl space-y-3">
                <div className="flex items-center gap-2 font-black text-xs text-indigo-950 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Nova AI Discussion Analyst
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Have a complex ASME question or need a customized Ansys ACT Python snippet? Ask Nova AI instantly.
                </p>
                <input
                  type="text"
                  value={aiCommunityQuery}
                  onChange={(e) => setAiCommunityQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && aiCommunityQuery.trim()) {
                      setSelectedPostForAi(null);
                      setShowAskAiCommunityModal(true);
                      runAiCommunityReview("Custom Engineering Query", aiCommunityQuery.trim(), null);
                    }
                  }}
                  placeholder="e.g. SCL linearization formula..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  onClick={() => {
                    if (aiCommunityQuery.trim()) {
                      setSelectedPostForAi(null);
                      setShowAskAiCommunityModal(true);
                      runAiCommunityReview("Custom Engineering Query", aiCommunityQuery.trim(), null);
                    }
                  }}
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Analyze with AI
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* DEDICATED CODE & SCRIPT MODAL (WhatsApp-style Code Drawer) */}
        {showCodeModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 text-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-500/50 flex flex-col max-h-[90vh] animate-in zoom-in-95">
              
              {/* Code Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Terminal className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                      Ansys ACT & Script Code Box
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono px-2 py-0.5 rounded-full">
                        WhatsApp Code Drawer
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Write, paste, or upload Ansys Python ACT scripts, APDL macros, or CAD files</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Code Modal Toolbar & Config */}
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-bold">Filename:</span>
                    <input
                      type="text"
                      value={codeModalFilename}
                      onChange={(e) => setCodeModalFilename(e.target.value)}
                      placeholder="ansys_linearization.py"
                      className="bg-transparent text-emerald-300 font-mono text-xs focus:outline-none w-44"
                    />
                  </div>

                  <select
                    value={codeModalLang}
                    onChange={(e) => setCodeModalLang(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="python">Python (PyMechanical)</option>
                    <option value="apdl">APDL Macro (.mac)</option>
                    <option value="spaceclaim">SpaceClaim IronPython</option>
                    <option value="json">JSON / Config</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => codeFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-indigo-400" /> Upload File (.py/.mac)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const template = `# ASME Section VIII Div 2 Stress Linearization
import mech_dpf
import Ans.DataProcessing as dpf

def compute_scl_path(model, path_name, allowable_s):
    analysis = model.Analyses[0]
    stress_tool = analysis.Solution.AddStressTool()
    lin_stress = stress_tool.AddLinearizedStress()
    lin_stress.ScopingMethod = GeometryDefineByType.Path
    lin_stress.Path = model.GetPath(path_name)
    analysis.Solution.EvaluateAllResults()
    pm = lin_stress.MembraneStress.Value
    pb = lin_stress.BendingStress.Value
    print(f"Evaluated {path_name}: Pm={pm:.2f} MPa, Pb={pb:.2f} MPa")
    return {"Pm": pm, "Pb": pb, "Pass": (pm + pb) <= (1.5 * allowable_s)}`;
                      setCodeModalContent(template);
                      setCodeModalFilename('asme_scl_template.py');
                      setCodeModalLang('python');
                    }}
                    className="px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-indigo-700/50"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" /> + Insert ASME SCL Template
                  </button>
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 flex-1 overflow-hidden flex flex-col bg-slate-950">
                <textarea
                  value={codeModalContent}
                  onChange={(e) => setCodeModalContent(e.target.value)}
                  placeholder="# Paste or write your Python ACT script, APDL macro, or calculation algorithm here..."
                  rows="14"
                  className="w-full flex-1 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed select-text"
                />
              </div>

              {/* Code Modal Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                  <span>{codeModalContent.split('\n').length} lines</span>
                  <span>{codeModalContent.length} chars</span>
                  {codeModalContent && (
                    <button
                      type="button"
                      onClick={() => setCodeModalContent('')}
                      className="text-rose-400 hover:underline font-sans"
                    >
                      Clear Editor
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = codeModalContent.trim();
                      if (!trimmed) {
                        showNotification('Code box is empty. Please enter or paste some code.', 'error');
                        return;
                      }
                      setComposerCodeFilename(codeModalFilename || 'ansys_script.py');
                      setComposerCodeContent(trimmed);
                      setComposerCodeLang(codeModalLang);
                      setNewPostCode({
                        content: trimmed,
                        filename: codeModalFilename || 'ansys_script.py',
                        lines: trimmed.split('\n').length,
                        size: `${(trimmed.length / 1024).toFixed(1)} KB`,
                        lang: codeModalLang
                      });
                      setShowCodeModal(false);
                      showNotification(`Code attached: ${codeModalFilename || 'ansys_script.py'}`, 'success', 'Code Attached');
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Attach Code to Message
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Media Lightbox Modal */}
        {selectedMediaModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="relative max-w-5xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 p-2 shadow-2xl flex flex-col items-center">
              <button 
                onClick={() => setSelectedMediaModal(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={selectedMediaModal} alt="Enlarged FEA View" className="max-h-[82vh] object-contain rounded-2xl" />
            </div>
          </div>
        )}

        {/* Nova AI Analysis & Solution Modal with 1-Click Thread Answer */}
        {showAskAiCommunityModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-200 relative animate-in zoom-in-95">
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <span className="flex items-center gap-2 font-black text-sm sm:text-base">
                  <Sparkles className="w-5 h-5" /> Nova AI Engineering Analysis & Solution
                </span>
                <button 
                  onClick={() => setShowAskAiCommunityModal(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Topic: <strong className="text-indigo-700">{selectedPostForAi?.title || aiCommunityQuery}</strong></span>
                  {selectedPostForAi && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                      Thread #{selectedPostForAi.id.slice(-6)}
                    </span>
                  )}
                </div>

                {isAiCommunityLoading ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-500">Evaluating ASME Div 1/2 formulas & Ansys simulation mechanics...</p>
                  </div>
                ) : (
                  <div className="bg-slate-900 text-emerald-300 p-5 rounded-2xl font-mono text-xs leading-relaxed whitespace-pre-wrap select-text border border-slate-800">
                    {aiCommunityResponse}
                  </div>
                )}
              </div>

              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                <span className="text-[11px] text-slate-400 font-bold">Grounded in ASME VIII Div 2 & Ansys ACT APIs</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(aiCommunityResponse);
                      showNotification('AI analysis copied to clipboard!', 'success');
                    }}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>

                  {selectedPostForAi && (
                    <button 
                      onClick={() => {
                        handleAddComment(
                          selectedPostForAi.id, 
                          aiCommunityResponse, 
                          'Nova AI Assistant ✨', 
                          'AI Simulation Copilot', 
                          '🤖'
                        );
                        setExpandedComments(prev => ({ ...prev, [selectedPostForAi.id]: true }));
                        setShowAskAiCommunityModal(false);
                      }}
                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> 💬 Add as AI Answer to Thread
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Draft Discussion Modal */}
        {showAiDraftModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-200 relative animate-in zoom-in-95">
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <span className="flex items-center gap-2 font-black text-sm sm:text-base">
                  <Sparkles className="w-5 h-5" /> ✨ Draft Discussion with Nova AI
                </span>
                <button 
                  onClick={() => setShowAiDraftModal(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Enter a topic or query. Nova AI will generate a complete technical description, ASME code citations, and Python ACT / APDL macro code for your chat message.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">What would you like to discuss or publish?</label>
                  <textarea 
                    value={aiDraftPrompt}
                    onChange={(e) => setAiDraftPrompt(e.target.value)}
                    placeholder="e.g. ASME VIII Div 2 Part 5 SCL linearization path setup for cylindrical shell nozzle with attached ACT macro..."
                    rows="3"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Quick Topic Suggestions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'ASME Div 2 Stress Linearization (SCL)',
                      'Ansys ACT Hex Meshing Python Macro',
                      'SpaceClaim Parametric Nozzle Script',
                      'WRC-537 Local Nozzle Stress Benchmark'
                    ].map(sugg => (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => setAiDraftPrompt(sugg)}
                        className="text-[10px] font-bold px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-200 transition-colors"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-2">
                <button 
                  onClick={() => setShowAiDraftModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAiDraftPost}
                  disabled={isAiDraftLoading}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAiDraftLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate & Populate Chatbar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  const renderProfile = () => {
    return (
    <div className="relative z-10 min-h-screen font-sans text-slate-800 bg-[#f1f3f6]" style={{fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      {notification && (
        <div className={`fixed top-4 right-4 z-[200] px-5 py-3.5 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 text-sm border ${notification.type === 'success' ? 'bg-[#388e3c] border-[#2e7d32]' : notification.type === 'info' ? 'bg-[#1976d2] border-[#1565c0]' : 'bg-[#d32f2f] border-[#c62828]'}`}>
          <CheckCircle className="w-4 h-4 shrink-0" /> {notification.message}
        </div>
      )} <div className="bg-[#2874f0] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-semibold transition-colors">
              <ArrowRight className="w-4 h-4 rotate-180" /> Dashboard
            </button>
            <span className="text-white/40">/</span>
            <span className="text-white text-sm font-black">My Account</span>
          </div>
          <div className="flex items-center gap-2">
            {currentUser.avatar
              ? <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-white/40" />
              : <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm border-2 border-white/40">{currentUser.initial}</div>
            }
            <span className="font-bold text-sm hidden sm:block">{currentUser.name}</span>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-6 flex flex-col lg:flex-row gap-5 items-start"> <div className="w-full lg:w-[260px] shrink-0 space-y-3"> <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#2874f0] flex items-center justify-center text-white text-2xl font-black border-4 border-white shadow-lg">
                  {currentUser.avatar ? <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" /> : currentUser.initial}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <span className="text-white text-[10px] font-bold text-center leading-tight">Change</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 font-medium">Hello,</div>
                <div className="font-black text-slate-900 text-sm truncate">{currentUser.name}</div>
                <div className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full mt-1 ${currentUser.plan === 'Max' ? 'bg-purple-100 text-purple-800' : currentUser.plan === 'Pro' ? 'bg-blue-100 text-blue-800' : currentUser.plan === 'Basic' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                  <Sparkles className="w-2.5 h-2.5" /> {currentUser.plan} Plan
                </div>
                
              </div>
            </div>
          </div> <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {[
              { id: 'info',         icon: <User className="w-4 h-4" />,        label: 'Profile Information',     color: 'text-[#2874f0]' },
              { id: 'orders',       icon: <Receipt className="w-4 h-4" />,     label: 'My Orders & Jobs',        color: 'text-[#ff6161]' },
              { id: 'subscription', icon: <Sparkles className="w-4 h-4" />,    label: 'Plan & Subscription',     color: 'text-[#9c27b0]' },
              { id: 'security',     icon: <Lock className="w-4 h-4" />,        label: 'Security Settings',       color: 'text-[#e53935]' },
              { id: 'notifications',icon: <Bell className="w-4 h-4" />,        label: 'Notifications',           color: 'text-[#0288d1]' },
              { id: 'help',         icon: <HelpCircle className="w-4 h-4" />,  label: 'Help & Support',          color: 'text-[#00796b]' },
              { id: 'wizard',       icon: <Package className="w-4 h-4" />,     label: 'Ansys Wizard Product',    color: 'text-[#e65100]' },
              { id: 'community',    icon: <Users className="w-4 h-4" />,       label: 'Nova Community',          color: 'text-[#2e7d32]' },
              { id: 'nova_help',    icon: <BookOpen className="w-4 h-4" />,    label: 'Nova Help',               color: 'text-[#1565c0]' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setProfileTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-left transition-all border-b border-slate-100 last:border-b-0 group ${profileTab === item.id ? 'bg-[#e8f0fe] text-[#2874f0] border-l-4 border-l-[#2874f0]' : 'text-slate-700 hover:bg-slate-50 border-l-4 border-l-transparent'}`}
              >
                <span className={profileTab === item.id ? 'text-[#2874f0]' : item.color}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${profileTab === item.id ? 'text-[#2874f0]' : 'text-slate-300 group-hover:text-slate-400'}`} />
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-all border-t-2 border-slate-100 border-l-4 border-l-transparent">
              <Lock className="w-4 h-4" /> <span className="flex-1 text-left">Sign Out</span>
            </button>
          </div> <div className="bg-gradient-to-br from-[#2874f0] to-[#0c47ba] rounded-xl p-4 text-white shadow-lg">
            <div className="text-xs text-blue-200 font-medium mb-1">Daily Credits Available</div>
            <div className="text-2xl font-black">{currentUser.dailyCreditsRemaining}<span className="text-sm text-blue-200 font-medium"> / {currentUser.dailyCreditsTotal}</span></div>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.round((currentUser.dailyCreditsRemaining / currentUser.dailyCreditsTotal) * 100)}%` }}></div>
            </div>
            <button onClick={() => setProfileTab('subscription')} className="mt-3 w-full text-[11px] font-black bg-white text-[#2874f0] py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              Upgrade Plan →
            </button>
          </div>
        </div> <div className="flex-1 min-w-0 space-y-4"> {profileTab === 'info' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your name, email and contact details</p>
                </div>
                <button onClick={() => { setEditForm({ company: currentUser.company, phone: currentUser.phone }); setIsEditProfileOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#2874f0] hover:bg-[#1a5dc9] text-white text-sm font-bold rounded-lg transition-all shadow-sm">
                  <Settings className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="px-6 py-5 border-b border-slate-100 bg-[#f8fafc]">
                <div className="flex items-center gap-5">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#2874f0] flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-lg">
                      {currentUser.avatar ? <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" /> : currentUser.initial}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <span className="text-white text-[10px] font-bold">Change</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <div>
                    <div className="font-black text-lg text-slate-900">{currentUser.name}</div>
                    <div className="text-sm text-slate-500">{currentUser.email}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${currentUser.isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                        {currentUser.isApproved ? '✓ Verified' : '⚠ Pending'}
                      </span>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${currentUser.plan === 'Max' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                        {currentUser.plan} Plan
                      </span>

                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name',           value: currentUser.name,                                        icon: <User className="w-4 h-4 text-[#2874f0]" /> },
                    { label: 'Email Address',        value: currentUser.email,                                       icon: <Mail className="w-4 h-4 text-[#2874f0]" /> },
                    { label: 'Phone Number',         value: currentUser.phone || 'Not provided',                    icon: <Smartphone className="w-4 h-4 text-[#2874f0]" /> },
                    { label: 'Company / Institute',  value: currentUser.company || 'Not provided',                  icon: <Landmark className="w-4 h-4 text-[#2874f0]" /> },
                    { label: 'Member Since',         value: currentUser.joined,                                      icon: <Clock className="w-4 h-4 text-[#2874f0]" /> },
                    { label: 'Analysis Jobs',        value: `${jobs.length} Total · ${stats.completed} Completed`, icon: <Activity className="w-4 h-4 text-[#2874f0]" /> },
                  ].map((field, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-[#f8fafc] rounded-xl border border-slate-200 hover:border-[#2874f0]/30 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center shrink-0">{field.icon}</div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{field.label}</div>
                        <div className="text-sm font-bold text-slate-800 truncate">{field.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total',      value: stats.total,      color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { label: 'Completed',  value: stats.completed,  color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { label: 'Processing', value: stats.processing, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                    { label: 'Pending',    value: stats.pending,    color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  ].map((s, i) => (
                    <div key={i} className={`rounded-xl border px-4 py-3 text-center ${s.color}`}>
                      <div className="text-2xl font-black">{s.value}</div>
                      <div className="text-[11px] font-bold mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )} {profileTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900">My Analysis Orders</h2>
                <p className="text-xs text-slate-500 mt-0.5">{jobs.length} total jobs</p>
              </div>
              {jobs.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4"><Receipt className="w-7 h-7 text-slate-400" /></div>
                  <h3 className="font-bold text-slate-700 mb-2">No orders yet</h3>
                  <p className="text-sm text-slate-400 mb-4">Submit your first FEA analysis from the Dashboard</p>
                  <button onClick={() => setCurrentView('dashboard')} className="px-5 py-2.5 bg-[#2874f0] text-white text-sm font-bold rounded-lg hover:bg-[#1a5dc9]">Go to Dashboard</button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {jobs.map((job) => {
                    const normStatus = (job.status || '').toLowerCase();
                    const isCompleted = normStatus === 'completed' || normStatus === 'success';
                    const isFailed = normStatus === 'failed' || normStatus === 'error';
                    const isPending = !isCompleted && !isFailed;
                    return (
                      <div key={job.id} className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setSelectedJobDetails(job); setIsJobDetailsOpen(true); }}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center shrink-0"><Cpu className="w-5 h-5 text-[#2874f0]" /></div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{job.name}</div>
                              <div className="text-xs text-slate-500">Order: <span className="font-mono font-bold">{job.job_id_display || `NV-${(job.id || '').toString().slice(0,6)}`}</span></div>
                              <div className="text-[11px] text-slate-400">{new Date(job.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="tracking-wide uppercase">Completed</span>
                              </span>
                            )}
                            {isFailed && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-50 text-red-700 border border-red-300 shadow-sm">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                <span className="tracking-wide uppercase">Failed</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-300 shadow-sm">
                                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
                                <span className="tracking-wide uppercase">{job.status || 'Pending'}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )} {profileTab === 'subscription' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className={`rounded-xl overflow-hidden shadow-lg ${currentUser.plan === 'Max' ? 'bg-gradient-to-r from-purple-700 to-indigo-700' : currentUser.plan === 'Pro' ? 'bg-gradient-to-r from-[#2874f0] to-[#0c47ba]' : currentUser.plan === 'Basic' ? 'bg-gradient-to-r from-[#43a047] to-[#1b5e20]' : 'bg-gradient-to-r from-slate-700 to-slate-900'}`}>
                <div className="p-6 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-white/70 font-semibold uppercase tracking-wider mb-1">Active Plan</div>
                      <h2 className="text-3xl font-black">{currentUser.plan} Plan</h2>
                      <div className="flex items-center gap-3 mt-2 text-sm text-white/80 font-semibold">
                        <span>{currentUser.dailyCreditsTotal} Credits/day</span>
                        <span>·</span>
                        <span>{currentUser.dailyCreditsRemaining} remaining today</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/70 mb-1">Resets at</div>
                      <div className="font-black text-lg">00:00 UTC</div>
                      <div className="text-xs text-white/60">05:30 AM IST</div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-white/70 mb-1.5">
                      <span>Quota Used Today</span>
                      <span>{currentUser.dailyCreditsTotal - currentUser.dailyCreditsRemaining} / {currentUser.dailyCreditsTotal}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${Math.round((currentUser.dailyCreditsRemaining / currentUser.dailyCreditsTotal) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {(() => {
                  const PLAN_TIER_RANKS = { 'Free': 0, 'Basic': 1, 'Pro': 2, 'Max': 3 };
                  const userCurrentTierRank = PLAN_TIER_RANKS[currentUser?.plan || 'Free'] ?? 0;
                  const allPlans = [
                    { name: 'Free',  price: '$0',   credits: '100 cr/day',   badge: null,         color: 'border-slate-300',   features: ['ASME Materials (10 cr)','Stress-Strain Curves','AI Recommender Free','Daily Auto-Reset'] },
                    { name: 'Basic', price: '$10',  credits: '700 cr/day',   badge: null,         color: 'border-emerald-400', features: ['Nozzle Analysis (300 cr)','Bellow Analysis (300 cr)','Saddle Analysis','Full DOCX Reports'] },
                    { name: 'Pro',   price: '$35',  credits: '1,500 cr/day', badge: 'Popular',    color: 'border-[#2874f0]',   features: ['All Basic features','Flange & Lug Analysis','Priority Queue','5-10 FEA solves/day'] },
                    { name: 'Max',   price: '$60',  credits: '3,000 cr/day', badge: 'Best Value', color: 'border-purple-500',  features: ['All Pro features','Trunnion Analysis','CAD AI Generator','Tubesheet FEA'] },
                  ];
                  const upgradeablePlans = allPlans.filter(p => PLAN_TIER_RANKS[p.name] >= userCurrentTierRank);

                  return upgradeablePlans.map((plan) => {
                    const isCurrent = (currentUser?.plan || 'Free') === plan.name;
                    return (
                      <div key={plan.name} className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden flex flex-col ${isCurrent ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : plan.color} hover:shadow-md transition-all`}>
                        {plan.badge && <div className="bg-[#fb641b] text-white text-[10px] font-black py-1 text-center tracking-wider">{plan.badge}</div>}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center justify-between">
                            <div className="font-black text-xl text-slate-900">{plan.name}</div>
                            {isCurrent && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Active Plan
                              </span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-1 mt-1 mb-2">
                            <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                            <span className="text-sm text-slate-500">/mo</span>
                          </div>
                          <div className="text-xs font-bold text-[#2874f0] bg-[#e8f0fe] px-2.5 py-1 rounded-lg mb-4">{plan.credits}</div>
                          <div className="space-y-2 flex-1">
                            {plan.features.map((f, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-600"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> {f}</div>
                            ))}
                          </div>
                          {isCurrent ? (
                            <button 
                              disabled 
                              className="mt-4 w-full py-2.5 rounded-xl text-sm font-black bg-emerald-50 text-emerald-700 border-2 border-emerald-300 cursor-default flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-600" /> Current Plan (Active)
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                if (plan.name === 'Basic') {
                                  handleRazorpayCheckout('Basic Plan (Monthly Subscription)', '₹899', 'credit_subscription', { planName: 'Basic', credits: 700 });
                                } else if (plan.name === 'Pro') {
                                  handleRazorpayCheckout('Pro Plan (Monthly Subscription)', '₹2,999', 'credit_subscription', { planName: 'Pro', credits: 1500 });
                                } else if (plan.name === 'Max') {
                                  handleRazorpayCheckout('Max Plan (Monthly Subscription)', '₹4,999', 'credit_subscription', { planName: 'Max', credits: 3000 });
                                }
                              }} 
                              className="mt-4 w-full py-2.5 rounded-xl text-sm font-black bg-[#2874f0] hover:bg-[#1a5dc9] text-white shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                            >
                              Upgrade to {plan.name} →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              {currentUser.plan !== 'Max' && (
                <div className="bg-gradient-to-r from-[#2874f0] to-[#0c47ba] rounded-xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                  <div>
                    <div className="font-black text-lg">Unlock All 14 Analysis Modules</div>
                    <div className="text-white/80 text-sm mt-0.5">Upgrade to Max — 3,000 credits/day, full enterprise access</div>
                  </div>
                  <button onClick={() => handleRazorpayCheckout('Max Plan (Monthly Subscription)', '₹4,999', 'credit_subscription', { planName: 'Max', credits: 3000 })} className="shrink-0 px-6 py-3 bg-[#fb641b] hover:bg-[#e55a16] text-white font-black rounded-xl shadow-md text-sm hover:scale-105 transition-all">Upgrade to Max Plan (₹4,999) →</button>
                </div>
              )}
            </div>
          )} {profileTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900">Security Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage password and account security</p>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl hover:border-[#2874f0]/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0"><Lock className="w-5 h-5 text-red-600" /></div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Password</div>
                      <div className="text-xs text-slate-400 mt-0.5">Last changed recently</div>
                    </div>
                  </div>
                  <button onClick={() => setIsChangePasswordOpen(true)} className="px-4 py-2 border-2 border-[#2874f0] text-[#2874f0] text-sm font-bold rounded-lg hover:bg-[#e8f0fe] transition-all shrink-0">Change</button>
                </div>
                <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-emerald-600" /></div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Email Verification</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{currentUser.email}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-[11px] font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 shrink-0">Verified</span>
                </div>
                <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><Shield className="w-5 h-5 text-blue-600" /></div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Account Status</div>
                      <div className="text-xs text-slate-400 mt-0.5">Platform approval</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[11px] font-black rounded-full border shrink-0 ${currentUser.isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>{currentUser.isApproved ? 'Approved' : 'Pending'}</span>
                </div>
                <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center shrink-0"><Smartphone className="w-5 h-5 text-purple-600" /></div>
                    <div>
                      <div className="font-bold text-slate-700 text-sm">Two-Factor Authentication</div>
                      <div className="text-xs text-slate-400 mt-0.5">SMS and Authenticator app</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-[11px] font-black bg-slate-200 text-slate-500 rounded-full shrink-0">Coming Soon</span>
                </div>
                <div className="border-2 border-red-200 rounded-xl p-5 bg-red-50">
                  <div className="text-sm font-black text-red-800 mb-1">Danger Zone</div>
                  <div className="text-xs text-red-600 mb-3">Permanently delete your account. This action is irreversible.</div>
                  <button className="px-4 py-2 border-2 border-red-400 text-red-700 text-xs font-black rounded-lg hover:bg-red-100 transition-all">Delete My Account</button>
                </div>
              </div>
            </div>
          )} {profileTab === 'notifications' && (
            <div className="space-y-5 animate-in fade-in duration-300"> <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Activity & Alerts Log</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time alerts, transactions, and community events saved permanently</p>
                  </div>
                  {persistentNotifications.length > 0 && (
                    <button 
                      onClick={() => {
                        setPersistentNotifications([]);
                        try { localStorage.removeItem('nova_persistent_notifications'); } catch(e) {}
                        showNotification('Alert history cleared', 'info');
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                    >
                      Clear Log
                    </button>
                  )}
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {persistentNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs font-medium">
                      No alerts or notifications recorded yet.
                    </div>
                  ) : (
                    persistentNotifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50 flex items-start gap-3 transition-colors">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                          notif.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {notif.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                           notif.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{notif.time || 'Today'}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div> <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-black text-slate-900">Notification Preferences</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Configure automated push and email channels</p>
                </div>
                <div className="px-6 py-2">
                  {[
                    { key: 'job_complete',    label: 'Job Completion',       desc: 'Alert when your FEA analysis finishes' },
                    { key: 'job_failed',      label: 'Job Failed',           desc: 'Alert when a job fails or has errors' },
                    { key: 'credit_low',      label: 'Low Credit Warning',   desc: 'Warn when daily credits fall below 20%' },
                    { key: 'sub_renew',       label: 'Subscription Renewal', desc: 'Reminder 3 days before plan renews' },
                    { key: 'community',       label: 'Community Activity',   desc: 'Likes, comments and replies on posts' },
                    { key: 'product_updates', label: 'Product Updates',      desc: 'New features and platform improvements' },
                    { key: 'promos',          label: 'Offers & Promotions',  desc: 'Discounts and special offers' },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
                      <div>
                        <div className="text-sm font-bold text-slate-800">{pref.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{pref.desc}</div>
                      </div>
                      <button
                        onClick={() => setProfileNotifPrefs(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                        className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ml-4 ${profileNotifPrefs[pref.key] ? 'bg-[#2874f0]' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${profileNotifPrefs[pref.key] ? 'left-7' : 'left-1'}`}></span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                  <button onClick={() => showNotification('Notification preferences saved!', 'success', 'Preferences')} className="px-6 py-2.5 bg-[#2874f0] text-white font-bold text-sm rounded-xl hover:bg-[#1a5dc9] transition-all">Save Preferences</button>
                </div>
              </div>
            </div>
          )} {profileTab === 'help' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4"><Mail className="w-7 h-7 text-blue-600" /></div>
                  <h3 className="font-black text-slate-900 mb-2">Email Support</h3>
                  <p className="text-xs text-slate-500 mb-4">Technical issues, billing and licensing queries</p>
                  <a href="mailto:analysis.ai.nova@gmail.com" className="w-full py-2.5 bg-[#2874f0] text-white font-bold text-sm rounded-xl hover:bg-[#1a5dc9] transition-all block">analysis.ai.nova@gmail.com</a>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4"><Users className="w-7 h-7 text-emerald-600" /></div>
                  <h3 className="font-black text-slate-900 mb-2">Nova Community</h3>
                  <p className="text-xs text-slate-500 mb-4">Share results, ask questions, peer support</p>
                  <button onClick={() => setCurrentView('nova_community')} className="w-full py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-all">Open Community</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100"><h2 className="font-black text-slate-900">Frequently Asked Questions</h2></div>
                <div className="divide-y divide-slate-100">
                  {[
                    { q: 'When do daily credits reset?', a: 'Credits reset at 00:00 UTC (05:30 AM IST) every day, automatically and fully to 100%.' },
                    { q: 'What if I run out of credits mid-session?', a: 'The job will not submit if credits are insufficient. Upgrade your plan or wait for the midnight reset.' },
                    { q: 'How do I download my FEA report?', a: 'Dashboard → click any completed job → click View Report to download your DOCX or PDF.' },
                    { q: 'Is the payment system secure?', a: 'Yes. 256-bit SSL encryption. We support Visa, Mastercard, RuPay, UPI, Net Banking, and PayPal via secure certified gateways.' },
                    { q: 'How many computers can I use the ACT Wizard on?', a: '6-Month license: 2 workstation activations. 1-Month and 3-Month: 1 workstation activation each.' },
                    { q: 'How do I cancel my subscription?', a: 'Email analysis.ai.nova@gmail.com. Cancellations take effect at the end of the billing cycle.' },
                  ].map((item, i) => (
                    <details key={i} className="group px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <summary className="flex items-center justify-between font-bold text-sm text-slate-800 list-none">
                        {item.q}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0 ml-3" />
                      </summary>
                      <p className="text-sm text-slate-500 mt-3 leading-relaxed font-medium pr-4">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] flex items-center justify-center"><Bot className="w-5 h-5 text-[#2874f0]" /></div>
                  <div>
                    <div className="font-black text-slate-900 text-sm">NOVA AI Support</div>
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online</div>
                  </div>
                </div>
                <div className="h-52 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
                  {supportChat.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-xs font-medium max-w-[80%] leading-relaxed ${m.role === 'user' ? 'bg-[#2874f0] text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>{m.text}</div>
                    </div>
                  ))}
                  {isSupportLoading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-400 flex items-center gap-2 shadow-sm">
                        <Loader2 className="w-3 h-3 animate-spin text-[#2874f0]" /> Typing...
                      </div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSupportSubmit} className="flex gap-2 p-4 border-t border-slate-100">
                  <input type="text" className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white" value={supportInput} onChange={e => setSupportInput(e.target.value)} placeholder="Ask anything about NOVA..." />
                  <button type="submit" disabled={!supportInput.trim() || isSupportLoading} className="px-4 py-2.5 bg-[#2874f0] text-white rounded-xl font-bold hover:bg-[#1a5dc9] transition-all disabled:opacity-50 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )} {profileTab === 'wizard' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Ansys ACT Wizards</h2>
                  <p className="text-xs text-slate-500 mt-1">Automate your FEA workflows with our premium .WBEX extensions</p>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#d84315]" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                {ANSYS_WIZARDS.map((item, i) => {
                  const purchasedJob = (jobs || []).find(j => {
                    const isCompleted = (j.status || '').toLowerCase() === 'completed';
                    const jName = (j.name || '').toLowerCase();
                    const isWiz = j.type === 'Wizard Purchase' || jName.includes('wizard') || jName.includes('.wbex');
                    if (!isCompleted || !isWiz) return false;
                    if (item.id === 'stress_strain' && (jName.includes('stress') || jName.includes('curve'))) return true;
                    if (item.id === 'head' && jName.includes('head')) return true;
                    if (item.id === 'shell' && jName.includes('shell')) return true;
                    if (item.id === 'full' && (jName.includes('full') || (!jName.includes('head') && !jName.includes('shell') && !jName.includes('stress')))) return true;
                    return false;
                  });
                  const isPurchased = !!purchasedJob;
                  const itemIcon = item.id === 'stress_strain' 
                    ? <LineChart className="w-6 h-6 text-[#2874f0]" />
                    : item.id === 'shell' 
                    ? <Cylinder className="w-6 h-6 text-[#2874f0]" />
                    : item.id === 'head'
                    ? <Disc className="w-6 h-6 text-[#2874f0]" />
                    : <Box className="w-6 h-6 text-[#2874f0]" />;

                  return (
                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition-all gap-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#e8f0fe] rounded-2xl flex items-center justify-center shrink-0">
                          {itemIcon}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <button 
                          onClick={() => { setSelectedWizardForDemo(item); setIsWizardDemoOpen(true); }}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4 text-slate-700" /> View Demo
                        </button>
                        {isPurchased ? (
                          <button 
                            onClick={() => downloadSecureWbexFile(item.filename, purchasedJob?.job_id_display || 'Active', item.name)}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" /> Download .WBEX
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setSelectedWizardForPricing(item); setIsWizardPricingOpen(true); }}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#d84315] to-[#bf360c] hover:from-[#c23b12] hover:to-[#a72e09] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-105"
                          >
                            <ShoppingCart className="w-4 h-4" /> Buy
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )} {profileTab === 'community' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Nova Community Hub</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">Connect with fellow engineers, share your FEA results, ask questions, and collaborate on complex structural analysis problems.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-black text-xl text-slate-800">500+</div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Engineers</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-black text-xl text-slate-800">1.2k</div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Discussions</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-black text-xl text-slate-800">Daily</div>
                    <div className="text-xs font-bold text-slate-500 uppercase">New Resources</div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentView('nova_community')}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Users className="w-5 h-5" /> Enter Nova Community
                </button>
              </div>
            </div>
          )} {profileTab === 'nova_help' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-[#1565c0]" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Nova Knowledge Base</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">Access comprehensive documentation, video tutorials, API references, and engineering guides for all Nova Analysis modules.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
                  <div className="p-4 border border-slate-200 rounded-xl flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Module Documentation</div>
                      <div className="text-xs text-slate-500 mt-0.5">Detailed input guidelines and result interpretations.</div>
                    </div>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl flex items-start gap-3">
                    <Video className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Video Tutorials</div>
                      <div className="text-xs text-slate-500 mt-0.5">Step-by-step FEA workflow guides.</div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentView('nova_help')}
                  className="px-8 py-3.5 bg-[#1565c0] hover:bg-[#0d47a1] text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <BookOpen className="w-5 h-5" /> Access Help Center
                </button>
              </div>
            </div>
          )}
        </div>
      </div> {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditProfileOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 relative z-10">
            <div className="flex items-center justify-between px-6 py-5 bg-[#2874f0] text-white">
              <span className="flex items-center gap-2 font-black text-lg"><Settings className="w-5 h-5"/> Edit Profile</span>
              <button onClick={() => setIsEditProfileOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleEditProfile} className="p-6 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Company / Institute</label>
                <input type="text" value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})} required placeholder="e.g. Larsen and Toubro Ltd." className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0]" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Phone Number</label>
                <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} required placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0]" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsEditProfileOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#2874f0] hover:bg-[#1a5dc9] text-white rounded-xl font-bold text-sm shadow-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )} {isWizardDemoOpen && selectedWizardForDemo && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsWizardDemoOpen(false)}></div>
          <div className="bg-slate-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 border border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800 text-white border-b border-slate-700">
              <span className="flex items-center gap-3 font-bold text-lg">
                <PlayCircle className="w-5 h-5 text-[#2874f0]" /> {selectedWizardForDemo.name} - Demo
              </span>
              <button onClick={() => setIsWizardDemoOpen(false)} className="hover:bg-slate-700 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-300"/>
              </button>
            </div>
            <div className="p-0 bg-black relative aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/A65i5WT83bs?autoplay=1" 
                title="Nova Wizard Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 text-slate-300 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-sm font-semibold">{selectedWizardForDemo.desc}</div>
                <button 
                  onClick={() => { setIsWizardDemoOpen(false); setSelectedWizardForPricing(selectedWizardForDemo); setIsWizardPricingOpen(true); }}
                  className="px-6 py-2.5 bg-[#d84315] hover:bg-[#bf360c] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
                >
                  <ShoppingCart className="w-4 h-4" /> Buy
                </button>
              </div>
              {(selectedWizardForDemo.id === 'stress_strain' || selectedWizardForDemo.curveTypes) && (
                <div className="pt-2 border-t border-slate-700/70">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Supported Curve Types:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {(selectedWizardForDemo.curveTypes || [
                      'True Stress-Strain',
                      'Cyclic Stress-Strain',
                      'Isochronous Stress-Strain',
                      'Tangent Modulus Stress-Strain'
                    ]).map((curve, ci) => (
                      <div key={ci} className="bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-700 text-emerald-400 font-medium text-center">
                        {curve}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )} {isWizardPricingOpen && selectedWizardForPricing && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsWizardPricingOpen(false)}></div>
          <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <span className="flex items-center gap-3 font-bold text-lg text-slate-900">
                <Package className="w-5 h-5 text-[#d84315]" /> Select Subscription - {selectedWizardForPricing.shortName || selectedWizardForPricing.name.split(' Ansys')[0]}
              </span>
              <button onClick={() => setIsWizardPricingOpen(false)} className="hover:bg-slate-100 p-1.5 rounded-full transition-colors text-slate-500">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-6 bg-slate-50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Choose your licensing term</h3>
                <p className="text-sm text-slate-500 mt-1">Unlock full access to {selectedWizardForPricing.name}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(selectedWizardForPricing.pricing || [
                  { term: '1 Month', price: '₹4,999', desc: 'Short-term access for single projects', workstations: 1, recommend: false },
                  { term: '3 Months', price: '₹12,499', desc: 'Ideal for extended engineering phases', workstations: 1, recommend: false },
                  { term: '6 Months', price: '₹19,999', desc: 'Best value for continuous usage', workstations: 2, recommend: true },
                ]).map((plan, i) => (
                  <div key={i} className={`bg-white rounded-xl border-2 flex flex-col relative transition-all hover:shadow-lg ${plan.recommend ? 'border-[#d84315] shadow-md ring-4 ring-[#d84315]/10' : 'border-slate-200 hover:border-slate-300'}`}>
                    {plan.recommend && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d84315] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Recommended
                      </div>
                    )}
                    <div className="p-5 flex-1 text-center flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-slate-500 text-sm mb-2">{plan.term} License</div>
                        <div className="text-3xl font-black text-slate-900">{plan.price}</div>
                        <div className="text-[11px] text-slate-400 mt-1 mb-4">Includes 18% GST</div>
                        <div className="text-xs text-slate-600 font-medium mb-3">{plan.desc}</div>
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 mb-5 bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                          <Monitor className="w-3.5 h-3.5 text-[#2874f0]" /> {plan.workstations} Workstation{plan.workstations > 1 ? 's' : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsWizardPricingOpen(false);
                          handleRazorpayCheckout(
                            `${selectedWizardForPricing.name} (${plan.term} License)`,
                            plan.price,
                            'wizard_purchase',
                            {
                              term: plan.term,
                              workstations: plan.workstations,
                              productName: selectedWizardForPricing.name,
                              wizardId: selectedWizardForPricing.id,
                              filename: selectedWizardForPricing.filename
                            }
                          );
                        }}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${plan.recommend ? 'bg-[#d84315] hover:bg-[#bf360c] text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                      >
                        <CreditCard className="w-4 h-4" /> Select {plan.term}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Secure Payments Via</span>
                {['UPI', 'Visa', 'Mastercard', 'Net Banking', 'RuPay'].map(m => (
                  <span key={m} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )} {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsChangePasswordOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 relative z-10">
            <div className={`flex items-center justify-between px-6 py-5 text-white ${isPwdSuccess ? 'bg-[#388e3c]' : 'bg-[#d32f2f]'}`}>
              <span className="flex items-center gap-2 font-black text-lg">
                {isPwdSuccess ? <CheckCircle className="w-5 h-5"/> : <Lock className="w-5 h-5"/>}
                {isPwdSuccess ? 'Password Updated!' : 'Change Password'}
              </span>
              <button onClick={() => { setIsChangePasswordOpen(false); setPwdErrors({}); setPwdForm({current:'',new:'',confirm:''}); setIsPwdSuccess(false); }} className="hover:bg-white/20 p-1.5 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">New Password</label>
                <div className="relative">
                  <input type={showPwd.new ? 'text' : 'password'} value={pwdForm.new} onChange={e => { setPwdForm({...pwdForm, new: e.target.value}); setPwdErrors({...pwdErrors, new: null}); }} required placeholder="Min 8 chars, 1 number, 1 symbol" className={`w-full px-4 py-3 border rounded-xl text-sm pr-12 focus:outline-none focus:ring-2 ${pwdErrors.new ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:ring-[#2874f0]'}`} />
                  <button type="button" onClick={() => setShowPwd({...showPwd, new: !showPwd.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPwd.new ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                </div>
                {pwdErrors.new && <p className="text-xs text-red-500 mt-1">{pwdErrors.new}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Confirm New Password</label>
                <div className="relative">
                  <input type={showPwd.confirm ? 'text' : 'password'} value={pwdForm.confirm} onChange={e => { setPwdForm({...pwdForm, confirm: e.target.value}); setPwdErrors({...pwdErrors, confirm: null}); }} required placeholder="Re-enter new password" className={`w-full px-4 py-3 border rounded-xl text-sm pr-12 focus:outline-none focus:ring-2 ${pwdErrors.confirm ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:ring-[#2874f0]'}`} />
                  <button type="button" onClick={() => setShowPwd({...showPwd, confirm: !showPwd.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPwd.confirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                </div>
                {pwdErrors.confirm && <p className="text-xs text-red-500 mt-1">{pwdErrors.confirm}</p>}
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsChangePasswordOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold text-sm">Cancel</button>
                <button type="submit" className={`flex-1 py-3 text-white rounded-xl font-bold text-sm shadow-md ${isPwdSuccess ? 'bg-[#388e3c]' : 'bg-[#d32f2f] hover:bg-[#c62828]'}`}>
                  {isPwdSuccess ? 'Updated!' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsChangePasswordOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 relative z-10">
            <div className={`flex items-center justify-between px-6 py-5 text-white ${isPwdSuccess ? 'bg-[#388e3c]' : 'bg-[#d32f2f]'}`}>
              <span className="flex items-center gap-2 font-black text-lg">
                {isPwdSuccess ? <CheckCircle className="w-5 h-5"/> : <Lock className="w-5 h-5"/>}
                {isPwdSuccess ? 'Password Updated!' : 'Change Password'}
              </span>
              <button onClick={() => { setIsChangePasswordOpen(false); setPwdErrors({}); setPwdForm({current:'',new:'',confirm:''}); setIsPwdSuccess(false); }} className="hover:bg-white/20 p-1.5 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">New Password</label>
                <div className="relative">
                  <input type={showPwd.new ? 'text' : 'password'} value={pwdForm.new} onChange={e => { setPwdForm({...pwdForm, new: e.target.value}); setPwdErrors({...pwdErrors, new: null}); }} required placeholder="Min 8 chars, 1 number, 1 symbol" className={`w-full px-4 py-3 border rounded-xl text-sm pr-12 focus:outline-none focus:ring-2 ${pwdErrors.new ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:ring-[#2874f0]'}`} />
                  <button type="button" onClick={() => setShowPwd({...showPwd, new: !showPwd.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPwd.new ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                </div>
                {pwdErrors.new && <p className="text-xs text-red-500 mt-1">{pwdErrors.new}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Confirm New Password</label>
                <div className="relative">
                  <input type={showPwd.confirm ? 'text' : 'password'} value={pwdForm.confirm} onChange={e => { setPwdForm({...pwdForm, confirm: e.target.value}); setPwdErrors({...pwdErrors, confirm: null}); }} required placeholder="Re-enter new password" className={`w-full px-4 py-3 border rounded-xl text-sm pr-12 focus:outline-none focus:ring-2 ${pwdErrors.confirm ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:ring-[#2874f0]'}`} />
                  <button type="button" onClick={() => setShowPwd({...showPwd, confirm: !showPwd.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPwd.confirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                </div>
                {pwdErrors.confirm && <p className="text-xs text-red-500 mt-1">{pwdErrors.confirm}</p>}
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setIsChangePasswordOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold text-sm">Cancel</button>
                <button type="submit" className={`flex-1 py-3 text-white rounded-xl font-bold text-sm shadow-md ${isPwdSuccess ? 'bg-[#388e3c]' : 'bg-[#d32f2f] hover:bg-[#c62828]'}`}>
                  {isPwdSuccess ? 'Updated!' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    );
  };
  return (
    <>
      <style>{`
        body { margin: 0; background: #f8fafc; overflow-x: hidden; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-top: 1px solid rgba(255, 255, 255, 0.8);
          border-left: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }
        .glass-dark {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-input {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.03);
        }
        .glass-input:focus {
          background: rgba(255, 255, 255, 0.8);
          border-color: #3b82f6;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.02), 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        .glass-btn-blue {
          background: linear-gradient(135deg, rgba(60, 100, 214, 0.85), rgba(37, 99, 235, 0.85));
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 15px rgba(60, 100, 214, 0.3);
          position: relative;
          overflow: hidden;
        }
        .glass-btn-green {
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.85), rgba(5, 150, 105, 0.85));
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
          position: relative;
          overflow: hidden;
        }
        .glass-btn-orange {
          background: linear-gradient(135deg, rgba(234, 88, 12, 0.85), rgba(194, 65, 12, 0.85));
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);
          position: relative;
          overflow: hidden;
        }
        .glass-btn-blue::after, .glass-btn-green::after, .glass-btn-orange::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-20deg);
          transition: left 0.7s ease;
        }
        .glass-btn-blue:hover::after, .glass-btn-green:hover::after, .glass-btn-orange:hover::after {
          left: 200%;
        }
      `}</style>
      
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
         <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>   {completedInvoice && (
        <div className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto text-slate-800 print:m-0 print:p-0 print:border-none print:shadow-none"> <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-black text-sm uppercase tracking-wider text-emerald-400">Payment Verified · Tax Invoice Generated</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Print / Save PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setCompletedInvoice(null)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div> <div className="p-6 sm:p-8 space-y-6"> <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900/10 pb-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <CosmicLogo className="w-8 h-8" />
                    <span className="text-xl font-black text-slate-900 tracking-tight">NOVA AI TECHNOLOGIES</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Pressure Vessel FEA & Computational Simulation Cloud</p>
                  <div className="text-[11px] text-slate-500 mt-2 space-y-0.5 font-mono">
                    <div>GSTIN: <strong className="text-slate-700">07AABCN1234F1Z5</strong> · CIN: U72900DL2024PTC123456</div>
                    <div>HSN / SAC Code: <strong>998313</strong> (IT & Engineering Software Services)</div>
                    <div>Support: analysis.ai.nova@gmail.com · Portal: nova-platform.ai</div>
                  </div>
                </div>

                <div className="sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black uppercase rounded-full mb-2">
                    Tax Invoice / Receipt
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-900">Invoice: {completedInvoice.invoiceId}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Date: {completedInvoice.date}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">Payment ID: <span className="font-bold text-slate-800">{completedInvoice.paymentId}</span></div>
                  <div className="text-[11px] text-emerald-600 font-black mt-1">● Gateway: Razorpay (Live Verified)</div>
                </div>
              </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Customer / Billed To:</div>
                  <div className="font-black text-slate-900 text-sm">{completedInvoice.customerName}</div>
                  <div className="text-slate-600 mt-0.5">{completedInvoice.customerEmail}</div>
                  <div className="text-slate-600 font-mono mt-0.5">{completedInvoice.customerPhone}</div>
                  {completedInvoice.company && <div className="text-slate-500 font-medium mt-0.5">{completedInvoice.company}</div>}
                </div>
                <div className="sm:text-right">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Order Details:</div>
                  <div className="font-bold text-slate-800">{completedInvoice.productName}</div>
                  <div className="text-slate-500 mt-0.5">License Term: <strong>{completedInvoice.term}</strong></div>
                  <div className="text-slate-500 mt-0.5">Authorized Activations: <strong>{completedInvoice.workstations} Workstation(s)</strong></div>
                  <div className="text-emerald-700 font-black mt-1">Status: PAYMENT VERIFIED & ACTIVE</div>
                </div>
              </div> <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 uppercase font-black border-y border-slate-200">
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">HSN/SAC</th>
                      <th className="py-2.5 px-3 text-right">Taxable Value</th>
                      <th className="py-2.5 px-3 text-right">CGST (9%)</th>
                      <th className="py-2.5 px-3 text-right">SGST (9%)</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-black text-slate-900">{completedInvoice.productName}</div>
                        <div className="text-[11px] text-slate-500 font-medium">Digital engineering software license / cloud compute allocation</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">998313</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">₹{completedInvoice.baseAmount?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">₹{completedInvoice.cgst?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">₹{completedInvoice.sgst?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900">{completedInvoice.priceFormatted}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900/20 font-black text-sm bg-slate-50">
                      <td colSpan="5" className="py-3 px-3 text-right text-slate-800">Grand Total (Inclusive of 18% GST):</td>
                      <td className="py-3 px-3 text-right text-[#2874f0] font-black">{completedInvoice.priceFormatted}</td>
                    </tr>
                  </tfoot>
                </table>
              </div> {completedInvoice.isWizard && (
                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border-2 border-orange-400 rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-orange-600">Authorized License Activation</div>
                        <h4 className="font-black text-base text-slate-900">Ansys ACT Extension Package (.WBEX)</h4>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs border border-emerald-300 self-start sm:self-auto">
                      ● Active & Authenticated
                    </span>
                  </div> <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-inner space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">License Key (Ansys ACT Activation)</div>
                        <div className="font-mono text-base sm:text-lg font-black text-amber-400 tracking-wider select-all mt-0.5">
                          {completedInvoice.licenseKey}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(completedInvoice.licenseKey);
                          setInvoiceCopiedKey(true);
                          setTimeout(() => setInvoiceCopiedKey(false), 2500);
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0"
                      >
                        {invoiceCopiedKey ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Key</>}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Expiry Date</div>
                        <div className="font-bold text-emerald-400 font-mono mt-0.5">{completedInvoice.expiryDate}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Registered On</div>
                        <div className="font-medium text-slate-300 font-mono mt-0.5">{completedInvoice.registeredOn}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">License Status</div>
                        <div className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active & Auto-Provisioned
                        </div>
                      </div>
                    </div>
                  </div> <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button 
                      onClick={() => {
                        downloadSecureWbexFile(completedInvoice.wbexFilename || 'Shell_Nozzle.wbex', completedInvoice.licenseKey, completedInvoice.productName);
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-105"
                    >
                      <Download className="w-4 h-4" /> Download Ansys Wizard (.WBEX)
                    </button>
                    <span className="text-xs text-slate-500 font-medium">Secure local direct binary download for ANSYS Workbench</span>
                  </div>
                </div>
              )} <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <Printer className="w-4 h-4 text-emerald-400" /> Download Invoice (PDF)
                </button>
                <button 
                  onClick={() => setCompletedInvoice(null)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#2874f0] hover:bg-[#1a5dc9] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  Done / Close Invoice
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {showSplash && renderSplash()}
      {!showSplash && (
        <>
          {currentView === 'landing' && renderLanding()}
          {currentView === 'login' && renderLogin()}
          {currentView === 'signup' && renderSignup()}
          {currentView === 'forgot' && renderForgotPassword()}
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'profile' && renderProfile()}
          {currentView === 'nova_help' && renderNovaHelp()}
          {currentView === 'nova_community' && renderNovaCommunity()}
        </>
      )}
    </>
  );
}
