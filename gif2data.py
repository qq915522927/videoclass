import json
import sys
import imageio
import cv2
import numpy as np
from PIL import Image

def convert_gif_to_black_and_wite(filename):
    pics = imageio.mimread(filename)
    print(np.array(pics).shape)
    A = []
    n = 0
    data = []
    for img in pics:
        n+=1
        print(n)
        is_gray = False
        try:
            u, v, _ = img.shape
        except:
            u, v = img.shape
            is_gray = True
        c = img*0 + 255
        if is_gray:
            raise Exception("Not supported")
        if not is_gray:
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            for i in range(0, u, 1):
                for j in range(0, v, 1):
                    pix = gray[i, j]
                    if pix < 60:
                        c[i, j] = np.array([0, 0, 0, 255])
            im = Image.fromarray(c)
            resized_im = im.resize((50, 33), Image.ANTIALIAS)
            arr = np.array(resized_im)
            p, q, _= arr.shape
            data_frame = []
            for i in range(0, p):
                for j in range(0, q):
                    r, g, b, a = arr[i, j]
                    r = int(r)
                    g = int(g)
                    b = int(b)
                    t = r*r + g**2 + b**2
                    if t<= (200**2)*3 and  a>100:
                        arr[i, j] = np.array([0, 0, 0, 255])
                        data_frame.append([i, j])
                    else:
                        arr[i, j] = np.array([255, 255, 255, 255])
            A.append(arr)
            data.append(data_frame)

    imageio.mimsave(filename + '_out.gif', A, 'GIF', duration=0.2)
    with open(filename + '_data.json', 'w') as f:
        f.write(json.dumps(data))

if __name__ == '__main__':
   fname = sys.argv[1]
   convert_gif_to_black_and_wite(fname)