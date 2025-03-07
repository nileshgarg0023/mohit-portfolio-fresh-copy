'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Blog } from '@/lib/supabase';
import Link from 'next/link';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique tags from all blogs
  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags || [])));

  // Filter blogs by selected tag
  const filteredBlogs = selectedTag
    ? blogs.filter(blog => blog.tags?.includes(selectedTag))
    : blogs;

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Matrix-like background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="cyber-grid"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 cyber-glitch-text" data-text="SECURITY INSIGHTS">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              SECURITY INSIGHTS
            </span>
          </h1>
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="px-4 font-mono text-xs text-cyan-500">CYBERSECURITY BLOG</div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          </div>
          <p className="text-cyan-400/70 max-w-2xl mx-auto font-mono">
            Deep dives into cybersecurity trends, threats, and defensive strategies
          </p>
        </motion.div>

        {/* Tags Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full font-mono text-sm transition-all ${
                !selectedTag
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                  : 'bg-black/50 text-cyan-400/50 border border-cyan-400/20 hover:border-cyan-400/50'
              }`}
            >
              All Posts
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full font-mono text-sm transition-all ${
                  selectedTag === tag
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                    : 'bg-black/50 text-cyan-400/50 border border-cyan-400/20 hover:border-cyan-400/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-black/50 border border-cyan-400/20 rounded-xl p-6 animate-pulse"
              >
                <div className="h-48 bg-cyan-400/10 rounded-lg mb-4"></div>
                <div className="h-6 bg-cyan-400/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-cyan-400/10 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            filteredBlogs.map((blog) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative"
              >
                {/* Glowing border */}
                <div className="absolute -inset-0.5 rounded-xl opacity-75 blur-sm bg-gradient-to-br from-cyan-500/30 to-purple-600/30 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative bg-black/80 backdrop-blur-sm rounded-xl border border-cyan-400/30 overflow-hidden">
                  {/* Blog image */}
                  {blog.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 text-cyan-400 font-mono">
                      {blog.title}
                    </h2>
                    
                    <p className="text-cyan-400/70 mb-4 line-clamp-3 font-mono text-sm">
                      {blog.excerpt || blog.content.substring(0, 150) + '...'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400/50 text-sm font-mono">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm"
                      >
                        Read More
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Animated scan line */}
                  <div className="scan-line"></div>
                </div>
              </motion.article>
            ))
          )}
        </div>

        {/* Empty state */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-cyan-400/70 font-mono">No blog posts found</p>
          </div>
        )}
      </div>
    </div>
  );
} 