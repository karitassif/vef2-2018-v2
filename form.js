const express = require('express');
const { check, validationResult } = require('express-validator/check');

//const { Client } = require('pg')
const xss = require('xss');
const sql = require('./sql');
const cookieParser = require('cookie-parser');
const {Strategy} = require('passport-local');
const users = require('./users');
const csv = require('express-csv');

const connectionString = process.env.DATABASE_URL ||
'postgres://postgres:29282322@localhost:5432/vef2-2018-v2';


const router = express.Router();

router.use(express.urlencoded({extended: true}))


router.post('/addForm',
   
  // Þetta er bara validation! Ekki sanitization
  check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1}).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),
  check('count').isInt({ min: 1}).withMessage('Fjöldi verður að vera meira en 0'),

  async (req, res) => {
    const {
      name = '',
      email = '',
      ssn = '',
      count= '1'
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(i => i.msg);

      return res.render('form', { errors:errorMessages })
    }
    console.log(req.body);
    const result = await sql.addForm(xss(req.body));
    res.render('success');

});
  
  /* await addForm(xss(form));

   res.redirect('/admin');
});*/

/*
const client = new Client({ connectionString });
client.connect();


client.query('SELECT * FROM test;', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }

  client.end();
});

*/

function form(req, res) {
  const data = {};
  res.render('form', { data });
}

router.get('/', form);

module.exports = router;