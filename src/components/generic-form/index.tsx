// src/screens/CreateDegree/GenericMaster.jsx
import React, {useState, useEffect} from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Typography from '@mui/material/Typography'
import PageTitle from '../PageTitle';
import SectionHeader from '../SectionHeader'
import Label from '../Label';
import Switch from '../switch'
import Button from '../../components/Button';
import FileUpload from '../../components/fileupload';
import { useFormik } from "formik";
import * as Yup from "yup";
import Textarea from '@mui/joy/Textarea';
import FormHelperText from '@mui/joy/FormHelperText';
import useInstituteStore from "../../store/instituteStore";
import useAuthStore from '../../store/authStore'

/** The generic form component to generate form dynamically using a JSON
    The working json can be referred from institute config
    Yup validaion type etc can be handled from sample json
    props defnation:
      - pageTitle?: title of the page
      - schema: Json schema with inputs
      - onSubmit: onSubmit function
*/

const GenericMaster = ({ pageTitle, schema, onSubmit, isEditPerm= false ,oInitialValues }) => {
  const [editPerm, setEditPerm] = useState(false);
  const [instDtls, setInstDtls] = useState({_id: '', insname: ''});
  const instituteStore = useInstituteStore();
  const authStore = useAuthStore();

  
  useEffect(()=>{
      if(authStore?.user && instituteStore.getInstitute){
        (async()=>{
          const oInstituteDtls = await instituteStore.getLogInIns();
          if(oInstituteDtls && Object.keys(oInstituteDtls).length){
            setInstDtls(oInstituteDtls);
          }
        })();
      }
    },[authStore,instituteStore]);

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
const formik = useFormik({
  initialValues: Object.values(schema.fields)
    .flat()
    .reduce((acc, field) => {
      if(field.name === "insId" && instDtls?._id && instDtls?.insname){
        acc[field.name] = instDtls?._id;
      }else if (oInitialValues && oInitialValues.hasOwnProperty(field.name)) {
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
            disabled={!editPerm || field.isDisabled}
          />
        );
      case "select":
        const labelKey = field.labelKey || "label";
        const valueKey = field.valueKey || "value";
        const options =
          field.name === "insId"
            ? [{ [valueKey]: instDtls._id, [labelKey]: instDtls.insname }]
            : field.options || [];

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
            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            helperText={formik.touched[field.name] && formik.errors[field.name]}
            disabled={!editPerm || field.isDisabled}
          />
          {formik.touched[field.name] && Boolean(formik.errors[field.name]) && <FormHelperText className="error-text">{formik.errors[field.name]}</FormHelperText>}
        </>
      );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Page Header */}
      {pageTitle && 
        <div className="d-flex justify-content-between mb-3">
          <PageTitle title={pageTitle}/>
          {isEditPerm && (
            <div className="mt-3 mx-3" >
              <Switch defaultChecked={false} onChange={() => setEditPerm(!editPerm)} label="Edit mode"/>
            </div>
          )}
        </div>
      }

      {/* White Card Wrapper */}
        <form
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
        >
          {Object.entries(schema.fields).map(([sectionName, fields]) => (
            <Box key={sectionName} mb={4}>
              {/* Section Heading */}
      <div className="generic-master-card">
              <SectionHeader sectionName={sectionName} />
              <div className="row">
                {(fields ?? []).map((field, index) => {
                  const shouldShow =
                    !field.showWhen ||
                    formik.values[field.showWhen.field] === field.showWhen.value;

                  if (!shouldShow) return null;

                  return (
                    <div className="col-12 col-md-4 p-2" key={index}>
                      {!field.removeHeader && (
                        <Label labelName={field.label} required={field.isRequired}/>
                      )}
                      {renderField(field)}
                    </div>
                  );
                })}
              </div>
              </div>
            </Box>
          ))}

          {/* Buttons */}
          <div className="generic-form-footer">
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            {schema.buttons.map((btn, idx) => (
              <Button
                key={idx}
                color={btn.color}
                size={btn.size || "medium"}
                onClick={btn.onClick}
                type={btn.type ?? 'button'}
                disabled={btn.isDisabled || (btn.name !== "Cancel" && (!editPerm || btn.isDisabled))}
                variantType={
                  btn.type === "submit"
                    ? "submit"
                    : btn.name === "Reset"
                    ? "reset"
                    : btn.name === "Cancel"
                    ? "cancel"
                    : "button"
                }
              >
                {btn.name}
              </Button>
            ))}
          </Box>
          </div>
        </form>
    </div>
  );
};


export default GenericMaster;
