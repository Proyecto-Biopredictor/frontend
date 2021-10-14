import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Pagination from '@mui/material/Pagination';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import Typography from '@mui/material/Typography';

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
    }
}))

function ViewData() {
    const { pid, bid } = useParams();
    const [factors, setFactors] = useState([]);
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

    function wrapValues(factors) {
        setFactors(factors);
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

            wrapValues(response.data.factors);


        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authentication failed!");
        }
    }

    async function getAllData() {
        try {
            const response = await axios.get(
                `https://backend-ic7841.herokuapp.com/api/private/record/${bid}/${pid}`,
                config
            );

            let parse = parseData(response.data.records);
            setInputFields(parse);

            let con = parse.length;
            setCount(con % 3 === 0 ? parseInt(con / 3) : 1 + parseInt(con / 3));

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
        getAllFactors().then(getAllData());
        return () => { unmounted = true; };
    }, []);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const parseData = (records) => {
        let inputs = [];
        records.forEach(element => {
            let input = {};

            input.id = element.id;
            let date = element.timestamp.split("T");
            input.fecha = date[0];
            input.hora = date[1];

            for (let value in element.values[0]) {
                input[value] = element.values[0][value];
            }
            inputs.push(input);
        });

        return inputs;
    }

    return (
        <Container>
            <PageHeader
                title="Datos incluidos en el lugar"
                subTitle="Se muestran todos los datos asociados a este lugar y bioproceso"
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Pagination
                    sx={{ mt: 1 }}
                    size="large"
                    variant="outlined"
                    color="standard"
                    count={count}
                    siblingCount={0}
                    boundaryCount={2}
                    page={page}
                    onChange={handleChangePage}
                />
            </Box>
            <form className={classes.root}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        ml: "5%"
                    }}
                >
                    <div>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Typography
                                sx={{
                                    m: "8px",
                                    py: "6px",
                                    px: "20px",
                                    width: "100%",
                                    borderRadius: 1
                                }}
                                hidden={factors.length === 0}
                                align="center"
                                variant="subtitle1"
                                component="div"
                                className={classes.color}>
                                Fecha
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Typography
                                sx={{
                                    m: "8px",
                                    py: "6px",
                                    px: "20px",
                                    width: "100%",
                                    borderRadius: 1
                                }}
                                hidden={factors.length === 0}
                                align="center"
                                variant="subtitle1"
                                component="div"
                                className={classes.color}>
                                Hora
                            </Typography>
                        </Box>
                        {factors.map(factor => (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Typography
                                    sx={{
                                        m: "8px",
                                        py: "6px",
                                        px: "20px",
                                        width: "100%",
                                        borderRadius: 1
                                    }}
                                    align="center"
                                    variant="subtitle1"
                                    component="div"
                                    className={classes.color}>
                                    {factor.name}
                                </Typography>
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
                                    style = {{width: "100%"}}
                                    type='date'
                                    name="fecha"
                                    disabled
                                    value={inputField.fecha}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <TextField
                                    style = {{width: "100%"}}
                                    type='time'
                                    name="hora"
                                    disabled
                                    value={inputField.hora}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                            {factors.map(factor => (
                                <Box>
                                    <TextField
                                        type='number'
                                        name={factor.name}
                                        disabled
                                        label=""
                                        value={inputField[factor.name]}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            ))}
                        </div>
                    ))}
                </Box>
            </form>
        </Container>
    );
}

export default ViewData;