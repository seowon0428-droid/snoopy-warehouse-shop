import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import { WishlistProvider } from './context/WishlistContext'
import { HomeSectionProvider } from './context/HomeSectionContext'
import { SearchProvider } from './context/SearchContext'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ProductDetailPage from './pages/ProductDetailPage'

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
      <OrdersProvider>
      <SearchProvider>
      <BrowserRouter>
        <HomeSectionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:productId" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="menu" element={<MenuPage />} />
          </Route>
        </Routes>
        </HomeSectionProvider>
      </BrowserRouter>
      </SearchProvider>
      </OrdersProvider>
      </WishlistProvider>
    </CartProvider>
  )
}
