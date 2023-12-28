import { NodeConnectionType } from '@/entities/NodeConnection';
import { ProgramExecution } from '@/entities/ProgramExecution';
import { ProgramSchema } from '@/entities/ProgramSchema';
import { Project } from '@/entities/Project';
import { findOperation } from '@/libs/flowit/Utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface ProgramState {
    currentModuleIndex: number;
    execution: ProgramExecution;
    program: ProgramSchema;
}

const initialState: ProgramState = {
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

export const programSlice = createSlice({
    name: 'program',
    initialState,
    reducers: {
        setDiagram: (state, action) => { state.program.modules[state.currentModuleIndex].diagram= action.payload; },
        deleteConnection: (state, action) => { 
            state.program.modules[state.currentModuleIndex].diagram.connections = state.program.modules[state.currentModuleIndex].diagram.connections.filter(con => con.id != action.payload)
        },
        deleteNode: (state, action) => {
            state.program.modules[state.currentModuleIndex].diagram.nodes = state.program.modules[state.currentModuleIndex].diagram.nodes.filter(node => node.id != action.payload)
            state.program.modules[state.currentModuleIndex].diagram.connections = state.program.modules[state.currentModuleIndex].diagram.connections.filter(con => con.from != action.payload && con.to != action.payload)
        },
        addConnection: (state, action) => {
            state.program.modules[state.currentModuleIndex].diagram.connections.splice(state.program.modules[state.currentModuleIndex].diagram.connections.length-1,0,action.payload)
        },
        addNode: (state, action) => {
            state.program.modules[state.currentModuleIndex].diagram.nodes.splice(state.program.modules[state.currentModuleIndex].diagram.nodes.length-1,0,action.payload.node)
            state.program.modules[state.currentModuleIndex].diagram.connections.splice(state.program.modules[state.currentModuleIndex].diagram.connections.length-1,0,action.payload.connections)
        },
        insertNodeAndConnections: (state, action) => {
            const { node, insertConnection, connections } = action.payload

            const idx  = state.program.modules[state.currentModuleIndex].diagram.connections.findIndex(con => con.id == insertConnection.id)
            let connectionType = NodeConnectionType.Default
            if (idx != -1) {
                connectionType = state.program.modules[state.currentModuleIndex].diagram.connections[idx].type
                state.program.modules[state.currentModuleIndex].diagram.connections.splice(idx, 1)
            }
            
            state.program.modules[state.currentModuleIndex].diagram.nodes.splice(state.program.modules[state.currentModuleIndex].diagram.nodes.length-1, 0, node)
            state.program.modules[state.currentModuleIndex].diagram.connections.splice(state.program.modules[state.currentModuleIndex].diagram.connections.length-1, 0, connections)
        },
        setCurrentModule: (state, action) => { 
            state.currentModuleIndex = state.program.modules.findIndex(module => module.name == action.payload)
            state.program.modules[state.currentModuleIndex].diagram= state.program.modules[state.currentModuleIndex].diagram
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
            const op = findOperation(Number(id), operations);
            if(op) {
                op.name = name
            }
        }
    },
    extraReducers: (builder)=>{
      //builder.addCase(refreshDiagram.fulfilled, (state, action) => { state.comentarios = [...action.payload]; });
    }
})

export const { setProgram, setDiagram, setCurrentModule, setExecution, setExecutionVariable, addExecutionOutput, setOperationName } = programSlice.actions
export default programSlice.reducer