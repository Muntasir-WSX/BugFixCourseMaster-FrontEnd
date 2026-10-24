import api from "./api";

export const getCourses = (params = {}) => {
  // Clean up undefined, null, or empty string params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
  );

  return api.get("/courses", { params: cleanParams });
};

export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};