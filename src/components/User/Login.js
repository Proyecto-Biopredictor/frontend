import React, { useState, useEffect, } from "react";
import axios from "axios";
import "./Login.css";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: '50px 0 0 0',
    width: '90%',
    padding: theme.spacing(3)
  },
  placeholder: {
    height: 40,
    textAlign: 'center'
  },
}))

const Login = ({ history }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history]);

  const login = async () => {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "https://backend-ic7841.herokuapp.com/api/auth/login",
        { email, password },
        config
      );

      localStorage.setItem("authToken", data.token);

      history.push("/");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login();
    setLoading(false);



  };

  return (
    <div>
      <div className="login-screen">

        <form onSubmit={loginHandler} className="login-screen__form">
        <div className={classes.placeholder} hidden={!loading}>
                    <Fade
                        in={loading}
                        style={{
                            transitionDelay: '0m',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                    <br/>
                </div>
          <h3 className="login-screen__title">Inicia Sesión</h3>
          {error && <span className="error-message">{error}</span>}
          <div className="form-group">
            <label htmlFor="email">Correo:</label>
            <input
              type="email"
              required
              id="email"
              placeholder="Correo"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              tabIndex={1}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Contraseña:{" "}
            </label>
            <input
              type="password"
              required
              id="password"
              autoComplete="true"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              tabIndex={2}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Inicia Sesión
          </button>
        </form>
      </div>
    </div>

  );
};

export default Login;