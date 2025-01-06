import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateChannelForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const description = formData.get('description') as string

        try {
            const response = await fetch('/api/channels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to create channel')
            }

            const channel = await response.json()
            router.refresh() // Refresh the page to show the new channel
            router.push(`/channels/${channel.id}`) // Redirect to the new channel
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create channel')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Channel Name
                </label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="e.g. project-discussion"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description (optional)
                </label>
                <input
                    id="description"
                    type="text"
                    name="description"
                    maxLength={255}
                    placeholder="What's this channel about?"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-2 text-white rounded-md transition-colors
          ${isLoading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
            >
                {isLoading ? 'Creating...' : 'Create Channel'}
            </button>
        </form>
    )
} 