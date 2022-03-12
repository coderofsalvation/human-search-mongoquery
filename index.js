var nodejs = (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
// https://github.com/queicherius/refined-text-search/blob/master/src/index.js
// oboe.js streaming json

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function humansearch(opts){

	this.opts = opts
	this.pattern = {
		a: /(-)?("[^"]*"|[^\s]+)/g
	}

	this.mapProperty = function(q, t){
		var parts = t.split(":")
		var obj   = {}
		obj[parts[0]] = { "$regex": this.escapeRegexStr(parts[1]), "$options":"i" }
		q.push(obj)
	}

	this.mapRegex = function(str, props){
		var $or = []
		props.map( function(p){
			var obj = {}
			obj[p] = {"$regex":str.substr(1).substr(0,str.length-2), "$options":"i"}
			$or.push(obj)
		})
		return {"$or":$or}
	}

	this.escapeRegexStr = function escapeRegExp(string) {
	  	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	this.toMongo = function(tokens, props){
		var q = {"$and":[]}
		var $and = q["$and"]
		var me = this
		var $or = []
		tokens.map( function(t){
			if( !t.match(' ') && t.match(':') ) return me.mapProperty($and, t)
			props.map( function(p){
				t = t.replace(/["']/g, '')
					 .trim()
				var o = {}
				o[p] = t[0] == '-' ? {"$not":{"$regex": me.escapeRegexStr(t.substr(1)), "$options":"i"}}
								   : {"$regex": me.escapeRegexStr(t), "$options":"i"}
				$or.push(o)		
			})
		})
		$and.push({"$or":$or})
		return q["$and"].length == 0 && Object.keys(q).length == 1 ? {} : q
	}

	this.parse = function(str, props){
		if( !str ) return
		if( str[0] == '/' && str[str.length-1] == '/' ) return this.mapRegex(str, props)
		var str = str.trim()
		var tokens = str.match( this.pattern.a ) || []
		return this.toMongo(tokens, props)
	}

	this.vars = function(str, props){
		if( !str ) return
		if( str[0] == '/' && str[str.length-1] == '/' ) return this.mapRegex(str, props)
		var str = str.trim()
		var tokens = str.match( this.pattern.a ) || []
    var vars = {}
    tokens.map( (token) => {
      let k = token.replace(/:.*/g, '')
      let v = token.replace(/.*:/, '') || true
      vars[k] = isNumeric(v) ? v.match(/\./) ? parseFloat(v) : parseInt(v) : v
    })
		return vars
	}

	return this
}

if ( nodejs ) module.exports = humansearch;
else window.humansearch = humansearch

