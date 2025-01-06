'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useAuth, useUser } from '@clerk/nextjs'

type Props = {
    isOpen: boolean
    onClose: () => void
}

export default function CreateChannelModal({ isOpen, onClose }: Props) {
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

        try {
            if (!userId || !user) {
                throw new Error('You must be logged in to create a channel')
            }

            // Validate channel name
            if (!name.trim()) {
                throw new Error('Channel name is required')
            }

            if (!/^[a-z0-9-_]+$/.test(name)) {
                throw new Error('Channel name can only contain lowercase letters, numbers, hyphens, and underscores')
            }

            // Check for duplicate channel name
            const { data: existingChannel, error: checkError } = await supabase
                .from('channels')
                .select('id')
                .eq('name', name.trim())
                .single()

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Error checking for existing channel:', checkError)
                throw new Error('Failed to check for existing channel')
            }

            if (existingChannel) {
                throw new Error('A channel with this name already exists')
            }

            const channelData = {
                name: name.trim(),
                description: description.trim() || null,
                created_by: userId,
                type: 'public',
                is_direct: false
            }

            console.log('Creating channel with data:', channelData)

            // Create the channel
            const { data: channel, error: channelError } = await supabase
                .from('channels')
                .insert([channelData])
                .select()
                .single()

            if (channelError) {
                console.error('Error creating channel:', channelError)
                throw new Error(`Failed to create channel: ${channelError.message}`)
            }

            if (!channel) {
                throw new Error('Channel was not created')
            }

            console.log('Channel created:', channel)

            // Add creator as channel member
            const memberData = {
                channel_id: channel.id,
                user_id: userId
            }

            console.log('Adding member with data:', memberData)

            const { error: memberError } = await supabase
                .from('channel_members')
                .insert([memberData])

            if (memberError) {
                console.error('Error adding member:', memberError)
                // Rollback channel creation if member addition fails
                await supabase
                    .from('channels')
                    .delete()
                    .eq('id', channel.id)
                throw new Error(`Failed to add member to channel: ${memberError.message}`)
            }

            console.log('Channel member added successfully')
            router.refresh()
            onClose()
            router.push(`/channels/${channel.id}`)
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

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                px-4 py-2 text-sm text-white rounded
                                ${isLoading
                                    ? 'bg-blue-500 opacity-50 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }
                            `}
                        >
                            {isLoading ? 'Creating...' : 'Create Channel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 