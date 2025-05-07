import React from 'react';
import { SelectFieldProps, OptionType } from '../types';
import { Select, Spin } from 'antd';
import * as RadixSelect from '@radix-ui/react-select';

/**
 * SelectField component that renders either an Ant Design or Shadcn UI select field
 */
export const SelectField: React.FC<SelectFieldProps> = ({
    field,
    value,
    onChange,
    isLoading = false,
    disabled = false,
    designSystem,
    error,
}) => {
    // Determine if this is a multiple select field
    const isMultiple = field.multiple || false;

    // Placeholder text
    const placeholder = field.placeholder || `Select an option`;

    // Field label
    const label = field.label || `Level ${field.index + 1}`;

    // Combined disabled state (component prop or field config)
    const isDisabled = disabled || field.disabled || false;

    // Get the error message
    const errorMessage = error || field.errorMessage;

    // Render Ant Design Select
    if (designSystem === 'antd') {
        return (
            <div className="antd-select-field" data-testid={`select-field-${field.index}`}>
                <div className="field-label">{label}</div>
                <Select
                    mode={isMultiple ? 'multiple' : undefined}
                    style={{ width: '100%' }}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={isDisabled}
                    loading={isLoading}
                    notFoundContent={isLoading ? <Spin size="small" /> : 'No options'}
                    options={field.options}
                    status={errorMessage ? 'error' : undefined}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        );
    }

    // Render Shadcn UI Select (using Radix UI)
    if (designSystem === 'shadcn') {
        return (
            <div
                className="shadcn-select-field"
                data-testid={`select-field-${field.index}`}
            >
                <div className="field-label">{label}</div>
                {isMultiple ? (
                    // Multiple select for Shadcn is a bit more complex
                    <div className={`shadcn-multi-select ${isDisabled ? 'disabled' : ''} ${errorMessage ? 'error' : ''}`}>
                        {isLoading ? (
                            <div className="loading">Loading...</div>
                        ) : (
                            <MultipleSelect
                                options={field.options}
                                value={Array.isArray(value) ? value : []}
                                onChange={onChange}
                                placeholder={placeholder}
                                disabled={isDisabled}
                            />
                        )}
                    </div>
                ) : (
                    // Single select using Radix UI
                    <div className={`shadcn-single-select ${isDisabled ? 'disabled' : ''} ${errorMessage ? 'error' : ''}`}>
                        {isLoading ? (
                            <div className="loading">Loading...</div>
                        ) : (
                            <SingleSelect
                                options={field.options}
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder}
                                disabled={isDisabled}
                            />
                        )}
                    </div>
                )}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        );
    }

    // Fallback for unknown design system
    return (
        <div>Unsupported design system: {designSystem}</div>
    );
};

// Single Select implementation for Shadcn using Radix UI
const SingleSelect: React.FC<{
    options: OptionType[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder: string;
    disabled: boolean;
}> = ({ options, value, onChange, placeholder, disabled }) => {
    return (
        <RadixSelect.Root
            value={value ? String(value) : undefined}
            onValueChange={(newValue) => onChange(newValue)}
            disabled={disabled}
        >
            <RadixSelect.Trigger className="select-trigger">
                <RadixSelect.Value placeholder={placeholder} />
            </RadixSelect.Trigger>
            <RadixSelect.Portal>
                <RadixSelect.Content className="select-content">
                    <RadixSelect.Viewport>
                        {options.map((option) => (
                            <RadixSelect.Item
                                key={option.value}
                                value={String(option.value)}
                                className="select-item"
                            >
                                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                            </RadixSelect.Item>
                        ))}
                        {options.length === 0 && (
                            <div className="select-no-options">No options available</div>
                        )}
                    </RadixSelect.Viewport>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
};

// Multiple Select implementation for Shadcn
// Note: This is a simplified implementation that would need to be enhanced
// with more complex UI if using in a real application
const MultipleSelect: React.FC<{
    options: OptionType[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    placeholder: string;
    disabled: boolean;
}> = ({ options, value, onChange, placeholder, disabled }) => {
    const handleToggleOption = (optionValue: string | number) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    return (
        <div className="multi-select-container">
            <div className="selected-options">
                {value.length === 0 ? (
                    <div className="placeholder">{placeholder}</div>
                ) : (
                    <div className="selected-tags">
                        {value.map((selectedValue) => {
                            const option = options.find((o) => o.value === selectedValue);
                            return (
                                <div key={selectedValue} className="selected-tag">
                                    {option?.label}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleOption(selectedValue)}
                                        disabled={disabled}
                                        className="remove-tag"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="options-dropdown">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`option ${value.includes(option.value) ? 'selected' : ''}`}
                        onClick={() => !disabled && handleToggleOption(option.value)}
                    >
                        <input
                            type="checkbox"
                            checked={value.includes(option.value)}
                            onChange={() => !disabled && handleToggleOption(option.value)}
                            disabled={disabled}
                        />
                        {option.label}
                    </div>
                ))}
                {options.length === 0 && (
                    <div className="no-options">No options available</div>
                )}
            </div>
        </div>
    );
}; 