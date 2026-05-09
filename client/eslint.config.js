import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        rules: {
            'prettier/prettier': [
                'error',
                {
                    trailingComma: 'es5',
                    tabWidth: 4,
                    semi: true,
                    singleQuote: true,
                    printWidth: 100,
                },
            ],
        },
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'server-only',
                            message: 'Este projeto nao utiliza o pacote Next.js `server-only`.',
                        },
                    ],
                },
            ],
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    eslintPluginPrettier
);
