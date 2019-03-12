const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

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

var readdirPromised = Promise.promisify(fs.readdir);
var readFilePromised = Promise.promisify(fs.readFile);

exports.readAll = (callback) => {
  readdirPromised(exports.dataDir)
    .then(function(filenames) {
      var data = filenames.map(function(file) {
        var filePath = path.join(exports.dataDir, file);
        var id = file.replace(/.txt/g, '');
        var text = '';
        return readFilePromised(filePath, 'utf8')
          .then(function(text){
            return {id, text};
          })
      })
      Promise.all(data)
        .then(function(array) {
          callback(null, array)
        });
    })
};

exports.readOne = (id, callback) => {
  var readFile = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(readFile, 'utf8', (err, file) => {
    if (err){
      callback(err);
    } else {
      callback(null, {id, text: file})
    }
  })
};

exports.update = (id, text, callback) => {
  var updateFile = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(updateFile, (err, fileData) => {
    if (err) {
      callback(err, null)
    } else {
      fs.writeFile(updateFile, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id, text});
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  var deleteFile = path.join(exports.dataDir, `${id}.txt`);
    fs.unlink(deleteFile, (err) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, deleteFile)
      }
    })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};