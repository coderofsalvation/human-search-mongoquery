var humansearch = require('./')

// create timing utility
var capture = function(){
	this.start = new Date().getTime()
	this.report = () => console.log("speed: "+((new Date().getTime()-this.start ) / 1000)+" secs")
	return this	
}

var c = new capture()
var h = new humansearch({})
var s = '"foo flop" flap -bar'
console.log("\nq.parse('"+s+"', ['key', 'author'])")
var q = h.parse(s, ['key', 'author'])
console.log( JSON.stringify(q, null, 2))
//if( Object.keys(q).length != 0 ) throw 'should have no result'
c.report()

var c = new capture()
var h = new humansearch({})
var s = 'author:john flap -bar'
console.log("\nq.parse('"+s+"', ['key', 'author'])")
var q = h.parse(s, ['key', 'author'])
console.log( JSON.stringify(q, null, 2))
//if( Object.keys(q).length == 0 ) throw 'should have no result'
c.report()

var c = new capture()
var h = new humansearch({})
var s = 'author:john site:github.com foo'
console.log("\nq.parse('"+s+"', ['key', 'author'])")
var q = h.parse(s, ['key', 'author'])
console.log( JSON.stringify(q, null, 2))
//if( Object.keys(q).length == 0 ) throw 'should have no result'
c.report()

var c = new capture()
var h = new humansearch({})
var s = '/(foo|bar)/'
console.log("\nq.parse('"+s+"', ['key', 'author'])")
var q = h.parse(s, ['key', 'author'])
console.log( JSON.stringify(q, null, 2))
//if( Object.keys(q).length == 0 ) throw 'should have no result'
c.report()
