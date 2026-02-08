const BASE_URL = "http://localhost:4000";

export const runCode = async (problemId, code, language) => {
    try {
        const token = localStorage.getItem("token");
        // console.log(token);
        // console.log(problemId);
        // console.log(code);
        // console.log(language);

        const response = await fetch(
            `${BASE_URL}/submission/run/${problemId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language,
                    code,
                }),
            }
        );
        // console.log(response);


        if (!response.ok) {
            const errorData = await response.json();
            throw errorData || "Failed to run code";
        }

        const data = await response.json();

        console.log("API RESPONSE FULL:", response);
        console.log("TYPE:", typeof response);
        console.log("IS ARRAY:", Array.isArray(response));
        return data;

    } catch (error) {
        console.error("RUN CODE ERROR:", error);
        throw error;
    }
};

export const submitCode = async (problemId, code, language) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${BASE_URL}/submission/submit/${problemId}`,
            {
                method: "POST",
                body: JSON.stringify({
                    language,
                    code,
                }),
                credentials: "include",
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData || "Failed to submit code";
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("SUBMIT CODE ERROR:", error);
        throw error;
    }
};
