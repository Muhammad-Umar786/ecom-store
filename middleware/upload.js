// middlewares/upload.js

const path = require('path');
const multer = require('multer');

// Configure storage — all uploads go to /uploads, filename is timestamped
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    },
});


// Only accept image files (including svg+xml)
function fileFilter(req, file, cb) {
    if (/^image\/(jpeg|png|gif|webp|svg\+xml)$/.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed.'), false);
    }
}


const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Helper middleware to add webPath to req.file
function addWebPath(req, res, next) {
    if (req.file && req.file.filename) {
        req.file.webPath = '/uploads/' + req.file.filename;
    }
    next();
}

// Helper to always run addWebPath after any multer middleware
function withWebPath(mw) {
    return function (req, res, next) {
        mw(req, res, function (err) {
            if (err) return next(err);
            addWebPath(req, res, next);
        });
    };
}

// Export middleware to handle single-image uploads under the field name "image"
module.exports = {
    uploadImage: withWebPath(upload.single('image')),
};
