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
  email: string
  token?: string
}

// https://usehooks.com/useAuth/

interface UserContext {
  user: User | null,
  error: Error | null,
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
    // TODO Verify data is actually of type User
    let user: User = { token, fullName: u.name, email: u.email }
    setUser(user)
    return user
  }

  async function logout() {
    console.debug('logout')
    setUser(null)
  }

  async function login(form: LoginForm): Promise<User> {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const token = response.headers.get('Authorization')
    let data = await response.json()
    if (!response.ok) {
      throw new Error(data.message)
    }
    // TODO: Verify data is actually of type User
    console.debug('api response', data)
    setUser(data)
    return data as User
  }

  return {
    user,
    error,
    signup,
    login,
    logout
  }
}

const invalidContext = () => Promise.reject(new Error('Invalid User Context! You are attempting to use state that is not in the UserProvider'))

export const userContext = createContext<UserContext>({
  user: null,
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
