import json
import numpy as np

with open('public/assets/clean_signature_branches.json') as f:
    data = json.load(f)

branches = data['branches']
print(f"Loaded {len(branches)} branches.")

# Let's inspect each branch's start and end coordinates
for i, b in enumerate(branches):
    pts = b['points']
    print(f"Branch {i}: len={len(pts)}, start={pts[0]}, end={pts[-1]}")

# Let's group and connect adjacent branches where endpoints touch (dist <= 12)
connected_strokes = []
used = set()

for i, b in enumerate(branches):
    if i in used: continue
    current_stroke = list(b['points'])
    used.add(i)
    
    # Try to greedily extend current_stroke from its end or start
    extended = True
    while extended:
        extended = False
        end_pt = current_stroke[-1]
        best_j = None
        best_dist = 999
        best_reverse = False
        
        for j, b2 in enumerate(branches):
            if j in used: continue
            pts2 = b2['points']
            # Check end_pt to pts2[0]
            d1 = (end_pt[0] - pts2[0][0])**2 + (end_pt[1] - pts2[0][1])**2
            # Check end_pt to pts2[-1]
            d2 = (end_pt[0] - pts2[-1][0])**2 + (end_pt[1] - pts2[-1][1])**2
            
            if d1 < best_dist and d1 <= 144: # within 12px
                best_dist = d1
                best_j = j
                best_reverse = False
            if d2 < best_dist and d2 <= 144:
                best_dist = d2
                best_j = j
                best_reverse = True
                
        if best_j is not None:
            pts2 = branches[best_j]['points']
            if best_reverse:
                current_stroke.extend(reversed(pts2))
            else:
                current_stroke.extend(pts2)
            used.add(best_j)
            extended = True

    connected_strokes.append(current_stroke)

print(f"Combined into {len(connected_strokes)} primary continuous handwriting strokes.")

for i, s in enumerate(connected_strokes):
    print(f"Stroke {i}: {len(s)} pts, start={s[0]}, end={s[-1]}")

# Sort strokes by natural handwriting order:
# Stroke 1: Left arc
# Stroke 2: Monogram V/R
# Stroke 3: Long underline slash
# Dots at the end
def stroke_order(s):
    min_y = min(p[1] for p in s)
    min_x = min(p[0] for p in s)
    # Long underline starts at bottom left (min_y > 450, min_x < 100)
    if min_x < 80 and min_y > 400:
        return 10 # underline
    if len(s) <= 4:
        return 20 # dot
    return min_x # earlier strokes first

connected_strokes.sort(key=stroke_order)

# Export to TypeScript file
ts_content = f'''// Clean continuous stroke paths for signature creation animation (ZERO jumping chords / ZERO support structures)
export const SIGNATURE_PATH_WIDTH = 538;
export const SIGNATURE_PATH_HEIGHT = 658;

export const SIGNATURE_STROKES: [number, number][][] = {json.dumps(connected_strokes)};

export const SIGNATURE_DOT_1: [number, number] = [318, 502];
export const SIGNATURE_DOT_2: [number, number] = [365, 467];
'''

with open('src/components/portfolio/signaturePathData.ts', 'w') as f:
    f.write(ts_content)

print("Saved clean signaturePathData.ts successfully!")
