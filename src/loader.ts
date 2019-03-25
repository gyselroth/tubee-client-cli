const getUri = require('get-uri');
const isURI = require('validate.io-uri');
const path = require('path');

export function getFile(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isURI(uri)) {
      uri = 'file://' + path.resolve(uri);
    }

    getUri(uri, (err, stream) => {
      if (err) {
        return reject(err);
      }

      var chunks = [];
      stream.on('data', buffer => {
        chunks.push(buffer);
      });

      stream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });

      stream.on('error', error => {
        resolve(error);
      });
    });
  });
}
