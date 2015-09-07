function addTodo(text) {
    return {
        type: ADD_TODO,
        text
    };
};

export {
    addTodo
};
