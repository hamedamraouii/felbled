const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create uploads directory structure if it doesn't exist
const createUploadsDir = () => {
  const uploadDirs = [
    'uploads/users',
    'uploads/categories', 
    'uploads/subcategories',
    'uploads/governorats',
    'uploads/videos'
  ];

  uploadDirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  });
};

// Generate unique filename
const generateUniqueFilename = (originalName, folder = '') => {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(6).toString('hex');
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  
  return `${timestamp}_${randomStr}_${baseName}${ext}`;
};

// Save file to local storage
const saveFileLocally = async (buffer, originalName, folder) => {
  try {
    // Ensure uploads directory exists
    createUploadsDir();
    
    const filename = generateUniqueFilename(originalName, folder);
    const relativePath = `uploads/${folder}/${filename}`;
    const fullPath = path.join(__dirname, '..', relativePath);
    
    // Write file to disk
    await fs.promises.writeFile(fullPath, buffer);
    
    // Return file info in format similar to Cloudinary
    return {
      public_id: filename.split('.')[0], // Use filename without extension as public_id
      secure_url: `/${relativePath}`, // Relative path for serving
      url: `/${relativePath}`,
      format: path.extname(originalName).slice(1), // Extension without dot
      bytes: buffer.length,
      resource_type: folder === 'videos' ? 'video' : 'image'
    };
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error(`Failed to save file: ${error.message}`);
  }
};

// Delete file from local storage
const deleteLocalFile = async (filePath) => {
  if (!filePath) return;
  
  try {
    // Extract relative path from URL if needed
    let relativePath = filePath;
    if (filePath.startsWith('/uploads/')) {
      relativePath = filePath.slice(1); // Remove leading slash
    } else if (filePath.startsWith('uploads/')) {
      relativePath = filePath;
    } else {
      // If it's just a filename, we need to find it in uploads
      console.warn('Cannot delete file with insufficient path info:', filePath);
      return;
    }
    
    const fullPath = path.join(__dirname, '..', relativePath);
    
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      console.log(`File deleted: ${fullPath}`);
    } else {
      console.warn(`File not found for deletion: ${fullPath}`);
    }
  } catch (error) {
    console.error('Error deleting local file:', error);
  }
};

// Upload to local storage (main function to replace uploadToCloudinary)
const uploadToLocalStorage = async (buffer, originalName, options = {}) => {
  const folder = options.folder || 'users';
  return await saveFileLocally(buffer, originalName, folder);
};

module.exports = {
  uploadToLocalStorage,
  deleteLocalFile,
  createUploadsDir,
  generateUniqueFilename
};