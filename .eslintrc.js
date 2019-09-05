module.exports = {
	"parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "airbnb-typescript/base",
    "prettier/@typescript-eslint",
	  "plugin:prettier/recommended",
  ],
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module",
	},
	"env": { 
		"es6": true,
	},
	"rules": {
		"no-console": "off",
	},
	"globals": {
		"console": "readonly",
		"document": "readonly",
		"window": "readonly",
		"it": "readonly",
		"localStorage": "readonly",
	},
};