const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 12 
  },
  fileFilter: (req, file, cb) => {
    // Acceptation des fichiers selon le champ (fieldname)
    if (file.fieldname === 'logo' || file.fieldname === 'images' || file.fieldname === 'image') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Seules les images sont autorisées pour logo, images et image'), false);
      }
    } else if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Seules les vidéos sont autorisées pour video'), false);
      }
    } else {
      cb(new Error('Champ de fichier non autorisé'), false);
    }
  }
});

const handleMediaUpload = upload.fields([
  { name: 'image', maxCount: 1 }, 
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 }
]);

const uploadMiddleware = (req, res, next) => {
  handleMediaUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: 'Fichier trop volumineux. Taille maximum: 50MB' 
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          error: 'Trop de fichiers uploadés' 
        });
      }
      return res.status(400).json({ 
        error: 'Erreur d\'upload: ' + err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        error: err.message 
      });
    }
    next();
  });
};

module.exports = uploadMiddleware;
