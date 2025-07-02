const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper function to generate unique filename
const generateFileName = (originalName, folder) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(6).toString('hex');
  const ext = path.extname(originalName);
  return `${folder}_${timestamp}_${randomString}${ext}`;
};

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Upload file to local storage
const uploadToLocalStorage = async (buffer, folder, originalName, options = {}) => {
  try {
    const folderPath = path.join(uploadsDir, folder);
    ensureDirectoryExists(folderPath);
    
    const fileName = generateFileName(originalName, folder);
    const filePath = path.join(folderPath, fileName);
    
    // Write file to disk
    fs.writeFileSync(filePath, buffer);
    
    // Return object similar to Cloudinary response
    const fileUrl = `/uploads/${folder}/${fileName}`;
    return {
      public_id: path.join(folder, fileName.replace(path.extname(fileName), '')),
      secure_url: fileUrl,
      url: fileUrl,
      format: path.extname(originalName).substring(1).toLowerCase(),
      bytes: buffer.length,
      folder: folder,
      original_filename: path.basename(originalName, path.extname(originalName))
    };
  } catch (error) {
    console.error('Error uploading file to local storage:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Delete file from local storage
const deleteLocalMedia = async (public_id, resource_type = 'image') => {
  if (!public_id) return;
  
  try {
    // Extract folder and filename from public_id
    const parts = public_id.split('/');
    let filePath;
    
    if (parts.length > 1) {
      // public_id format: "folder/filename_without_ext"
      const folder = parts[0];
      const fileNameWithoutExt = parts.slice(1).join('/');
      
      // Find the actual file with extension
      const folderPath = path.join(uploadsDir, folder);
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        const matchingFile = files.find(file => 
          path.basename(file, path.extname(file)) === fileNameWithoutExt ||
          file.startsWith(fileNameWithoutExt)
        );
        
        if (matchingFile) {
          filePath = path.join(folderPath, matchingFile);
        }
      }
    } else {
      // Try to find file in all directories
      const directories = ['users', 'categories', 'subcategories', 'governorats', 'videos'];
      for (const dir of directories) {
        const dirPath = path.join(uploadsDir, dir);
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          const matchingFile = files.find(file => 
            path.basename(file, path.extname(file)).includes(public_id) ||
            file.includes(public_id)
          );
          
          if (matchingFile) {
            filePath = path.join(dirPath, matchingFile);
            break;
          }
        }
      }
    }
    
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${filePath}`);
    } else {
      console.log(`File not found for deletion: ${public_id}`);
    }
  } catch (error) {
    console.error('Error deleting file from local storage:', error);
  }
};

// Helper functions for specific file types
const uploadUserFile = (buffer, originalName, options = {}) => {
  return uploadToLocalStorage(buffer, 'users', originalName, options);
};

const uploadCategoryFile = (buffer, originalName, options = {}) => {
  return uploadToLocalStorage(buffer, 'categories', originalName, options);
};

const uploadSubcategoryFile = (buffer, originalName, options = {}) => {
  return uploadToLocalStorage(buffer, 'subcategories', originalName, options);
};

const uploadGouvernoratFile = (buffer, originalName, options = {}) => {
  return uploadToLocalStorage(buffer, 'governorats', originalName, options);
};

const uploadVideoFile = (buffer, originalName, options = {}) => {
  return uploadToLocalStorage(buffer, 'videos', originalName, options);
};

module.exports = {
  uploadToLocalStorage,
  deleteLocalMedia,
  uploadUserFile,
  uploadCategoryFile,
  uploadSubcategoryFile,
  uploadGouvernoratFile,
  uploadVideoFile
};