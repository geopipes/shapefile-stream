
var shapefile = require('../');

module.exports.interface = {};

module.exports.interface.createReadStream = function(test, common) {
  test('createReadStream()', function(t) {
    t.equal(typeof shapefile.createReadStream, 'function', 'valid function');
    t.equal(shapefile.createReadStream.length, 2, 'consistent arguments length');
    t.end();
  });
}

module.exports.interface.stringify = function(test, common) {
  test('stringify', function(t) {
    t.equal(typeof shapefile.stringify, 'object', 'valid function');
    t.equal(typeof shapefile.stringify._read, 'function', 'readable stream');
    t.equal(typeof shapefile.stringify._write, 'function', 'writable stream');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('external interface: ' + name, testFunction)
  }

  for( var testCase in module.exports.interface ){
    module.exports.interface[testCase](test, common);
  }
}