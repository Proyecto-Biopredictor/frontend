import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Pagination from '@mui/material/Pagination';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { green, red } from '@material-ui/core/colors';
import { addData } from "../../services/dataService";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
        '& .Mui-disabled': {
            color: "#2f2c33"
        }
    },
    color: {
        background: green["100"]
    },
    button: {
        margin: theme.spacing(1)
    },
    add: {
        backgroundColor: green[600],
    },
    remove: {
        backgroundColor: red[400]
    },
    buttonFixed: {
        position: "fixed"
    }
}))

function CreateData() {
    const { pid, bid } = useParams();
    const [factors, setFactors] = useState([]);
    const [factorsObj, setFactorsObj] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const classes = useStyles()
    const [inputFields, setInputFields] = useState([]);
    const [page, setPage] = React.useState(0);
    const [count, setCount] = React.useState(0);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    function wrapValues(factors, facObj) {
        setFactors(factors);
        setFactorsObj(facObj);
        cleanData(facObj);
        setLoading(false);
        setCount(1);
        setPage(1);
    }

    async function getAllFactors() {
        try {
            const response = await axios.get(
                `https://backend-ic7841.herokuapp.com/api/private/factorbioprocess/${bid}`,
                config
            );
            let facObj = { "fecha": "", "hora": "" };
            response.data.factors.forEach(factor => {
                facObj[factor.name] = "";
            });
            wrapValues(response.data.factors, facObj);


        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authentication failed!");
        }
    }

    useEffect(() => {
        let unmounted = false;
        getAllFactors();
        return () => { unmounted = true; };
    }, []);

    const cleanData = (facObj) => {
        let first = Object.assign({}, facObj);
        first.fecha = '2021-09-08'
        first.hora = "00:00"
        first.id = uuidv4();
        setInputFields([first])
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const parseInput = () => {
        let data = {
            "bioprocessID": bid,
            "placeID": pid,
            "values": []
        };

        inputFields.forEach(inputField => {
            let element = {};
            element.timestamp = inputField.fecha + "T" + inputField.hora;
            element.values = {};
            factors.forEach(factor => {
                element.values[factor.name] = inputField[factor.name];
            });

            data.values.push(element);
        });

        return data;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let data = parseInput();

        try {
            addData(data).then(cleanData(factorsObj));
        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authentication failed!");
        }
    };

    const handleChangeInput = (id, event) => {
        const newInputFields = inputFields.map(i => {
            if (id === i.id) {
                i[event.target.name] = event.target.value
            }
            return i;
        })

        setInputFields(newInputFields);
    }

    const handleAddFields = () => {
        let newColumn = Object.assign({}, factorsObj);
        newColumn.fecha = '2021-09-08';
        newColumn.hora = "00:00";
        newColumn.id = uuidv4(); //for (x in a){b[x] = 1}

        setInputFields([...inputFields, newColumn]);

        let con = inputFields.length + 1;
        let result = con % 3 === 0 ? parseInt(con / 3) : 1 + parseInt(con / 3);
        if (result > count) {
            setCount(result);
        }
        if (page < result) {
            setPage(result);
        }
    }

    const handleRemoveFields = id => {
        const values = [...inputFields];
        values.splice(values.findIndex(value => value.id === id), 1);
        setInputFields(values);

        let con = inputFields.length - 1;
        let result = con % 3 === 0 ? parseInt(con / 3) : 1 + parseInt(con / 3);
        if (result < count) {
            setCount(result);
            setPage(result);
        }
    }

    return (
        <Container>
            <PageHeader
                title="Añadir datos al lugar"
                subTitle="Al crear los datos, se podrá realizar la predicción"
                icon={<InfoIcon fontSize="Large"
                />}
            />
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
                <br />
            </div>
            <form className={classes.root} onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Pagination
                        variant="outlined"
                        color="standard"
                        count={count}
                        siblingCount={0}
                        boundaryCount={2}
                        page={page}
                        onChange={handleChangePage}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start'
                    }}
                >
                    <div>
                        <Box>
                            <TextField
                                label="Fecha"
                                variant="outlined"
                                disabled
                                size="small"
                                className={classes.color}
                            />
                        </Box>
                        <Box>
                            <TextField
                                label="Hora"
                                variant="outlined"
                                disabled
                                size="small"
                                className={classes.color}
                            />
                        </Box>
                        {factors.map(factor => (
                            <Box>
                                <TextField
                                    label={factor.name}
                                    variant="outlined"
                                    disabled
                                    size="small"
                                    className={classes.color}
                                />
                            </Box>
                        ))}
                    </div>
                    {inputFields.map(inputField => (
                        <div key={inputField.id} hidden={3 * page - inputFields.indexOf(inputField) >= 1 && 3 * page - inputFields.indexOf(inputField) <= 3 ? false : true}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <TextField
                                    type='date'
                                    name="fecha"
                                    defaultValue='2021-09-08'
                                    variant="outlined"
                                    size="small"
                                    onChange={event => handleChangeInput(inputField.id, event)}
                                />
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <TextField
                                    type='time'
                                    name="hora"
                                    defaultValue='00:00'
                                    size="small"
                                    variant="outlined"
                                    onChange={event => handleChangeInput(inputField.id, event)}
                                />
                            </Box>
                            {factors.map(factor => (
                                <Box>
                                    <TextField
                                        type='number'
                                        name={factor.name}
                                        label=""
                                        size="small"
                                        variant="outlined"
                                        onChange={event => handleChangeInput(inputField.id, event)}
                                    />
                                </Box>
                            ))}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <IconButton title="Remover columna" disabled={inputFields.length === 1} onClick={() => handleRemoveFields(inputField.id)}>
                                    <Avatar className={classes.remove}>
                                        <RemoveIcon />
                                    </Avatar>
                                </IconButton>
                            </Box>
                        </div>
                    ))}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    >
                        <IconButton style={{ position: "fixed" }} disabled={inputFields.length === 0} var
                            onClick={handleAddFields} title="Añadir nueva columna"
                        >
                            <Avatar className={classes.add}>
                                <AddIcon />
                            </Avatar>
                        </IconButton>
                    </Box>
                </Box>
                <Box>
                    <Button style={{ position: "fixed" }}
                        className={classes.button}
                        variant="contained"
                        type="submit"
                        color="primary"
                        onClick={handleSubmit}
                    >Guardar datos ingresados</Button>
                </Box>
            </form>
        </Container>
    );
}

export default CreateData;