'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Blog } from '@/lib/supabase';
import Link from 'next/link';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse font-mono">Loading post...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 font-mono">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Matrix-like background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="cyber-grid"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 font-mono group"
          >
            <svg
              className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>

          {/* Blog header */}
          <div className="relative rounded-xl overflow-hidden mb-8">
            {blog.image_url && (
              <div className="relative h-[400px]">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>
            )}
            
            <div className={`${blog.image_url ? 'absolute bottom-0 left-0 right-0' : ''} p-8`}>
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-400 text-sm font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-mono">
                {blog.title}
              </h1>
              
              <div className="text-cyan-400/70 font-mono">
                {new Date(blog.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Blog content */}
          <div className="prose prose-invert prose-cyan max-w-none">
            <div className="relative bg-black/80 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-8 font-mono leading-relaxed">
              {/* Excerpt */}
              {blog.excerpt && (
                <div className="mb-8 text-lg text-cyan-400/90 border-l-4 border-cyan-400/30 pl-4">
                  {blog.excerpt}
                </div>
              )}
              
              {/* Main content */}
              <div className="space-y-6 text-cyan-400/80">
                {blog.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Animated scan line */}
              <div className="scan-line"></div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
} 