module.exports = {
	"root": true,
	"extends": "standard",
    "globals": {
    // global overiding for Adonis
		"use": true,
		"dashboard": false

    },
    "parserOptions":{
		// Using ES6 instead of default ES5
		"parser": "babel-eslint",
    },
    // Overiding and adding general rules to ESLint Standard
    "rules": {
    "no-tabs": ['error', {"allowIndentationTabs": true}],
    // forcing camelcase for naming
    "camelcase": 0,
    // overiding linebreak style
    "linebreak-style": "off",
    // Tabs for indenting
    "indent": [
      "error",
      "tab",
      {SwitchCase: 1}
    ],
    // Forcing single quotes only
    "quotes": [
        "error",
        "single"
    ],
    // Forcing always using semicolons
    "semi": [
        "error",
        "always"
    ]
    }
};