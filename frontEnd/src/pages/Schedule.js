import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function generateSchedule(){
    
}

function Schedule() {
    let schedule = generateSchedule();
    let table = [];
    if(schedule) for(let i = 0; i<schedule.length; i++){
        let date = new Date(Date.parse(schedule[i][1]));
        let hr = date.getHours(), min = date.getMinutes();
        table.push(
        <tr><th scope='row'>Activity {i+1}:</th><td>{schedule[i][0]}</td>
        <td>{date.toDateString()}</td>
        <td>{hr%12}:{min} {hr>12?"PM":"AM"}</td></tr>);
    }
    return (
        <div>
            <table className="table table-dark">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Activity</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    </tr>
                </thead>
                <tbody>
                {table}
                </tbody>
            </table>
        </div>
    );
}

export default Schedule;