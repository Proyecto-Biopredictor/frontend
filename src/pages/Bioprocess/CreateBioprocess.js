import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import { Paper, makeStyles, Box } from '@material-ui/core';
import EcoIcon from '@material-ui/icons/Eco';
import PageHeader from "../../components/PageHeader";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import {addBioprocess} from '../../services/bioprocessService'

const predictionItems = [
    { id: 'regresion', title: 'Regresión lineal' },
    { id: 'clasificacion', title: 'Clasificación' },
]

const initialBValues = {
    name: '',
    description: '',
    isTimeSeries: false,
    image: '',
    type: 'regresion',
    places: [],
    factors: []
}

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    placeholder: {
        height: 40,
        textAlign: 'center'
    },
}))

export default function CreateBioprocess() {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "Este campo es obligatorio."
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : "Este campo es obligatorio."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialBValues, true, validate);

    const confirmPost = () => {
        setOpen(true);
        resetForm({

        })
        setTimeout(function () {
            setOpen(false);
        }, 6000);
    }
    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            setLoading(true);
            try {
                addBioprocess(values).then(confirmPost).catch(console.log);
                setLoading(false);
            }

            catch (error) {
                setLoading(false);
                setTimeout(() => {
                    setTimeout(() => {
                        setError("");
                    }, 2000);
                }, 5000);
                return setError("Authentication failed!");
            }

        }
    }

    return (
        <div>
            <PageHeader
                title="Añadir nuevo Bioproceso"
                subTitle="Debe llenar todos los campos"
                icon={<EcoIcon fontSize="large" color='primary'
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
            <Paper className={classes.pageContent}>
                <Form onSubmit={handleSubmit}>
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
                            {error ? error : 'Se ha agregado un nuevo bioproceso!'}
                        </Alert>
                    </Collapse>
                    <Grid container>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="name"
                                label="Nombre"
                                value={values.name}
                                onChange={handleInputChange}
                                error={errors.name}
                            />
                            <Controls.Input
                                label="Descripción"
                                name="description"
                                value={values.description}
                                onChange={handleInputChange}
                                error={errors.description}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controls.RadioGroup
                                name="type"
                                label="Tipo Predicción"
                                value={values.type}
                                onChange={handleInputChange}
                                items={predictionItems}
                            />
                            <Controls.Checkbox
                                name="isTimeSeries"
                                label="Es serie temporal"
                                value={values.isTimeSeries}
                                onChange={handleInputChange}
                            />

                            <div>
                                <Controls.Button
                                    type="submit"
                                    text="Agregar"
                                />

                                <Controls.Button
                                    text="Limpiar"
                                    color="default"
                                    onClick={resetForm} />
                            </div>
                        </Grid>
                    </Grid>
                </Form>
            </Paper>
        </div>
    )
}
