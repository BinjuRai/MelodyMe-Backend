const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        const filename = `${file.fieldname}-${uuidv4()}.${ext}`;
        cb(null, filename);
    }
});

// const filefilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image")) cb(null, true);
//     else cb(new Error("Only image files are allowed"), false);
// };

const filefilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image") ||
        file.mimetype.startsWith("video") ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "audio/mpeg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image, video, PDF, or audio files are allowed"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, 
    fileFilter: filefilter 
});

module.exports = {
    single: (fieldName) => upload.single(fieldName),
    array: (fieldName, maxCount) => upload.array(fieldName, maxCount),
    fields: (fieldsArray) => upload.fields(fieldsArray)
  
};

  


