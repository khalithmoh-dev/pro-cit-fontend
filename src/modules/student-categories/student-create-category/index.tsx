import { useNavigate, useParams } from "react-router-dom";
import RenderFormbuilderForm from "../../../components/render-formbuilder-form";
import { useEffect, useState } from "react";
import useCategoriesStore, { createCategoryPayloadIF } from "../../../store/categoriesStore";

interface PropsIF {
  update?: boolean;
}

const StudentCreateCategoryPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { createCategory, updateCategory, getAllCategories, getCategory, category , loading} = useCategoriesStore();  




  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );



  useEffect(() => {
    if (!id) return;

    getCategory(id);
    const fetchCategory = async () => {
      if (category) {
        setSelectedDepartment(category?._id);

      }
    };

    fetchCategory();
  }, [id, getCategory]);

  

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);





  const onSubmit = async (values: createCategoryPayloadIF) => {  
    const updatedValues: any = {
      name: values.name,
      description: values?.description,
    };

    const res =
      id && update
        ? await updateCategory(updatedValues, id)
        : await createCategory(updatedValues);

    if (res) {
      navigate(-1);
    }
  };

  
  return (
    <RenderFormbuilderForm
      formName="Student Category Form"
      formHeader={`${update ? "Update" : "Create"} Student Category Form`}
      existingForm={update ? category : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      small
      dynamicOptions={[]}
      loading={loading}
    />
  );
};

export default StudentCreateCategoryPage;
