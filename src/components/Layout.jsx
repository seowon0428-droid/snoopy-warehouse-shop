import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useHomeSection } from '../context/HomeSectionContext'
import { useSearch } from '../context/SearchContext'
import logoHeader from '../../images/logo-header.png'
import logoIcon from '../../images/logo-icon.png'

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconCart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6h15l-1.5 9H7.5L6 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9.5" cy="19" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="19" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function headerTitle(pathname) {
  if (pathname === '/cart') return '장바구니'
  if (pathname === '/menu') return '전체'
  if (pathname.startsWith('/product/')) return '상품 상세'
  return null
}

export default function Layout() {
  const { totalCount } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isOpen, query, setQuery, toggleSearch, closeSearch } = useSearch()
  const { isCatalog, goToTop, goToCatalog: setCatalogSection } = useHomeSection()
  const searchInputRef = useRef(null)
  const subTitle = headerTitle(pathname)
  const isHome = pathname === '/'

  function handleGoTop() {
    goToTop()
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navigate('/')
  }

  function handleGoCatalog() {
    setCatalogSection()
    if (pathname === '/') {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate('/#catalog')
  }

  useEffect(() => {
    if (!isHome) {
      closeSearch()
      goToTop()
    }
  }, [isHome, closeSearch, goToTop])

  useEffect(() => {
    if (isHome && isOpen) {
      searchInputRef.current?.focus()
    }
  }, [isHome, isOpen])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-row">
          {subTitle ? (
            <button
              type="button"
              className="header-back"
              onClick={() => navigate(-1)}
              aria-label="이전 화면"
            >
              ←
            </button>
          ) : (
            <Link to="/" className="brand-logo" onClick={handleGoTop}>
              <img
                src={logoHeader}
                alt="스누피 창고"
                className="brand-logo-image"
                width={290}
                height={77}
              />
              <img
                src={logoIcon}
                alt=""
                className="brand-logo-icon"
                width={304}
                height={285}
                aria-hidden="true"
              />
            </Link>
          )}

          <h1 className="header-title">{subTitle ?? ''}</h1>

          <div className="header-actions">
            {isHome && (
              <button
                type="button"
                className={`icon-btn ${isOpen ? 'icon-btn-active' : ''}`}
                aria-label={isOpen ? '검색 닫기' : '검색 열기'}
                aria-expanded={isOpen}
                onClick={toggleSearch}
              >
                <IconSearch />
              </button>
            )}
            <Link to="/cart" className="icon-btn icon-btn-cart" aria-label="장바구니">
              <IconCart />
              {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
            </Link>
          </div>
        </div>

        {isHome && isOpen && (
          <div className="header-search">
            <div className="search-bar">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="상품명을 검색해 보세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="상품 검색"
              />
            </div>
          </div>
        )}
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="하단 메뉴">
        <NavLink
          to="/"
          end
          className={() =>
            `bottom-nav-item ${isHome && !isCatalog ? 'active' : ''}`
          }
          onClick={handleGoTop}
        >
          <IconHome />
          <span>홈</span>
        </NavLink>
        <button
          type="button"
          className={`bottom-nav-item ${isHome && isCatalog ? 'active' : ''}`}
          onClick={handleGoCatalog}
        >
          <IconGrid />
          <span>창고</span>
        </button>
        <NavLink to="/cart" className="bottom-nav-item">
          <IconCart />
          <span>장바구니</span>
        </NavLink>
        <NavLink to="/menu" className="bottom-nav-item">
          <IconMenu />
          <span>전체</span>
        </NavLink>
      </nav>
    </div>
  )
}
