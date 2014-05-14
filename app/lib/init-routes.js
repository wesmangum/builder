'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var game = traceur.require(__dirname + '/../routes/game.js');

  app.get('/', dbg, home.index);
  app.get('/help', dbg, home.help);

  app.get('/game', dbg, game.index);
  app.post('/login', dbg, game.login);
  app.post('/seed', dbg, game.seed);
  app.get('/forest/:id', dbg, game.forest);
  app.put('/tree/:id/chop', dbg, game.chop);
  app.put('/tree/:id/grow', dbg, game.grow);
  app.put('/trade', dbg, game.sell);

  console.log('Routes Loaded');
  fn();
}
