import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configuração do storage para salvar no Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "dalia-semijoias", // pasta no Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        public_id: (req, file) => {
            return file.originalname.split(".")[0] + "-" + Date.now();
        },
    },
});

// Upload com filtro
const upload = multer({ storage });

export default upload;
