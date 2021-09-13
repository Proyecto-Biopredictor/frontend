import React from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import axios from "axios";
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

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

export default function CreateBioprocess() {
    const [open, setOpen] = React.useState(false);
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

    const confirmPost = () =>{
        setOpen(true);
        resetForm({
            
        })
        setTimeout(function(){
            setOpen(false);
        }, 6000);
    }
    const handleSubmit = e => {
        e.preventDefault()
        if (validate()){
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }
              };
              console.log(config);
          
              axios.post("https://backend-ic7841.herokuapp.com/api/private/bioprocess", values, config)
              .then(confirmPost).catch(console.log);
              
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Collapse in={open}>
                <Alert
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
                Se ha agregado un bioproceso
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
    )
}
