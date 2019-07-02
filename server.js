'use strict';

const Hapi = require('hapi');
const Path = require('path');
const fs = require('fs-extra');
const axios = require('axios');

// Create a server with a host and port  
/*
const server = Hapi.server({
  host: '10.101.26.102',
  port: 8051,
  routes: {
    "cors" : true
  }
});
// */
const server = Hapi.server({
  host: '192.168.2.130',
  port: 8051,
  routes: {
    "cors" : true,
    files: {
        relativeTo: Path.join(__dirname, 'dist')
    }
  }
});

const diamondAssets = require('./lib/diamondAssets');

async function getGame(game_pk)
{
    let url = `https://statsapi.mlb.com/api/v1.1/game/${game_pk}/feed/live/`;
    let ret = {};
    await axios.get(url)
        .then(res => {
            ret = res.data;
        })
        .catch(err => {
            console.log(err);
            ret = {};
        });
    return ret;
}

// Add the route  

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return h.file('index.html');
    }
});

server.route({
  method: 'GET',
  path: '/hello',
  handler: function (request, h) {

    return 'Hello World!';
  }
});

server.route({
    method: 'GET',
    path: '/css/{file_name}',
    handler: async function (request, h) {
        let _path = Path.join('css', request.params.file_name);
        return h.file(_path);
        /*
        let file = fs.readFileSync(_path);
        return file;
        // */
    }
});

server.route({
    method: 'GET',
    path: '/js/{file_name}',
    handler: async function (request, h) {
        let _path = Path.join('js', request.params.file_name);
        return h.file(_path);
        /*
        let file = fs.readFileSync(_path);
        return file;
        // */
    }
});

server.route({
    method: 'GET',
    path: '/img/{file_name}',
    handler: async function (request, h) {
        let _path = Path.join('img', request.params.file_name);
        console.log("IMG", _path);
        return h.file(_path);
    }
});

server.route({
  method: 'GET',
  path: '/schedule/{sched_date}',
  handler: async function (request, h) {
    console.log('in schedule');
    let schedule = require("./lib/schedule");
    let date = require("./lib/date");
    let req_date;
    console.log(`request.params.sched_date: ${request.params.sched_date}`);
    req_date = date.isoToDate(new Date(request.params.sched_date));
        //TODO add optional flag 
        console.log(`req_date: ${req_date}`);
    const jvSched = await schedule.get(req_date).catch((err) => {console.log(err);})
    return jvSched;
  }
});

server.route({
  method: 'GET',
  path: '/game/{game_pk}',
  handler: async function (request, h) {
      /*
    console.log('in schedule');
    let Game = require("./lib/Game");
        //TODO add optional flag 
    let myGame = new Game(request.params.game_pk, null);
    let jvGame = { game_pk: request.params.game_pk};
    jvGame["boxscore"] = await myGame.getBoxscore().catch((err) => {console.log(err);})
    jvGame["linescore"] = await myGame.getLinescore().catch((err) => {console.log(err);})
    return jvGame;
    */
   console.log('getting game');
   return await getGame(request.params.game_pk);
  }
});

server.route({
  method: 'GET',
  path: '/assetsearch/{game_pk}',
  handler: async function (request, h) {
    let data = await diamondAssets.get(request.params.game_pk).catch((err) => { console.log(err) });
    console.log(data);
    return data.associated_info;
  }
})


// Start the server  
async function start () {
  await server.register(require('@hapi/inert'));

  try {
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

start();
