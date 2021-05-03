import { createElement, createContext, useContext, useState } from 'react'
import { useLocalStorage } from './Hooks'
import jwtDecode, { JwtPayload } from "jwt-decode"

const STORAGE = 'ledger'

export interface LoginForm {
  email: string,
  password: string
}

export interface SignupForm {
  name: string,
  email: string,
  password: string,
  confirm: string,
}

export interface User {
  fullName: string
  token?: string
  accessToken?: string
}

type TokenPayload = JwtPayload & { name: string }

// https://usehooks.com/useAuth/

interface UserContext {
  user: User | null
  error: Error | null
  setAccessToken: (token: string) => void
  signup: (form: SignupForm) => Promise<User>
  login: (form: LoginForm) => Promise<User>
  logout: () => Promise<void>
}

function useAuthState(): UserContext {
  const [ user, setUser ] = useLocalStorage<User|null>(STORAGE, null)
  const [ error, setError ] = useState<Error|null>(null)
  async function signup (u: SignupForm): Promise<User> {
    const form = new FormData()
    for (let [key, value] of Object.entries(u)) {
      form.append(key, value)
    }
    const response = await fetch('/api/welcome', {
      method: 'POST',
      body: form
    })
    let token = await response.text()
    if (!response.ok) {
      // setError(token)
      throw new Error(token)
    }
    const data: TokenPayload = jwtDecode(token)
    // TODO Verify data is actually of type User
    let user: User = { token, fullName: data.name }
    setUser(user)
    return user
  }

  function setAccessToken(token: string) {
    user!.accessToken = token
    setUser(user)
  }

  async function logout() {
    console.debug('logout')
    setUser(null)
  }

  async function login(f: LoginForm): Promise<User> {
    const form = new FormData()
    for (let [key, value] of Object.entries(f)) {
      form.append(key, value)
    }
    const response = await fetch('/api/login', {
      method: 'POST',
      body: form
    })
    if (!response.ok) {
      const detail = await response.json()
      const message = detail?.message || response.statusText
      throw new Error(message)
    }
    const token = await response.text()
    const data: TokenPayload = jwtDecode(token)
    console.debug('login response', data)
    const user: User = { token, fullName: data.name }
    setUser(user)
    return user
  }

  return {
    user,
    error,
    setAccessToken,
    signup,
    login,
    logout
  }
}

const invalidContext = () => Promise.reject(new Error('Invalid User Context! You are attempting to use state that is not in the UserProvider'))

export const userContext = createContext<UserContext>({
  user: null,
  setAccessToken: () => {},
  error: new Error('Invalid Context'),
  signup: invalidContext,
  login: invalidContext,
  logout: invalidContext
})

// React component for hydrating the context of the tree
export function ProvideAuth(props: { children?: React.ReactNode }) {
  const auth = useAuthState()
  return createElement(userContext.Provider, { value: auth }, props.children)
}

export function useAuth() {
  return useContext(userContext)
}
