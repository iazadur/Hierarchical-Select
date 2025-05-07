import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SelectField } from '../src/components/SelectField';
import { FieldConfig } from '../src/types';

// Mock Ant Design components
jest.mock('antd', () => ({
    Select: ({
        mode,
        value,
        onChange,
        disabled,
        loading,
        options,
        placeholder,
        notFoundContent,
        status
    }) => {
        return (
            <div
                data-testid="mocked-antd-select"
                className={`ant-select ${disabled ? 'ant-select-disabled' : ''}`}
            >
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    data-mode={mode}
                    data-loading={loading ? 'true' : 'false'}
                    data-status={status}
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {loading && <span data-testid="loading-indicator">{notFoundContent}</span>}
            </div>
        );
    },
    Spin: () => <div data-testid="antd-spin">Loading...</div>
}));

// Mock Radix UI components
jest.mock('@radix-ui/react-select', () => ({
    Root: ({ children, value, onValueChange, disabled }) => (
        <div data-testid="radix-select-root" data-value={value} data-disabled={disabled}>
            {children}
            <button
                onClick={() => onValueChange && onValueChange('mocked-value')}
                data-testid="trigger-value-change"
            >
                Select Value
            </button>
        </div>
    ),
    Trigger: ({ children }) => <div data-testid="radix-select-trigger">{children}</div>,
    Value: ({ placeholder }) => <div data-testid="radix-select-value">{placeholder}</div>,
    Portal: ({ children }) => <div data-testid="radix-select-portal">{children}</div>,
    Content: ({ children }) => <div data-testid="radix-select-content">{children}</div>,
    Viewport: ({ children }) => <div data-testid="radix-select-viewport">{children}</div>,
    Item: ({ children, value }) => (
        <div data-testid="radix-select-item" data-value={value}>
            {children}
        </div>
    ),
    ItemText: ({ children }) => <div data-testid="radix-select-item-text">{children}</div>
}));

describe('SelectField', () => {
    const mockField: FieldConfig = {
        index: 0,
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
        ],
        placeholder: 'Select something',
        label: 'Test Field'
    };

    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Ant Design Rendering', () => {
        it('renders Ant Design select correctly', () => {
            render(
                <SelectField
                    field={mockField}
                    value=""
                    onChange={mockOnChange}
                    designSystem="antd"
                />
            );

            expect(screen.getByTestId('select-field-0')).toBeInTheDocument();
            expect(screen.getByText('Test Field')).toBeInTheDocument();
            expect(screen.getByTestId('mocked-antd-select')).toBeInTheDocument();
        });

        it('renders with loading state', () => {
            render(
                <SelectField
                    field={mockField}
                    value=""
                    onChange={mockOnChange}
                    designSystem="antd"
                    isLoading={true}
                />
            );

            expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
        });

        it('renders with error message', () => {
            render(
                <SelectField
                    field={mockField}
                    value=""
                    onChange={mockOnChange}
                    designSystem="antd"
                    error="This is an error"
                />
            );

            expect(screen.getByText('This is an error')).toBeInTheDocument();
        });

        it('renders with field error message', () => {
            const fieldWithError = {
                ...mockField,
                errorMessage: 'Field error'
            };

            render(
                <SelectField
                    field={fieldWithError}
                    value=""
                    onChange={mockOnChange}
                    designSystem="antd"
                />
            );

            expect(screen.getByText('Field error')).toBeInTheDocument();
        });

        it('handles disabled state', () => {
            render(
                <SelectField
                    field={mockField}
                    value=""
                    onChange={mockOnChange}
                    designSystem="antd"
                    disabled={true}
                />
            );

            expect(screen.getByTestId('mocked-antd-select')).toHaveClass('ant-select-disabled');
        });

        it('uses default label and placeholder when not provided', () => {
            const minimalField = {
                index: 2,
                options: [{ value: 'test', label: 'Test' }]
            };

            render(
                <SelectField
                    field={minimalField}
                    value=""
                    onChange={mockOnChange}
                    designSystem="antd"
                />
            );

            expect(screen.getByText('Level 3')).toBeInTheDocument(); // Level 2+1
        });
    });

    describe('Shadcn UI Rendering', () => {
        it('renders Shadcn single select correctly', () => {
            render(
                <SelectField
                    field={mockField}
                    value=""
                    onChange={mockOnChange}
                    designSystem="shadcn"
                />
            );

            expect(screen.getByTestId('select-field-0')).toBeInTheDocument();
            expect(screen.getByTestId('radix-select-root')).toBeInTheDocument();
        });

        it('renders Shadcn multiple select correctly', () => {
            const multipleField = {
                ...mockField,
                multiple: true
            };

            render(
                <SelectField
                    field={multipleField}
                    value={[]}
                    onChange={mockOnChange}
                    designSystem="shadcn"
                />
            );

            expect(screen.getByTestId('select-field-0')).toBeInTheDocument();
            expect(screen.getByText('Select something')).toBeInTheDocument(); // Placeholder
        });

        it('handles loading state in Shadcn', () => {
            render(
                <SelectField
                    field={mockField}
                    value=""
                    onChange={mockOnChange}
                    designSystem="shadcn"
                    isLoading={true}
                />
            );

            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('handles multiple select value selection', () => {
            const multipleField = {
                ...mockField,
                multiple: true
            };

            render(
                <SelectField
                    field={multipleField}
                    value={['option1']}
                    onChange={mockOnChange}
                    designSystem="shadcn"
                />
            );

            // Find and click the remove button for the selected value
            const removeButton = screen.getByText('×');
            fireEvent.click(removeButton);

            expect(mockOnChange).toHaveBeenCalledWith([]);
        });

        it('handles option selection in multiple select', () => {
            const multipleField = {
                ...mockField,
                multiple: true
            };

            render(
                <SelectField
                    field={multipleField}
                    value={[]}
                    onChange={mockOnChange}
                    designSystem="shadcn"
                />
            );

            // Find and click an option
            const options = screen.getAllByRole('checkbox');
            fireEvent.click(options[0]);

            expect(mockOnChange).toHaveBeenCalledWith(['option1']);
        });

        it('handles single select value changes', () => {
            render(
                <SelectField
                    field={mockField}
                    value=""
                    onChange={mockOnChange}
                    designSystem="shadcn"
                />
            );

            // Trigger a value change using our mock button
            fireEvent.click(screen.getByTestId('trigger-value-change'));

            expect(mockOnChange).toHaveBeenCalledWith('mocked-value');
        });
    });

    it('returns fallback for unknown design system', () => {
        render(
            <SelectField
                field={mockField}
                value=""
                onChange={mockOnChange}
                designSystem={'unknown' as any}
            />
        );

        expect(screen.getByText('Unsupported design system: unknown')).toBeInTheDocument();
    });
});