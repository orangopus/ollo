import Link from 'next/link'
import useSWR from 'swr'
import { Auth, Card, Typography, Space, Button, Icon } from '@supabase/ui'
import { supabase } from '../utils/initSupabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const fetcher = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  }).then((res) => res.json())

const Nav = () => {
  const session = supabase.auth.session()
  console.log(supabase.auth.session())

  const hostname = window.location.hostname

  let hostName = hostname;

  if (hostName = "localhost:3000") {
    hostName = `<a className="navbar-brand" href="/"><img className="logo" style="max-height: 75px;"  src="../logo.png" /></a>`
  }
  else if (hostName = "streamer.is") {
    hostName = `<a className="navbar-brand" href="/"><img className="logo" style="max-height: 75px;" src="../logo-streameris.png" /></a>`
  }
  else {
    hostName = `<a className="navbar-brand" href="/"><img className="logo" style="max-height: 75px;" src="../logo.png" /></a>`
  }

  console.log(hostName)

  const router = useRouter()

  const { data, error } = useSWR(session ? ['/api/getUser', session.access_token] : null, fetcher)
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

  if (session) {
    return (
      <nav className="navbar">
      <div className="navbar-brand" dangerouslySetInnerHTML={{ __html: hostName }} />   
      <form className="form-inline">
        <button onClick={() => {supabase.auth.signOut(); router.push("/")}} className="button">logout</button>
      </form>
    </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <div className="navbar-brand" dangerouslySetInnerHTML={{ __html: hostName }} />
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
}

export default Nav;
