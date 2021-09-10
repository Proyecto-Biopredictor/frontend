import './App.css';

import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import { makeStyles, CssBaseline, createTheme, ThemeProvider, Box } from '@material-ui/core';
import Bioprocesses from './pages/Bioprocess/Bioprocesses';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from "./components/routing/PrivateRoute";
import Login from './components/User/Login';
import Home from './pages/Home'

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
  }
})

function App() {
  const classes = useStyles();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        

        <div className={classes.appMain}>
        <Box m={10}></Box>
          
          <Switch>
            <PrivateRoute exact path='/'>   
              <Header />
              <SideMenu />           
              <Home/>
            </PrivateRoute>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path='/bioprocess/create'>
              <Header />
              <SideMenu />
              <Bioprocesses />
            </PrivateRoute>
          </Switch>

        </div>
        <CssBaseline />
      </ThemeProvider>
    </Router>
  );
}

export default App;
