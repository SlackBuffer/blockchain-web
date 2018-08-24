module.exports = {
    // "extends": "standard",
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "prettier"
    ],
    "extends": [
        "eslint:recommended", 
        "plugin:react/recommended"
    ],
    "rules": {
        'prettier/prettier': [
            'error',
            {
              singleQuote: true, 
              trailingComma: 'all'
            },
          ],
          eqeqeq: ['error', 'always']
    },
    "env": {
        "browser": true,    // fix 'setTimeout' is not defined
        "es6": true         // fix 'Promise' is not defined
    }
};