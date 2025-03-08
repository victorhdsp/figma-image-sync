import ImageMagick from 'magickwand.js';
import fs from 'fs';
import * as path from 'path';

const { Magick, MagickCore } = await ImageMagick;
/*
const imageFile = path.join(import.meta.dirname, 'image_1.psd');

const im = new Magick.Image(imageFile);
im.read(imageFile);
im.write('image_1.png');*/

const fileId = "1Gfu4ZO7fFzyrFPFaodSVqbjWWKJcVk0g";

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

const imageUint8Array = await download_image("ya29.a0AeXRPp7uSAmY0yHdjUA_EjJsV_K4zKEEHQ6UKCW-wxYZj2aQIsc9MnYSUo_osq_8D804du8IJCvXElwICDmd75WTWG9qNdFG_uQse313eZn36fEPa6aP2sG68jNzlto_FrD6DDkIGDDmUeio9vAdu3u4l33hu_VApZbhBM33PgaCgYKASYSARMSFQHGX2Mi5NRQ5obyhceqlSNiMkznUw0177");

const blob = new Magick.Blob(imageUint8Array.buffer);
const im = new Magick.Image(blob);
let newBlob = new Magick.Blob();
console.log(newBlob.data(), "antes");
im.magick("jpg");
im.write(newBlob);
console.log(newBlob.data(), "depois");
fs.writeFileSync("image_1_test.jpg", new Uint8Array(newBlob.data()));