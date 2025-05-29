import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    authors: {
        type: [String],
        required: true
    },
    categories: {
        type: [String],
        default: []
    },    imageUrl: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: ""
    },
    identifier: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

export default mongoose.model('Book', bookSchema);
