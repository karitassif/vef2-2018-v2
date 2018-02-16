const sql = require('./sql');

const express = require('express');

const router = express.Router();


function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

router.get('/', ensureLoggedIn, async (req, res) => {
  const data = await sql.select();

  res.render('table', { list: data });
});


async function csvhandler(req, res) {
  const result = await sql.select().catch(() => {
    console.error();
  });

  const table = [['id', 'date', 'name', 'email', 'ssn', 'count']];
  result.forEach((item) => {
    table.push([item.id, item.date, item.email, item.ssn, item.count]);
  });
  res.setHeader('Content-Dispsition', 'attachment; filename=table.csv');
  res.csv(table);
}

async function admin(req, res) {
  const list = await sql.select().catch(err => console.error(err));
  res.render('admin', { list, user: res.locals.user });
}

router.get('/', ensureLoggedIn, admin);
router.get('/csv', ensureLoggedIn, csvhandler);

module.exports = router;
