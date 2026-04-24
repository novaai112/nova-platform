import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { supabaseJob } from './supabaseClient';
import { 
  ChevronDown, AlertTriangle, Lock, User, CheckCircle, Loader2, X, Plus, FileText, 
  Settings, Bot, Send, ArrowRight, Check, FileCheck, Clock, Shield, Settings2, 
  BookOpen, Shapes, GitMerge, Database, Brain, UploadCloud, Cpu, Box, Award, 
  Download, PlayCircle, Menu, XCircle, Mail, Sparkles, Eye, EyeOff, Flame
} from 'lucide-react';
import emailjs from '@emailjs/browser';

const CosmicLogo = ({ className = "w-10 h-10" }) => (
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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); 
  const [currentView, setCurrentView] = useState('landing'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileTab, setProfileTab] = useState('info'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState({
    id: null, name: "", email: "", initial: "", avatar: null, company: "", phone: "", joined: ""
  });
  
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

  const [showMaterialConsultant, setShowMaterialConsultant] = useState(false);
  const [materialPrompt, setMaterialPrompt] = useState("");
  const [materialResponse, setMaterialResponse] = useState("");
  const [isMaterialLoading, setIsMaterialLoading] = useState(false);

  // AUTH INITIALIZATION & REFRESH LOGIC
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

  // ROUTE GUARD
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoggedIn) {
        fetchJobs();
        if (!currentUser.isApproved) {
          checkApprovalStatus();
        }
      }
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [isLoggedIn, currentUser.isApproved]);

  const setupUser = (user) => {
      const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
      const isApprovedStatus = user.user_metadata?.is_approved === true || user.email === 'analysis.ai.nova@gmail.com';
      
      setCurrentUser({
        id: user.id,
        name: fullName,
        email: user.email,
        initial: fullName.charAt(0).toUpperCase(),
        avatar: user.user_metadata?.avatar_url || null, 
        company: user.user_metadata?.company || "Not Provided",
        phone: user.user_metadata?.phone || "Not Provided",
        joined: new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        isApproved: isApprovedStatus
      });
      
      localStorage.setItem('nova_user', JSON.stringify({ id: user.id, email: user.email }));
      setIsLoggedIn(true);
    };

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (!error && data) setJobs(data);
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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); 
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
    const systemInstruction = "You are an expert mechanical engineering AI assistant for NOVA. Recommend Nozzle, Bellow, or Local PWHT analysis based on scenario. Format with bullet points.";
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
    const systemInstruction = "You are the helpful AI support agent for the NOVA engineering platform. Pricing: Nozzle is ₹6,000+GST, Bellow is ₹48,000+GST.";
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
        price: selectedJobType === 'Nozzle Analysis' ? 6000 : selectedJobType === 'Bellow Analysis' ? 48000 : 15000 
      };

      try {
        const { data: insertedJob, error } = await supabase
          .from('jobs')
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
      if (jobFilter === 'Local PWHT') return j.type.includes('PWHT');
      return j.type === jobFilter;
    });

  const stats = {
    total: filteredJobs.length,
    completed: filteredJobs.filter(j => j.status === 'Completed').length,
    processing: filteredJobs.filter(j => j.status === 'Processing').length,
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
      
      <div className="glass-panel-splash relative flex flex-col items-center justify-center p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(60,100,214,0.3)]">
        <svg className="w-32 h-32 mb-6 drop-shadow-2xl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <h1 className="mb-2 text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 drop-shadow-lg">NOVA</h1>
          <p className="text-sm font-medium tracking-widest uppercase text-slate-300">Initializing Platform</p>
        </div>
        
        <div className="w-48 h-1 mt-8 overflow-hidden rounded-full text-reveal bg-white/10">
           <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full relative" style={{animation: 'loadProgress 2s ease-out infinite'}}></div>
        </div>
      </div>
    </div>
  );

  const renderLanding = () => (
    <div className="relative min-h-screen pt-20 overflow-x-hidden font-sans text-slate-800 scroll-smooth">
      <section className="relative max-w-5xl px-6 pt-16 pb-20 mx-auto text-center">
        <div className="relative z-10 transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sm font-semibold text-slate-700 mb-8">
            <Cpu className="w-4 h-4 text-[#3C64D6] animate-pulse" /> Advanced AI-Driven FEA Automation
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#1E293B] to-[#3C64D6] tracking-tight mb-8 drop-shadow-sm">NOVA</h1>
          
          <div className="flex flex-col items-center justify-center gap-4 mb-12 sm:flex-row sm:gap-6">
            <div className="glass-panel px-6 py-4 rounded-xl flex items-center gap-3 w-full sm:w-auto hover:shadow-[0_8px_32px_rgba(60,100,214,0.2)] transition-shadow">
               <FileText className="w-6 h-6 text-blue-500" />
               <span className="text-lg font-bold text-slate-800">Input Parameters</span>
            </div>
            <ArrowRight className="w-8 h-8 text-[#3C64D6] hidden sm:block animate-[pulse_2s_ease-in-out_infinite]" />
            <div className="glass-panel px-6 py-4 rounded-xl flex items-center gap-3 w-full sm:w-auto hover:shadow-[0_8px_32px_rgba(16,163,74,0.2)] transition-shadow">
               <FileCheck className="w-6 h-6 text-emerald-500" />
               <span className="text-lg font-bold text-slate-800">FE Report</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#3C64D6] mb-6">Automated FEA. Zero Manual Setup.</h2>
          <p className="max-w-2xl mx-auto mb-6 text-lg font-medium text-slate-700">Input your design specifications. Receive a fully code-compliant FEA stress report in record time directly from the cloud.</p>
          
          <div className="mb-12 text-sm font-semibold text-slate-600">
             Eliminate the bottlenecks: <span className="font-normal text-slate-500">Manual Meshing | Tedious Modeling | Repetitive Iterations | Report Drafting</span>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
             <button onClick={handleRouteToAuth} className="relative flex items-center justify-center gap-2 px-8 py-4 overflow-hidden font-bold text-white transition-all duration-300 rounded-full glass-btn-blue hover:scale-105 group">
                <Shield className="relative z-10 w-5 h-5" /> <span className="relative z-10">Start Analysis</span>
             </button>
             <button onClick={() => scrollToSection('how-it-works')} className="px-8 py-4 font-bold transition-colors border rounded-full shadow-sm bg-white/50 backdrop-blur-md border-white/50 hover:bg-white/80 text-slate-800">
                See How It Works ↓
             </button>
          </div>
        </div>
      </section>

      <section id="solution" className="relative z-10 px-6 py-24">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-5xl mx-auto transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
          <div className="mb-16 text-center">
            <span className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm text-[#3C64D6] px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase">Solutions</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E293B] mt-6 drop-shadow-sm">Engineering Components</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
             <div className="glass-card glass-card-hover rounded-[2.5rem] p-10 flex flex-col h-full relative group">
                <div className="absolute top-0 right-0 w-40 h-40 transition-transform duration-700 rounded-bl-full bg-blue-400/20 filter blur-xl -z-10 group-hover:scale-125"></div>
                
                <div className="flex items-center self-start gap-1 px-3 py-1 mb-8 text-xs font-bold border rounded-full shadow-sm bg-emerald-500/20 border-emerald-500/30 text-emerald-700 backdrop-blur-sm">
                   <CheckCircle className="w-3 h-3" /> Available Now
                </div>
                
                <div className="glass-icon-container w-20 h-20 rounded-[1.25rem] flex items-center justify-center mb-6">
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
                
                <h3 className="text-2xl font-bold text-[#1E293B] mb-2 drop-shadow-sm">Advanced Bellows FEA</h3>
                <p className="mb-8 text-sm font-medium text-slate-600">Thick Convolute (Flanged & Flued)</p>
                
                <div className="space-y-4 mb-8 flex-1 bg-white/40 border border-white/50 p-6 rounded-2xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.7)] backdrop-blur-sm">
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
                
                <div className="flex items-center self-start gap-1 px-3 py-1 mb-8 text-xs font-bold border rounded-full shadow-sm bg-amber-500/20 border-amber-500/30 text-amber-700 backdrop-blur-sm">
                   <Clock className="w-3 h-3" /> In Development
                </div>
                
                <div className="glass-icon-container w-20 h-20 rounded-[1.25rem] flex items-center justify-center mb-6 opacity-80 mix-blend-luminosity">
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
                
                <h3 className="mb-2 text-2xl font-bold text-slate-700 drop-shadow-sm">Nozzle Junction Stress Analysis</h3>
                <p className="mb-8 text-sm font-medium text-slate-500">Local Load Analysis for Vessels</p>
                
                <div className="flex-1 p-6 mb-8 space-y-4 border bg-white/20 border-white/30 rounded-2xl">
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

      <section id="why-nova" className="py-24 bg-white/40 backdrop-blur-md px-6 border-y border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
        <div className="max-w-5xl mx-auto transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
          <div className="mb-16 text-center">
            <span className="px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full glass-panel text-slate-700">About</span>
            <h2 className="text-4xl font-extrabold text-[#1E293B] mt-6 drop-shadow-sm">What is NOVA?</h2>
          </div>

          <div className="grid items-center grid-cols-1 gap-16 md:grid-cols-2">
             <div className="space-y-6">
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center text-2xl font-bold text-white transition-transform shadow-md w-14 h-14 glass-btn-blue rounded-2xl group-hover:scale-110">N</div>
                  <div className="text-xl font-extrabold tracking-wide text-slate-700 drop-shadow-sm">Numerical</div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center text-2xl font-bold text-white transition-transform shadow-md w-14 h-14 glass-btn-blue rounded-2xl group-hover:scale-110">O</div>
                  <div className="text-xl font-extrabold tracking-wide text-slate-700 drop-shadow-sm">Optimization &</div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center text-2xl font-bold text-white transition-transform shadow-md w-14 h-14 glass-btn-blue rounded-2xl group-hover:scale-110">V</div>
                  <div className="text-xl font-extrabold tracking-wide text-slate-700 drop-shadow-sm">Virtual</div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="flex items-center justify-center text-2xl font-bold text-white transition-transform shadow-md w-14 h-14 glass-btn-blue rounded-2xl group-hover:scale-110">A</div>
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

      <section id="how-it-works" className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto text-center transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
          <span className="px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full glass-panel text-slate-700">Methodology</span>
          <h2 className="text-4xl font-extrabold text-[#1E293B] mt-6 mb-4 drop-shadow-sm">How NOVA Works</h2>
          <p className="mb-20 text-lg font-medium text-slate-600">A streamlined 6-step workflow that transforms your engineering data into a compliant FE report</p>

          <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row md:items-start md:gap-4">
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
                     <div className="relative flex items-center justify-center w-20 h-20 mb-6 transition-all duration-300 shadow-md glass-panel group-hover:bg-white/60 rounded-2xl group-hover:-translate-y-2">
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

      <section className="relative z-10 px-6 py-24 text-center transition-all duration-700 ease-out translate-y-10 opacity-0 reveal">
         <div className="glass-panel max-w-4xl mx-auto rounded-[3rem] p-16 relative overflow-hidden shadow-[0_20px_60px_rgba(60,100,214,0.15)]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full filter blur-[80px] -z-10"></div>
           <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-6 relative z-10">Start Your Analysis Today</h2>
           <p className="relative z-10 mb-10 text-lg font-medium text-slate-600">From Days to Hours. Code-Compliant. Fully Automated.</p>
           <button onClick={handleRouteToAuth} className="relative z-10 flex items-center justify-center gap-3 px-10 py-5 mx-auto text-lg font-bold transition-all rounded-full glass-btn-blue hover:scale-105">
             Access Dashboard <ArrowRight className="w-6 h-6" />
           </button>
         </div>
      </section>

      <footer className="glass-panel text-slate-600 py-12 px-6 relative z-10 mt-12 border-b-0 rounded-t-[3rem] shadow-[0_-8px_32px_rgba(31,38,135,0.05)]">
        <div className="grid max-w-6xl grid-cols-1 gap-8 pb-8 mx-auto mb-8 border-b md:grid-cols-3 border-slate-300/50">
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
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-xl text-white font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md border border-white/20 ${notification.type === 'success' ? 'bg-emerald-600/90' : notification.type === 'info' ? 'bg-blue-600/90' : 'bg-slate-800/90'}`}>
           <CheckCircle className="w-5 h-5" /> {notification.message}
        </div>
      )}
      <button onClick={() => setCurrentView('landing')} className="absolute top-6 left-6 glass-panel px-4 py-2 rounded-full text-slate-700 hover:text-[#3C64D6] flex items-center gap-2 font-semibold transition-colors">
        <ArrowRight className="w-4 h-4 rotate-180" /> Home
      </button>
      
      <div className="max-w-md w-full glass-panel rounded-[2.5rem] shadow-[0_20px_60px_rgba(31,38,135,0.15)] p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full filter blur-[40px]"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/30 rounded-full filter blur-[40px]"></div>
        
        <div className="relative z-10 mb-8 space-y-2 text-center">
          <div className="flex justify-center mb-4 cursor-pointer" onClick={handleLogoClick}>
             <CosmicLogo className="w-20 h-20 transition-transform duration-500 hover:scale-110 drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">NOVA 1.0</h1>
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
      <div className="mt-8 text-sm font-medium text-center text-slate-600">
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
      <div className="mt-8 text-sm font-medium text-center text-slate-600">
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
            <input type="text" maxLength="6" placeholder="••••••" value={forgotCode} onChange={(e) => { setForgotCode(e.target.value.replace(/\D/g, '')); setForgotErrors({...forgotErrors, code: null}); }} className={`w-full px-4 py-4 glass-input rounded-xl text-center text-3xl tracking-[0.5em] font-extrabold text-[#3C64D6] ${forgotErrors.code ? '!border-red-500' : ''}`} required />
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

      <div className="mt-8 text-sm font-medium text-center text-slate-600">
         Remember your password? <button onClick={() => setCurrentView('login')} className="text-[#3C64D6] font-bold hover:underline ml-1">Sign in</button>
      </div>
    </>
  );

  const renderInsightsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsInsightsOpen(false)}></div>
      <div className="glass-panel w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative z-10 border-t border-l border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-in zoom-in-95">
        <div className="flex items-center justify-between p-6 text-white border-b bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border-white/20">
          <h3 className="flex items-center gap-3 text-xl font-extrabold drop-shadow-sm">
            <Sparkles className="w-6 h-6" /> Executive Insights
          </h3>
          <button onClick={() => setIsInsightsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 space-y-6">
           <div className="mb-2">
              <h4 className="mb-1 text-sm font-bold tracking-widest uppercase text-slate-500">Project</h4>
              <p className="text-2xl font-extrabold text-slate-800">{selectedInsightJob?.name}</p>
              <span className="inline-block px-3 py-1 mt-2 text-xs font-bold text-blue-800 bg-blue-100 rounded-full">{selectedInsightJob?.type}</span>
           </div>
           <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)] min-h-[200px]">
              {isInsightLoading ? (
                 <div className="flex flex-col items-center justify-center h-full py-8 space-y-4 text-purple-600">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="text-sm font-bold animate-pulse">Analyzing FEA Results...</p>
                 </div>
              ) : (
                 <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-800">
                    {insightResponse}
                 </div>
              )}
           </div>
           <div className="flex justify-end mt-8">
             <button onClick={() => setIsInsightsOpen(false)} className="glass-btn-blue text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:scale-105 transition-transform">Close Insights</button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderJobDetailsModal = () => {
    if (!selectedJobDetails) return null;

    const geom = selectedJobDetails.geometry_data || {};
    const runs = Array.isArray(geom.runs) ? geom.runs : [];
    
    const upsetSelected = geom.upset_selected === 'Yes';
    
    const isManual = geom.inputMethod === 'manual' || (!geom.pdfName && !geom.pdfUrl && geom.inputMethod !== 'pdf');
    
    let hydroRun = {};
    let upsetCases = [];

    if (upsetSelected) {
        upsetCases = runs;
        hydroRun = { T_amb: runs.length > 0 ? runs[0].T_amb : undefined };
    } else {
        hydroRun = runs.length > 0 ? runs[0] : {};
    }

    const codeEdition = geom.ui_code_edition || '2025';
    
    const displayHydroP = geom.shellPressure ? `${geom.shellPressure} MPa` : (hydroRun.P !== undefined ? `${hydroRun.P} MPa` : 'N/A');
    const displayHydroT = geom.shellTemp ? `${geom.shellTemp} °C` : (hydroRun.T_amb !== undefined ? `${hydroRun.T_amb} °C` : 'N/A');

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Dark Backdrop */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsJobDetailsOpen(false)}></div>
        
        {/* Main Modal Container - White, rounded, scrollable */}
        <div className="bg-white w-full max-w-[500px] h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative z-10 animate-in zoom-in-95">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Job: {selectedJobDetails.job_id_display}</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
                {selectedJobDetails.type}
              </span>
            </div>
            <button onClick={() => setIsJobDetailsOpen(false)} className="flex items-center justify-center w-6 h-6 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            
            {/* Job Details Card */}
            <div className="overflow-hidden border border-blue-100 rounded-xl">
               <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 border-b border-blue-100">
                  <Box className="w-4 h-4"/> Job Details
               </div>
               <div className="grid grid-cols-2 p-4 text-xs gap-y-3">
                 <div className="font-bold text-slate-700">Job ID:</div>
                 <div className="font-semibold text-slate-600">{selectedJobDetails.job_id_display}</div>
                 <div className="font-bold text-slate-700">Date:</div>
                 <div className="font-semibold text-slate-600">{new Date(selectedJobDetails.created_at).toLocaleString()}</div>
                 <div className="font-bold text-slate-700">Type:</div>
                 <div className="flex items-center gap-1 font-bold text-blue-600">
                    <Box className="w-3 h-3"/> {selectedJobDetails.type}
                 </div>
               </div>
            </div>

            {/* Bellow Configuration Card */}
            <div className="overflow-hidden border border-blue-100 rounded-xl">
               <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 border-b border-blue-100">
                  <Settings2 className="w-4 h-4"/> Bellow Configuration
               </div>
               <div className="grid grid-cols-2 p-4 text-xs gap-y-3">
                 <div className="font-bold text-slate-700">Design Code:</div>
                 <div className="font-semibold text-slate-600">{codeEdition}</div>
                 <div className="font-bold text-slate-700">Bellow Variation:</div>
                 <div className="font-semibold text-slate-600">Flanged and Flued</div>
               </div>
            </div>

            {/* Hydrotest Parameters Card */}
            <div className="overflow-hidden border border-emerald-100 rounded-xl">
               <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 border-b border-emerald-100">
                  <Database className="w-4 h-4 text-purple-500"/> Hydrotest Parameters
               </div>
               <div className="grid grid-cols-2 p-4 text-xs gap-y-4">
                 <div className="font-bold text-slate-700">Shell<br/>Pressure:</div>
                 <div className="flex items-center font-bold text-slate-800">{displayHydroP}</div>
                 <div className="font-bold text-slate-700">Shell<br/>Temperature:</div>
                 <div className="flex items-center font-bold text-slate-800">{displayHydroT}</div>
                 <div className="font-bold text-slate-700">Additional<br/>Cases:</div>
                 <div className="flex items-center">
                   <span className={`px-2 py-0.5 text-white rounded-full font-bold text-[10px] ${upsetSelected ? 'bg-orange-500' : 'bg-slate-400'}`}>
                     {upsetSelected ? 'Yes' : 'No'}
                   </span>
                 </div>
               </div>
            </div>

            {/* Upset Cases Card (Only displays cases if available) */}
            {upsetSelected && (
              <div className="overflow-hidden border border-orange-100 rounded-xl">
                 <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-orange-700 bg-orange-50 border-b border-orange-100">
                    <Shapes className="w-4 h-4"/> Upset Cases ({upsetCases.length})
                 </div>
                 <div className="p-4 space-y-3 text-xs">
                   {upsetCases.length > 0 ? upsetCases.map((uc, idx) => (
                     <div key={idx} className="flex items-center justify-between pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                       <span className="font-bold text-slate-700">Case {idx + 1}:</span>
                       <span className="font-bold text-slate-800 w-16">{uc.P !== undefined ? `${uc.P} MPa` : 'N/A'}</span>
                       <span className="font-bold text-slate-800 w-16 text-right">{uc.T !== undefined ? `${uc.T} °C` : 'N/A'}</span>
                     </div>
                   )) : (
                     <div className="text-center font-medium text-slate-500">No Upset Cases Available</div>
                   )}
                 </div>
              </div>
            )}

            {/* PV Elite Report PDF Card (Hidden if manual) */}
            {!isManual && (
              <div className="overflow-hidden border border-blue-100 rounded-xl bg-blue-50/30">
                 <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-700 border-b border-blue-100">
                    <FileText className="w-4 h-4 text-amber-400"/> PV Elite Report PDF
                 </div>
                 <div className="grid grid-cols-[100px_1fr] p-4 text-xs gap-y-2">
                   <div className="font-bold text-slate-700">PDF Name:</div>
                   <div className="font-bold text-blue-600 truncate">
                     {geom.pdfUrl ? (
                       <a href={geom.pdfUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 w-max">
                         {geom.pdfName || 'PV_Elite_Report.pdf'} <Download className="w-3 h-3" />
                       </a>
                     ) : (
                       <span>{geom.pdfName || 'PV_Elite_Report.pdf'}</span>
                     )}
                   </div>
                   <div className="font-bold text-slate-700">File Size:</div>
                   <div className="font-semibold text-slate-600">{geom.pdfSize || 'N/A'}</div>
                 </div>
              </div>
            )}

            {/* Spring Rate Results Card */}
            <div className="overflow-hidden border border-emerald-200 rounded-xl bg-emerald-50/20">
               <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 border-b border-emerald-100">
                  <Award className="w-4 h-4"/> Spring Rate Results
               </div>
               <div className="p-4 space-y-3 text-xs">
                 <div className="grid grid-cols-[60px_1fr] gap-y-2">
                   <div className="font-bold text-slate-700">File:</div>
                   <div className="font-semibold text-emerald-700 break-all">
                     {selectedJobDetails.excel_file_url ? `${selectedJobDetails.job_id_display}_spring_rates.xlsx` : 'Processing...'}
                   </div>
                   <div className="font-bold text-slate-700">Status:</div>
                   <div className={`flex items-center gap-1 font-bold ${selectedJobDetails.excel_file_url ? 'text-emerald-600' : 'text-amber-500'}`}>
                     {selectedJobDetails.excel_file_url ? <CheckCircle className="w-3.5 h-3.5"/> : <Loader2 className="w-3.5 h-3.5 animate-spin"/>} 
                     {selectedJobDetails.excel_file_url ? 'Available' : 'Pending Calculation'}
                   </div>
                 </div>
                 {selectedJobDetails.excel_file_url ? (
                   <a href={selectedJobDetails.excel_file_url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 mt-2 text-xs font-bold text-white transition-colors bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                     <Download className="w-4 h-4"/> Download Spring Rate Results
                   </a>
                 ) : (
                   <button disabled className="w-full py-2.5 mt-2 text-xs font-bold text-slate-500 bg-slate-200 rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                     <Clock className="w-4 h-4"/> Awaiting Calculation
                   </button>
                 )}
               </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-center gap-3 p-4 bg-white border-t border-slate-100">
            <button 
              onClick={() => setIsJobDetailsOpen(false)} 
              className="px-6 py-2 text-sm font-bold text-blue-700 transition-colors bg-white border-2 border-blue-700 rounded-lg hover:bg-blue-50"
            >
              Close
            </button>
            <button 
              onClick={() => { 
                localStorage.setItem('nova_job_id', selectedJobDetails.id);
                window.location.href = '/bellow2.html'; 
              }}
              className="px-6 py-2 text-sm font-bold text-white transition-colors bg-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-700"
            >
              Continue to Step 2
            </button>
          </div>

        </div>
      </div>
    );
  };

  const DashboardHeader = ({ isProfile }) => (
    <div className="relative z-50 flex flex-col items-start justify-between p-6 mb-8 border-t shadow-md glass-panel text-slate-800 rounded-3xl md:flex-row md:items-center border-white/60">
      <div className="flex items-center gap-4">
        <div className="items-center justify-center hidden p-3 transition-all border shadow-sm cursor-pointer sm:flex bg-white/40 border-white/50 rounded-2xl hover:bg-white/60 hover:scale-105" onClick={handleLogoClick}>
          <CosmicLogo className="w-10 h-10" />
        </div>
        <div>
          {isProfile ? (
            <h1 className="text-2xl font-extrabold text-[#1E293B] drop-shadow-sm">About Me</h1>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-wide drop-shadow-sm">Welcome, {currentUser.name}!</h1>
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
        <button onClick={() => setCurrentView('dashboard')} className="glass-input hover:bg-white/70 text-slate-800 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors mt-4 md:mt-0 shadow-sm border-white/80">
          Back to Dashboard
        </button>
      ) : (
        <div className="relative mt-4 md:mt-0 z-[60]">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center p-2 pr-4 space-x-3 text-left transition-colors shadow-sm cursor-pointer glass-input hover:bg-white/70 rounded-2xl focus:outline-none border-white/80">
            <div className="bg-[#3C64D6] text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md overflow-hidden border border-white/20">
              {currentUser.avatar ? <img src={currentUser.avatar} alt="Profile" className="object-cover w-full h-full" /> : currentUser.initial}
            </div>
            <div className="hidden pr-2 sm:block">
              <div className="text-sm font-extrabold leading-tight text-slate-800">{currentUser.name}</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-600 hidden sm:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-xl py-2 z-[100] text-slate-800 animate-in fade-in slide-in-from-top-2 border-white/80">
              <button onClick={() => { setCurrentView('profile'); setProfileTab('info'); setIsDropdownOpen(false); }} className="flex items-center w-full px-5 py-3 text-sm font-bold text-left transition-colors hover:bg-white/60">
                <User className="w-4 h-4 mr-3 text-[#3C64D6]" /> My Profile
              </button>
              <div className="h-px mx-2 my-1 bg-slate-200/50"></div>
              <button onClick={handleLogout} className="flex items-center w-full px-5 py-3 text-sm font-bold text-left text-red-600 transition-colors hover:bg-red-50/50">
                <Lock className="w-4 h-4 mr-3 text-red-500" /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
      <div className="relative z-10 min-h-screen p-4 pt-24 font-sans text-slate-800 md:p-8">
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-xl text-white font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md border border-white/20 ${notification.type === 'success' ? 'bg-emerald-600/90' : notification.type === 'info' ? 'bg-blue-600/90' : 'bg-slate-800/90'}`}>
            <CheckCircle className="w-5 h-5 shrink-0" /> {notification.message}
          </div>
        )}

        <div className="max-w-[1200px] mx-auto">
          <DashboardHeader isProfile={false} />

          {!currentUser.isApproved && (
            <div className="bg-amber-100 border border-amber-300 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm max-w-[1000px] mx-auto">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 mt-1 text-amber-600 shrink-0 sm:mt-0" />
                <div>
                    <h4 className="text-lg font-extrabold text-amber-800">Account Verification Required</h4>
                </div>
              </div>
              
              <button 
                onClick={handleRequestAccess} 
                disabled={isRequestingAccess}
                className="flex items-center gap-2 px-6 py-3 font-bold text-white transition-colors shadow-md bg-amber-600 hover:bg-amber-700 rounded-xl whitespace-nowrap disabled:opacity-70"
              >
                {isRequestingAccess ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                {isRequestingAccess ? 'Sending...' : 'Request Access'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1100px] mx-auto mb-10">
            <div className="glass-panel border-emerald-500/20 bg-emerald-50/40 rounded-[2rem] p-8 text-center shadow-sm flex flex-col justify-center hover:shadow-[0_8px_32px_rgba(16,163,74,0.15)] transition-all">
              <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm">Nozzle Analysis</h3>
              {currentUser.isApproved ? (
                <button onClick={() => window.location.href = '/nozzle.html'} 
                  className="glass-btn-green w-full py-3.5 rounded-xl font-bold transition-transform hover:scale-105 shadow-md">
                  Submit New Job
                </button>
              ) : (
                <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Locked
                </button>
              )}
            </div>
            
            <div className="glass-panel border-blue-500/20 bg-blue-50/40 rounded-[2rem] p-8 text-center shadow-sm flex flex-col justify-center hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] transition-all">
              <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm">Bellow Analysis</h3>
              {currentUser.isApproved ? (
                <button 
                  onClick={() => window.location.href = '/bellow.html'} 
                  className="glass-btn-green w-full py-3.5 rounded-xl font-bold transition-transform hover:scale-105 shadow-md">
                  Submit New Job
              </button>
              ) : (
                <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Locked
                </button>
              )}
            </div>

            <div className="glass-panel border-orange-500/20 bg-orange-50/40 rounded-[2rem] p-8 text-center shadow-sm flex flex-col justify-center hover:shadow-[0_8px_32px_rgba(234,88,12,0.15)] transition-all">
              <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" /> Local PWHT
              </h3>
              {currentUser.isApproved ? (
                <button 
                  onClick={() => window.location.href = 'https://nova-analysis.vercel.app/pwht.html'} 
                  className="glass-btn-orange w-full py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-105 shadow-md">
                  Submit New Job
                </button>
              ) : (
                <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Locked
                </button>
              )}
            </div>
            
            <div className="glass-panel border-orange-500/20 bg-orange-50/40 rounded-[2rem] p-8 text-center shadow-sm flex flex-col justify-center hover:shadow-[0_8px_32px_rgba(234,88,12,0.15)] transition-all">
              <h3 className="mb-6 text-xl font-extrabold text-slate-800 drop-shadow-sm flex flex-col items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" /> ASME Plus
              </h3>
              {currentUser.isApproved ? (
                <button 
                  onClick={() => window.location.href = 'https://asme-material.vercel.app/'} 
                  className="glass-btn-orange w-full py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-105 shadow-md">
                  Add Material
                </button>
              ) : (
                <button disabled className="bg-slate-200 text-slate-500 w-full py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Locked
                </button>
              )}
            </div>
            

            <div className="glass-panel border-purple-500/20 bg-purple-50/40 rounded-[2rem] p-8 text-center shadow-sm flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)] transition-all">
              <div>
                <h3 className="flex items-center justify-center gap-2 mb-2 text-xl font-extrabold text-slate-800 drop-shadow-sm">
                  <Sparkles className="w-5 h-5 text-purple-600" /> AI Recommender
                </h3>
                <p className="mb-6 text-xs font-medium text-slate-600">Not sure which analysis to run? Describe your scenario.</p>
              </div>
              <button onClick={() => setIsAiModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-full py-3.5 rounded-xl font-bold transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                <Sparkles className="w-4 h-4" /> ✨ Smart Setup
              </button>
            </div>
          </div>

          

        <div className="glass-panel rounded-[2rem] p-8 shadow-sm mb-8">
          <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
            <h2 className="text-2xl font-extrabold text-slate-800 drop-shadow-sm">Your Job Summary</h2>
            <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className="glass-input text-[#3C64D6] text-sm rounded-xl px-5 py-2.5 outline-none font-bold cursor-pointer shadow-sm border-white/60 focus:ring-2 focus:ring-blue-500">
              <option value={`All Analysis (${jobs.length})`}>All Analysis ({jobs.length})</option>
              <option value="Nozzle Analysis">Nozzle Analysis</option>
              <option value="Bellow Analysis">Bellow Analysis</option>
              <option value="Local PWHT">Local PWHT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="p-5 text-center border shadow-sm bg-emerald-500/20 border-emerald-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-3xl font-extrabold text-emerald-800">{stats.total}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-700 opacity-90">Total</div>
            </div>
            <div className="p-5 text-center border shadow-sm bg-blue-500/20 border-blue-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-3xl font-extrabold text-blue-800">{stats.completed}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-blue-700 opacity-90">Completed</div>
            </div>
            <div className="p-5 text-center border shadow-sm bg-sky-500/20 border-sky-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-3xl font-extrabold text-sky-800">{stats.processing}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-sky-700 opacity-90">Processing</div>
            </div>
            <div className="p-5 text-center border shadow-sm bg-orange-500/20 border-orange-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-3xl font-extrabold text-orange-800">{stats.pending}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-orange-700 opacity-90">Pending</div>
            </div>
            <div className="p-5 text-center border shadow-sm bg-red-500/20 border-red-500/30 backdrop-blur-md rounded-2xl">
              <div className="mb-1 text-3xl font-extrabold text-red-800">{stats.failed}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-red-700 opacity-90">Failed</div>
            </div>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="glass-panel rounded-[2.5rem] py-24 px-6 text-center border-t border-l border-white/80 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-24 h-24 mb-8 glass-icon-container rounded-3xl">
              <Database className="w-12 h-12 text-[#3C64D6] opacity-80" />
            </div>
            <h3 className="mb-3 text-2xl font-extrabold text-slate-800 drop-shadow-sm">No Analysis Jobs Yet</h3>
            <p className="max-w-sm mx-auto mb-8 text-sm font-medium leading-relaxed text-slate-600">Your engineering analysis jobs will appear here.<br/>Submit your first job to get started!</p>
            {currentUser.isApproved ? (
              <button onClick={() => openSubmitJob('Nozzle Analysis')} className="glass-btn-green font-bold py-3.5 px-6 rounded-xl transition-all hover:scale-105 flex items-center shadow-lg text-sm">
                 <Plus className="w-5 h-5 mr-2" /> Start First Job
              </button>
            ) : (
              <button disabled className="flex items-center px-6 py-3.5 text-sm font-bold shadow-sm cursor-not-allowed bg-slate-200 text-slate-500 rounded-xl">
                 <Lock className="w-5 h-5 mr-2" /> Account Locked
              </button>
            )}
          </div>
        ) : (
          <div className="glass-panel rounded-[2rem] overflow-hidden border-t border-white/80">
             <div className="flex items-center justify-between px-8 py-5 border-b bg-white/40 backdrop-blur-md border-white/50">
                <h3 className="flex items-center gap-3 text-lg font-extrabold text-slate-800 drop-shadow-sm"><FileText className="w-6 h-6 text-[#3C64D6]" /> Recent Jobs</h3>
             </div>
             <div className="p-4 overflow-x-auto">
               <table className="w-full text-sm text-left border-separate text-slate-700 border-spacing-y-2">
                 <thead className="text-slate-500 font-bold uppercase tracking-wider text-[11px] px-4">
                   <tr><th className="px-6 py-2">Job ID</th><th className="px-6 py-2">Project Name</th><th className="px-6 py-2">Type</th><th className="px-6 py-2">Date</th><th className="px-6 py-2 text-right">Actions</th></tr>
                 </thead>
                 <tbody>
                   {filteredJobs.map(job => (
                     <tr key={job.id} className="transition-colors shadow-sm bg-white/40 hover:bg-white/60 rounded-xl">
                       <td className="px-6 py-4 font-black text-[#3C64D6] first:rounded-l-xl">{job.job_id_display}</td>
                       <td className="px-6 py-4 font-bold text-slate-800">{job.name}</td>
                       <td className="px-6 py-4 font-medium">{job.type}</td>
                       <td className="px-6 py-4 font-medium text-slate-500">{new Date(job.created_at).toLocaleDateString()}</td>
                       <td className="px-6 py-4 flex items-center justify-end gap-3 last:rounded-r-xl">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border ${job.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30' : job.status === 'Processing' ? 'bg-blue-500/20 text-blue-800 border-blue-500/30 animate-pulse' : job.status === 'Pending' ? 'bg-orange-500/20 text-orange-800 border-orange-500/30' : 'bg-red-500/20 text-red-800 border-red-500/30'}`}>
                            {job.status === 'Processing' && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />} 
                            {job.status}
                          </span>
                          
                          {job.status === 'Completed' && job.excel_file_url && (
                             <a href={job.excel_file_url} target="_blank" rel="noopener noreferrer" className="glass-panel px-3 py-1.5 rounded-lg text-xs font-extrabold text-blue-700 hover:bg-white/60 transition-all hover:scale-105 flex items-center gap-1.5 shadow-sm border-blue-200/50">
                                <Download className="w-3.5 h-3.5" /> Result
                             </a>
                          )}
                          
                          <button onClick={() => { setSelectedJobDetails(job); setIsJobDetailsOpen(true); }} className="glass-panel px-3 py-1.5 rounded-lg text-xs font-extrabold text-slate-700 hover:bg-white/60 transition-all hover:scale-105 flex items-center gap-1.5 shadow-sm border-slate-200/50">
                            <Eye className="w-3.5 h-3.5" /> Details
                          </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        
        {isSubmitJobOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSubmitJobOpen(false)}></div>
            <div className="glass-panel w-full max-w-md rounded-[2rem] overflow-hidden animate-in zoom-in-95 relative z-10 border-t border-l border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <div className={`p-6 text-white font-extrabold flex justify-between items-center bg-gradient-to-r ${selectedJobType === 'Nozzle Analysis' ? 'from-emerald-600/90 to-emerald-500/90' : selectedJobType === 'Local PWHT' ? 'from-orange-600/90 to-orange-500/90' : 'from-blue-600/90 to-blue-500/90'} backdrop-blur-md`}>
                <span className="flex items-center gap-3 text-lg drop-shadow-sm"><Plus className="w-6 h-6" /> New {selectedJobType}</span>
                <button onClick={() => setIsSubmitJobOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleJobSubmit} className="p-8 space-y-4">
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
                        className="w-full h-20 p-3 mb-3 text-sm font-medium rounded-lg resize-none glass-input focus:ring-purple-500/50"
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
              <div className="flex items-center justify-between p-6 text-white border-b bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border-white/20">
                <h3 className="flex items-center gap-3 text-xl font-extrabold drop-shadow-sm">
                  <Sparkles className="w-6 h-6" /> AI Analysis Recommender
                </h3>
                <button onClick={() => setIsAiModalOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                <div className="bg-white/40 border border-white/50 backdrop-blur-md rounded-2xl p-6 shadow-[inset_0_2px_10px_rgba(255,255,255,0.5)]">
                  <p className="pl-1 mb-3 text-sm font-bold text-purple-900 drop-shadow-sm">Describe your engineering scenario below:</p>
                  <textarea
                    className="w-full h-32 p-4 text-sm font-medium resize-none glass-input rounded-xl focus:ring-purple-500/50"
                    placeholder="E.g., I have a high-pressure steam pipe attached to a thin-walled cylindrical vessel. I need to know if the junction is safe."
                    value={aiSetupPrompt}
                    onChange={(e) => setAiSetupPrompt(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={handleAiSetupSubmit}
                      disabled={isAiSetupLoading || !aiSetupPrompt.trim()}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white text-sm font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] shadow-md"
                    >
                      {isAiSetupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isAiSetupLoading ? "Analyzing..." : "Analyze Scenario"}
                    </button>
                  </div>
                </div>

                {aiSetupResponse && (
                  <div className="p-8 shadow-sm glass-panel border-purple-500/30 rounded-2xl animate-in fade-in slide-in-from-bottom-4 bg-white/60">
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

  const renderProfile = () => (
    <div className="relative z-10 min-h-screen p-4 pt-24 font-sans text-slate-800 md:p-8">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-xl text-white font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md border border-white/20 ${notification.type === 'success' ? 'bg-emerald-600/90' : notification.type === 'info' ? 'bg-blue-600/90' : 'bg-slate-800/90'}`}>
           <CheckCircle className="w-5 h-5" /> {notification.message}
        </div>
      )}

      <div className="max-w-[1200px] mx-auto">
        <DashboardHeader isProfile={true} />

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="w-full md:w-[280px] shrink-0">
            <div className="py-4 overflow-hidden border-t border-l shadow-sm glass-panel rounded-3xl border-white/80">
              <nav className="flex flex-col gap-1 px-3">
                {['info', 'security', 'payment', 'help'].map((tab) => (
                  <button key={tab} onClick={() => setProfileTab(tab)} className={`text-left px-5 py-3.5 text-sm font-bold rounded-xl transition-all ${profileTab === tab ? 'bg-white/60 text-[#3C64D6] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-white/80' : 'text-slate-600 hover:bg-white/40 border border-transparent'}`}>
                    {tab === 'info' ? 'Profile Info' : tab === 'security' ? 'Security' : tab === 'payment' ? 'Payment Summary' : 'Need Help'}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {profileTab === 'info' && (
              <div className="glass-panel rounded-[2.5rem] p-10 border-t border-l border-white/80 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between pb-6 mb-10 border-b border-white/50">
                  <h2 className="text-2xl font-extrabold text-[#1E293B] drop-shadow-sm">Profile Information</h2>
                  <button onClick={() => { setEditForm({ company: currentUser.company, phone: currentUser.phone }); setIsEditProfileOpen(true); }} className="glass-btn-blue text-white text-sm font-bold py-2.5 px-6 rounded-xl shadow-md transition-all hover:scale-105 flex items-center gap-2">
                    <Settings className="w-4 h-4"/> Edit Profile
                  </button>
                </div>

                <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
                  <div className="flex flex-col items-center pl-4 space-y-4 shrink-0">
                    <div className="w-32 h-32 rounded-[2rem] glass-input flex items-center justify-center overflow-hidden relative group cursor-pointer shadow-md">
                       {currentUser.avatar ? <img src={currentUser.avatar} alt="Profile" className="object-cover w-full h-full" /> : <div className="text-5xl font-extrabold text-[#3C64D6] drop-shadow-sm">{currentUser.initial}</div>}
                       <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    </div>
                    <label className="text-[#3C64D6] text-sm font-bold hover:underline cursor-pointer bg-white/40 px-4 py-1.5 rounded-full border border-white/60 shadow-sm transition-colors hover:bg-white/60">
                      Change Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>

                  <div className="flex-1 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)]">
                    <div className="grid grid-cols-1 text-sm md:grid-cols-2 gap-y-8 gap-x-6">
                      <div><div className="mb-1 font-extrabold text-slate-800 drop-shadow-sm">Full Name</div><div className="font-medium text-slate-600">{currentUser.name}</div></div>
                      <div><div className="mb-1 font-extrabold text-slate-800 drop-shadow-sm">Email Address</div><div className="font-medium text-slate-600">{currentUser.email}</div></div>
                      <div><div className="mb-1 font-extrabold text-slate-800 drop-shadow-sm">Company/Institute</div><div className="font-medium text-slate-600">{currentUser.company || "Not Provided"}</div></div>
                      <div><div className="mb-1 font-extrabold text-slate-800 drop-shadow-sm">Phone</div><div className="font-medium text-slate-600">{currentUser.phone || "Not Provided"}</div></div>
                      <div><div className="mb-1 font-extrabold text-slate-800 drop-shadow-sm">Joined On</div><div className="font-medium text-slate-600">{currentUser.joined}</div></div>
                      <div className="flex gap-4 pt-4 border-t md:col-span-2 border-white/50">
                        <div><div className="mb-2 font-extrabold text-slate-800 drop-shadow-sm">Account Status</div><span className="bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">Active Pro</span></div>
                        <div><div className="mb-2 font-extrabold text-slate-800 drop-shadow-sm">Jobs Completed</div><span className="bg-blue-500/20 text-blue-800 border border-blue-500/30 text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">{stats.completed} Total</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {profileTab === 'security' && (
              <div className="glass-panel rounded-[2.5rem] p-10 border-t border-l border-white/80 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="pb-4 mb-10 border-b border-white/50"><h2 className="text-2xl font-extrabold text-red-600 drop-shadow-sm">Security Settings</h2></div>
                <div className="bg-white/40 border border-white/60 backdrop-blur-md rounded-3xl p-16 text-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)]">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 border shadow-sm bg-amber-500/20 rounded-2xl border-amber-500/30 backdrop-blur-sm">
                     <Lock className="w-10 h-10 text-amber-600 drop-shadow-sm" />
                  </div>
                  <h3 className="mb-2 text-xl font-extrabold text-slate-800 drop-shadow-sm">Password Management</h3>
                  <p className="max-w-sm mx-auto mb-8 text-sm font-medium text-slate-600">Keep your account secure by using a strong password and updating it regularly.</p>
                  <button onClick={() => setIsChangePasswordOpen(true)} className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3.5 px-8 rounded-xl mx-auto flex items-center shadow-lg transition-transform hover:scale-105">
                     <Lock className="w-4 h-4 mr-2" /> Change Password
                  </button>
                </div>
              </div>
            )}

            {profileTab === 'payment' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="glass-panel rounded-[2.5rem] p-10 border-t border-l border-white/80 shadow-sm">
                  <h2 className="pb-4 mb-8 text-2xl font-extrabold border-b text-emerald-700 border-white/50 drop-shadow-sm">Payment Summary ({jobs.length} Jobs)</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="bg-white/40 border border-red-500/30 backdrop-blur-md rounded-3xl py-8 text-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)]">
                       <div className="mb-2 text-3xl font-extrabold text-red-600 drop-shadow-sm">₹{paymentData.unpaid.toLocaleString()}</div>
                       <div className="text-xs font-bold tracking-widest uppercase text-slate-600">Unpaid</div>
                    </div>
                    <div className="bg-white/40 border border-emerald-500/30 backdrop-blur-md rounded-3xl py-8 text-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)]">
                       <div className="mb-2 text-3xl font-extrabold text-emerald-600 drop-shadow-sm">0</div>
                       <div className="text-xs font-bold tracking-widest uppercase text-slate-600">Paid</div>
                    </div>
                    <div className="relative py-8 overflow-hidden text-center shadow-lg glass-btn-blue border-blue-500/50 rounded-3xl">
                       <div className="absolute inset-0 bg-white/10"></div>
                       <div className="relative z-10 mb-2 text-3xl font-extrabold text-white drop-shadow-sm">₹{paymentData.total.toLocaleString()}</div>
                       <div className="relative z-10 text-xs font-bold tracking-widest text-blue-100 uppercase">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {profileTab === 'help' && (
              <div className="glass-panel rounded-[2.5rem] p-10 border-t border-l border-white/80 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                 <h2 className="text-2xl font-extrabold text-[#0EA5E9] mb-8 pb-4 border-b border-white/50 drop-shadow-sm">Need Help?</h2>
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="bg-white/40 border border-sky-500/30 backdrop-blur-md p-12 text-center rounded-3xl flex flex-col justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)]">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 border bg-sky-500/20 rounded-2xl border-sky-500/30">
                         <Mail className="w-8 h-8 text-sky-600" />
                      </div>
                      <h3 className="mb-3 text-xl font-extrabold text-slate-800 drop-shadow-sm">Contact Support</h3>
                      <p className="mb-6 text-sm font-medium text-slate-600">Email us directly for technical assistance and licensing queries:</p>
                      <a href="mailto:analysis.ai.nova@gmail.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 mx-auto text-sm font-bold text-white transition-transform shadow-md glass-btn-blue hover:scale-105 rounded-xl">
                        analysis.ai.nova@gmail.com
                      </a>
                    </div>
                    
                    <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl flex flex-col h-[400px] shadow-[0_8px_32px_rgba(14,165,233,0.1)] overflow-hidden">
                      <div className="flex items-center gap-3 p-4 text-sm font-extrabold border-b shadow-sm glass-panel border-white/50 text-slate-800">
                        <div className="p-2 border rounded-lg bg-sky-500/20 border-sky-500/30"><Bot className="w-5 h-5 text-sky-600"/></div> ✨ NOVA AI Support
                      </div>
                      <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-white/20">
                        {supportChat.map((m, i) => (
                           <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-3.5 rounded-2xl text-sm font-medium max-w-[85%] shadow-sm backdrop-blur-md ${m.role === 'user' ? 'bg-[#0EA5E9] text-white rounded-tr-none border border-sky-400' : 'glass-panel text-slate-800 rounded-tl-none border border-white/80'}`}>{m.text}</div>
                           </div>
                        ))}
                        {isSupportLoading && (
                          <div className="flex justify-start animate-in fade-in">
                             <div className="p-3.5 glass-panel text-slate-600 rounded-2xl rounded-tl-none text-sm font-bold flex items-center gap-2 shadow-sm border border-white/80">
                               <Loader2 className="w-4 h-4 animate-spin text-[#0EA5E9]" /> Thinking...
                             </div>
                          </div>
                        )}
                      </div>
                      <form onSubmit={handleSupportSubmit} className="flex gap-3 p-4 border-t border-white/50 bg-white/40 backdrop-blur-md">
                         <input 
                           type="text" 
                           className="flex-1 glass-input rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all" 
                           value={supportInput} 
                           onChange={e => setSupportInput(e.target.value)} 
                           placeholder="Ask me anything..."
                         />
                         <button type="submit" disabled={!supportInput.trim() || isSupportLoading} className="flex items-center justify-center p-3 text-white transition-all shadow-md glass-btn-blue disabled:opacity-50 rounded-xl hover:scale-105"><Send className="w-5 h-5"/></button>
                      </form>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditProfileOpen(false)}></div>
            <div className="glass-panel w-full max-w-md rounded-[2rem] overflow-hidden relative z-10 border-t border-l border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-in zoom-in-95">
              <div className="flex items-center justify-between p-6 font-extrabold text-white bg-gradient-to-r from-blue-600/90 to-blue-500/90 backdrop-blur-md">
                 <span className="flex items-center gap-3 text-lg drop-shadow-sm"><Settings className="w-6 h-6"/> Edit Profile</span>
                 <button onClick={() => setIsEditProfileOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleEditProfile} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="pl-1 text-sm font-bold text-slate-800">Company / Institute</label>
                  <input type="text" value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})} className="w-full glass-input p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="space-y-2">
                  <label className="pl-1 text-sm font-bold text-slate-800">Phone Number</label>
                  <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full glass-input p-3.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsEditProfileOpen(false)} className="flex-1 px-4 py-3.5 glass-input text-slate-800 rounded-xl font-bold hover:bg-white/60 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3.5 glass-btn-blue text-white rounded-xl font-bold transition-all hover:scale-[1.02] shadow-md">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsChangePasswordOpen(false)}></div>
            <div className="glass-panel w-full max-w-md rounded-[2rem] overflow-hidden relative z-10 border-t border-l border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-in zoom-in-95">
              <div className={`p-6 text-white font-extrabold flex justify-between items-center backdrop-blur-md transition-colors duration-300 ${isPwdSuccess ? 'bg-emerald-600/90' : 'bg-red-600/90'}`}>
                <span className="flex items-center gap-3 text-lg drop-shadow-sm">
                  {isPwdSuccess ? <CheckCircle className="w-6 h-6"/> : <Lock className="w-6 h-6"/>} 
                  {isPwdSuccess ? 'Password Changed!' : 'Change Password'}
                </span>
                <button onClick={() => { setIsChangePasswordOpen(false); setPwdErrors({}); setPwdForm({current: '', new: '', confirm: ''}); setIsPwdSuccess(false); }} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handlePasswordChange} className="p-8 space-y-5">
                <div className="space-y-2">
                   <div className="relative">
                     <input 
                       type={showPwd.new ? "text" : "password"} 
                       placeholder="New Password" 
                       value={pwdForm.new} 
                       onChange={(e) => { setPwdForm({...pwdForm, new: e.target.value}); setPwdErrors({...pwdErrors, new: null}); setIsPwdSuccess(false); }} 
                       required 
                       className={`w-full glass-input ${isPwdSuccess ? '!border-emerald-500 text-emerald-800 bg-emerald-50/50' : pwdErrors.new ? '!border-red-500' : ''} p-3.5 pr-12 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300`} 
                     />
                     <button type="button" onClick={() => setShowPwd({...showPwd, new: !showPwd.new})} className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-500 hover:text-slate-800">
                       {showPwd.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                   </div>
                   {pwdErrors.new && <p className="pl-1 text-xs font-bold leading-tight text-red-500 animate-in fade-in slide-in-from-top-1">{pwdErrors.new}</p>}
                </div>
                
                <div className="space-y-2">
                   <div className="relative">
                     <input 
                       type={showPwd.confirm ? "text" : "password"} 
                       placeholder="Confirm Password" 
                       value={pwdForm.confirm} 
                       onChange={(e) => { setPwdForm({...pwdForm, confirm: e.target.value}); setPwdErrors({...pwdErrors, confirm: null}); setIsPwdSuccess(false); }} 
                       required 
                       className={`w-full glass-input ${isPwdSuccess ? '!border-emerald-500 text-emerald-800 bg-emerald-50/50' : pwdErrors.confirm ? '!border-red-500' : ''} p-3.5 pr-12 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300`} 
                     />
                     <button type="button" onClick={() => setShowPwd({...showPwd, confirm: !showPwd.confirm})} className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-500 hover:text-slate-800">
                       {showForgotPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                     </button>
                   </div>
                   {pwdErrors.confirm && <p className="pl-1 text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-1">{pwdErrors.confirm}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsChangePasswordOpen(false)} className="flex-1 px-4 py-3.5 glass-input text-slate-800 rounded-xl font-bold hover:bg-white/60 transition-colors">Cancel</button>
                  <button type="submit" className={`flex-1 px-4 py-3.5 text-white rounded-xl font-bold transition-all hover:scale-[1.02] shadow-md ${isPwdSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                    {isPwdSuccess ? 'Success!' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
      </div>

      {showSplash && renderSplash()}
      {!showSplash && (
        <>
          {currentView === 'landing' && renderLanding()}
          {currentView === 'login' && renderLogin()}
          {currentView === 'signup' && renderSignup()}
          {currentView === 'forgot' && renderForgotPassword()}
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'profile' && renderProfile()}
        </>
      )}
    </>
  );
}
