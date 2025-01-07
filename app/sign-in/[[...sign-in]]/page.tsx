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
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
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
                                color: '#9ca3af',
                                '&:hover': {
                                    color: '#93c5fd'
                                }
                            },
                            dividerText: {
                                color: '#9ca3af'
                            },
                            socialButtonsBlockButton: {
                                backgroundColor: '#374151',
                                color: 'white',
                                border: '1px solid #4b5563',
                                '&:hover': {
                                    backgroundColor: '#4b5563'
                                }
                            },
                            socialButtonsBlockButtonText: {
                                color: 'white'
                            },
                            footerText: {
                                color: 'white'
                            },
                            formFieldAction: {
                                color: 'white',
                                '&:hover': {
                                    color: '#93c5fd'
                                }
                            },
                            footerAction: {
                                color: '#60a5fa',
                                '&:hover': {
                                    color: '#93c5fd'
                                }
                            },
                            // Style all footer elements
                            rootBox: {
                                '& .cl-footer button, & .cl-footer a, & .cl-footer span': {
                                    color: 'white !important',
                                    '&:hover': {
                                        color: '#93c5fd !important'
                                    }
                                },
                                '& .cl-footerActionLink': {
                                    color: '#60a5fa !important',
                                    '&:hover': {
                                        color: '#93c5fd !important'
                                    }
                                },
                                '& .cl-powered': {
                                    display: 'none !important'
                                }
                            }
                        },
                        layout: {
                            socialButtonsPlacement: "bottom",
                            showOptionalFields: true,
                            privacyPageUrl: "https://clerk.dev/privacy",
                            termsPageUrl: "https://clerk.dev/terms"
                        },
                    }}
                />
            </div>
        </div>
    )
} 