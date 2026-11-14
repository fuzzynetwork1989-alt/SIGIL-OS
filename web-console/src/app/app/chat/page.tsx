'use client'

import { useRouter } from 'next/navigation'
import { NextGenChatInterface } from '../../../components/chat/NextGenChatInterface'

export default function ChatPage() {
  const router = useRouter()

  return <NextGenChatInterface onBack={() => router.push('/')} />
}
