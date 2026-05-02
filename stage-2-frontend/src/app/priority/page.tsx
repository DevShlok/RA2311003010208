"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, Slider, Stack } from '@mui/material';
import { fetchNotifications } from '@/lib/api';
import type { Notification, NotificationType } from '@/lib/types';
import NotificationCard from '@/components/NotificationCard';
import { Log } from '@/lib/logger';

const PRIORITY_WEIGHTS: Record<string, number> = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

export default function PriorityInbox() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<NotificationType>("All");
    const [topN, setTopN] = useState<number>(10);

    const loadPriorityNotifications = async () => {
        setLoading(true);
        try {
            // API caps limit at 10, fetch 3 pages to gather enough data
            const pages = await Promise.all([
                fetchNotifications({ limit: 10, page: 1, notification_type: filterType }),
                fetchNotifications({ limit: 10, page: 2, notification_type: filterType }),
                fetchNotifications({ limit: 10, page: 3, notification_type: filterType })
            ]);
            const data = pages.flat();
            
            // Priority Sort Logic from Stage 1
            const sorted = data.sort((a, b) => {
                const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
                const weightB = PRIORITY_WEIGHTS[b.Type] || 0;
                
                if (weightA !== weightB) {
                    return weightB - weightA;
                }
                
                const timeA = new Date(a.Timestamp).getTime();
                const timeB = new Date(b.Timestamp).getTime();
                return timeB - timeA;
            });

            setNotifications(sorted);
            await Log("frontend", "info", "page", `priority loaded: ${filterType}`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPriorityNotifications();
    }, [filterType]);

    const displayedNotifications = notifications.slice(0, topN);

    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Priority Inbox
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel id="type-filter-label">Notification Type</InputLabel>
                    <Select
                        labelId="type-filter-label"
                        value={filterType}
                        label="Notification Type"
                        onChange={(e) => setFilterType(e.target.value as NotificationType)}
                    >
                        <MenuItem value="All">All Types</MenuItem>
                        <MenuItem value="Placement">Placement</MenuItem>
                        <MenuItem value="Result">Result</MenuItem>
                        <MenuItem value="Event">Event</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ flexGrow: 1, px: 2 }}>
                    <Typography gutterBottom variant="body2" color="text.secondary">
                        Top {topN} Notifications
                    </Typography>
                    <Slider
                        value={topN}
                        onChange={(_, newValue) => setTopN(newValue as number)}
                        step={5}
                        marks
                        min={5}
                        max={30}
                        valueLabelDisplay="auto"
                    />
                </Box>
            </Stack>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {displayedNotifications.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary', my: 4 }}>
                            No notifications found.
                        </Typography>
                    ) : (
                        displayedNotifications.map((notif, index) => (
                            <Box key={notif.ID} sx={{ position: 'relative' }}>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        position: 'absolute', 
                                        left: -30, 
                                        top: 20, 
                                        fontWeight: 'bold', 
                                        color: 'text.secondary' 
                                    }}
                                >
                                    #{index + 1}
                                </Typography>
                                <NotificationCard notification={notif} />
                            </Box>
                        ))
                    )}
                </>
            )}
        </Box>
    );
}
