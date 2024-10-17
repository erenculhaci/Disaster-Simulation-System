import { configureStore, createSlice } from '@reduxjs/toolkit';

const nodeSlice = createSlice({
    name: 'nodes',
    initialState: [],
    reducers: {
        setNodes: (state, action) => {
            return action.payload; // Set the nodes from the database
        },
        addNode: (state, action) => {
            state.push(action.payload); // Add a node
        },
        deleteNode: (state, action) => {
            return state.filter((node) => node.id !== action.payload); // Delete node by id
        },
    },
});

export const { setNodes, addNode, deleteNode } = nodeSlice.actions;

const store = configureStore({
    reducer: {
        nodes: nodeSlice.reducer,
    },
});

export default store;
