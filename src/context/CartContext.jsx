import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.productId === action.productId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.productId
              ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
              : i,
          ),
        }
      }
      return {
        items: [
          ...state.items,
          { productId: action.productId, quantity: action.quantity ?? 1 },
        ],
      }
    }
    case 'SET_QUANTITY': {
      const qty = Math.max(0, action.quantity)
      if (qty === 0) {
        return {
          items: state.items.filter((i) => i.productId !== action.productId),
        }
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: qty } : i,
        ),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const value = useMemo(
    () => ({
      items: state.items,
      addItem: (productId, quantity = 1) =>
        dispatch({ type: 'ADD', productId, quantity }),
      setQuantity: (productId, quantity) =>
        dispatch({ type: 'SET_QUANTITY', productId, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      totalCount: state.items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    [state.items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
