import { HierarchicalSelect } from './components/HierarchicalSelect';
import { clearCache } from './utils/dataHandler';

// Export types
export type {
    OptionType,
    FieldConfig,
    HierarchicalSelectProps,
    SelectFieldProps,
} from './types';

// Export component as default
export default HierarchicalSelect;

// Export utilities
export { clearCache }; 