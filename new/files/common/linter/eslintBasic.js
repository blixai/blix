module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "env": {
        "browser": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "settings": {
        "react": {
          "createClass": "createReactClass",
          "pragma": "React", 
          "version": "latest"
        },
      },
      "plugins": [
          "react"
      ],
      "rules": {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "indent": ["error", 2],
        "quotes": ["error", "single"]
      }
}