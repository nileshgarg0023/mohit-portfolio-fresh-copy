'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-cyan-400 flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-cyan-400">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(0,255,255,0.1)_50%,transparent_52%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-cyan-400/30 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-cyan-400 text-xl font-bold">Portfolio Admin</div>
          <Button
            onClick={handleSignOut}
            className="bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 border border-cyan-400/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
          >
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
} 