from PIL import  Image

def produceImage(file_in, width, height, file_out):
    image = Image.open(file_in)
    resized_image = image.resize((width, height), Image.ANTIALIAS)
    resized_image.save(file_out)


if __name__ == '__main__':
    file_in = 'out1.gif'

    w = 200
    h = 133
    out = 'out2.gif'
    produceImage(file_in, w, h, out)
