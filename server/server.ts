import express from 'express';
import http from 'http';
import path from 'path';
import { engine } from 'express-handlebars';

const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
  res.render('home');
});

server.listen(port, () => {
  console.log('App is listening to port 3000');
});
