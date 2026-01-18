import { useState, useCallback } from 'react';
import { Search, X, ArrowDown, ArrowUp, Replace } from 'lucide-react';

interface CodeSearchProps {
    editorRef: React.MutableRefObject<any>;
    onClose: () => void;
}

export default function CodeSearch({ editorRef, onClose }: CodeSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [showReplace, setShowReplace] = useState(false);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [wholeWord, setWholeWord] = useState(false);
    const [useRegex, setUseRegex] = useState(false);
    const [matchCount, setMatchCount] = useState(0);
    const [currentMatch, setCurrentMatch] = useState(0);

    const performSearch = useCallback(() => {
        if (!editorRef.current || !searchTerm) return;

        const editor = editorRef.current;
        const model = editor.getModel();

        if (!model) return;

        const matches = model.findMatches(
            searchTerm,
            true, // searchOnlyEditableRange
            useRegex,
            caseSensitive,
            wholeWord ? searchTerm : null,
            true // captureMatches
        );

        setMatchCount(matches.length);

        if (matches.length > 0) {
            // Highlight first match
            editor.setSelection(matches[0].range);
            editor.revealRangeInCenter(matches[0].range);
            setCurrentMatch(1);
        }
    }, [editorRef, searchTerm, caseSensitive, wholeWord, useRegex]);

    const findNext = useCallback(() => {
        if (!editorRef.current || !searchTerm) return;

        const editor = editorRef.current;
        const action = editor.getAction('actions.find');
        if (action) {
            action.run();
        }
    }, [editorRef, searchTerm]);

    const findPrevious = useCallback(() => {
        if (!editorRef.current || !searchTerm) return;

        const editor = editorRef.current;
        const action = editor.getAction('actions.findPrevious');
        if (action) {
            action.run();
        }
    }, [editorRef, searchTerm]);

    const replaceOne = useCallback(() => {
        if (!editorRef.current || !searchTerm) return;

        const editor = editorRef.current;
        const selection = editor.getSelection();

        if (selection) {
            editor.executeEdits('replace', [{
                range: selection,
                text: replaceTerm,
            }]);
            findNext();
        }
    }, [editorRef, searchTerm, replaceTerm, findNext]);

    const replaceAll = useCallback(() => {
        if (!editorRef.current || !searchTerm) return;

        const editor = editorRef.current;
        const model = editor.getModel();

        if (!model) return;

        const matches = model.findMatches(
            searchTerm,
            true,
            useRegex,
            caseSensitive,
            wholeWord ? searchTerm : null,
            true
        );

        const edits = matches.map(match => ({
            range: match.range,
            text: replaceTerm,
        }));

        editor.executeEdits('replace-all', edits);
        setMatchCount(0);
        setCurrentMatch(0);
    }, [editorRef, searchTerm, replaceTerm, caseSensitive, wholeWord, useRegex]);

    return (
        <div className="absolute top-0 right-0 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 m-4 min-w-[320px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">Find & Replace</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                    <X className="h-4 w-4 text-gray-400" />
                </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.shiftKey ? findPrevious() : findNext();
                            }
                        }}
                        placeholder="Search..."
                        className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    <button
                        onClick={findPrevious}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Previous (Shift+Enter)"
                    >
                        <ArrowUp className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                        onClick={findNext}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Next (Enter)"
                    >
                        <ArrowDown className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => setShowReplace(!showReplace)}
                        className={`p-1.5 rounded transition-colors ${showReplace ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400'
                            }`}
                        title="Toggle Replace"
                    >
                        <Replace className="h-4 w-4" />
                    </button>
                </div>

                {/* Replace Input */}
                {showReplace && (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={replaceTerm}
                            onChange={(e) => setReplaceTerm(e.target.value)}
                            placeholder="Replace with..."
                            className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={replaceOne}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                        >
                            Replace
                        </button>
                        <button
                            onClick={replaceAll}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors"
                        >
                            All
                        </button>
                    </div>
                )}

                {/* Options */}
                <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-gray-200">
                        <input
                            type="checkbox"
                            checked={caseSensitive}
                            onChange={(e) => setCaseSensitive(e.target.checked)}
                            className="rounded"
                        />
                        <span>Aa</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-gray-200">
                        <input
                            type="checkbox"
                            checked={wholeWord}
                            onChange={(e) => setWholeWord(e.target.checked)}
                            className="rounded"
                        />
                        <span>Whole Word</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-gray-200">
                        <input
                            type="checkbox"
                            checked={useRegex}
                            onChange={(e) => setUseRegex(e.target.checked)}
                            className="rounded"
                        />
                        <span>.*</span>
                    </label>
                    {matchCount > 0 && (
                        <span className="ml-auto text-gray-500">
                            {currentMatch}/{matchCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
