import { client } from "../db.js";
import { ObjectId } from "bson";

export function createMentor(data){
    return client.db("node-3").collection("mentors").insertOne(data)
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