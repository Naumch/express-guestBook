const mysql = require("mysql2");
const express = require("express");
const moment = require("moment");
const expressHandlebars = require("express-handlebars");

const handlebars = expressHandlebars.create({
	defaultLayout: 'main', 
	extname: 'hbs',
  helpers: {
    format: function(date) {
      return moment(date).format('DD.MM.YYYY');
    }
  }
});
 
const app = express();
const urlencodedParser = express.urlencoded({extended: false});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public/'))
 
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "guest_book",
  password: "4567"
});
 
app.get("/", function(req, res){
  pool.query("SELECT * FROM posts", function(err, data) {
    if(err) return console.log(err);

    res.render('form', {
      posts: data.reverse()
    });
  });
});

app.post("/", urlencodedParser, function (req, res) {       
  if(!req.body) return res.sendStatus(400);

  const name = req.body.name;
  const text = req.body.text;
  const date = moment().format('YYYY-MM-DD');
  
  pool.query("INSERT INTO posts (name, text, date) VALUES (?,?,?)", [name, text, date], function(err, data) {
    if(err) return console.log(err);
  });

  res.redirect('/');
});

app.use(function(req, res) {
	res.render('404');
});
 
app.listen(3000, function(){
  console.log("running");
});