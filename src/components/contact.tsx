'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })
  
  // Floating particles for background effect
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1
  }))
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    
    // Simulate form submission
    try {
      // In a real application, you would send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setFormError('An error occurred while sending your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <section 
      id="contact" 
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4 cyber-glitch-text" data-text="CONTACT">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                SECURE CHANNEL
              </span>
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="px-4 font-mono text-xs text-cyan-500">ENCRYPTED COMMUNICATION</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                {/* Glowing border */}
                <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm border-glow bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
                
                {/* Card content */}
                <div className="relative bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30 h-full">
                  {/* Terminal header */}
                  <div className="flex items-center mb-6 border-b border-cyan-800/50 pb-2">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="font-mono text-xs text-cyan-400">contact_info.sh</div>
                  </div>
                  
                  <div className="space-y-6 font-mono">
                    <div>
                      <div className="flex items-start mb-2">
                        <span className="text-green-500 mr-2">$</span>
                        <span className="text-cyan-400">./display_contact.sh</span>
                      </div>
                      
                      <div className="space-y-4 pl-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center mr-3 border border-cyan-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="text-sm text-white">mohit.gera@example.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center mr-3 border border-cyan-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Phone</p>
                            <p className="text-sm text-white">+91 98765 43210</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center mr-3 border border-cyan-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Location</p>
                            <p className="text-sm text-white">New Delhi, India</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-start mb-2">
                        <span className="text-green-500 mr-2">$</span>
                        <span className="text-cyan-400">./display_socials.sh</span>
                      </div>
                      
                      <div className="flex space-x-3 pl-4">
                        <motion.a 
                          href="https://linkedin.com" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-800 text-cyan-400 hover:bg-cyan-800/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </motion.a>
                        
                        <motion.a 
                          href="https://github.com" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-800 text-cyan-400 hover:bg-cyan-800/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </motion.a>
                        
                        <motion.a 
                          href="https://twitter.com" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-800 text-cyan-400 hover:bg-cyan-800/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </motion.a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Data flow animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 data-flow"></div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                {/* Glowing border */}
                <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm border-glow bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
                
                {/* Card content */}
                <div className="relative bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30">
                  {/* Terminal header */}
                  <div className="flex items-center mb-6 border-b border-cyan-800/50 pb-2">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="font-mono text-xs text-cyan-400">send_message.sh</div>
                  </div>
                  
                  {isSubmitted ? (
                    <div className="py-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mx-auto mb-4"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                      <p className="text-gray-400 font-mono text-sm mb-6">Your message has been encrypted and transmitted securely.</p>
                      <Button 
                        variant="outline" 
                        className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 font-mono text-xs"
                        onClick={() => setIsSubmitted(false)}
                      >
                        $ ./send_new_message.sh
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 font-mono">
                      <div>
                        <label htmlFor="name" className="block text-xs text-gray-400 mb-1">Name</label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="bg-black border-cyan-800 focus:border-cyan-500 text-white"
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-xs text-gray-400 mb-1">Email</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="bg-black border-cyan-800 focus:border-cyan-500 text-white"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-xs text-gray-400 mb-1">Subject</label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                          className="bg-black border-cyan-800 focus:border-cyan-500 text-white"
                          placeholder="Enter message subject"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-xs text-gray-400 mb-1">Message</label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          className="bg-black border-cyan-800 focus:border-cyan-500 text-white min-h-[120px]"
                          placeholder="Enter your message"
                        />
                      </div>
                      
                      {formError && (
                        <div className="p-3 bg-red-900/30 border border-red-800 rounded text-red-400 text-xs">
                          {formError}
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black font-medium border-0"
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Encrypting...
                              </>
                            ) : (
                              '$ ./send_message.sh'
                            )}
                          </span>
                          <motion.span 
                            className="absolute inset-0 bg-white"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.5 }}
                            style={{ opacity: 0.2 }}
                          />
                        </Button>
                      </div>
                    </form>
                  )}
                  
                  {/* Data flow animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 data-flow"></div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Security note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-block relative">
              <div className="absolute -inset-1 rounded-xl opacity-50 blur-sm border-glow bg-gradient-to-br from-cyan-500/20 to-purple-600/20"></div>
              <div className="relative px-6 py-3 rounded-xl border border-cyan-500/30 bg-black/60 font-mono text-sm text-cyan-400">
                <span className="mr-2">🔒</span>
                All communications are end-to-end encrypted and secured
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 