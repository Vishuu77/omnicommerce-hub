import cv2
import numpy as np
import json

skeleton = cv2.imread('public/assets/signature_skeleton.png', cv2.IMREAD_GRAYSCALE)
h, w = skeleton.shape

# Binary
skel = (skeleton > 0).astype(np.uint8)

# 8-connectivity kernel
kernel = np.array([[1, 1, 1],
                   [1, 0, 1],
                   [1, 1, 1]], dtype=np.uint8)

neighbors = cv2.filter2D(skel, -1, kernel) * skel
junctions = (neighbors >= 3) & (skel == 1)

# Remove junctions
branches_mask = skel.copy()
branches_mask[junctions] = 0

num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(branches_mask, connectivity=8)
print(f"Independent branch segments: {num_labels - 1}")

branches = []

for label in range(1, num_labels):
    area = stats[label, cv2.CC_STAT_AREA]
    pts = np.argwhere(labels == label)
    pts = pts[:, [1, 0]] # [x, y]
    
    if len(pts) < 2:
        continue

    unvisited = set((int(p[0]), int(p[1])) for p in pts)
    start = min(unvisited, key=lambda p: (p[1], p[0]))
    
    ordered = [start]
    unvisited.remove(start)
    current = start
    
    while unvisited:
        # Check immediate 8-connected neighbors
        found = False
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                if dx == 0 and dy == 0: continue
                cand = (current[0] + dx, current[1] + dy)
                if cand in unvisited:
                    ordered.append(cand)
                    unvisited.remove(cand)
                    current = cand
                    found = True
                    break
            if found: break
        
        if not found:
            # Nearest neighbor strictly under 5 pixels
            nearest = min(unvisited, key=lambda p: (p[0]-current[0])**2 + (p[1]-current[1])**2)
            dist_sq = (nearest[0]-current[0])**2 + (nearest[1]-current[1])**2
            if dist_sq <= 25:
                ordered.append(nearest)
                unvisited.remove(nearest)
                current = nearest
            else:
                # STRICT RULE: NEVER jump across large gaps! End this branch!
                break
                
    if len(ordered) >= 3:
        sub = [ordered[0]]
        for pt in ordered[1:]:
            dx = pt[0] - sub[-1][0]
            dy = pt[1] - sub[-1][1]
            if dx*dx + dy*dy >= 9:
                sub.append(pt)
        if sub[-1] != ordered[-1]:
            sub.append(ordered[-1])
        branches.append({
            'points': [[int(p[0]), int(p[1])] for p in sub],
            'len': len(sub)
        })

print(f"Extracted {len(branches)} smooth continuous branches.")

# Render each branch onto a test image to visually confirm ZERO support structures / NO straight chords
debug_img = np.ones((h, w, 3), dtype=np.uint8) * 255
colors = [
    (0, 0, 200), (0, 150, 0), (200, 0, 0), (150, 150, 0),
    (150, 0, 150), (0, 150, 150), (100, 100, 200), (50, 100, 50)
]

for idx, b in enumerate(branches):
    c = colors[idx % len(colors)]
    pts = np.array(b['points'], dtype=np.int32)
    cv2.polylines(debug_img, [pts], False, c, 3)

cv2.imwrite('public/assets/branches_test.png', debug_img)
print("Saved branches_test.png to verify strokes!")

# Save to public/assets/clean_signature_branches.json
with open('public/assets/clean_signature_branches.json', 'w') as f:
    json.dump({'branches': branches}, f, indent=2)

print("Saved clean_signature_branches.json successfully!")
