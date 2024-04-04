const express = require('express');
const database = require('better-sqlite3');
const bodyParser = require('body-parser');
const port = 5000;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
const db = new database('contacts.db');
const sql = 'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, email TEXT)';
db.exec(sql);
app.get('/', (req, res)=>{
  const sql = 'SELECT * FROM contacts'; 
  const contacts = db.prepare(sql).all();
	res.render('home', {contacts});
});

app.get('/newContact', (req, res)=>{
	res.render('newContact', {})
});

app.post('/newContact', (req, res)=>{
  const {name, phone, email} = req.body;
  const sql = 'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)';
  const insertData = db.prepare(sql);
  insertData.run(name, phone, email);
  res.redirect('/');
});

app.get('/editContact/:id', (req, res) => {
  const sql = "SELECT * FROM contacts WHERE id = ?";
  const contact = db.prepare(sql).get(req.params.id);
  res.render('editContact', {contact});
})

app.post('/editContact', (req, res) => {
  const {id, name, phone, email} = req.body;
  const sql = "UPDATE contacts set name = ?, phone = ?, email = ? WHERE id = ?"
  const updateData = db.prepare(sql);
  updateData.run(name, phone, email, id);
  res.redirect('/');
})

app.get('/deleteContact/:id', (req, res) => {
  const sql = "DELETE FROM contacts WHERE id = ?";
  const deleteData = db.prepare(sql);
  deleteData.run(req.params.id);
  res.redirect('/');
});

app.listen(port, (err)=>{
  if(err){
    console.log(`Could not start server. Error: ${err.message}`);
  } else{
    console.log(`Server running on port 127.0.0.1:${port}`);
  }
})