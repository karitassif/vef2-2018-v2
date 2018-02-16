const { Client } = require('pg');
const xss = require('xss'); //eslint-disable-line

const connectionString = process.env.DATABASE_URL ||
'postgres://postgres:29282322@localhost/vef2-2018-v2';

async function addForm(form) {
    const client = new Client({connectionString});
    client.connect();
    try {

        const values = [form.name, form.email, form.ssn, form.count];
        await client.query('INSERT INTO form (name, email, ssn, count) VALUES ($1, $2, $3, $4)' ,values);
    } catch (e) {
        console.error('Error message', e);
        return -1;
    } 
    await client.end();
 }

 async function select() {
     console.log("er í select falpiunu")
    const client = new Client({connectionString});
    client.connect();
    try {
        const res = await client.query('SELECT * FROM form');
        return res.rows;
    } catch (e) {
        console.error('Error message', e);
    } 
    await client.end();
 }

 module.exports = {
     addForm,
     select,
 }