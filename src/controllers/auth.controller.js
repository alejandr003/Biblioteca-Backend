import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../libs/jwt.js";

export const login = async (req, res) => {
    const { email, password} = req.body;
    try {
        const userFound = await User.findOne({ email });
        if(!userFound) return res.status(400).json({ message: "Usuario no encontrado" });
        

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });        
        const token = await createAccesToken({id: userFound._id})
        res.cookie('token', token);
        res.json({
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt,
            });
        console.log("Login exitoso - Status 200");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const register = async (req, res) => {
    const { email, password, telefono } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            telefono,
            email,
            password: passwordHash,
        });

        const userSaved = await newUser.save();
        const token = await createAccesToken({id: userSaved._id})
        res.cookie('token', token);
        res.json({
                id: userSaved._id,
                email: userSaved.email,
                telefono: userSaved.telefono,
                createdAt: userSaved.createdAt,
                updatedAt: userSaved.updatedAt,
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const logout = async (req, res) => {
    res.cookie('token', '',{
        expires: new Date(0)
    })
    return res.sendStatus(200);
}