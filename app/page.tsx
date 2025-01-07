'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { redirect, useSearchParams } from 'next/navigation'
import MessageList from './components/MessageList'
import MessageInput from './components/MessageInput'
import { supabaseClient } from '../lib/supabase-client'

export default function Home() {
  const { userId } = useAuth()
  const [channelId, setChannelId] = useState<string | null>(null)
  const [channelName, setChannelName] = useState<string>('general')
  const searchParams = useSearchParams()
  const channelIdParam = searchParams.get('channel')

  useEffect(() => {
    if (!userId) return

    async function fetchChannel() {
      // If we have a channel ID in the URL, use that
      if (channelIdParam) {
        const { data, error } = await supabaseClient
          .from('channels')
          .select('id, name')
          .eq('id', channelIdParam)
          .single()

        if (error) {
          console.error('Error fetching channel:', error)
          return
        }

        if (data) {
          setChannelId(data.id)
          setChannelName(data.name)
          return
        }
      }

      // Otherwise, fetch the general channel
      const { data, error } = await supabaseClient
        .from('channels')
        .select('id, name')
        .eq('name', 'general')
        .single()

      if (error) {
        console.error('Error fetching channel:', error)
        return
      }

      if (data) {
        setChannelId(data.id)
        setChannelName(data.name)
      }
    }

    fetchChannel()
  }, [userId, channelIdParam])

  if (!userId) {
    redirect('/sign-in')
  }

  if (!channelId) {
    return <div className="h-[100dvh] flex items-center justify-center bg-gray-900 text-white">Loading...</div>
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex-none h-16 p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold"># {channelName}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageList channelId={channelId} />
      </div>

      {/* Input */}
      <div className="flex-none w-full bg-gray-900">
        <MessageInput channelId={channelId} />
      </div>
    </div>
  )
}