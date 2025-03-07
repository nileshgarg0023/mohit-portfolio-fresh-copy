'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Blog } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPost() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog post');
        return;
      }

      setBlog(data);
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-cyan-400 flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-red-400 flex items-center justify-center">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-cyan-400 flex items-center justify-center">
        <div className="text-xl">Blog post not found</div>
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
              <Image 
                src={blog.image_url} 
                alt={blog.title}
                width={1200}
                height={600}
                className="w-full h-96 object-cover rounded-lg border border-cyan-400/30"
              />
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