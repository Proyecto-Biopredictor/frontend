import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { deleteFactor } from '../../services/factorService';
import Controls from "../../components/controls/Controls";
import { Alert, AlertTitle } from '@material-ui/lab/';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useParams } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import ButtonBase from '@material-ui/core/ButtonBase';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    table: {
        width: '90%',
        margin: '50px 0 0 0'
    },
    thead: {
        '& > *': {
            fontSize: 20,
            background: '#8ade8f',
            color: '#FFFFFF'
        }
    },
    head: {
        fontSize: 20,
        background: '#8ade8f',
        color: '#FFFFFF'

    },
    row: {
        '& > *': {
            fontSize: 18
        }
    },
    buttonheader: {
        display: 'flex'

    },
    placeholder: {
        height: 40,
        textAlign: 'center'
    },
    button: {
        background: '#4287f5',
        color: '#FFFFFF'
    },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function ViewFactors() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { id } = useParams();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [factors, setFactors] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const [factorId, setFactorId] = React.useState('');;

    const classes = useStyles();

    function wrapValues(factors) {
        setFactors(factors);
        setLoading(false);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        deleteFactorData()
        setOpenDialog(false);
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getAllFactors() {
        try {
            const factors = await axios.get(
                `https://backend-ic7841.herokuapp.com/api/private/factorbioprocess/${id}`,
                config
            );
            wrapValues(factors.data.factors);


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

    const deleteFactorData = async () => {
        await deleteFactor(factorId);
        getAllFactors();
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"¿Desea borrar este factor?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Esta decisión no es reversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Rechazar
                    </Button>
                    <Button onClick={handleAccept} color="primary">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>


            <PageHeader
                title="Información sobre los factores"
                icon={<InfoIcon fontSize="large"
                />}
                />
            
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Button color="primary" variant="contained" component={Link} to={`/factor/create/${id}`}>Crear factor</Button>
            </Grid>
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
                    <AlertTitle>{error ? error : "Success!"}</AlertTitle>
                    {error}
                </Alert>
            </Collapse>
            <Paper className={classes.table}>
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>
                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell>Nombre</TableCell>
                                <TableCell>¿Es valor dependiente?</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell className={classes.placeholder}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {factors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((factor) => (
                                <TableRow hover className={classes.row} key={factor.id}>
                                    <TableCell>{factor.name}</TableCell>
                                    <TableCell>
                                        <Controls.Checkbox
                                            name="isDependent"
                                            label=""
                                            value={factor.isDependent}
                                            disabled={true}
                                        />
                                    </TableCell>
                                    <TableCell>{factor.type === 'value' ? 'Valor' : 'Imagen'}</TableCell>
                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Tooltip title="Editar">
                                                <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/factor/update/${factor._id}`}><ModeEditIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                            <Button color="secondary" variant="contained" onClick={() => {
                                                setOpenDialog(true); setFactorId(factor._id); console.log(factor._id);
                                            }}><DeleteIcon /></Button>
                                            </Tooltip>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={factors.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}
