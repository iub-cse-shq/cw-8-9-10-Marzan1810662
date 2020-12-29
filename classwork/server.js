var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
    // const { dirname } = require('path')
var app = express()
var server = http.Server(app)
var Article = require('./article.model')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//DB connection
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/cw10' //change this if you are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', function(err) {
    console.log(err)
})


// server routes go here
app.get('/', function(request, response) {
    //console.log(request)
    // response.status(200)
    response.sendFile(__dirname + '/index.html')
})
app.get('/second', function(request, response) {
    //render second.html in the response
    //console.log('second route request')
    response.sendFile(__dirname + '/second.html')
})
app.get('/article/form', function(request, response) {
    response.sendFile(__dirname + '/form.html')
})


// app.post('/article/new', function(request, response) {
//     //render second.html in the response
//     console.log('post request')
//     console.log(request.body)
// })

var articles = [{ title: 'test', content: 'test' },
    { title: 'test1', content: 'test1' },
    { title: 'test2', content: 'test2' },
    { title: 'test3', content: 'test3' }
]

// app.post('/article/new', function(request, response) {
//     let newArticle = request.body
//     if (newArticle.title) {
//         articles.push(request.body)
//         console.log(articles)
//         response.json(articles)
//     } else {
//         response.status(400).json({
//             msg: 'No title added'
//         })
//     }
// })


//post api for db
app.post('/article/new', function(request, response) {
    var newArticle = new Article(request.body)
    newArticle.save(function(err, data) {
        if (err)
            return response.status(400).json({
                error: 'Title is missing'
            })
        return response.status(200).json({
            message: 'Article created successfully'
        })
    })
})


// app.get('/article/:id', function(request, response) {
//     console.log(request.params.id)
//     response.render('article.ejs', {
//         article: articles[request.params.id]
//     })
// })


//get api to see specif article
app.get('/article/:id', function(request, response) {
    Article.findById(request.params.id, function(err, data) {
        response.render('article.ejs', {
            article: data
        })
    })
})



// app.get('/articles/all', function(request, response) {
//     response.render('allArticles.ejs', {
//         articles: articles
//     })
// })


//get api to see all articles from db
app.get('/articles/all', function(request, response) {
    Article.find({}, function(err, data) {
        response.render('allArticles.ejs', {
            articles: data
        })
    })
})


server.listen(process.env.PORT || 3000,
        process.env.IP || 'localhost',
        function() {
            console.log('Server running');
        })
    // module.exports = { app, server }
module.exports = { app, server, mongoose }