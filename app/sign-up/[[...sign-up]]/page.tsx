import React from 'react'
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-blue-500 hover:bg-blue-600',
                        card: 'bg-gray-800',
                        headerTitle: 'text-white',
                        headerSubtitle: 'text-gray-400',
                        socialButtonsBlockButton: 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600',
                        dividerLine: 'bg-gray-700',
                        dividerText: 'text-gray-400',
                        formFieldLabel: 'text-gray-300',
                        formFieldInput: 'bg-gray-700 border-gray-600 text-white',
                        footerActionLink: 'text-blue-400 hover:text-blue-500',
                        formFieldAction: 'text-blue-400 hover:text-blue-500',
                    },
                }}
            />
        </div>
    )
} 