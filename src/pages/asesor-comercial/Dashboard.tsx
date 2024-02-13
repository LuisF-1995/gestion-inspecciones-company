import React, { useEffect, useState } from 'react';
import { sendGet } from '../../services/apiRequests';
import { API_GESTION_INSPECCIONES_URL, COMMERCIAL_ADVISORS } from '../../constants/apis';
import { localUserIdKeyName, localUserTokenKeyName } from '../../constants/globalConstants';
import { commercialAdvisorRoutes } from '../../constants/routes';
import Swal from 'sweetalert2';
import ViewProjects from '../../components/commercialAdvisor/ViewProjects';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ICommercialAdvisor, IUserApiData } from '../../components/Interfaces';
import { Logout } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { AppBar, Avatar, Backdrop, Badge, Box, CircularProgress, Divider, IconButton, ListItemIcon, Menu, MenuItem, ThemeProvider, Toolbar, Tooltip, Typography, createTheme } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});


const AsesorDashboard = () => {
  const navigate = useNavigate();
  const commercial = "Cotizaciones";
  const pages = [
    {
      name: commercial,
      path: `${commercialAdvisorRoutes.quotes}`,
      items: [
        {
          name: "Agregar",
          path: ``,
        },
      ]
    }
  ];
  const [waiting, setWaiting] = useState(true);
  const [userInfo, setUserInfo] = useState<ICommercialAdvisor>(null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const openNotifications = Boolean(anchorElNotifications);
  const [notifications, setNotifications] = useState<string[]>([]);


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorElNotifications(event.currentTarget);
  };
  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const goToProfile = () => {
    setAnchorElUser(null);
    navigate(`${commercialAdvisorRoutes.profile}`);
  }

  const handleCloseSession = () => {
    setAnchorElUser(null);
    localStorage.clear();
    navigate(`../`);
  }

  useEffect(() => {
    if(localStorage.length > 0){
      getUserInfo();
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
          navigate(`../`);
        }
        else
          setTimeout(() => {
            Swal.close();
            navigate(`../`);
          }, 5000);
      })
    }
  }, [])
  
  const getUserInfo = async() => {
    const userId = localStorage.getItem(localUserIdKeyName);
    const jwtToken = localStorage.getItem(localUserTokenKeyName);

    if(userId && jwtToken){
      try {
        const userInfoApi = await sendGet(`${API_GESTION_INSPECCIONES_URL}/${COMMERCIAL_ADVISORS}/id/${userId}`, jwtToken);
        setWaiting(false);
        if(userInfoApi && userInfoApi.status === 200 && userInfoApi.data)
          setUserInfo(userInfoApi.data);
        else{
          setUserInfo(null);
          Swal.fire({
            title: 'Expiró la sesión',
            text: `La sesión expiró, debe volver a iniciar sesión`,
            icon: 'info',
            confirmButtonText: "Iniciar sesión"
          })
          .then(option => {
            localStorage.clear();
            if(option.isConfirmed){
              Swal.close();
              navigate(`../`);
            }
            else
              setTimeout(() => {
                Swal.close();
                navigate(`../`);
              }, 5000);
          })
        }
      } 
      catch (error) {
        setWaiting(false);
        localStorage.clear();
      }
    }
  }

  return (
    userInfo ?
    <main>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color='primary'>
          <Toolbar style={{minHeight:"50px !important"}}>
            <NavLink to={""}>
              <IconButton sx={{ display: { xs: 'none', md: 'flex' }, m:0, p:0, width:50, height:50 }} >
                <HomeRoundedIcon sx={{width:"100%", height:"100%"}} />
              </IconButton>
            </NavLink>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent:'center', alignItems: "center", height:50, gap: "5px" }}>
              {pages.map((page:{name:string, path:string, items:any[]}, index:number) => (
                <div key={index}
                  onMouseEnter={() => setActiveSubMenu(index)} 
                  onMouseLeave={() => setActiveSubMenu(null)}
                  style={{height:"100%", zIndex:1}}
                >
                  <NavLink  to={page.path} className="nav-bar-option"
                    style={({ isActive, isPending, isTransitioning }) => {
                      return {
                        textDecoration: "none",
                        display: "flex",
                        borderBottom: isActive ? "2px solid white" : "",
                        color: isPending ? "red" : "white",
                        viewTransitionName: isTransitioning ? "slide" : "",
                      };
                    }} >
                    {page.name}
                  </NavLink>
                  {activeSubMenu === index && page.items && page.items.length > 0 && (
                    <ul style={{position:"absolute", margin:0, padding:6, backgroundColor:"#272727", listStyle:"none", borderRadius:5}}>
                      {page.items.map((item, itemIndex) => (
                        <li key={itemIndex} style={{height:30}}>
                          <NavLink to={item.path} className="menuoption-subitem"
                            style={({ isActive, isPending, isTransitioning }) => {
                              return {
                                textDecoration: "none",
                                display: "flex",
                                color: isPending ? "red" : "white",
                                viewTransitionName: isTransitioning ? "slide" : "",
                              };
                            }}
                          >
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Box>
  
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page:{name:string, path:string, items:any[]}, index:number) => (
                  <Link key={index} to={page.path} style={{textDecoration: "none", color:"white"}}>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
            
            <HomeRoundedIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="h5"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Link to={""} style={{textDecoration: "none", color:"white"}}>HOME</Link>
            </Typography>
            
            {/* ================> Notifications section <================= */}
            <Box sx={{ display: { xs: 'flex', md: 'flex' }, paddingRight:2 }}>
              <Tooltip
                title={"Ver notificaciones"} 
                placement='bottom'
                arrow>
                <IconButton
                  size="large"
                  aria-label="show notifications"
                  color="inherit"
                  onClick={handleOpenNotifications}
                >
                  <Badge badgeContent={notifications.length} color="error" max={99}>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              id="notificationsMenu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorElNotifications}
              open={openNotifications}
              onClose={handleCloseNotifications}
              PaperProps={{
                style: {
                  maxHeight: "60vh",
                  minWidth: 200,
                  maxWidth: "40vw",
                },
              }}
            >
              {notifications && notifications.length > 0 ? 
                notifications.map((notification, index:number) => (
                  <Tooltip
                    key={index}
                    title={<p style={{fontSize:"0.9rem"}}>{notification}</p>} 
                    placement='top-start'
                    arrow>
                    <MenuItem /* selected={notification === 'None'} */ onClick={handleCloseNotifications}>
                      {notification}
                    </MenuItem>
                  </Tooltip>
                ))
                :
                <p style={{margin:0, textAlign:"center"}}>Todo está al dia</p>
              }
            </Menu>
            {/* ========================================================= */}

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Mi cuenta">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar children={userInfo.nombres && userInfo.nombres.length > 0 && userInfo.nombres.includes(" ") ? `${userInfo.nombres.split(' ')[0][0]}${userInfo.nombres.split(' ')[1][0]}`: userInfo.nombres && userInfo.nombres.length > 0 ? userInfo.nombres[0] : "NA"} alt={userInfo.nombres ? userInfo.nombres:""} src="/static/images/avatar.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                id="menu-user"
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                keepMounted
              >
                <MenuItem key="user-profile" onClick={goToProfile}>
                  <Avatar /><Typography textAlign="center">Mi perfil</Typography>
                </MenuItem>
                <Divider/>
                <MenuItem key="close-session" onClick={handleCloseSession}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      {window.location.pathname === `/${commercialAdvisorRoutes.root}` ?
        <ViewProjects commercialProjects={userInfo.proyectosAsesor}/>
        :
        <Outlet/>
      }
    </main>
    :
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={waiting}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default AsesorDashboard