import { create } from '@storybook/theming/create';

export default create({
    base: 'light',

    // Brand
    brandTitle: 'Hierarchical Select',
    brandUrl: 'https://github.com/iazadur/hierarchical-select',
    brandImage: 'https://raw.githubusercontent.com/iazadur/hierarchical-select/main/logo.svg',
    brandTarget: '_self',

    // UI
    appBg: '#f8f9fa',
    appContentBg: '#ffffff',
    appBorderColor: '#e9ecef',
    appBorderRadius: 8,

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: '#333333',
    textInverseColor: '#ffffff',

    // Toolbar default and active colors
    barTextColor: '#5c6670',
    barSelectedColor: '#0066cc',
    barBg: '#ffffff',

    // Form colors
    inputBg: '#ffffff',
    inputBorder: '#ced4da',
    inputTextColor: '#333333',
    inputBorderRadius: 4,

    // Colors
    colorPrimary: '#0066cc',
    colorSecondary: '#4d90fe',
});