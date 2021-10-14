import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Pagination from '@mui/material/Pagination';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import UploadFile from '@mui/icons-material/UploadFile';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { green, red, grey, blue } from '@material-ui/core/colors';
import { addData } from "../../services/dataService";
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import { getBase64 } from '../../services/getFileService';

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
        backgroundColor: green[600]
    },
    remove: {
        backgroundColor: red[400]
    },
    buttonFixed: {
        position: "fixed"
    },
    image: {
        backgroundColor: grey.A100,
        "&:hover": {
            backgroundColor: blue[50]
        }
    },
    showImg: {
        backgroundColor: grey.A100,
        "&:hover": {
            backgroundColor: blue[50]
        }
    },
    removeImg: {
        backgroundColor: grey.A100,
        "&:hover": {
            backgroundColor: blue[50]
        }
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
    const [openDialog, setOpenDialog] = useState(false);
    const [showCard, setShowCard] = useState(true);
    const [image, setImage] = useState("");
    const [cardPositionX, setCardPositionX] = useState(0);
    const [cardPositionY, setCardPositionY] = useState(0);

    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

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
        setOpenDialog(false)
        let first = Object.assign({}, facObj);
        first.fecha = year + "-" + month + "-" + date;
        first.hora = "00:00"
        first.id = uuidv4();
        setInputFields([first])
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const parseInput = async () => {

        return new Promise(resolve => {
            let data = {
                "bioprocessID": bid,
                "placeID": pid,
                "values": []
            };

            const forEachLoop = async _ => {
            for (let index = 0; index < inputFields.length; index++) {
                let element = {};
                element.timestamp = inputFields[index].fecha + "T" + inputFields[index].hora;
                element.values = {};

                
                    for (let index_2 = 0; index_2 < factors.length; index_2++) {
                        if (factors[index_2].type === "value" || inputFields[index][factors[index_2].name] === "") {
                            element.values[factors[index_2].name] = inputFields[index][factors[index_2].name];
                        } else {

                            let file = inputFields[index][factors[index_2].name];

                            element.values[factors[index_2].name] = await getBase64(file);
                        }
                    }

                    data.values.push(element);
                }
            }
            forEachLoop().then( () => {
                resolve(data);}
            );
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let data = await parseInput();

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

    const handleChangeImageInput = (id, event) => {
        const newInputFields = inputFields.map(i => {
            if (id === i.id) {

                i[event.target.name] = event.target.files[0];
            }
            return i;
        })
        setInputFields(newInputFields);
    }

    const handleAddFields = () => {


        let newColumn = Object.assign({}, factorsObj);
        newColumn.fecha = year + "-" + month + "-" + date;
        newColumn.hora = "00:00"
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

    const removeImage = (id, factorName) => {
        const newInputFields = inputFields.map(i => {
            if (id === i.id) {

                i[factorName] = "";
            }
            return i;
        })
        setInputFields(newInputFields);
    }

    const displayCard = (isCard, id, factorName, event) => {
        setCardPositionX(event.clientX - event.clientX / 3);
        setCardPositionY(event.clientY - 600);
        let srcImage = ""


        if (isCard !== "") {

            inputFields.every(input => {

                if (input.id === id) {
                    srcImage = URL.createObjectURL(input[factorName]);
                    return false;
                }
                return true;
            });
        }

        setShowCard(isCard);
        setImage(srcImage);
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
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
            <form className={classes.root} onSubmit={handleSubmit}>
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">¿Seguro que desea guardar la información?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="standard">
                            Cancelar
                        </Button>
                        <Button type="submit" onClick={handleSubmit} color="primary">
                            Enviar
                        </Button>
                    </DialogActions>
                </Dialog>
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
                                align="center"
                                variant="subtitle1"
                                component="div"
                                hidden={factors.length === 0}
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
                                align="center"
                                variant="subtitle1"
                                component="div"
                                hidden={factors.length === 0}
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
                    {inputFields.map((inputField, index) => (
                        <div key={inputField.id} hidden={3 * page - index >= 1 && 3 * page - index <= 3 ? false : true}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <TextField
                                    type='date'
                                    name="fecha"
                                    style={{ width: "100%" }}
                                    defaultValue={year + "-" + month + "-" + date}
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
                                    style={{ width: "100%" }}
                                    type='time'
                                    name="hora"
                                    defaultValue={"00:00"}
                                    size="small"
                                    variant="outlined"
                                    onChange={event => handleChangeInput(inputField.id, event)}
                                />
                            </Box>
                            {factors.map(factor => (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {factor.type === "value"
                                        ? <TextField
                                            type='number'
                                            name={factor.name}
                                            label=""
                                            size="small"
                                            variant="outlined"
                                            onChange={event => handleChangeInput(inputField.id, event)}
                                        />
                                        : inputFields[index][factor.name] === ""
                                            ? <Tooltip title="Subir imagen">
                                                <Button
                                                    style={{
                                                        margin: "8px",
                                                        width: "100%",
                                                        paddingTop: "8px",
                                                        paddingBottom: "8px",
                                                        paddingLeft: "20px",
                                                        paddingRight: "20px",
                                                    }}
                                                    variant="contained"
                                                    component="label"
                                                    className={classes.image}
                                                >
                                                    <UploadFile />
                                                    <input
                                                        name={factor.name}
                                                        accept="image/*"
                                                        id="raised-button-file"
                                                        type="file"
                                                        hidden
                                                        onChange={event => handleChangeImageInput(inputField.id, event)}
                                                    />
                                                </Button>
                                            </Tooltip>
                                            : <>
                                                <Tooltip title="Abrir imagen">
                                                    <Button
                                                        style={{
                                                            margin: "8px",
                                                            width: "75%",
                                                            paddingTop: "8px",
                                                            paddingBottom: "8px",
                                                            paddingLeft: "20px",
                                                            paddingRight: "20px",
                                                        }}
                                                        variant="contained"
                                                        onMouseEnter={(event) => displayCard(false, inputField.id, factor.name, event)}
                                                        onMouseLeave={(event) => displayCard(true, "", "", event)}
                                                        onClick={() => window.open(image)}
                                                        target="_blank"
                                                        className={classes.showImg}
                                                    >
                                                        <VisibilityIcon />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Remover imagen">
                                                    <Button
                                                        style={{
                                                            margin: "8px",
                                                            width: "25%",
                                                            paddingTop: "8px",
                                                            paddingBottom: "8px",
                                                            paddingLeft: "20px",
                                                            paddingRight: "20px",
                                                        }}
                                                        variant="contained"
                                                        className={classes.removeImg}
                                                        onClick={() => removeImage(inputField.id, factor.name)}
                                                    >
                                                        <ClearIcon />
                                                    </Button>
                                                </Tooltip>
                                            </>
                                    }
                                </Box>
                            ))}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>

                                <Tooltip title="Quitar columna">
                                    <IconButton title="Remover columna" disabled={inputFields.length === 1} onClick={() => handleRemoveFields(inputField.id)}>
                                        <Avatar className={classes.remove}>
                                            <RemoveIcon />
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </div>
                    ))}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    >
                        <Tooltip title="Añadir nueva columna">
                            <IconButton style={{ position: "fixed" }} disabled={inputFields.length === 0} var
                                onClick={handleAddFields}
                            >
                                <Avatar className={classes.add}>
                                    <AddIcon />
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                    </Box>
                </Box>
                <Box>
                    <Button style={{ position: "fixed", marginLeft: "4.5%" }}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                    >Guardar datos ingresados</Button>
                </Box>

            </form>
            <Card
                sx={{
                    maxWidth: 300,
                    maxHeight: 300,
                    position: "relative",
                    top: cardPositionY,
                    left: cardPositionX,
                }}
                hidden={showCard}
            >
                <CardMedia
                    component="img"
                    height="194"
                    image={image}
                    alt=""
                />
            </Card>
        </Container>
    );
}

export default CreateData;