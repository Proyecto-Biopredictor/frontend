import React from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import axios from "axios";

const predictionItems = [
    { id: 'regresion', title: 'Regresión lineal' },
    { id: 'clasificacion', title: 'Clasificación' },
]

const initialBValues = {
    name: '',
    description: '',
    isTimeSeries: false,
    image: '',
    type: 'regresion'
}

export default function CreateBioprocess() {
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
          
              axios.post("/api/private/bioprocess", values, config)
              .then(console.log).catch(console.log);
              window.location.reload();
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
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
                            text="Agregar" />
                        <Controls.Button
                            text="Reiniciar"
                            color="default"
                            onClick={resetForm} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
