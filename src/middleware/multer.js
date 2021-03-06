const multer = require("multer");
const shortid = require('shortid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${shortid.generate()}-${file.originalname}`);
    },
});
const upload = multer({ storage });
module.exports = upload;
