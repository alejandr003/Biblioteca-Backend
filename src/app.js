import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.route.js'
import bookRoutes from './routes/book.route.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(morgan("dev"));
app.use(express.json())
app.use(cookieParser())

// Configuración para carga de archivos
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './upload',
    createParentPath: true
}))

// Crear directorio de uploads si no existe
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use("/api", authRoutes);
app.use("/api", bookRoutes);

export default app;