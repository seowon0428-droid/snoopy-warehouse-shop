import { useCallback, useEffect, useState } from 'react'

const SLIDES = [
  {
    id: 1,
    label: '스누피 창고',
    lines: ['마음에 담아 키운 스누피,', '하나씩 소중하게 분양합니다.'],
    image: '/promo/1.png',
    alt: '스누피를 안고 있는 일러스트',
  },
  {
    id: 2,
    label: '오픈 기념',
    lines: ['오픈기념 10% 할인합니다.'],
    image: '/promo/2.png',
    alt: '10% 할인 쿠폰',
    artClass: 'promo-art--coupon',
  },
  {
    id: 3,
    label: '오픈 기념',
    lines: ['오픈기념 하나만 사도 무료배송!'],
    image: '/promo/3.png',
    alt: '배송 박스 일러스트',
  },
]

const AUTO_MS = 5000

function IconChevron({ direction }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {direction === 'left' ? (
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export default function PromoCarousel() {
  const [index, setIndex] = useState(0)
  const [autoSeed, setAutoSeed] = useState(0)
  const count = SLIDES.length

  const goTo = useCallback(
    (i) => {
      setIndex((i + count) % count)
      setAutoSeed((s) => s + 1)
    },
    [count],
  )

  const goPrev = useCallback(() => {
    goTo(index - 1)
  }, [goTo, index])

  const goNext = useCallback(() => {
    goTo(index + 1)
  }, [goTo, index])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, AUTO_MS)
    return () => window.clearInterval(timer)
  }, [count, autoSeed])

  return (
    <section
      id="home-top"
      className="promo-carousel"
      aria-roledescription="carousel"
      aria-label="스누피 창고 소식"
    >
      <div className="promo-carousel-viewport" aria-live="polite">
        <button
          type="button"
          className="promo-nav promo-nav-prev"
          aria-label="이전 배너"
          onClick={goPrev}
        >
          <IconChevron direction="left" />
        </button>

        <div
          className="promo-carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <article key={slide.id} className="promo-banner promo-slide">
              <div className="promo-copy">
                <p className="promo-label">{slide.label}</p>
                <p className="promo-title">
                  {slide.lines.map((line) => (
                    <span key={line} className="promo-title-line">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
              <div className={`promo-art ${slide.artClass ?? ''}`}>
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="promo-figure"
                  loading={slide.id === 1 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="promo-nav promo-nav-next"
          aria-label="다음 배너"
          onClick={goNext}
        >
          <IconChevron direction="right" />
        </button>
      </div>

      <div className="promo-dots" role="tablist" aria-label="배너 슬라이드">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === i}
            aria-label={`${i + 1}번째 배너`}
            className={`promo-dot ${index === i ? 'promo-dot-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  )
}
