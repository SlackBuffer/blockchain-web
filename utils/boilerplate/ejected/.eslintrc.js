module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: "babel-eslint", // fix Parsing error: Unexpected token =
  parserOptions: {
    sourceType: "module"
    // "ecmaFeatures": {
    //     "jsx": true
    // }
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended", // node_modules/eslint-plugin-react/index.js line 104
    "plugin:prettier/recommended",
    "prettier/react"
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        semi: false
      }
    ]
  }
};

/* module.exports = {
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
}; */
