import Express from 'express';
import morgan from 'morgan';

const app = new Express();
const logger = morgan('combined');

app.use(logger);
app.use(Express.urlencoded({ extended: true }));
app.set('view engine', 'pug');

app.get('/reg', (req, res) => {
    res.render('reg');
});

app.get('/auth', (req, res) => {
    res.render('auth');
});

app.get('/post-news', (req, res) => {
    res.render('post-news');
});

app.listen(8080, () => {
    console.log(`Example app listening on port 8080!`);
});
