
import React from "react";
import { Person, data as personData } from "./dummy/examples"; // Import your data
import { Task, tasks as taskData } from "./dummy/task"; // Import your data
import { Button } from "@mui/material";
import { CustomTable } from "./Components/MaterialTable";
import MuiTableWithProviders from "./Components/MuiTable";

const App = () => {
  // Example actions you may want to add for each row
  const personActions = (person: any) => (
    <Button
      variant="contained"
      onClick={() =>
        alert(`Action clicked for ${person.firstName} ${person.lastName}`)
      }
    >
      View Details
    </Button>
  );

  const taskActions = (task: any) => (
    <Button
      variant="contained"
      onClick={() => alert(`Task Action clicked for ${task.title}`)}
    >
      Complete Task
    </Button>
  );

  return (
    <div>
      <MuiTableWithProviders/>
      {/* <h2>Person Data Table</h2>
      <CustomTable
        data={personData}
        actionsHeader={<Button variant="contained">Add Person</Button>} // Action for header
      />

      <h2>Task Data Table</h2>
      <CustomTable
        data={taskData}
        actionsHeader={<Button variant="contained">Add Task</Button>} // Action for header
      /> */}
    </div>
  );
};

export default App;
