// admin-panel/src/components/admin/revenue-chart.tsx
'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    downloads: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center text-xs text-muted-foreground">
        Loading chart visualization...
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="downloadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="month" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover border border-border p-3 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-bold text-foreground">{label}</p>
                    <div className="flex items-center gap-2 text-amber-500 font-semibold">
                      <span>Revenue:</span>
                      <span>₹{Number(payload[0]?.value || 0).toLocaleString('en-IN')}</span>
                    </div>
                    {payload[1] && (
                      <div className="flex items-center gap-2 text-blue-500 font-semibold">
                        <span>Downloads:</span>
                        <span>{payload[1]?.value} units</span>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#revenueGradient)"
            name="Revenue (INR)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
