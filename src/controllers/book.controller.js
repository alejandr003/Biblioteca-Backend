import Book from "../models/book.model.js";
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

// Obtener todos los libros con opciones de paginación y filtrado
export const getBooks = async (req, res) => {
    try {
        // Opciones de paginación
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Opciones de filtrado
        const filter = {};
        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
        }
        if (req.query.author) {
            filter.authors = { $in: [new RegExp(req.query.author, 'i')] };
        }
        if (req.query.category) {
            filter.categories = { $in: [new RegExp(req.query.category, 'i')] };
        }
        
        // Consultar los libros con paginación y filtrado
        const books = await Book.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Ordenar por más recientes primero
        
        // Obtener el total de libros para calcular las páginas
        const total = await Book.countDocuments(filter);
        
        res.json({
            books,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                perPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un libro por ID
export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Libro no encontrado" });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo libro con imagen
export const createBook = async (req, res) => {
    try {
        const { title, authors, categories, type, identifier, description } = req.body;
          // Procesar autores y categorías
        const parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;
        const parsedCategories = typeof categories === 'string' ? JSON.parse(categories) : categories;
        
        // La URL de la imagen vendría directamente del cliente
        let imageUrl = '';
        if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }
        
        // Si hay un archivo temporal y no se requiere procesar, eliminarlo
        if (req.files && req.files.image && req.files.image.tempFilePath) {
            await unlinkAsync(req.files.image.tempFilePath);
        }
        
        const newBook = new Book({
            title,
            authors: parsedAuthors,
            categories: parsedCategories,
            imageUrl,
            type,
            identifier,
            description
        });
        
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un libro
export const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Libro no encontrado" });
        
        const { title, authors, categories, type, identifier, description } = req.body;
        
        // Procesar autores y categorías si existen
        const updatedData = {
            title: title || book.title,
            type: type || book.type,
            identifier: identifier || book.identifier,
            description: description || book.description
        };
        
        if (authors) {
            updatedData.authors = typeof authors === 'string' ? JSON.parse(authors) : authors;
        }
        
        if (categories) {
            updatedData.categories = typeof categories === 'string' ? JSON.parse(categories) : categories;
        }
          // Actualizar imagen si se proporciona una nueva URL
        if (req.body.imageUrl) {
            updatedData.imageUrl = req.body.imageUrl;
        }
        
        // Si hay un archivo temporal y no se requiere procesar, eliminarlo
        if (req.files && req.files.image && req.files.image.tempFilePath) {
            await unlinkAsync(req.files.image.tempFilePath);
        }
        
        const bookUpdated = await Book.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );
        
        res.json(bookUpdated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un libro
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Libro no encontrado" });
          // No es necesario eliminar la imagen ya que solo almacenamos la URL
        
        await Book.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
