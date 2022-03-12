generate mongo or object queries based on human natural language (Google / Search engine style).

## Usage

	var humansearch = require('human-search-mongoquery') // ignore this line in the browser 

	var q = new humansearch()                            // in the browser use 'new window.humansearch()'

> Now lets just parse some variables

    q.vars('foo:1 bar:flop -foo test:1.23')

#### output

    {
      "foo": 1, 
      "bar": "flop", 
      "-foo": "-foo", 
      "test": 1.23
    }


> Now lets say, the user types '"foo flop" flap -bar'	

	q.parse('"foo flop" flap -bar', ['key', 'author'])   // fuzzy search thru key+author properties

#### output

	{
	  "$and": [
		{
		  "$or": [
			{
			  "key": {
				"$regex": "foo flop",
				"$options": "i"
			  }
			},
			{
			  "author": {
				"$regex": "foo flop",
				"$options": "i"
			  }
			},
			{
			  "key": {
				"$regex": "flap",
				"$options": "i"
			  }
			},
			{
			  "author": {
				"$regex": "flap",
				"$options": "i"
			  }
			},
			{
			  "key": {
				"$not": {
				  "$regex": "bar",
				  "$options": "i"
				}
			  }
			},
			{
			  "author": {
				"$not": {
				  "$regex": "bar",
				  "$options": "i"
				}
			  }
			}
		  ]
		}
	  ]
	}

> Or, the user can match a specific 'author' (regex):

	q.parse('author:john flap -bar', ['key', 'author'])

#### output

	{
	  "$and": [
		{
		  "author": {
			"$regex": "john",
			"$options": "i"
		  }
		},
		{
		  "$or": [
			{
			  "key": {
				"$regex": "flap",
				"$options": "i"
			  }
			},
			{
			  "author": {
				"$regex": "flap",
				"$options": "i"
			  }
			},
			{
			  "key": {
				"$not": {
				  "$regex": "bar",
				  "$options": "i"
				}
			  }
			},
			{
			  "author": {
				"$not": {
				  "$regex": "bar",
				  "$options": "i"
				}
			  }
			}
		  ]
		}
	  ]
	}

> Example of combining and/or:

	q.parse('author:john site:github.com foo', ['key', 'author'])


#### output

	{
	  "$and": [
		{
		  "author": {
			"$regex": "john",
			"$options": "i"
		  }
		},
		{
		  "site": {
			"$regex": "github\\.com",
			"$options": "i"
		  }
		},
		{
		  "$or": [
			{
			  "key": {
				"$regex": "foo",
				"$options": "i"
			  }
			},
			{
			  "author": {
				"$regex": "foo",
				"$options": "i"
			  }
			}
		  ]
		}
	  ]
	}

> Or, let the user indulge into GEEKPLEASURE by supporting a regex search:

	q.parse('/(foo|bar)/', ['key', 'author'])

#### output

	{
	  "$or": [
		{
		  "key": {
			"$regex": "(foo|bar)",
			"$options": "i"
		  }
		},
		{
		  "author": {
			"$regex": "(foo|bar)",
			"$options": "i"
		  }
		}
	  ]
	}
