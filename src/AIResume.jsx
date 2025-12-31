import { useState } from 'react';
import { Briefcase, GraduationCap, Award, Mail, Code, MessageSquare, Send, Cpu, Sparkles, Trophy, Globe, ExternalLink, Github, Linkedin } from 'lucide-react';

export default function AIResume() {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

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
        period: "2024",
        description: "Built and deployed sandiegotamilpalli.com for community organization. Managed full-stack development, deployment, and ongoing maintenance for the nonprofit's web presence."
      },
      {
        role: "DevOps Engineer",
        company: "Self-Hosted Infrastructure",
        period: "2023 - Present",
        description: "Managing home lab with Kubernetes, Docker Swarm, and Dokploy. Deploying containerized applications with CI/CD pipelines, maintaining high availability services, and implementing DevOps best practices."
      },
      {
        role: "AI Integration Developer",
        company: "Personal Projects",
        period: "2024 - Present",
        description: "Building AI-powered web applications using Ollama and LLMs. Created sentiment analysis tools, interactive chatbots, and AI-enhanced user experiences for modern web applications."
      }
    ],
    
    skills: [
      { name: "Python & Java", icon: Code },
      { name: "Docker & Containerization", icon: Cpu },
      { name: "Kubernetes & Docker Swarm", icon: Cpu },
      { name: "Linux System Administration", icon: Cpu },
      { name: "AI/LLM Integration", icon: Sparkles },
      { name: "Networking & Infrastructure", icon: Globe },
      { name: "Full Stack Web Development", icon: Code },
      { name: "DevOps & Self-Hosting", icon: Briefcase }
    ],
    
    awards: [
      {
        title: "USACO Silver Division",
        description: "Competitive programming achievement in USA Computing Olympiad",
        icon: Trophy
      },
      {
        title: "Presidential Volunteer Service Award - Gold",
        description: "Recognized for outstanding volunteer service contributions",
        icon: Award
      },
      {
        title: "DECA Vice President of Finance",
        description: "Leadership role managing finances for school's DECA chapter",
        icon: Briefcase
      },
      {
        title: "freeCodeCamp Python v9 Certified",
        description: "Completed comprehensive Python certification program",
        icon: Code
      }
    ],
    
    education: [
      {
        degree: "AP Computer Science A",
        school: "High School",
        period: "2024",
        description: "Advanced Placement coursework in Java programming and computer science fundamentals"
      },
      {
        degree: "AP Computer Science Principles",
        school: "High School",
        period: "2023",
        description: "Foundational computer science concepts and computational thinking"
      },
      {
        degree: "freeCodeCamp Python v9 Course",
        school: "Online Certification",
        period: "2024",
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
      // Remove <think> tags and extra whitespace from DeepSeek R1 responses
      let cleanResponse = data.response
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      // If response is empty after cleaning, use a fallback
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
      
      {/* Floating orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">AI-Powered Interactive Resume</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                {resumeData.name}
              </h1>
              <p className="text-3xl md:text-4xl text-gray-400 font-light">{resumeData.title}</p>
            </div>
            
            <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">{resumeData.bio}</p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <a href={`mailto:${resumeData.email}`} className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105">
                <Mail className="w-5 h-5" />
                Get in Touch
              </a>
              <button 
                onClick={() => setShowChat(!showChat)}
                className="group flex items-center gap-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                <Cpu className="w-5 h-5" />
                Ask AI Assistant
              </button>
              <a href="https://sandiegotamilpalli.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
                <ExternalLink className="w-5 h-5" />
                View Live Project
              </a>
            </div>

            <div className="flex flex-wrap gap-8 pt-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{resumeData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>{resumeData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed bottom-8 right-8 w-[28rem] bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden z-50 animate-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold block">AI Assistant</span>
                <span className="text-white/70 text-xs">Powered by DeepSeek R1</span>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white text-2xl transition-colors">
              ×
            </button>
          </div>
          
          <div className="h-[28rem] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/50 to-black/80">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                </div>
                <p className="font-semibold text-white mb-2">Ask me anything!</p>
                <p className="text-sm">Try: "What projects has Vamshi built?" or "What are his skills?"</p>
              </div>
            )}
            
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-gray-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-black/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 text-white px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white p-3 rounded-2xl transition-all transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-32">
        
        {/* Experience */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-5xl font-bold">Experience</h2>
          </div>
          <div className="space-y-6">
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                  <div className="flex items-center gap-4 text-purple-300 mb-4">
                    <span className="font-medium">{exp.company}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">{exp.period}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Code className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-5xl font-bold">Technical Skills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resumeData.skills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div key={idx} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-105">
                  <Icon className="w-8 h-8 text-purple-400 mb-3" />
                  <span className="text-white font-medium">{skill.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Awards */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-5xl font-bold">Awards & Leadership</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {resumeData.awards.map((award, idx) => {
              const Icon = award.icon;
              return (
                <div key={idx} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300">
                  <Icon className="w-10 h-10 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{award.title}</h3>
                  <p className="text-gray-400">{award.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Education */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-5xl font-bold">Education</h2>
          </div>
          <div className="space-y-6">
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                <div className="flex items-center gap-4 text-green-300 mb-4">
                  <span className="font-medium">{edu.school}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">{edu.period}</span>
                </div>
                <p className="text-gray-400 leading-relaxed">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 mt-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <p className="text-gray-400">© 2025 {resumeData.name}. Built with React + Ollama DeepSeek R1</p>
            <p className="text-sm text-gray-600">Self-Hosted AI • Deployed on Dokploy • Open Source Enthusiast</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
