'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { supabaseClient } from '@/lib/supabase-client'

type Props = {
    isOpen: boolean
    onClose: () => void
    onChannelCreated: (channel: Channel) => void
}

type Channel = {
    id: string
    name: string
    description?: string
    type: 'public' | 'private'
    created_by: string
    created_at: string
    updated_at: string
}

export default function CreateChannelModal({ isOpen, onClose, onChannelCreated }: Props) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { userId } = useAuth()
    const { user } = useUser()

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        // Client-side validation
        const trimmedName = name.trim()
        if (!trimmedName) {
            setError('Channel name is required')
            setIsLoading(false)
            return
        }

        if (!/^[a-z0-9-_]+$/.test(trimmedName)) {
            setError('Channel name can only contain lowercase letters, numbers, hyphens, and underscores')
            setIsLoading(false)
            return
        }

        try {
            if (!userId || !user) {
                throw new Error('You must be logged in to create a channel')
            }

            // Create the channel in the database
            const { data: newChannel, error: insertError } = await supabaseClient
                .from('channels')
                .insert([
                    {
                        name: trimmedName,
                        description: description.trim(),
                        type: 'public',
                        created_by: userId
                    }
                ])
                .select()
                .single()

            if (insertError) throw insertError
            if (!newChannel) throw new Error('Failed to create channel')

            onChannelCreated(newChannel)
            onClose()

            // Update the URL with the new channel ID
            router.push(`/?channel=${newChannel.id}`)
        } catch (err) {
            console.error('Channel creation error:', err)
            setError(err instanceof Error ? err.message : 'Failed to create channel')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-white mb-4">Create a Channel</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-900 bg-opacity-25 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                            Channel Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. general"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            disabled={isLoading}
                        />
                        <p className="mt-1 text-xs text-gray-400">
                            Lowercase letters, numbers, hyphens and underscores only
                        </p>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                            Description (optional)
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this channel about?"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Channel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 