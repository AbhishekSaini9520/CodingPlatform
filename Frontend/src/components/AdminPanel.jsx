import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router';
import { useState } from 'react';

// Zod schema matching the problem schema
const problemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'linkedList', 'graph', 'dp', 'math']),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required'),
            explanation: z.string().min(1, 'Explanation is required')
        })
    ).min(1, 'At least one visible test case required'),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    ).min(1, 'At least one hidden test case required'),
    startCode: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            initialCode: z.string().min(1, 'Initial code is required')
        })
    ).length(3, 'All three languages required'),
    referenceSolution: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            completeCode: z.string().min(1, 'Complete code is required')
        })
    ).length(3, 'All three languages required')
});

function AdminPanel() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const { register, control, handleSubmit, formState: { errors } } =
        useForm({
            resolver: zodResolver(problemSchema),
            defaultValues: {
                startCode: [
                    { language: 'C++', initialCode: '' },
                    { language: 'Java', initialCode: '' },
                    { language: 'JavaScript', initialCode: '' },
                    { language: 'Python', initialCode: '' }
                ],
                referenceSolution: [
                    { language: 'C++', completeCode: '' },
                    { language: 'Java', completeCode: '' },
                    { language: 'JavaScript', completeCode: '' },
                    { language: 'Python', initialCode: '' }
                ]
            }
        });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({
        control,
        name: 'visibleTestCases'
    });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
    } = useFieldArray({
        control,
        name: 'hiddenTestCases'
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            console.log('Submitting problem data:', data);
            const response = await axiosInstance.post('/problem/create', data);
            console.log('Problem created successfully:', response.data);
            setSubmitSuccess(true);
            alert('Problem created successfully!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Error creating problem:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to create problem';
            setSubmitError(errorMessage);
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Alert */}
                {submitError && (
                    <div className="alert alert-error shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{submitError}</span>
                        </div>
                    </div>
                )}

                {/* Success Alert */}
                {submitSuccess && (
                    <div className="alert alert-success shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Problem created successfully!</span>
                        </div>
                    </div>
                )}

                {/* Basic Information */}
                <div className="card bg-base-100 shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                {...register('title')}
                                className={`input input-bordered ${errors.title && 'input-error'}`}
                            />
                            {errors.title && (
                                <span className="text-error">{errors.title.message}</span>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                {...register('description')}
                                className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
                            />
                            {errors.description && (
                                <span className="text-error">{errors.description.message}</span>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <div className="form-control w-1/2">
                                <label className="label">
                                    <span className="label-text">Difficulty</span>
                                </label>
                                <select
                                    {...register('difficulty')}
                                    className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            <div className="form-control w-1/2">
                                <label className="label">
                                    <span className="label-text">Tag</span>
                                </label>
                                <select
                                    {...register('tags')}
                                    className={`select select-bordered ${errors.tags && 'select-error'}`}
                                >
                                    <option value="array">Array</option>
                                    <option value="linkedList">Linked List</option>
                                    <option value="graph">Graph</option>
                                    <option value="dp">DP</option>
                                    <option value="math">Math</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Cases */}
                <div className="card bg-base-100 shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

                    {/* Visible Test Cases */}
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium">Visible Test Cases</h3>
                            <button
                                type="button"
                                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                                className="btn btn-sm btn-primary"
                            >
                                Add Visible Case
                            </button>
                        </div>

                        {visibleFields.map((field, index) => (
                            <div key={field.id} className="border p-4 rounded-lg space-y-2">
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeVisible(index)}
                                        className="btn btn-xs btn-error"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Input (use Enter for new line)</span>
                                    </label>
                                    <textarea
                                        {...register(`visibleTestCases.${index}.input`)}
                                        placeholder="Example: 4&#10;1 2 3 4"
                                        className="textarea textarea-bordered w-full font-mono"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Output</span>
                                    </label>
                                    <textarea
                                        {...register(`visibleTestCases.${index}.output`)}
                                        placeholder="Expected output"
                                        className="textarea textarea-bordered w-full font-mono"
                                        rows={2}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Explanation</span>
                                    </label>
                                    <textarea
                                        {...register(`visibleTestCases.${index}.explanation`)}
                                        placeholder="Explanation"
                                        className="textarea textarea-bordered w-full"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hidden Test Cases */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium">Hidden Test Cases</h3>
                            <button
                                type="button"
                                onClick={() => appendHidden({ input: '', output: '' })}
                                className="btn btn-sm btn-primary"
                            >
                                Add Hidden Case
                            </button>
                        </div>

                        {hiddenFields.map((field, index) => (
                            <div key={field.id} className="border p-4 rounded-lg space-y-2">
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeHidden(index)}
                                        className="btn btn-xs btn-error"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Input (use Enter for new line)</span>
                                    </label>
                                    <textarea
                                        {...register(`hiddenTestCases.${index}.input`)}
                                        placeholder="Example: 4&#10;1 2 3 4"
                                        className="textarea textarea-bordered w-full font-mono"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Output</span>
                                    </label>
                                    <textarea
                                        {...register(`hiddenTestCases.${index}.output`)}
                                        placeholder="Expected output"
                                        className="textarea textarea-bordered w-full font-mono"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Code Templates */}
                <div className="card bg-base-100 shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Code Templates</h2>

                    <div className="space-y-6">
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="space-y-2">
                                <h3 className="font-medium">
                                    {index === 0 ? 'C++' : index === 1 ? 'Java' : index === 2 ? 'JavaScript' : 'Python'}
                                </h3>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Initial Code</span>
                                    </label>
                                    <pre className="bg-base-300 p-4 rounded-lg">
                                        <textarea
                                            {...register(`startCode.${index}.initialCode`)}
                                            className="w-full bg-transparent font-mono"
                                            rows={6}
                                        />
                                    </pre>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Reference Solution</span>
                                    </label>
                                    <pre className="bg-base-300 p-4 rounded-lg">
                                        <textarea
                                            {...register(`referenceSolution.${index}.completeCode`)}
                                            className="w-full bg-transparent font-mono"
                                            rows={6}
                                        />
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Problem...' : 'Create Problem'}
                </button>
            </form>
        </div>
    );
}

export default AdminPanel;