'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { Skill } from '@/lib/supabase'

// Skill categories with cybersecurity focus
const skillCategories = [
  {
    id: 'technical',
    name: 'Technical Skills',
    icon: '💻',
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Standards',
    icon: '🔧',
  },
  {
    id: 'tools',
    name: 'Security Tools',
    icon: '🛠️',
  },
  {
    id: 'certifications',
    name: 'Certifications',
    icon: '🏆',
  }
]

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].id)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })
  
  // Floating particles for background effect
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1
  }))

  useEffect(() => {
    fetchSkills()
  }, [])
  
  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })

      if (error) {
        console.error('Error fetching skills:', error)
        return
      }

      console.log('Fetched skills:', data)
      setSkills(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    // Map database categories to component categories
    const categoryMap: Record<string, string> = {
      'technical skills': 'technical',
      'frameworks & standards': 'frameworks',
      'security tools': 'tools',
      'certifications': 'certifications'
    }
    
    const category = categoryMap[skill.category.toLowerCase()] || skill.category.toLowerCase()
    console.log('Processing skill:', skill.name, 'Category:', category)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)
  
  console.log('Grouped skills:', groupedSkills)
  
  return (
    <section 
      id="skills" 
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
        <div className="max-w-5xl mx-auto">
          {/* Section header with glitch effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 cyber-glitch-text" data-text="SKILLS">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                SECURITY ARSENAL
              </span>
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="px-4 font-mono text-xs text-cyan-500">CAPABILITIES ANALYSIS</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </div>
          </motion.div>
          
          {/* Interactive 3D skill interface */}
          <div className="relative">
            {/* Holographic border effect */}
            <div className="absolute -inset-1 rounded-xl opacity-50 blur-sm border-glow bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
            
            <div className="relative bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30">
              {/* Terminal-style header */}
              <div className="flex items-center mb-6 border-b border-cyan-800/50 pb-3">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="font-mono text-xs text-cyan-400">skill_analysis.exe</div>
              </div>
              
              {/* Category tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {skillCategories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className={`relative overflow-hidden group p-3 rounded-lg border ${
                      activeCategory === category.id 
                        ? 'border-cyan-500 bg-cyan-900/20' 
                        : 'border-gray-800 bg-black/50 hover:border-cyan-800'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {/* Animated highlight on hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-2xl mb-1">{category.icon}</span>
                      <span className={`text-xs font-mono ${
                        activeCategory === category.id ? 'text-cyan-400' : 'text-gray-400'
                      }`}>
                        {category.name}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {/* Skills display with animations */}
              <div className="relative min-h-[300px]">
                <AnimatePresence mode="wait">
                  {skillCategories.map((category) => (
                    category.id === activeCategory && (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                      >
                        {loading ? (
                          <div className="text-center text-cyan-400">Loading skills...</div>
                        ) : category.id === 'certifications' ? (
                          // Special layout for certifications
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groupedSkills[category.id]?.map((skill, index) => (
                              <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group"
                              >
                                <div className="absolute -inset-0.5 rounded-lg opacity-75 blur-sm bg-gradient-to-r from-cyan-500/30 to-purple-600/30 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative p-4 rounded-lg border border-cyan-800/50 bg-black/60 flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mr-3">
                                    <span className="text-sm">{skill.icon}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">{skill.name}</h4>
                                    <p className="text-xs text-cyan-400 font-mono">Level: {skill.level}%</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          // Standard skill bars for other categories
                          <div className="space-y-5">
                            {groupedSkills[category.id]?.map((skill, index) => (
                              <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-medium text-white">{skill.name}</h4>
                                  <span className="text-xs font-mono text-cyan-400">{skill.level}%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                                  />
                                </div>
                                
                                {/* Animated data flow effect */}
                                <motion.div
                                  className="h-0.5 data-flow rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Terminal-style footer */}
              <div className="mt-8 pt-4 border-t border-cyan-800/50 font-mono text-xs text-gray-500">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">$</span>
                  <span className="text-cyan-400">./analyze_proficiency.sh --detailed</span>
                </div>
                <div className="mt-2 text-gray-400">
                  Analysis complete. Security expertise verified at advanced level.
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated security metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-block relative">
              <div className="absolute -inset-1 rounded-xl opacity-50 blur-sm border-glow bg-gradient-to-br from-cyan-500/20 to-purple-600/20"></div>
              <div className="relative px-6 py-3 rounded-xl border border-cyan-500/30 bg-black/60 font-mono text-sm text-cyan-400">
                <span className="mr-2">⚠️</span>
                Security expertise continuously updated to counter evolving threats
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 