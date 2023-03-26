import React, { createContext } from "react";

// import { useStorageReducer } from ""

import todoReducer from '../reducers/todo.reducers.js';

const defaultTodos = [
    { id: 1, task: "Feed the cat" },
    { id: 2, task: "Feed the dog"}
];

export const TodosContext = createContext();
export const DispatchContext = createContext();

export function TodosProvider(props) { 
    const [ todos, dispatch ] = useStorageReducer(
        "todos",
        defaultTodos,
        todoReducer
    );

    return (
        
    <TodosContext.Provider value={todos}>
        <DispatchContext.Provider value={dispatch}>
            { props.children }
        </DispatchContext.Provider>
    </TodosContext.Provider>
    
    );
}