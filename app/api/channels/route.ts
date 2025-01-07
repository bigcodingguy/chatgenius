import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { getServiceSupabase } from '../../../lib/supabase-client'
import { Database } from '../../../types/database'

// GET /api/channels - List all channels
export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = getServiceSupabase()
        const { data: channels, error } = await supabase
            .from('channels')
            .select('*')
            .eq('type', 'public')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(channels)
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/channels - Create a new channel
export async function POST(request: Request) {
    try {
        const { userId } = await auth()
        console.log('Creating channel for user:', userId)

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        console.log('Request body:', body)
        const { name, description } = body

        // Validate channel name
        if (!name?.trim()) {
            return NextResponse.json({ error: 'Channel name is required' }, { status: 400 })
        }

        if (!/^[a-z0-9-_]+$/.test(name)) {
            return NextResponse.json(
                { error: 'Channel name can only contain lowercase letters, numbers, hyphens, and underscores' },
                { status: 400 }
            )
        }

        const supabase = getServiceSupabase()

        // Check for duplicate channel name
        console.log('Checking for existing channel:', name.trim())
        const { data: existingChannel, error: checkError } = await supabase
            .from('channels')
            .select('id')
            .eq('name', name.trim())
            .single()

        console.log('Existing channel check result:', { existingChannel, error: checkError })

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking for existing channel:', {
                error: checkError,
                code: checkError.code,
                message: checkError.message,
                details: checkError.details
            })
            throw new Error('Failed to check for existing channel')
        }

        if (existingChannel) {
            return NextResponse.json(
                { error: 'A channel with this name already exists' },
                { status: 400 }
            )
        }

        // Create the channel
        const channelData = {
            name: name.trim(),
            description: description?.trim() || null,
            created_by: userId,
            type: 'public',
            is_direct: false
        }
        console.log('Creating channel with data:', channelData)

        const { data: channel, error: channelError } = await supabase
            .from('channels')
            .insert(channelData)
            .select()
            .single()

        if (channelError) {
            console.error('Error creating channel:', {
                error: channelError,
                code: channelError.code,
                message: channelError.message,
                details: channelError.details,
                hint: channelError.hint
            })
            return NextResponse.json(
                { error: `Failed to create channel: ${channelError.message}` },
                { status: 500 }
            )
        }

        if (!channel) {
            console.error('No channel returned after creation')
            return NextResponse.json(
                { error: 'Channel creation failed: no channel returned' },
                { status: 500 }
            )
        }

        console.log('Channel created:', channel)

        // Add creator as channel member
        const memberData = {
            channel_id: channel.id,
            user_id: userId,
            role: 'admin' as const
        }
        console.log('Adding member with data:', memberData)

        const { error: memberError } = await supabase
            .from('channel_members')
            .insert(memberData)

        if (memberError) {
            console.error('Error adding member:', {
                error: memberError,
                code: memberError.code,
                message: memberError.message,
                details: memberError.details,
                hint: memberError.hint
            })
            // Rollback channel creation if member addition fails
            console.log('Rolling back channel creation...')
            await supabase
                .from('channels')
                .delete()
                .eq('id', channel.id)
            return NextResponse.json(
                { error: `Failed to add member to channel: ${memberError.message}` },
                { status: 500 }
            )
        }

        console.log('Channel member added successfully')
        return NextResponse.json(channel)
    } catch (error) {
        console.error('Channel creation error:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        })
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create channel' },
            { status: 500 }
        )
    }
}
