import React from 'react'
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#1a1a1a'
        }}>
            <div style={{
                width: '100%',
                padding: '40px 0',
                textAlign: 'center',
                backgroundColor: '#3B82F6',
                marginBottom: '40px'
            }}>
                <h1 style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                }}>ChatGenius</h1>
                <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    marginTop: '8px'
                }}>Sign in to start chatting</p>
            </div>

            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0 16px'
            }}>
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