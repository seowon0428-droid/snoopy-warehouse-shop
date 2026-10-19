import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const HomeSectionContext = createContext(null)

export function HomeSectionProvider({ children }) {
  const [section, setSection] = useState('top')

  const goToTop = useCallback(() => setSection('top'), [])
  const goToCatalog = useCallback(() => setSection('catalog'), [])

  const value = useMemo(
    () => ({
      section,
      setSection,
      goToTop,
      goToCatalog,
      isCatalog: section === 'catalog',
    }),
    [section, goToTop, goToCatalog],
  )

  return (
    <HomeSectionContext.Provider value={value}>
      {children}
    </HomeSectionContext.Provider>
  )
}

export function useHomeSection() {
  const ctx = useContext(HomeSectionContext)
  if (!ctx) {
    throw new Error('useHomeSection must be used within HomeSectionProvider')
  }
  return ctx
}
