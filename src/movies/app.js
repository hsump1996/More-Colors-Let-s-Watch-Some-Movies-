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

    const directorName = req.query.director;

    Movie.find({}, function(err, movies, count) {
        if (directorName === undefined) {
            res.render('movies', {movies: movies});
        } else {
            res.render('movies', {movies: movies.filter(movie => movie.director === directorName), directorName, condition: true});
        }
    });
});

app.get('/movies/add', function(req, res){
    res.render('add');
});

app.post('/movies/add', function(req, res) {
    new Movie({
        title: req.body.title,
        director: req.body.director,
        year: req.body.year
    }).save(function(err, movies, count){
        if (req.session.mymovies === undefined) {
            req.session.mymovies = [];
            req.session.mymovies.push({
            title: req.body.title,
            director: req.body.director,
            year: req.body.year
        }) 
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

app.get('/mymovies', function(req, res) {

    const mymovies = req.session.mymovies;
    res.render('mymovies', {mymovies: mymovies});
});

app.listen(3000);
