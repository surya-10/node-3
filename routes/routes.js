import express from "express";
import { createMentor, findAssignedStudents, findMentor } from "../db controls/mentor.js";
import { assignMentor, createStudent, findPreviousMentor, findStud, getAllstudents, updateMentor, withoutMentor } from "../db controls/students.js";

let router = express.Router();

router.get("/", (req, res) => {
    res.send({ message: "working fine" });
})


// write a api to create a student

router.post("/add-student", async (req, res) => {
    try {
        let data = req.body;
        if (!data) {
            return res.status(400).send({ message: "invalid input" })
        }
        let student = await createStudent(data);
        if (!student.acknowledged) {
            return res.status(400).send({ message: "Error to add mentor" })
        }
        return res.status(201).send("Student created successfully")
    }
    catch (error) {
        return res.status(500).send({ message: "server error" });
    }
})

// to view all students

router.get("/students/all", async (req, res) => {
    try {
        let students = await getAllstudents();
        // if(students.length===0){
        //     return res.status(400).send({message:"No data available"});
        // }
        return res.status(200).send(students);
    } catch (error) {
        return res.status(500).send({ message: "server error" });
    }
})

// write an api to assign mentor to stduents

router.post("/assign-mentor", async (req, res) => {
    try {
        let { studId, mentorId, mentorName } = req.body;
        if (!studId || !mentorId || !mentorName) {
            return res.status(400).send({ message: "Provide valid id" })
        }
        let result = await assignMentor(studId, mentorId, mentorName)
        if (!result) {
            return res.status(400).send({ message: "no data available for given id" })
        }
        res.status(200).send(result);

    } catch (error) {
        return res.status(500).send({ message: "server error" });
    }
})

// A student who has a mentor should not be shown in List

router.get("/no-mentor", async (req, res) => {
    try {
        let result = await withoutMentor();
        if (result.length === 0) {
            res.status(400).send({ message: "new mentors assigned to all students" })
        }
        res.status(200).send({ studentsWithoutNewMentor: result });

    } catch (error) {
        return res.status(500).send({ message: "server error" });
    }
})


///Write API to Assign or Change Mentor for particular Student
//Select One Student and Assign one Mentor

router.put("/edit-mentor", async (req, res) => {
    try {
        let { student_id, mentor_name, mentor_id } = req.body;
        if(!student_id || !mentor_name || !mentor_id){
            return res.status(400).send({message:"mentor name or student id is empty"})
        }
        let isMentorExist = await findMentor(mentor_name, mentor_id)
        let isStudExist = await findStud(student_id)
        if (!isMentorExist) {
            return res.status(400).send({message:"given mentor name not exist. first register the given name as a mentor"});
        }
        if (!isStudExist) {
            return res.status(400).send({message:"given student id not exist. first register the given id as a student"});
        }
        let assignMentor = await updateMentor(student_id, mentor_name, mentor_id);
        res.status(201).send(assignMentor);
    } catch (error) {
        return res.status(500).send({ message: "server error" });
    }
})

// Write API to show all students for a particular mentor

router.get("/assigned-student/:id", async(req, res)=>{
    try {
        let {id} = req.params;
        if(!id){
            return res.status(400).send({message:"mentor id name cannot be empty"});
        }
        let assignedStudents = await findAssignedStudents(id);
        if(!assignedStudents){
            return res.status(400).send({message:"given id invalid"});
        }
        if(assignedStudents.student.length==0){
            return res.send({message:"no students assigned to this mentor"})
        }
        return res.status(200).send(assignedStudents.student);
    } catch (error) {
        return res.status(500).send({ message: "server error" });
    }
})


//Write an API to show the previously assigned mentor for a particular student. 

router.get("/previous-mentor/:id", async(req, res)=>{
    try {
        let {id} = req.params;
        if(!id){
            return res.status(400).send({message:"student id cannot be empty"});
        }
        let result = await findPreviousMentor(id);
        if(!result){
            return res.status(400).send({message:"given id invalid"});
        }
        return res.status(200).send({previousMentor:result.previous_mentor})
        
    } catch (error) {
        return res.status(500).send({ message: "server error" });
    }
    
})

















router.post("/add-mentor", async (req, res) => {
    try {
        let mentor = req.body;
        if (!mentor) {
            return res.status(400).send({ message: "invalid input" })
        }
        let out = await createMentor(mentor);
        if (!out.acknowledged) {
            return res.status(400).send({ message: "Error to add mentor" })
        }
        return res.status(201).send("Mentor created successfully")
    } catch (error) {
        return res.status(500).send({ message: "server error" });
    }
})
export let studentRouter = router;