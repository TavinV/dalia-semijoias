import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads/")); // pasta onde as imagens ficarão
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // mantém a extensão
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// Filtro para aceitar só imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Apenas arquivos de imagem são permitidos!"), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
