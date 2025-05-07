# Hierarchical Select

<p align="center">
  <a href="https://iazadur.github.io/Hierarchical-Select/" target="_blank">
    <img src="https://raw.githubusercontent.com/iazadur/Hierarchical-Select/main/public/logo.svg" height="120" alt="Hierarchical Select Logo" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@iazadur/hierarchical-select" target="_blank">
    <img src="https://img.shields.io/npm/v/@iazadur/hierarchical-select.svg?style=flat-square" alt="npm version" />
  </a>
  <a href="https://github.com/iazadur/Hierarchical-Select/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/iazadur/Hierarchical-Select?style=flat-square" alt="license" />
  </a>
  <a href="https://github.com/iazadur/Hierarchical-Select" target="_blank">
    <img src="https://img.shields.io/github/stars/iazadur/Hierarchical-Select?style=flat-square" alt="GitHub stars" />
  </a>
  <a href="https://iazadur.github.io/Hierarchical-Select/" target="_blank">
    <img src="https://img.shields.io/badge/documentation-storybook-7026b9?style=flat-square" alt="documentation" />
  </a>
</p>

<p align="center">
  A production-ready React component for hierarchical (dependent) dropdowns, designed for both Ant Design and Shadcn UI.
</p>

## 📖 Live Documentation & Demos

Check out our **[interactive component documentation](https://iazadur.github.io/Hierarchical-Select/)** to see live examples and explore all features.

## ✨ Features

- **Hierarchical Dependency**: Support for up to 5 select fields with parent-child relationships
- **Single and Multiple Select**: Configure fields for single or multiple selection
- **Dynamic Loading**: Load options statically or fetch dynamically from APIs
- **Design System Integration**: Seamless integration with both Ant Design and Shadcn UI
- **Fully Customizable**: Customize labels, placeholders, error messages, and styling
- **TypeScript Support**: Fully typed with comprehensive type definitions
- **Accessibility**: WAI-ARIA compliant with keyboard navigation support
- **Performance Optimized**: Memoization, lazy loading, and response caching

## 🚀 Installation

```bash
npm install @iazadur/hierarchical-select

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

## 💻 Basic Usage

```jsx
import React from "react";
import HierarchicalSelect from "@iazadur/hierarchical-select";

const App = () => {
  const fields = [
    {
      index: 0,
      options: [
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" },
        { value: "uk", label: "United Kingdom" },
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
        // Simulated API call with static data
        await new Promise((resolve) => setTimeout(resolve, 500));

        const regions = {
          us: [
            { value: "ca", label: "California" },
            { value: "ny", label: "New York" },
          ],
          ca: [
            { value: "on", label: "Ontario" },
            { value: "qc", label: "Quebec" },
          ],
          uk: [
            { value: "eng", label: "England" },
            { value: "sct", label: "Scotland" },
          ],
        };

        return regions[parentValue] || [];
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
        await new Promise((resolve) => setTimeout(resolve, 500));

        const cities = {
          ca: [
            { value: "sf", label: "San Francisco" },
            { value: "la", label: "Los Angeles" },
          ],
          ny: [
            { value: "nyc", label: "New York City" },
            { value: "buf", label: "Buffalo" },
          ],
          // ... more cities
        };

        return cities[parentValue] || [];
      },
    },
  ];

  return (
    <HierarchicalSelect
      fields={fields}
      designSystem="shadcn" // or "antd"
      onChange={(values) => console.log("Selected:", values)}
      onError={(error) => console.error("Error:", error)}
    />
  );
};

export default App;
```

## 🎨 Custom Styling

The component supports custom styling to match your application design. You can add custom styles to each field:

```jsx
<HierarchicalSelect
  fields={[
    {
      index: 0,
      options: [...],
      // Custom styling
      className: 'my-custom-field',
      customStyle: {
        background: '#f8fafc',
        padding: '12px',
        borderRadius: '8px'
      },
      // Style just the select element
      selectClassName: 'my-custom-select',
      selectStyle: { borderWidth: '2px' }
    },
    // ...more fields
  ]}
  designSystem="shadcn"
/>
```

## 📝 API Reference

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

| Property        | Type                                                        | Default              | Description                              |
| --------------- | ----------------------------------------------------------- | -------------------- | ---------------------------------------- |
| index           | number                                                      | required             | The position of the field (0-based)      |
| options         | { value: string \| number; label: string }[]                | required             | Static options for the field             |
| multiple        | boolean                                                     | false                | Whether multiple selections are allowed  |
| placeholder     | string                                                      | 'Select an option'   | Placeholder text                         |
| label           | string                                                      | `Level ${index + 1}` | Label for the field                      |
| fetchOptions    | (parentValue: any) => Promise<OptionType[]> \| OptionType[] | -                    | Function to fetch dependent options      |
| disabled        | boolean                                                     | false                | Disables the specific field              |
| errorMessage    | string                                                      | -                    | Custom error message                     |
| className       | string                                                      | -                    | Custom CSS class for the field container |
| customStyle     | React.CSSProperties                                         | -                    | Custom styles for the field container    |
| selectClassName | string                                                      | -                    | Custom CSS class for the select element  |
| selectStyle     | React.CSSProperties                                         | -                    | Custom styles for the select element     |

## 👍 Design System Support

### Ant Design

The component integrates seamlessly with Ant Design, using the official `Select` component with proper styling and error states.

### Shadcn UI

For Shadcn UI, we've built a custom implementation based on Radix UI's primitives that follows Shadcn's design principles, with:

- Clean, minimal styling
- Proper focus and hover states
- Accessible keyboard navigation
- Elegant tags for multiple selection
- Error and loading states

## 🧩 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 🛠️ Troubleshooting

If you encounter any issues with the component, please check our [GitHub issues](https://github.com/iazadur/Hierarchical-Select/issues) or submit a new one.

## 📚 Documentation

For more examples and detailed documentation, visit our [Storybook site](https://iazadur.github.io/Hierarchical-Select/).

## 📄 License

MIT © [iazadur](https://github.com/iazadur)
