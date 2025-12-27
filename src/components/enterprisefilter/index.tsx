import { useMemo, useCallback, useRef, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import SectionHeader from "../SectionHeader";
import Label from "../Label";
import Button from "../ButtonMui";
import { Textarea } from "@mui/joy";
import useGetEnterprises from "../../hooks/useGetEnterprises";
import { useTranslation } from "react-i18next";
import InputFields from "../inputFields";
import useAuthStore from "../../store/authStore";

// Type definitions for better type safety
interface FieldConfig {
  label: string;
  type?: "select" | "text" | "Textarea";
  required?: boolean;
}

interface AutoFieldSchema {
  [key: string]: FieldConfig;
}

interface ButtonConfig {
  name: string;
  type?: "submit" | "button" | "reset";
  nature?: "primary" | "reset" | "cancel";
  onClick?: (values: any) => void;
}

interface Schema {
  buttons?: ButtonConfig[];
}

interface EnterpriseFilterProps {
  onSubmit?: (values: any, formikHelpers: FormikHelpers<any>) => void;
  autoFieldSchema?: AutoFieldSchema;
  schema?: Schema;
  isAutoGen?: boolean;
}

interface Option {
  label: string;
  value: string;
}

interface Field {
  name: string;
  fieldKey: string;
  parent: string | string[] | null;
  type: string;
  label: string;
  required?: boolean;
  getOptions: (api: ReturnType<typeof useGetEnterprises>, filters: Record<string, any>) => Option[];
  isDynamicFields: boolean;
}

// Map field keys to database field names
const FIELD_DB_MAP: Record<string, string> = {
  institutes: "insId",
  degree: "degId",
  program: "prgId",
  department: "deptId",
  course: "courseId",
  semester: "semId",
  academicyears: "acYr",
};

// Define parent dependencies for each field
const PARENT_MAP: Record<string, string | string[] | null> = {
  institutes: null,
  degree: ["insId"],
  program: ["insId", "degId"],
  department: "insId",
  course: ["deptId"],
  semester: ["insId", "degId", "prgId"],
  academicyears: "insId",
};

// Define how to fetch options for each field type
const OPTIONS_FETCHER: Record<string, (api: ReturnType<typeof useGetEnterprises>, filters?: Record<string, any>) => Option[]> = {
  institutes: (api) =>
    api.getInstitutesList().map((i: any) => ({
      label: i.insName,
      value: i._id,
    })),

  degree: (api, filters = {}) => {
    const degrees = api.getDegreesList(filters);
    return degrees.map((i: any) => ({
      label: i.degNm,
      value: i._id,
    }));
  },

  program: (api, filters = {}) => {
    const programs = api.getProgramsList(filters);
    return programs.map((i: any) => ({
      label: i.prgNm,
      value: i._id,
    }));
  },

  department: (api, filters = {}) => {
    return api.getDepartmentsList(filters).map((i: any) => ({
      label: i.deptNm,
      value: i._id,
    }));
  },

  course: () => {
    // Courses are not part of useGetEnterprises hook
    // This should be handled separately if needed
    return [];
  },

  semester: (api, filters = {}) => {
    return api.getSemestersList(filters).map((i: any) => ({
      label: i.semNm,
      value: i._id,
    }));
  },

  academicyears: (api, filters = {}) => {
    return api.getAcademicYearsList(filters).map((i: any) => ({
      label: i.academicYearNm,
      value: i._id,
    }));
  }
};

const EnterpriseFilter: React.FC<EnterpriseFilterProps> = ({
  onSubmit,
  autoFieldSchema = {},
  schema,
  isAutoGen = true
}) => {
  const { t } = useTranslation();
  const api = useGetEnterprises();
  const { user } = useAuthStore();

  /** ------------------------------
   *  Build auto fields based on JSON
   * ------------------------------- */
  const fields: Field[] = useMemo(() => {
    if (!isAutoGen) return [];

    return Object.keys(autoFieldSchema).map((key) => {
      const cfg = autoFieldSchema[key];
      return {
        name: FIELD_DB_MAP[key],
        fieldKey: key,
        parent: PARENT_MAP[key],
        type: cfg.type || "select",
        label: cfg.label,
        required: cfg.required,
        getOptions: OPTIONS_FETCHER[key],
        isDynamicFields: true
      };
    });
  }, [autoFieldSchema, isAutoGen]);

  /** ------------------------------
   *  Build Yup validation dynamically
   * ------------------------------- */
  const validation = useMemo(() => {
    return fields.reduce((acc, f) => {
      acc[f.name] = f.required
        ? Yup.string().required(`${f.label} is required`)
        : Yup.string().nullable();
      return acc;
    }, {} as Record<string, any>);
  }, [fields]);

  /** ------------------------------
   *  Formik setup
   * ------------------------------- */
  const formik = useFormik({
    initialValues: fields.reduce((acc, f) => {
      // Set default institute value from logged-in user
      if (f.name === "insId" && user?.user?.instituteId) {
        acc[f.name] = user.user.instituteId;
      } else {
        acc[f.name] = "";
      }
      return acc;
    }, {} as Record<string, any>),
    validationSchema: Yup.object(validation),
    onSubmit: onSubmit || (() => {}),
    enableReinitialize: true,
  });

  // Use ref to access formik without causing re-renders
  const formikRef = useRef(formik);
  useEffect(() => {
    formikRef.current = formik;
  }, [formik]);

  /** ------------------------------
   *  Reset dependent fields when parent changes
   * ------------------------------- */
  const handleFieldChangeWrapper = useCallback((fieldName: string, newValue: any) => {
    // Set the field value
    formikRef.current.setFieldValue(fieldName, newValue);

    // Find fields that depend on this field and reset them
    fields.forEach((field) => {
      const dependsOnChangedField = field.parent && (
        (Array.isArray(field.parent) && field.parent.includes(fieldName)) ||
        (typeof field.parent === 'string' && field.parent === fieldName)
      );

      if (dependsOnChangedField) {
        formikRef.current.setFieldValue(field.name, "");
      }
    });
  }, [fields]);

  /** ------------------------------
   *  Render Field Compactly
   * ------------------------------- */
  const renderField = (field: Field) => {
    // Build filter object from parent dependencies
    const parentFilters: Record<string, any> = {};
    let hasAllParentValues = true;

    if (field.parent) {
      if (Array.isArray(field.parent)) {
        // Handle array of parent fields
        field.parent.forEach((parentField: string) => {
          const value = formik.values[parentField];
          if (value) {
            parentFilters[parentField] = value;
          } else {
            hasAllParentValues = false;
          }
        });
      } else if (typeof field.parent === 'string') {
        // Handle single parent field (string)
        const value = formik.values[field.parent];
        if (value) {
          parentFilters[field.parent] = value;
        } else {
          hasAllParentValues = false;
        }
      }
    } else {
      // No parent dependency (like institutes)
      hasAllParentValues = true;
    }

    // Only fetch options if all parent dependencies are satisfied
    const options = hasAllParentValues ? (field.getOptions(api, parentFilters) || []) : [];
    const isDisabled = !hasAllParentValues;

    if (field.type === "text") {
      return (
        <TextField
          fullWidth
          size="small"
          name={field.name}
          value={formik.values[field.name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isDisabled}
          error={Boolean(formik.touched[field.name] && formik.errors[field.name])}
          helperText={(formik.touched[field.name] && formik.errors[field.name]) ? String(formik.errors[field.name]) : ""}
        />
      );
    }

    if (field.type === "Textarea") {
      return (
        <Textarea
          minRows={2}
          name={field.name}
          value={formik.values[field.name]}
          onChange={formik.handleChange}
          disabled={isDisabled}
        />
      );
    }

    // default select - create a new field object with computed values
    const fieldWithOptions = {
      ...field,
      options,
      isDisabled: isDisabled
    };

    return (
      <InputFields
        field={fieldWithOptions}
        value={formik.values[field.name] || ""}
        onChange={handleFieldChangeWrapper}
        editPerm={true}
        formik={formik}
      />
    );
  };

  /** ------------------------------
   *  Reset all fields except institute
   * ------------------------------- */
  const handleReset = useCallback(() => {
    const resetValues: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.name === "insId" && user?.user?.instituteId) {
        // Keep the institute value
        resetValues[field.name] = user.user.instituteId;
      } else {
        // Clear all other fields
        resetValues[field.name] = "";
      }
    });

    formik.setValues(resetValues);
    formik.setTouched({});
  }, [fields, user, formik]);

  /** ------------------------------
   *  Handle button click
   * ------------------------------- */
  const handleButtonClick = (btn: ButtonConfig) => {
    if (btn.type === "submit") {
      formik.handleSubmit();
    } else if (btn.type === "reset" || btn.nature === "reset") {
      // Handle reset button
      handleReset();
      // Also call onClick if provided
      if (btn.onClick) {
        btn.onClick(formik.values);
      }
    } else if (btn.onClick) {
      // Pass current form values to the onClick handler
      btn.onClick(formik.values);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box mb={3} className="generic-master-card">
        <SectionHeader sectionName={t("FILTER")} />
        <div className="fields-row">
          {fields.map((field, i) => (
            <div key={i} className="field-wrapper">
              <Label labelName={field.label} required={field.required} />
              {renderField(field)}
            </div>
          ))}
        </div>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          {(schema?.buttons || []).map((btn, i) => (
            <Button
              key={i}
              type={btn.type || "button"}
              onClick={() => handleButtonClick(btn)}
              className={`btn-${btn.nature?.toLowerCase()}`}
            >
              {btn.name}
            </Button>
          ))}
        </Box>
      </Box>
    </form>
  );
};

export default EnterpriseFilter;
