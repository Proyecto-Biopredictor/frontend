import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";
import { useHistory } from "react-router-dom";
import Controls from "../../components/controls/Controls";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';

const AssignRole = ({ }) => {
    const history = useHistory();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = useState("");
    const [bioprocesses, setBioprocesses] = React.useState([{ name: "" }]);
    const [users, setUsers] = React.useState([{ username: " " }]);
    const [selectedUser, setSelectedUser] = React.useState(false);
    const [selectedBioprocess, setSelectedBioprocess] = React.useState(false);
    const [roleType, setRole] = useState("investigador");
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };
    function wrapUsers(users) {

        setUsers(users);

        setLoading(false);
    }

    function wrapBioprocesses(bioprocesses) {
        setBioprocesses(bioprocesses);
        setLoading(false);
        setSelectedUser(true);
    }

    async function getBio(userValue) {
        try {
            setLoading(true);
            setSelectedUser(false);
            const bioprocesses = await axios.get(
                `https://backend-ic7841.herokuapp.com/api/private/filteredbioprocess/${userValue.id}`,
                config
            );
            wrapBioprocesses(bioprocesses.data.bioprocesses);


        } catch (error) {
            setTimeout(() => {
                setError("Authentication failed!");
            }, 5000);
            setLoading(false);
            return setError("Authentication failed!");
        }
    }

    useEffect(() => {
        let unmounted = false;
        async function getUsers() {
            try {
                const users = await axios.get(
                    "https://backend-ic7841.herokuapp.com/api/private/users/",
                    config
                );
                wrapUsers(users.data.users);


            } catch (error) {
                setTimeout(() => {
                    setError("Authentication failed!");
                }, 5000);
                setLoading(false);
                return setError("Authentication failed!");
            }
        }


        getUsers();
        return () => { unmounted = true; };
    }, []);

    const [bioprocessValue, setbioprocessValue] = React.useState(bioprocesses[0]);
    const [userValue, setuserValue] = React.useState(users[0]);

    const roleItems = [
        { id: 'investigador', title: 'Investigador' },
        { id: 'asistente', title: 'Asistente' },
    ]


    const registerHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (selectedUser === false || selectedBioprocess === false) {

            setTimeout(() => {
                setError("");
            }, 5000);
            setLoading(false)
            return setError("Seleccione un bioproceso");
        }


        try {
            const role = {
                bioprocessId: bioprocessValue.id,
                role: roleType
            }
            userValue.roles.push(role);
            const { data } = await axios.patch(
                `https://backend-ic7841.herokuapp.com/api/private/users/${userValue.id}`,
                {
                    username: userValue.username,
                    email: userValue.email,
                    type: userValue.type,
                    roles: userValue.roles
                },
                config
            );
            setLoading(false);
            history.push("/");
        } catch (error) {
            console.log(error);
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    const useStyles = makeStyles(() => ({
        placeholder: {
            height: 40,
            textAlign: 'center'
        },
    }));
    const classes = useStyles();
    return (

        <div className="register-screen">

            <form onSubmit={registerHandler} className="register-screen__form">
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
                
                <h3 className="register-screen__title">Asignar rol a usuario existente</h3>
                {error && <span className="error-message">{error}</span>}
                <br />
                <div >
                    <Autocomplete
                        value={userValue}
                        onChange={(event, newValue) => {
                            setuserValue(newValue);
                            setSelectedUser(true);
                            setSelectedBioprocess(false);
                            console.log(newValue);
                            getBio(newValue);
                        }}
                        id="combo-box-users"
                        options={users}
                        getOptionLabel={(option) => option.username}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Usuarios" variant="outlined" />}
                        disabled={loading}
                        disableClearable
                    />
                    <br />
                    <Autocomplete
                        value={bioprocessValue}
                        onChange={(event, newValue) => {
                            setbioprocessValue(newValue);
                            setSelectedBioprocess(true);
                        }}
                        id="combo-box-assign"
                        options={bioprocesses}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Bioprocesos" variant="outlined" />}
                        disabled={!selectedUser}
                        disableClearable
                    />
                    <br />
                    <Controls.RadioGroup
                        name="role"
                        label="Tipo de rol"
                        value={roleType}
                        onChange={(e) => { setRole(e.target.value); }}
                        items={roleItems}
                    />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                    Asignar rol
                </button>
            </form>
        </div>
    );
};

export default AssignRole;
