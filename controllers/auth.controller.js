const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 

const registerDonor = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!['donante', 'administrador'].includes(role)) {
            return res.status(400).json({ error: 'Rol inválido' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role 
        });
        
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '2h' }
            );
            res.json({ token, role: user.role });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de autenticación' });
    }
};

module.exports = { registerDonor, login };