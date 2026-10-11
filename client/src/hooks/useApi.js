import { useState, useCallback } from 'react'

/**
 * Custom hook for API calls
 * Returns { data, loading, error, execute }
 */
export function useApi(apiFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiFn(...args)
        setData(result.data)
        return result.data
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Something went wrong'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFn]
  )

  return { data, loading, error, execute }
}

export default useApi
