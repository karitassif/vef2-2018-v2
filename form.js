const express = require('express');
const { check, validationResult } = require('express-validator/check');

const xss = require('xss');
const sql = require('./sql');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.post(
  '/addForm',

  // Þetta er bara validation! Ekki sanitization
  check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1 }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),
  check('count').isInt({ min: 1 }).withMessage('Fjöldi verður að vera meira en 0'),

  async (req, res) => { // eslint-disable-line
    const {
      name = '', // eslint-disable-line
      email = '', // eslint-disable-line
      ssn = '', // eslint-disable-line
      count = '1', // eslint-disable-line
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(i => i.msg);

      return res.render('form', { errors: errorMessages });
    }
    await sql.addForm(xss(req.body));
    res.render('success');
  },
);


function form(req, res) {
  const data = {};
  res.render('form', { data });
}

router.get('/', form);

module.exports = router;
