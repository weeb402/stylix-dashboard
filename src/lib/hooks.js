import { useEffect, useState } from 'react'

export function useNow(stepMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), stepMs)
    return () => clearInterval(t)
  }, [stepMs])
  return now
}