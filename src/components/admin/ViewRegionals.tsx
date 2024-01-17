import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { adminAddRegionalPath, adminAddUserPath, adminLoginPath } from '../../constants/routes';
import { localTokenKeyName } from '../../constants/globalConstants';
import { sendDelete, sendGet, sendPost, sendPut } from '../../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis';
import Swal from 'sweetalert2';
import { IRegionalApiData, IUserApiData } from '../Interfaces';
import { Backdrop, Button, CircularProgress, Container, MenuItem, Select, SelectChangeEvent, ThemeProvider, createTheme } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridEventListener, GridFilterModel, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const initialRows: GridRowsProp = [
];


const ViewRegionals = () => {
  const navigate = useNavigate();
  const { regionalId } = useParams();
  const [token, setToken] = useState("");
  const [regionalInfo, setRegionalInfo] = useState(null);
  const [regionalDirectorsOpt, setRegionalDirectorsOpt] = useState<IUserApiData[]>([]);
  const [waiting, setWaiting] = useState(false);
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

  useEffect(() => {
    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localTokenKeyName);
      setToken(jwtToken);

      if(regionalId && regionalId != undefined)
        getRegionalInfoById(regionalId, jwtToken);
      else
        getRegionalsInfo(jwtToken);
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
  }, [regionalId])

  useEffect(()=>{
    if(sessionStorage.length > 0){
      const jwtToken:string = sessionStorage.getItem(localTokenKeyName);
      getRegionalDirectors(jwtToken);
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

  const getRegionalInfoById = async (idRegional:string|number, jwtToken:string) => {
    setWaiting(true);

    if(jwtToken){
      try {
        const regionalInfo = await sendGet(`${API_GESTION_INSPECCIONES_URL}/regionales/id/${idRegional}`, jwtToken);
        setWaiting(false);

        if(regionalInfo && regionalInfo.status === 200 && regionalInfo.data){
          const regionalData = regionalInfo.data;
          setRegionalInfo(regionalData);
        }
      }
      catch (error) {
        setWaiting(false);
        sessionStorage.clear();
      }
    }
  }

  const getRegionalsInfo = async(jwtToken:string) => {
    setLoadingTable(true);

    if(jwtToken){
      try {
        const regionalsInfo = await sendGet(`${API_GESTION_INSPECCIONES_URL}/regionales`, jwtToken);
        setWaiting(false);
        setLoadingTable(false);

        if(regionalsInfo && regionalsInfo.status === 200 && regionalsInfo.data){
          const regionalsData:IRegionalApiData[]|any = regionalsInfo.data;
          const regionalDataArray = regionalsData.map((regional:IRegionalApiData) => ({
            ...regional,
            directorRegional: regional.directorRegional === null || regional.directorRegional === undefined ? "" : `${regional.directorRegional.nombres} ${regional.directorRegional.apellidos}`
          }));
          setRegionalInfo(regionalsData);
          setRows(regionalsData);
        }
      }
      catch (error) {
        setLoadingTable(false);
        setWaiting(false);
        sessionStorage.clear();
      }
    }
  }
  
  const getRegionalDirectors = async (jwtToken:string) => {
    setWaiting(true);

    if(jwtToken){
      try {
        const regionalDirectors = await sendGet(`${API_GESTION_INSPECCIONES_URL}/directores-regional/all`, jwtToken);
        setWaiting(false);

        if(regionalDirectors && regionalDirectors.status === 200 && regionalDirectors.data){
          const regionalDirectorsArray:any[] = regionalDirectors.data;
          setRegionalDirectorsOpt(regionalDirectorsArray);
        }
      }
      catch (error) {
        setWaiting(false);
        sessionStorage.clear();
      }
    }
  }

  const handleRegionalDirectorSelector = async (rowId:GridRowId, selectedRegionalDirectorId:SelectChangeEvent<number>|any) => {
    if(selectedRegionalDirectorId === "AddDirRegional"){
      navigate(`../${adminAddUserPath}`);
    }
    else{
      const regionalDirectorUpdate:IUserApiData = {
        id: parseInt(selectedRegionalDirectorId.toString()),
        regional: parseInt(rowId.toString())
      }
  
      if(sessionStorage.length > 0){
        const jwtToken:string = sessionStorage.getItem(localTokenKeyName);
        await updateRegionalDirector(jwtToken, regionalDirectorUpdate);
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
    }
  };

  const updateRegionalDirector = async (jwtToken:string, dataUpdate:IUserApiData) => {
    setWaiting(true);

    try{
      const regionalDirectorUpdateResponse:IUserApiData|any|null = await sendPut(`${API_GESTION_INSPECCIONES_URL}/directores-regional/update`, dataUpdate, token);
      await getRegionalDirectors(jwtToken);
      await getRegionalsInfo(jwtToken);
      setWaiting(false);
    }
    catch(rejected){
      setWaiting(false);
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo actualizar la información, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
    }

  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const updateRegional = async (data:IRegionalApiData|any) => {
    setWaiting(true);

    try{
      const regionalUpdateResponse:IRegionalApiData|any|null = await sendPut(`${API_GESTION_INSPECCIONES_URL}/regionales/update`, data, token);
      setWaiting(false);
    }
    catch(rejected){
      setWaiting(false);
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo actualizar la información, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
    }
  }

  const handleSaveClick = (id: GridRowId, row:IRegionalApiData) => async () => {
    
    const regionalUpdateObj = {
      id: row.id,
      ciudad: row.ciudad
    }

    await updateRegional(regionalUpdateObj);
    
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };


  const deleteRegionalById = async (id:number) => {
    setWaiting(true);

    try{
      const regionalUpdateResponse:IRegionalApiData|any|null = await sendDelete(`${API_GESTION_INSPECCIONES_URL}/regionales/delete`, id, token);
      setWaiting(false);
    }
    catch(rejected){
      setWaiting(false);
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo actualizar la información, verificar conexión a internet o comunicate con nosotros.`,
        icon: 'error'
      })
    }
  }

  const handleDeleteClick = (id: GridRowId) => async () => {
    const idDelete = parseInt(id.toString());
    await deleteRegionalById(idDelete);

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
    { field: 'id', headerName: 'ID', type:'number', width: 60, headerAlign:'center', editable:false, hideable:true },
    { field: 'ciudad', headerName: 'Ciudad', type:'string', minWidth: 200, maxWidth:500, headerAlign:'center', align:'center', editable:true },
    {
      field: 'directorRegional',
      headerName: 'Director Regional',
      minWidth: 500, maxWidth:800, headerAlign:'center', align:'center', editable:false,
      renderCell: (params: GridValueGetterParams) => (
        <Select
          fullWidth
          variant='outlined'
          value={params.row.directorRegional ? params.row.directorRegional.id : ""}
          onChange={(e) => handleRegionalDirectorSelector(params.row.id, e.target.value)}
        >
          <MenuItem key={"AgregarRD"} value={"AddDirRegional"}>
            <Button fullWidth variant="outlined" color='primary' startIcon={<PersonAddRounded />}>
              Agregar usuario
            </Button>
          </MenuItem>
          {regionalDirectorsOpt && regionalDirectorsOpt.length > 0 && regionalDirectorsOpt.map((regionalDirector:IUserApiData) => (
            <MenuItem key={regionalDirector.id} value={regionalDirector.id}>
              {`${regionalDirector.nombres} ${regionalDirector.apellidos}`}
            </MenuItem>
          ))}
        </Select>
      ),
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
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <main>
      {regionalId && regionalId != undefined ?
        <Container maxWidth="xl" sx={{ m:0, p:0 }}>
          <h3 style={{margin:"10px 0px", textAlign:"center"}}>Gestionar {regionalInfo && regionalInfo.ciudad ? `regional ${regionalInfo.ciudad}` : "regionales"}</h3>
        </Container>
        :
        <Container maxWidth="xl" sx={{ m:0, p:0 }}>
          <h3 style={{margin:"10px 0px", textAlign:"center"}}>Gestionar regionales</h3>
          <NavLink style={{ marginBottom: 10 }} to={`../${adminAddRegionalPath}`}>
            <Button variant="outlined" color='primary'>
              Agregar regional
            </Button>
          </NavLink>
          <section style={{margin:"10px 0px"}}>
            <ThemeProvider theme={darkTheme}>
              <DataGrid
                sx={{height:"70vh",  width:"100%", backgroundColor:"#101418"}}
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
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                checkboxSelection
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                loading={loadingTable}
              />
            </ThemeProvider>
          </section>
        </Container>
      }
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </main>
  )
}

export default ViewRegionals;