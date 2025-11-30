import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import Select from "react-select";
import { components } from "react-select";
import { IconButton, Tooltip } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import Textarea from "@mui/joy/Textarea";
import Label from "../Label";
import FormHelperText from "@mui/joy/FormHelperText";
import "./style.css";

const SmartField = ({ 
  field,
  formik,
  value: externalValue,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  error: externalError,
  editPerm, 
  instDtls 
}) => {
  const isFormikMode = !!formik;
  const isDisabled = isFormikMode ? !editPerm || field.isDisabled : field.isDisabled;
  
  // Internal state for non-formik mode
  const [internalValue, setInternalValue] = useState(externalValue || field.defaultValue || '');
  const [internalTouched, setInternalTouched] = useState(false);
  
  // Determine value based on mode
  const value = isFormikMode ? formik.values[field.name] : internalValue;
  const error = isFormikMode 
    ? formik.touched[field.name] && formik.errors[field.name] 
    : internalTouched && externalError;
  const touched = isFormikMode ? formik.touched[field.name] : internalTouched;

  // Handle change based on mode
  const handleChange = async (newValue) => {
    if (isFormikMode) {
      formik.setFieldValue(field.name, newValue);
      if(field?.onChange){
        field.onChange(field.name, newValue)
      }
    } else {
      setInternalValue(newValue);
      if (externalOnChange) {
        externalOnChange(field.name, newValue);
      }
    }
  };

  // Handle blur based on mode
  const handleBlur = () => {
    if (isFormikMode) {
      formik.setFieldBlur(field.name);
    } else {
      setInternalTouched(true);
      if (externalOnBlur) {
        externalOnBlur(field.name);
      }
    }
  };

  // Handle multi-checkbox change
  const handleMultiCheckboxChange = (optionValue, checked) => {
    const currentValue = value || [];
    let newValue;
    
    if (checked) {
      newValue = [...currentValue, optionValue];
    } else {
      newValue = currentValue.filter(val => val !== optionValue);
    }
    
    handleChange(newValue);
  };

  // Handle select value change for react-select
  const handleSelectChange = (selectedOption) => {
    if (field.isMulti) {
      const selectedValues = selectedOption.map(option => option.value);
      handleChange(selectedValues);
    } else {
      handleChange(selectedOption ? selectedOption.value : null);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (field.isMulti) {
      const currentFiles = value || [];
      handleChange([...currentFiles, ...newFiles]);
    } else {
      handleChange(newFiles[0] || null);
    }
  };

  // Handle checkbox change (single)
  const handleCheckboxChange = (e) => {
    handleChange(e.target.checked);
  };

  // Handle text/textarea change
  const handleTextChange = (e) => {
    handleChange(e.target.value);
  };

  // Rendering different field types based on field.type
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextField
            fullWidth
            size="small"
            type={field.type}
            name={field.name}
            value={value || ''}
            onChange={handleTextChange}
            onBlur={handleBlur}
            error={touched && Boolean(error)}
            helperText={touched && error}
            disabled={isDisabled}
          />
        );

      case "select": {
        const labelKey = field.labelKey || "label";
        const valueKey = field.valueKey || "value";
        const options =
          field.name === "insId"
            ? [{ [valueKey]: instDtls._id, [labelKey]: instDtls.insName }]
            : field.options?.map((opt)=> {return {label:opt[labelKey], value: opt[valueKey]}}) || [];
        const selectedValue = field.isMulti 
          ? options.filter(option => (value || []).includes(option.value))
          : options.find(option => option.value === value);
          
        return (
          <div>
            <Select
              isMulti={field.isMulti}
              isDisabled={isDisabled}
              name={field.name}
              value={selectedValue}
              options={options}
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
              onBlur={handleBlur}
            />
            {touched && error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </div>
        );
      }
      case "file":
        return (
          <div>
            <input
              type="file"
              multiple={field.isMulti}
              onChange={handleFileChange}
              onBlur={handleBlur}
              disabled={isDisabled}
            />
            {touched && error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
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
                      checked={(value || []).includes(option.value)}
                      onChange={(e) => handleMultiCheckboxChange(option.value, e.target.checked)}
                      onBlur={handleBlur}
                      disabled={isDisabled}
                    />
                  }
                  label={option.label}
                />
              ))}
              {touched && error && (
                <Typography variant="caption" color="error" style={{width: '100%', marginTop: '4px'}}>
                  {error}
                </Typography>
              )}
            </FormGroup>
          );
        } else {
          return (
            <FormControlLabel
              className={field.className}
              control={
                <Checkbox
                  name={field.name}
                  checked={Boolean(value)}
                  onChange={handleCheckboxChange}
                  onBlur={handleBlur}
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
              value={value || ''}
              onChange={handleTextChange}
              onBlur={handleBlur}
              disabled={isDisabled}
            />
            {touched && Boolean(error) && (
              <FormHelperText className="error-text">
                {error}
              </FormHelperText>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="smart-field-wrapper">
      <div className="smart-field-input">
        {!field.removeHeader && (
          <Label labelName={field.label} required={field.isRequired} className="m-2"/>
        )}
        {renderField()}
      </div>
      <div className="smart-field-actions">
        {field.showAdd && (
          <Tooltip title="Add">
            <span>
              <IconButton
                size="small"
                onClick={() => field.addClick?.(isFormikMode ? formik.values : {[field.name]: value})}
                disabled={
                  typeof field.addDisabled === "function"
                    ? field.addDisabled(isFormikMode ? formik.values : {[field.name]: value})
                    : field.addDisabled
                }
                className="icon-btn"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {field.showEdit && (
          <Tooltip title="Edit">
            <span>
              <IconButton
                size="small"
                onClick={() => field.editClick?.(isFormikMode ? formik.values : {[field.name]: value})}
                disabled={
                  typeof field.editDisabled === "function"
                    ? field.editDisabled(isFormikMode ? formik.values : {[field.name]: value})
                    : field.editDisabled
                }
                className="icon-btn"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SmartField;