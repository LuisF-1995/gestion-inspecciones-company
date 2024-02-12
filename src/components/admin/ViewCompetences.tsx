import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { adminAddCompetencePath, adminLoginPath } from '../../constants/routes';
import { apiUserRoles, localAdminTokenKeyName } from '../../constants/globalConstants';
import { sendDelete, sendPut } from '../../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL, COMPETENCES, INSPECTORS, TECHNICAL_DIRECTORS } from '../../constants/apis';
import { getCompetencesFromApi, getInspectors, getTechnicalDirectors } from '../../services/globalFunctions';
import Swal from 'sweetalert2';
import { ICompetencia, IInspector, ITechnicalDirector, IUserApiData } from '../Interfaces';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Avatar, Backdrop, Box, Button, Chip, CircularProgress, Container, Divider, IconButton, Modal, TextField, ThemeProvider, Tooltip, Typography, createTheme } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridEventListener, GridFilterModel, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModesModel, GridRowsProp, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Zoom from '@mui/material/Zoom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode:'light',
    primary: {
      main: '#1976d2',
    },
  },
});

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const initialRows: GridRowsProp = [
];


const ViewCompetences = () => {
  const navigate = useNavigate();
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [ignoreDiacritics, setIgnoreDiacritics] = useState(true);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rows, setRows] = useState(initialRows);
  const [loadingTable, setLoadingTable] = useState(false);

  const [waiting, setWaiting] = useState(false);
  const [token, setToken] = useState("");
  const [competences, setCompetences] = useState<ICompetencia[]>([]);
  const [usersOpt, setUsersOpt] = useState<IUserApiData[]>([]);
  const [usersSelected, setUsersSelected] = useState<{competence:ICompetencia, users:IUserApiData[]}>({
    competence: null,
    users: []
  });
  const [competenceSelected, setCompetenceSelected] = useState<ICompetencia>({
    id:null,
    competencia:'',
    inspectores: [],
    directoresTecnicos: []
  });
  const competenceActions = {
    edit: 'edit',
    delete: 'delete'
  }
  const [editCompetenceModal, setEditCompetenceModal] = useState<{show:boolean, action:string, competenceInfo:ICompetencia}>({
    show: false,
    action: '',
    competenceInfo: null
  });

  useEffect(()=>{
    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localAdminTokenKeyName);
      setToken(jwtToken);
      getCompetencesInfo(jwtToken);
      getUsers(jwtToken);
    }
    else{
      setWaiting(false);
      Swal.fire({
        title: 'Expiró la sesión',
        text: `La sesión expiró, debe volver a iniciar sesión`,
        icon: 'info',
        confirmButtonText: "Iniciar sesión"
      })
      .then(option => {
        if(option.isConfirmed){
          Swal.close();
          navigate(`../${adminLoginPath}`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../${adminLoginPath}`);
          }, 5000);
      })
    }
  }, [])

  const getCompetencesInfo = async(jwtToken:string) => {
    setWaiting(true);
    if(jwtToken){
      try {
        const competencesInfo:ICompetencia[] = await getCompetencesFromApi(jwtToken);
        setWaiting(false);
        setCompetences(competencesInfo);
      }
      catch (error) {
        setWaiting(false);
        sessionStorage.clear();
      }
    }
  }

  const getUsers = async(jwtToken:string) => {
    setLoadingTable(true);
    if(jwtToken){
      try {
        const inspectors:IInspector[] = await getInspectors(jwtToken);
        inspectors.forEach((inspector) => {
          delete inspector.agendaProyectosInspector;
          delete inspector.firmaInspector;
          return(
            inspector
          );
        });
        const technicalDirectors:ITechnicalDirector[] = await getTechnicalDirectors(jwtToken);
        technicalDirectors.forEach((director) => {
          delete director.firmaDirectorTecnico;
          return(
            director
          );
        });
        const totalUsers = [...inspectors, ...technicalDirectors];
        setUsersOpt(totalUsers);
        setLoadingTable(false);
      }
      catch (error) {
        setLoadingTable(false);
        sessionStorage.clear();
      }
    }
  }

  const handleAccordionChange = (selectedCompetence:ICompetencia) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    const competenceName:string = selectedCompetence && selectedCompetence.competencia;
    const techicalDirectors = selectedCompetence.directoresTecnicos;
    const inspectors = selectedCompetence.inspectores;
    const engineersWithCompetence = [...techicalDirectors, ...inspectors];
    setRows(inspectors);
    setCompetenceSelected(isExpanded ? 
      selectedCompetence 
      : 
      {
        id:null,
        competencia:'',
        inspectores: [],
        directoresTecnicos: []
      }
    );
  };

  const deleteCompetence = async (competenceId:number) => {
    setWaiting(true);
    if(sessionStorage.length > 0){
      const jwtToken = sessionStorage.getItem(localAdminTokenKeyName);

      if(jwtToken){
        try {
          const compentencesDelete:ICompetencia = await sendDelete(`${API_GESTION_INSPECCIONES_URL}/${COMPETENCES}/delete`, competenceId, jwtToken);
          setWaiting(false);
          getCompetencesInfo(jwtToken);
        }
        catch (error) {
          setWaiting(false);
          sessionStorage.clear();
        }
      }
    }
  }

  const handleUpdateCompetence = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const competenceUpdate:ICompetencia = editCompetenceModal.competenceInfo;
    competenceUpdate.competencia = event.target.value;
    setEditCompetenceModal({
      ...editCompetenceModal,
      competenceInfo:competenceUpdate
    });
  }

  const updateCompetence = async (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    setWaiting(true);
    setEditCompetenceModal({
      ...editCompetenceModal,
      show:false
    });

    if(sessionStorage.length > 0){
      const jwtToken = sessionStorage.getItem(localAdminTokenKeyName);
      if(jwtToken){
        const competence = editCompetenceModal.competenceInfo;
        try {
          const compentencesInfo = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${COMPETENCES}/update`, competence, jwtToken);
          setWaiting(false);
          
          if(compentencesInfo && compentencesInfo.data && compentencesInfo.status === 200){
            getCompetencesInfo(jwtToken);
          }
          else if(compentencesInfo.status != 200 || compentencesInfo.response.status != 200){
            Swal.fire({
              title: "Ha ocurrido un error",
              text: `No se pudo actualizar la competencia`,
              icon: 'error'
            })
          }
        }
        catch (error) {
          setWaiting(false);
          sessionStorage.clear();
        }
      }
    }
  }

  const handleCompetenceModal = (clickEvent:React.MouseEvent<HTMLButtonElement, MouseEvent>, competenceSelected:ICompetencia, action:string) => {
    clickEvent.stopPropagation();
    
    if(action === competenceActions.delete){
      Swal.fire({
        title: `Eliminar competencia`,
        text: `Se va a eliminar la competencia de ${competenceSelected && competenceSelected.competencia}, ¿Desea proceder?`,
        icon: 'question',
        confirmButtonText: 'Eliminar',
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: 'gray',
      })
      .then(selected => {
        if(selected.isConfirmed){
          deleteCompetence(competenceSelected.id);
        }
      })
    }
    else{
      const competenceModalInfo = {
        show: true,
        action: action,
        competenceInfo: competenceSelected
      }
      setEditCompetenceModal(competenceModalInfo);
    }
  }

  const handleCloseCompetenceModal = () => {
    setEditCompetenceModal({show:false, action:'', competenceInfo:null});
  };

  const addUsersCompetence = async () => {
    const competence = usersSelected.competence;
    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localAdminTokenKeyName);
      setLoadingTable(true);
      const engineersTable:IUserApiData[] = rows.filter(user => user.rol === apiUserRoles.inspector);
      
      try{
        for (const user of usersSelected.users) {
          switch (user.rol) {
            case apiUserRoles.directorTecnico:
              user.competenciasFirmaDictamenDt.push({id:competence.id});
              await sendPut(`${API_GESTION_INSPECCIONES_URL}/${TECHNICAL_DIRECTORS}/update`, user, jwtToken);
              break;
            case apiUserRoles.inspector:
              user.competencias.push({id:competence.id});
              const inspectorResponse = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${INSPECTORS}/update`, user, jwtToken);
              engineersTable.push(user);
              break;
            default:
              setLoadingTable(false);
              break;
          }
        }
        setUsersSelected({
          competence: null,
          users: []
        });
        setRows(engineersTable);
        setLoadingTable(false);
        getCompetencesInfo(jwtToken);
        getUsers(jwtToken);
      }
      catch(rejected){
        setLoadingTable(false);
        Swal.fire({
          title: "Error de conexión",
          text: `No se pudo actualizar la información, verificar conexión a internet o comunicate con nosotros.`,
          icon: 'error'
        })
      }
    }
    else{
      setLoadingTable(false);
      Swal.fire({
        title: 'Expiró la sesión',
        text: `La sesión expiró, debe volver a iniciar sesión`,
        icon: 'info',
        confirmButtonText: "Iniciar sesión"
      })
      .then(option => {
        if(option.isConfirmed){
          Swal.close();
          navigate(`../../${adminLoginPath}`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../../${adminLoginPath}`);
          }, 5000);
      })
    }
  };

  const deleteUserCompetence = async (selectedUser:IUserApiData, competenceDelete:ICompetencia) => {
    setLoadingTable(true);

    const userWithCompetence:IUserApiData = usersOpt.filter(user => user.id === selectedUser.id && user.rol === selectedUser.rol)[0];
    let userUpdated = userWithCompetence;

    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localAdminTokenKeyName);
      try{
        switch (selectedUser.rol) {
          case apiUserRoles.directorTecnico:
            userUpdated.competenciasFirmaDictamenDt = userWithCompetence.competenciasFirmaDictamenDt.filter(competence => competence.id !== competenceDelete.id);
            const directorTecnicoResponse:IUserApiData = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${TECHNICAL_DIRECTORS}/update`, userUpdated, jwtToken);
            break;
          case apiUserRoles.inspector:
            userUpdated.competencias = userWithCompetence.competencias.filter(competence => competence.id !== competenceDelete.id);
            const inspectorResponse:IUserApiData = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${INSPECTORS}/update`, userUpdated, jwtToken);
            break;
          default:
            break;
        }
        setLoadingTable(false);
        getCompetencesInfo(jwtToken);
        getUsers(jwtToken);
      }
      catch(rejected){
        setLoadingTable(false);
        Swal.fire({
          title: "Error de conexión",
          text: `No se pudo actualizar la información, verificar conexión a internet o comunicate con nosotros.`,
          icon: 'error'
        })
      }
    }
    else{
      setLoadingTable(false);
      Swal.fire({
        title: 'Expiró la sesión',
        text: `La sesión expiró, debe volver a iniciar sesión`,
        icon: 'info',
        confirmButtonText: "Iniciar sesión"
      })
      .then(option => {
        if(option.isConfirmed){
          Swal.close();
          navigate(`../../${adminLoginPath}`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../../${adminLoginPath}`);
          }, 5000);
      })
    }
  }

  const handleUserSelectorChange = (value:IUserApiData[], competenceSelected:ICompetencia) => {
    setUsersSelected({
      competence: competenceSelected,
      users: value
    });
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };
  
  const handleRemoveUserCompetenceClick = (id: GridRowId, userInfo:IUserApiData) => async () => {
    await deleteUserCompetence(userInfo, competenceSelected);
    setRows(rows.filter((row) => row.id !== id));
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', type:'number', width: 60, headerAlign:'center', editable:false, hideable:true },
    { field: 'nombres', headerName: 'Nombres', type:'string', width: 250, headerAlign:'center', editable:false },
    { field: 'apellidos', headerName: 'Apellidos', type:'string', width: 250, headerAlign:'center', editable:false },
    { field: 'email', headerName: 'Email', type:'email', width: 250, headerAlign:'center', editable:false },
    {
      field: 'regional',
      headerName: 'Regional', type:'string',
      width: 200, headerAlign:'center', align:'center', editable:false, 
      valueFormatter: (params) => (
        params.value.ciudad
      )
    },
    //{ field: 'rol', headerName: 'Rol', type:'string', width: 200, headerAlign:'center', editable:false },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon color='error' />}
            label="Delete"
            onClick={handleRemoveUserCompetenceClick(id, row)}
            disabled={loadingTable}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container maxWidth="xl" sx={{ m:0, p:0 }}>
        <h3 style={{margin:"10px 0px", textAlign:"center"}}>Gestionar competencias</h3>
        <NavLink style={{ marginBottom: 10 }} to={`../${adminAddCompetencePath}`}>
          <Button variant="outlined" color='primary'>
            Agregar compentecia
          </Button>
        </NavLink>
        <section style={{margin:"10px 0px"}}>
          <ThemeProvider theme={darkTheme}>
            {competences.length > 0 ?
              competences.map((competence:ICompetencia, index:number) => (
                <Accordion key={competence.competencia + index} expanded={competenceSelected.competencia === competence.competencia} onChange={handleAccordionChange(competence)}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id={competence.competencia}
                  >
                    <Tooltip 
                      title={
                        <>
                          <Tooltip title="Edit competence">
                            <IconButton aria-label="edit-competence" color='info' size="large" onClick={(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleCompetenceModal(event, competence, competenceActions.edit)}>
                              <EditRoundedIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete competence">
                            <IconButton aria-label="delete-competence" color='error' size="large" onClick={(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleCompetenceModal(event, competence, competenceActions.delete)}>
                              <DeleteRoundedIcon  />
                            </IconButton>
                          </Tooltip>
                        </>
                      } 
                      placement="top-start"
                      TransitionComponent={Zoom}
                    >
                      <Typography sx={{ flexShrink: 0 }}>
                        {competence.competencia}
                      </Typography>
                    </Tooltip>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      gap:2,
                      mb:1
                    }}>
                      <Autocomplete
                        multiple
                        id={`select-users-${competence.id}`}
                        sx={{ width: 300 }}
                        options={usersOpt.length > 0 ? usersOpt.sort((a, b) => -b.rol.localeCompare(a.rol)) : []}
                        filterOptions={(options, { inputValue }) => {
                          const filteredOptions = options.filter((user) => {
                            if(user.rol === apiUserRoles.inspector && user.competencias){
                              return !user.competencias.some((competencia) => competencia.competencia === competenceSelected.competencia) && 
                                      (user.nombres.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) || 
                                       user.apellidos.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
                                      );
                            }
                            else if(user.rol === apiUserRoles.directorTecnico && user.competenciasFirmaDictamenDt){
                              return !user.competenciasFirmaDictamenDt.some((competencia) => competencia.competencia === competenceSelected.competencia) && 
                                    (user.nombres.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) || 
                                     user.apellidos.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
                                    );
                            }
                          });
                          return filteredOptions;
                        }}
                        groupBy={(user) => user.rol && user.rol.length > 0 && user.rol.replace("_", " ")}
                        getOptionLabel={(option:IUserApiData) => `${option.nombres} ${option.apellidos ? option.apellidos : ''}`}
                        defaultValue={[]}
                        filterSelectedOptions
                        onChange={(event:React.SyntheticEvent<Element, Event>, newValue) => {handleUserSelectorChange(newValue, competence)}}
                        value={usersSelected.competence && usersSelected.competence.competencia === competenceSelected.competencia ? usersSelected.users : []}
                        disabled={loadingTable}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Seleccionar usuarios"
                            placeholder="usuarios"
                          />
                        )}
                      />
                      <Button variant="outlined" startIcon={<PersonAddRounded />} sx={{m:0}} disabled={loadingTable} onClick={addUsersCompetence}>
                        Agregar usuarios
                      </Button>
                    </Box>
                    <Box>
                      <Divider variant="fullWidth" sx={{mb:1, mt:1}}>Directores técnicos</Divider>
                      {competence && competence.directoresTecnicos && competence.directoresTecnicos.length > 0 && 
                        competence.directoresTecnicos.map((techinalDirector:ITechnicalDirector) => (
                          <Chip
                            key={techinalDirector.id}
                            disabled={loadingTable}
                            variant='outlined'
                            label={`${techinalDirector.nombres} ${techinalDirector.apellidos ? techinalDirector.apellidos : ''}`}
                            onDelete={() => deleteUserCompetence(techinalDirector, competence)}
                            avatar={<Avatar>{`${techinalDirector.nombres[0]}${techinalDirector.apellidos ? techinalDirector.apellidos[0] : ''}`}</Avatar>}
                          />
                        ))
                      }
                      <Divider variant="fullWidth" sx={{mb:1, mt:1}}>Inspectores</Divider>
                      <DataGrid
                        sx={{height:"65vh",  width:"100%", backgroundColor:"#101418"}}
                        key={ignoreDiacritics.toString()}
                        rows={rows}
                        columns={columns}
                        filterModel={filterModel}
                        onFilterModelChange={setFilterModel}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{ toolbar: { showQuickFilter: true } }}
                        ignoreDiacritics={ignoreDiacritics}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={(newModel) =>
                          setColumnVisibilityModel(newModel)
                        }
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                          },
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                        //checkboxSelection
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        loading={loadingTable}
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))
              :
              <Typography sx={{ flexShrink: 0 }}>
                No hay competencias agregadas
              </Typography>
            }
          </ThemeProvider>
        </section>
      </Container>
      <Modal
        open={editCompetenceModal.show}
        onClose={handleCloseCompetenceModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h5" component="h6" sx={{textAlign:'center', mb:2}}>
            {`Actualizar competencia de ${editCompetenceModal.competenceInfo ? editCompetenceModal.competenceInfo.competencia : ""}`}
          </Typography>
          <form onSubmit={updateCompetence} style={{display:"flex", justifyContent:"center", gap:5}}>
            <TextField id="update-competence" label="Competencia" variant="outlined" onChange={handleUpdateCompetence} value={editCompetenceModal.competenceInfo && editCompetenceModal.competenceInfo.competencia} required />
            <Button type='submit' variant="outlined">Actualizar</Button>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default ViewCompetences