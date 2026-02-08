import Editor from '@monaco-editor/react';

const CodeEditorSection = ({ language, code, setCode }) => {
    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
            <div className="flex-1">
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
                        padding: { top: 10 }
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditorSection;
