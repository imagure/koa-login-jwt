const encryptPwd = require('../../routes/utils').encryptPwd;
const uuid = require('uuid/v1');

const hash = encryptPwd('123')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
  .then(() => {
    return knex('users').insert({
      id: uuid(),
      name: 'Joao',
      password: hash
    });
  })
  .then(() => {
    return knex('users').insert({
      id: uuid(),
      name: 'Ricardo',
      password: hash
    });
  })
};
