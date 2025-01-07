'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs'
import { supabaseClient } from '@/lib/supabase-client'
import CreateChannelModal from './CreateChannelModal'

type Channel = {
    id: string
    name: string
    description?: string
    type: 'public' | 'private'
    created_by: string
    created_at: string
    updated_at: string
}

export default function Sidebar() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentChannelId = searchParams.get('channel')
    const { user } = useUser()
    const { signOut } = useAuth()

    useEffect(() => {
        async function fetchChannels() {
            try {
                const { data, error } = await supabaseClient
                    .from('channels')
                    .select('*')
                    .order('name')

                if (error) throw error
                setChannels(data || [])
            } catch (err) {
                console.error('Error fetching channels:', err)
                setError('Failed to load channels')
            } finally {
                setIsLoading(false)
            }
        }

        fetchChannels()

        // Subscribe to channel changes
        const channel = supabaseClient
            .channel('schema-db-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'channels'
            }, () => {
                fetchChannels()
            })
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [])

    const handleSignOut = () => {
        signOut()
    }

    const handleDeleteChannel = async (channelId: string, channelName: string) => {
        if (!confirm(`Are you sure you want to delete #${channelName}?`)) {
            return
        }

        try {
            const { error } = await supabaseClient
                .from('channels')
                .delete()
                .eq('id', channelId)

            if (error) throw error

            // Update local state immediately
            setChannels(prev => prev.filter(c => c.id !== channelId))

            // If we're currently viewing the deleted channel, go to another channel
            if (currentChannelId === channelId) {
                const firstChannel = channels.find(c => c.id !== channelId)
                if (firstChannel) {
                    router.push(`/?channel=${firstChannel.id}`)
                }
            }
        } catch (err) {
            console.error('Error deleting channel:', err)
            alert('Failed to delete channel')
        }
    }

    return (
        <>
            <aside className="w-64 bg-gray-800 h-screen flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-white">ChatGenius</h1>
                </div>

                {/* Channels List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-gray-400 uppercase text-sm font-semibold">Channels</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="text-gray-400 hover:text-white text-sm flex items-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Add
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="text-gray-500">Loading channels...</div>
                        ) : error ? (
                            <div className="text-red-400">{error}</div>
                        ) : channels.length === 0 ? (
                            <div className="text-gray-500">No channels yet</div>
                        ) : (
                            <ul className="space-y-1">
                                {channels.map((channel) => (
                                    <li key={channel.id} className="group flex items-center">
                                        <Link
                                            href={`/?channel=${channel.id}`}
                                            className={`
                                                flex-1 flex items-center px-2 py-1 rounded-l
                                                ${currentChannelId === channel.id
                                                    ? 'bg-gray-700 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700'
                                                }
                                            `}
                                        >
                                            <span className="text-gray-400 mr-2">#</span>
                                            {channel.name}
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteChannel(channel.id, channel.name)}
                                            className={`
                                                p-1 opacity-0 group-hover:opacity-100
                                                ${currentChannelId === channel.id
                                                    ? 'bg-gray-700 text-red-400 hover:text-red-300'
                                                    : 'bg-gray-800 text-gray-400 hover:text-red-400'
                                                }
                                                rounded-r transition-opacity duration-200
                                            `}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* User Section */}
                    <div className="mt-auto pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={user?.imageUrl || 'https://via.placeholder.com/32'}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <span className="text-white">{user?.username || user?.firstName || 'User'}</span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <CreateChannelModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onChannelCreated={(channel) => {
                    setChannels(prev => [...prev, channel].sort((a, b) => a.name.localeCompare(b.name)))
                }}
            />
        </>
    )
} 