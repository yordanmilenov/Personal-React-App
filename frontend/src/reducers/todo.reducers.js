


const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            return [...state, { id: _id, task: action.task  }];
        case 'REMOVE': 
            return state.filter(todo => todo.id !== action.id);
        case 'TOGGLE': 
            return state.map(todo => 
                todo.id === action.id ? { ...todo } : todo 
            );
        case 'EDIT': 
            return state.map(todo => 
                todo.id === action.id ? { ...todo, task: action.newTask } : todo     
            );
        default: 
            return state;
    }
};
export default reducer;