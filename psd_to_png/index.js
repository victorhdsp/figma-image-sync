import ImageMagick from 'magickwand.js';
import fs from 'fs';
import * as path from 'path';

const { Magick, MagickCore } = await ImageMagick;
/*
const imageFile = path.join(import.meta.dirname, 'image_1.psd');

const im = new Magick.Image(imageFile);
im.read(imageFile);
im.write('image_1.png');*/

const fileId = "15Lw6Fr1EBsN9I4pyyE7Pk9nlyfWq72Z3";

export async function download_image(token) {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&source=download`;
    let initialRange = { start: 0, size: 1024 * 1024 * 20 };

    async function partialFetch(range) {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Range: `bytes=${range.start}-${range.start + range.size - 1}`
            }
        });
        console.log(response, initialRange);
        if (response.ok) {
            const data = await response.arrayBuffer();
            range.start += range.size;
            return new Uint8Array(data);
        }
    }

    function concatUint8Arrays(old_val, new_val) {
        if (!old_val) 
            return new_val;

        let tmp = new Uint8Array(old_val.length + new_val.length);
        tmp.set(old_val, 0);
        tmp.set(new_val, old_val.length);
        return tmp;
    }

    let data = null;
    let tmpData = await partialFetch(initialRange);

    while (tmpData) {
        data = concatUint8Arrays(data, tmpData);
        tmpData = await partialFetch(initialRange);
    }
    if (data)
        return data;

    return false;
}

const imageUint8Array = await download_image("ya29.a0AeXRPp4MbPLT3KGL3l09HKaCYC-MKQsdtDElS_Ls6x-XaA0GV3ddDmg871K5DYDIo5OvhagW_K67GcDz2gYWUFjwxqEaAHJm495M0PpU7nHoMVOA1ZzOvWAlkozmmv6DIIpZ-3d19lOHSfCOAXkpkDKL1V9AuKc4HwcIqY_wuwaCgYKARcSARMSFQHGX2Mi8yu2u2wMWxlRNG2nJ8yXXw0177");

const blob = new Magick.Blob(imageUint8Array.buffer);
const im = new Magick.Image(blob);
im.write('test.png');