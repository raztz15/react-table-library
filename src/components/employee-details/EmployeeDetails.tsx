import { formatDate } from '../../Utils'
import './EmployeeDetails.css'

export interface IEmployeeDetailsProps {
    employeeId: string,
    name: string,
    department: string,
    role: string,
    age: number,
    dateOfJoining: string,
    performanceScores: {
        Q1: number,
        Q2: number,
        Q3: number,
        Q4: number
    },
    annualRating: number
}

export const EmployeeDetails = ({ employeeId, name, department, role, age, dateOfJoining, performanceScores, annualRating }: IEmployeeDetailsProps) => {

    const tablesHeaders = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]

    return (
        <div className='employee-details--container'>
            <h2>Employee Details: {employeeId}</h2>
            <div className='employee-details'>
                <div><strong>Employee Name : </strong>{name}</div>
                <div><strong>Department : </strong>{department}</div>
                <div><strong>Role : </strong>{role}</div>
                <div><strong>Age : </strong>{age}</div>
                <div><strong>Date Of Joining : </strong>{formatDate(dateOfJoining)}</div>
                <div><strong>Annual Rating : </strong>{annualRating}</div>
                <div><strong>Employee Performance :</strong>
                    <table>
                        <thead>
                            <tr>
                                {tablesHeaders.map(header => <th key={header}>{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>{Object.entries(performanceScores).map(([key, val]) => <td key={key}>{val}</td>)}</tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
