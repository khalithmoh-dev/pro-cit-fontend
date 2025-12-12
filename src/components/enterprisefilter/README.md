# EnterpriseFilter Component

A dynamic filtering component that automatically generates filter fields based on enterprise data (institutes, degrees, programs, departments, semesters) using the `useGetEnterprises` hook.

## Features

- ✅ **Automatic data fetching** from `useGetEnterprises` hook
- ✅ **Dynamic field generation** based on configuration
- ✅ **Cascading filters** - dependent fields automatically update
- ✅ **Type-safe** implementation with TypeScript
- ✅ **Pre-filled institute** for logged-in users
- ✅ **Formik integration** for form handling
- ✅ **Validation support** with Yup

## Fixed Issues

### What was fixed:
1. ✅ Added proper TypeScript interfaces for type safety
2. ✅ Fixed button onClick to pass form values directly (instead of formik instance)
3. ✅ Added automatic institute pre-selection from logged-in user
4. ✅ Fixed field dependency cascade (parent-child relationships)
5. ✅ Improved options fetching with proper filter passing
6. ✅ Added `enableReinitialize` to Formik config
7. ✅ Disabled institute field when user has a fixed institute
8. ✅ Removed unused imports (React, FormControl, MenuItem, Select)

## Usage

### Basic Example

```tsx
import EnterpriseFilter from '../../components/enterprisefilter';

const MyComponent = () => {
  const handleFilterSubmit = (values: any) => {
    console.log('Filter values:', values);
    // values = { insId: "123", degId: "456", ... }
  };

  const handleReset = (values: any) => {
    console.log('Resetting with:', values);
    // Reset your data here
  };

  return (
    <EnterpriseFilter
      onSubmit={handleFilterSubmit}
      autoFieldSchema={{
        institutes: {
          label: 'Institution',
          type: 'select',
          required: true,
        },
        degree: {
          label: 'Degree',
          type: 'select',
          required: false,
        },
        program: {
          label: 'Program',
          type: 'select',
          required: false,
        },
      }}
      schema={{
        buttons: [
          {
            name: 'Reset',
            nature: 'reset',
            onClick: handleReset,
          },
          {
            name: 'Search',
            type: 'submit',
            nature: 'primary',
          },
        ],
      }}
    />
  );
};
```

### Complete Example (All Fields)

```tsx
const CompleteExample = () => {
  const handleSearch = (values: any) => {
    // Values will contain selected IDs:
    // {
    //   insId: "institute_id",
    //   degId: "degree_id",
    //   prgId: "program_id",
    //   deptId: "department_id",
    //   semId: "semester_id"
    // }
    console.log('Search with filters:', values);
  };

  return (
    <EnterpriseFilter
      onSubmit={handleSearch}
      autoFieldSchema={{
        institutes: {
          label: 'Institution',
          type: 'select',
          required: true,
        },
        degree: {
          label: 'Degree',
          type: 'select',
          required: true,
        },
        program: {
          label: 'Program',
          type: 'select',
          required: true,
        },
        department: {
          label: 'Department',
          type: 'select',
          required: false,
        },
        semester: {
          label: 'Semester',
          type: 'select',
          required: false,
        },
      }}
      schema={{
        buttons: [
          {
            name: 'Clear',
            nature: 'reset',
            onClick: (values) => {
              console.log('Clearing filters');
              // Handle reset logic
            },
          },
          {
            name: 'Apply Filters',
            type: 'submit',
            nature: 'primary',
          },
        ],
      }}
    />
  );
};
```

## Props

### `autoFieldSchema`
Object defining which fields to display and their configuration.

**Available field keys:**
- `institutes` - Maps to `insId` (no parent dependency)
- `degree` - Maps to `degId` (depends on `insId`)
- `program` - Maps to `prgId` (depends on `insId`, `degId`)
- `department` - Maps to `deptId` (depends on `insId`)
- `semester` - Maps to `semId` (depends on `insId`, `degId`, `prgId`)

**Field configuration:**
```tsx
{
  label: string;        // Display label
  type?: 'select' | 'text' | 'Textarea';  // Default: 'select'
  required?: boolean;   // Default: false
}
```

### `schema`
Configuration for action buttons.

```tsx
{
  buttons?: Array<{
    name: string;           // Button text
    type?: 'submit' | 'button' | 'reset';
    nature?: 'primary' | 'reset' | 'cancel';
    onClick?: (values: any) => void;  // Receives current form values
  }>;
}
```

