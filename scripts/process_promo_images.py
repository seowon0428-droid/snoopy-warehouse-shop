"""Remove solid edge backgrounds (white / light blue) and trim transparent padding."""
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "images"
OUT_DIR = ROOT / "public" / "promo"


def color_close(a, b, tol):
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2])) <= tol


def is_background_pixel(r, g, b, bg, tol):
    if color_close((r, g, b), bg, tol):
        return True
    if min(r, g, b) >= 238:
        return True
    if b >= 175 and g >= 155 and r >= 125 and (b - r) >= 8 and (b - g) >= -5:
        return True
    return False


def sample_background(img):
    w, h = img.size
    points = [
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
        (w // 2, 0),
        (w // 2, h - 1),
        (0, h // 2),
        (w - 1, h // 2),
    ]
    rs = gs = bs = []
    for x, y in points:
        r, g, b, _ = img.getpixel((x, y))
        rs.append(r)
        gs.append(g)
        bs.append(b)
    return (sum(rs) // len(rs), sum(gs) // len(gs), sum(bs) // len(bs))


def flood_transparent(img, tol=34):
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    bg = sample_background(rgba)
    visited = [[False] * w for _ in range(h)]
    q = deque()

    def try_push(x, y):
        if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
            return
        r, g, b, _ = px[x, y]
        if is_background_pixel(r, g, b, bg, tol):
            visited[y][x] = True
            q.append((x, y))

    for x in range(w):
        try_push(x, 0)
        try_push(x, h - 1)
    for y in range(h):
        try_push(0, y)
        try_push(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                nr, ng, nb, _ = px[nx, ny]
                if is_background_pixel(nr, ng, nb, bg, tol):
                    visited[ny][nx] = True
                    q.append((nx, ny))

    return rgba


def trim_alpha(img, pad=4):
    bbox = img.getbbox()
    if not bbox:
        return img
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(img.width, right + pad)
    bottom = min(img.height, bottom + pad)
    return img.crop((left, top, right, bottom))


def process(name, tol):
    src = SRC_DIR / name
    out = OUT_DIR / name
    out.parent.mkdir(parents=True, exist_ok=True)
    cleaned = flood_transparent(Image.open(src), tol=tol)
    cleaned = trim_alpha(cleaned)
    cleaned.save(out, "PNG")
    print(f"saved {out} ({cleaned.size[0]}x{cleaned.size[1]})")


if __name__ == "__main__":
    process("1.png", tol=32)
    process("2.png", tol=42)
    process("3.png", tol=42)
