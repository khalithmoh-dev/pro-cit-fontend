// src/screens/CreateDegree/GenericMaster.jsx
import React from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import PageTitle from '../PageTitle';
import SectionHeader from '../SectionHeader'
import Label from '../Label';
import Button from '../../components/Button';
import { useFormik } from "formik";
import * as Yup from "yup";

const GenericMaster = ({ pageTitle, schema, onSubmit, onCancel }) => {
  // Build validation schema
  const validationSchema = Yup.object(
    Object.values(schema.fields).flat().reduce((acc, field) => {
      if (field.validation) {
        acc[field.name] = field.validation;
      }
      return acc;
    }, {})
  );

  const formik = useFormik({
    initialValues: Object.values(schema.fields).flat().reduce((acc, field) => {
      acc[field.name] = field.type === "checkbox" ? false : "";
      return acc;
    }, {}),
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    onReset: () => {
      console.log("Form reset");
    },
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
            helperText={formik.touched[field.name] && formik.errors[field.name]}
            disabled={field.isEdit}
          />
        );
      case "select":
        return (
          <FormControl fullWidth size="small">
            <Select
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select {field.label}</em>
              </MenuItem>
              {field.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
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
      case "file":
        return (
          <Button variant="contained" component="label" color="secondary">
            {field.label}
            <input
              type="file"
              hidden
              name={field.name}
              onChange={(e) => {
                formik.setFieldValue(field.name, e.currentTarget.files[0]);
              }}
            />
          </Button>
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                name={field.name}
                checked={formik.values[field.name]}
                onChange={formik.handleChange}
              />
            }
            label={field.label}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-3">
      {/* Page Header */}
      <PageTitle title={pageTitle}/>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="w-75 mx-auto" onReset={formik.handleReset}>
        {Object.entries(schema.fields).map(([sectionName, fields]) => (
          <Box key={sectionName} mb={4}>
            {/* Section Heading */}
            <SectionHeader sectionName={sectionName} />

            <div className="row">
              {fields.map((field, index) => (
                <div className="col-12 col-md-6 p-2" key={index}>
                  {/* Field Label */}
                  <Label labelName={field.label} required={field.isRequired} />
                  {/* Field Input */}
                  {renderField(field)}
                </div>
              ))}
            </div>

          </Box>
        ))}

        {/* Buttons */}
   <Box 
  display="flex" 
  justifyContent="flex-end" 
  gap={2} 
  mt={4}
>
  {schema.buttons.map((btn, idx) => (
    <Button
      key={idx}
      color={btn.color}
      size={btn.size || "medium"}
      onClick={btn.onClick}
      variantType={
        btn.name === "Save"
          ? "submit"
          : btn.name === "Reset"
          ? "reset" : btn.name === "Cancel" ? "cancel"
          : "button"
      }
    >
      {btn.name}
    </Button>
  ))}
</Box>


      </form>
    </div>
  );
};


export default GenericMaster;
