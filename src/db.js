import mongoose from "mongoose";
import colors from 'colors'
import dotenv from 'dotenv'

dotenv.config();

export const connectDB = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 10000, // Timeout después de 10 segundos
            socketTimeoutMS: 45000, // Cierra sockets inactivos después de 45 segundos
            family: 4 // Fuerza IPv4 (puede ayudar con problemas de Vercel)
        };

        // Intentar conectar a MongoDB con las opciones configuradas
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log(`MongoDB conectado: ${conn.connection.host}`.yellow);
    } catch (error) {
        console.log(`Error: ${error.message}`.red);
        console.log('Para más información sobre el error:', error);
        // En producción, puede ser mejor no cerrar la aplicación
        // process.exit(1);
    }
}

