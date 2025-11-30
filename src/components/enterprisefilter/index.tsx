import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField,
  Autocomplete
} from "@mui/material";
import Typography from '@mui/material/Typography'
import SectionHeader from '../SectionHeader'
import Label from '../Label';
import Button from '../ButtonMui';
import FileUpload from '../fileupload';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Textarea } from '@mui/joy';
import { FormHelperText } from '@mui/joy';
import useInstituteStore from "../../store/instituteStore";
import useAuthStore from '../../store/authStore'
import { useLayout } from '../../modules/layout/LayoutContext'
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

/** The generic form component to generate form dynamically using a JSON
    The working json can be referred from institute config
    Yup validaion type etc can be handled from sample json
    props defnation:
      - pageTitle?: title of the page
      - schema: Json schema with inputs
      - onSubmit: onSubmit function
*/

interface FormFieldAny {
  name: string;
  type: any;               // loosened
  label: string;
  removeHeader?: boolean;
  isRequired?: boolean;
  options?: any[];
  showWhen?: { field: string; value: any };
  validation: Yup.Schema<any>;
  isDisabled?: boolean;
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  helperText?: string;
  [key: string]: any;       // allow extra fields
}

interface ButtonAny {
  name: string;
  variant: any;
  nature: any;
  type?: any;
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: any;
}

export interface FormSchemaAny {
  fields: { [sectionName: string]: FormFieldAny[] };
  buttons: ButtonAny[];
}

