import { getOptions } from "./Utils";
import { employees } from "./api";
import { InputTypes } from "./components/filter-menu/FilterMenu";
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

  const filterMenuProps =
  {
    title: 'Employees',
    inputs: [
      { key: "name", label: "Name", type: InputTypes.text },
      { key: "age", label: "Age", type: InputTypes.number },
      { key: "annualRating", label: "Annual Rating", type: InputTypes.number },
      { key: "dateOfJoining", label: "Date Of Joining", type: InputTypes.date },
      { key: "role", label: "Role", type: InputTypes.select, options: getOptions(employees, "role") },
      { key: "department", label: "Department", type: InputTypes.select, options: getOptions(employees, "department") },
    ],
  }

  const mainSearchInput = {
    placeHolderName: "Name",
    searchKey: "name"
  }

  return (
    <div className="App">
      <Table data={tableData} headers={headers} filterMenuProps={filterMenuProps} mainSearchInput={mainSearchInput} keyField="employeeId" numOfItemsToShow={7} />
    </div>
  );
}

export default App;
