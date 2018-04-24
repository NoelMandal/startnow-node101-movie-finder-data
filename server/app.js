const express = require('express');
var morgan = require('morgan');
var axios = require('axios');
// declared outside of app.get wrap saves as objects instead of array {} 
cache = {};

//middleware
const app = express();
app.use(morgan('dev'));

// app.get server used to get data with express
app.get("/", function (req, res) {
    //declaring variables of the possible incoming params using req.query. i= or t=
    var movieId = req.query.i;
    var movieTitle = req.query.t;

    //if there is something within movieId,
    if (movieId) {
        //look in cache to find matching movieId, THEN (?) respond with movie data
        cache[movieId] ? res.send(cache[movieId]) : null
      // if there is something in movieTitle var, look through cache then same above
    } else if(movieTitle) {
        cache[movieTitle] ? res.send(cache[movieTitle]) : null
      // error data if nothing sent   
    } else {
        res.status(400).send("You didn't send a title or id")
        return // break
    }

//if nothing in cache matches, use these ifs/elses

    // if something in movieId not matching in cache
    if (movieId) {
        //use axios to 'get' from ombdAPI adding the params of i and apiKey(case sensitive)
        axios
            .get('http://www.omdbapi.com', {
                params: {
                    i: movieId,
                    apiKey: '8730e0e'
                }
            })
            //then reponse function
            .then(response => {
                //console.log test 
                console.log('/ route with ' + JSON.stringify(response.data));
                res.json(response.data); // respond to screen the the response data.
                cache[movieId] = response.data // saves new data into cache 'server' under movie ids 
            });
    } else { // does same thing as above but with movieTitle var
        axios
            .get('http://www.omdbapi.com/', {
                params: {
                    t: movieTitle,
                    apiKey: '8730e0e'
                }
            })
            .then(response => {
                console.log('/ route with ' + JSON.stringify(response.data));
                res.json(response.data);
                cache[movieTitle] = response.data
            })
    }
})
//made new route to see what is in cache after requests
app.get('/cache', (req, res) => {
    res.json(cache)
})

module.exports = app;
