import React from "react";
import { useState } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function Register() {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [passConfirmation, setPassConfirmation] = useState("");

    const handleSubmit = () => {
        console.log(user);
        console.log(email);
        console.log(pass);
        console.log(passConfirmation);
    
        if(pass === passConfirmation){

            let data = {"username" : user, "email" : email,  "password" : pass};

            const config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }
              };
              console.log(config);
          
              axios.post("https://backend-ic7841.herokuapp.com/api/auth/register", data, config)
              .then(console.log).catch(console.log);
          
        
        }

        //TODO SHOW USER ERROR
          
    
        
      };

    return (
        <div>
            <h2 id="transition-modal-title">Crear nota nueva</h2>
            <form>
                <TextField
                    id="user"
                    label="Nombre de Usuario"
                    fullWidth
                    defaultValue=""
                    variant="outlined"
                    onChange={(event) => {
                        setUser(event.target.value);
                    }}
                />
                <br />
                <br />
                <TextField
                    id="email"
                    label="Correo electrónico"
                    fullWidth
                    defaultValue=""
                    variant="outlined"
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <br />
                <br />
                <TextField
                    id="pass"
                    label="Contraseña"
                    fullWidth
                    defaultValue=""
                    type="password"
                    variant="outlined"
                    onChange={(event) => {
                        setPass(event.target.value);
                    }}
                />
                <br />
                <br />
                <TextField
                    id="passConfirmation"
                    label="Confirmar Contraseña"
                    fullWidth
                    defaultValue=""
                    type="password"
                    variant="outlined"
                    onChange={(event) => {
                        setPassConfirmation(event.target.value);
                    }}
                />
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Registrar
                </Button>
            </form>
        </div>
    );
}
