import './App.css';

import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import { makeStyles, CssBaseline, createTheme, ThemeProvider, Box } from '@material-ui/core';
import Bioprocesses from './pages/Bioprocess/Bioprocesses';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/User/Login';
import Home from './pages/Home'
import RequireAuth from './components/routing/RequireAuth';
import Register from './components/User/Register'

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
              <Bioprocesses />
            </RequireAuth>

            <RequireAuth exact path='/register'>
              <Header />
              <SideMenu />
              <Register />
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
