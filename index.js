
var ShapeFileStream = require('./lib/ShapeFileStream'),
    stringify = require('./lib/stringify');

function createReadStream( filename, shapeFileOptions ){
  return new ShapeFileStream( filename, shapeFileOptions );
}

module.exports = {
  createReadStream: createReadStream,
  stringify: stringify
}