Requirements for Hierarchical Select NPM Package
Objective
Create a production-ready npm package for a hierarchical select component that supports dependent dropdowns (single and multiple select) for front-end applications. The package must integrate seamlessly with Ant Design and Shadcn UI, be TypeScript-first, and provide a smart, user-friendly experience for hierarchical data selection (e.g., Country → Region → City). The package should be optimized for enterprise use cases, such as solutions for clients like Unilever or Pran, ensuring scalability, accessibility, and maintainability.
Functional Requirements
1. Core Features

Hierarchical Dependency:
Support up to 5 select fields, where each field’s options depend on the previous field’s selection.
Only the first field is enabled initially. The second field enables after the first is selected, and so on.
If a parent field’s value changes, reset and disable all subsequent fields.


Single and Multiple Select:
Each field can be configured for single or multiple selections.
Multiple select should allow users to pick multiple options (e.g., multiple cities in a region).


Dynamic Data Loading:
Support static options (provided as an array) and dynamic options (fetched via API or callback function).
Handle asynchronous data fetching with loading states.


Design System Integration:
Support Ant Design (antd) and Shadcn UI as selectable design systems.
Allow users to specify the design system via a prop (e.g., designSystem="antd" or designSystem="shadcn").


Customizable:
Allow customization of labels, placeholders, and error messages.
Support custom styling via CSS or Tailwind (for Shadcn).


Event Handling:
Emit an onChange event with the current values of all fields whenever a selection changes.
Provide an onError callback for API or validation errors.



2. Non-Functional Requirements

TypeScript Support:
Fully typed with TypeScript, including interfaces for props, options, and callbacks.
Export type definitions for developer convenience.


Accessibility:
Follow WAI-ARIA standards for dropdowns.
Ensure keyboard navigation and screen reader compatibility.


Performance:
Optimize for large datasets (e.g., thousands of options) with memoization and lazy loading.
Minimize re-renders using React’s useMemo and useCallback.


Error Handling:
Display user-friendly error messages for failed API calls or invalid selections.
Provide loading spinners during async data fetching.


Cross-Browser Compatibility:
Support modern browsers (Chrome, Firefox, Safari, Edge) and their latest two versions.


Documentation:
Include a comprehensive README with installation, usage examples, and API documentation.
Provide a Storybook or similar component playground for development and testing.



Technical Requirements
1. Package Structure
hierarchical-select/
├── src/
│   ├── components/
│   │   ├── HierarchicalSelect.tsx
│   │   ├── SelectField.tsx
│   ├── types/
│   │   ├── index.ts
│   ├── utils/
│   │   ├── dataHandler.ts
│   ├── index.ts
├── tests/
│   ├── HierarchicalSelect.test.tsx
├── stories/
│   ├── HierarchicalSelect.stories.tsx
├── package.json
├── tsconfig.json
├── rollup.config.js
├── README.md
├── LICENSE

2. Dependencies

Peer Dependencies:
react: "^18.0.0"
react-dom: "^18.0.0"
antd: "^5.0.0" (for Ant Design integration)
@radix-ui/react-select: "^2.0.0" (for Shadcn UI)


Dev Dependencies:
typescript: "^5.0.0"
@rollup/plugin-typescript: "^11.0.0"
@rollup/plugin-node-resolve: "^15.0.0"
@rollup/plugin-commonjs: "^25.0.0"
jest: "^29.0.0"
@testing-library/react: "^14.0.0"
@storybook/react: "^7.0.0"



3. Build and Publish

Use Rollup to bundle the package into CommonJS (cjs) and ES Module (esm) formats.
Generate TypeScript declaration files (.d.ts).
Include a package.json with:
main: "dist/index.js" (CommonJS)
module: "dist/index.esm.js" (ES Module)
types: "dist/index.d.ts"
scripts for building, testing, and publishing.


Publish to npm with a scoped name (e.g., @yourname/hierarchical-select).

4. Component API
Props for HierarchicalSelect
interface OptionType {
  value: string | number;
  label: string;
}

interface FieldConfig {
  index: number;
  options: OptionType[];
  multiple?: boolean;
  placeholder?: string;
  fetchOptions?: (parentValue: any) => Promise<OptionType[]> | OptionType[];
}

interface HierarchicalSelectProps {
  fields: FieldConfig[];
  designSystem?: 'antd' | 'shadcn';
  onChange?: (values: (string | number | (string | number)[])[]) => void;
  onError?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
}

Example Usage
import HierarchicalSelect from '@yourname/hierarchical-select';

const fields = [
  {
    index: 0,
    options: [
      { value: 'bd', label: 'Bangladesh' },
      { value: 'in', label: 'India' },
    ],
    placeholder: 'Select Country',
  },
  {
    index: 1,
    options: [],
    fetchOptions: async (parentValue) => {
      const response = await fetch(`/api/regions?parent=${parentValue}`);
      const data = await response.json();
      return data.map((item) => ({ value: item.id, label: item.name }));
    },
    multiple: true,
    placeholder: 'Select Region',
  },
];

const App = () => (
  <HierarchicalSelect
    fields={fields}
    designSystem="antd"
    onChange={(values) => console.log('Selected:', values)}
    onError={(error) => console.error('Error:', error)}
  />
);

5. Testing

Write unit tests using Jest and React Testing Library.
Test cases should cover:
Rendering of fields with correct disabled/enabled states.
Single and multiple select functionality.
Dynamic data loading and error handling.
Accessibility compliance (e.g., ARIA attributes).


Aim for at least 80% test coverage.

6. Documentation

README.md:
Installation instructions (npm install @yourname/hierarchical-select).
Usage examples for both Ant Design and Shadcn.
API reference for props and types.
Troubleshooting and FAQs.


Storybook:
Create stories to showcase different configurations (single/multiple select, static/dynamic data, Ant Design/Shadcn).



7. Additional Considerations

Error Handling:
Show a loading spinner during API calls.
Display error messages if API fails or no options are available.


Performance:
Cache API responses to avoid redundant calls.
Use debouncing for rapid selections.


Styling:
For Ant Design, use its native styling.
For Shadcn, use Tailwind CSS for consistency.


Licensing:
Use MIT license for open-source compatibility.



Deliverables

A fully functional npm package published to npm.
Source code in a GitHub repository with:
Complete package structure.
Unit tests and coverage report.
Storybook or similar for component demos.


Comprehensive README with installation, usage, and API details.
A production-ready build with CommonJS and ES Module outputs.

Success Criteria

The package works seamlessly with Ant Design and Shadcn UI.
Hierarchical selection behaves as expected (first field enables second, and so on).
The package is TypeScript-compatible and accessible.
Unit tests pass with at least 80% coverage.
Documentation is clear and sufficient for developers to adopt the package.

