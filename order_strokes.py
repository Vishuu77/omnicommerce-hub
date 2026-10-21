import cv2
import numpy as np
import json

skeleton = cv2.imread('public/assets/signature_skeleton.png', cv2.IMREAD_GRAYSCALE)
h, w = skeleton.shape

# Find connected components of the skeleton
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(skeleton)
print(f"Skeleton components: {num_labels - 1}")

strokes = []

for label in range(1, num_labels):
    area = stats[label, cv2.CC_STAT_AREA]
    pts = np.argwhere(labels == label) # [y, x]
    # Convert to [x, y]
    pts = pts[:, [1, 0]]
    
    if len(pts) < 5:
        # Small dot
        center = centroids[label]
        strokes.append({
            'type': 'dot',
            'points': [[round(float(center[0]), 1), round(float(center[1]), 1)]],
            'area': int(area)
        })
        continue

    # Order points along the path using nearest neighbor / TSP greedy
    unvisited = pts.tolist()
    # Pick a starting endpoint: point with lowest or highest y or x
    # For slash: starts at min x
    # For main strokes: starts at top or bottom
    unvisited.sort(key=lambda p: (p[1], p[0])) # sort by y
    
    current = unvisited.pop(0)
    ordered = [current]
    
    while unvisited:
        # Find nearest point in unvisited
        dists = [((p[0] - current[0])**2 + (p[1] - current[1])**2) for p in unvisited]
        min_idx = int(np.argmin(dists))
        nearest = unvisited.pop(min_idx)
        ordered.append(nearest)
        current = nearest

    # Subsample / simplify for smooth rendering
    sampled = [ordered[0]]
    for pt in ordered[1:]:
        dx = pt[0] - sampled[-1][0]
        dy = pt[1] - sampled[-1][1]
        if dx*dx + dy*dy >= 16: # at least 4px apart
            sampled.append(pt)
    if sampled[-1] != ordered[-1]:
        sampled.append(ordered[-1])

    strokes.append({
        'type': 'stroke',
        'points': sampled,
        'count': len(sampled)
    })

print(f"Processed {len(strokes)} strokes.")
with open('public/assets/signature_strokes.json', 'w') as f:
    json.dump({'width': w, 'height': h, 'strokes': strokes}, f, indent=2)

print("Saved public/assets/signature_strokes.json successfully!")
