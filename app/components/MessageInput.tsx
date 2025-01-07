'use client'

import React, { useState, useEffect } from 'react'
import { supabaseClient } from '../../lib/supabase-client'
import { useAuth } from '@clerk/nextjs'

type Props = {
    channelId: string
}

export default function MessageInput({ channelId }: Props) {
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { userId } = useAuth()
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

    // Broadcast typing status
    const broadcastTyping = () => {
        if (!userId) return

        supabaseClient.channel(`channel-${channelId}`).send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId }
        })
    }

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)

        // Clear existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }

        // Broadcast typing status
        broadcastTyping()

        // Set new timeout
        const timeout = setTimeout(() => {
            // Typing stopped
        }, 1000)
        setTypingTimeout(timeout)
    }

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout)
            }
        }
    }, [typingTimeout])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!message.trim() || !userId) return

        setIsLoading(true)
        try {
            const { error } = await supabaseClient
                .from('messages')
                .insert([
                    {
                        content: message.trim(),
                        channel_id: channelId,
                        user_id: userId
                    }
                ])

            if (error) throw error
            setMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className={`
                        px-4 py-2 text-white rounded
                        ${isLoading || !message.trim()
                            ? 'bg-blue-500 opacity-50 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }
                    `}
                >
                    Send
                </button>
            </div>
        </form>
    )
} 