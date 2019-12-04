const path = require('path');
const express = require('express');
const app = express();
const port = 1705;

const pathToStaticFiles = path.join(__dirname);

app.use(express.static(pathToStaticFiles));

const pathToindexHtml = path.join(__dirname,'zadanie6.html')

app.get('/',function(req,res){
    res.sendFile(pathToindexHtml)
});

app.listen(port, () => console.log(`Server beží na porte ${port}!`));