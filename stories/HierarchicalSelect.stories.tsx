import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import HierarchicalSelect from '../src';
import { FieldConfig } from '../src/types';

const meta: Meta<typeof HierarchicalSelect> = {
    title: 'Components/HierarchicalSelect',
    component: HierarchicalSelect,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HierarchicalSelect>;

// Basic fields for the Ant Design story
const antdFields: FieldConfig[] = [
    {
        index: 0,
        options: [
            { value: 'bd', label: 'Bangladesh' },
            { value: 'in', label: 'India' },
            { value: 'us', label: 'United States' },
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

            const regions: Record<string, { value: string; label: string }[]> = {
                bd: [
                    { value: 'dhk', label: 'Dhaka' },
                    { value: 'ctg', label: 'Chittagong' },
                ],
                in: [
                    { value: 'dl', label: 'Delhi' },
                    { value: 'mb', label: 'Mumbai' },
                ],
                us: [
                    { value: 'ca', label: 'California' },
                    { value: 'ny', label: 'New York' },
                    { value: 'tx', label: 'Texas' },
                ],
            };

            return regions[parentValue as string] || [];
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

            const cities: Record<string, { value: string; label: string }[]> = {
                dhk: [
                    { value: 'mirpur', label: 'Mirpur' },
                    { value: 'gulshan', label: 'Gulshan' },
                ],
                ctg: [
                    { value: 'agrabad', label: 'Agrabad' },
                    { value: 'pahartali', label: 'Pahartali' },
                ],
                dl: [
                    { value: 'newdelhi', label: 'New Delhi' },
                    { value: 'olddelhi', label: 'Old Delhi' },
                ],
                mb: [
                    { value: 'andheri', label: 'Andheri' },
                    { value: 'bandra', label: 'Bandra' },
                ],
                ca: [
                    { value: 'sf', label: 'San Francisco' },
                    { value: 'la', label: 'Los Angeles' },
                ],
                ny: [
                    { value: 'manhattan', label: 'Manhattan' },
                    { value: 'brooklyn', label: 'Brooklyn' },
                    { value: 'queens', label: 'Queens' },
                ],
                tx: [
                    { value: 'houston', label: 'Houston' },
                    { value: 'austin', label: 'Austin' },
                    { value: 'dallas', label: 'Dallas' },
                ],
            };

            return cities[parentValue as string] || [];
        },
    },
];

// The same fields for Shadcn UI story
const shadcnFields = [...antdFields];

export const WithAntDesign: Story = {
    args: {
        fields: antdFields,
        designSystem: 'antd',
        onChange: (values) => console.log('Selected values:', values),
        onError: (error) => console.error('Error:', error),
    },
};

export const WithShadcnUI: Story = {
    args: {
        fields: shadcnFields,
        designSystem: 'shadcn',
        onChange: (values) => console.log('Selected values:', values),
        onError: (error) => console.error('Error:', error),
    },
};

export const Disabled: Story = {
    args: {
        fields: antdFields,
        designSystem: 'antd',
        disabled: true,
        onChange: (values) => console.log('Selected values:', values),
        onError: (error) => console.error('Error:', error),
    },
};

export const WithError: Story = {
    args: {
        fields: [
            {
                ...antdFields[0],
                errorMessage: 'Please select a valid country',
            },
            ...antdFields.slice(1),
        ],
        designSystem: 'antd',
        onChange: (values) => console.log('Selected values:', values),
        onError: (error) => console.error('Error:', error),
    },
};