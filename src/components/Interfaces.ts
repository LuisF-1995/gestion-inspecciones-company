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

export interface ICompetencia{
    response?: any;
    id?:number;
    competencia?:string;
    inspectores?: IInspector[];
    directoresTecnicos?: ITechnicalDirector[]
}

export interface ICalendar{
    id?:number;
    fechaInspeccion?:Date;
    numeroVisita?: number;
    inspector?: IInspector;
    proyecto?: any;
    actaInspeccion?:any;
}

export interface IInspector{
    id?:number;
    nombres?:string;
    apellidos?:string;
    numeroDocumento?:number;
    matriculaProfesional?:string;
    email?:string;
    password?:string;
    telefono?:string;
    regional?:number|undefined|IRegionalApiData;
    competencias?: ICompetencia[];
    agendaProyectosInspector?: ICalendar[];
    firmaInspector?:string;
    rol?:string;
}

export interface ITechnicalDirector{
    id?:number;
    nombres?:string;
    apellidos?:string;
    numeroDocumento?:number;
    matriculaProfesional?:string;
    email?:string;
    password?:string;
    telefono?:string;
    competenciasFirmaDictamenDt?: ICompetencia[];
    firmaDirectorTecnico?:string;
    rol?:string;
}