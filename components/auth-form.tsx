'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setPending(true)
    const result = isSignUp ? await authClient.signUp.email({ name, email, password }) : await authClient.signIn.email({ email, password })
    setPending(false)
    if (result.error) { setError('Impossible de vous authentifier. Vérifiez vos informations et réessayez.'); return }
    router.push('/'); router.refresh()
  }

  return <main className="auth-page"><div className="auth-brand"><div className="brand-mark"><Zap size={16} fill="currentColor" /></div><span>Sentinel<span className="brand-dot">.</span></span></div><section className="auth-card"><div className="eyebrow"><span className="live-dot" /> SECURE ACCESS</div><h1>{isSignUp ? 'Create your account' : 'Welcome back'}<span className="heading-period">.</span></h1><p>{isSignUp ? 'Set up your operations workspace.' : 'Sign in to monitor your plant intelligence.'}</p><form onSubmit={submit}>{isSignUp && <label>Full name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" /></label>}<label>Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></label><label>Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-submit" disabled={pending}>{pending ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'} <span>→</span></button></form><div className="auth-switch">{isSignUp ? 'Already have an account?' : 'New to Sentinel?'} <Link href={isSignUp ? '/sign-in' : '/sign-up'}>{isSignUp ? 'Sign in' : 'Create account'}</Link></div></section><p className="auth-footnote">Protected by Sentinel identity and secure session cookies.</p></main>
}
