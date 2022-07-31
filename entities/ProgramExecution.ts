export interface ProgramExecution {
    isRunning: boolean;
    currentNode: number;
    variables: Object;
    output: string[]
}