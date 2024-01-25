import React, { useEffect, useMemo, useState } from 'react'
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridFilterModel,
  GridRowsProp,
  GridColumnVisibilityModel,
  GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridValueGetterParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Backdrop, Box, Button, ButtonBase, CircularProgress, Container, Fade, MenuItem, Modal, Select, SelectChangeEvent, TextField, ThemeProvider, Typography, createTheme, styled } from '@mui/material';
import { getComercialAdvisors, getInspectors, getRegionalDirectors, getRegionalsInfo, getScheduleProgrammers, getTechnicalDirectors, getUserRoles } from '../../services/globalFunctions';
import { API_GESTION_INSPECCIONES_URL, COMMERCIAL_ADVISORS, INSPECTORS, REGIONAL_DIRECTORS, SCHEDULE_PROGRAMMERS, TECHNICAL_DIRECTORS } from '../../constants/apis';
import { NavLink, useNavigate } from 'react-router-dom';
import { adminAddUserPath, adminLoginPath } from '../../constants/routes';
import { apiUserRoles, localTokenKeyName } from '../../constants/globalConstants';
import Swal from 'sweetalert2';
import { IRegionalApiData, IUserApiData } from '../Interfaces';
import { sendDelete, sendGet, sendPut } from '../../services/apiRequests';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
  width: '96vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius:"10px"
};

const initialRows: GridRowsProp = [
];

const images = [
  {
    url: '../../images/commercial.jpg',
    title: 'Asesores comerciales',
    width: '40%',
    rol: apiUserRoles.asesorComercial
  },
  {
    url: '../../images/oficinaDirRegional.jpg',
    title: 'Directores de regional',
    width: '40%',
    rol: apiUserRoles.directorRegional
  },
  {
    url: '../../images/directorTecnico.jpg',
    title: 'Directores técnicos',
    width: '40%',
    rol: apiUserRoles.directorTecnico
  },
  {
    url: '../../images/inspector.jpg',
    title: 'Inspectores',
    width: '40%',
    rol: apiUserRoles.inspector
  },
  {
    url: '../../images/programadorAgenda.jpg',
    title: 'Programadores de agenda',
    width: '40%',
    rol: apiUserRoles.programadorAgenda
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '90% !important', // Overrides inline-style
    height: 150,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.3,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.65,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));


