## Installation

```bash
$ npm install shapefile-stream
```

[![NPM](https://nodei.co/npm/shapefile-stream.png?downloads=true&stars=true)](https://nodei.co/npm/shapefile-stream)

Note: you will need `node` and `npm` installed first.

The easiest way to install `node.js` is with [nave.sh](https://github.com/isaacs/nave) by executing `[sudo] ./nave.sh usemain stable`

## Usage

You can extract the shapefile data from a file stream:

```javascript
var shapefile = require('shapefile-stream');

// both the .shp and the .dbf files are required 
shapefile.createReadStream( 'example.shp' )
  .pipe( shapefile.stringify )
  .pipe( process.stdout );
```

## Roll your own

The easiest way to get started writing your own pipes is to use `through2`; just make sure you call `next()`.

```javascript
var shapefile = require('shapefile-stream'),
    through = require('through2');

shapefile.createReadStream( 'example.shp' )
  .pipe( through.obj( function( data, enc, next ){
    console.log(
      data.type,
      data.properties.qs_adm0,
      data.properties.qs_a1,
      data.geometry.type,
      data.geometry.coordinates[0].length
    );
    next();
  }));
```

```bash
Feature France MARNE Polygon 184
Feature France MEURTHE-ET-MOSELLE MultiPolygon 1
Feature France NIEVRE Polygon 162
Feature France NORD Polygon 167
```

## Schema

Each shapefile is different, but the example file outputs objects which look like this:

```javascript
{
  "type": "Feature",
  "properties": {
    "qs_adm0_a3": "FRA",
    "qs_adm0": "France",
    "qs_level": "adm2_region",
    "qs_iso_cc": "FR",
    "qs_a0": "France",
    "qs_a0_lc": null,
    "qs_a1r": "ALSACE",
    "qs_a1r_alt": null,
    "qs_a1r_lc": "42",
    "qs_a1": "BAS-RHIN",
    "qs_a1_alt": null,
    "qs_a1_lc": "67",
    "qs_a2r": "STRASBOURG",
    "qs_a2r_alt": null,
    "qs_a2r_lc": "6",
    "qs_type": "Arrondissement",
    "qs_source": "France IGN",
    "qs_pop": null,
    "qs_id": null,
    "qs_gn_id": null,
    "qs_woe_id": null,
    "qs_scale": null
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [<<truncated>>]
  }
}
```

## NPM Module

The `shapefile-stream` npm module can be found here:

[https://npmjs.org/package/shapefile-stream](https://npmjs.org/package/shapefile-stream)

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

Travis tests every release against node version `0.10`

[![Build Status](https://travis-ci.org/geopipes/shapefile-stream.png?branch=master)](https://travis-ci.org/geopipes/shapefile-stream)