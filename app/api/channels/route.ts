import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '../../../lib/supabase'
import { Channel } from '../../../types/database'

// Validation helpers
const CHANNEL_NAME_REGEX = /^[a-z0-9-_]+$/
const validateChannelName = (name: string) => {
    if (!name?.trim()) {
        return 'Channel name is required'
    }
    if (!CHANNEL_NAME_REGEX.test(name)) {
        return 'Channel name can only contain lowercase letters, numbers, hyphens, and underscores'
    }
    return null
}

type CreateChannelRequest = {
    name: string
    description?: string
}

// GET /api/channels - List all channels
export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: channels, error } = await supabase
            .from('channels')
            .select('*')
            .eq('type', 'public')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(channels as Channel[])
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/channels - Create a new channel
export async function POST(request: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const json = await request.json() as CreateChannelRequest
        const { name, description } = json

        // Validate channel name
        const nameError = validateChannelName(name)
        if (nameError) {
            return NextResponse.json({ error: nameError }, { status: 400 })
        }

        // Check for duplicate channel name
        const { data: existingChannel } = await supabase
            .from('channels')
            .select('id')
            .eq('name', name.trim())
            .single()

        if (existingChannel) {
            return NextResponse.json(
                { error: 'A channel with this name already exists' },
                { status: 400 }
            )
        }

        // Create the channel
        const { data: channel, error: channelError } = await supabase
            .from('channels')
            .insert([
                {
                    name: name.trim(),
                    description: description?.trim(),
                    created_by: userId,
                    type: 'public',
                    is_direct: false
                }
            ])
            .select()
            .single()

        if (channelError) throw channelError

        // Add the creator as a channel member
        const { error: memberError } = await supabase
            .from('channel_members')
            .insert([
                {
                    channel_id: channel.id,
                    user_id: userId
                }
            ])

        if (memberError) {
            // If member creation fails, delete the channel and throw error
            await supabase
                .from('channels')
                .delete()
                .eq('id', channel.id)
            throw memberError
        }

        return NextResponse.json(channel as Channel)
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Failed to create channel' },
            { status: 500 }
        )
    }
}