interface EnterpriseFilterPropsAny {
  schema: FormSchemaAny;
  onSubmit: (values: Record<string, any>) => void;
  isEditPerm?: boolean;
  isEditDisableDflt?: boolean;
  oInitialValues?: Record<string, any>;
  setIsEditPerm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EnterpriseFilter: React.FC<EnterpriseFilterPropsAny> = ({ schema, onSubmit, isEditPerm = false, isEditDisableDflt = false, oInitialValues, setIsEditPerm }) => {
  const [editPerm, setEditPerm] = useState(!isEditDisableDflt);
  const [instDtls, setInstDtls] = useState({ _id: '', insName: '' });
  const [aMultiSelectVal, setAMultiSelectVal] = useState([]);
  const instituteStore = useInstituteStore();
  const { setRouteNm, setActionFields } = useLayout();
  const authStore = useAuthStore();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (authStore?.user && instituteStore.getInstitute) {
      (async () => {
        const oInstituteDtls = await instituteStore.getLogInIns();
        if (oInstituteDtls && Object.keys(oInstituteDtls).length) {
          setInstDtls(oInstituteDtls);
        }
      })();
    }
  }, [authStore, instituteStore]);

  useEffect(() => {
    if (location.pathname) {
      setRouteNm(location.pathname);
      // setActionFields([<Switch checked={editPerm} onChange={(e) => {
      //   setIsEditPerm(e?.target?.checked);
      //   setEditPerm(prevEditPerm => {
      //     return !prevEditPerm;
      //   });
      // }} label="Edit mode" />])
    }
  }, [location.pathname]);

  // Build validation schema
  const validationSchema = Yup.object(
    (Object.values(schema.fields).flat() as FormFieldAny[]).reduce((acc, field) => {
      if (!field.isNullable && field.name && field.validation) {
        acc[field.name] = field.validation;
      }
      return acc;
    }, {} as Record<string, Yup.AnySchema>)
  );

  const formik = useFormik({
    initialValues: (Object.values(schema.fields).flat() as FormFieldAny[]).reduce(
      (acc, field) => {
        if (field.name === "insId" && instDtls?._id && instDtls?.insName) {
          acc[field.name] = instDtls?._id;
        } else if (oInitialValues && oInitialValues.hasOwnProperty(field.name)) {
          acc[field.name] = oInitialValues[field.name];
        } else if (field.isNullable) {
          acc[field.name] = null;
        } else if (field.isMulti || field.type === "file") {
          acc[field.name] = [];
        } else if (field.type === "checkbox") {
          acc[field.name] = false;
        } else if (field.type === "number") {
          acc[field.name] = null;
        } else {
          acc[field.name] = "";
        }
        return acc;
      },
      {} as Record<string, any>
    ),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validationSchema,
  });
  // Render field by type
  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextField
            fullWidth
            size="small"
            type={field.type}
            name={field.name}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            helperText={formik.touched[field.name] ? formik.errors[field.name] as string : ""}
            disabled={!editPerm || field.isDisabled}
          />
        );
      case "select":
        const labelKey = field.labelKey || "label";
        const valueKey = field.valueKey || "value";
        let options =
          field.name === "insId" && !field.multiOptn
            ? [{ [valueKey]: instDtls._id, [labelKey]: instDtls.insName }]
            : field.options || [];
        const isMulti = !!field?.isMulti;
        if (isMulti) {
          // Use Map to ensure uniqueness by _id
          const optionMap = new Map();

          // Add all options from both arrays, newer ones will overwrite older ones with same _id
          [...aMultiSelectVal, ...options].forEach(option => {
            optionMap.set(option._id, option);
          });

          options = Array.from(optionMap.values());
        }

        // --- If API-based autocomplete ---
        // In your DynamicForm component's Autocomplete section
        if (field.isApi) {
          return (
            <FormControl fullWidth size="small">
              <Autocomplete
                multiple={isMulti}
                disableCloseOnSelect={isMulti}
                options={options}
                getOptionLabel={(opt) => opt[labelKey] || ""}
                value={
                  isMulti
                    ? options.filter((opt) =>
                      (formik.values[field.name] || []).includes(opt[valueKey])
                    )
                    : options.find(
                      (opt) => opt[valueKey] === formik.values[field.name]
                    ) || null
                }
                onChange={(_, newValue) => {
                  if (field?.isMulti) {
                    setAMultiSelectVal(pre => [...newValue, ...pre]);
                    if (field.setInputValue) {
                      field.setInputValue('');
                    }
                  } else if (field.setInputValue) {
                    field.setInputValue(newValue ? newValue[labelKey] : '');
                  }
                  formik.setFieldValue(
                    field.name,
                    isMulti
                      ? newValue.map((opt) => opt[valueKey])
                      : newValue
                        ? newValue[valueKey]
                        : ""
                  );
                }}
                inputValue={field?.inputValue || ""}
                onInputChange={(_, newInputValue, reason) => {
                  if (field?.isMulti && oInitialValues?.[field.name] && Array.isArray(oInitialValues?.[field.name]) && oInitialValues?.[field.name]?.length && !aMultiSelectVal.length) {
                    setAMultiSelectVal(pre => [...pre, ...options]);
                  }
                  // Only trigger on input, not on clear or selection
                  if (reason === 'input' && field.setInputValue) {
                    field.setInputValue(newInputValue);
                  }
                }}
                loading={field.isLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    variant="outlined"
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                    helperText={
                      formik.touched[field.name] && formik.errors[field.name]
                        ? formik.errors[field.name] as string
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "var(--input-radius, 15px)",
                      },
                    }}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option[valueKey]}>
                    {isMulti && (
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                        disabled={!editPerm || field.isDisabled}
                      />
                    )}
                    {option[labelKey]}
                  </li>
                )}
                disabled={!editPerm || field.isDisabled}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "var(--input-radius, 15px)",
                  },
                }}
              />

              {formik.touched[field.name] && formik.errors[field.name] && (
                <Typography variant="caption" color="error">
                  {formik.errors[field.name] as string}
                </Typography>
              )}
            </FormControl>
          );
        }
        return (
          <FormControl fullWidth size="small">
            <Select
              name={field.name}
              multiple={field.isMulti}
              value={formik.values[field.name] || (field.isMulti ? [] : "")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              renderValue={(selected) => {
                if (field.isMulti) {
                  return selected
                    .map((val: any) => {
                      const opt = options.find((o) => o[valueKey] === val);
                      return opt ? opt[labelKey] : val;
                    })
                    .join(", ");
                }
                const selectedOption = options.find((opt) => opt[valueKey] === selected);
                return selectedOption ? selectedOption[labelKey] : "";
              }}
              disabled={!editPerm || field.isDisabled}
              sx={{
                borderRadius: "var(--input-radius, 15px)",
              }}
            >
              {options.map((opt: any) => (
                <MenuItem key={opt[valueKey]} value={opt[valueKey]}>
                  {field.isMulti && (
                    <Checkbox
                      checked={formik.values[field.name]?.includes(opt[valueKey])}
                      disabled={!editPerm || field.isDisabled}
                    />
                  )}
                  {opt[labelKey]}
                </MenuItem>
              ))}
            </Select>

            {formik.touched[field.name] && formik.errors[field.name] && (
              <Typography variant="caption" color="error">
                {formik.errors[field.name] as string}
              </Typography>
            )}
          </FormControl>
        );

      case "file":
        return (
          <FileUpload
            maxSize={field.size ? field.size : 1 * 1024 * 1024} // 50MB
            multiple={field.isMulti}
            accept={`${field?.format ? field?.format + '/*' : '*'}`}
            onFileSelect={([File] = []) => {
              const newValue = [...formik.values[field.name]]
              newValue.push(File)
              formik.setFieldValue(field.name, newValue);
            }}
            onFileRemove={(index) => {
              const newValue = [...formik.values[field.name]]
              newValue.splice(index)
              formik.setFieldValue(field.name, newValue);
            }}
            disabled={!editPerm || field.isDisabled}
          />
        );
      case "checkbox":
        if (field.isMulti) {
          return (
            <FormGroup row>
              {field.data?.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      name={field.name}
                      checked={formik.values[field.label]?.includes(option.value)}
                      onChange={(e) => {
                        const newValue = [...formik.values[field.name]];
                        if (e.target.checked) {
                          newValue.push(option.value);
                        } else {
                          const index = newValue.indexOf(option.value);
                          if (index > -1) newValue.splice(index, 1);
                        }
                        formik.setFieldValue(field.name, newValue);
                      }}
                    />
                  }
                  disabled={!editPerm || field.isDisabled}
                  label={option.label}
                />
              ))}
            </FormGroup>
          );
        } else {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  name={field.name}
                  checked={formik.values[field.name]}
                  onChange={formik.handleChange}
                  disabled={!editPerm || field.isDisabled}
                />
              }
              label={field.label}
            />
          );
        }
      case "Textarea":
        return (
          <>
            <Textarea
              name={field.name}
              color="neutral"
              minRows={2}
              size="lg"
              variant="outlined"
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!editPerm || field.isDisabled}
              sx={{
                borderColor:
                  formik.touched[field.name] && formik.errors[field.name]
                    ? 'var(--joy-palette-danger-outlinedBorder)'
                    : undefined,
              }}
            />
            {formik.touched[field.name] &&
              typeof formik.errors[field.name] === 'string' &&
              formik.errors[field.name] && (
                <FormHelperText color="danger">
                  {formik.errors[field.name] as string}
                </FormHelperText>
              )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
      >
        {Object.entries(schema.fields).map(([sectionName, fields = []]) => (
          <Box key={sectionName} mb={4}>
            {/* Section Heading */}
            <div className="generic-master-card">
              <SectionHeader sectionName={t(sectionName)} />
              <div className="fields-row">
                {(fields ?? []).map((field, index) => {
                  const shouldShow = !field.showWhen || formik.values[field.showWhen.field] === field.showWhen.value;
                  if (!shouldShow) return null;
                  return (
                    <div className="field-wrapper" key={index}>
                      {!field.removeHeader && (
                        <Label labelName={field.label} required={field.isRequired} />
                      )}
                      {renderField(field)}
                    </div>
                  );
                })}
              </div>
              <div className="fields-row">
                {/* {Buttons} */}
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  {schema.buttons.map((btn, idx) => (
                    <Button
                      key={idx}
                      className={`btn-${btn?.nature?.toLowerCase()} btn-small`}
                      sizeType={btn.size || "md"}
                      onClick={(e) => {
                        if (btn.name === "Reset") {
                          formik.handleReset(e);
                        }
                        if (btn.onClick) { btn.onClick() }
                      }}
                      type={btn.type || 'button'}
                      disabled={btn.isDisabled || (btn.name !== "Cancel" && (!editPerm || btn.isDisabled))}
                      variantType={
                        typeof btn.type === "string" ? btn.type === "submit"
                          ? "submit"
                          : btn.name === "Reset"
                            ? "reset"
                            : btn.name === "Cancel"
                              ? "cancel"
                              : "button" : "button"
                      }
                    >
                      {btn.name}
                    </Button>
                  ))}
                </Box>
              </div>
            </div>

          </Box>
        ))}
      </form>
    </div >
  );
};


export default EnterpriseFilter;
