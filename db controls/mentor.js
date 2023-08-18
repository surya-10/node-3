import { client } from "../db.js";
import { ObjectId } from "bson";

export async function createMentor(data){
    let a = await client.db("node-3").collection("mentors").insertOne(data)
    let id = data.mentor_id;
    // console.log(id);
    let findData = await client.db("node-3").collection("mentors").findOne({mentor_id:id})
    return findData;
}
export function findMentor(name, id){
    return client.db("node-3").collection("mentors").findOne({$and:[{mentor_name:name}, {mentor_id:id}]});    
}
export async function findAssignedStudents(id){
    let out = await client.db("node-3").collection("mentors").findOne({_id:new ObjectId(id)})
    
    if(!out){
        return false;
    }
    return out;
}
export function getAllMentors(){
    return client.db("node-3").collection("mentors").find().toArray()
}

export function deleteMentor(id){
    id = +id;
    return client.db("node-3").collection("mentors").deleteOne({mentor_id:id})
}