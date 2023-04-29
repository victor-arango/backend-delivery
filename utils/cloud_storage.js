const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const env = require('../config/env');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const storage = new Storage({
  projectId: "delivery-app-5174b",
  keyFilename: './serviceAccountKey.json'
});

const bucket = storage.bucket("gs://delivery-app-5174b.appspot.com/");

/**
 * Subir el archivo a Firebase Storage
 * @param {File} file objeto que sera almacenado en Firebase Storage
 */
module.exports = (file, pathImage, deletePathImage) => {
  return new Promise((resolve, reject) => {
    console.log('delete path', deletePathImage)

    if (deletePathImage) {
      if (deletePathImage != null || deletePathImage != undefined) {
        const parseDeletePathImage = url.parse(deletePathImage)
        var ulrDelete = parseDeletePathImage.pathname.slice(23);
        const fileDelete = bucket.file(`${ulrDelete}`)

        fileDelete.delete((error, _) => {
          if (error) {
            console.log('Failed to remove photo, error:', error)
            reject(error)
          } else {
            console.log('se borro la imagen con exito')
          }
        })
      }
    }

    if (pathImage) {
      if (pathImage != null || pathImage != undefined) {
        let fileUpload = bucket.file(`${pathImage}`);
        let stream = fileUpload.createWriteStream({
          metadata: {
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
          resumable: false,
        });

        stream.on('error', (error) => {
          console.log('Error al subir archivo a firebase', error);
          reject('Something is wrong! Unable to upload at the moment.');
        });

        stream.on('finish', () => {
          // The public URL can be used to directly access the file via HTTP.
          const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
          console.log('URL DE CLOUD STORAGE ', url);
          resolve(url);
        });

        stream.end(file.buffer);
      }
    }
  });
};
