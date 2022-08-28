import React from "react";
import "./App.css";
import TodosList from "./components/list";

const App: React.FC = () => {
  return (
    <div className="App">
      <TodosList />
    </div>
  );
};

export default App;
