'use client'

import React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

export default function Header() {
    const { user } = useUser()

    return (
        <header className="bg-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Logo and Branding */}
                <Link href="/" className="flex items-center space-x-2">
                    <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <span className="text-xl font-bold text-white">ChatGenius</span>
                </Link>

                {/* User Section */}
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-300">
                            Welcome, {user.firstName || user.username}
                        </span>
                    </div>
                )}
            </div>
        </header>
    )
} 