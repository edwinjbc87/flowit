import { BaseOperationSchema, OperationType } from '@/entities/BaseOperationSchema';
import { ConditionOperationSchema } from '@/entities/ConditionOperationSchema';
import { Diagram } from '@/entities/Diagram';
import { LoopOperationSchema } from '@/entities/LoopOperationSchema';
import { NodeConnectionType } from '@/entities/NodeConnection';
import { ProgramExecution } from '@/entities/ProgramExecution';
import { ProgramSchema } from '@/entities/ProgramSchema';
import { Project } from '@/entities/Project';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface ProgramState {
    diagram: Diagram;
    project: Project;
    currentModuleIndex: number;
    execution: ProgramExecution;
    program: ProgramSchema;
}

const initialState: ProgramState = {
    diagram: {
        nodes: [],
        connections: [],
        dimension: {width: 0, height: 0}
    },
    project: {
        main: '',
        modules: [],
    },
    currentModuleIndex: 0,
    execution: {
        isRunning: false,
        currentNode: 0,
        variables: {},
        output: [],
    },
    program: {
        main: '',
        modules: [],
    }
}

const findOperation = (id: string, scope:BaseOperationSchema[]) => {
    for(const operation of scope) {
        if(String(operation.id) === id) {
            return operation
        } else if(operation.type == OperationType.Loop) {
            const found = findOperation(id, (operation as LoopOperationSchema).operations)
            if(found) {
                return found
            }
        } else if(operation.type == OperationType.Condition) {
            let found = findOperation(id, (operation as ConditionOperationSchema).yes)
            if(!found) {
                found = findOperation(id, (operation as ConditionOperationSchema).no)
                if(found){
                    return found
                }
            }
        }
    }

    return null;
}

export const programSlice = createSlice({
    name: 'program',
    initialState,
    reducers: {
        setDiagram: (state, action) => { state.diagram = action.payload; },
        deleteConnection: (state, action) => { 
            state.diagram.connections = state.diagram.connections.filter(con => con.id != action.payload)
        },
        deleteNode: (state, action) => {
            state.diagram.nodes = state.diagram.nodes.filter(node => node.id != action.payload)
            state.diagram.connections = state.diagram.connections.filter(con => con.from != action.payload && con.to != action.payload)
        },
        addConnection: (state, action) => {
            state.diagram.connections.splice(state.diagram.connections.length-1,0,action.payload)
        },
        addNode: (state, action) => {
            state.diagram.nodes.splice(state.diagram.nodes.length-1,0,action.payload.node)
            state.diagram.connections.splice(state.diagram.connections.length-1,0,action.payload.connections)
        },
        insertNodeAndConnections: (state, action) => {
            const { node, insertConnection, connections } = action.payload

            const idx  = state.diagram.connections.findIndex(con => con.id == insertConnection.id)
            // const beforeNode = state.diagram.nodes.find(n => n.id == insertConnection.from.id)
            // const afterNode = state.diagram.nodes.find(n => n.id == insertConnection.to.id)
            let connectionType = NodeConnectionType.Default
            if (idx != -1) {
                connectionType = state.diagram.connections[idx].type
                state.diagram.connections.splice(idx, 1)
            }
            
            state.diagram.nodes.splice(state.diagram.nodes.length-1, 0, node)
            state.diagram.connections.splice(state.diagram.connections.length-1, 0, connections)
        },
        setProject: (state, action) => { 
            state.project = action.payload; 
            state.currentModuleIndex = state.project.modules.findIndex(module => module.name == state.project.main)
            state.diagram = state.project.modules[state.currentModuleIndex].diagram
        },
        setCurrentModule: (state, action) => { 
            state.currentModuleIndex = state.project.modules.findIndex(module => module.name == action.payload)
            state.diagram = state.project.modules[state.currentModuleIndex].diagram
        },
        setExecution: (state, action) => {
            state.execution = { ...state.execution, ...action.payload }
        },
        setExecutionVariable: (state, action) => {
            state.execution.variables[action.payload.name] = action.payload.value
        },
        addExecutionOutput: (state, action) => {
            state.execution.output.push(action.payload)
        },
        setProgram: (state, action) => {
            state.program = action.payload
        },
        setOperationName: (state, action) => {
            const { id, name } = action.payload
            const operations = state.program.modules[state.currentModuleIndex].operations
            const op = findOperation(id, operations);
            if(op) {
                op.name = name
            }
        }
    },
    extraReducers: (builder)=>{
      //builder.addCase(refreshDiagram.fulfilled, (state, action) => { state.comentarios = [...action.payload]; });
    }
})

export const { setProgram, setDiagram, setProject, setCurrentModule, setExecution, setExecutionVariable, addExecutionOutput, setOperationName } = programSlice.actions
export default programSlice.reducer