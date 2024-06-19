import { employees } from "./api";
import { Table } from "./components/table/Table";

function App() {

  const tableData = employees

  const headers = [
    { title: "Id", key: "employeeId" },
    { title: "Name", key: "name" },
    { title: "Department", key: "department" },
    { title: "Role", key: "role" },
    { title: "Age", key: "age" },
    { title: "Date Of Joining", key: "dateOfJoining" },
    { title: "Annual Rating", key: "annualRating" }
  ]
  return (
    <div className="App">
      <Table data={tableData} headers={headers} />
    </div>
  );
}

export default App;
