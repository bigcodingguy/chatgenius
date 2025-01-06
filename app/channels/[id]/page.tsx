'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MessageList from '../../components/MessageList'
import MessageInput from '../../components/MessageInput'
import { supabase } from '../../../lib/supabase'
import { Channel } from '../../../types/database'

export default function ChannelPage() {
    const params = useParams()
    const channelId = parseInt(params.id as string)
    const [channel, setChannel] = useState<Channel | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchChannel() {
            try {
                const { data, error } = await supabase
                    .from('channels')
                    .select('*')
                    .eq('id', channelId)
                    .single()

                if (error) throw error
                setChannel(data)
            } catch (err) {
                console.error('Error fetching channel:', err)
                setError('Channel not found')
            }
        }

        if (channelId) {
            fetchChannel()
        }
    }, [channelId])

    if (error) {
        return (
            <div className="p-6 text-red-500">
                {error}
            </div>
        )
    }

    if (!channel) {
        return (
            <div className="p-6">
                Loading...
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Channel Header */}
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold">#{channel.name}</h1>
                {channel.description && (
                    <p className="text-sm text-gray-400 mt-1">{channel.description}</p>
                )}
            </div>

            {/* Messages */}
            <MessageList channelId={channelId} />

            {/* Message Input */}
            <MessageInput channelId={channelId} />
        </div>
    )
} 