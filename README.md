# Hierarchical Select

A production-ready React component for hierarchical (dependent) dropdowns, designed for both Ant Design and Shadcn UI.

## Features

- **Hierarchical Dependency**: Support for up to 5 select fields with parent-child relationships
- **Single and Multiple Select**: Configure fields for single or multiple selection
- **Dynamic Loading**: Load options statically or fetch dynamically from APIs
- **Design System Integration**: Seamless integration with both Ant Design and Shadcn UI
- **Fully Customizable**: Customize labels, placeholders, error messages, and styling
- **TypeScript Support**: Fully typed with comprehensive type definitions
- **Accessibility**: WAI-ARIA compliant with keyboard navigation support
- **Performance Optimized**: Memoization, lazy loading, and response caching

## Installation

```bash
npm install @hierarchical/select

# Peer dependencies
npm install react react-dom
```

### With Ant Design

```bash
npm install antd
```

### With Shadcn UI

```bash
npm install @radix-ui/react-select
```

## Basic Usage

```jsx
import React from "react";
import HierarchicalSelect from "@hierarchical/select";

const App = () => {
  const fields = [
    {
      index: 0,
      options: [
        { value: "bd", label: "Bangladesh" },
        { value: "in", label: "India" },
      ],
      placeholder: "Select Country",
      label: "Country",
    },
    {
      index: 1,
      options: [],
      placeholder: "Select Region",
      label: "Region",
      fetchOptions: async (parentValue) => {
        // Fetch regions based on selected country
        const response = await fetch(`/api/regions?country=${parentValue}`);
        const data = await response.json();
        return data.map((item) => ({ value: item.id, label: item.name }));
      },
    },
    {
      index: 2,
      options: [],
      placeholder: "Select City",
      label: "City",
      multiple: true, // Allow multiple selections
      fetchOptions: async (parentValue) => {
        // Fetch cities based on selected region
        const response = await fetch(`/api/cities?region=${parentValue}`);
        const data = await response.json();
        return data.map((item) => ({ value: item.id, label: item.name }));
      },
    },
  ];

  return (
    <HierarchicalSelect
      fields={fields}
      designSystem="antd" // or "shadcn"
      onChange={(values) => console.log("Selected:", values)}
      onError={(error) => console.error("Error:", error)}
    />
  );
};

export default App;
```

## Examples

### With Ant Design

```jsx
import HierarchicalSelect from "@hierarchical/select";

// Create fields configuration...

const AntDesignExample = () => (
  <HierarchicalSelect
    fields={fields}
    designSystem="antd"
    onChange={(values) => console.log("Selected:", values)}
  />
);
```

### With Shadcn UI

```jsx
import HierarchicalSelect from "@hierarchical/select";

// Create fields configuration...

const ShadcnExample = () => (
  <HierarchicalSelect
    fields={fields}
    designSystem="shadcn"
    onChange={(values) => console.log("Selected:", values)}
  />
);
```

### With Static Options

```jsx
import HierarchicalSelect from "@hierarchical/select";

const StaticExample = () => {
  const fields = [
    {
      index: 0,
      options: [
        { value: "electronics", label: "Electronics" },
        { value: "clothing", label: "Clothing" },
      ],
    },
    {
      index: 1,
      options: [],
      fetchOptions: (category) => {
        // Static mapping instead of API call
        const subcategories = {
          electronics: [
            { value: "phones", label: "Phones" },
            { value: "computers", label: "Computers" },
          ],
          clothing: [
            { value: "men", label: "Men" },
            { value: "women", label: "Women" },
          ],
        };
        return subcategories[category] || [];
      },
    },
  ];

  return <HierarchicalSelect fields={fields} />;
};
```

## API Reference

### HierarchicalSelect Props

| Property     | Type                                                            | Default  | Description                            |
| ------------ | --------------------------------------------------------------- | -------- | -------------------------------------- |
| fields       | FieldConfig[]                                                   | required | Array of field configurations          |
| designSystem | 'antd' \| 'shadcn'                                              | 'antd'   | The design system to use               |
| onChange     | (values: (string \| number \| (string \| number)[])[] ) => void | -        | Callback when any value changes        |
| onError      | (error: Error) => void                                          | -        | Callback for handling errors           |
| className    | string                                                          | ''       | Additional CSS class for the container |
| disabled     | boolean                                                         | false    | Disables all fields                    |

### FieldConfig Interface

| Property     | Type                                                        | Default              | Description                             |
| ------------ | ----------------------------------------------------------- | -------------------- | --------------------------------------- |
| index        | number                                                      | required             | The position of the field (0-based)     |
| options      | { value: string \| number; label: string }[]                | required             | Static options for the field            |
| multiple     | boolean                                                     | false                | Whether multiple selections are allowed |
| placeholder  | string                                                      | 'Select an option'   | Placeholder text                        |
| label        | string                                                      | `Level ${index + 1}` | Label for the field                     |
| fetchOptions | (parentValue: any) => Promise<OptionType[]> \| OptionType[] | -                    | Function to fetch dependent options     |
| disabled     | boolean                                                     | false                | Disables the specific field             |
| errorMessage | string                                                      | -                    | Custom error message                    |

## Utilities

The package provides some utility functions:

```jsx
import HierarchicalSelect, { clearCache } from "@hierarchical/select";

// Clear the cache for all fields
clearCache();

// Clear the cache for a specific key
clearCache("field_1_parent_country1");
```

## Performance Optimization

This component includes several performance optimizations:

- **Response Caching**: API responses are cached to avoid redundant calls
- **Debouncing**: Prevents rapid successive calls when selections change quickly
- **Memoization**: Uses React's useMemo and useCallback to prevent unnecessary re-renders

## Accessibility

The component follows WAI-ARIA standards:

- Proper ARIA attributes for selects
- Keyboard navigation support
- Focus management between dependent fields

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Troubleshooting

### Common Issues

#### Fields aren't enabling correctly

- Ensure your fields have the correct `index` values
- Check that parent fields have valid selections

#### API errors

- Verify your `fetchOptions` function handles errors properly
- Ensure the response format matches the expected OptionType[]

#### Styling issues

- For Ant Design, ensure you've imported Ant Design CSS
- For Shadcn, check your Tailwind configuration

## License

MIT
