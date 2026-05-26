# Implementation Plan: Real-Time Chat Between Shop and User

This plan outlines the design and changes needed to support real-time chat between customers and shop owners using Socket.io and HTTP API endpoints.

## User Review Required

> [!IMPORTANT]
> **Socket Server Port**: The frontends are pre-configured to look for a Socket server at `${window.location.hostname}:9200`. We will run the Socket.io server directly from the Node backend on port `9200` to avoid changing the frontend configs.
>
> **Message Data Model**: The existing frontends send and expect messages to contain `{ sender: string, text: string }`. We will update the backend `Message` model schema to match these exact field names for simpler integration.

## Proposed Changes

### Backend Components

#### [MODIFY] [package.json](file:///d:/DoAn/Personal-grocery-shopping-app/backend/package.json)
- Add `socket.io` to dependencies.

#### [MODIFY] [Message.js](file:///d:/DoAn/Personal-grocery-shopping-app/backend/models/Message.js)
- Update fields from `senderId` to `sender` and from `content` to `text` to align with the frontend structure.

#### [NEW] [chat.js (controller)](file:///d:/DoAn/Personal-grocery-shopping-app/backend/controllers/chat.js)
- Implement `findOrCreateChat`: Find a chat room for customer and shop, or create one if it doesn't exist. Fetch its message history.
- Implement `getUserChats`: Retrieve all chat rooms involving a specific user, populating the partner's profile information (display name, avatar) and the last message.

#### [NEW] [message.js (controller)](file:///d:/DoAn/Personal-grocery-shopping-app/backend/controllers/message.js)
- Implement `createMessage`: Save a new message and update the associated chat room's `lastMessage` and `lastMessageTime`.

#### [NEW] [chat.js (route)](file:///d:/DoAn/Personal-grocery-shopping-app/backend/routes/chat.js)
- Register endpoints:
  - `GET /chat/find/:user1Id/:user2Id` -> `findOrCreateChat`
  - `GET /chat/user/:userId` -> `getUserChats`

#### [NEW] [message.js (route)](file:///d:/DoAn/Personal-grocery-shopping-app/backend/routes/message.js)
- Register endpoints:
  - `POST /messages` -> `createMessage`

#### [MODIFY] [index.js](file:///d:/DoAn/Personal-grocery-shopping-app/backend/index.js)
- Register `/chat` and `/messages` routes.
- Set up a Socket.io server listening on port `9200`.
- Handle events:
  - `newUser`: Map user ID (`uid`) to socket ID.
  - `refresh`: Look up recipient `uid`'s socket ID and emit `newNoti` to trigger a message list reload on their client.
  - `disconnect`: Clean up the socket mapping.

---

### User Frontend (frontendNew)

#### [MODIFY] [Header.jsx](file:///d:/DoAn/Personal-grocery-shopping-app/frontendNew/src/components/Header.jsx)
- Add a Chat icon button in the header right next to the Profile button.
- When clicked, toggle a floating dropdown showing the list of active chats (fetched from `GET /chat/user/:userId`).
- Clicking on a chat in the dropdown opens the existing `<Chat>` overlay component for that specific shop.

---

### Admin Frontend (frontend-admin)

#### [NEW] [Messages.jsx](file:///d:/DoAn/Personal-grocery-shopping-app/frontend-admin/src/pages/Messages.jsx)
- Create a new dashboard page for managing chat rooms.
- Left column: List of active chat threads for the shop (fetched from `GET /chat/user/:userId`).
- Right column: The `<Message>` component displaying the active conversation.

#### [MODIFY] [index.js (pages)](file:///d:/DoAn/Personal-grocery-shopping-app/frontend-admin/src/pages/index.js)
- Export the new `Messages` page.

#### [MODIFY] [Layout.jsx](file:///d:/DoAn/Personal-grocery-shopping-app/frontend-admin/src/pages/Layout.jsx)
- Add route `<Route path="tin-nhan" element={<Messages />} />` under `/admin`.

#### [MODIFY] [config.js](file:///d:/DoAn/Personal-grocery-shopping-app/frontend-admin/ultis/config.js)
- Add "tin nhắn" to `dashboard.navLinks` and `adminDashboard.navLinks` sidebar configurations.

---

## Verification Plan

### Automated / Manual Connection Tests
1. **Backend & Socket Server Startup**:
   - Run backend server and ensure both port 3000 (Express) and port 9200 (Socket.io) start without issues.
2. **Real-time Chat Flow**:
   - Log in as a customer in `frontendNew` and open a product details page.
   - Click "Chat ngay" to open the chat popup and type a message.
   - Log in as the corresponding shop in `frontend-admin` and go to `/admin/tin-nhan`.
   - Verify that the chat thread shows up, and sending/receiving messages works instantly in real-time.
   - Click the chat button in the `frontendNew` header to verify active chats are listed.
