import Express from 'express';
import morgan from 'morgan';

const app = new Express();
const logger = morgan('combined');

app.use(logger);
//app.use(Express.static('public'));
app.use(Express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.listen(8080, () => {
    console.log(`Example app listening on port 8080!`);
});
