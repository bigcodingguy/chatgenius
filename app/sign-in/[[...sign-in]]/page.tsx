import React from 'react'
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900">
            <div className="w-full py-10 text-center bg-gradient-brand shadow-lg mb-10">
                <h1 className="text-2xl font-bold text-white">ChatGenius</h1>
                <p className="text-white/90 mt-2">Sign in to start chatting</p>
            </div>

            <div className="w-full max-w-[400px] px-4">
                <SignIn
                    appearance={{
                        elements: {
                            card: {
                                backgroundColor: '#1f2937',
                                width: '100%'
                            },
                            headerTitle: {
                                color: 'white',
                                textAlign: 'center'
                            },
                            headerSubtitle: {
                                color: '#9ca3af',
                                textAlign: 'center'
                            },
                            formButtonPrimary: {
                                backgroundColor: '#3B82F6',
                                '&:hover': {
                                    backgroundColor: '#2563eb'
                                }
                            },
                            formFieldLabel: {
                                color: '#d1d5db'
                            },
                            formFieldInput: {
                                backgroundColor: '#374151',
                                borderColor: '#4b5563',
                                color: 'white'
                            },
                            footerActionLink: {
                                color: '#60a5fa'
                            },
                            dividerText: {
                                color: '#9ca3af'
                            }
                        }
                    }}
                />
            </div>
        </div>
    )
} 