import React from 'react';
import HierarchicalSelect from '../src';
import { FieldConfig } from '../src/types';

export default {
    title: 'Components/HierarchicalSelect',
    component: HierarchicalSelect,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

// Basic fields for the stories
const locationFields = [
    {
        index: 0,
        options: [
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
        ],
        placeholder: 'Select Country',
        label: 'Country',
    },
    {
        index: 1,
        options: [],
        placeholder: 'Select Region',
        label: 'Region',
        fetchOptions: async (parentValue) => {
            // Simulate API call with a delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            const regions = {
                us: [
                    { value: 'ca', label: 'California' },
                    { value: 'ny', label: 'New York' },
                    { value: 'tx', label: 'Texas' },
                ],
                ca: [
                    { value: 'on', label: 'Ontario' },
                    { value: 'qc', label: 'Quebec' },
                    { value: 'bc', label: 'British Columbia' },
                ],
                uk: [
                    { value: 'eng', label: 'England' },
                    { value: 'sct', label: 'Scotland' },
                    { value: 'wls', label: 'Wales' },
                ],
            };

            return regions[parentValue] || [];
        },
    },
    {
        index: 2,
        options: [],
        placeholder: 'Select City',
        label: 'City',
        multiple: true,
        fetchOptions: async (parentValue) => {
            // Simulate API call with a delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            const cities = {
                ca: [
                    { value: 'sf', label: 'San Francisco' },
                    { value: 'la', label: 'Los Angeles' },
                ],
                ny: [
                    { value: 'nyc', label: 'New York City' },
                    { value: 'buf', label: 'Buffalo' },
                ],
                tx: [
                    { value: 'hou', label: 'Houston' },
                    { value: 'aus', label: 'Austin' },
                ],
                on: [
                    { value: 'tor', label: 'Toronto' },
                    { value: 'ott', label: 'Ottawa' },
                ],
                qc: [
                    { value: 'mtl', label: 'Montreal' },
                    { value: 'que', label: 'Quebec City' },
                ],
                bc: [
                    { value: 'van', label: 'Vancouver' },
                    { value: 'vic', label: 'Victoria' },
                ],
                eng: [
                    { value: 'lon', label: 'London' },
                    { value: 'man', label: 'Manchester' },
                ],
                sct: [
                    { value: 'edi', label: 'Edinburgh' },
                    { value: 'gla', label: 'Glasgow' },
                ],
                wls: [
                    { value: 'cdf', label: 'Cardiff' },
                    { value: 'swn', label: 'Swansea' },
                ],
            };

            return cities[parentValue] || [];
        },
    },
];

// Template for creating stories
const Template = (args) => <HierarchicalSelect {...args} />;

// Ant Design example
export const AntDesignExample = Template.bind({});
AntDesignExample.args = {
    fields: locationFields,
    designSystem: 'antd',
    onChange: (values) => console.log('Selected values:', values),
    onError: (error) => console.error('Error:', error),
};
AntDesignExample.parameters = {
    docs: {
        description: {
            story: 'Basic example using Ant Design UI components with country, region, and city selection.',
        },
    },
};

// Shadcn UI example
export const ShadcnUIExample = Template.bind({});
ShadcnUIExample.args = {
    fields: locationFields,
    designSystem: 'shadcn',
    onChange: (values) => console.log('Selected values:', values),
    onError: (error) => console.error('Error:', error),
};
ShadcnUIExample.parameters = {
    docs: {
        description: {
            story: 'The same hierarchical select implemented with Shadcn UI (Radix UI) components.',
        },
    },
};

// Disabled state example
export const DisabledState = Template.bind({});
DisabledState.args = {
    fields: locationFields,
    designSystem: 'antd',
    disabled: true,
    onChange: (values) => console.log('Selected values:', values),
    onError: (error) => console.error('Error:', error),
};
DisabledState.parameters = {
    docs: {
        description: {
            story: 'Example showing the component in a fully disabled state.',
        },
    },
};

// Example with error state
export const WithErrorState = Template.bind({});
WithErrorState.args = {
    fields: [
        {
            ...locationFields[0],
            errorMessage: 'Please select a valid country',
        },
        ...locationFields.slice(1),
    ],
    designSystem: 'antd',
    onChange: (values) => console.log('Selected values:', values),
    onError: (error) => console.error('Error:', error),
};
WithErrorState.parameters = {
    docs: {
        description: {
            story: 'Example showing how errors are displayed in the component.',
        },
    },
};