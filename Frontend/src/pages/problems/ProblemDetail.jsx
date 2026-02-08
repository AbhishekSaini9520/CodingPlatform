import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { runCode, submitCode } from '../../api/submission.api';
import { getProblemById } from '../../api/problem.api';
import Tabs from '../../components/Tabs';
import TestPanel from '../../components/TestPanel';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Play, Send, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const ProblemDetail = () => {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('// Write your code here');
    const [language, setLanguage] = useState('javascript');
    const [activeLeftTab, setActiveLeftTab] = useState('description');
    const [runLoading, setRunLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                // console.log("data is computed")
                const data = await getProblemById(id);
                setProblem(data);
                // Set initial code if available
                if (data.startCode && data.startCode.length > 0) {
                    const jsCode = data.startCode.find(c => c.language === 'javascript');
                    if (jsCode) {
                        setCode(jsCode.initialCode);
                    } else {
                        setCode(data.startCode[0].initialCode);
                        setLanguage(data.startCode[0].language);
                    }
                }
            } catch (err) {
                setError(err.message || 'Failed to load problem');
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id]);

    const handleRun = async () => {
        setRunLoading(true);
        setRunResult(null); // Clear previous results
        try {
            // console.log(id, code, language)
            const result = await runCode(id, code, language);

            console.log("code is run successfully");
            console.log(result);

            // 🔥 Set run result as the array expected by TestPanel
            setRunResult(result);

            console.log("Run Result:", result);
        } catch (err) {
            console.error(err);
            // Handle error (maybe show in console area)
        } finally {
            setRunLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        setRunResult(null); // Clear previous results
        try {
            const result = await submitCode(id, code, language);
            setSubmitResult(result);

            // 🔥 Use the detailed results from submission to show in TestPanel
            if (result.testResults) {
                setRunResult(result.testResults);
            }

            console.log("Submit Result:", result);
            // alert(`Submission Status: ${result.status}`);
        } catch (err) {
            console.error(err);
            alert("Submission Failed: " + (err.message || "Unknown Error"));
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);

        // Update code with boilerplate for the new language
        if (problem && problem.startCode) {
            const codeSnippet = problem.startCode.find(c => c.language === newLanguage);
            if (codeSnippet) {
                setCode(codeSnippet.initialCode);
            } else {
                setCode('// No boilerplate available for this language');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="c++">C++</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleRun}
                        disabled={runLoading}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                        {runLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-500" />
                        ) : (
                            <Play className="w-4 h-4 mr-2 text-green-500" />
                        )}
                        {runLoading ? 'Running...' : 'Run'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitLoading}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-70"
                    >
                        {submitLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4 mr-2" />
                        )}
                        {submitLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel */}
                <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Tabs
                        tabs={[
                            { id: 'description', label: 'Description' },
                            { id: 'submissions', label: 'Submissions' }
                        ]}
                        activeTab={activeLeftTab}
                        onTabChange={setActiveLeftTab}
                    />
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeLeftTab === 'description' ? (
                            <>
                                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{problem.title}</h1>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${problem.difficulty === 'easy' ? 'text-green-500 bg-green-50 dark:bg-green-900/20' :
                                            problem.difficulty === 'medium' ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                                                'text-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                                <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                                    <ReactMarkdown>{problem.description}</ReactMarkdown>
                                </div>

                                {problem.visibleTestCases && problem.visibleTestCases.map((testCase, index) => (
                                    <div key={index} className="space-y-4 mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Example {index + 1}:</h3>
                                        <div className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 space-y-2">
                                            <div className="flex gap-2 text-base font-mono">
                                                <span className="font-bold text-gray-900 dark:text-white">Input:</span>
                                                <span className="text-gray-800 dark:text-gray-300">{testCase.input}</span>
                                            </div>
                                            <div className="flex gap-2 text-base font-mono">
                                                <span className="font-bold text-gray-900 dark:text-white">Output:</span>
                                                <span className="text-gray-800 dark:text-gray-300">{testCase.output}</span>
                                            </div>
                                            {testCase.explanation && (
                                                <div className="flex gap-2 text-base font-mono">
                                                    <span className="font-bold text-gray-900 dark:text-white">Explanation:</span>
                                                    <span className="text-gray-800 dark:text-gray-300">{testCase.explanation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400">
                                Submissions history will appear here.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
                    {/* Code Editor */}
                    <div className="flex-1 border-b border-gray-700">
                        <Editor
                            height="100%"
                            language={language === 'c++' ? 'cpp' : language}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Test Panel (Bottom) */}
                    <div className="h-1/3 min-h-[200px] bg-[#1e1e1e]">
                        <TestPanel
                            problem={problem}
                            runResult={runResult}
                            isRunning={runLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemDetail;
