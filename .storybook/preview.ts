import customTheme from './theme';
import './storybook.css';

export default {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
            expanded: true,
            sort: 'requiredFirst',
        },
        docs: {
            theme: customTheme,
        },
        layout: 'centered',
        backgrounds: {
            default: 'light',
            values: [
                {
                    name: 'light',
                    value: '#ffffff',
                },
                {
                    name: 'neutral',
                    value: '#f8f9fa',
                },
                {
                    name: 'dark',
                    value: '#333333',
                },
            ],
        },
        viewMode: 'docs',
    },
};