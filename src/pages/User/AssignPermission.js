import React, {useState, useEffect} from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import { Paper, makeStyles, Box } from '@material-ui/core';
import AlertMessage from '../../components/AlertMessage';
import { getUsers } from '../../services/userService';

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    }
}))

const initialValues = {
    roles: ''
}

export default function AssignPermission(props) {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const {userId, ...other} = props;
    const validate = (fieldValues = values) => {
        console.log("e");
    }

    useEffect(async () => {
        let unmounted = false;
        if (userId){
            let response = await getUsers(userId);
            setValues(response.data.user.roles);
        }
        return () => { unmounted = true; };
    }, []);

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialValues, false, validate);

    return (
        <div>
            
        </div>
    )
}
