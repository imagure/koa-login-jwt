const router = require('koa-router')();
const koaBody = require('koa-body');
const isValidUser = require('./utils').isValidUser;
const encryptPwd = require('./utils').encryptPwd;
const privateKEY = require('./utils').privateKEY;
const signToken = require('./utils').signToken;
const verifyToken = require('./utils').verifyToken;
const queries = require('../db/queries/users');


router.get('/users', async function(ctx, next) {
  try {
    token = ctx.request.header.authorization.split(" ")[1]
    const decoded = await verifyToken(token);
    if (decoded){
      const users = await queries.getAllUsers();
      ctx.body = {users: users, message: 'Success'}
    } else {
      ctx.body = {message: 'invalid User'}
    }
  } catch (err) {
    ctx.body = {message: 'Error'}
  }
});

router.post('/login', koaBody(), async function(ctx, next) {
  try {
    const hash = await queries.getUserPwd(ctx.request.body.name);
    if (isValidUser(ctx.request.body.password, hash)){
      const token = await signToken(ctx.request.body)
      ctx.body = {token: token, message: 'Success'}
    } else {
      ctx.body = {message: 'Fail'}
    }
  } catch (err) {
    ctx.body = {message: 'Error'}
  }
});

router.post('/new_user', koaBody(), async function(ctx, next) {
  try {
    const name = ctx.request.body.name
    const hash = encryptPwd(ctx.request.body.password)
    await queries.insertNewUser(name, hash)
    ctx.body = {message: 'New user: ' + name}
  } catch(err) {
    ctx.body = {message: 'Error'}
  }
});

module.exports = {
  router: router
}