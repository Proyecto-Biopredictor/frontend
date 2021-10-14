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
import { green, red, grey, blue } from '@material-ui/core/colors';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import UploadFile from '@mui/icons-material/UploadFile';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

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
        },
        "&:disabled": {
            backgroundColor: blue[50]
        }
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ViewData() {
    const { pid, bid } = useParams();
    const [factors, setFactors] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const classes = useStyles()
    const [inputFields, setInputFields] = useState([]);
    const [page, setPage] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [showCard, setShowCard] = useState(true);
    const [image, setImage] = useState("");
    const [cardPositionX, setCardPositionX] = useState(0);
    const [cardPositionY, setCardPositionY] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [recordId, setRecordId] = useState("");
    const [open, setOpen] = useState(false);
    const message = "Se ha eliminado el registro!"

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
                    setOpen(false)
                    setError("");
                }, 2000);
            }, 5000);
            setOpen(true)
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
                    setOpen(false)
                    setError("");
                }, 2000);
            }, 5000);
            setOpen(true)
            return setError("Authentication failed!");
        }
    }

    const deleteRecord = async rid => {
        try {
            return await axios.delete(`https://backend-ic7841.herokuapp.com/api/private/record/${rid}`, config);
        } catch (error) {
            throw Error(error?.response?.data?.error);
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

    const openImage = () => {
        const base64ImageData = image;
        const contentType = image.match("data:(.+);")[1];

        const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, '_blank');
    }

    const prepareDelete = id => {
        setRecordId(id);
        setOpenDialog(true);
    }

    const handleDelete = () => {

        deleteRecord(recordId).then(() => {
            setOpen(true)
            setOpenDialog(false);
            const values = [...inputFields];
            values.splice(values.findIndex(value => value.id === recordId), 1);
            setInputFields(values);

            let con = inputFields.length - 1;
            let result = con % 3 === 0 ? parseInt(con / 3) : 1 + parseInt(con / 3);
            if (result < count) {
                setCount(result);
                setPage(result);
            }
        }).catch(error => {
            setError(error)
            setOpen(true)
            setOpenDialog(false);
        });
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
        setCardPositionX(event.clientX - 250);
        setCardPositionY(event.clientY - 600);
        let srcImage = ""


        if (isCard !== "") {

            inputFields.every(input => {

                if (input.id === id) {
                    srcImage = input[factorName];
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
            <Collapse in={open}>
                <Alert
                    severity={error ? "error" : "success"}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {error ? error : message}
                </Alert>
            </Collapse>
            <form className={classes.root}>
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">¿Desea eliminar este registro?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Esta decisión no es reversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleDelete} color="secondary">
                            Eliminar
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
                    {inputFields.map((inputField, index) => (
                        <div key={inputField.id} hidden={3 * page - index >= 1 && 3 * page - index <= 3 ? false : true}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <TextField
                                    style={{ width: "100%" }}
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
                                    style={{ width: "100%" }}
                                    type='time'
                                    name="hora"
                                    disabled
                                    value={inputField.hora}
                                    size="small"
                                    variant="outlined"
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
                                            value={inputField[factor.name]}
                                            label=""
                                            disabled
                                            size="small"
                                            variant="outlined"
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
                                                    disabled
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
                                                        onClick={() => openImage()}
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
                                                        disabled
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
                                    <IconButton title="Eliminar dato" onClick={() => prepareDelete(inputField.id)}>
                                        <Avatar className={classes.remove}>
                                            <DeleteIcon />
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </div>
                    ))}
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

export default ViewData;