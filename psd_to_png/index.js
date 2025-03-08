import ImageMagick from 'magickwand.js';
import * as path from 'path';

const { Magick, MagickCore } = await ImageMagick;

const imageFile = path.join(import.meta.dirname, 'image_1.psd');

const im = new Magick.Image(imageFile);
im.read(imageFile);
im.write('image_1.png');