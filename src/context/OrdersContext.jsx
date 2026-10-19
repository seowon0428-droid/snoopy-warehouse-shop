import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getProductById } from '../data/products'

const STORAGE_KEY = 'snoopy-warehouse-orders'

const OrdersContext = createContext(null)

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders)

  const placeOrder = useCallback((cartItems) => {
    const lines = cartItems
      .map((item) => {
        const product = getProductById(item.productId)
        if (!product) return null
        return {
          productId: item.productId,
          quantity: item.quantity,
          name: product.name,
          unitPrice: product.price,
          lineTotal: product.price * item.quantity,
        }
      })
      .filter(Boolean)

    if (lines.length === 0) return null

    const total = lines.reduce((sum, line) => sum + line.lineTotal, 0)
    const order = {
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: '결제완료',
      items: lines,
      total,
    }

    setOrders((prev) => {
      const next = [order, ...prev]
      saveOrders(next)
      return next
    })

    return order
  }, [])

  const value = useMemo(
    () => ({ orders, placeOrder }),
    [orders, placeOrder],
  )

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) {
    throw new Error('useOrders must be used within OrdersProvider')
  }
  return ctx
}
