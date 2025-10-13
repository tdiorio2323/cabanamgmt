'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabaseBrowser } from '@/lib/supabaseBrowser'

interface InviteRedeemerProps {
  code: string
}

export function InviteRedeemer({ code: initialCode }: InviteRedeemerProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated' | 'ok' | 'error'>('checking')
  const [message, setMessage] = useState('')

  const code = (initialCode ?? '').trim().toUpperCase()

  const checkAuthAndRedeem = useCallback(async () => {
    if (!code) {
      setStatus('error')
      setMessage('Invalid invitation link. Request a new invite code.')
      return
    }

    const supabase = supabaseBrowser()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      setStatus('unauthenticated')
      setMessage('Creating your account...')
      setTimeout(() => router.push(`/signup?code=${code}`), 500)
      return
    }

    setStatus('authenticated')

    const response = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (response.ok) {
      setStatus('ok')
      setMessage('Invite accepted! Redirecting…')
      setTimeout(() => router.push('/dashboard'), 1000)
      return
    }

    const payload = await response.json().catch(() => ({}))
    const errorMsg = payload.error || 'Failed to redeem'
    setStatus('error')

    if (errorMsg === 'already_redeemed') {
      setMessage('You have already redeemed this invitation.')
    } else if (errorMsg === 'code_expired') {
      setMessage('This invitation has expired.')
    } else if (errorMsg === 'code_depleted') {
      setMessage('This invitation has been fully used.')
    } else {
      setMessage(errorMsg)
    }
  }, [code, router])

  useEffect(() => {
    checkAuthAndRedeem()
  }, [checkAuthAndRedeem])

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="p-6 rounded-2xl border bg-white/5 backdrop-blur">
        <div className="text-lg">
          {status === 'checking' && 'Processing invitation…'}
          {status === 'unauthenticated' && message}
          {status === 'authenticated' && 'Accepting invitation…'}
          {status === 'ok' && message}
          {status === 'error' && message}
        </div>
        {status === 'error' && (
          <button
            className="mt-3 px-4 py-2 rounded-xl border hover:bg-white/10 transition-colors"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  )
}

export default InviteRedeemer
