const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const signingKEY  = fs.readFileSync('./private.key', 'utf8');
const salt = bcrypt.genSaltSync(10);

function encryptPwd(password) {
	return bcrypt.hashSync(password, salt)
}

function isValidUser(password, hash) {
	return bcrypt.compareSync(password, hash[0].password)
}

const signOptions = {
 issuer:  'FDTE',
 subject:  'user@fdte.io',
 audience:  'fdte.io',
 expiresIn:  "1h",
 algorithm:  "HS256"
};

function signToken(payload) {
	return jwt.sign(payload, signingKEY, signOptions)
}

function verifyToken(token) {
	try {
		const decoded = jwt.verify(token, signingKEY, signOptions)
		return decoded
	} catch(err){
		return false
	}
}

module.exports = {
	encryptPwd: encryptPwd,
	isValidUser: isValidUser,
	signToken: signToken,
	verifyToken: verifyToken
}