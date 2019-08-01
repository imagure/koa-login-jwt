process.env.NODE_ENV = 'local_test';
process.env.PORT = '3000'

//routes.test.js
const request = require('supertest');
const server = require('../../../server.js');
const signToken = require('../../../src/routes/utils').signToken;
const verifyToken = require('../../../src/routes/utils').verifyToken;
const knex = require('../../../src/db/connection');

beforeAll(async () => {
	return knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
});

afterAll(async () => {
	await server.close();
	console.log('server closed!');
	return knex.migrate.rollback();
});

describe('tests before login', () => {
	
	test('Error when GET /users before login', () => {
		request(server)
		.get('/users')
		.then(response => {
			expect(response.body.message).toEqual("Error")
		})
 	});

 	test('failing GET /users with wrong token', () => {
		request(server)
		.get('/users')
		.set('Authorization',  'Bearer ' + '1234')
		.then(response => {
			expect(response.body.message).toEqual("invalid User")
		})
 	});

	test('failing /login with wrong password', () => {
		request(server)
		.post('/login')
		.send({name: 'Ricardo', password: 'wrong'})
		.then(response => {
			expect(response.body.message).toEqual("Fail")
		})
 	});

 	test('failing /login with wrong User', () => {
		request(server)
		.post('/login')
		.send({name: 'WrongName', password: '123'})
		.then(response => {
			expect(response.body.message).toEqual("Error")
		})
 	});

 	test('failing /new_user with missing Name', () => {
		request(server)
		.post('/new_user')
		.send({name: null, password: '123'})
		.then(response => {
			expect(response.body.message).toEqual("Error")
		})
 	});

 	test('failing /new_user with missing Password', () => {
		request(server)
		.post('/new_user')
		.send({name: 'Ricardo', password: null})
		.then(response => {
			expect(response.body.message).toEqual("Error")
		})
 	});

 	test('success create /new_user', () => {
		request(server)
		.post('/new_user')
		.send({name: 'NewUser1', password: '123'})
		.then(response => {
			expect(response.body.message).toEqual("New User: NewUser1")
		})
 	});

 	test('success /login', () => {
		request(server)
		.post('/login')
		.send({name: 'Ricardo', password: '123'})
		.then(response => {
			expect(response.body.message).toEqual("Success")
			expect(Object.keys(response.body)).toContain('token')
		})
 	});

describe('tests after login', () => {

 	test('success GET /users after login', () => {
		request(server)
		.post('/login')
		.send({name: 'Ricardo', password: '123'})
		.then((response) => {
			expect(response.body.message).toEqual("Success")
			expect(Object.keys(response.body)).toContain('token')
			const token = response.body.token
			request(server)
			.get('/users')
			.set('Authorization',  'Bearer ' + token)
			.then(response2 => {
				expect(response2.body.message).toEqual("Success")
			})
		})
 	});

 	test('success create and login new user', () => {
		request(server)
		.post('/new_user')
		.send({name: 'NewUser2', password: '123'})
		.then(response => {
			expect(response.body.message).toEqual("New User: NewUser2")
			request(server)
			.post('/login')
			.send({name: 'NewUser2', password: '123'})
			.then((response2) => {
				expect(response2.body.message).toEqual("Success")
				expect(Object.keys(response2.body)).toContain('token')
			})
		})
 	});

});
});
