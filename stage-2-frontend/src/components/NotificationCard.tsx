"use client";

import React from 'react';
import { Card, CardContent, Typography, Box, Badge, Chip, useTheme } from '@mui/material';
import type { Notification } from '@/lib/types';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationCard({ notification }: { notification: Notification }) {
    const { viewedIds, markAsViewed } = useNotifications();
    const isNew = !viewedIds.has(notification.ID);
    const theme = useTheme();

    const getChipColor = (type: string) => {
        switch (type) {
            case 'Placement': return 'success';
            case 'Result': return 'info';
            case 'Event': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Card 
            onClick={() => {
                if (isNew) markAsViewed(notification.ID);
            }}
            sx={{ 
                mb: 2, 
                cursor: 'pointer',
                borderLeft: isNew ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                backgroundColor: isNew ? 'rgba(144, 202, 249, 0.05)' : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip label={notification.Type} color={getChipColor(notification.Type)} size="small" />
                        {isNew && (
                            <Badge color="primary" variant="dot" invisible={false}>
                                <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>NEW</Typography>
                            </Badge>
                        )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(notification.Timestamp).toLocaleString()}
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    {notification.Message}
                </Typography>
            </CardContent>
        </Card>
    );
}
