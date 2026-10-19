import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const toggleSearch = useCallback(() => {
    setIsOpen((open) => !open)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      isOpen,
      query,
      setQuery,
      toggleSearch,
      closeSearch,
    }),
    [isOpen, query, toggleSearch, closeSearch],
  )

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return ctx
}
