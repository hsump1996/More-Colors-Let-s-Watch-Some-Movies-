// app.js
const express = require('express');
const app = express();

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
            res.render('movies', {movies: movies, condition: false});
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
        res.redirect('/movies');
    });
});

app.listen(3000);
