import axiosInstance from './axiosInstance';

export const runCode = async (problemId, code, language) => {
    try {
        const response = await axiosInstance.post(`/submission/run/${problemId}`, {
            code,
            language
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Failed to run code';
    }
};

export const submitCode = async (problemId, code, language) => {
    try {
        const response = await axiosInstance.post(`/submission/submit/${problemId}`, {
            code,
            language
        });
        return response.data; // Returns submittedResult object
    } catch (error) {
        throw error.response?.data || 'Failed to submit code';
    }
};
