import { useState } from "react";
import axiosInstance from '../../api/axiosInstance';

function CreateProblem({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: "Array",
    visibleTestCases: [
      { input: "", output: "", explanation: "" }
    ],
    hiddenTestCases: [
      { input: "", output: "" }
    ],
    startCode: [
      { language: "c++", initialCode: "" }
    ],
    referenceSolution: [
      { language: "c++", completeSolution: "" }
    ],
    problemCreator: "68d6d5c5bc03f2d762f8c243" // replace dynamically later
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVisibleChange = (index, field, value) => {
    const updated = [...formData.visibleTestCases];
    updated[index][field] = value;
    setFormData({ ...formData, visibleTestCases: updated });
  };

  const handleHiddenChange = (index, field, value) => {
    const updated = [...formData.hiddenTestCases];
    updated[index][field] = value;
    setFormData({ ...formData, hiddenTestCases: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Submitting:", formData);

      await axiosInstance.post("/problem/create", formData);

      setSuccess("Problem created successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to create problem"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] w-[90%] max-h-[90vh] overflow-y-auto rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Create Problem</h2>

        {error && <p className="text-red-400">{error}</p>}
        {success && <p className="text-green-400">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <select
            name="difficulty"
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            name="tags"
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="Array">Array</option>
            <option value="LinkList">Linked List</option>
            <option value="Graph">Graph</option>
            <option value="DP">Dynamic Programming</option>
            <option value="Math">Math</option>
          </select>

          <h3 className="text-lg text-white mt-4">Visible Test Case</h3>

          <textarea
            placeholder="Input"
            onChange={(e) =>
              handleVisibleChange(0, "input", e.target.value)
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <textarea
            placeholder="Output"
            onChange={(e) =>
              handleVisibleChange(0, "output", e.target.value)
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <textarea
            placeholder="Explanation"
            onChange={(e) =>
              handleVisibleChange(0, "explanation", e.target.value)
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <h3 className="text-lg text-white mt-4">Hidden Test Case</h3>

          <textarea
            placeholder="Input"
            onChange={(e) =>
              handleHiddenChange(0, "input", e.target.value)
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <textarea
            placeholder="Output"
            onChange={(e) =>
              handleHiddenChange(0, "output", e.target.value)
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <h3 className="text-lg text-white mt-4">Start Code (C++)</h3>

          <textarea
            placeholder="Initial Code"
            onChange={(e) =>
              setFormData({
                ...formData,
                startCode: [
                  { language: "c++", initialCode: e.target.value }
                ]
              })
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <h3 className="text-lg text-white mt-4">Reference Solution (C++)</h3>

          <textarea
            placeholder="Complete Solution"
            onChange={(e) =>
              setFormData({
                ...formData,
                referenceSolution: [
                  { language: "c++", completeSolution: e.target.value }
                ]
              })
            }
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Create Problem"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateProblem;