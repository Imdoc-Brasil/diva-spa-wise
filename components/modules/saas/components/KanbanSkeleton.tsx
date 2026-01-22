import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function LeadCardSkeleton() {
    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur-sm animate-pulse">
            {/* Health Indicator Line Skeleton */}
            <Skeleton className="absolute top-0 left-6 w-12 h-[2px] rounded-full bg-slate-800" />

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16 rounded-full bg-slate-800" />
                    <Skeleton className="h-5 w-12 rounded-full bg-slate-800" />
                </div>
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-800" />
            </div>

            <div className="space-y-2 mb-5">
                <Skeleton className="h-6 w-3/4 bg-slate-800" />
                <Skeleton className="h-4 w-1/2 bg-slate-800" />
            </div>

            <div className="flex items-center gap-2 mb-5">
                <Skeleton className="flex-1 h-9 rounded-xl bg-slate-800" />
                <Skeleton className="flex-1 h-9 rounded-xl bg-slate-800" />
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-16 bg-slate-800" />
                    <Skeleton className="h-4 w-20 bg-slate-800" />
                </div>
                <div className="text-right space-y-2">
                    <Skeleton className="h-3 w-20 ml-auto bg-slate-800" />
                    <Skeleton className="h-7 w-24 ml-auto rounded bg-slate-800" />
                </div>
            </div>
        </div>
    );
}

export function KanbanColumnSkeleton() {
    return (
        <div className="w-80 flex flex-col shrink-0">
            <div className="flex justify-between items-center mb-5 px-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-2 h-2 rounded-full bg-slate-800" />
                    <Skeleton className="h-3 w-24 bg-slate-800" />
                </div>
                <Skeleton className="h-4 w-6 rounded-full bg-slate-800" />
            </div>

            <div className="space-y-3 pr-2">
                <LeadCardSkeleton />
                <LeadCardSkeleton />
                <div className="opacity-50">
                    <LeadCardSkeleton />
                </div>
            </div>
        </div>
    );
}
