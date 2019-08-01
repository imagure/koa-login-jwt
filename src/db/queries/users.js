const knex = require('../connection');
const uuid = require('uuid/v1');

function getAllUsers() {
  return knex('users')
  .select('*');
}

function insertNewUser(name, hash) {
  try{
    return knex('users')
            .insert({id: uuid(),
                     name: name, 
                     password: hash
                   });
  } catch(e) {
    return e
  }
}

function getUserPwd(name) {
  return knex('users')
  .select('password')
  .where('name', name);
}

module.exports = {
  getAllUsers: getAllUsers,
  getUserPwd: getUserPwd,
  insertNewUser: insertNewUser
};
