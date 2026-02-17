// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentDetails {

    // Student structure
    struct Student {
        uint id;
        string name;
        string department;
        bool status;        // true = active, false = inactive
        address studentAddress;
    }

    // Mapping: student ID => Student
    mapping(uint => Student) private students;

    // Function to add or update student details
    function setStudentDetails(
        uint _id,
        string memory _name,
        string memory _department,
        bool _status
    ) public {

        students[_id] = Student({
            id: _id,
            name: _name,
            department: _department,
            status: _status,
            studentAddress: msg.sender
        });
    }

    // Getter function to retrieve student details
    function getStudentDetails(uint _id) public view returns (
        uint,
        string memory,
        string memory,
        bool,
        address
    ) {
        Student memory s = students[_id];
        return (s.id, s.name, s.department, s.status, s.studentAddress);
    }
}
