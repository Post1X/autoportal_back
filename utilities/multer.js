import multer from 'multer';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/images/')
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        let ext = '';
        if (file.mimetype === 'image/jpeg') ext = '.jpg';
        else if (file.mimetype === 'image/svg+xml') ext = '.svg';
        else if (file.mimetype === 'image/png') ext = '.png';
        else if (file.mimetype === 'text/html') ext = '.html';
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
})

const limit = {
    fileSize: 1024 * 1024 * 5
}
const upload = multer({
    storage: storage,
    limits: limit
})

export default upload;
