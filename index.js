var nodejs = (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
// https://github.com/queicherius/refined-text-search/blob/master/src/index.js
// oboe.js streaming json

function humansearch(opts){

	this.opts = opts
	this.pattern = {
		a: /(-)?("[^"]*"|[^\s]+)/g
	}

	this.mapProperty = function(q, t){
		var parts = t.split(":")
		var obj   = {}
		obj[parts[0]] = { "$regex":parts[1], "$options":"i" }
		q.push(obj)
	}

	this.toMongo = function(tokens, properties){
		var q = {"$and":[]}
		var $and = q["$and"]
		var me = this
		var $or = []
		tokens.map( function(t){
			if( !t.match(' ') && t.match(':') ) return me.mapProperty($and, t)
			properties.map( function(p){
				t = t.replace(/["']/g, '')
					 .trim()
				var o = {}
				o[p] = t[0] == '-' ? {"$not":{"$regex":t.substr(1), "$options":"i"}}
								   : {"$regex":t, "$options":"i"}
				$or.push(o)		
			})
		})
		$and.push({"$or":$or})
		return q["$and"].length == 0 && Object.keys(q).length == 1 ? {} : q
	}

	this.parse = function(str, properties){
		if( !str ) return
		var str = str.trim()
		var p = this.pattern
		if( str[0] == '/' && str[ str.length-1 ] == '/' ) return this.regex = str 
		var tokens = str.match( p.a ) || []
		return this.toMongo(tokens, properties)
	}

	return this
}

if ( nodejs ) module.exports = humansearch;
else window.humansearch = humansearch

