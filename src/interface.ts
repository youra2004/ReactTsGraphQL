export interface ITodos {
  id: number;
  title: string;
  completed: boolean;
  user: {
    name: string;
  };
}

export interface IAddTodos {
  data: {
    createTodo: {
      id: number;
      title: string;
      completed: boolean;
      user: {
        name: string;
      };
    };
  };
}
