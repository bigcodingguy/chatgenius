export type Message = {
    id: string
    channel_id: string
    user_id: string
    content: string
    created_at: string
    updated_at: string
    type: 'text' | 'file'
    parent_id?: string | null
    deleted_at?: string | null
}

export type Channel = {
    id: string
    name: string
    description?: string | null
    type: 'public' | 'private'
    created_by: string
    created_at: string
    updated_at: string
    is_direct: boolean
} 