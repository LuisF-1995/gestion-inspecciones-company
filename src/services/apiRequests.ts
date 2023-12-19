import axios from 'axios';


export async function sendGet (endpoint:string, token?:string):Promise<any> {
    let headers = {}

    if (token && token.length > 0) {
        headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    else{
        headers = {
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await axios.get(endpoint, headers);
        return response.data;
    } 
    catch (error) {
        return error;
    }
}

export async function sendPost (endpoint:string, bodyData:any, token?:string):Promise<any> {
    try {
        let headers = {}

        if (token && token.length > 0) {
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        else{
            headers = {
                'Content-Type': 'application/json',
            }
        }

        const response = await axios.post(endpoint, bodyData,  headers );
        return response.data;
    } 
    catch (error) {
        return error;
    }
}

export async function sendPut (endpoint:string, dataUpdate:any, token?:string){
    let headers = {}

    if (token && token.length > 0) {
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',
            'Authorization': `Bearer ${token}`
        }
    }
    else{
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',
        }
    }

    axios
    .put(endpoint, dataUpdate, headers)
    .then((response: { data: any; }) => {
        return response.data;
    })
    .catch((error: any) => {
        return error;
    });
}

export async function sendDelete (endpoint:string, idDelete:number, token?:string){
    let headers = {}

    if (token && token.length > 0) {
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',
            'Authorization': `Bearer ${token}`
        }
    }
    else{
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',
        }
    }

    axios
    .delete(`${endpoint}/${idDelete}`, headers)
    .then((response: { data: any; }) => {
        return response.data;
    })
    .catch((error: any) => {
        return error;
    });
}