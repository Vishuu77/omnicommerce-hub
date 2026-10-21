import cv2
import numpy as np
from skimage.morphology import skeletonize

# Load clean image
img = cv2.imread('public/assets/vishnu_signature_clean.png', cv2.IMREAD_UNCHANGED)
h, w = img.shape[:2]
alpha = img[:, :, 3]

# Binary mask
binary = (alpha > 40).astype(np.uint8)

# Skeletonize
skeleton = skeletonize(binary).astype(np.uint8) * 255

print(f"Skeleton non-zero pixels: {np.count_nonzero(skeleton)}")

cv2.imwrite('public/assets/signature_skeleton.png', skeleton)
print("Saved signature_skeleton.png")
