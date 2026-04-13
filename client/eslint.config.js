import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jest from 'eslint-plugin-jest';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: ['dist'],
    },
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
    {
        files: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
        plugins: {
            jest,
        },
        rules: {
            ...jest.configs.recommended.rules,
        },
    },
    prettier,
];
