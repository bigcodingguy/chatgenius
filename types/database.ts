export type Channel = {
    id: number
    name: string
    description: string | null
    type: 'public' | 'private'
    created_by: string
    is_direct: boolean
    created_at: string
}

export type Message = {
    id: number
    content: string
    user_id: string
    channel_id: number
    parent_message_id: number | null
    created_at: string
}

export type ChannelMember = {
    id: number
    user_id: string
    channel_id: number
    created_at: string
}

export type Database = {
    public: {
        Tables: {
            channels: {
                Row: Channel
                Insert: Omit<Channel, 'id' | 'created_at'>
                Update: Partial<Omit<Channel, 'id' | 'created_at'>>
            }
            messages: {
                Row: Message
                Insert: Omit<Message, 'id' | 'created_at'>
                Update: Partial<Omit<Message, 'id' | 'created_at'>>
            }
            channel_members: {
                Row: ChannelMember
                Insert: Omit<ChannelMember, 'id' | 'created_at'>
                Update: Partial<Omit<ChannelMember, 'id' | 'created_at'>>
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
    }
}
