'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Message } from '../../types/database'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'

type Props = {
    channelId: number
}

type MessageWithUser = Message & {
    user: {
        username: string
        imageUrl: string
    } | null
}

export default function MessageList({ channelId }: Props) {
    const [messages, setMessages] = useState<MessageWithUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
    const { user } = useUser()

    useEffect(() => {
        // Initial fetch of messages
        async function fetchMessages() {
            try {
                const { data, error } = await supabase
                    .from('messages')
                    .select(`
                        *,
                        user:user_id (
                            username:raw_user_meta_data->username,
                            imageUrl:raw_user_meta_data->imageUrl
                        )
                    `)
                    .eq('channel_id', channelId)
                    .order('created_at', { ascending: true })

                if (error) throw error
                setMessages(data || [])
            } catch (error) {
                console.error('Error fetching messages:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMessages()

        // Subscribe to new messages and typing indicators
        const channel = supabase.channel(`channel-${channelId}`)

        // Handle new messages
        channel.on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `channel_id=eq.${channelId}`
        }, async (payload) => {
            // Fetch user data for the new message
            const { data: userData } = await supabase
                .from('users')
                .select('username:raw_user_meta_data->username, imageUrl:raw_user_meta_data->imageUrl')
                .eq('id', payload.new.user_id)
                .single()

            const messageWithUser = {
                ...payload.new,
                user: userData
            } as MessageWithUser

            setMessages(current => [...current, messageWithUser])

            // Remove user from typing indicators when they send a message
            setTypingUsers(current => {
                const updated = new Set(current)
                updated.delete(payload.new.user_id)
                return updated
            })
        })

        // Handle typing indicators
        channel.on('broadcast', { event: 'typing' }, ({ payload }) => {
            if (payload.userId === user?.id) return // Ignore own typing events

            setTypingUsers(current => {
                const updated = new Set(current)
                updated.add(payload.userId)
                return updated
            })

            // Remove user from typing indicators after 2 seconds
            setTimeout(() => {
                setTypingUsers(current => {
                    const updated = new Set(current)
                    updated.delete(payload.userId)
                    return updated
                })
            }, 2000)
        })

        channel.subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [channelId, user?.id])

    if (isLoading) {
        return (
            <div className="flex-1 p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3 animate-pulse">
                        <div className="w-8 h-8 bg-gray-700 rounded-full" />
                        <div className="flex-1">
                            <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
                            <div className="h-4 bg-gray-700 rounded w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
                <div className="text-center text-gray-500">
                    No messages yet. Start the conversation!
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start space-x-3 ${message.user_id === user?.id ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {message.user_id !== user?.id && (
                                <img
                                    src={message.user?.imageUrl || 'https://via.placeholder.com/32'}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <div
                                className={`
                                    max-w-[70%] rounded-lg p-3
                                    ${message.user_id === user?.id
                                        ? 'bg-blue-500 text-white ml-auto'
                                        : 'bg-gray-700 text-white'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">
                                        {message.user_id === user?.id ? 'You' : message.user?.username || 'Unknown User'}
                                    </span>
                                    <span className="text-xs opacity-75 ml-2">
                                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="break-words">{message.content}</div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicators */}
                    {typingUsers.size > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <div className="flex space-x-1">
                                <span className="animate-bounce">•</span>
                                <span className="animate-bounce delay-100">•</span>
                                <span className="animate-bounce delay-200">•</span>
                            </div>
                            <span>
                                {typingUsers.size === 1
                                    ? 'Someone is typing...'
                                    : `${typingUsers.size} people are typing...`}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 