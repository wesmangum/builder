'use strict';

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var treeHelper = require('../lib/tree-helper.js');
var _ = require('lodash');

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Node.js: Game'});
};

exports.login = (req, res)=>{

  var user = {
    username: req.body.username,
    wood: 0,
    cash: 0
  };

  users.findOne({username: user.username}, (err, fobj)=>{
    if(!fobj){
      console.log('no results');
      users.save(user, (err, sobj)=>res.send(sobj));
    } else {
      res.send(fobj);
    }
  });
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userId);
  var tree = {
    height: 0,
    userId: userId,
    isHealthy: true,
    isChopped: false
  };

  trees.save(tree, (err, obj)=>{
    res.render('game/tree', {tree: obj, treeHelper: treeHelper}, (err, html)=>{
      res.send(html);
    });
  });

};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.id);
  trees.find({userId: userId}).toArray((err, objs)=>{
    res.render('game/forest', {trees: objs, treeHelper: treeHelper}, (err, html)=>{
      res.send(html);
    });
  });
};

exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.id);

  trees.findOne({_id: treeId}, (err, tree)=>{
    tree.height += _.random(0, 2);
    tree.isHealthy = _.random(0, 100) !== 70;
    trees.save(tree, (err, count)=>{
      res.render('game/tree', {tree: tree, treeHelper: treeHelper}, (err, html)=>{
        res.send(html);
      });
    });
  });
};


exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.id);
  var userId = Mongo.ObjectID(req.body.userId);


  trees.findOne({_id: treeId}, (err, tree)=>{
    users.findOne({_id: userId}, (err, user)=>{

      user.wood += (tree.height / 2);
      tree.isChopped = true;
      tree.isHealthy = false;
      tree.height = 0;

      trees.save(tree, (err, treeCount)=>{
        users.save(user, (err, count)=>{
          res.render('game/tree', {tree: tree, treeHelper: treeHelper}, (err, html)=>{
            res.send({html: html, user: user});
          });
        });
      });
    });
  });

};

exports.sell = (req, res)=>{

  console.log('THIS WORKED!!!!!');
  console.log(req.body);
};
