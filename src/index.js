import dotenv from 'dotenv'
dotenv.config();
import app from './app.js'
import { connectDB } from './db.js'

const PORT = process.env.PORT || 4000;
connectDB();

// Inicia el servidor
app.listen(PORT, () => {
  const environment = process.env.NODE_ENV || 'development';
  const url = environment === 'development' 
    ? `http://localhost:${PORT}` 
    : process.env.API_URL || 'URL de producción';
  
  console.log(`Servidor ejecutándose en ${environment} mode en ${url}`.green);
});