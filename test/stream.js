
var fs = require('fs'),
    path = require('path'),
    through = require('through2'),
    ShapeFileStream = require('../lib/ShapeFileStream');

var fixtures = {
  example: {
    shp: path.resolve( __dirname + '/fixtures/example.shp' ),
    dbf: path.resolve( __dirname + '/fixtures/example.dbf' )
  }
}

// extract a single record from the stream
function getRecordNo( i, cb ){
  var x = 0;
  return through.obj( function( chunk, enc, next ){
    if( x++ === i ){ cb( chunk, enc ); }
    this.push( chunk, enc );
    next();
  });
}

module.exports.stream = {};

// check the fixtures files are present
module.exports.stream.fixtures = function(test, common) {
  test('check fixtures are present', function(t) {
    t.equal( fs.existsSync( fixtures.example.shp ), true, 'fixture file present' );
    t.equal( fs.existsSync( fixtures.example.dbf ), true, 'fixture file present' );
    t.end();
  });
}

// check the stream correctly parses the shapefile
module.exports.stream.parse = function(test, common) {
  test('parse shapefiles', function(t) {
    var stream = new ShapeFileStream( fixtures.example.shp );
    stream.pipe( through.obj( function( chunk, enc, next ){
      t.equal( typeof chunk.type, 'string', 'type parsed correctly' );
      t.equal( chunk.type, 'Feature', 'type parsed correctly' );
      t.equal( typeof chunk.properties, 'object', 'properties parsed correctly' );
      t.equal( Object.keys(chunk.properties).length, 22, 'properties parsed correctly' );
      t.equal( typeof chunk.geometry, 'object', 'geometry parsed correctly' );
      t.equal( typeof chunk.geometry.type, 'string', 'geometry parsed correctly' );
      t.equal( Array.isArray(chunk.geometry.coordinates), true, 'geometry parsed correctly' );
    }));
    t.end();
  });
}

// check the stream correctly parses the first shapefile
module.exports.stream.first = function(test, common) {
  test('first shapefile', function(t) {
    var stream = new ShapeFileStream( fixtures.example.shp );
    stream.pipe( getRecordNo( 1, function( chunk, enc ){
      t.equal( chunk.type, 'Feature', 'type parsed correctly' );
      t.equal( chunk.geometry.type, 'MultiPolygon', 'geometry parsed correctly' );

      t.equal( Array.isArray(chunk.geometry.coordinates), true, 'geometry parsed correctly' );
      t.equal( chunk.geometry.coordinates.length, 2, 'geometry parsed correctly' );

      var firstCoordinate = chunk.geometry.coordinates[ 0 ];
      t.equal( Array.isArray(firstCoordinate), true, 'coordinates parsed correctly' );
      t.equal( firstCoordinate.length, 1, 'coordinates parsed correctly' );

      var firstSubCoordinate = firstCoordinate[ 0 ];
      t.equal( Array.isArray(firstSubCoordinate), true, 'coordinates parsed correctly' );
      t.equal( firstSubCoordinate.length, 33, 'coordinates parsed correctly' );

      var firstSubSubCoordinate = firstSubCoordinate[ 0 ];
      var expected = [ 8.717200499999791, 47.69064399999985 ];
      t.equal( Array.isArray(firstSubSubCoordinate), true, 'coordinates parsed correctly' );
      t.equal( firstSubSubCoordinate.length, 2, 'coordinates parsed correctly' );
      t.deepEqual( firstSubSubCoordinate, expected, 'coordinates parsed correctly' );
    }));
    t.end();
  });
}

// check all shapefiles are extracted
// @note: this number can be confirmed with the following command:
// dbfcat test/fixtures/example.dbf | grep 'record' | wc -l
module.exports.stream.allrecords = function(test, common) {
  var expected = 350;
  test('extract all shapefiles', function(t) {
    t.plan( expected );
    var i = 0;
    new ShapeFileStream( fixtures.example.shp )
      .pipe( through.obj( function( chunk, enc, next ){
        t.equal( ++i <= expected, true, 'shapefile extracted' );
        next();
      }));
  });
}

// check parser stops reading when hwm reached
// this should only recieve 16 records (because that is the HWM of the through stream)
// it will stay stuck in this state of 16 records until the next stream in the pipe
// accepts some data (in this case never, since there is no next stream)
module.exports.stream.hwm = function(test, common) {
  test('pause on hwm', function(t) {
    var stream = new ShapeFileStream( fixtures.example.shp );

    var i = 0;
    var consumer = through.obj( function( chunk, enc, next ){
      t.equal( ++i <= this._readableState.highWaterMark, true, 'shapefile extracted' );
      this.push( chunk, enc );
      next();
    });

    t.plan( consumer._readableState.highWaterMark );
    stream.pipe( consumer );
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('stream: ' + name, testFunction)
  }

  for( var testCase in module.exports.stream ){
    module.exports.stream[testCase](test, common);
  }
}