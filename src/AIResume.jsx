import { useState } from 'react';
import { Briefcase, GraduationCap, Award, Mail, Code, MessageSquare, Send, Cpu, Sparkles, Trophy, Globe } from 'lucide-react';

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
      "Python & Java",
      "Docker & Containerization",
      "Kubernetes & Docker Swarm",
      "Linux System Administration",
      "AI/LLM Integration",
      "Networking & Infrastructure",
      "Full Stack Web Development",
      "DevOps & Self-Hosting"
    ],
    
    awards: [
      {
        title: "USACO Silver Division",
        description: "Competitive programming achievement in USA Computing Olympiad"
      },
      {
        title: "Presidential Volunteer Service Award - Gold",
        description: "Recognized for outstanding volunteer service contributions"
      },
      {
        title: "DECA Vice President of Finance",
        description: "Leadership role managing finances for school's DECA chapter"
      },
      {
        title: "freeCodeCamp Python v9 Certified",
        description: "Completed comprehensive Python certification program"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 font-medium">AI-Powered Resume</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">{resumeData.name}</h1>
          <p className="text-3xl text-purple-300 mb-6">{resumeData.title}</p>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">{resumeData.bio}</p>
          
          <div className="flex gap-4 mb-8">
            <a href={`mailto:${resumeData.email}`} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
              <Mail className="w-5 h-5" />
              Contact Me
            </a>
            <button 
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Ask AI About Me
            </button>
            <a href="https://sandiegotamilpalli.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
              <Globe className="w-5 h-5" />
              View My Work
            </a>
          </div>

          <div className="flex gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {resumeData.email}
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {resumeData.location}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 bg-slate-800 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">AI Assistant (DeepSeek R1)</span>
            </div>
            <button onClick={() => setShowChat(false)} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Ask me anything about Vamshi!</p>
                <p className="text-sm mt-2">Try: "What projects has he built?" or "What are his skills?"</p>
              </div>
            )}
            
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about skills, experience..."
                className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Experience */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="w-8 h-8 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Experience & Projects</h2>
          </div>
          <div className="space-y-6">
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
                <h3 className="text-2xl font-semibold text-white mb-2">{exp.role}</h3>
                <div className="flex items-center gap-4 text-purple-300 mb-3">
                  <span>{exp.company}</span>
                  <span>•</span>
                  <span>{exp.period}</span>
                </div>
                <p className="text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-8 h-8 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Technical Skills</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {resumeData.skills.map((skill, idx) => (
              <span key={idx} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Awards & Leadership */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Awards & Leadership</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {resumeData.awards.map((award, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-2">{award.title}</h3>
                <p className="text-gray-300">{award.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Education</h2>
          </div>
          <div className="space-y-6">
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
                <h3 className="text-2xl font-semibold text-white mb-2">{edu.degree}</h3>
                <div className="flex items-center gap-4 text-purple-300 mb-3">
                  <span>{edu.school}</span>
                  <span>•</span>
                  <span>{edu.period}</span>
                </div>
                <p className="text-gray-300">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-purple-500/20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p>© 2025 {resumeData.name}. Built with React + Ollama DeepSeek R1</p>
          <p className="text-sm mt-2">Deployed on Dokploy • Self-Hosted AI • Python & Java Developer</p>
        </div>
      </footer>
    </div>
  );
}
