const koa = require('koa');
const routes = require("./src/routes/routes").router

const app = new koa();

app.use(routes.routes());

const server = app.listen(process.env.PORT || 4000, function(){
	console.log("Server running")
});

module.exports = server;
