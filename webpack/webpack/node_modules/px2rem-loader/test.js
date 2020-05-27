var expect = require('chai').expect
var loader = require('./lib/px2rem-loader')

describe('Loader', function () {

  it('should transform px value into rem', function () {
    var output = loader.call({}, 'body {width: 750px}')
    expect(output).is.a('string')
    expect(output).to.equal('body {\n  width: 10rem;\n}')
  })
})

describe('Transform Value Comment', function () {

  it('should support `no` transform value comment', function () {
    var output = loader.call({}, 'body {width: 750px; /*no*/}')
    expect(output).is.a('string')
    expect(output).to.equal('body {\n  width: 750px;\n}')
  })

  it('should support `px` transform value comment', function () {
    var output = loader.call({}, 'body {width: 750px; /*px*/}')
    expect(output).is.a('string')
    expect(output).to.equal('[data-dpr="1"] body {\n  width: 375px;\n}\n\n[data-dpr="2"] body {\n  width: 750px;\n}\n\n[data-dpr="3"] body {\n  width: 1125px;\n}')
  })
})

describe('Transform Media Query & Key Frames', function () {

  it('should support @media', function () {
    var output = loader.call({}, '@media only screen and (min-device-width: 360px) {body {width: 750px; height: 200px; /*px*/ border-width: 1px; /*no*/}}')
    expect(output).is.a('string')
    expect(output).to.equal('@media only screen and (min-device-width: 360px) {\n  body {\n    width: 10rem;\n    border-width: 1px;\n  }\n\n  [data-dpr="1"] body {\n    height: 100px;\n  }\n\n  [data-dpr="2"] body {\n    height: 200px;\n  }\n\n  [data-dpr="3"] body {\n    height: 300px;\n  }\n}')
  })

  it('should support @keyframes', function () {
    var output = loader.call({}, '@keyframes anim {0% {transform: none; height: 75px; border-width: 1px; /*no*/} 100% {transform: none; height: 150px; border-width: 2px; /*no*/}}')
    expect(output).is.a('string')
    expect(output).to.equal('@keyframes anim {\n  0% {\n    transform: none;\n    height: 1rem;\n    border-width: 1px;\n  }\n\n  100% {\n    transform: none;\n    height: 2rem;\n    border-width: 2px;\n  }\n}')
  })
})

describe('Loader Query', function () {

  it('should support `remUnit` query', function () {
    var output = loader.call({query: '?remUnit=64'}, 'body {width: 640px}')
    expect(output).is.a('string')
    expect(output).to.equal('body {\n  width: 10rem;\n}')
  })

  it('should support `remUnit` query', function () {
    var output = loader.call({query: '?remUnit=112.5'}, 'body {width: 640px}')
    expect(output).is.a('string')
    expect(output).to.equal('body {\n  width: 5.688889rem;\n}')
  })

  it('should support `remPrecision` query', function () {
    var output = loader.call({query: '?remPrecision=3'}, 'body {width: 1000px}')
    expect(output).is.a('string')
    expect(output).to.equal('body {\n  width: 13.333rem;\n}')
  })

  it('should support `remUnit` & `remPrecision` query', function () {
    var output = loader.call({query: '?remUnit=112.5&remPrecision=3'}, 'body {width: 640px}')
    expect(output).is.a('string')
    expect(output).to.equal('body {\n  width: 5.689rem;\n}')
  })
})
