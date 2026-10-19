import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'
import { formatPrice, getProductById } from '../data/products'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, setQuantity, clearCart, totalCount } = useCart()
  const { placeOrder } = useOrders()

  const lines = items
    .map((item) => {
      const product = getProductById(item.productId)
      if (!product) return null
      return { ...item, product, lineTotal: product.price * item.quantity }
    })
    .filter(Boolean)

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)

  if (lines.length === 0) {
    return (
      <div className="page empty-state">
        <div className="empty-illustration" aria-hidden="true">🛒</div>
        <h1>장바구니가 비어 있습니다</h1>
        <p>창고에서 마음에 드는 한 점을 골라 보세요.</p>
        <Link to="/" className="btn btn-primary">상품 보러 가기</Link>
      </div>
    )
  }

  return (
    <div className="page cart-page">
      <p className="cart-subline">{totalCount}개 상품</p>

      <ul className="cart-list">
        {lines.map(({ product, quantity, lineTotal }) => (
          <li key={product.id} className="cart-line">
            <div className="cart-line-thumb">
              <img
                src={product.image}
                alt=""
                className="product-photo"
                aria-hidden="true"
              />
            </div>
            <div className="cart-line-body">
              <p className="product-brand">{product.brand}</p>
              <Link to={`/product/${product.id}`} className="cart-line-title">
                {product.name}
              </Link>
              <p className="cart-line-unit">{formatPrice(product.price)}</p>
              <div className="qty-control">
                <button
                  type="button"
                  aria-label="수량 줄이기"
                  onClick={() => setQuantity(product.id, quantity - 1)}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  aria-label="수량 늘리기"
                  onClick={() => setQuantity(product.id, quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <p className="cart-line-total">{formatPrice(lineTotal)}</p>
          </li>
        ))}
      </ul>

      <aside className="cart-summary">
        <div className="summary-row">
          <span>상품 금액</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="summary-row summary-row-muted">
          <span>배송비</span>
          <span>무료</span>
        </div>
        <div className="summary-row summary-total">
          <span>결제 예정 금액</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => {
            placeOrder(items)
            clearCart()
            navigate('/menu')
          }}
        >
          결제하기
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={clearCart}
        >
          장바구니 비우기
        </button>
      </aside>
    </div>
  )
}
