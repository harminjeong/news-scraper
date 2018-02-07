var express = require("express");
var exphbs = require("express-handlebars");
// var mongojs = require("mongojs");
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname, 'public'));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// var databaseUrl = "scraper";
// var collections = ["scrapedData"];

// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error))

app.get("/scrape", function(req, res) {

    axios.get("https://news.ycombinator.com/".then(function(response) {

        var $ = cheerio.load(response.data);

            var result = {};

        $("a.storylink").each(function(i, element) {

            var link = $(element).attr("href");
            var title = $(element).text();

            result.link = $(this).children("a").attr("href");
            result.title = $(this).children("a").text();

            db.Article.create(result).then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);

        });
    });
        res.send("Scrape Complete");
}));
});