### `onSubmit`
Callback function called when form is submitted (via submit button).

```tsx
onSubmit?: (values: any, formikHelpers: FormikHelpers<any>) => void;
```

### `isAutoGen`
Boolean to enable/disable auto field generation. Default: `true`

## Field Dependencies

The component automatically handles cascading filters:

```
institutes (insId)
  ├── degree (degId)
  │     ├── program (prgId)
  │     │     └── semester (semId)
  │     └── semester (semId)
  └── department (deptId)
```

**Behavior:**
- When you change `insId`, it resets `degId`, `deptId`, `prgId`, and `semId`
- When you change `degId`, it resets `prgId` and `semId`
- When you change `deptId`, it resets dependent fields

## Data Flow

```
useGetEnterprises Hook (from authStore.oEnterprises)
  ↓
  ├── getInstitutesList() → institutes dropdown
  ├── getDegreesList(filters) → degree dropdown
  ├── getProgramsList(filters) → program dropdown
  ├── getDepartmentsList(filters) → department dropdown
  └── getSemestersList(filters) → semester dropdown
```

## Button Types

### Submit Button
```tsx
{
  name: 'Search',
  type: 'submit',  // Triggers onSubmit
  nature: 'primary',
}
```

### Reset Button
```tsx
{
  name: 'Reset',
  type: 'reset',  // or use nature: 'reset'
  nature: 'reset',
  onClick: (values) => {
    // Optional: Custom logic after reset
    // The component automatically clears all fields except institute
    console.log('Reset triggered');
  },
}
```

**Reset Behavior:**
- Automatically clears all fields EXCEPT the institute field
- Institute field is preserved with the user's default `instituteId`
- Clears validation errors
- The `onClick` handler is called AFTER the reset (optional)

### Custom Button
```tsx
{
  name: 'Apply',
  type: 'button',  // or omit
  nature: 'primary',
  onClick: (values) => {
    // Custom logic with current form values
    console.log(values);
  },
}
```

## Important Notes

1. **Institute Pre-selection**: If the logged-in user has an `instituteId`, it will be automatically pre-filled as the default value, but the user can still change it.

2. **Field Names**: The component uses database field names internally:
   - `institutes` → `insId`
   - `degree` → `degId`
   - `program` → `prgId`
   - `department` → `deptId`
   - `semester` → `semId`

3. **Validation**: Uses Yup schema. Required fields show validation errors on submit.

4. **Data Source**: All data comes from `authStore.oEnterprises`, loaded during login.

## Common Patterns

### Employee Filter (Institute + Department)
```tsx
const handleReset = () => {
  console.log('Filters reset - institute preserved');
  // Optional: trigger data refresh with reset filters
};

const handleSearch = (values: any) => {
  console.log('Search with:', values);
  // { insId: "123", deptId: "456" }
};

<EnterpriseFilter
  autoFieldSchema={{
    institutes: { label: 'Institution', required: true },
    department: { label: 'Department', required: false },
  }}
  schema={{
    buttons: [
      {
        name: 'Reset',
        type: 'reset',
        nature: 'reset',
        onClick: handleReset  // Optional
      },
      {
        name: 'Search',
        type: 'submit',
        nature: 'primary'
      },
    ],
  }}
  onSubmit={handleSearch}
/>
```

### Student Filter (Institute + Degree + Program + Semester)
```tsx
<EnterpriseFilter
  autoFieldSchema={{
    institutes: { label: 'Institution', required: true },
    degree: { label: 'Degree', required: true },
    program: { label: 'Program', required: true },
    semester: { label: 'Semester', required: false },
  }}
  schema={{
    buttons: [
      { name: 'Clear', nature: 'reset', onClick: handleClear },
      { name: 'Apply', type: 'submit', nature: 'primary' },
    ],
  }}
  onSubmit={handleApplyFilters}
/>
```

## Troubleshooting

### No options showing in dropdowns
- ✅ Check that `authStore.oEnterprises` is populated during login
- ✅ Verify the data structure matches expected format (see [authStore.ts:161](../../store/authStore.ts#L161))

### Dependent fields not clearing
- ✅ Ensure parent fields are defined correctly in `PARENT_MAP`
- ✅ Check that field names match the database field names (insId, degId, etc.)

### Button onClick not working
- ✅ Make sure you're not using `formik` parameter - use `values` instead
- ✅ The component now passes form values directly to onClick handlers
