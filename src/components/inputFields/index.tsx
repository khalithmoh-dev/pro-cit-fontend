import React, { FC, useState } from "react";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  FormHelperText,
  IconButton,
  Box,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Textarea } from "@mui/joy";
import FileUpload from "../fileupload";
import Button from "../ButtonMui";
import { Add as AddIcon, Check as CheckIcon, Close as CloseIcon, Edit as EditIcon } from "@mui/icons-material";
import "./index.css";
import { useTranslation } from "react-i18next";

interface InputFieldsProps {
  field: any;
  formik?: any; // Make formik optional
  editPerm: boolean;
  aMultiSelectVal?: any[];
  setAMultiSelectVal?: React.Dispatch<React.SetStateAction<any[]>>;
  oInitialValues?: any;
  instDtls?: any;
  // Simple props for non-formik usage
  value?: any;
  onChange?: (name: string, value: any) => void;
}

const InputFields: FC<InputFieldsProps> = ({
  field,
  formik,
  editPerm,
  aMultiSelectVal = [],
  setAMultiSelectVal,
  oInitialValues,
  instDtls,
  // Simple non-formik props
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  // Inline add/edit state for select fields - field-specific using field.name as key
  const [inlineState, setInlineState] = useState<{
    [fieldName: string]: {
      isAdding: boolean;
      isEditing: boolean;
      newItemValue: string;
    };
  }>({});

  // Helper to get inline state for a specific field
  const getInlineState = (fieldName: string) => {
    return inlineState[fieldName] || { isAdding: false, isEditing: false, newItemValue: "" };
  };

  // Helper to update inline state for a specific field
  const updateInlineState = (fieldName: string, updates: Partial<typeof inlineState[string]>) => {
    setInlineState(prev => ({
      ...prev,
      [fieldName]: {
        ...getInlineState(fieldName),
        ...updates
      }
    }));
  };

  // Helper functions to handle formik vs non-formik scenarios
  const getValue = (fieldName: string) => {
    if (formik) {
      return formik.values[fieldName] ?? "";
    }
    return value !== undefined ? value : "";
  };

  const handleChange = (fieldName: string, newValue: any) => {
    if (formik) {
      formik.setFieldValue(fieldName, newValue);
    } else if (onChange) {
      onChange(fieldName, newValue);
    }
  };

  const handleEventChange = (e: any) => {
    const { name, value, type } = e.target;

    let finalValue: any = value;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      finalValue = e.target.checked;
    }

    if (formik) {
      formik.handleChange(e);
    } else if (onChange) {
      onChange(name, finalValue);
    }
  };

  // For formik, use formik's error handling. For non-formik, no error handling.
  const getFormikError = (fieldName: string) => {
    return formik ? formik.touched[fieldName] && formik.errors[fieldName] : null;
  };

  const isFormikTouched = (fieldName: string) => {
    return formik ? formik.touched[fieldName] : false;
  };

  // State for selectWithAdd type - must be outside switch case
  const [selectWithAddState, setSelectWithAddState] = useState<{
    adding: boolean;
    newOption: string;
  }>({ adding: false, newOption: "" });

  switch (field.type) {
    case "text":
    case "number":
      return (
        <TextField
          fullWidth
          size="small"
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          value={getValue(field.name)}
          onChange={handleEventChange}
          onKeyDown={(e) => {
            if (field.type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onBlur={formik?.handleBlur} // Only for formik
          error={isFormikTouched(field.name) && Boolean(getFormikError(field.name))}
          helperText={isFormikTouched(field.name) && getFormikError(field.name)}
          disabled={!editPerm || field.isDisabled}
        />
      );

    case "select": {
      const labelKey = field.labelKey || "label";
      const valueKey = field.valueKey || "value";
      let options =
        !field.isDynamicFields && field.name === "insId" && instDtls
          ? [{ [valueKey]: instDtls._id, [labelKey]: instDtls.insName }]
          : Array.isArray(field.options) ? field.options : [];

      const isMulti = !!field?.isMulti;

      if (isMulti && setAMultiSelectVal && Array.isArray(aMultiSelectVal)) {
        const optionMap = new Map();
        [...aMultiSelectVal, ...options].forEach((option) => {
          if (option && option._id) {
            optionMap.set(option._id, option);
          }
        });
        options = Array.from(optionMap.values());
      }

      // Inline add/edit handlers - field-specific
      const fieldState = getInlineState(field.name);
      const { isAdding, isEditing, newItemValue } = fieldState;

      const handleAddClick = () => {
        updateInlineState(field.name, { isAdding: true, newItemValue: "" });
      };

      const handleEditClick = () => {
        const currentValue = getValue(field.name);
        const selectedOption = options.find(opt => opt[valueKey] === currentValue);
        if (selectedOption) {
          updateInlineState(field.name, {
            isEditing: true,
            newItemValue: selectedOption[labelKey]
          });
        }
      };

      const handleSaveAdd = () => {
        if (newItemValue.trim() && field.addClick) {
          field.addClick({ ...formik?.values, newValue: newItemValue });
        }
        updateInlineState(field.name, { isAdding: false, newItemValue: "" });
      };

      const handleSaveEdit = () => {
        if (newItemValue.trim() && field.editClick) {
          field.editClick({ ...formik?.values, newValue: newItemValue });
        }
        updateInlineState(field.name, { isEditing: false, newItemValue: "" });
      };

      const handleCancel = () => {
        updateInlineState(field.name, { isAdding: false, isEditing: false, newItemValue: "" });
      };

      const isAddDisabled = typeof field.addDisabled === "function"
        ? field.addDisabled(formik?.values || {})
        : field.addDisabled;

      const isEditDisabled = typeof field.editDisabled === "function"
        ? field.editDisabled(formik?.values || {})
        : field.editDisabled;

      if (field.isApi) {
        return (
          <FormControl fullWidth size="small">
            <Autocomplete
              multiple={isMulti}
              disableCloseOnSelect={isMulti}
              options={field?.aOptions || options}
              getOptionLabel={(opt) => opt[labelKey] || ""}
              value={
                isMulti
                  ? options.filter((opt) =>
                    (getValue(field.name) || []).includes(opt[valueKey])
                  )
                  : options.find(
                    (opt) => opt[valueKey] === getValue(field.name)
                  ) || null
              }
              onChange={(_, newValue) => {
                const extractedValue = isMulti
                  ? Array.isArray(newValue) ? newValue.map((opt) => opt[valueKey]) : []
                  : newValue
                    ? newValue[valueKey]
                    : "";

                if (isMulti && setAMultiSelectVal && Array.isArray(newValue)) {
                  setAMultiSelectVal((pre) => [...newValue, ...(Array.isArray(pre) ? pre : [])]);
                  if (field.setInputValue) field.setInputValue("");
                } else if (field.setInputValue) {
                  field.setInputValue(newValue ? newValue[labelKey] : "");
                }

                // Call custom onChange with consistent signature (fieldname, value, formik)
                if (field.onChange) {
                  field.onChange(field.name, extractedValue, formik);
                }

                handleChange(field.name, extractedValue);
              }}
              inputValue={field?.inputValue || ""}
              onInputChange={(_, newInputValue, reason) => {
                if (field?.handleInpChange) {
                  field.handleInpChange(_, newInputValue);
                  return
                }
                if (
                  field?.isMulti &&
                  oInitialValues?.[field.name] &&
                  Array.isArray(oInitialValues[field.name]) &&
                  oInitialValues[field.name].length &&
                  !aMultiSelectVal.length &&
                  setAMultiSelectVal
                ) {
                  setAMultiSelectVal((pre) => [...pre, ...options]);
                }
                if (reason === "input" && field.setInputValue) {
                  field.setInputValue(newInputValue);
                }
              }}
              loading={field.isLoading}
              renderInput={(params) => {
                // if (field.handleRenderInput) {
                //   return field.handleRenderInput(params);
                // }
                return <TextField
                  {...params}
                  size="small"
                  variant="outlined"
                  onBlur={formik?.handleBlur} // Only for formik
                  error={
                    isFormikTouched(field.name) &&
                    Boolean(getFormikError(field.name))
                  }
                  helperText={
                    isFormikTouched(field.name) && getFormikError(field.name)
                      ? getFormikError(field.name)
                      : ""
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      minHeight: 38,
                      height: 38,
                      borderRadius: "var(--input-radius, 15px)",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    },
                    "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
                      padding: 0
                    }
                  }}
                />
              }}
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
            />
            {formik && isFormikTouched(field.name) && getFormikError(field.name) && (
              <FormHelperText error>
                {getFormikError(field.name)}
              </FormHelperText>
            )}
          </FormControl>
        );
      }

      // Check if this field has inline add/edit
      const hasInlineFeatures = field.showAdd || field.showEdit;

      if (!hasInlineFeatures) {
        // Regular select without inline add/edit
        return (
          <FormControl
            fullWidth
            size="small"
            error={isFormikTouched(field.name) && Boolean(getFormikError(field.name))}
          >
            <Select
              name={field.name}
              multiple={field.isMulti}
              value={getValue(field.name) || (field.isMulti ? [] : "")}
              onChange={(e) => {
                if (field.onChange) {
                  // Call custom onChange with (fieldname, value, formik)
                  field.onChange(field.name, e.target.value, formik);
                }
                handleEventChange(e);
              }}
              onBlur={formik?.handleBlur}
              error={isFormikTouched(field.name) && Boolean(getFormikError(field.name))}
              renderValue={(selected) => {
                if (field.isMulti && Array.isArray(selected)) {
                  return selected
                    .map((val: any) => {
                      const opt = options.find((o) => o && o[valueKey] === val);
                      return opt ? opt[labelKey] : val;
                    })
                    .filter(Boolean)
                    .join(", ");
                }
                const selectedOption = options.find(
                  (opt) => opt && opt[valueKey] === selected
                );
                return selectedOption ? selectedOption[labelKey] : "";
              }}
              disabled={!editPerm || field.isDisabled}
            >
              {Array.isArray(options) && options.map((opt: any) => (
                opt && opt[valueKey] && (
                  <MenuItem key={opt[valueKey]} value={opt[valueKey]}>
                    {field.isMulti && (
                      <Checkbox
                        checked={Array.isArray(getValue(field.name)) && getValue(field.name)?.includes(opt[valueKey])}
                        disabled={!editPerm || field.isDisabled}
                      />
                    )}
                    {opt[labelKey]}
                  </MenuItem>
                )
              ))}
            </Select>
            {formik && isFormikTouched(field.name) && getFormikError(field.name) && (
              <FormHelperText error>
                {getFormikError(field.name)}
              </FormHelperText>
            )}
          </FormControl>
        );
      }

      // Select with inline add/edit features
      return (
        <Box display="flex" alignItems="flex-start" gap={1}>
          <FormControl
            fullWidth
            size="small"
            error={isFormikTouched(field.name) && Boolean(getFormikError(field.name))}
          >
            {isAdding || isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={newItemValue}
                onChange={(e) => updateInlineState(field.name, { newItemValue: e.target.value })}
                placeholder={isAdding ? `Enter new ${field.label}` : `Edit ${field.label}`}
                autoFocus
              />
            ) : (
              <Select
                name={field.name}
                multiple={field.isMulti}
                value={getValue(field.name) || (field.isMulti ? [] : "")}
                onChange={(e) => {
                  if (field.onChange) {
                    // Call custom onChange with (fieldname, value, formik)
                    field.onChange(field.name, e.target.value, formik);
                  }
                  handleEventChange(e);
                }}
                onBlur={formik?.handleBlur}
                error={isFormikTouched(field.name) && Boolean(getFormikError(field.name))}
                renderValue={(selected) => {
                  if (field.isMulti && Array.isArray(selected)) {
                    return selected
                      .map((val: any) => {
                        const opt = options.find((o) => o && o[valueKey] === val);
                        return opt ? opt[labelKey] : val;
                      })
                      .filter(Boolean)
                      .join(", ");
                  }
                  const selectedOption = options.find(
                    (opt) => opt && opt[valueKey] === selected
                  );
                  return selectedOption ? selectedOption[labelKey] : "";
                }}
                disabled={!editPerm || field.isDisabled}
              >
                {Array.isArray(options) && options.map((opt: any) => (
                  opt && opt[valueKey] && (
                    <MenuItem key={opt[valueKey]} value={opt[valueKey]}>
                      {field.isMulti && (
                        <Checkbox
                          checked={Array.isArray(getValue(field.name)) && getValue(field.name)?.includes(opt[valueKey])}
                          disabled={!editPerm || field.isDisabled}
                        />
                      )}
                      {opt[labelKey]}
                    </MenuItem>
                  )
                ))}
              </Select>
            )}
            {formik && isFormikTouched(field.name) && getFormikError(field.name) && !isAdding && !isEditing && (
              <FormHelperText error>
                {getFormikError(field.name)}
              </FormHelperText>
            )}
          </FormControl>

          {/* Add/Edit/Save/Cancel Buttons */}
          {field.showAdd && !isAdding && !isEditing && (
            <IconButton
              size="small"
              onClick={handleAddClick}
              disabled={isAddDisabled || !editPerm}
              color="primary"
              sx={{ marginTop: '4px' }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          )}

          {field.showEdit && !isAdding && !isEditing && getValue(field.name) && (
            <IconButton
              size="small"
              onClick={handleEditClick}
              disabled={isEditDisabled || !editPerm}
              color="primary"
              sx={{ marginTop: '4px' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}

          {(isAdding || isEditing) && (
            <>
              <IconButton
                size="small"
                onClick={isAdding ? handleSaveAdd : handleSaveEdit}
                disabled={!newItemValue.trim()}
                color="success"
                sx={{ marginTop: '4px' }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCancel}
                color="error"
                sx={{ marginTop: '4px' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      );
    }

    case "file":
      return (
        <FileUpload
          maxSize={field.size || 1 * 1024 * 1024}
          multiple={field.isMulti}
          accept={field?.format ? field.format + "/*" : "*"}
          onFileSelect={([File] = []) => {
            const currentValue = getValue(field.name);
            const newValue = Array.isArray(currentValue) ? [...currentValue] : [];
            newValue.push(File);
            handleChange(field.name, newValue);
          }}
          onFileRemove={(index) => {
            const currentValue = getValue(field.name);
            const newValue = Array.isArray(currentValue) ? [...currentValue] : [];
            newValue.splice(index, 1);
            handleChange(field.name, newValue);
          }}
          disabled={!editPerm || field.isDisabled}
          defaultFiles={Array.isArray(getValue(field.name)) ? [...getValue(field.name)] : []}
        />
      );

    case "checkbox":
      if (field.isMulti) {
        return (
          <FormGroup row>
            {Array.isArray(field.data) && field.data.map((option, idx) => (
              <FormControlLabel
                key={idx}
                sx={{
                  "& .css-rizt0-MuiTypography-root": {
                    height: "21px"
                  },
                }}
                control={
                  <Checkbox
                    name={field.name}
                    checked={Array.isArray(getValue(field.name)) && getValue(field.name)?.includes(option.value)}
                    onChange={(e) => {
                      const currentValue = Array.isArray(getValue(field.name)) ? getValue(field.name) : [];
                      const newValue = [...currentValue];
                      if (e.target.checked) newValue.push(option.value);
                      else {
                        const index = newValue.indexOf(option.value);
                        if (index > -1) newValue.splice(index, 1);
                      }
                      handleChange(field.name, newValue);
                    }}
                    disabled={!editPerm || field.isDisabled}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        );
      } else {
        return (
          <FormControlLabel
            sx={{
              "& .css-rizt0-MuiTypography-root": {
                height: "21px"
              },
            }}
            control={
              <Checkbox
                name={field.name}
                checked={getValue(field.name)}
                onChange={handleEventChange}
                disabled={!editPerm || field.isDisabled}
              />
            }
            label={field.label}
          />
        );
      }

    case "date":
      return (
        <TextField
          fullWidth
          size="small"
          type="date"
          name={field.name}
          value={getValue(field.name) ? new Date(getValue(field.name)).toISOString().split('T')[0] : ""}
          onChange={(e) => {
            const dateValue = e.target.value;
            handleChange(field.name, dateValue);
          }}
          onBlur={formik?.handleBlur}
          error={isFormikTouched(field.name) && Boolean(getFormikError(field.name))}
          helperText={isFormikTouched(field.name) && getFormikError(field.name)}
          disabled={!editPerm || field.isDisabled}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: field.minDate,
            max: field.maxDate,
          }}
        />
      );

    case "Textarea":
      return (
        <>
          <Textarea
            name={field.name}
            value={getValue(field.name)}
            onChange={handleEventChange}
            onBlur={formik?.handleBlur} // Only for formik
            minRows={2}
            size="lg"
            variant="outlined"
            disabled={!editPerm || field.isDisabled}
          />
          {formik && isFormikTouched(field.name) && getFormikError(field.name) && (
            <FormHelperText className="error-text">
              {getFormikError(field.name)}
            </FormHelperText>
          )}
        </>
      );

    case "selectWithAdd": {
      const labelKey = field.labelKey || "label";
      const valueKey = field.valueKey || "value";

      const handleAdd = () => {
        setSelectWithAddState({ adding: true, newOption: "" });
      };

      const handleCancel = () => {
        setSelectWithAddState({ adding: false, newOption: "" });
      };

      const handleSave = () => {
        if (selectWithAddState.newOption.trim() && field.addOption) {
          field.addOption(selectWithAddState.newOption);
        }
        setSelectWithAddState({ adding: false, newOption: "" });
      };

      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {selectWithAddState.adding ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={selectWithAddState.newOption}
                onChange={(e) => setSelectWithAddState({ ...selectWithAddState, newOption: e.target.value })}
                placeholder="Enter new option"
                disabled={!editPerm || field.isDisabled}
              />
              <Button
                className={`btn-cancel btn-small`}
                size={"medium"}
                onClick={handleCancel}
                type={'button'}
                variantType={"cancel"}
              >
                {t("CANCEL")}
              </Button>
              <Button
                className={`btn-save btn-small`}
                size={"medium"}
                onClick={handleSave}
                type={'button'}
                variantType={"primary"}
                disabled={!selectWithAddState.newOption.trim() || !editPerm || field.isDisabled}
              >
                {t("ADD")}
              </Button>
            </div>
          ) : (
            <>
              <FormControl
                fullWidth
                size="small"
                error={isFormikTouched(field.name) && Boolean(getFormikError(field.name))}
              >
                <Select
                  name={field.name}
                  multiple={field.isMulti}
                  value={getValue(field.name) || (field.isMulti ? [] : "")}
                  onChange={(e) => {
                    if (field.onChange) {
                      // Call custom onChange with (fieldname, value, formik)
                      field.onChange(field.name, e.target.value, formik);
                    }
                    handleEventChange(e);
                  }}
                  onBlur={formik?.handleBlur} // Only for formik
                  error={isFormikTouched(field.name) && Boolean(getFormikError(field.name))}
                  renderValue={(selected) => {
                    const fieldOptions = Array.isArray(field.options) ? field.options : [];
                    if (field.isMulti && Array.isArray(selected)) {
                      return selected
                        .map((val: any) => {
                          const opt = fieldOptions.find((o) => o && o[valueKey] === val);
                          return opt ? opt[labelKey] : val;
                        })
                        .filter(Boolean)
                        .join(", ");
                    }
                    const selectedOption = fieldOptions.find(
                      (opt) => opt && opt[valueKey] === selected
                    );
                    return selectedOption ? selectedOption[labelKey] : "";
                  }}
                  disabled={!editPerm || field.isDisabled}
                >
                  {Array.isArray(field.options) && field.options.map((opt: any) => (
                    opt && opt[valueKey] && (
                      <MenuItem key={opt[valueKey]} value={opt[valueKey]}>
                        {field.isMulti && (
                          <Checkbox
                            checked={Array.isArray(getValue(field.name)) && getValue(field.name)?.includes(opt[valueKey])}
                            disabled={!editPerm || field.isDisabled}
                          />
                        )}
                        {opt[labelKey]}
                      </MenuItem>
                    )
                  ))}
                </Select>
                {formik && isFormikTouched(field.name) && getFormikError(field.name) && (
                  <FormHelperText error>
                    {getFormikError(field.name)}
                  </FormHelperText>
                )}
              </FormControl>
              {editPerm && !field.isDisabled && (
                <Button
                  className={`btn-primary btn-small`}
                  size={"medium"}
                  onClick={handleAdd}
                  type={'button'}
                  disabled={!editPerm || field.isDisabled}
                  variantType={"add"}
                >
                  {t('ADD')}
                </Button>
              )}
            </>
          )}
        </div>
      );
    }

    default:
      return null;
  }
};

export default InputFields;