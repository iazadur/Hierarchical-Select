import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HierarchicalSelect } from '../src/components/HierarchicalSelect';
import { FieldConfig } from '../src/types';

// Mock the fetchOptionsWithCache function
jest.mock('../src/utils/dataHandler', () => ({
    fetchOptionsWithCache: jest.fn(async (fetchFn, parentValue, cacheKey) => {
        return await fetchFn(parentValue);
    }),
    debounce: (fn: any) => fn,
    clearCache: jest.fn(),
}));

describe('HierarchicalSelect', () => {
    // Basic fields for testing
    const mockFields: FieldConfig[] = [
        {
            index: 0,
            options: [
                { value: 'country1', label: 'Country 1' },
                { value: 'country2', label: 'Country 2' },
            ],
            placeholder: 'Select Country',
        },
        {
            index: 1,
            options: [],
            placeholder: 'Select Region',
            fetchOptions: jest.fn((parentValue) => {
                if (parentValue === 'country1') {
                    return [
                        { value: 'region1', label: 'Region 1' },
                        { value: 'region2', label: 'Region 2' },
                    ];
                }
                return [];
            }),
        },
        {
            index: 2,
            options: [],
            placeholder: 'Select City',
            multiple: true,
            fetchOptions: jest.fn((parentValue) => {
                if (parentValue === 'region1') {
                    return [
                        { value: 'city1', label: 'City 1' },
                        { value: 'city2', label: 'City 2' },
                    ];
                }
                return [];
            }),
        },
    ];

    const mockOnChange = jest.fn();
    const mockOnError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with Ant Design by default', () => {
        render(
            <HierarchicalSelect
                fields={mockFields}
                onChange={mockOnChange}
                onError={mockOnError}
            />
        );

        expect(screen.getByTestId('hierarchical-select')).toBeInTheDocument();
        expect(screen.getByTestId('select-field-0')).toBeInTheDocument();
        expect(screen.getByTestId('select-field-1')).toBeInTheDocument();
        expect(screen.getByTestId('select-field-2')).toBeInTheDocument();
    });

    it('renders with Shadcn UI when specified', () => {
        render(
            <HierarchicalSelect
                fields={mockFields}
                designSystem="shadcn"
                onChange={mockOnChange}
                onError={mockOnError}
            />
        );

        expect(screen.getByTestId('hierarchical-select')).toBeInTheDocument();
        expect(screen.getByTestId('select-field-0')).toBeInTheDocument();
    });

    it('disables all dependent fields initially', () => {
        const { container } = render(
            <HierarchicalSelect
                fields={mockFields}
                onChange={mockOnChange}
                onError={mockOnError}
            />
        );

        // In Ant Design, disabled selects have the ant-select-disabled class
        const selects = container.querySelectorAll('.ant-select');

        // First select should be enabled
        expect(selects[0]).not.toHaveClass('ant-select-disabled');

        // Second and third selects should be disabled
        expect(selects[1]).toHaveClass('ant-select-disabled');
        expect(selects[2]).toHaveClass('ant-select-disabled');
    });

    it('enables second field when first field is selected', async () => {
        const { container } = render(
            <HierarchicalSelect
                fields={mockFields}
                onChange={mockOnChange}
                onError={mockOnError}
            />
        );

        // Find first select and simulate a selection
        const firstSelect = screen.getByTestId('select-field-0');
        fireEvent.mouseDown(firstSelect.querySelector('.ant-select-selector')!);

        // Wait for dropdown to appear and select an option
        await waitFor(() => {
            const option = document.querySelector('.ant-select-item-option');
            if (option) fireEvent.click(option);
        });

        // Check if onChange was called
        expect(mockOnChange).toHaveBeenCalled();

        // Second select should now be enabled
        await waitFor(() => {
            const selects = container.querySelectorAll('.ant-select');
            expect(selects[1]).not.toHaveClass('ant-select-disabled');
        });
    });

    it('resets dependent fields when parent field changes', async () => {
        render(
            <HierarchicalSelect
                fields={mockFields}
                onChange={mockOnChange}
                onError={mockOnError}
            />
        );

        // Select a country
        const firstSelect = screen.getByTestId('select-field-0');
        fireEvent.mouseDown(firstSelect.querySelector('.ant-select-selector')!);

        await waitFor(() => {
            const option = document.querySelectorAll('.ant-select-item-option')[0];
            if (option) fireEvent.click(option);
        });

        // Verify the first field was selected correctly
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalled();
            const call = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
            expect(call[0]).toBeTruthy(); // First value should be selected
        });

        // Reset mocks to make later assertions easier
        mockOnChange.mockClear();

        // Now change the first field selection to a different value
        fireEvent.mouseDown(firstSelect.querySelector('.ant-select-selector')!);

        await waitFor(() => {
            const options = document.querySelectorAll('.ant-select-item-option');
            if (options[1]) fireEvent.click(options[1]);
        });

        // Check if onChange was called with appropriate reset values for dependent fields
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalled();
            const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
            expect(lastCall[0]).toBeTruthy(); // First value should be selected
            expect(lastCall[1]).toBeUndefined(); // Second value should be reset
            expect(lastCall[2]).toEqual([]); // Third value should be an empty array (multiple select)
        });
    });
});