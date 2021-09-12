import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";
import { useHistory } from "react-router-dom";
import Controls from "../../components/controls/Controls";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import React from 'react'


const Register = ({ }) => {
  const history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const [isUser, setUser] = React.useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("user");
  const [roleType, setRole] = useState("investigador");
  const [error, setError] = useState("");
  const [items, setItems] = React.useState([{name:""}]);
  const [selected, setSelected] = React.useState(false);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };  
  function wrapValues(bioprocesses){
    setItems(bioprocesses);
    setLoading(false);
  }
  
  useEffect(() =>{
    let unmounted = false;
    async function getBio(){
      try {
        const bioprocesses = await axios.get(
          "api/private/bioprocess",
          config
        );
        wrapValues(bioprocesses.data.bioprocesses);

        
      } catch (error) {
        setTimeout(() => {
          setError("Authentication failed!");
        }, 5000);
        return setError("Authentication failed!");
      }
    }
    getBio();
    return () => {    unmounted = true;  };
  }, []);

  const [value, setValue] = React.useState(items[0]);
  const [inputValue, setInputValue] = React.useState('');

  const roleItems = [
    { id: 'investigador', title: 'Investigador' },
    { id: 'asistente', title: 'Asistente' },
  ]

  const typeItems = [
    { id: 'user', title: 'Usuario' },
    { id: 'admin', title: 'Administrador' },
  ]

  const registerHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Las contraseñas no coinciden");
    }
    if (selected===false && type === 'user'){
      
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Seleccione un bioproceso");
    }
      

    try {
      const role = {
        bioprocessId: value.id,
        role: roleType 
      }
      const { data } = await axios.post(
        "api/private/register",
        {
          username,
          email,
          password,
          type,
          role
        },
        config
      );
      history.push("/");
      } catch (error) {
      console.log(error);
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
      }
  };

  return (
    <div className="register-screen">
      <form onSubmit={registerHandler} className="register-screen__form">
        <h3 className="register-screen__title">Crear una cuenta</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="name">Usuario:</label>
          <input
            type="text"
            required
            id="name"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirmar Contraseña:</label>
          <input
            type="password"
            required
            id="confirmpassword"
            autoComplete="true"
            placeholder="Confirmar contraseña"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Controls.RadioGroup
            name="type"
            label="Tipo de usuario"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              if(type === 'admin')
                setUser(false);
              else
                setUser(true);
              

            }}
            items={typeItems}
        />
        <br/>
        <div hidden = {isUser}> 
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              setSelected(true);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="combo-box-demo"
            options={items}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Bioprocesos" variant="outlined" />}
            disabled = {loading}
            disableClearable
          />
          <br/>
          <Controls.RadioGroup
            name="role"
            label="Tipo de rol"
            value={roleType}
            onChange={(e) => {setRole(e.target.value);}}
            items={roleItems}
        />
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Registrar Cuenta
        </button>
      </form>
    </div>
  );
};

export default Register;
