const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Ensure photos directory exists
const photosDir = '/app/photos';
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photosDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomSuffix}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Serve uploaded photos
app.use('/photos', express.static(photosDir));

// Upload endpoint
app.post('/api/upload', upload.array('photos'), (req, res) => {
  try {
    const uploadedFiles = req.files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      name: file.originalname,
      filename: file.filename,
      url: `/photos/${file.filename}`,
      size: file.size
    }));
    
    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all photos
app.get('/api/photos', (req, res) => {
  try {
    const files = fs.readdirSync(photosDir);
    const photos = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(filename => {
        const filePath = path.join(photosDir, filename);
        const stats = fs.statSync(filePath);
        return {
          id: filename.split('-').slice(0, 2).join('-'),
          name: filename.split('-').slice(2).join('-'),
          filename,
          url: `/photos/${filename}`,
          size: stats.size
        };
      });
    
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete photo
app.delete('/api/photos/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(photosDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all photos
app.delete('/api/photos', (req, res) => {
  try {
    const files = fs.readdirSync(photosDir);
    files.forEach(file => {
      if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
        fs.unlinkSync(path.join(photosDir, file));
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Photos directory: ${photosDir}`);
});