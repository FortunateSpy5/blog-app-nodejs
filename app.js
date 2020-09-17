const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;



// STATIC
app.use(express.static("public"));

// BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true
}));

// SET EJS AS DEFAULT
app.set('view engine', 'ejs');



// MONGOOSE CONNECT
mongoose.connect('mongodb://localhost:27017/blog_app', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to database!'))
    .catch(error => console.log(error.message));

// BLOG SCHEMA
const blogSchema = new mongoose.Schema({
    title: String,
    image: {
        type: String,
        default: 'https://blog.mailrelay.com/wp-content/uploads/2018/03/que-es-un-blog-1.png'
    },
    body: String,
    created: {
        type: Date,
        default: Date.now()
    }
});

// BLOG MODEL
const Blog = mongoose.model('Blog', blogSchema);



// RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
});


app.get('/blogs', (req, res) => {
    Blog.find(function (err, blogs) {
        if (err) {
            console.log(err.message);
        } else {
            res.render('index', {
                title: 'Blog',
                blogs: blogs
            });
        }
    })
});


app.get('/blogs/new', (req, res) => {
    res.render('new', {
        title: 'New Blog'
    });
});

app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {
                title: blog.title,
                blog: blog
            })
        }
    })
});


app.get('/blogs/:id/edit', (req, res) => {
    res.render('edit', {
        title: 'Edit Blog'
    });
});


app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog, function (err, blogs) {
        if (err) {
            console.log(err.message);
        } else {
            res.redirect('/blogs')
        }
    })
});



app.listen(port, () => console.log(`Blog app listening on port $port!`))