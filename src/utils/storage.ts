import multer from "multer";

const storage = multer({dest: 'uploads/'});

export default storage; 