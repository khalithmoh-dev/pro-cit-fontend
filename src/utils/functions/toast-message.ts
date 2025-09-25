const createSuccessMessage = (name: string): string => {
  return `${name} Created Successfully`;
};
const updateSuccessMessage = (name: string): string => {
  return `${name} Updated Successfully`;
};
const deleteSuccessMessage = (name: string): string => {
  return `${name} Delete Successfully`;
};

const createErrorMessage = (name: string): string => {
  return `Failed to Create ${name}`;
};
const updateErrorMessage = (name?: string): string => {
  return `Failed to Update ${name ?? ""}`;
};
const deleteErrorMessage = (name: string): string => {
  return `Failed to Delete ${name}`;
};
export {
  createSuccessMessage,
  updateSuccessMessage,
  deleteSuccessMessage,
  createErrorMessage,
  updateErrorMessage,
  deleteErrorMessage,
};
