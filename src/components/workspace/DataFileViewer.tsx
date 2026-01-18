"use client"

import { useMemo } from "react"
import { Table, FileJson, FileSpreadsheet } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataFileViewerProps {
    content: string
    extension: string
    className?: string
}

// Parse CSV content into 2D array
const parseCSV = (content: string): string[][] => {
    const lines = content.trim().split('\n')
    return lines.map(line => {
        const cells: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
            const char = line[i]
            if (char === '"') {
                inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
                cells.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }
        cells.push(current.trim())
        return cells
    })
}

// Format JSON with proper indentation
const formatJSON = (content: string): string => {
    try {
        const parsed = JSON.parse(content)
        return JSON.stringify(parsed, null, 2)
    } catch {
        return content
    }
}

export function DataFileViewer({ content, extension, className }: DataFileViewerProps) {
    const isCSV = ['csv', 'tsv'].includes(extension.toLowerCase())
    const isJSON = extension.toLowerCase() === 'json'

    const csvData = useMemo(() => {
        if (!isCSV) return []
        return parseCSV(content)
    }, [content, isCSV])

    const formattedJSON = useMemo(() => {
        if (!isJSON) return ''
        return formatJSON(content)
    }, [content, isJSON])

    if (isCSV && csvData.length > 0) {
        const headers = csvData[0]
        const rows = csvData.slice(1)

        return (
            <div className={cn("h-full flex flex-col bg-[#1e1e1e] text-gray-200", className)}>
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800/50">
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-mono text-gray-400">
                        Data Preview ({rows.length} rows, {headers.length} columns)
                    </span>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full text-xs font-mono">
                        <thead className="bg-gray-800 sticky top-0">
                            <tr>
                                <th className="px-3 py-2 text-left text-gray-400 border-r border-gray-700">#</th>
                                {headers.map((header, i) => (
                                    <th
                                        key={i}
                                        className="px-3 py-2 text-left text-gray-200 border-r border-gray-700 font-medium"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={cn(
                                        "border-b border-gray-800",
                                        rowIndex % 2 === 0 ? "bg-gray-900/50" : "bg-gray-900/30"
                                    )}
                                >
                                    <td className="px-3 py-1.5 text-gray-500 border-r border-gray-800">
                                        {rowIndex + 1}
                                    </td>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-3 py-1.5 text-gray-300 border-r border-gray-800 max-w-xs truncate"
                                            title={cell}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    if (isJSON) {
        return (
            <div className={cn("h-full flex flex-col bg-[#1e1e1e] text-gray-200", className)}>
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800/50">
                    <FileJson className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-mono text-gray-400">JSON Preview</span>
                </div>

                {/* JSON content */}
                <pre className="flex-1 overflow-auto p-4 text-xs font-mono whitespace-pre-wrap">
                    {formattedJSON}
                </pre>
            </div>
        )
    }

    // Fallback for other data files
    return (
        <div className={cn("h-full flex flex-col bg-[#1e1e1e] text-gray-200", className)}>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800/50">
                <Table className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-mono text-gray-400">Data File</span>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs font-mono whitespace-pre-wrap">
                {content}
            </pre>
        </div>
    )
}

export default DataFileViewer
