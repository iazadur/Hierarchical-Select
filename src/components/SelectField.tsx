import React from 'react';
import { SelectFieldProps, OptionType } from '../types';
import { Select, Spin } from 'antd';
import * as RadixSelect from '@radix-ui/react-select';
import '../styles/shadcn-select.css';

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

    // Custom styles and classNames
    const customStyle = field.customStyle || {};
    const customClassName = field.className || '';
    const selectStyle = field.selectStyle || {};
    const selectClassName = field.selectClassName || '';

    // Render Ant Design Select
    if (designSystem === 'antd') {
        return (
            <div
                className={`antd-select-field ${customClassName}`}
                data-testid={`select-field-${field.index}`}
                style={customStyle}
            >
                <div className="field-label">{label}</div>
                <Select
                    mode={isMultiple ? 'multiple' : undefined}
                    style={{ width: '100%', ...selectStyle }}
                    className={selectClassName}
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
                className={`shadcn-select-field ${customClassName}`}
                data-testid={`select-field-${field.index}`}
                style={customStyle}
            >
                <div className="field-label">{label}</div>
                {isMultiple ? (
                    // Enhanced Multiple select implementation
                    <div className={`shadcn-multi-select ${isDisabled ? 'disabled' : ''} ${errorMessage ? 'has-error' : ''} ${selectClassName}`} style={selectStyle}>
                        {isLoading ? (
                            <div className="shadcn-loading-state">
                                <div className="shadcn-loading-spinner"></div>
                                <span>Loading options...</span>
                            </div>
                        ) : (
                            <EnhancedMultipleSelect
                                options={field.options}
                                value={Array.isArray(value) ? value : []}
                                onChange={onChange}
                                placeholder={placeholder}
                                disabled={isDisabled}
                                hasError={!!errorMessage}
                            />
                        )}
                    </div>
                ) : (
                    // Enhanced Single select using improved Radix UI implementation
                    <div className={`shadcn-single-select ${isDisabled ? 'disabled' : ''} ${errorMessage ? 'has-error' : ''} ${selectClassName}`} style={selectStyle}>
                        {isLoading ? (
                            <div className="shadcn-loading-state">
                                <div className="shadcn-loading-spinner"></div>
                                <span>Loading options...</span>
                            </div>
                        ) : (
                            <EnhancedSingleSelect
                                options={field.options}
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder}
                                disabled={isDisabled}
                                hasError={!!errorMessage}
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

// Enhanced Single Select implementation for Shadcn using Radix UI
const EnhancedSingleSelect: React.FC<{
    options: OptionType[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder: string;
    disabled: boolean;
    hasError?: boolean;
}> = ({ options, value, onChange, placeholder, disabled, hasError }) => {
    return (
        <RadixSelect.Root
            value={value ? String(value) : undefined}
            onValueChange={(newValue) => onChange(newValue)}
            disabled={disabled}
        >
            <RadixSelect.Trigger className={`shadcn-select-trigger ${hasError ? 'has-error' : ''}`}>
                <RadixSelect.Value placeholder={placeholder} />
                <RadixSelect.Icon className="shadcn-select-icon">
                    <ChevronIcon />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content className="shadcn-select-content" position="popper" sideOffset={5}>
                    <RadixSelect.ScrollUpButton className="shadcn-select-scroll-button">
                        <ChevronIcon direction="up" />
                    </RadixSelect.ScrollUpButton>

                    <RadixSelect.Viewport className="shadcn-select-viewport">
                        {options.length === 0 ? (
                            <div className="shadcn-select-no-options">No options available</div>
                        ) : (
                            options.map((option) => (
                                <RadixSelect.Item
                                    key={option.value}
                                    value={String(option.value)}
                                    className="shadcn-select-item"
                                >
                                    <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                                    <RadixSelect.ItemIndicator className="shadcn-select-item-indicator">
                                        <CheckIcon />
                                    </RadixSelect.ItemIndicator>
                                </RadixSelect.Item>
                            ))
                        )}
                    </RadixSelect.Viewport>

                    <RadixSelect.ScrollDownButton className="shadcn-select-scroll-button">
                        <ChevronIcon direction="down" />
                    </RadixSelect.ScrollDownButton>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
};

// Enhanced Multiple Select implementation with better UX
const EnhancedMultipleSelect: React.FC<{
    options: OptionType[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    placeholder: string;
    disabled: boolean;
    hasError?: boolean;
}> = ({ options, value, onChange, placeholder, disabled, hasError }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleToggleOption = (optionValue: string | number) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = () => {
            setIsOpen(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={`shadcn-multiselect ${disabled ? 'disabled' : ''} ${hasError ? 'has-error' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div
                className={`shadcn-multiselect-control ${isOpen ? 'is-open' : ''}`}
                onClick={toggleDropdown}
            >
                {value.length === 0 ? (
                    <div className="shadcn-multiselect-placeholder">{placeholder}</div>
                ) : (
                    <div className="shadcn-multiselect-values">
                        {value.map((selectedValue) => {
                            const option = options.find((o) => o.value === selectedValue);
                            return (
                                <div key={selectedValue} className="shadcn-multiselect-tag">
                                    <span>{option?.label}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleOption(selectedValue);
                                        }}
                                        disabled={disabled}
                                        className="shadcn-multiselect-tag-remove"
                                        aria-label={`Remove ${option?.label}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="shadcn-multiselect-indicators">
                    <ChevronIcon direction={isOpen ? "up" : "down"} />
                </div>
            </div>

            {isOpen && (
                <div className="shadcn-multiselect-menu">
                    {options.length === 0 ? (
                        <div className="shadcn-multiselect-no-options">
                            No options available
                        </div>
                    ) : (
                        options.map((option) => (
                            <div
                                key={option.value}
                                className={`shadcn-multiselect-option ${value.includes(option.value) ? 'is-selected' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleOption(option.value);
                                }}
                            >
                                <div className="shadcn-multiselect-option-indicator">
                                    {value.includes(option.value) && <CheckIcon />}
                                </div>
                                <div className="shadcn-multiselect-option-label">
                                    {option.label}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Simple icon components to avoid additional dependencies
const ChevronIcon: React.FC<{ direction?: 'up' | 'down' }> = ({ direction = 'down' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
            transform: direction === 'up' ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
        }}
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);