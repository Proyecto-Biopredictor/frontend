import './App.css';

import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import { makeStyles, CssBaseline, createTheme, ThemeProvider, Box } from '@material-ui/core';
import CreateBioprocess from './pages/Bioprocess/CreateBioprocess';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/User/Login';
import Home from './pages/Home'
import RequireAuth from './components/routing/RequireAuth';
import Register from './components/User/Register'
import AssignRole from './components/User/AssignRole';
import ViewBioprocesses from './pages/Bioprocess/ViewBioprocesses'
import ShowBioprocess from './pages/Bioprocess/ShowBioprocess';
import UpdateBioprocess from './pages/Bioprocess/UpdateBioprocess';
import UpdateFactor from './pages/Factors/UpdateFactor';
import CreateFactor from './pages/Factors/CreateFactor';
import ShowPlace from './pages/Place/ShowPlace';
import ViewPlace from './pages/Place/ViewPlace';
import CreatePlace from './pages/Place/CreatePlace';

const theme = createTheme({
  palette: {
    primary: {
      main: "#33963a",
      light: '#3c44b126'
    },
    secondary: {
      main: "#f83245",
      light: '#f8324526'
    },
    background: {
      default: "#f4f5fd"
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)'
      }
    }
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  }
})


const useStyles = makeStyles({
  appMain: {
    paddingLeft: '320px',
    width: '100%'
  },
})

function App() {
  const classes = useStyles();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div>
          <Switch>
            <Route exact path="/login" component={Login}/>
          </Switch>
        </div>

        <div className={classes.appMain}>
        <Box m={10}></Box>
          
          <Switch>
            <RequireAuth exact path='/'>   
              <Header />
              <SideMenu />           
              <Home/>
            </RequireAuth>
            
            <RequireAuth exact path='/bioprocess/create'>
              <Header />
              <SideMenu />
              <CreateBioprocess />
            </RequireAuth>

            <RequireAuth exact path='/factor/create'>
              <Header />
              <SideMenu />
              <CreateFactor />
            </RequireAuth>

            <RequireAuth exact path='/bioprocess/'>
              <Header />
              <SideMenu />
              <ViewBioprocesses />
            </RequireAuth>

            <RequireAuth exact path='/bioprocess/show/:id'>
              <Header />
              <SideMenu />
              <ShowBioprocess />
            </RequireAuth>

            <RequireAuth exact path='/bioprocess/update/:id'>
              <Header />
              <SideMenu />
              <UpdateBioprocess />
            </RequireAuth>

            <RequireAuth exact path='/register'>
              <Header />
              <SideMenu />
              <Register />
            </RequireAuth>

            <RequireAuth exact path='/assignRole'>
              <Header />
              <SideMenu />
              <AssignRole />
            </RequireAuth>

            <RequireAuth exact path='/factor/update/:id'>
              <Header />
              <SideMenu />
              <UpdateFactor />
            </RequireAuth>

            <RequireAuth exact path='/place/show/:id'>
              <Header />
              <SideMenu />
              <ShowPlace />
            </RequireAuth>

            <RequireAuth exact path='/place/create'>
              <Header />
              <SideMenu />
              <CreatePlace />
            </RequireAuth>


            <RequireAuth exact path='/place/'>
              <Header />
              <SideMenu />
              <ViewPlace />
            </RequireAuth>

            <Redirect to="/login" />
          </Switch>

        </div>
        <CssBaseline />
      </ThemeProvider>
    </Router>
  );
}

export default App;
