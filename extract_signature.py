import cv2
import numpy as np

# Load clean signature
img = cv2.imread('public/assets/vishnu_signature_clean.png', cv2.IMREAD_UNCHANGED)
h, w = img.shape[:2]
alpha = img[:, :, 3]

# Threshold alpha channel to get binary silhouette
_, thresh = cv2.threshold(alpha, 30, 255, cv2.THRESH_BINARY)

# Find contours
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)

print(f"Image size: {w}x{h}, Contours found: {len(contours)}")

svg_paths = []
for cnt in contours:
    if cv2.contourArea(cnt) < 15:
        continue
    epsilon = 0.0012 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    pts = approx.reshape(-1, 2)
    if len(pts) < 3:
        continue
    d_parts = [f"M {pts[0][0]} {pts[0][1]}"]
    for p in pts[1:]:
        d_parts.append(f"L {p[0]} {p[1]}")
    d_parts.append("Z")
    svg_paths.append(" ".join(d_parts))

print(f"Valid SVG paths: {len(svg_paths)}")

combined_d = " ".join(svg_paths)
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
  <path d="{combined_d}" fill="#b91c1c" fill-rule="evenodd" />
</svg>'''

with open('public/assets/vishnu_signature.svg', 'w') as f:
    f.write(svg_content)

print("Saved public/assets/vishnu_signature.svg successfully!")
