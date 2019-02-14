module.exports = {
	"root": true,
	"extends": "standard",
    "globals": {
		"use": true,
		"dashboard": false

    },
    "parserOptions":{
		// Using ES6 instead of default ES5
		"parser": "babel-eslint",
    },
    "rules": {
		"no-tabs": ['error', {"allowIndentationTabs": true}],
		"camelcase": 0,
		"linebreak-style": "off",
        "indent": [
            "error",
			"tab",
			{SwitchCase: 1}
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};