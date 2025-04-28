const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/slike', (req, res) => {
    const dataPath = path.join(__dirname, 'images.json');
    const images = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.render('slike', { images });
});

app.get('/grafikon', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'grafikon.html'));
});

app.get('/videoteka' , (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'videoteka.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`);
});