export interface OptionType {
    value: string | number;
    label: string;
}

export interface FieldConfig {
    index: number;
    options: OptionType[];
    multiple?: boolean;
    placeholder?: string;
    label?: string;
    fetchOptions?: (parentValue: any) => Promise<OptionType[]> | OptionType[];
    disabled?: boolean;
    errorMessage?: string;
    // Custom styling options
    customStyle?: React.CSSProperties;
    className?: string;
    selectStyle?: React.CSSProperties;
    selectClassName?: string;
}

export interface HierarchicalSelectProps {
    fields: FieldConfig[];
    designSystem?: 'antd' | 'shadcn';
    onChange?: (values: (string | number | (string | number)[] | undefined)[]) => void;
    onError?: (error: Error) => void;
    className?: string;
    disabled?: boolean;
}

export interface SelectFieldProps {
    field: FieldConfig;
    value: any;
    onChange: (value: any) => void;
    isLoading?: boolean;
    disabled?: boolean;
    designSystem: 'antd' | 'shadcn';
    error?: string;
}