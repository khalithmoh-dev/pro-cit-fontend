import React, { FC } from "react";
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
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import Textarea from "@mui/joy/Textarea"; // adjust import as needed
import FileUpload from "../fileupload"; // adjust import as needed

interface InputFieldsProps {
  field: any;
  formik: any;
  editPerm: boolean;
  aMultiSelectVal?: any[];
  setAMultiSelectVal?: React.Dispatch<React.SetStateAction<any[]>>;
  oInitialValues?: any;
  instDtls?: any;
}

const InputFields: FC<InputFieldsProps> = ({
  field,
  formik,
  editPerm,
  aMultiSelectVal = [],
  setAMultiSelectVal,
  oInitialValues,
  instDtls,
}) => {
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
          helperText={formik.touched[field.name] && formik.errors[field.name]}
          disabled={!editPerm || field.isDisabled}
        />
      );

    case "select": {
      const labelKey = field.labelKey || "label";
      const valueKey = field.valueKey || "value";
      let options =
        field.name === "insId"
          ? [{ [valueKey]: instDtls._id, [labelKey]: instDtls.insname }]
          : field.options || [];

      const isMulti = !!field?.isMulti;

      if (isMulti && setAMultiSelectVal) {
        const optionMap = new Map();
        [...aMultiSelectVal, ...options].forEach((option) => {
          optionMap.set(option._id, option);
        });
        options = Array.from(optionMap.values());
      }

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
                if (isMulti && setAMultiSelectVal) {
                  setAMultiSelectVal((pre) => [...newValue, ...pre]);
                  if (field.setInputValue) field.setInputValue("");
                } else if (field.setInputValue) {
                  field.setInputValue(newValue ? newValue[labelKey] : "");
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
                      ? formik.errors[field.name]
                      : ""
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      minHeight: 40,
                      height: 40,
                      borderRadius: "var(--input-radius, 15px)",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    },
                    "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
                      padding:0
                    }
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
                {formik.errors[field.name]}
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
              const selectedOption = options.find(
                (opt) => opt[valueKey] === selected
              );
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
              {formik.errors[field.name]}
            </Typography>
          )}
        </FormControl>
      );
    }

    case "file":
      return (
        <FileUpload
          maxSize={field.size || 1 * 1024 * 1024}
          multiple={field.isMulti}
          accept={field?.format ? field.format + "/*" : "*"}
          onFileSelect={([File] = []) => {
            const newValue = [...formik.values[field.name]];
            newValue.push(File);
            formik.setFieldValue(field.name, newValue);
          }}
          onFileRemove={(index) => {
            const newValue = [...formik.values[field.name]];
            newValue.splice(index, 1);
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
                    checked={formik.values[field.name]?.includes(option.value)}
                    onChange={(e) => {
                      const newValue = [...formik.values[field.name]];
                      if (e.target.checked) newValue.push(option.value);
                      else {
                        const index = newValue.indexOf(option.value);
                        if (index > -1) newValue.splice(index, 1);
                      }
                      formik.setFieldValue(field.name, newValue);
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
            component="textarea"
            name={field.name}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            minRows={2}
            size="lg"
            variant="outlined"
            disabled={!editPerm || field.isDisabled}
          />
          {formik.touched[field.name] && formik.errors[field.name] && (
            <FormHelperText className="error-text">
              {formik.errors[field.name]}
            </FormHelperText>
          )}

        </>
      );

    default:
      return null;
  }
};

export default InputFields;
