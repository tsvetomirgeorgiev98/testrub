
const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/profiles";
const express = require('express'); //npm install express
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser
const app = express();
var currentUser;
app.use(express.static('public'));
//this tells express we are using sesssions. These are variables that only belong to one user of the site at a time.
app.use(session({ secret: 'example' }));

app.use(bodyParser.urlencoded({
  extended: true
}))
// set the view engine to ejs
app.set('view engine', 'ejs');

var db;
var userEvents = [];

//this is our connection to the mongo db, ts sets the variable db as our database
MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(8080);
  console.log('listening on 8080');
});


//********** GET ROUTES - Deal with displaying pages ***************************

//this is our root route
app.get('/', function(req, res) {
  //if the user is not logged in redirect them to the login page
  if(!req.session.loggedin){res.redirect('/index');return;}

  //otherwise perfrom a search to return all the documents in the people collection
  db.collection('people').find().toArray(function(err, result) {
    if (err) throw err;
    //the result of the query is sent to the users page as the "users" array
    res.render('pages/index', {
      users: result
    })
  });

});

//this is our login route, all it does is render the login.ejs page.
app.get('/index', function(req, res) {
  res.render('pages/index');
});

app.get('/calendar', function(req, res) {
  if(!req.session.loggedin){res.redirect('/index');return;}

  // db.collection('events').find(function(err, result) {
  //   if (err) throw err;
  //   //console.log(uname+ ":" + result);
  //   //finally we just send the result to the user page as "user"
  //   res.render('pages/calendar', {
  //     event: result
  //   })
  // });
  res.render('pages/calendar');
  })

app.get('/aboutus', function(req, res) {
  res.render('pages/aboutus');
});

app.get('/register', function(req, res) {
  if(req.session.loggedin){res.redirect('/logout');return;}
  res.render('pages/register');
});

// //this is our profile route, it takes in a username and uses that to search the database for a specific user
// app.get('/profile', function(req, res) {
//   if(!req.session.loggedin){res.redirect('/login');return;}
//   //get the requested user based on their username, eg /profile?username=dioreticllama
//   var uname = req.query.username;
//   //this query finds the first document in the array with that username.
//   //Because the username value sits in the login section of the user data we use login.username
//   db.collection('people').findOne({
//     "login.username": uname
//   }, function(err, result) {
//     if (err) throw err;
//     //console.log(uname+ ":" + result);
//     //finally we just send the result to the user page as "user"
//     res.render('pages/profile', {
//       user: result
//     })
//   });
//
//
//
// });

//logour route cause the page to Logout.
//it sets our session.loggedin to false and then redirects the user to the login
app.get('/logout', function(req, res) {
  req.session.loggedin = false;
  req.session.destroy();
  res.redirect('/');
});




//********** POST ROUTES - Deal with processing data from forms ***************************


//the dologin route detasl with the data from the login screen.
//the post variables, username and password ceom from the form on the login page.
app.post('/dologin', function(req, res) {
  console.log(JSON.stringify(req.body))
  var uname = req.body.username;
  var pword = req.body.password;

  db.collection('people').findOne({"login.username":uname}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error
    //if there is no result, redirect the user back to the login system as that username must not exist
    if(!result){res.redirect('/index');return}
    //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
    if(result.login.password == pword){ req.session.loggedin = true; currentUser = result.login.username ;res.redirect('/calendar') }
    //otherwise send them back to login
    else{res.redirect('/index')}
  });
});

// //the delete route deals with user deletion based on entering a username
// app.post('/delete', function(req, res) {
//   //check we are logged in.
//   if(!req.session.loggedin){res.redirect('/login');return;}
//   //if so get the username variable
//   var uname = req.body.username;
//
//   //check for the username added in the form, if one exists then you can delete that doccument
//   db.collection('people').deleteOne({"login.username":uname}, function(err, result) {
//     if (err) throw err;
//     //when complete redirect to the index
//     res.redirect('/');
//   });
// });


//the adduser route deals with adding a new user



app.post('/adduser', function(req, res) {
  //check we are logged in
  if(req.session.loggedin){res.redirect('/index');return;}

  //we create the data string from the form components that have been passed in

var datatostore = {
"gender":req.body.gender,
"name":{"title":req.body.title,"first":req.body.first,"last":req.body.last},
"location":{"street":req.body.street,"city":req.body.city,"state":req.body.state,"postcode":req.body.postcode},
"email":req.body.email,
"login":{"username":req.body.username,"password":req.body.password},
"dob":req.body.dob,"registered":Date(),
"picture":{"large":req.body.large,"medium":req.body.medium,"thumbnail":req.body.thumbnail},
"nat":req.body.nat}


//once created we just run the data string against the database and all our new data will be saved/
  db.collection('people').save(datatostore, function(err, result) {
    if (err) throw err;
    console.log('saved to database')
    //when complete redirect to the index
    res.redirect('/')
  })
});
