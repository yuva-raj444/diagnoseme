import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Heart, CheckCircle, AlertTriangle, Users, Star, ArrowRight, Menu, X, Microscope, Shield, Zap, Brain, Phone, Mail, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const HealthDiagnosisWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Smooth scroll animation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

const analyzeImage = async () => {
  if (!selectedImage) return;

  setIsAnalyzing(true);

  try {
    const base64 = selectedImage.split(',')[1];

    const response = await fetch('/api/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  const Navigation = () => (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              HealthCare Pro
            </span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {['home', 'diagnose', 'about', 'contact'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`capitalize px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-blue-100 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            {['home', 'diagnose', 'about', 'contact'].map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );

  const HomePage = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Diagnose Health
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Conditions Instantly
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Upload a photo of your skin condition, rash, or visible symptom and get instant AI-powered diagnosis with treatment recommendations. 
                  Powered by advanced machine learning to help you understand your health better.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentPage('diagnose')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Diagnosis
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl transform rotate-3 opacity-20"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Microscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">98.7% Accuracy</h3>
                      <p className="text-sm text-gray-600">AI-powered diagnosis</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Instant Results</h3>
                      <p className="text-sm text-gray-600">Get results in seconds</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Smart Analysis</h3>
                      <p className="text-sm text-gray-600">Powered by Gemini AI</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Treatment Guide</h3>
                      <p className="text-sm text-gray-600">Detailed solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose HealthCare Pro?</h2>
            <p className="text-xl text-gray-600">Advanced AI technology meets medical expertise</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Microscope className="w-8 h-8" />,
                title: "Advanced AI Detection",
                description: "Our Gemini-powered AI analyzes skin conditions and visible symptoms with medical-grade precision, identifying potential issues at early stages."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Results",
                description: "Get comprehensive diagnosis and treatment recommendations in under 3 seconds."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Expert Guidance",
                description: "Receive detailed treatment plans developed by healthcare professionals and medical specialists."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "45K+", label: "Conditions Diagnosed" },
              { number: "98.7%", label: "Accuracy Rate" },
              { number: "24/7", label: "Available" },
              { number: "150+", label: "Condition Types" }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const DiagnosePage = () => (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Condition Diagnosis</h1>
          <p className="text-xl text-gray-600">Upload a clear photo of your skin condition or visible symptom for instant AI analysis</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="space-y-8">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors duration-300">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected condition"
                    className="max-w-full h-64 object-contain mx-auto rounded-xl shadow-lg"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  >
                    Choose Different Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-12 h-12 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Medical Image</h3>
                    <p className="text-gray-600 mb-4">Drop your image here or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">For skin conditions, rashes, visible symptoms, etc.</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Choose Image
                    </button>
                  </div>
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
            
            {/* Analyze Button */}
            {selectedImage && (
              <div className="text-center">
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-heartbeat">
                        <Heart className="w-6 h-6" />
                      </div>
                      <span>Diagnosing...</span>
                    </div>
                  ) : (
                    'Analyze Condition'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Results */}
        {analysisResult && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{analysisResult.disease}</h2>
                <p className="text-gray-600">Confidence: {analysisResult.confidence}%</p>
              </div>
            </div>
            
            {/* Changed from grid to flex layout with full width items */}
            <div className="flex flex-col space-y-4">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-3">Severity Level</h3>
                <div className="text-2xl font-bold text-red-600">{analysisResult.severity}</div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Description</h3>
                <p className="text-blue-800">{analysisResult.description}</p>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">Treatment</h3>
                <p className="text-indigo-800">{analysisResult.treatment}</p>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Prevention Tips</h3>
                <p className="text-yellow-800">{analysisResult.prevention}</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-3">Important Note</h3>
                <p className="text-purple-800">This is an AI-assisted preliminary diagnosis. Please consult with a healthcare professional for a proper medical diagnosis and treatment plan.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="min-h-screen pt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About HealthCare Pro</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing healthcare through advanced AI technology and medical expertise
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe everyone deserves access to quality healthcare information. Our mission is to democratize healthcare 
              by making preliminary medical assessments accessible to everyone, especially in areas with limited healthcare access.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Using cutting-edge AI technology powered by Google's Gemini 2.0 Flash Lite model, we provide instant, 
              preliminary health condition identification with detailed information and recommendations.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">2024</div>
                <div className="text-gray-600">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">45K+</div>
                <div className="text-gray-600">People Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">98.7%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600">Available</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Technology</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Gemini 2.0 Flash Lite",
                description: "Google's latest AI model for fast, accurate medical image analysis"
              },
              {
                icon: <Microscope className="w-8 h-8" />,
                title: "Computer Vision",
                description: "Advanced image recognition trained on millions of medical images"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Medical Knowledge",
                description: "Backed by healthcare professionals and medical specialists"
              }
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto">
                  {tech.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tech.title}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with our team of medical experts</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Tell us more about your question..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">yuvarajhealthpro@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 9976846274</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">11, yoyo street<br /> Arani, Tamil Nadu.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors duration-300">
                  <Twitter className="w-6 h-6 text-blue-600" />
                </a>
                <a href="#" className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center hover:bg-indigo-200 transition-colors duration-300">
                  <Linkedin className="w-6 h-6 text-indigo-600" />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-300">
                  <Github className="w-6 h-6 text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">HealthCare Pro</span>
          </div>
          <p className="text-gray-400 max-w-md">
            Professional health condition diagnosis powered by advanced AI technology.
          </p>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 HealthCare Pro. All rights reserved | Yuvaraj</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://x.com/NaanKaanagan" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/yuvaraj-g-53a1a827b/" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/yuva-raj444" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
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
    <div className="min-h-screen bg-white">
      <Navigation />
      {renderPage()}
      <Footer />
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HealthDiagnosisWebsite;