import { Diagram } from '@/entities/Diagram';
import { NodeConnectionType } from '@/entities/NodeConnection';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface ProgramState {
    diagram: Diagram;
}

const initialState: ProgramState = {
    diagram: {
        nodes: [],
        connections: [],
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
        }
    },
    extraReducers: (builder)=>{
      //builder.addCase(refreshDiagram.fulfilled, (state, action) => { state.comentarios = [...action.payload]; });
    }
})

export const { setDiagram } = programSlice.actions
export default programSlice.reducer