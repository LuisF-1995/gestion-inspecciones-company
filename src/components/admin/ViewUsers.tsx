import React, { useEffect, useState } from 'react'
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
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Button, Container, ThemeProvider, createTheme } from '@mui/material';
import { getUserRoles } from '../../services/globalFunctions';
import { sendPost } from '../../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL } from '../../constants/apis';
import { NavLink } from 'react-router-dom';
import { adminAddUserPath } from '../../constants/routes';


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

const ViewUsers = () => {
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

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
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

  useEffect(() => {
    getUserRolesArray();
  }, [])

  const getUserRolesArray = async() => {
    const roles = await getUserRoles();
    setUserRoles(roles);
  }

  const RegisterUserByRol = async(rol:string, body:{email:string, password:string}) => {
    switch (rol) {
      case "INSPECTOR":
        const loginInspectorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/inspectores/login`, body);
        return loginInspectorResponse;
      case "ASESOR_COMERCIAL":
        const loginAsesorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/asesores-comerciales/login`, body);
        return loginAsesorResponse;
      case "DIRECTOR_REGIONAL":
        const loginDirRegionalResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/directores-regional/login`, body);
        return loginDirRegionalResponse;
      case "DIRECTOR_TECNICO":
        const loginDirTecnicoResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/directores-tecnicos/login`, body);
        return loginDirTecnicoResponse;
      case "PROGRAMADOR_AGENDA":
        const loginProgramadorResponse = await sendPost(`${API_GESTION_INSPECCIONES_URL}/programador-agenda/login`, body);
        return loginProgramadorResponse;
        
      default:
        return null;
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60, headerAlign:'center', editable:false, hideable:true },
    { field: 'nombres', headerName: 'Nombres', type:'string', minWidth: 200, maxWidth:500, headerAlign:'center', align:'center', editable:true },
    { field: 'apellidos', headerName: 'Apellidos', type:'string', minWidth: 200, maxWidth:500, headerAlign:'center', align:'center', editable:true },
    { field: 'email', headerName: 'Email', type:'string', minWidth: 200, maxWidth:300, headerAlign:'center', align:'center', editable:true },
    { field: 'telefono', headerName: 'Teléfono', type:'string', minWidth: 150, maxWidth:200, headerAlign:'center', align:'center', editable:true },
    { field: 'regional', headerName: 'Regional', type:'string', minWidth: 200, maxWidth:350, headerAlign:'center', align:'center', editable:true },
    { field: 'rol', headerName: 'Rol', type:'singleSelect', valueOptions: userRoles, minWidth: 250, maxWidth:400, headerAlign:'center', align:'center', editable:true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
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
    <Container maxWidth="xl" sx={{ m:0, p:0 }}>
      <h2 style={{margin:"10px 0px", textAlign:"center"}}>Ver usuarios</h2>
      <NavLink style={{ marginBottom: 10 }} to={`../${adminAddUserPath}`}>
        <Button variant="outlined" color='primary' startIcon={<PersonAddRounded />}>
          Agregar usuario
        </Button>
      </NavLink>
      <section style={{margin:"10px 0px"}}>
        <ThemeProvider theme={darkTheme}>
          <DataGrid
            sx={{height:"70vh", width:"100%", backgroundColor:"#101418"}}
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
  )
}

export default ViewUsers