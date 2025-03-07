'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'

// Project data with cybersecurity focus
const projects = [
  {
    id: 1,
    title: "Automotive Security Framework",
    description: "Developed a comprehensive security framework for connected vehicles, implementing secure boot, secure OTA updates, and intrusion detection systems.",
    image: "/images/project1.jpg",
    tags: ["Automotive Security", "IoT", "Intrusion Detection"],
    details: {
      challenge: "Modern vehicles are increasingly connected, making them vulnerable to cyber attacks. The challenge was to develop a security framework that protects all aspects of the vehicle's digital systems without compromising performance.",
      solution: "Implemented a multi-layered security approach including secure boot mechanisms, encrypted communications, intrusion detection systems, and regular security assessments.",
      technologies: ["Secure Boot", "PKI Infrastructure", "CAN Bus Monitoring", "Anomaly Detection"],
      outcome: "The framework was implemented across multiple vehicle models, reducing security vulnerabilities by 85% and establishing a new standard for automotive cybersecurity."
    },
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    title: "Enterprise Threat Intelligence Platform",
    description: "Designed and implemented an AI-powered threat intelligence platform that correlates data from multiple sources to identify potential security threats.",
    image: "/images/project2.jpg",
    tags: ["Threat Intelligence", "AI/ML", "SIEM"],
    details: {
      challenge: "Organizations face numerous cyber threats daily, making it difficult to distinguish between real threats and false positives. Manual analysis was time-consuming and often missed sophisticated attacks.",
      solution: "Developed an AI-powered platform that aggregates and analyzes threat data from multiple sources, using machine learning to identify patterns and predict potential attacks.",
      technologies: ["Python", "TensorFlow", "Elasticsearch", "Kibana", "MISP"],
      outcome: "The platform reduced false positives by 60%, increased threat detection speed by 75%, and provided actionable intelligence for security teams."
    },
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 3,
    title: "Zero Trust Security Implementation",
    description: "Led the implementation of a zero trust security architecture for a financial institution, ensuring secure access to resources regardless of network location.",
    image: "/images/project3.jpg",
    tags: ["Zero Trust", "Identity Management", "Network Security"],
    details: {
      challenge: "Traditional perimeter-based security was insufficient for a modern workforce with remote employees and cloud resources. The organization needed a security model that didn't automatically trust users or devices.",
      solution: "Implemented a zero trust architecture based on the principle of 'never trust, always verify', with strong authentication, micro-segmentation, and continuous monitoring.",
      technologies: ["Identity Management", "MFA", "Micro-segmentation", "Continuous Monitoring"],
      outcome: "Successfully transitioned the organization to a zero trust model, reducing the attack surface and improving security posture while maintaining productivity."
    },
    color: "from-green-500 to-teal-600"
  }
]

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })
  
  // Floating particles for background effect
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1
  }))
  
  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="min-h-screen py-20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="cyber-grid opacity-30"></div>
        <div className="scan-line"></div>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-500"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.2,
            }}
            animate={{
              x: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
              ],
              y: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
              ],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header with glitch effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 cyber-glitch-text" data-text="PROJECTS">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                SECURITY OPERATIONS
              </span>
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="px-4 font-mono text-xs text-cyan-500">CLASSIFIED MISSIONS</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </div>
          </motion.div>
          
          {/* Project grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative group"
                onClick={() => setSelectedProject(project.id)}
              >
                {/* Glowing border */}
                <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm border-glow bg-gradient-to-br from-cyan-500/30 to-purple-600/30 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Project card */}
                <div className="relative bg-black/80 backdrop-blur-sm rounded-xl border border-cyan-500/30 overflow-hidden h-full cursor-pointer">
                  {/* Project image with overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-50`}></div>
                    <div className="absolute inset-0 bg-black/50"></div>
                    
                    {/* Terminal header */}
                    <div className="absolute top-0 left-0 right-0 flex items-center p-2 bg-black/80 border-b border-cyan-800/50">
                      <div className="flex space-x-2 mr-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="font-mono text-xs text-cyan-400">project_{project.id}.exe</div>
                    </div>
                    
                    {/* Project title */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-xl font-bold text-white text-center px-4">{project.title}</h3>
                    </div>
                    
                    {/* Animated scan line */}
                    <div className="scan-line"></div>
                  </div>
                  
                  {/* Project content */}
                  <div className="p-6">
                    <p className="text-gray-300 text-sm mb-4 font-mono leading-relaxed">{project.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-cyan-900/20 border border-cyan-800/50 rounded-full text-cyan-400 text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* View details button */}
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        className="w-full border-cyan-500 text-cyan-500 hover:bg-cyan-950 font-mono text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project.id);
                        }}
                      >
                        $ ./view_details.sh
                      </Button>
                    </div>
                  </div>
                  
                  {/* Data flow animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 data-flow"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Project details modal */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="relative w-full max-w-4xl max-h-[90vh] overflow-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Glowing border */}
                  <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm border-glow bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
                  
                  {/* Modal content */}
                  <div className="relative bg-black/90 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30">
                    {/* Terminal header */}
                    <div className="flex items-center justify-between mb-6 border-b border-cyan-800/50 pb-3">
                      <div className="flex items-center">
                        <div className="flex space-x-2 mr-4">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="font-mono text-xs text-cyan-400">project_details_{selectedProject}.sh</div>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-white"
                        onClick={() => setSelectedProject(null)}
                      >
                        <span className="sr-only">Close</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Project details */}
                    {(() => {
                      const project = projects.find(p => p.id === selectedProject);
                      if (!project) return null;
                      
                      return (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.map((tag, i) => (
                                <span 
                                  key={i} 
                                  className="px-2 py-1 bg-cyan-900/20 border border-cyan-800/50 rounded-full text-cyan-400 text-xs font-mono"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="font-mono text-sm space-y-6">
                            <div>
                              <div className="flex items-start mb-2">
                                <span className="text-green-500 mr-2">$</span>
                                <span className="text-cyan-400">./display_challenge.sh</span>
                              </div>
                              <p className="pl-4 text-gray-300 leading-relaxed">{project.details.challenge}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-start mb-2">
                                <span className="text-green-500 mr-2">$</span>
                                <span className="text-cyan-400">./display_solution.sh</span>
                              </div>
                              <p className="pl-4 text-gray-300 leading-relaxed">{project.details.solution}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-start mb-2">
                                <span className="text-green-500 mr-2">$</span>
                                <span className="text-cyan-400">./list_technologies.sh</span>
                              </div>
                              <div className="pl-4 flex flex-wrap gap-2">
                                {project.details.technologies.map((tech, i) => (
                                  <span 
                                    key={i} 
                                    className="px-2 py-1 bg-cyan-900/20 border border-cyan-800/50 rounded text-cyan-400 text-xs"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-start mb-2">
                                <span className="text-green-500 mr-2">$</span>
                                <span className="text-cyan-400">./display_outcome.sh</span>
                              </div>
                              <p className="pl-4 text-gray-300 leading-relaxed">{project.details.outcome}</p>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-cyan-800/50 flex justify-end">
                            <Button 
                              variant="outline" 
                              className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 font-mono text-xs"
                              onClick={() => setSelectedProject(null)}
                            >
                              $ ./close.sh
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
} 