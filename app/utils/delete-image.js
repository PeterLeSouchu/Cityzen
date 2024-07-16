import fs from 'node:fs';


function deleteImage(imagePath) {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
      return;
    }

    console.log(`File ${imagePath} has been successfully removed.`);
  });
}

export default deleteImage;