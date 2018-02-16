const { Client } = require('pg')
const xss = require('xss');
const sql = require('./sql');
const cookieParser = require('cookie-parser');
const { Strategy } = require('passport-local');
const users = require('./users');
const csv = require('express-csv');



const express = require('express');
const router = express.Router();


function ensureLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    return res.redirect('/login');
  }

  

  
// ensureLoggedIn,
router.get('/',  async (req, res) => {
    const data = await sql.select()
    //console.log(forms);

    res.render('table', { list: data });
});

  



/*



router.get('/admin', ensureLoggedIn, async (req, res) => {

    res.render('form', {});
});

*/



async function csvhandler(req, res) {
    const result = await sql.select().catch(err => {
        console.error(item)
    });

    var table = [['id', 'date', 'name', 'email', 'ssn', 'count']]
    result.forEach( item => {
        table.push([item.id, item.date, item.email, item.ssn, item.count])
    });
    res.setHeader('Content-Dispsition', 'attachment; filename=table.csv');
    res.csv(table);
}

async function admin(req, res){
    const list = await sql.select().catch(err => console.error(err));
    res.render('admin', {list, user:res.locals.user})
}

router.get('/', ensureLoggedIn, admin);
router.get('/csv', ensureLoggedIn, csvhandler);

module.exports = router;
