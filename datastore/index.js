const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
      var createFile = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(createFile, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id, text});
        }
      });
    });
};

exports.readAll = (callback) => {
  var allTodos = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      files.map((file) => allTodos.push({id: file.replace(/.txt/g, ''), text: file.replace(/.txt/g, '')}));
      console.log(allTodos)
      callback(null, allTodos);
    }
  })
};

exports.readOne = (id, callback) => {
  var readFile = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(readFile, 'utf8', (err, file) => {
    if (err){
      callback(err);
    } else {
      console.log({id, text: file})
      callback(null, {id, text: file})
    }
  })

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};