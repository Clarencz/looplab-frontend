export interface AlgorithmTestCase {
    input: any
    expectedOutput: any
    description?: string
}

export interface AlgorithmProject {
    testCases: AlgorithmTestCase[]
    timeComplexity?: string
    spaceComplexity?: string
}
