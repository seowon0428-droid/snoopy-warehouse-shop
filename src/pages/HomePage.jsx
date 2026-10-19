import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import PromoCarousel from '../components/PromoCarousel'
import { useHomeSection } from '../context/HomeSectionContext'
import { useSearch } from '../context/SearchContext'
import { products } from '../data/products'

const categories = ['전체', ...new Set(products.map((p) => p.category))]

export default function HomePage() {
  const [category, setCategory] = useState('전체')
  const { query } = useSearch()
  const { goToCatalog } = useHomeSection()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const param = searchParams.get('category')
    if (param && categories.includes(param)) {
      setCategory(param)
    } else if (!param && location.hash === '#catalog') {
      setCategory('전체')
    }
  }, [searchParams, location.hash])

  useEffect(() => {
    if (location.hash === '#catalog') {
      goToCatalog()
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash, goToCatalog])

  const filtered = useMemo(() => {
    let list = products
    if (category !== '전체') {
      list = list.filter((p) => p.category === category)
    }
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      )
    }
    return list
  }, [category, query])

  return (
    <div className="page home-page">
      <PromoCarousel />

      <div id="catalog" className="home-catalog">
      <div
        className="category-tabs"
        role="tablist"
        aria-label="카테고리"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            className={`category-tab ${category === cat ? 'category-tab-active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="catalog-meta">
        <p className="catalog-count">총 {filtered.length}개 상품</p>
      </div>

      <ul className="product-grid">
        {filtered.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="catalog-empty">검색 결과가 없습니다.</p>
      )}
      </div>
    </div>
  )
}
