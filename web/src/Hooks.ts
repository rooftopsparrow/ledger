import { useState, useMemo } from 'react'
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom'

// https://usehooks.com/useLocalStorage/

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      // TODO: validate item is actually T
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })
  function setValue (value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      setStoredValue(value)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
  return [storedValue, setValue];
}