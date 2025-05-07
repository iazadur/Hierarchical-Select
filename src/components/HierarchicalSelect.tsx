import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HierarchicalSelectProps, FieldConfig, OptionType } from '../types';
import { SelectField } from './SelectField';
import { fetchOptionsWithCache, debounce } from '../utils/dataHandler';

export const HierarchicalSelect: React.FC<HierarchicalSelectProps> = ({
    fields,
    designSystem = 'antd',
    onChange,
    onError,
    className = '',
    disabled = false,
}) => {
    // Validate and sort fields by index
    const sortedFields = useMemo(() => {
        return [...fields].sort((a, b) => a.index - b.index);
    }, [fields]);

    // State for values, loading states, and errors
    const [values, setValues] = useState<(string | number | (string | number)[] | undefined)[]>(
        Array(sortedFields.length).fill(undefined)
    );
    const [loading, setLoading] = useState<boolean[]>(Array(sortedFields.length).fill(false));
    const [errors, setErrors] = useState<(string | undefined)[]>(Array(sortedFields.length).fill(undefined));

    // Debounced onChange to prevent rapid successive calls
    const debouncedOnChange = useMemo(
        () => onChange && debounce(onChange, 300),
        [onChange]
    );

    /**
     * Handle change for a specific field
     */
    const handleFieldChange = useCallback(
        (fieldIndex: number, newValue: string | number | (string | number)[]) => {
            setValues((prevValues) => {
                const newValues = [...prevValues];
                newValues[fieldIndex] = newValue;

                // Clear values of dependent fields
                for (let i = fieldIndex + 1; i < newValues.length; i++) {
                    newValues[i] = sortedFields[i]?.multiple ? [] : undefined;
                }

                return newValues;
            });

            // Clear errors for this field
            setErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[fieldIndex] = undefined;
                return newErrors;
            });
        },
        [sortedFields]
    );

    /**
     * Load options for dependent fields when parent values change
     */
    useEffect(() => {
        const loadOptionsForDependentFields = async () => {
            for (let i = 1; i < sortedFields.length; i++) {
                const field = sortedFields[i];
                const prevFieldIndex = i - 1;

                // Get parent field value
                const parentValue = values[prevFieldIndex];

                // If parent value is empty or field doesn't have fetchOptions, skip
                if (
                    parentValue === undefined ||
                    (Array.isArray(parentValue) && parentValue.length === 0) ||
                    !field.fetchOptions
                ) {
                    continue;
                }

                try {
                    // Set loading state
                    setLoading((prev) => {
                        const newLoading = [...prev];
                        newLoading[i] = true;
                        return newLoading;
                    });

                    // Fetch options for this field based on parent value
                    const cacheKey = `field_${i}_parent_${JSON.stringify(parentValue)}`;
                    const options = await fetchOptionsWithCache(
                        field.fetchOptions,
                        parentValue,
                        cacheKey
                    );

                    // Update field's options
                    sortedFields[i] = {
                        ...field,
                        options,
                    };

                    // Clear error if options were loaded successfully
                    setErrors((prev) => {
                        const newErrors = [...prev];
                        newErrors[i] = undefined;
                        return newErrors;
                    });
                } catch (error) {
                    // Set error state
                    setErrors((prev) => {
                        const newErrors = [...prev];
                        newErrors[i] = 'Failed to load options';
                        return newErrors;
                    });

                    // Call the onError callback if provided
                    if (onError && error instanceof Error) {
                        onError(error);
                    }
                } finally {
                    // Clear loading state
                    setLoading((prev) => {
                        const newLoading = [...prev];
                        newLoading[i] = false;
                        return newLoading;
                    });
                }
            }
        };

        loadOptionsForDependentFields();
    }, [sortedFields, values, onError]);

    /**
     * Notify parent component when values change
     */
    useEffect(() => {
        if (onChange) {
            onChange(values);
        } else if (debouncedOnChange) {
            debouncedOnChange(values);
        }
    }, [values, onChange, debouncedOnChange]);

    /**
     * Check if a field should be disabled
     */
    const isFieldDisabled = useCallback(
        (fieldIndex: number): boolean => {
            if (disabled) return true;
            if (fieldIndex === 0) return false;

            const prevFieldValue = values[fieldIndex - 1];
            const isPrevEmpty =
                prevFieldValue === undefined ||
                (Array.isArray(prevFieldValue) && prevFieldValue.length === 0);

            return isPrevEmpty;
        },
        [disabled, values]
    );

    return (
        <div
            className={`hierarchical-select-container ${className}`}
            data-testid="hierarchical-select"
        >
            {sortedFields.map((field, index) => (
                <SelectField
                    key={`field-${index}`}
                    field={field}
                    value={values[index] || (field.multiple ? [] : undefined)}
                    onChange={(value) => handleFieldChange(index, value)}
                    isLoading={loading[index]}
                    disabled={isFieldDisabled(index)}
                    designSystem={designSystem}
                    error={errors[index]}
                />
            ))}
        </div>
    );
};