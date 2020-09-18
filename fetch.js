import https from 'https';

export default function fetch(/** @type {string} */ url, /** @type {RequestOptions} */ options = {}) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, options, async response => {
      /** @type {Buffer[]} */
      const buffers = [];
      for await (const chunk of response) {
        buffers.push(chunk);
      }
  
      const buffer = Buffer.concat(buffers);
      resolve(buffer.toString('utf-8'));
    });

    request.on('error', reject);
  });
}
