import axiosInstance from "./axiosInstance";

export const getAllProblems = async () => {
    try {
        const response = await axiosInstance.get("/problem/getAllProblem");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to fetch problems";
    }
};

export const getProblemById = async (id) => {
    try {
        const response = await axiosInstance.get(`/problem/problemById/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to fetch problem details";
    }
};
