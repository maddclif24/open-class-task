import Express from 'express';
import morgan from 'morgan';
import fs from 'fs';


const app = new Express();
const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
const logger = morgan('combined', { stream: accessLogStream });


app.use(logger);
app.use(Express.json());
app.use(Express.static('public'));
app.use(Express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('./public/index.html');
});

app.listen(8080, () => {
    console.log(`Example app listening on port 8080!`);
});
