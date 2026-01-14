interface FileTreeProps {
    files: string[];
    activeFile: string;
    onFileSelect: (filename: string) => void;
}

export default function FileTree({ files, activeFile, onFileSelect }: FileTreeProps) {
    return (
        <div className="w-full lg:w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-400 mb-2">FILES</h2>
                <div className="space-y-1">
                    {files.map((filename) => (
                        <button
                            key={filename}
                            onClick={() => onFileSelect(filename)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors truncate ${activeFile === filename
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            title={filename}
                        >
                            {filename}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
