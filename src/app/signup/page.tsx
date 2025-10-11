'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { toast } from 'sonner'
import GlassCard from '@/components/ui/GlassCard'
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react'
import { logger } from '@/lib/logger'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteCode = searchParams?.get('code')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteValid, setInviteValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (inviteCode) {
      // Validate invite code
      fetch(`/api/invites/validate?code=${inviteCode}`)
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            setInviteValid(true)
            toast.success('Valid invitation code!')
          } else {
            setInviteValid(false)
            toast.error('Invalid or expired invitation code')
          }
        })
        .catch(() => {
          setInviteValid(false)
        })
    }
  }, [inviteCode])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const supabase = supabaseBrowser()

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            invite_code: inviteCode || null
          }
        }
      })

      if (error) throw error

      if (data.user) {
        toast.success('Account created successfully!')

        // If there's an invite code, redeem it
        if (inviteCode) {
          // Wait a moment for session to be established
          await new Promise(resolve => setTimeout(resolve, 1000))

          const redeemResponse = await fetch('/api/invites/accept', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ code: inviteCode })
          })

          if (redeemResponse.ok) {
            toast.success('Invitation accepted!')
            router.push('/dashboard')
          } else {
            toast.warning('Account created but invite redemption failed. Contact support.')
            router.push('/dashboard')
          }
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      logger.error('Signup error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            {inviteCode && inviteValid && (
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Invitation code applied</span>
              </div>
            )}
            {inviteCode && inviteValid === false && (
              <div className="text-red-400 text-sm">
                Invalid invitation code
              </div>
            )}
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="frosted-input w-full pl-10"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="frosted-input w-full pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="frosted-input w-full pl-10"
                required
                minLength={6}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="frosted-input w-full pl-10"
                required
                minLength={6}
              />
            </div>

            {inviteCode && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="text-sm text-blue-300">
                  <strong>Invite Code:</strong> {inviteCode}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Boolean(inviteCode && inviteValid === false)}
              className="liquid-btn w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 underline">
              Sign in
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
