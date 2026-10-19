import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, getDiscountRate, getProductById } from '../data/products'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const product = getProductById(productId)
  const discount = product ? getDiscountRate(product) : null

  if (!product) {
    return (
      <div className="page empty-state">
        <h1>상품을 찾을 수 없습니다</h1>
        <Link to="/" className="btn btn-primary">목록으로</Link>
      </div>
    )
  }

  function handleAdd() {
    addItem(product.id, 1)
    navigate('/cart')
  }

  return (
    <div className="page product-detail">
      <div className="product-detail-visual">
        <img
          src={product.image}
          alt={product.name}
          className="product-photo product-photo-lg"
        />
      </div>

      <div className="product-detail-info">
        <p className="product-brand">{product.brand}</p>
        <h1 className="product-detail-title">{product.name}</h1>

        <div className="product-price-block">
          {discount != null && (
            <span className="product-discount product-discount-lg">{discount}%</span>
          )}
          <span className="product-price product-price-lg">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="product-original product-original-inline">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="product-detail-tags">
          {product.badge && <span className="tag tag-hot">{product.badge}</span>}
          {product.stockLabel && (
            <span className="tag tag-stock">{product.stockLabel}</span>
          )}
          <span className="tag tag-muted">{product.category}</span>
        </div>

        <section className="info-panel">
          <h2>상품 설명</h2>
          <p>{product.description}</p>
        </section>

        <div className="product-actions product-actions-sticky">
          <button type="button" className="btn btn-secondary" onClick={() => addItem(product.id, 1)}>
            담기
          </button>
          <button type="button" className="btn btn-primary" onClick={handleAdd}>
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  )
}
