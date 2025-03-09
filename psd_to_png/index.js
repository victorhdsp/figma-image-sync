import fs, { readFileSync } from 'node:fs';
import path from 'node:path';
import {
    initializeImageMagick,
    ImageMagick,
    MagickFormat,
} from '@imagemagick/magick-wasm';

const fileId = "15Lw6Fr1EBsN9I4pyyE7Pk9nlyfWq72Z3";
const wasmLocation = './node_modules/@imagemagick/magick-wasm/dist/magick.wasm';
const washPath = path.resolve(wasmLocation);
const wasmBytes = readFileSync(washPath);

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

const imageUint8Array = await download_image("ya29.a0AeXRPp43PZdsdi20EFV2LOshogbECiMWD0w_h_iJdokfTkqc9pZ_PpvJFARZWucSMQKcz_o7VrLKvN4DvMv9I3a-txPUafiUDKkQ7E1viaxaxzEJRKgBOrtRKtPlQ7UIVvF7kgacZfpidQmkFooSLyCKRHE4AiDPmKP-usmN3waCgYKAbwSARMSFQHGX2MiNs_27k-M4BJkTIu36fru9Q0177");

initializeImageMagick(wasmBytes).then(() => {
    ImageMagick.read(imageUint8Array, image => {
        image.write(MagickFormat.Png, (data) => {
            fs.writeFileSync('output.png', data);
        });
    });
});
/*
const result = await call([image], ['convert', 'output.png']);
console.log(result);*/
