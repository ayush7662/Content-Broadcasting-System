const multer = require("multer");


const storage = multer.diskStorage({
  destination: "src/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});


const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpg", "image/png", "image/gif"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);  
  } else {
    cb(new Error("Only JPG, PNG, GIF allowed"), false); 
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;