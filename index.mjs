import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const app = express();
const port = 3000;
const users = [
    {id: 1, username: 'jedun', fullname: 'Muhammad Jidan'},
    {id: 2, username: 'feyfa', fullname: 'Rafeyfa Zulfiyani'},
    {id: 3, username: 'pascol', fullname: 'Naga Hitam'},
];

app.use(express.json());

app.listen(port, () => console.log(`https://localhost:${port}`))

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if(err) res.sendStatus(403);
        req.user = user;
        next();
    })
}

app.get(
    '/home',
    authenticate,
    (req, res) => {
        const { user } = req;
        return res.json({user, say: 'Selamat Datang Di Halaman Home'});
    }
);

app.get(
    '/about',
    authenticate,
    (req, res) => {
        const { user } = req;
        return res.json({user, say: 'Selamat Datang Di Halaman About'});
    }
);

app.post('/login', (req, res) => {
    const { body: { username } } = req;

    const user = users.find(user => user.username === username);
    if(!user) return res.status(404).send({ error: 'user Not Found' })
    const payload = { username: user.username, fullname: user.fullname };

    const token = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: '30s' });
    res.json({token});
});