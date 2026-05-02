"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Log } from '@/lib/logger';

interface NotificationContextType {
    viewedIds: Set<string>;
    markAsViewed: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem('viewedNotifications');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setViewedIds(new Set(parsed));
                }
            } catch (e) {
                console.error("Failed to parse viewedNotifications from localStorage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        // Save to localStorage whenever viewedIds changes
        if (isLoaded) {
            localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(viewedIds)));
        }
    }, [viewedIds, isLoaded]);

    const markAsViewed = (id: string) => {
        setViewedIds(prev => {
            if (!prev.has(id)) {
                const newSet = new Set(prev);
                newSet.add(id);
                // Fire and forget logging
                Log("frontend", "info", "state", `viewed: ${id.slice(0, 8)}`).catch(console.error);
                return newSet;
            }
            return prev;
        });
    };

    return (
        <NotificationContext.Provider value={{ viewedIds, markAsViewed }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
