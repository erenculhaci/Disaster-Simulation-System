import { configureStore, createSlice } from '@reduxjs/toolkit';

const nodeSlice = createSlice({
    name: 'nodes',
    initialState: [],
    reducers: {
        setNodes: (state, action) => {
            return action.payload; 
        },
        addNode: (state, action) => {
            state.push(action.payload); 
        },
        deleteNode: (state, action) => {
            return state.filter((node) => node.id !== action.payload);
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
