// admin-panel/src/components/admin/activity-stream.tsx
'use client';

import React from 'react';
import { Activity, ShieldAlert, Download, DollarSign, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: number;
  type: 'LOG' | 'DOWNLOAD' | 'AUDIT' | 'PAYMENT';
  title: string;
  description: string;
  timestamp: string;
  statusBadge?: string;
}

interface ActivityStreamProps {
  items: ActivityItem[];
}

export function ActivityStream({ items }: ActivityStreamProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'AUDIT':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />;
      case 'DOWNLOAD':
        return <Download className="w-3.5 h-3.5 text-blue-500" />;
      case 'PAYMENT':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const timeAgo = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div
            key={item.id}
            className="flex items-start justify-between p-2.5 rounded-lg hover:bg-secondary/40 border border-transparent hover:border-border transition-all text-xs"
          >
            <div className="flex items-start space-x-3 min-w-0">
              <div className="p-1.5 rounded-md bg-secondary border border-border mt-0.5 shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-foreground truncate">{item.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">{item.description}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 ml-3">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                <Clock className="w-2.5 h-2.5" />
                {timeAgo}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
