module.exports = {
    "extends": "eslint:recommended",
    "parserOptions":{
        // Using ES6 instead of default ES5
        "ecmaVersion": 6
    },
    "rules":{
        "indent": ["error",4],
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