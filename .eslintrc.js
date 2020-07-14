module.exports = {
  extends: [
		'eslint-config-airbnb',
		'plugin:@typescript-eslint/recommended'
	],

	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'@typescript-eslint/eslint-plugin',
		'react'
	],
  env: {
    // 这里填入你的项目用到的环境
    // 它们预定义了不同环境的全局变量，比如：
    //
    browser: true,
    node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 这里填入你的项目需要的全局变量
    // false 表示这个全局变量不允许被重新赋值，比如：
    //
    // myGlobal: false
  },
  rules: {
    // 这里填入你的项目需要的个性化配置
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "quotes": [2, "single"],
    "semi": [2, "never"],
    "complexity": ["error", 24],
    "@typescript-eslint/semi": [2, "never"],
    "max-len": [2, 200],
    "no-prototype-builtins": 0,
    "no-restricted-syntax": 0,
    "class-methods-use-this": 0,
    "react/jsx-props-no-spreading": 0,
    "react/destructuring-assignment": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "react/prop-types": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "no-shadow": 0,
    "func-names": 0,
    "no-param-reassign": 0,
    "@typescript-eslint/no-unused-vars": ['error'],
    "implicit-arrow-linebreak": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".ts", ".tsx"] }],
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "object-curly-newline": 0,
    "no-unused-expressions": 0,
    "react/jsx-one-expression-per-line": 0,
    "no-plusplus": 0,
    "space-before-function-paren": ["error", "always"],
    "padded-blocks": [2],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "import/extensions": ["error", "ignorePackages", {
      "js": "never",
      "jsx": "never",
      "ts": "never",
      "tsx": "never"
    }],
    "space-before-function-paren": 0,
  },
  "settings": {
    "react": {
      "version": "16.12.0"
    },
    'import/resolver': {
      node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src'],
      },
  },
  }
};