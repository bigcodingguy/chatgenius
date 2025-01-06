'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'

export default function ChannelsPage() {
    const { user } = useUser()

    return (
        <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.firstName || 'User'}!</h1>
            <p className="text-gray-400">
                Select a channel from the sidebar or create a new one to start chatting.
            </p>
        </div>
    )
} 