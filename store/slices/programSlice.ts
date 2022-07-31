import { Diagram } from '@/entities/Diagram';
import { NodeConnectionType } from '@/entities/NodeConnection';
import { ProgramExecution } from '@/entities/ProgramExecution';
import { Project } from '@/entities/Project';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface ProgramState {
    diagram: Diagram;
    project: Project;
    currentModuleIndex: number;
    execution: ProgramExecution;
}

const initialState: ProgramState = {
    diagram: {
        nodes: [],
        connections: [],
    },
    project: {
        main: '',
        modules: [],
    },
    currentModuleIndex: 0,
    execution: {
        isRunning: false,
        currentNode: 0,
        variables: new Map(),
        output: [],
    }
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
            state.execution.variables.set(action.payload.key, action.payload.value)
        },
        addExecutionOutput: (state, action) => {
            state.execution.output.push(action.payload)
        }
    },
    extraReducers: (builder)=>{
      //builder.addCase(refreshDiagram.fulfilled, (state, action) => { state.comentarios = [...action.payload]; });
    }
})

export const { setDiagram, setProject, setCurrentModule, setExecution, setExecutionVariable, addExecutionOutput } = programSlice.actions
export default programSlice.reducer