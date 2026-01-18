import { useState } from 'react';
import {
    FileCode,
    FileJson,
    FileText,
    File,
    ChevronRight,
    ChevronDown,
    Circle,
    Folder,
    FolderOpen
} from 'lucide-react';

interface FileNode {
    name: string;
    type?: string;
    nodeType?: string;
    content?: string;
    modified?: boolean;
    children?: FileNode[]; // Backend returns nested children
    status?: string;
    intent?: string;
}

interface MonacoFileTreeProps {
    files: FileNode[];
    activeFile: string | null;
    onFileSelect: (fileName: string) => void;
    modifiedFiles?: Set<string>;
}

export default function MonacoFileTree({
    files,
    activeFile,
    onFileSelect,
    modifiedFiles = new Set()
}: MonacoFileTreeProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();

        switch (ext) {
            case 'json':
                return <FileJson className="h-4 w-4 text-yellow-500" />;
            case 'md':
            case 'txt':
                return <FileText className="h-4 w-4 text-blue-400" />;
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
            case 'py':
            case 'rs':
            case 'go':
            case 'java':
                return <FileCode className="h-4 w-4 text-green-500" />;
            default:
                return <File className="h-4 w-4 text-gray-400" />;
        }
    };

    // Flatten nested file structure from backend
    const flattenFiles = (nodes: FileNode[], parentPath: string = ''): FileNode[] => {
        const result: FileNode[] = [];
        nodes.forEach(node => {
            const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
            // If node has children, it's a folder - add children with full path
            if (node.children && node.children.length > 0) {
                result.push(...flattenFiles(node.children, fullPath));
            } else {
                // It's a file - add with full path
                result.push({ ...node, name: fullPath });
            }
        });
        return result;
    };

    // Group files by directory
    const organizeFiles = () => {
        const tree: Record<string, FileNode[]> = { root: [] };

        // Flatten nested structure first
        const flatFiles = flattenFiles(files);

        flatFiles.forEach(file => {
            const parts = file.name.split('/');
            if (parts.length === 1) {
                tree.root.push(file);
            } else {
                const folder = parts.slice(0, -1).join('/');
                if (!tree[folder]) {
                    tree[folder] = [];
                }
                tree[folder].push(file);
            }
        });

        return tree;
    };

    const toggleFolder = (folder: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folder)) {
                next.delete(folder);
            } else {
                next.add(folder);
            }
            return next;
        });
    };

    const fileTree = organizeFiles();
    const folders = Object.keys(fileTree).filter(f => f !== 'root');

    return (
        <div className="h-full overflow-y-auto bg-gray-900 text-gray-100 p-2">
            <div className="mb-2 px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Files
            </div>

            <div className="space-y-0.5">
                {/* Root level files */}
                {fileTree.root?.map(file => (
                    <button
                        key={file.name}
                        onClick={() => onFileSelect(file.name)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${activeFile === file.name
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-800 text-gray-300'
                            }`}
                    >
                        {getFileIcon(file.name)}
                        <span className="flex-1 text-left truncate">{file.name}</span>
                        {modifiedFiles.has(file.name) && (
                            <Circle className="h-2 w-2 fill-blue-400 text-blue-400" />
                        )}
                    </button>
                ))}

                {/* Folders */}
                {folders.map(folder => {
                    const isExpanded = expandedFolders.has(folder);
                    const folderFiles = fileTree[folder] || [];

                    return (
                        <div key={folder}>
                            <button
                                onClick={() => toggleFolder(folder)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-gray-800 text-gray-300"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                                {isExpanded ? (
                                    <FolderOpen className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <Folder className="h-4 w-4 text-yellow-500" />
                                )}
                                <span className="flex-1 text-left truncate">{folder}</span>
                            </button>

                            {isExpanded && (
                                <div className="ml-4 space-y-0.5">
                                    {folderFiles.map(file => (
                                        <button
                                            key={file.name}
                                            onClick={() => onFileSelect(file.name)}
                                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${activeFile === file.name
                                                ? 'bg-blue-600 text-white'
                                                : 'hover:bg-gray-800 text-gray-300'
                                                }`}
                                        >
                                            {getFileIcon(file.name)}
                                            <span className="flex-1 text-left truncate">
                                                {file.name.split('/').pop()}
                                            </span>
                                            {modifiedFiles.has(file.name) && (
                                                <Circle className="h-2 w-2 fill-blue-400 text-blue-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {files.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
                    <File className="h-8 w-8 mb-2 opacity-50" />
                    <p>No files</p>
                </div>
            )}
        </div>
    );
}
