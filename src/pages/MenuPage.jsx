import { Link } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice, getProductById } from '../data/products'

function formatOrderDate(iso) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default function MenuPage() {
  const { orders } = useOrders()
  const { productIds, toggleWish } = useWishlist()
  const wishProducts = productIds
    .map((id) => getProductById(id))
    .filter(Boolean)

  return (
    <div className="page menu-page">
      <section className="menu-intro" aria-labelledby="menu-intro-title">
        <p className="menu-intro-badge">스누피 창고</p>
        <h1 id="menu-intro-title" className="menu-intro-title">
          마음에 담아 키운 스누피,
          <br />
          하나씩 소중하게 분양합니다.
        </h1>
        <p className="menu-intro-text">
          개인이 모아 두었던 굿즈를 한 점씩 새 주인에게 보내는 작은 창고입니다.
          <br />
          상품마다 수량이 달라, 준비된 만큼만 올려 둡니다.
        </p>
      </section>

      <section className="menu-section" aria-labelledby="menu-wishlist">
        <h2 id="menu-wishlist" className="menu-section-title">찜 목록</h2>
        {wishProducts.length === 0 ? (
          <div className="menu-orders-empty">
            <p>찜한 상품이 없습니다.</p>
            <p className="menu-orders-empty-hint">
              상품 카드의 ♡를 누르면 여기에 모입니다.
            </p>
          </div>
        ) : (
          <ul className="menu-wish-list">
            {wishProducts.map((product) => (
              <li key={product.id} className="menu-wish-item">
                <Link to={`/product/${product.id}`} className="menu-wish-link">
                  <img
                    src={product.image}
                    alt=""
                    className="menu-wish-thumb product-photo"
                    aria-hidden="true"
                  />
                  <span className="menu-wish-info">
                    <span className="menu-wish-name">{product.name}</span>
                    <span className="menu-wish-price">
                      {formatPrice(product.price)}
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  className="menu-wish-remove wish-btn-on"
                  aria-label="찜 해제"
                  onClick={() => toggleWish(product.id)}
                >
                  ♥
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="menu-section" aria-labelledby="menu-orders">
        <h2 id="menu-orders" className="menu-section-title">주문내역</h2>
        {orders.length === 0 ? (
          <div className="menu-orders-empty">
            <p>아직 주문 내역이 없습니다.</p>
            <p className="menu-orders-empty-hint">
              장바구니에서 결제하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <ul className="menu-orders-list">
            {orders.map((order) => (
              <li key={order.id} className="menu-order-card">
                <div className="menu-order-head">
                  <time dateTime={order.createdAt}>
                    {formatOrderDate(order.createdAt)}
                  </time>
                  <span className="menu-order-status">{order.status}</span>
                </div>
                <ul className="menu-order-lines">
                  {order.items.map((line) => (
                    <li key={`${order.id}-${line.productId}`}>
                      <span className="menu-order-line-name">{line.name}</span>
                      <span className="menu-order-line-meta">
                        {line.quantity}개 · {formatPrice(line.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="menu-order-total">
                  합계 <strong>{formatPrice(order.total)}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="menu-section" aria-labelledby="menu-contact">
        <h2 id="menu-contact" className="menu-section-title">문의</h2>
        <p className="menu-contact-lead">
          상품 상태·분양 일정이 궁금하시면 편하게 연락해 주세요.
        </p>
        <div className="menu-contact-actions">
          <a className="menu-contact-btn" href="mailto:hello@snoopy-warehouse.example">
            이메일 문의
          </a>
          <a
            className="menu-contact-btn menu-contact-btn-muted"
            href="tel:01000000000"
          >
            전화문의
          </a>
        </div>
      </section>
    </div>
  )
}
