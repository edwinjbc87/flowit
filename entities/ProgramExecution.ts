export interface ProgramExecution {
    isRunning: boolean;
    currentNode: number;
    variables: Map<string, any>;
    output: string[]
}