const ViewUsers = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [usersState, setUsersState] = useState<IUserApiData[]>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [ignoreDiacritics, setIgnoreDiacritics] = useState(true);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [userRoles, setUserRoles] = useState([]);
  const [rows, setRows] = useState(initialRows);
  const [loadingTable, setLoadingTable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [regionalsOpt, setRegionalsOpt] = useState<IRegionalApiData[]>([]);
  const [userType, setUserType] = useState("[User Type]");

  useEffect(() => {
    getUserRolesArray();
    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localTokenKeyName);
      setToken(jwtToken);
      (async () => {
        setLoadingTable(true);
        const regionals:IRegionalApiData[] = await getRegionalsInfo(jwtToken);
        setLoadingTable(false);
        setRegionalsOpt(regionals);
        return;
      })();
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


  useEffect(() => {
    const typeUser = images.length > 0 && images.filter(image => image.title === userType)[0];
    
    if(typeUser || typeUser !== undefined){
      switch (typeUser.rol) {
        case apiUserRoles.asesorComercial:
          setColumnVisibilityModel({
            competencias:false
          })
          break;
        case apiUserRoles.inspector:
          setColumnVisibilityModel({
          })
          break;
        case apiUserRoles.directorRegional:
          setColumnVisibilityModel({
            competencias:false
          })
          break;
        case apiUserRoles.directorTecnico:
          setColumnVisibilityModel({
            regional:false
          })
          break;
        case apiUserRoles.programadorAgenda:
          setColumnVisibilityModel({
            regional:false,
            competencias: false
          })
          break;
        default:
          setColumnVisibilityModel({})
          break;
      }
    }

  }, [userType])
  

  const getUserRolesArray = async() => {
    const roles = await getUserRoles();
    setUserRoles(roles);
  }

  const getUsers = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>, rol?:string) => {
    setShowModal(true);
    setUsersState([]);
    setRows([]);
    setLoadingTable(true);
    const name = event ? event.currentTarget.name : "";
    const value = event ? event.currentTarget.value : rol && rol.length > 0 ? rol : "";
    const image = images && images.length > 0 && images.filter(image => image.rol === value)[0];
    setUserType(image.title);
    
    let totalUsers:IUserApiData[] = [];

    switch (value) {
      case apiUserRoles.asesorComercial:
        const asesoresComerciales:IUserApiData[] = await getComercialAdvisors(token);
        totalUsers = [...asesoresComerciales];
        break;
      case apiUserRoles.directorRegional:
        const directoresRegional:IUserApiData[] = await getRegionalDirectors(token);
        totalUsers = [...directoresRegional];
        break;
      case apiUserRoles.directorTecnico:
        const directoresTecnicos:IUserApiData[] = await getTechnicalDirectors(token);
        totalUsers = [...directoresTecnicos];
        break;
      case apiUserRoles.inspector:
        const inspectores:IUserApiData[] = await getInspectors(token);
        totalUsers = [...inspectores];
        break;
      case apiUserRoles.programadorAgenda:
        const programadoresAgenda:IUserApiData[] = await getScheduleProgrammers(token);
        totalUsers = [...programadoresAgenda];
        break;
    
      default:
        break;
    }
    
    setUsersState(totalUsers);
    setRows(totalUsers);
    setLoadingTable(false);
  }

  const handleCloseModal = () => setShowModal(false);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleUserChanges = (rowInfo:GridRenderEditCellParams|GridValueGetterParams, event:React.ChangeEvent<HTMLInputElement>) => {
    const eventValue:string|number = event.target.value;
    const eventName:string = event.target.name;
    const userInfo:IUserApiData = rowInfo.row;
    //const updatedUserArray:IUserApiData[] = [...rows];
    const updatedUser:IUserApiData = rows.length > 0 && rows.filter((user:IUserApiData) => user.id === userInfo.id)[0];
    
    if(eventName === 'regional'){
      const updatedRegional:IRegionalApiData = regionalsOpt.length > 0 && regionalsOpt.filter(regional => regional.id === parseInt(eventValue))[0];
      //userInfo.regional = updatedRegional;
      updatedUser[eventName] = updatedRegional;
    }
    else if(updatedUser && updatedUser !== undefined){
      updatedUser[eventName] = eventValue && eventValue.length > 0 ? eventValue : "";
    }

    //setUsersState(updatedUserArray);
    //setRows(updatedUserArray);
    processRowUpdate(updatedUser);
  };

  const updateUser = async(userInfo:IUserApiData) => {
    setLoadingTable(true);

    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localTokenKeyName);
      
      try{
        switch (userInfo.rol) {
          case apiUserRoles.asesorComercial:
            const asesorComercial:IUserApiData = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${COMMERCIAL_ADVISORS}/update`, userInfo, jwtToken);
            break;
          case apiUserRoles.directorRegional:
            const directorRegional:IUserApiData = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${REGIONAL_DIRECTORS}/update`, userInfo, jwtToken);
            break;
          case apiUserRoles.directorTecnico:
            const directorTecnico:IUserApiData = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${TECHNICAL_DIRECTORS}/update`, userInfo, jwtToken);
            break;
          case apiUserRoles.inspector:
            const inspector:IUserApiData = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${INSPECTORS}/update`, userInfo, jwtToken);
            break;
          case apiUserRoles.programadorAgenda:
            const programadorAgenda:IUserApiData = await sendPut(`${API_GESTION_INSPECCIONES_URL}/${SCHEDULE_PROGRAMMERS}/update`, userInfo, jwtToken);
            break;
          default:
            break;
        }

        getUsers(null, userInfo.rol);
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
          navigate(`../${adminLoginPath}`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../${adminLoginPath}`);
          }, 5000);
      })
    }
  }

  const handleSaveClick = (id: GridRowId, row:GridRowModel) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    const userId:number = parseInt(id.toString());
    delete row.isNew;
    const userUpdate:IUserApiData = row;
    await updateUser(userUpdate);
  };

  const deleteUserByIdAndRol = async (userId:number, rol:string) => {
    setWaiting(true);

    try{
      switch (rol) {
        case apiUserRoles.asesorComercial:
          const asesorComercial:IUserApiData = await sendDelete(`${API_GESTION_INSPECCIONES_URL}/${COMMERCIAL_ADVISORS}/delete`, userId, token);
          break;
        case apiUserRoles.directorRegional:
          const directorRegional:IUserApiData = await sendDelete(`${API_GESTION_INSPECCIONES_URL}/${REGIONAL_DIRECTORS}/delete`, userId, token);
          break;
        case apiUserRoles.directorTecnico:
          const directorTecnico:IUserApiData = await sendDelete(`${API_GESTION_INSPECCIONES_URL}/${TECHNICAL_DIRECTORS}/delete`, userId, token);
          break;
        case apiUserRoles.inspector:
          const inspector:IUserApiData = await sendDelete(`${API_GESTION_INSPECCIONES_URL}/${INSPECTORS}/delete`, userId, token);
          break;
        case apiUserRoles.programadorAgenda:
          const programadorAgenda:IUserApiData = await sendDelete(`${API_GESTION_INSPECCIONES_URL}/${SCHEDULE_PROGRAMMERS}/delete`, userId, token);
          break;
        default:
          break;
      }

      await getUsers(null, rol);
      setWaiting(false);
    }
    catch(rejected){
      setWaiting(false);
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo eliminar al usuario, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
    }
  }

  const handleDeleteClick = (id: GridRowId, rowInfo:GridRowModel) => async () => {
    setLoadingTable(true);
    const idDelete:number = parseInt(id.toString());
    const rol:string = rowInfo.rol;
    await deleteUserByIdAndRol(idDelete, rol);
    setLoadingTable(false);
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60, headerAlign:'center', align:'center', editable:false, hideable:true },
    { field: 'nombres', headerName: 'Nombres', type:'string', minWidth: 200, maxWidth:500, headerAlign:'center', align:'center', editable:true,
      renderEditCell: (params:GridRenderEditCellParams) => (
        <TextField
          fullWidth
          type='text'
          name={params.field}
          id="editNames"
          label=""
          value={params.formattedValue}
          onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleUserChanges(params, event)}
        />
      )
    },
    { field: 'apellidos', headerName: 'Apellidos', type:'string', minWidth: 200, maxWidth:500, headerAlign:'center', align:'center', editable:true,
      renderEditCell: (params:GridRenderEditCellParams) => (
        <TextField
          fullWidth
          type='text'
          name={params.field}
          id="editLastnames"
          label=""
          value={params.formattedValue}
          onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleUserChanges(params, event)}
        />
      )
    },
    { field: 'email', headerName: 'Email', type:'string', minWidth: 300, maxWidth:350, headerAlign:'center', align:'center', editable:true,
      renderEditCell: (params:GridRenderEditCellParams) => (
        <TextField
          fullWidth
          type='email'
          name={params.field}
          id="editEmail"
          label=""
          value={params.formattedValue}
          onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleUserChanges(params, event)}
        />
      )
    },
    { field: 'telefono', headerName: 'Teléfono', type:'string', minWidth: 150, maxWidth:200, headerAlign:'center', align:'center', editable:true,
      renderEditCell: (params:GridRenderEditCellParams) => (
        <TextField
          fullWidth
          type='tel'
          name={params.field}
          id="editPhone"
          label=""
          value={params.formattedValue}
          onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleUserChanges(params, event)}
        />
      )
    },
    /* { field: 'rol', headerName: 'Rol', type:'string',
      valueFormatter:(params)=>{
        return params.value && params.value.length > 0 ? params.value.replace("_", " ") : "";
      } , 
      minWidth: 250, maxWidth:400, headerAlign:'center', align:'center', editable:false 
    }, */
    {
      field: 'regional',
      headerName: 'Regional',
      minWidth: 200, maxWidth:350, headerAlign:'center', align:'center', editable:false,
      renderCell: (params: GridValueGetterParams) => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
        if(isInEditMode){
          return(
            params.row.rol !== apiUserRoles.programadorAgenda ?
            <Select
              fullWidth
              variant='outlined'
              id='selectRegional'
              name='regional'
              value={params.row.regional && params.row.regional.id && regionalsOpt && regionalsOpt.length > 0 ? params.row.regional.id : ''}
              onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleUserChanges(params, event)}
            >
              {regionalsOpt && regionalsOpt.length > 0 && regionalsOpt.map((regional:IRegionalApiData, index:number) => (
                <MenuItem key={index+regional.id} value={regional.id ? regional.id : ''}>
                  {regional && regional.ciudad ? regional.ciudad : ""}
                </MenuItem>
              ))}
            </Select>
            :
            <>No editable</>
          )
        }
        else{
          return(
            <>{params.row.regional && params.row.regional.ciudad ? params.row.regional.ciudad : ""}</>
          )
        }
      }
    },
    { field: 'competencias', headerName: 'Competencias', type:'string', minWidth: 150, maxWidth:200, headerAlign:'center', align:'center', editable:true,
      renderEditCell: (params:GridRenderEditCellParams) => (
        <TextField
          fullWidth
          type='string'
          name={params.field}
          id="editCompetences"
          label=""
          value={params.formattedValue}
          onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleUserChanges(params, event)}
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id, row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id, row)}
            color="inherit"
          />,
        ];
      },
    },
  ];


  return (
    <main>
      <Container maxWidth="xl" sx={{ m:0, p:0 }}>
        <h2 style={{margin:"10px 0px", textAlign:"center"}}>Ver usuarios</h2>
        <NavLink style={{ marginBottom: 10 }} to={`../${adminAddUserPath}`}>
          <Button variant="outlined" color='primary' startIcon={<PersonAddRounded />}>
            Agregar usuario
          </Button>
        </NavLink>
        <Box sx={{ margin:'10px 0px', display: 'flex', alignItems:'center', justifyContent:'center', gap:2, flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
          {images.map((image) => (
            <ImageButton
              name={image.title}
              focusRipple
              key={image.title}
              style={{
                width: image.width,
                borderRadius:5
              }}
              onClick={getUsers}
              value={image.rol}
            >
              <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
              <ImageBackdrop className="MuiImageBackdrop-root" />
              <Image>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  sx={{
                    position: 'relative',
                    p: 4,
                    pt: 2,
                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                    fontSize:'1.5rem',
                    fontWeight:600
                  }}
                >
                  {image.title}
                  <ImageMarked className="MuiImageMarked-root" />
                </Typography>
              </Image>
            </ImageButton>
          ))}
        </Box>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={showModal}
          onClose={handleCloseModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={showModal}>
            <Box sx={modalStyle}>
              <ThemeProvider theme={darkTheme}>
                <Box sx={{m:0, p:0, display:'flex', alignItems:'center', backgroundColor:"darkslateblue", borderRadius:"10px 10px 0px 0px", color:"white"}}>
                  <h3 style={{width:"100%", textAlign:'center', margin:0, padding:10}}>{userType}</h3>
                  <CloseRoundedIcon id="closeModalIcon" onClick={handleCloseModal} />
                </Box>
                <DataGrid
                  sx={{height:"80vh", width:"100%", backgroundColor:"#101418"}}
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
                  onProcessRowUpdateError={(error) => {console.error(error)}}
                />
              </ThemeProvider>
            </Box>
          </Fade>
        </Modal>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </main>
  )
}

export default ViewUsers