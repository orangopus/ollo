import Link from 'next/link'
import useSWR from 'swr'
import { Auth, Card, Typography, Space, Button, Icon } from '@supabase/ui'
import { supabase } from '../utils/initSupabase'
import { useEffect, useState } from 'react'

const Nav = () => {
  const { user, session } = Auth.useUser()
  const { data, error } = useSWR(session ? ['/api/getUser', session.access_token] : null, fetch)
  const [authView, setAuthView] = useState('sign_in')

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setAuthView('update_password')
      if (event === 'USER_UPDATED') setTimeout(() => setAuthView('sign_in'), 1000)
      // Send session to /api/auth route to set the auth cookie.
      // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
      fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json())
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  if (!user) {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/"><img className="logo" src="logo.png" /></a>
        <form className="form-inline">
          <button onClick={(e) => { e.preventDefault(); window.location.href = '/pro'; }}
            className="buttonwhite">pro</button>
          <Link href="/dashboard">
          <button className="button">login</button>
          </Link>
        </form>
      </nav>
    );
  } 
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/"><img className="logo" src="logo.png" /></a>
        <form className="form-inline">
          <button onClick={() => supabase.auth.signOut()} className="button">logout</button>
        </form>
      </nav>
    );
}

export default Nav;
