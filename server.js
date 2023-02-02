
const express =require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
app.use(cookieParser()); 
const router =require ( './src/routes/web.js');

const path = require('path');
const bodyParser =require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/src/views'))
app.use('/', router);
app.use(express.static(path.join(__dirname , '/public')));
app.listen(process.env.PORT, () => {
 console.log(`App listening at port ${process.env.PORT}`)
 })
