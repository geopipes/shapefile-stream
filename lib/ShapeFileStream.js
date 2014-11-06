
var util = require('util'),
    shapefile = require('shapefile'),
    Readable = require('readable-stream');

function ShapeFileStream( filename, shapeFileOptions ){
  Readable.call( this, { objectMode: true } );
  if( !shapeFileOptions ){ shapeFileOptions = { encoding: 'UTF-8' }; }
  this.reader = shapefile.reader( filename, shapeFileOptions );
  this.reader.readHeader( function( err, header ){
    if( err ){
      console.error( 'ShapeFileStream', err );
      return this.emit( 'error', err );
    }
    this.ready = true;
  }.bind(this));
}

util.inherits( ShapeFileStream, Readable );

// Headers must be read before we can read from
// the rest of the file.
ShapeFileStream.prototype._onready = function( cb ){
  if( this.ready ){ return cb(); }
  setTimeout( this._onready.bind( this, cb ), 100 );
}

ShapeFileStream.prototype.next = function(){
  this.reader.readRecord( function( err, record ){
    if( err ){
      console.error( 'ShapeFileStream', err );
    }
    if( record === shapefile.end ){
      this.push( null ); // eof
    }
    else {
      // This error should never trigger
      if( this.eof ){
        console.log( 'ShapeFileStream got record after EOF' );
        console.log( record );
      }
      var pause = !!this.push( record );
      if( !pause ) this.next();
    }
  }.bind(this) );
}

ShapeFileStream.prototype._read = function(){
  this._onready( function(){
    this.next();
  }.bind(this) );
}

module.exports = ShapeFileStream;