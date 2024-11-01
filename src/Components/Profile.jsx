import axios from "axios";


export default function Profile(){

    const api=axios.create({
        baseURL:"http://localhost:8080/api/wildSkills/student",
        timeout:1000,
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    return (
        <div >

        </div>
    )
}