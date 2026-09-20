import { useState, type FormEvent } from 'react'
import { Activity, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { CinematicIntro } from '../components/CinematicIntro'

type AuthMode = 'sign-in' | 'sign-up'

interface AuthPageProps {
  onAuthenticate: () => void
}

function AuthInput({ icon: Icon, label, ...inputProps }: React.InputHTMLAttributes<HTMLInputElement> & { icon: typeof Mail; label: string }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">{label}</span><span className="relative block"><Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" /><input className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] pl-10 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-400/60 focus:bg-white/[0.07]" {...inputProps} /></span></label>
}

export function AuthPage({ onAuthenticate }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAuthenticate()
  }
  const isSignIn = mode === 'sign-in'
  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setShowPassword(false)
  }

  return (
    <main className="relative grid min-h-[100svh] overflow-x-hidden overflow-y-auto bg-[#050810] text-slate-100 lg:grid-cols-[minmax(0,1.1fr)_minmax(480px,0.9fr)]">
      <CinematicIntro />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_15%_5%,rgba(67,56,202,0.22),transparent_58%),radial-gradient(ellipse_60%_50%_at_95%_95%,rgba(14,116,144,0.16),transparent_62%)]" />
      <section className="relative hidden min-h-[100svh] flex-col justify-between px-10 pb-20 pt-9 lg:flex xl:px-16">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl border border-indigo-300/30 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 shadow-lg shadow-indigo-950/60"><Activity className="size-5 text-white" strokeWidth={2.4} /></span><div><p className="font-display text-xl font-bold tracking-tight text-white">IslaSafe</p><p className="mt-0.5 text-[9px] font-bold tracking-[0.2em] text-slate-500">MDRRMO OPERATIONS</p></div></div>
        <div className="max-w-lg"><span className="mb-6 grid size-14 place-items-center rounded-2xl border border-indigo-300/20 bg-indigo-500/10 text-indigo-200"><ShieldCheck className="size-7" /></span><h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">Coordinated response, when every second matters.</h1><p className="mt-5 max-w-md text-sm leading-7 text-slate-400">A unified workspace for CPG emergency operations, live hazard awareness, evacuation coordination, and resident support.</p><div className="mt-10 grid grid-cols-3 gap-3">{[['23', 'Barangays'], ['15', 'Centers'], ['24/7', 'Monitoring']].map(([value, label]) => <div className="rounded-xl border border-white/8 bg-white/[0.035] p-4" key={label}><p className="font-display text-xl font-bold text-indigo-200">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-slate-500">{label}</p></div>)}</div></div>
        <p className="text-xs text-slate-600">Municipality of President Carlos P. Garcia · Bohol</p>
      </section>

      <section className="relative flex min-h-[100svh] items-center justify-center px-5 pb-20 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
        <div className="w-full max-w-md"><div className="mb-8 flex items-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-xl border border-indigo-300/30 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500"><Activity className="size-5 text-white" /></span><span><span className="block font-display text-lg font-bold text-white">IslaSafe</span><span className="block text-[9px] font-bold tracking-[0.18em] text-slate-500">MDRRMO OPERATIONS</span></span></div>
          <div className="panel p-5 sm:p-7"><div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">Secure admin portal</p><h2 className="mt-2 font-display text-2xl font-bold text-white">{isSignIn ? 'Welcome back' : 'Create your account'}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{isSignIn ? 'Sign in to continue to the operations dashboard.' : 'Register an administrator account for IslaSafe.'}</p></div>
            <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/8 bg-black/15 p-1"><button className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${isSignIn ? 'bg-indigo-500/85 text-white shadow-lg shadow-indigo-950/40' : 'text-slate-500 hover:text-slate-200'}`} onClick={() => switchMode('sign-in')} type="button">Sign in</button><button className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${!isSignIn ? 'bg-indigo-500/85 text-white shadow-lg shadow-indigo-950/40' : 'text-slate-500 hover:text-slate-200'}`} onClick={() => switchMode('sign-up')} type="button">Sign up</button></div>
            <form className="space-y-4" onSubmit={submit}>{!isSignIn && <AuthInput autoComplete="name" icon={UserRound} label="Full name" placeholder="Admin MDRRMO" required type="text" />}<AuthInput autoComplete="email" icon={Mail} label="Email address" onChange={(event) => setEmail(event.target.value)} placeholder="name@cpg.gov.ph" required type="email" value={email} /><label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Password</span><span className="relative block"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" /><input autoComplete={isSignIn ? 'current-password' : 'new-password'} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] pl-10 pr-11 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-400/60 focus:bg-white/[0.07]" placeholder="Enter your password" required type={showPassword ? 'text' : 'password'} /><button aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-white/8 hover:text-slate-200" onClick={() => setShowPassword((current) => !current)} type="button">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>{!isSignIn && <AuthInput autoComplete="new-password" icon={LockKeyhole} label="Confirm password" placeholder="Re-enter your password" required type="password" />}{isSignIn && <div className="flex items-center justify-between gap-3"><label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400"><input className="size-3.5 rounded border-white/20 bg-white/5 accent-indigo-500" type="checkbox" /> Remember me</label><button className="text-xs font-semibold text-indigo-300 hover:text-indigo-200" type="button">Forgot password?</button></div>}<button className="action-button-primary mt-2 h-11 w-full text-sm" type="submit">{isSignIn ? 'Sign in to dashboard' : 'Create account and continue'}<ArrowRight className="size-4" /></button></form>
            <div className="mt-6 border-t border-white/8 pt-5 text-center text-xs text-slate-500">{isSignIn ? <>New to IslaSafe? <button className="font-semibold text-indigo-300 hover:text-indigo-200" onClick={() => switchMode('sign-up')} type="button">Create an account</button></> : <>Already registered? <button className="font-semibold text-indigo-300 hover:text-indigo-200" onClick={() => switchMode('sign-in')} type="button">Sign in</button></>}</div>
          </div><p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-600"><CheckCircle2 className="size-3.5 text-emerald-500/80" /> Authorized MDRRMO personnel only</p>
        </div>
      </section>
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-white/8 bg-[#050810]/85 px-4 py-3 text-center text-[11px] text-slate-500 backdrop-blur-xl">Developed by <span className="font-semibold text-slate-300">Four Sisters and a Wedding</span></footer>
    </main>
  )
}
