import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import Select from "react-select";
import { components } from "react-select";
import Textarea from "@mui/joy/Textarea";
import FormHelperText from "@mui/joy/FormHelperText";
import "./style.css"

const SmartField = ({ field, formik, editPerm }) => {
  const isDisabled = !editPerm || field.isDisabled;
  const value = formik.values[field.name];

  // Handle multi-checkbox change
  const handleMultiCheckboxChange = (optionValue, checked) => {
    const newValue = [...(value || [])];
    if (checked) {
      newValue.push(optionValue);
    } else {
      const index = newValue.indexOf(optionValue);
      if (index > -1) newValue.splice(index, 1);
    }
    formik.setFieldValue(field.name, newValue);
  };

  // Handle select value change for react-select
  const handleSelectChange = (selectedOption) => {
    if (field.isMulti) {
      const selectedValues = selectedOption.map(option => option.value);
      formik.setFieldValue(field.name, selectedValues); // Set multiple selected values
    } else {
      formik.setFieldValue(field.name, selectedOption ? selectedOption.value : null); // Set single selected value
    }
  };

  // Rendering different field types based on field.type
  switch (field.type) {
    case "text":
    case "number":
      return (
        <TextField
          fullWidth
          size="small"
          type={field.type}
          name={field.name}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
          helperText={formik.touched[field.name] && formik.errors[field.name]}
          disabled={isDisabled}
        />
      );

    case "select":
      return (
        <div>
          <Select
            isMulti={field.isMulti}
            isDisabled={isDisabled}
            name={field.name}
            value={field.isMulti ? field.options.filter(option => value.includes(option.value)) : field.options.find(option => option.value === value)}
            options={field.options}
            onChange={handleSelectChange}
            closeMenuOnSelect={!field.isMulti}
            components={{
              MultiValue: (props) => (
                <components.MultiValue {...props}>
                  {props.data.label}
                </components.MultiValue>
              ),
            }}
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
            placeholder={field.label}
          />
          {formik.touched[field.name] && formik.errors[field.name] && (
            <Typography variant="caption" color="error">
              {formik.errors[field.name]}
            </Typography>
          )}
        </div>
      );

    case "file":
      return (
        <div>
          {/* File Upload Component */}
          <input
            type="file"
            multiple={field.isMulti}
            onChange={(e) => {
              const newFiles = [...(value || []), ...e.target.files];
              formik.setFieldValue(field.name, newFiles);
            }}
            disabled={isDisabled}
          />
        </div>
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
                    checked={value?.includes(option.value)}
                    onChange={(e) => handleMultiCheckboxChange(option.value, e.target.checked)}
                    disabled={isDisabled}
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
            className={field.className}
            control={
              <Checkbox
                name={field.name}
                checked={value}
                onChange={formik.handleChange}
                disabled={isDisabled}
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
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isDisabled}
          />
          {formik.touched[field.name] && Boolean(formik.errors[field.name]) && (
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

export default SmartField;
