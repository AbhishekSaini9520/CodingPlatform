import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProblemById } from '../../api/problem.api';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Play, Send, RotateCcw } from 'lucide-react';

const ProblemDetail = () => {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('// Write your code here');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
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

    const handleRun = () => {
        // TODO: Implement run logic
        setOutput('Running code... (Not implemented yet)');
    };

    const handleSubmit = () => {
        // TODO: Implement submit logic
        setOutput('Submitting code... (Not implemented yet)');
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
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleRun}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        <Play className="w-4 h-4 mr-2 text-green-500" />
                        Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Problem Description (Left Panel) */}
                <div className="w-1/2 overflow-y-auto p-6 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{problem.title}</h1>
                    <div className="flex items-center gap-2 mb-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${problem.difficulty === 'easy' ? 'text-green-500 bg-green-50 dark:bg-green-900/20' :
                                problem.difficulty === 'medium' ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                                    'text-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                            {problem.difficulty}
                        </span>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                    </div>

                    {/* Examples */}
                    <div className="mt-8 space-y-4">
                        {problem.visibleTestCases && problem.visibleTestCases.map((testCase, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Example {index + 1}:</h3>
                                <div className="space-y-2 text-sm font-mono">
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Input:</span>
                                        <span className="text-gray-900 dark:text-gray-200 ml-2">{testCase.input}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Output:</span>
                                        <span className="text-gray-900 dark:text-gray-200 ml-2">{testCase.output}</span>
                                    </div>
                                    {testCase.explanation && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Explanation:</span>
                                            <span className="text-gray-900 dark:text-gray-200 ml-2">{testCase.explanation}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Code Editor & Console (Right Panel) */}
                <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={language}
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

                    {/* Console/Output */}
                    <div className="h-1/3 border-t border-gray-700 bg-[#1e1e1e] flex flex-col">
                        <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center bg-[#252526]">
                            <span className="text-sm font-medium text-gray-300">Console</span>
                            <button
                                onClick={() => setOutput(null)}
                                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                                title="Clear Console"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                        <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                            {output ? (
                                <pre className="text-gray-300">{output}</pre>
                            ) : (
                                <div className="text-gray-500 italic">Run your code to see output here</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemDetail;
