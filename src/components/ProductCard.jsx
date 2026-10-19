import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice, getDiscountRate } from '../data/products'

export default function ProductCard({ product }) {
  const { isWished, toggleWish } = useWishlist()
  const wished = isWished(product.id)
  const discount = getDiscountRate(product)

  return (
    <article className="product-card">
      <div className="product-thumb-wrap">
        <Link to={`/product/${product.id}`} className="product-thumb">
          <img
            src={product.image}
            alt={product.name}
            className="product-photo"
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          className={`wish-btn ${wished ? 'wish-btn-on' : ''}`}
          aria-label={wished ? '찜 해제' : '찜하기'}
          onClick={(e) => {
            e.preventDefault()
            toggleWish(product.id)
          }}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>
      <Link to={`/product/${product.id}`} className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h2 className="product-name">{product.name}</h2>
        <div className="product-price-row">
          {discount != null && (
            <span className="product-discount">{discount}%</span>
          )}
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        {product.originalPrice > product.price && (
          <p className="product-original">{formatPrice(product.originalPrice)}</p>
        )}
        <div className="product-card-tags">
          {product.badge && <span className="tag tag-hot">{product.badge}</span>}
          {product.stockLabel && (
            <span className="tag tag-stock">{product.stockLabel}</span>
          )}
        </div>
      </Link>
    </article>
  )
}
