import Express from 'express';
import morgan from 'morgan';
import News from './utils/News.js';
import MongoClient from 'mongodb';
import encrypt from './utils/encrypt.js';

const app = new Express();
const logger = morgan('combined');

const uri = "mongodb+srv://maddclif:2569814795a@cluster0.andql.mongodb.net/open_class_taskretryWrites=true&w=majority";


app.use(logger);
app.use(Express.urlencoded({ extended: true }));
app.set('view engine', 'pug');

const allNews = [];

app.route('/reg')
    .get((req, res) => {
        res.render('reg');
    })
    .post((req, res) => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
            if (error) {
              throw new Error(error);
            }
            const db = client.db("open_class_task");
            const collection = await db.collection("users");
            const { login, email, password } = req.body;
            const [hashPassword, salt] = encrypt(password);
            await collection.insertOne({ login, email, password: hashPassword, salt });
          });
        res.send(req.body);
    });

app.route('/auth')
    .get((req, res) => {
        res.render('auth');
    })
    .post((req, res) => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
            if (error) {
              throw new Error(error);
            }
            const db = client.db("open_class_task");
            const collection = await db.collection("users");
            const { login, password } = req.body;
            collection.findOne({ login }).then((data) => {
                const [verifiablePassword] = encrypt(password, data.salt);
                if (data.password === verifiablePassword) {
                    res.send('Yeah!')
                } else res.send('error');
            })
          });
    });

app.route('/post-news')
    .get((req, res) => {
        res.render('post-news');
    })
    .post((req, res) => {
        const { title, body } = req.body;
        allNews.push(new News(title, body));
        res.send(allNews);
    });

app.listen(8080, () => {
    console.log(`Example app listening on port 8080!`);
});
