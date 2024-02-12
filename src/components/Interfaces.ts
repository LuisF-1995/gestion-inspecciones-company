export interface IUserApiData{
    id?:number;
    nombres?:string;
    apellidos?:string;
    email?:string;
    password?:string;
    telefono?:string;
    regional?:number|undefined|IRegionalApiData;
    rol?:string
    competenciasFirmaDictamenDt?: ICompetencia[];
    competencias?: ICompetencia[];
}

export interface IRegionalApiData{
    id?:number;
    ciudad:string;
    directorRegional?:IUserApiData|any;
    inspectores?:IUserApiData[]|any;
    asesoresComerciales?:IUserApiData[]|any;
    direccion?:string;
    telefono?:string;
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

export interface ICommercialAdvisor{
  id?:number;
  nombres?: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  regional?: IRegionalApiData;
  proyectosAsesor?: IProject[];
  rol?: string;
}

export interface ICustomer {
  id?: number;
  nombre?: string;
  telefono?: string;
  email: string;
  proyectosCliente?: IProject[];
  rol?: string;
}

export interface IConstructor {
  id?: number;
  nombres?: string;
  apellidos?: string;
  tipoDocumento?: string;
  numeroDocumento: number;
  telefono?: string;
  email: string;
  matriculaProfesional?: string;
  direccionDomicilio?: string;
  firmaConstructor?: string;
  proyectosConstructor?: IProject[];
  qrConstructor?: string;
  rol?: string;
}

export interface IProject{
  id?: number;
  nombreProyecto: string;
  numeroProforma?: string;
  numeroCotizacion?: string;
  numeroInspeccion?: string;
  alcance?: string;
  estadoProyecto: "aprobado" | "abierto" | "cerrado";
  direccionProyecto: string;
  visitasCotizadas: number;
  visitasRealizadas?: number;
  asesorComercial?: ICommercialAdvisor;
  cliente?: ICustomer;
  constructores?: IConstructor[];
  calendarioProyectos?: ICalendar[];
  actasProyecto:any;
  fechaCierreProyecto?: Date;
}