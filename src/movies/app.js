// app.js
const express = require('express');

const app = express();

const session = require('express-session');

const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};

app.use(session(sessionOptions));

app.set('view engine', 'hbs');

require('./db.js');

const mongoose = require('mongoose');

const Movie = mongoose.model('Movie');

const path = require('path');

const publicPath = path.resolve(__dirname, "public");

app.use(express.static(publicPath));

app.use(express.urlencoded({ extended: false }));

app.get('/movies', function(req, res) {

    //Gets the value of query string parameters
    const directorName = req.query.director;

    Movie.find({}, function(err, movies, count) {
        
        //Case when the user did not enter anything --> shows all the movies
        if (directorName === undefined) {
            res.render('movies', {movies: movies});

        //Case when user entered an existing director's name
        //Filters the movies by director name
        } else {
            res.render('movies', {movies: movies.filter(movie =>  directorName === movie.director), directorName, condition: true});
        }
    });
});

//Handles creating another template file
//Adds form to my template
app.get('/movies/add', function(req, res){
    res.render('add');
});

//Creates new movie in the object
app.post('/movies/add', function(req, res) {
    new Movie({
        title: req.body.title,
        director: req.body.director,
        year: req.body.year
    }).save(function(err, movies, count){
        
        //Case when mymovies array(array objects) is not defined or has not been created
        if (req.session.mymovies === undefined) {
            req.session.mymovies = [];
            req.session.mymovies.push({
            title: req.body.title,
            director: req.body.director,
            year: req.body.year
        }) 
        //Case when mymovies array is already created
        } else {
            req.session.mymovies.push({
            title: req.body.title,
            director: req.body.director,
            year: req.body.year
        });
    }
        res.redirect('/movies');
    });
});

// Shows all of the movies that have been added by the user during their session
app.get('/mymovies', function(req, res) {

    //Keeps track of the added movies with mymovies array(array of movie objects)
    const mymovies = req.session.mymovies;
    res.render('mymovies', {mymovies: mymovies});
});

app.listen(3000);
