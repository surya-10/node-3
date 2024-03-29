import { client } from "../db.js";
import { ObjectId } from "bson";


export function createStudent(data){
    return client.db("node-3").collection("students").insertOne(data)
}
export function getAllstudents(){
    return client.db("node-3").collection("students").find().toArray()
}

export async function assignMentor(studId, mentorId, mentorName){
    
    let student = await client.db("node-3").collection("students").findOne({stud_id:studId});
  
    let mentor = await client.db("node-3").collection("mentors").findOne({$and:[{mentor_id:mentorId}, {mentor_name:mentorName}]});

    if(!student || !mentor){
        return false;
    }
    else{
        let mentor = await client.db("node-3").collection("mentors").findOneAndUpdate({mentor_id:mentorId}, {$push:{student:{"studentName":student.student_name}}});
        return client.db("node-3").collection("students").updateOne({stud_id:studId}, {$set:{new_mentor:mentorName, newMentorAssigned:true, newMentorId:mentorId}})
    }
}

export async function withoutMentor(){

     return  client.db("node-3").collection("students").find({newMentorAssigned:false}).toArray();
}

export function findStud(studID){
    return client.db("node-3").collection("students").findOne({stud_id:studID});
}


export function updateMentor(id, name, mentor_id){
    return client.db("node-3").collection("students").findOneAndUpdate({stud_id:id}, {$set:{new_mentor:name, newMentorAssigned:true, newMentorId:mentor_id}});
}

export async function findPreviousMentor(id){
    let out = await client.db("node-3").collection("students").findOne({_id:new ObjectId(id)})
    
    if(!out){
        return false;
    }
    return out;
}
export function deleteStud(id){
    id = +id;
    return client.db("node-3").collection("students").deleteOne({stud_id:id});
    // let a = await client.db("node-3").collection("students").deleteOne({stud_id:id})
    // let b = await client.db("node-3").collection("students").findOne({stud_id:id})
    
}

export function editStud(mentor_id, newMentorAssigned, newMentorId, new_mentor, previous_mentor, stud_id, student_name){
    stud_id = +stud_id;
    mentor_id= +mentor_id;
    newMentorId = +newMentorId;
    // console.log(stud_id)
    return client.db("node-3").collection("students").findOneAndUpdate({stud_id:stud_id}, {$set:{mentor_id:mentor_id, newMentorAssigned:newMentorAssigned, newMentorId:newMentorId, new_mentor:new_mentor, previous_mentor:previous_mentor, stud_id:stud_id, student_name:student_name}});
}