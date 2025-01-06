# ChatGenius

A real-time communication platform built with Next.js, Supabase, and Clerk.

## Project Overview

ChatGenius is a modern chat application (Slack clone) that enables real-time communication through channels and direct messages. It's designed to provide a seamless, Slack-like experience with a focus on performance and user experience.

## Technical Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Real-time**: Supabase Realtime
- **Styling**: Tailwind CSS

## Core Features (MVP)

### 1. Authentication & User Management
- User registration and login via Clerk
- Profile customization
- Online/offline status indicators
- User presence system

### 2. Messaging System
- Real-time message delivery
- Support for text messages
- Message history and scrollback
- Thread support for conversations
- Emoji reactions to messages
- Read receipts
- Typing indicators

### 3. Channels & Organization
- Public channels
- Private channels (invite-only)
- Direct messaging between users
- Channel creation and management
- Channel discovery
- User roles and permissions

### 4. File Sharing
- Upload and share files
- Image preview
- File type support (images, documents, etc.)
- File size limits and restrictions

### 5. Search & Navigation
- Full-text search for messages
- Channel search
- User search
- Jump to unread messages

## Data Models

### Users
- ID (from Clerk)
- Username
- Display Name
- Avatar URL
- Status
- Last Seen
- Created At

### Channels
- ID
- Name
- Description
- Type (public/private)
- Created By
- Created At
- Updated At

### Channel Members
- Channel ID
- User ID
- Role
- Joined At
- Last Read

### Messages
- ID
- Channel ID
- User ID
- Content
- Type (text/file)
- Parent ID (for threads)
- Created At
- Updated At
- Deleted At

### Attachments
- ID
- Message ID
- File URL
- File Type
- File Size
- Created At

### Reactions
- ID
- Message ID
- User ID
- Emoji
- Created At

## API Endpoints

### Channels
- GET /api/channels - List channels
- POST /api/channels - Create channel
- GET /api/channels/:id - Get channel details
- PUT /api/channels/:id - Update channel
- DELETE /api/channels/:id - Delete channel

### Messages
- GET /api/channels/:id/messages - Get channel messages
- POST /api/channels/:id/messages - Send message
- PUT /api/messages/:id - Edit message
- DELETE /api/messages/:id - Delete message

### Files
- POST /api/files/upload - Upload file
- DELETE /api/files/:id - Delete file

### Search
- GET /api/search/messages - Search messages
- GET /api/search/channels - Search channels
- GET /api/search/users - Search users

## Real-time Features

The application uses Supabase's real-time capabilities for:
- Message delivery
- Typing indicators
- Online presence
- Read receipts
- Reactions

## MVP Launch Requirements

1. **Authentication**
   - Users can sign up and log in
   - Basic profile management

2. **Messaging**
   - Send/receive messages in real-time
   - Basic text formatting
   - Emoji support
   - File attachments

3. **Channels**
   - Create public channels
   - Join/leave channels
   - Channel member list
   - Basic permissions

4. **User Experience**
   - Responsive design
   - Dark mode
   - Loading states
   - Error handling

5. **Performance**
   - Message pagination
   - Optimistic updates
   - Efficient real-time connections

## Future Enhancements

1. **Advanced Features**
   - Voice/video calls
   - Screen sharing
   - Message scheduling
   - Custom emojis

2. **Integration**
   - Third-party app integration
   - Webhooks
   - API access

3. **Administration**
   - Advanced user roles
   - Audit logs
   - Analytics

4. **Enterprise Features**
   - SSO integration
   - Compliance features
   - Data export

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```
4. Run development server: `npm run dev`
5. Visit `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

MIT License
