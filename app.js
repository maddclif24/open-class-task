import Express from 'express';
import morgan from 'morgan';
import News from './utils/News.js';
import MongoClient from 'mongodb';
import encrypt from './utils/encrypt.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = new Express();
const logger = morgan('combined');


const uri = "mongodb+srv://maddclif:2569814795a@cluster0.andql.mongodb.net/open_class_task?retryWrites=true&w=majority";


app.use(logger);
app.use(Express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(session({
    secret: '66c69fe7f539e2780bce1cbc3f8b68c115502e212578238213328f32f20b34a4',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: uri })
}));


app.get('/', (req, res) => {
    res.render('main');
});

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
        res.redirect('/auth');
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
                if (data) {
                    const [verifiablePassword] = encrypt(password, data.salt);
                    if (data.password === verifiablePassword) {
                        req.session.uid = data._id;
                        res.redirect('/news');
                    }
                } else res.send(`Login: ${login} not found!`);
            });
          });
    });

app.get('/news', (req, res) => {
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
        if (error) {
          throw new Error(error);
        }
        const db = client.db("open_class_task");
        const collection = await db.collection("news_collection");
        collection.find({}).toArray().then((data) => {
            if (data) {
                res.render('news', { data });
            } else res.send('News not found');
        });
    });
});

app.route('/show-news/:id')
    .get((req, res) => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
            if (error) {
                throw new Error(error);
            }
            const db = client.db("open_class_task");
            const collection = await db.collection("news_collection");
            const newsId = req.params.id;
            collection.findOne({ _id: MongoClient.ObjectId(newsId) }).then((news) => {
                if (news) {
                    const currentUserId = req.session.uid;
                    const author = currentUserId === news.authorId;
                    const newsId = news._id;
                    res.render('show-news', { news, author, newsId });
                } else res.send('News not found');
            });
        });
    });

app.route('/edit-news/:id')
    .get((req, res) => {
        res.render('edit-news', { newsId: req.params.id });
    })
    .post((req, res) => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
            if (error) {
                throw new Error(error);
            }
            const db = client.db("open_class_task");
            const collection = await db.collection("news_collection");
            const newsId = req.params.id;
            const { title, body } = req.body;
            await collection.updateOne({ _id: MongoClient.ObjectId(newsId) }, { $set: { title, body } });
            res.redirect('/news');
        });
    });

app.route('/post-news')
    .get((req, res) => {
        res.render('post-news');
    })
    .post((req, res) => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
            if (error) {
              throw new Error(error);
            }
            const db = client.db("open_class_task");
            const collection = await db.collection("news_collection");
            const { title, body } = req.body;
            const authorId = req.session.uid;
            const newNews = new News(title, body, authorId);
            const newsMongo = await collection.insertOne(newNews);
            res.redirect(`/show-news/${newsMongo.insertedId}`);
        });
    });

app.listen(8080, () => {
    console.log(`Example app listening on port 8080!`);
});
