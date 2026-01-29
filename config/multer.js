// config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Store different file types in different folders
        let folder = 'uploads/others/';
        if (file.fieldname === 'resumeUrl') {
            folder = 'uploads/resumes/';
        } else if (file.fieldname === 'profilePicture' || file.fieldname === 'companyLogo') {
            folder = 'uploads/images/';
        }
        
        const fullPath = path.join(__dirname, '../', folder);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-originalname
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// File filter - only allow specific types
const fileFilter = (req, file, cb) => {
    const allowedMimes = {
        'resumeUrl': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'], // Allow images for testing
        'profilePicture': ['image/jpeg', 'image/png', 'image/jpg'],
        'companyLogo': ['image/jpeg', 'image/png', 'image/jpg']
    };

    const allowed = allowedMimes[file.fieldname];
    if (allowed && allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${allowed.join(', ')}`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

module.exports = upload;