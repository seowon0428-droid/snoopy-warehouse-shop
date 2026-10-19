import petBowlImg from '../../images/제품사진/강아지밥그릇.png'
import cushionImg from '../../images/제품사진/쿠션.png'
import ecoBagImg from '../../images/제품사진/에코백.png'
import keyringImg from '../../images/제품사진/키링.png'
import mugImg from '../../images/제품사진/머그컵.png'
import notebookImg from '../../images/제품사진/공책.png'
import stickerImg from '../../images/제품사진/스티커.png'

const DISCOUNT_RATE = 10

function originalPriceAtDiscount(price, ratePercent = DISCOUNT_RATE) {
  return Math.round(price / (1 - ratePercent / 100))
}

export const products = [
  {
    id: 'mug-01',
    brand: 'PEANUTS',
    name: '스누피 머그컵 350ml',
    category: '생활용품',
    price: 18900,
    originalPrice: originalPriceAtDiscount(18900),
    image: mugImg,
    description:
      '집이나 사무실에서 쓰기 좋은 350ml 머그. 식기세척기 사용 가능.',
    badge: '인기',
    stockLabel: '여유',
  },
  {
    id: 'pet-bowl-01',
    brand: 'PEANUTS',
    name: '스누피 강아지 밥그릇',
    category: '생활용품',
    price: 16900,
    originalPrice: originalPriceAtDiscount(16900),
    image: petBowlImg,
    description:
      '반려견 식사용 밥그릇. 미끄럼 방지 받침과 넉넉한 용량.',
    stockLabel: '여유',
  },
  {
    id: 'tote-01',
    brand: 'PEANUTS',
    name: '스누피 에코백',
    category: '가방',
    price: 24900,
    originalPrice: originalPriceAtDiscount(24900),
    image: ecoBagImg,
    description: '가벼운 코튼 소재 에코백. 장보기·도서관용으로 무난합니다.',
    stockLabel: '여유',
  },
  {
    id: 'keyring-01',
    brand: 'PEANUTS',
    name: '스누피 미니 키링',
    category: '액세서리',
    price: 9900,
    originalPrice: originalPriceAtDiscount(9900),
    image: keyringImg,
    description: '가방·열쇠에 달기 좋은 미니 키링.',
    badge: '신상',
    stockLabel: '한정',
  },
  {
    id: 'notebook-01',
    brand: 'PEANUTS',
    name: '스누피 줄노트 80매',
    category: '문구',
    price: 7900,
    originalPrice: originalPriceAtDiscount(7900),
    image: notebookImg,
    description: '줄 노트 80매. 필기·스케치에 적합합니다.',
    stockLabel: '여유',
  },
  {
    id: 'cushion-01',
    brand: 'PEANUTS',
    name: '스누피 사각 쿠션',
    category: '인테리어',
    price: 32900,
    originalPrice: originalPriceAtDiscount(32900),
    image: cushionImg,
    description: '소파·침대용 사각 쿠션. 부드러운 터치감.',
    stockLabel: '여유',
  },
  {
    id: 'sticker-01',
    brand: 'PEANUTS',
    name: '스누피 스티커 팩 20장',
    category: '문구',
    price: 5900,
    originalPrice: originalPriceAtDiscount(5900),
    image: stickerImg,
    description: '다이어리·노트북 꾸미기용 스티커 20장.',
    stockLabel: '한정',
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

export function formatPrice(krw) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(krw)
}

export function getDiscountRate(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return null
  }
  return DISCOUNT_RATE
}
