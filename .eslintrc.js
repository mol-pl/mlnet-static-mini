module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		//"es6": true,
		"es6": false,
	},
	"globals": {
		'Ext': true,
		'Molnet': true,
	},
	"extends": "eslint:recommended",
	"ignorePatterns": [
		"**/js-min/*.js"
	],
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1,
				"ignoredNodes": [ "SwitchCase" ],
				'ignoreComments': true,
			}
		],
		"no-unused-vars": ["error", { "args": "none" }],
		"no-redeclare": "off",
		/*
		"linebreak-style": [
		    "error",
		    "windows"
		],
		*/
		/*
		"quotes": [
		    "error",
		    "single"
		],
		*/
		/*
		"semi": [
			"error",
			"always"
		]
		*/
	}
};