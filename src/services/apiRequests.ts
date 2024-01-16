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
        const response = await axios.get(endpoint, {headers: headers});
        return response;
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

        const response = await axios.post(endpoint, bodyData,  {headers: headers} );
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
            'Authorization': `Bearer ${token}`
        }
    }
    else{
        headers = {
            'Content-Type': 'application/json',
        }
    }

    axios
    .put(endpoint, dataUpdate, {headers: headers})
    .then((response: any) => {
        return response;
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
            'Authorization': `Bearer ${token}`
        }
    }
    else{
        headers = {
            'Content-Type': 'application/json',
        }
    }

    axios
    .delete(`${endpoint}/${idDelete}`, {headers: headers})
    .then((response: any) => {
        return response;
    })
    .catch((error: any) => {
        return error;
    });
}