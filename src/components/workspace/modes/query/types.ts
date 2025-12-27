// Query Builder workspace types and interfaces

export interface QueryResult {
    columns: string[];
    rows: any[][];
    rowCount: number;
    executionTime: number;
}

export interface QueryError {
    message: string;
    line?: number;
    position?: number;
}

export interface SchemaTable {
    name: string;
    columns: SchemaColumn[];
    rowCount?: number;
}

export interface SchemaColumn {
    name: string;
    type: string;
    nullable: boolean;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
    defaultValue?: string;
}

export interface QueryHistory {
    id: string;
    query: string;
    timestamp: number;
    success: boolean;
    rowCount?: number;
    executionTime?: number;
}

export interface QueryBuilderState {
    query: string;
    result?: QueryResult;
    error?: QueryError;
    isExecuting: boolean;
    schema: SchemaTable[];
    history: QueryHistory[];
}
