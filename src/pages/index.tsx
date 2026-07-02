import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Star, 
  ArrowRight, 
  Menu, 
  X, 
  Microscope, 
  Shield, 
  Zap, 
  Brain, 
  Phone, 
  Mail, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin,
  Activity,
  Sparkles,
  Award,
  Lock,
  Compass,
  FileText,
  ChevronRight,
  Database,
  RefreshCw,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Defined outside the component so it's never recreated on re-renders
const ANALYSIS_STEPS = [
  "Calibrating optical contrast matrices...",
  "Scanning structural borders and lesion profiles...",
  "Cross-referencing neural diagnostic models...",
  "Validating emergency critical markers...",
  "Formatting secure digital diagnostic report..."
];

function SEO({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);

  return null;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCapacitor, setIsCapacitor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Custom simulator messages for the analysis phase
  const [analysisStep, setAnalysisStep] = useState(0);

  // Detect if running in Capacitor (mobile app)
  useEffect(() => {
    const isApp = typeof window !== 'undefined' && 
      (window.location.protocol === 'capacitor:' || 
       window.location.protocol === 'ionic:' ||
       (window as any).Capacitor !== undefined);
    setIsCapacitor(isApp);
  }, []);

  // Smooth scroll animation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle stepped message updates during analysis
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setAnalysisStep(0);
      interval = setInterval(() => {
        setAnalysisStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); 
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Use Vercel URL for mobile (Capacitor), relative path for web
const API_BASE_URL = typeof window !== 'undefined' && 
  (window.location.protocol === 'capacitor:' || 
   window.location.protocol === 'ionic:' || 
   window.location.protocol === 'file:')
  ? 'https://diagnoseme.vercel.app'  // Production target for compiled hybrid/mobile contexts
  : (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:3000'         // Localhost target to route requests locally
    : '';   

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const compressedBase64 = await compressImage(selectedFile, 0.8, 800);
      const base64 = compressedBase64.split(",")[1];

      const response = await fetch(`${API_BASE_URL}/api/diagnose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisResult(data);
      } else {
        console.error(data);
        alert("Diagnosis failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during diagnosis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  function compressImage(
    file: File,
    quality = 0.8,
    maxSize = 800
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          let newW = img.width;
          let newH = img.height;

          if (img.width > maxSize || img.height > maxSize) {
            const scale = maxSize / Math.max(img.width, img.height);
            newW = Math.round(img.width * scale);
            newH = Math.round(img.height * scale);
          }

          const canvas = document.createElement("canvas");
          canvas.width = newW;
          canvas.height = newH;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          ctx.drawImage(img, 0, 0, newW, newH);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Compression failed"));
                return;
              }

              const reader2 = new FileReader();
              reader2.onloadend = () => {
                resolve(reader2.result as string);
              };
              reader2.readAsDataURL(blob);
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = reader.result as string;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  const Navigation = () => (
    <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-neutral-200/40 transition-all duration-300" style={isCapacitor ? { paddingTop: 'max(env(safe-area-inset-top), 24px)' } : {}}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-[#e3000f] rounded-lg flex items-center justify-center shadow-md shadow-red-500/10"
            >
              <Heart className="w-4.5 h-4.5 text-white fill-white stroke-[2]" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-md font-bold text-neutral-900 tracking-tight leading-none">
                DiagnoseMe AI
              </span>
              <span className="text-[9px] text-neutral-500 tracking-wider uppercase font-sans mt-0.5 font-medium">
                Clinical Vision
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center bg-neutral-100/80 p-1 rounded-full relative">
            {['home', 'diagnose', 'about', 'contact'].map((page) => (
              <button
                key={page}
                id={`nav-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`capitalize px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors duration-300 relative z-10 ${
                  currentPage === page ? 'text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-950'
                }`}
              >
                {page}
                {currentPage === page && (
                  <motion.div 
                    layoutId="activeNavigationIndicator" 
                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10 border border-neutral-200/50"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:flex">
            <motion.button 
              whileHover={{ scale: 1.02, y: -0.5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentPage('diagnose')}
              className="px-5 py-2 bg-[#0071e3] hover:bg-[#147ce5] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-sm shadow-blue-500/10"
            >
              Analyze Condition
            </motion.button>
          </div>
          
          <button
            id="mobile-menu-btn"
            className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-neutral-200 absolute top-16 left-0 w-full shadow-xl"
          >
            <div className="px-6 py-4 space-y-1.5">
              {['home', 'diagnose', 'about', 'contact'].map((page) => (
                <button
                  key={page}
                  id={`mobile-nav-${page}`}
                  onClick={() => {
                    setCurrentPage(page);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 rounded-xl capitalize text-sm font-semibold transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => {
                  setCurrentPage('diagnose');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-3 py-3 bg-[#0071e3] text-white text-center font-semibold rounded-xl text-sm shadow-md"
              >
                Analyze Condition
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  const HomePage = () => {
    // Parent container variant for staggered intro
    const staggerContainer = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.12,
          delayChildren: 0.05
        }
      }
    };

    const slideUpItem = {
      hidden: { opacity: 0, y: 24 },
      show: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 100,
          damping: 18
        }
      }
    };

    return (
      <motion.div 
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="min-h-screen bg-[#f5f5f7] text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900 font-sans"
      >
        <SEO title="DiagnoseMe AI — Advanced Visual Health Diagnosis" description="Upload skin photographs or visible symptoms for immediate clinical model assessment and safe guided remedies." />
        
        {/* Hero Section */}
        <div className={`relative max-w-6xl mx-auto px-6 sm:px-8 ${isCapacitor ? 'pt-28' : 'pt-24'} pb-24 z-10`}>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <motion.div 
                variants={slideUpItem}
                className="inline-flex items-center space-x-2 bg-white/80 border border-neutral-200/50 shadow-sm px-3.5 py-1.5 rounded-full text-neutral-600 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0071e3] fill-blue-500/10" />
                <span>Next-Generation Neural Triage</span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1 
                  variants={slideUpItem}
                  className="text-5xl sm:text-6xl font-sans font-semibold tracking-tight text-neutral-900 leading-[1.08]"
                >
                  Clinical insight.<br />
                  <motion.span 
                    initial={{ backgroundPosition: "0% 50%" }}
                    animate={{ backgroundPosition: "100% 50%" }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
className="text-neutral-500 font-['Libre_Baskerville'] italic font-normal tracking-wide bg-gradient-to-r from-neutral-500 via-neutral-700 to-neutral-400 bg-clip-text text-transparent bg-[size:200%_auto]"                  >
                    Right in your hand.
                  </motion.span>
                </motion.h1>
                <motion.p 
                  variants={slideUpItem}
                  className="text-lg text-neutral-600 leading-relaxed max-w-xl font-normal"
                >
                  Upload visual symptoms or skin anomalies and receive clinical assessment immediately. Crafted with secure local privacy matrices and professional diagnostic standards.
                </motion.p>
              </div>

              <motion.div variants={slideUpItem} className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  id="hero-start-btn"
                  onClick={() => setCurrentPage('diagnose')}
                  className="group px-7 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Analyze Condition</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  id="hero-learn-btn"
                  onClick={() => setCurrentPage('about')}
                  className="px-7 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 font-semibold rounded-full transition-all duration-300 flex items-center justify-center text-sm shadow-sm"
                >
                  <span>Our Medical Science</span>
                </motion.button>
              </motion.div>

              {/* Verified Badge */}
              <motion.div 
                variants={slideUpItem}
                className="pt-6 border-t border-neutral-200 flex items-center space-x-4"
              >
                <div className="flex -space-x-2.5">
                  <motion.div whileHover={{ scale: 1.1, zIndex: 10 }} className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-neutral-700 font-mono shadow-sm">MD</motion.div>
                  <motion.div whileHover={{ scale: 1.1, zIndex: 10 }} className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-neutral-700 font-mono shadow-sm">PhD</motion.div>
                  <motion.div whileHover={{ scale: 1.1, zIndex: 10 }} className="w-8 h-8 rounded-full bg-neutral-50 border-2 border-white flex items-center justify-center text-[9px] font-bold text-neutral-700 font-mono shadow-sm">AI</motion.div>
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">Clinically Correlated Strategy</div>
                  <div className="text-[10px] text-neutral-500">Cross-verified by healthcare consultants and dermo-analysts</div>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Card Column */}
            <motion.div 
              variants={slideUpItem}
              className="lg:col-span-5 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-200 to-neutral-100 rounded-[2.5rem] blur-xl opacity-35 transform rotate-2 pointer-events-none" />
              <motion.div 
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="relative bg-white border border-neutral-200/80 rounded-[2rem] p-8 shadow-xl"
              >
                <div className="absolute top-4 right-4 text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                  SENSOR READY
                </div>

                <div className="mb-6 pb-4 border-b border-neutral-100">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Hardware Interfaced</div>
                  <h3 className="text-md font-bold text-neutral-800">Precision Imaging Panel</h3>
                </div>

                {/* Simulated Specimen Panel with Laser Scanning Line */}
                <div className="mb-6 rounded-2xl bg-neutral-50 overflow-hidden border border-neutral-100 relative group aspect-video flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
                    alt="Precision interface preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 filter grayscale-[20%] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent z-10" />
                  
                  {/* Glowing Hologram Scanner Laser Line */}
                  <motion.div 
                    animate={{ y: ["-10%", "210%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] z-20"
                  />
                  
                  <div className="relative z-10 text-center p-4">
                    <Microscope className="w-8 h-8 text-neutral-800 mx-auto mb-2" />
                    <span className="text-xs font-bold text-neutral-900 block">Dermoscopic Spectrometry</span>
                    <span className="text-[9px] text-neutral-500 font-mono block mt-0.5">MULTIBAND ANALYSIS MATRIX</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Award className="w-4 h-4 text-[#34c759]" />,
                      title: "98.7% Confidence",
                      desc: "Trained on vetted assets"
                    },
                    {
                      icon: <Zap className="w-4 h-4 text-[#0071e3]" />,
                      title: "Instant Triage",
                      desc: "Under 3 seconds execution"
                    },
                    {
                      icon: <Shield className="w-4 h-4 text-neutral-700" />,
                      title: "Full Privacy",
                      desc: "Zero storage footprints"
                    },
                    {
                      icon: <Clock className="w-4 h-4 text-purple-600" />,
                      title: "24/7 Availability",
                      desc: "No medical waiting lists"
                    }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.02, backgroundColor: "#fafafa" }}
                      className="bg-neutral-50/80 border border-neutral-100 p-4 rounded-xl transition-all duration-300"
                    >
                      <div className="mb-2">{item.icon}</div>
                      <div className="text-xs font-bold text-neutral-800 mb-0.5">{item.title}</div>
                      <div className="text-[10px] text-neutral-500 leading-normal">{item.desc}</div>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Feature Grid Section */}
        <div className="py-24 bg-white border-t border-neutral-200">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-neutral-600 text-[10px] font-semibold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Core Capabilities</span>
              </div>
              <h2 className="text-4xl font-sans font-semibold tracking-tight text-neutral-900">
                Crafted for absolute accuracy and trust.
              </h2>
              <p className="text-md text-neutral-500 leading-relaxed font-normal">
                Advanced machine learning identifies patterns and boundaries of skin anomalies, while maintaining absolute localized data security.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Activity className="w-6 h-6 text-[#0071e3]" />,
                  bg: "bg-blue-50/60 border-blue-100",
                  title: "Border Anomaly Recognition",
                  desc: "Analyzes pigmentation, shape, and contrast values of rashes or lesions to evaluate characteristics against clinically trained datasets."
                },
                {
                  icon: <Lock className="w-6 h-6 text-[#34c759]" />,
                  bg: "bg-emerald-50/60 border-emerald-100",
                  title: "Decentralized Security",
                  desc: "Patient privacy remains absolute. Visual files are analyzed safely inside live API runtimes and completely omitted post-calculation."
                },
                {
                  icon: <HeartHandshake className="w-6 h-6 text-[#ff2d55]" />,
                  bg: "bg-red-50/60 border-red-100",
                  title: "Safe Care Triage",
                  desc: "Provides clear medical classifications alongside approved home recovery protocols and concrete warning flags for immediate clinical referral."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={slideUpItem}
                  whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="group relative p-8 bg-neutral-50/50 hover:bg-white border border-neutral-200/50 hover:border-neutral-300 rounded-[1.8rem] transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  <div className={`w-12 h-12 ${feature.bg} border rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-105 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed font-normal">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Big Editorial Quote Section */}
        <div className="py-24 bg-[#f5f5f7] border-t border-neutral-200">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-8">
            <span className="text-[#0071e3] text-xs font-bold tracking-wider uppercase font-mono">THE VISION OF DEMOCRATIZATION</span>
            <blockquote className="text-3xl sm:text-4xl font-serif text-neutral-800 italic leading-snug tracking-tight">
              "We believe that everyone deserves instant access to high-fidelity dermatological triage, no matter where they are located or how complex the medical landscape might be."
            </blockquote>
            <div className="flex items-center justify-center space-x-3">
              <span className="w-8 h-px bg-neutral-300" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">The DiagnoseMe Medical Board</span>
              <span className="w-8 h-px bg-neutral-300" />
            </div>
          </div>
        </div>

        {/* Accuracy and Technology Highlights */}
        <div className="py-24 bg-white border-t border-neutral-200 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              <div className="space-y-8">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">AI-Powered Research Matrix</span>
                <h2 className="text-4xl font-semibold tracking-tight text-neutral-900 font-sans">
                  The science of deep multi-spectral detection.
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed font-normal">
                  Our core clinical pipeline leverages deep convolutional neural models coupled with multi-spectral image indexing to evaluate lesions, hives, dermatitis, and other acute anomalies at a microscopic tier.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Multi-spectral pigment contouring and margin scanning",
                    "Lesion contrast scaling relative to skin tone matrices",
                    "Safety-first guidelines structured from board-approved documentation",
                    "Real-time processing with immediate triage recommendation indices"
                  ].map((bullet, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ x: 3 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-5 h-5 bg-[#34c759]/10 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-[#34c759]" />
                      </div>
                      <span className="text-xs font-medium text-neutral-700">{bullet}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-200 to-neutral-50 rounded-3xl blur-2xl opacity-40 transform pointer-events-none" />
                <motion.div 
                  whileHover={{ scale: 1.015 }}
                  className="relative rounded-[2rem] overflow-hidden border border-neutral-200 shadow-xl aspect-video"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80" 
                    alt="Clinical assessment setup"
                    className="w-full h-full object-cover filter contrast-[1.02] brightness-[1.01]"
                  />
                  <div className="absolute inset-0 bg-neutral-900/10 pointer-events-none" />
                </motion.div>
              </div>

            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="py-20 border-t border-b border-neutral-200/60 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { val: "12K+", lbl: "Images Evaluated" },
                { val: "98.7%", lbl: "Diagnostic Index" },
                { val: "24/7", lbl: "Service Velocity" },
                { val: "50+", lbl: "Clinical Subtypes" }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-semibold text-neutral-900 tracking-tight">{stat.val}</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{stat.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </motion.div>
    );
  };

  const DiagnosePage = () => {
    const listVariant = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };

    const itemVariant = {
      hidden: { opacity: 0, y: 15 },
      show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 15 } }
    };

    return (
      <div className={`min-h-screen ${isCapacitor ? 'pt-28' : 'pt-24'} bg-[#f5f5f7] text-neutral-900`}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
          
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 space-y-4"
          >
            <div className="inline-flex items-center space-x-2 bg-neutral-200/60 border border-neutral-300/50 px-3.5 py-1.5 rounded-full text-neutral-700 text-[10px] font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Diagnostic Portal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">AI Diagnosis Laboratory</h1>
            <p className="text-md text-neutral-500 max-w-xl mx-auto font-normal">
              Upload clear, high-contrast imagery of skin concerns, moles, rashes, or local visible symptoms for immediate triage model evaluation.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-neutral-200 rounded-[2rem] p-8 mb-8 shadow-sm relative"
          >
            <div className="space-y-6">
              
              {/* Drag & Drop Upload Zone */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden ${
                  dragActive 
                    ? 'border-[#0071e3] bg-blue-50/10' 
                    : selectedImage 
                      ? 'border-neutral-200 bg-neutral-50/30' 
                      : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/60'
                }`}
              >
                {selectedImage ? (
                  <div className="space-y-6">
                    <div className="relative group max-w-sm mx-auto rounded-xl overflow-hidden shadow-md border border-neutral-200">
                      <img
                        src={selectedImage}
                        alt="Symptom photograph preview"
                        className="max-h-72 w-full object-cover rounded-xl"
                      />
                      
                      {/* Scanning visual overlay (appears when image is selected and not yet analyzed) */}
                      {!analysisResult && !isAnalyzing && (
                        <div className="absolute inset-0 bg-neutral-950/20 pointer-events-none">
                          <motion.div 
                            animate={{ y: ["0%", "280%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-0.5 bg-[#0071e3] shadow-[0_0_8px_#0071e3] absolute top-0 left-0"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-xs text-white font-semibold uppercase bg-neutral-900/80 px-3 py-1.5 rounded-full">IMAGE LOADED</span>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <button
                        id="change-image-btn"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-full transition-all duration-300 border border-neutral-200"
                      >
                        Choose Different Image
                      </button>
                      {analysisResult && (
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedFile(null);
                            setAnalysisResult(null);
                          }}
                          className="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-full transition-all duration-300 border border-red-200"
                        >
                          Reset System
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 py-6">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm"
                    >
                      <Upload className="w-6 h-6 text-neutral-500" />
                    </motion.div>
                    <div className="space-y-1.5">
                      <h3 className="text-md font-bold text-neutral-800">Upload Image </h3>
                      <p className="text-neutral-500 text-xs max-w-sm mx-auto font-normal">
                        Drag and drop your clinical photo here, or browse local files. Support for standard formats up to 10MB.
                      </p>
                    </div>
                    <button
                      id="browse-btn"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-[#0071e3] hover:bg-[#147ce5] text-white font-semibold rounded-full shadow-sm text-xs transition-all duration-300"
                    >
                      Select Photograph
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* Analyze Trigger */}
              {selectedImage && !analysisResult && (
                <div className="text-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    id="analyze-condition-btn"
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto px-12 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full font-semibold text-sm shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-4 h-4 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
                        <span>Processing clinical arrays...</span>
                      </div>
                    ) : (
                      'Initiate Clinical AI Triage'
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Loading / Diagnostic Step Indicators */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: 15 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -15 }}
                className="bg-white border border-neutral-200 rounded-3xl p-8 mb-8 text-center shadow-sm overflow-hidden"
              >
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-neutral-200 border-t-neutral-800 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-4.5 h-4.5 text-neutral-700 animate-pulse-subtle" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 h-12">
                    <h3 className="text-md font-bold text-neutral-800">Spectrometry Engine Processing</h3>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={analysisStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="text-neutral-500 text-xs font-mono tracking-tight"
                      >
                        {ANALYSIS_STEPS[analysisStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  
                  {/* Stepped Progress bar */}
                  <div className="max-w-xs mx-auto bg-neutral-100 h-1.5 rounded-full overflow-hidden border border-neutral-200/60">
                    <motion.div 
                      className="bg-[#0071e3] h-full" 
                      animate={{ width: `${((analysisStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Results Report Card */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                className="bg-white border border-neutral-200 rounded-[2rem] p-8 shadow-md relative overflow-hidden"
              >
                
                <div className="absolute top-4 right-4 text-[9px] font-bold text-[#0071e3] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                  SECURE ASSESSMENT DATA
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8 pb-6 border-b border-neutral-100">
                  <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Award className="w-6 h-6 text-[#0071e3]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">{analysisResult.disease}</h2>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Classification Confidence:</span>
                      <span className="text-xs font-bold text-[#34c759] font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {analysisResult.confidence}% match probability
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bento-style Report Grid */}
                <motion.div 
                  variants={listVariant}
                  initial="hidden"
                  animate="show"
                  className="grid md:grid-cols-12 gap-6"
                >
                  
                  {/* Severity Card */}
                  <motion.div variants={itemVariant} className="md:col-span-4 bg-neutral-50/80 border border-neutral-100 rounded-2xl p-6 relative">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Triage Urgency</span>
                    <div className="text-xl font-bold text-red-600 uppercase tracking-wider">{analysisResult.severity}</div>
                    <p className="text-neutral-500 text-[10px] mt-2 leading-relaxed">Indicates speed of recommended medical attention.</p>
                  </motion.div>

                  {/* Warnings Card */}
                  <motion.div variants={itemVariant} className="md:col-span-8 bg-[#fff1f2] border border-rose-100 rounded-2xl p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest">Urgent Warning Signs</span>
                    </div>
                    <div className="text-xs font-semibold text-red-800 leading-relaxed">{analysisResult.warnings}</div>
                  </motion.div>

                  {/* Description Card */}
                  <motion.div variants={itemVariant} className="md:col-span-12 bg-neutral-50/80 border border-neutral-100 rounded-2xl p-6">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Condition Overview</span>
                    <p className="text-neutral-700 text-s leading-relaxed font-normal">{analysisResult.description}</p>
                  </motion.div>
                  
                  {/* Treatment Card */}
                  <motion.div variants={itemVariant} className="md:col-span-6 bg-neutral-50/80 border border-neutral-100 rounded-2xl p-6">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Recommended Care / Diagnosis</span>
                    <p className="text-neutral-700 text-s leading-relaxed font-normal">{analysisResult.possible_diagnosis}</p>
                  </motion.div>
                  {/* Home Remedies Card */}
<motion.div variants={itemVariant} className="md:col-span-6 bg-neutral-50/80 border border-neutral-100 rounded-2xl p-6">
  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">Safe Home Remedies</span>
  
  <div className="space-y-3">
    {analysisResult.safe_home_remedies
      ?.split(/(?=\d+\.\s)/) // Splits before every number followed by a dot and space
      .map((item, index) => {
        if (!item.trim()) return null;
        return (
          <p key={index} className="text-neutral-700 text-sm leading-relaxed font-normal">
            {item.trim()}
          </p>
        );
      })}
  </div>
</motion.div>
 
                  {/* Disclaimer Notice */}
                  <motion.div variants={itemVariant} className="md:col-span-12 bg-neutral-100/60 border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3 max-w-xl">
                      <InfoIcon className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-0.5">Assistance Notice Disclaimer</h4>
                        <p className="text-[10px] text-neutral-500 leading-relaxed font-normal">
                          DiagnoseMe AI is an assistive research index and cannot supersede standard face-to-face physician analysis. Seek emergency attention for sudden worsening or severe systemic symptoms.
                        </p>
                      </div>
                    </div>
                    <button
                      id="print-btn"
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white hover:bg-neutral-50 text-[10px] font-bold text-neutral-700 border border-neutral-200 rounded-full transition-colors shrink-0 shadow-sm"
                    >
                      Export Diagnostics
                    </button>
                  </motion.div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const AboutPage = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen ${isCapacitor ? 'pt-28' : 'pt-24'} bg-white text-neutral-900`}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
          
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-neutral-100 border border-neutral-200 px-3.5 py-1.5 rounded-full text-neutral-600 text-[10px] font-semibold uppercase tracking-wider animate-pulse-subtle">
              <Users className="w-3.5 h-3.5 text-neutral-500" />
              <span>The Science of Access</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-sans font-semibold text-neutral-900 tracking-tight leading-none">Democratizing health analysis.</h1>
            <p className="text-md text-neutral-500 max-w-2xl mx-auto font-normal">
              Our mission is to establish low-latency clinical anomaly insights across remote or isolated communities, safely and privately.
            </p>
          </div>
          
          {/* Narrative & Stats */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 font-sans">A foundational pillar of wellness.</h2>
              <p className="text-neutral-600 text-xs leading-relaxed font-normal">
                Every day, millions of people worldwide struggle with acute skin anomalies, allergic reactions, and localized conditions. Many are isolated from dermatologists due to geographical or economical parameters.
              </p>
              <p className="text-neutral-600 text-xs leading-relaxed font-normal">
                By packaging advanced visual models powered by Google's multi-modal intelligence directly inside secure consumer-grade interfaces, we provide instantaneous preliminary care directions that reduce panic, clarify home remedies, and outline warnings.
              </p>
              <div className="pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage('diagnose')}
                  className="px-6 py-2.5 bg-neutral-900 text-white font-semibold rounded-full hover:bg-neutral-800 text-xs transition-all duration-300"
                >
                  Launch Diagnostic Tool
                </motion.button>
              </div>
            </div>
            
            <div className="bg-[#f5f5f7] border border-neutral-200 rounded-[2rem] p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <motion.div whileHover={{ scale: 1.03 }} className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
                  <div className="text-2xl font-bold text-neutral-800 mb-1">2026</div>
                  <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">System Launch</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
                  <div className="text-2xl font-bold text-[#0071e3] mb-1">12K+</div>
                  <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Scans Conducted</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
                  <div className="text-2xl font-bold text-[#34c759] mb-1">98.7%</div>
                  <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Detection Index</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
                  <div className="text-2xl font-bold text-[#ff2d55] mb-1">24/7</div>
                  <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Global Reach</div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Core Pillars */}
          <div className="bg-[#f5f5f7] border border-neutral-200 rounded-[2.5rem] p-12">
            <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-12 font-sans">Our Operational Foundations</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: <Brain className="w-5 h-5 text-neutral-700" />,
                  title: "Neural Vision Models",
                  desc: "Harnessing Google's multi-modal framework to map precise visual contrast, contouring, boundaries, and pigment matrices."
                },
                {
                  icon: <Microscope className="w-5 h-5 text-neutral-700" />,
                  title: "Clinical Accuracy Standards",
                  desc: "Engineered under rigorous evaluation parameters with constant validation matrices for triage reliability."
                },
                {
                  icon: <Shield className="w-5 h-5 text-neutral-700" />,
                  title: "Absolute Privacy Protections",
                  desc: "We enforce zero remote visual image caching. Client files reside inside sandbox runtimes during live analysis only."
                }
              ].map((pillar, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -3 }}
                  className="space-y-4"
                >
                  <div className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center shadow-sm">
                    {pillar.icon}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-800">{pillar.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed font-normal">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    );
  };

  const ContactPage = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen ${isCapacitor ? 'pt-28' : 'pt-24'} bg-[#f5f5f7] text-neutral-900`}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
          
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-neutral-200/60 border border-neutral-300/50 px-3.5 py-1.5 rounded-full text-neutral-700 text-[10px] font-semibold uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Support Interface</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-900 tracking-tight leading-none">Get in touch with us.</h1>
            <p className="text-md text-neutral-500 font-normal">Reach out for general system inquiries, collaborations, or feedback.</p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Message Form */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-800 tracking-tight">Direct Transmission</h2>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Your Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-neutral-400 rounded-xl focus:ring-0 text-neutral-800 placeholder-neutral-400 transition-all text-xs font-semibold"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-neutral-400 rounded-xl focus:ring-0 text-neutral-800 placeholder-neutral-400 transition-all text-xs font-semibold"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-neutral-400 rounded-xl focus:ring-0 text-neutral-800 placeholder-neutral-400 transition-all text-xs font-semibold"
                      placeholder="Brief objective statements"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Clinical Inquiry Details</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-neutral-400 rounded-xl focus:ring-0 text-neutral-800 placeholder-neutral-400 transition-all text-xs font-semibold"
                      placeholder="Describe your request or comments..."
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                  >
                    Send Inquiry
                  </motion.button>
                </form>
              </div>
            </div>
            
            {/* Info Side */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-neutral-800 tracking-tight">Contact Points</h2>
                <div className="space-y-5">
                  
                  <motion.div whileHover={{ x: 3 }} className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Primary Email</h3>
                      <p className="text-neutral-800 text-xs font-bold">healthpro@gmail.com</p>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ x: 3 }} className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Telephone Access</h3>
                      <p className="text-neutral-800 text-xs font-bold">+91 9976846274</p>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ x: 3 }} className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">HQ Address</h3>
                      <p className="text-neutral-800 text-xs leading-relaxed font-bold">11, yoyo street<br />Arani, Tamil Nadu.</p>
                    </div>
                  </motion.div>

                </div>
              </div>
              
              {/* Social channels */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Follow Platforms</h2>
                <div className="flex space-x-3">
                  <motion.a whileHover={{ y: -2 }} href="https://x.com/NaanKaanagan" className="w-10 h-10 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors">
                    <Twitter className="w-4 h-4 text-neutral-600" />
                  </motion.a>
                  <motion.a whileHover={{ y: -2 }} href="https://www.linkedin.com/in/yuvaraj-g-53a1a827b/" className="w-10 h-10 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors">
                    <Linkedin className="w-4 h-4 text-neutral-600" />
                  </motion.a>
                  <motion.a whileHover={{ y: -2 }} href="https://github.com/yuva-raj444" className="w-10 h-10 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors">
                    <Github className="w-4 h-4 text-neutral-600" />
                  </motion.a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    );
  };

  const Footer = () => (
    <footer className="bg-[#f5f5f7] border-t border-neutral-200 text-neutral-500 py-16 relative z-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-[#e3000f] rounded-lg flex items-center justify-center shadow-sm shadow-red-500/10">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-md font-bold text-neutral-900 tracking-tight">DiagnoseMe AI</span>
          </div>
          <p className="text-neutral-500 max-w-sm text-xs leading-relaxed font-normal">
            Professional-tier diagnostic triage platform powered by live multi-modal intelligence algorithms.
          </p>
        </div>
        
        <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-neutral-400">© 2026 DiagnoseMe AI. All rights reserved | 16th Bat</p>
          <div className="flex space-x-5 mt-4 md:mt-0">
            <a href="https://x.com/NaanKaanagan" className="text-neutral-400 hover:text-neutral-700 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/yuvaraj-g-53a1a827b/" className="text-neutral-400 hover:text-neutral-700 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://github.com/yuva-raj444" className="text-neutral-400 hover:text-neutral-700 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'diagnose':
        return <DiagnosePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans text-neutral-900 antialiased overflow-x-hidden selection:bg-neutral-200 selection:text-neutral-900">
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

// Simple Helper Icon component
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
