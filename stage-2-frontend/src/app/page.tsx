"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Stack } from '@mui/material';
import { fetchNotifications } from '@/lib/api';
import type { Notification } from '@/lib/types';
import NotificationCard from '@/components/NotificationCard';
import { Log } from '@/lib/logger';

export default function Home() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadNotifications = async (pageNum: number) => {
        setLoading(true);
        try {
            const data = await fetchNotifications({ limit: 10, page: pageNum });
            if (data.length < 10) {
                setHasMore(false);
            }
            if (pageNum === 1) {
                setNotifications(data);
            } else {
                setNotifications(prev => [...prev, ...data]);
            }
            await Log("frontend", "info", "page", `notifs page ${pageNum} loaded`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications(1);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadNotifications(nextPage);
    };

    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                All Notifications
            </Typography>
            
            {notifications.map(notif => (
                <NotificationCard key={notif.ID} notification={notif} />
            ))}

            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && hasMore && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                    <Button variant="outlined" onClick={handleLoadMore}>
                        Load More
                    </Button>
                </Box>
            )}
            
            {!loading && !hasMore && notifications.length > 0 && (
                <Typography sx={{ textAlign: 'center', color: 'text.secondary', my: 4 }}>
                    No more notifications
                </Typography>
            )}
        </Box>
    );
}
