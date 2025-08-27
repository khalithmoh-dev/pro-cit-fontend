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
import Typography from '@mui/material/Typography'
import PageTitle from '../PageTitle';
import SectionHeader from '../SectionHeader'
import Label from '../Label';
import Button from '../../components/Button';
import FileUpload from '../../components/fileupload';
import { useFormik } from "formik";
import * as Yup from "yup";
import Textarea from '@mui/joy/Textarea';
import FormHelperText from '@mui/joy/FormHelperText';

/** The generic form component to generate form dynamically using a JSON
    The working json can be referred from institute config
    Yup validaion type etc can be handled from sample json
    props defnation:
      - pageTitle?: title of the page
      - schema: Json schema with inputs
      - onSubmit: onSubmit function
*/

const GenericMaster = ({ pageTitle, schema, onSubmit, oInitialValues }) => {
  // Build validation schema
const validationSchema = Yup.object(
  Object.values(schema.fields).flat().reduce((acc, field) => {
      if(field.isNullable){

      }else if (field.name && field.validation) {
        acc[field.name] = field.validation;
      }
    return acc;
  }, {})
);
console.log('from form',oInitialValues)
const formik = useFormik({
  initialValues: Object.values(schema.fields)
    .flat()
    .reduce((acc, field) => {
      if (oInitialValues && oInitialValues.hasOwnProperty(field.name)) {
        // Use value from oInitialValues if available
        acc[field.name] = oInitialValues[field.name];
      } else if(field.isNullable){
        acc[field.name] = null;
      } else if (field.isMulti || field.type === 'file') {
        acc[field.name] = [];
      } else if (field.type === "checkbox") {
        acc[field.name] = false;
      } else if (field.type === "number") {
        acc[field.name] = null;
      } else {
        acc[field.name] = "";
      }
      return acc;
    }, {}),
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
            helperText={formik.touched[field.name] && formik.errors[field.name]}
            disabled={field.isEdit}
          />
        );
       case "select":
          return (
            <FormControl fullWidth size="small">
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                multiple={field.isMulti}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                renderValue={(selected) =>
                  field.isMulti ? selected.join(", ") : selected
                }
              >
                {field.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {field.isMulti ? (
                      <Checkbox checked={formik.values[field.label]?.includes(opt.value)} />
                    ) : null}
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
          <FileUpload
            maxSize={field.size ? field.size : 1 * 1024 * 1024} // 50MB
            multiple={field.isMulti}
            accept={`${ field?.format ? field?.format + '/*': '*'}`}
            onFileSelect={([File] = [])=>{
                const newValue = [...formik.values[field.name]]
                newValue.push(File)
                formik.setFieldValue(field.name, newValue);
            }}
            onFileRemove={(index)=>{
                const newValue = [...formik.values[field.name]]
                newValue.splice(index)
                formik.setFieldValue(field.name, newValue);
            }}
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
            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            helperText={formik.touched[field.name] && formik.errors[field.name]}
          />
          {formik.touched[field.name] && Boolean(formik.errors[field.name]) && <FormHelperText className="error-text">{formik.errors[field.name]}</FormHelperText>}
        </>
      );
      default:
        return null;
    }
  };

  return (
    <div className="p-3">
      {/* Page Header */}
      {pageTitle && <PageTitle title={pageTitle}/>}

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="w-75 mx-auto" onReset={formik.handleReset}>
        {Object.entries(schema.fields).map(([sectionName, fields]) => (
          <Box key={sectionName} mb={4}>
            {/* Section Heading */}
            <SectionHeader sectionName={sectionName} />

            <div className="row">
             {fields.map((field, index) => {
              const shouldShow =
                !field.showWhen ||
                formik.values[field.showWhen.field] === field.showWhen.value;

              if (!shouldShow) return null;

              return (
                <div className="col-12 col-md-6 p-2" key={index}>
                  {!field.removeHeader && (
                    <Label labelName={field.label} required={field.isRequired} />
                  )}
                  {renderField(field)}
                </div>
              );
            })}
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
      type={btn.type ?? 'button'}
      variantType={
        btn.type === "submit"
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
