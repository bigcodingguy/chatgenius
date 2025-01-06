'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Channel } from '../../types/database'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs'
import CreateChannelModal from './CreateChannelModal'

export default function Sidebar() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const pathname = usePathname()
    const { user } = useUser()
    const { signOut } = useAuth()

    useEffect(() => {
        async function fetchChannels() {
            try {
                console.log('Fetching channels...')
                const { data, error } = await supabase
                    .from('channels')
                    .select('*')
                    .eq('type', 'public')
                    .order('created_at', { ascending: true })

                if (error) {
                    console.error('Supabase error:', error)
                    throw error
                }

                console.log('Channels fetched:', data)
                setChannels(data || [])
            } catch (e) {
                console.error('Error fetching channels:', e)
                setError(e instanceof Error ? e.message : 'Failed to load channels')
            } finally {
                setIsLoading(false)
            }
        }

        fetchChannels()
    }, [])

    const handleSignOut = () => {
        signOut()
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
                                    <li key={channel.id}>
                                        <Link
                                            href={`/channels/${channel.id}`}
                                            className={`
                                                flex items-center px-2 py-1 rounded
                                                ${pathname === `/channels/${channel.id}`
                                                    ? 'bg-gray-700 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700'
                                                }
                                            `}
                                        >
                                            <span className="text-gray-400 mr-2">#</span>
                                            {channel.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src={user?.imageUrl || 'https://via.placeholder.com/32'}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="ml-2">
                                <div className="text-sm font-medium text-white">
                                    {user?.fullName || user?.username || 'User'}
                                </div>
                                <div className="text-xs text-gray-400">Online</div>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="text-gray-400 hover:text-white text-sm"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            <CreateChannelModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    )
} 