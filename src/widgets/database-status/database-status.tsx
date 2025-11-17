'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/shared/api/supabase';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'ready' | 'needs-setup' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  async function checkDatabaseStatus() {
    try {
      const supabase = createClient();

      // Try to query the _migrations table
      const { error } = await supabase
        .from('_migrations')
        .select('name')
        .limit(1);

      if (error) {
        // Table doesn't exist - need to run migrations
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          setStatus('needs-setup');
          setMessage('Database needs initialization');
        } else {
          setStatus('error');
          setMessage(`Database error: ${error.message}`);
        }
      } else {
        // Table exists - database is set up
        setStatus('ready');
        setMessage('Database is ready');
      }
    } catch (error: unknown) {
      setStatus('error');
      setMessage(`Connection error: ${(error as Error).message}`);
    }
  }

  if (status === 'checking') {
    return null;
  }

  if (status === 'ready') {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-sm p-3 px-5 rounded-md text-green-800 dark:text-green-200 flex gap-3 items-center">
        <CheckCircle2 size="16" strokeWidth={2} className="flex-shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  if (status === 'needs-setup') {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-sm p-4 px-5 rounded-md text-yellow-900 dark:text-yellow-200">
        <div className="flex gap-3 items-start mb-3">
          <AlertCircle size="16" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold mb-2">Database Initialization Required</p>
            <p className="mb-3">Your database needs to be set up before you can use the application.</p>
          </div>
        </div>
        <div className="ml-7 space-y-2">
          <p className="font-medium">Choose one option:</p>
          <div className="space-y-3 mt-2">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded">
              <p className="font-medium mb-1">Option 1: Auto-migration (Easiest)</p>
              <p className="text-sm mb-2">Visit the migration endpoint:</p>
              <code className="text-xs bg-yellow-200 dark:bg-yellow-900 px-2 py-1 rounded">
                <a href="/api/migrate" className="hover:underline">/api/migrate</a>
              </code>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded">
              <p className="font-medium mb-1">Option 2: Manual Setup</p>
              <p className="text-sm mb-2">Copy SQL from migrations folder to Supabase SQL Editor</p>
              <a
                href="https://supabase.com/dashboard/project/_/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline hover:no-underline"
              >
                Open SQL Editor →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm p-3 px-5 rounded-md text-red-800 dark:text-red-200 flex gap-3 items-center">
      <XCircle size="16" strokeWidth={2} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
