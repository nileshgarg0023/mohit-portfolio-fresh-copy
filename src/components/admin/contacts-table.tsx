'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Contact } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setError('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status } : contact
      ))
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setContacts(contacts.filter(contact => contact.id !== id))
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-cyan-400 animate-pulse">
        Loading contacts...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-cyan-400">Contact Messages</h2>
        <div className="text-sm text-cyan-400/70">
          {contacts.length} message{contacts.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            {/* Glowing border */}
            <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm bg-gradient-to-br from-cyan-500/30 to-purple-600/30 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-400/30">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-cyan-400">{contact.name}</h3>
                    <span className="text-sm text-cyan-400/70">{contact.email}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      contact.status === 'unread' ? 'bg-yellow-500/20 text-yellow-500' :
                      contact.status === 'read' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                  
                  <div className="text-cyan-400/90 font-medium">{contact.subject}</div>
                  <div className="text-cyan-400/70 text-sm whitespace-pre-wrap">{contact.message}</div>
                  
                  <div className="text-xs text-cyan-400/50">
                    {new Date(contact.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact.id, e.target.value as 'unread' | 'read' | 'replied')}
                    className="bg-black border border-cyan-800 rounded px-2 py-1 text-sm text-cyan-400 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              {/* Animated scan line */}
              <div className="scan-line"></div>
            </div>
          </motion.div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-12 text-cyan-400/70">
            No messages yet
          </div>
        )}
      </div>
    </div>
  )
} 