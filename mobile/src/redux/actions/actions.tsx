export const addTodo = (text: string) => {
  return {
    type: "todos/todoAdded",
    payload: text,
  };
};
