export interface IUserApiData{
    id?:number;
    nombres?:string;
    apellidos?:string;
    email?:string;
    password?:string;
    telefono?:string;
    regional?:number|undefined|IRegionalApiData;
    rol?:string
}

export interface IRegionalApiData{
    id?:number;
    ciudad:string;
    directorRegional?:IUserApiData|any;
    inspectores?:IUserApiData[]|any;
    asesoresComerciales?:IUserApiData[]|any;
}

export interface IRegionalTableData{
    id?:number;
    ciudad:string;
    directorRegional:string;
    inspectores?:IUserApiData[]|any;
    asesoresComerciales?:IUserApiData[]|any;
}