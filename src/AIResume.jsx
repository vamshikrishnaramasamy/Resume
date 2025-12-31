import { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Award, Mail, Code, MessageSquare, Send, Cpu, Sparkles, Trophy, Globe, ExternalLink, ArrowRight, Zap } from 'lucide-react';

export default function AIResume() {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const resumeData = {
    name: "Vamshi Krishna Ramasamy",
    title: "Full Stack Developer & DevOps Engineer",
    email: "vamshikrishnaramasamy@gmail.com",
    location: "San Diego, California",
    bio: "Self-taught developer specializing in containerization, AI integration, and full-stack web development. Passionate about building scalable infrastructure and creating impactful solutions for communities.",
    
    experience: [
      {
        role: "Web Developer",
        company: "San Diego Tamil Palli (Nonprofit)",
        period: "2024 - Present",
        description: "Built and deployed sandiegotamilpalli.com for community organization. Managed full-stack development, deployment, and ongoing maintenance for the nonprofit's web presence.",
        color: "from-emerald-500 to-teal-500"
      },
      {
        role: "DevOps Engineer",
        company: "Self-Hosted Infrastructure",
        period: "2024 - Present",
        description: "Managing home lab with Kubernetes, Docker Swarm, and Dokploy. Deploying containerized applications with CI/CD pipelines, maintaining high availability services, and implementing DevOps best practices.",
        color: "from-blue-500 to-cyan-500"
      },
      {
        role: "AI Integration Developer",
        company: "Personal Projects",
        period: "2024 - Present",
        description: "Building AI-powered web applications using Ollama and LLMs. Created sentiment analysis tools, interactive chatbots, and AI-enhanced user experiences for modern web applications.",
        color: "from-purple-500 to-pink-500"
      }
    ],
    
    skills: [
      { name: "Python & Java", icon: Code, color: "from-yellow-400 to-orange-500" },
      { name: "Docker & Containerization", icon: Cpu, color: "from-blue-400 to-blue-600" },
      { name: "Kubernetes & Docker Swarm", icon: Cpu, color: "from-cyan-400 to-blue-500" },
      { name: "Linux System Administration", icon: Cpu, color: "from-green-400 to-emerald-600" },
      { name: "AI/LLM Integration", icon: Sparkles, color: "from-purple-400 to-pink-500" },
      { name: "Networking & Infrastructure", icon: Globe, color: "from-indigo-400 to-purple-500" },
      { name: "Full Stack Web Development", icon: Code, color: "from-rose-400 to-red-500" },
      { name: "DevOps & Self-Hosting", icon: Briefcase, color: "from-teal-400 to-cyan-500" }
    ],
    
    awards: [
      {
        title: "USACO Silver Division",
        description: "Competitive programming achievement in USA Computing Olympiad",
        icon: Trophy,
        color: "from-yellow-400 to-amber-500"
      },
      {
        title: "Presidential Volunteer Service Award - Gold",
        description: "Recognized for outstanding volunteer service contributions",
        icon: Award,
        color: "from-amber-400 to-yellow-500"
      },
      {
        title: "DECA Vice President of Finance",
        description: "Leadership role managing finances for school's DECA chapter",
        icon: Briefcase,
        color: "from-blue-400 to-indigo-500"
      },
      {
        title: "freeCodeCamp Python v9 Certified",
        description: "Completed comprehensive Python certification program",
        icon: Code,
        color: "from-green-400 to-emerald-500"
      }
    ],
    
    education: [
      {
        degree: "AP Computer Science A",
        school: "High School",
        period: "2025 - 2026",
        description: "Advanced Placement coursework in Java programming and computer science fundamentals"
      },
      {
        degree: "AP Computer Science Principles",
        school: "High School",
        period: "2024 - 2025",
        description: "Foundational computer science concepts and computational thinking"
      },
      {
        degree: "freeCodeCamp Python v9 Course",
        school: "Online Certification",
        period: "2025",
        description: "Comprehensive Python programming certification covering data structures, algorithms, and practical applications"
      },
      {
        degree: "Self-Taught Developer",
        school: "Continuous Learning",
        period: "Ongoing",
        description: "Containerization, DevOps, AI integration, and infrastructure management through hands-on projects and real-world implementations"
      }
    ]
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('http://192.168.86.39:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b',
          prompt: `${userMsg}

(Note: If asked about Vamshi, he's a Full Stack Developer from San Diego CA. Skills: Python, Java, Docker, Kubernetes. Built sandiegotamilpalli.com. Awards: USACO Silver, Presidential Service Award Gold, DECA VP Finance.)`,
          stream: false
        })
      });

      const data = await response.json();
      let cleanResponse = data.response
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      if (!cleanResponse) {
        cleanResponse = "I'm here to answer questions about Vamshi. What would you like to know?";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: cleanResponse }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble connecting to the AI service. Please make sure Ollama is running with DeepSeek R1 model installed on the server.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20"></div>
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
            left: `${mousePosition.x - 400}px`,
            top: `${mousePosition.y - 400}px`,
          }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]"></div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 group">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-sm font-semibold">AI-Powered Interactive Resume</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-br from-white via-purple-200 to-blue-300 bg-clip-text text-transparent leading-tight animate-in slide-in-from-left duration-700">
                {resumeData.name}
              </h1>
              <div className="flex items-center gap-4 animate-in slide-in-from-left duration-700 delay-100">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                <p className="text-3xl md:text-5xl font-light bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">{resumeData.title}</p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-4xl leading-relaxed animate-in slide-in-from-bottom duration-700 delay-200">{resumeData.bio}</p>
            
            <div className="flex flex-wrap gap-4 pt-6 animate-in slide-in-from-bottom duration-700 delay-300">
              <a href={`mailto:${resumeData.email}`} className="group relative overflow-hidden flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Mail className="w-5 h-5 relative z-10 group-hover:text-white transition-colors" />
                <span className="relative z-10 group-hover:text-white transition-colors">Get in Touch</span>
                <ArrowRight className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all group-hover:text-white" />
              </a>
              
              <button 
                onClick={() => setShowChat(!showChat)}
                className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30 text-white px-10 py-5 rounded-2xl font-bold hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
              >
                <Cpu className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Ask AI Assistant</span>
                <Zap className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              
              <a href="https://sandiegotamilpalli.com" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 text-white px-10 py-5 rounded-2xl font-bold hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>View Live Project</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-8 pt-10 text-gray-500 animate-in fade-in duration-700 delay-500">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <span className="group-hover:text-gray-300 transition-colors">{resumeData.email}</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <span className="group-hover:text-gray-300 transition-colors">{resumeData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed bottom-8 right-8 w-[32rem] bg-black/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-lg">
                  <Cpu className="w-7 h-7 text-white animate-pulse" />
                </div>
                <div>
                  <span className="text-white font-bold text-lg block">AI Assistant</span>
                  <span className="text-white/70 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Powered by DeepSeek R1
                  </span>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white text-2xl transition-all hover:rotate-90 duration-300">
                ×
              </button>
            </div>
          </div>
          
          <div className="h-[32rem] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/50 to-black/80">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-20 animate-in fade-in duration-500">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
                  <MessageSquare className="w-10 h-10 text-purple-400 animate-pulse" />
                </div>
                <p className="font-bold text-white mb-3 text-lg">Ask me anything!</p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">Try: "What projects has Vamshi built?" or "What are his skills?"</p>
              </div>
            )}
            
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-3xl shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-5 border-t border-white/10 bg-black/70 backdrop-blur-xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white p-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-32 space-y-40">
        
        {/* Experience */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-5 mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
              <Briefcase className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Experience</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2"></div>
            </div>
          </div>
          <div className="space-y-8">
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-in slide-in-from-right duration-700" style={{animationDelay: `${idx * 100}ms`}}>
                <div className={`absolute inset-0 bg-gradient-to-r ${exp.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>
                <div className="relative">
                  <div className={`inline-block px-4 py-1.5 bg-gradient-to-r ${exp.color} rounded-full text-white text-sm font-bold mb-4 shadow-lg`}>
                    {exp.period}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">{exp.role}</h3>
                  <p className="text-lg text-purple-300 font-semibold mb-5">{exp.company}</p>
                  <p className="text-gray-400 leading-relaxed text-lg">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-5 mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
              <Code className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Technical Skills</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resumeData.skills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div key={idx} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer animate-in zoom-in duration-500" style={{animationDelay: `${idx * 50}ms`}}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                  <div className="relative">
                    <div className={`w-14 h-14 bg-gradient-to-br ${skill.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">{skill.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Awards */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-5 mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Awards & Leadership</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full mt-2"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {resumeData.awards.map((award, idx) => {
              const Icon = award.icon;
              return (
                <div key={idx} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-in slide-in-from-bottom duration-700" style={{animationDelay: `${idx * 100}ms`}}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${award.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${award.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-amber-400 transition-all">{award.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{award.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Education */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-5 mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
              <GraduationCap className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Education</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2"></div>
            </div>
          </div>
          <div className="space-y-8">
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-in slide-in-from-left duration-700" style={{animationDelay: `${idx * 100}ms`}}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="relative">
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-sm font-bold mb-
