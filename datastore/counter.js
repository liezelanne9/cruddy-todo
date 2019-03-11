const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

// Asynchronously reads the entire contents of a file.
const readCounter = (callback) => {
  // fileData is our data that is read from file
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

// Asynchronously writes data to a file, replacing the file if it already exists. 
const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // counter = counter + 1;
  // return zeroPaddedNumber(counter);
  // fs.readFile(exports.counterFile, (err, fileData) => {
  //   

  readCounter((err, id) => {
    if (err) {
      throw ('error writing counter');
    } else {
      id += 1;
      writeCounter(id, (err, id) => {
        if (err) {
          callback(err);
        } else {
          callback(null, id)
        }
      });
    }
  })
  // if (err) {
  //     callback(err, null);
  //   } else {
  //     callback(null, Number(fileData));
  //   }
  // });
  // }


};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');

// fs.readFile returns data to us (example 0)
  // callback can be set data to counter variable
// increment counter by 1 (new id to create)
// pass counter to fs.writefile (which turns it into a 0-padded number)
  // run callback if success