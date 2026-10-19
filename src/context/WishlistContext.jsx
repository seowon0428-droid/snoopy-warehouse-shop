import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'snoopy-warehouse-wishlist'

const WishlistContext = createContext(null)

function loadIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function WishlistProvider({ children }) {
  const [productIds, setProductIds] = useState(loadIds)

  const toggleWish = useCallback((productId) => {
    setProductIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
      saveIds(next)
      return next
    })
  }, [])

  const isWished = useCallback(
    (productId) => productIds.includes(productId),
    [productIds],
  )

  const value = useMemo(
    () => ({
      productIds,
      wishCount: productIds.length,
      toggleWish,
      isWished,
    }),
    [productIds, toggleWish, isWished],
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return ctx
}
