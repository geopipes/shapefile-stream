
var shapefile = require('../'),
    path = require('path'),
    filename = path.resolve( __dirname + '/../test/fixtures/example.shp' );

shapefile.createReadStream( filename )
  // .pipe( require('through2').obj( function( data, enc, next ){
  //   console.log(
  //     data.type,
  //     data.properties.qs_adm0,
  //     data.properties.qs_a1,
  //     data.geometry.type,
  //     data.geometry.coordinates[0].length
  //   );
  //   next();
  // }));
  .pipe( shapefile.stringify )
  .pipe( process.stdout );