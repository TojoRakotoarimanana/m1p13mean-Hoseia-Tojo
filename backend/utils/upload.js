const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées.'), false);
    }
  }
});

async function processImages(files = []) {
  if (!files.length) return [];

  const uploads = files.map(async (file) => {
    const filename = `${uuidv4()}.jpg`;
    const filepath = path.join(uploadDir, filename);

    await sharp(file.buffer)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toFile(filepath);

    return `/uploads/products/${filename}`;
  });

  return Promise.all(uploads);
}

function removeImages(imagePaths = []) {
  imagePaths.forEach((imagePath) => {
    if (!imagePath) return;
    const normalized = imagePath.replace(/^\//, '');
    const fullPath = path.join(__dirname, '..', 'public', normalized);
    fs.unlink(fullPath, () => {});
  });
}

module.exports = {
  upload,
  processImages,
  removeImages
};
