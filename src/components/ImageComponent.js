import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import defaultImg from '../assets/img/defaultImg.jpeg'
import { Divider, Grid, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import Controls from "../components/controls/Controls";

const useStyles = makeStyles(theme => ({
    sizeAvatar: {
        height: "150px",
        width: "150px",
        marginBottom: "25px",
    },
    imageButton: {
        marginBottom: "25px"
    },
}))

export default function ImageComponent(props) {
    const { initialValues, errorParam, openParam, onChange, ...other } = props
    const classes = useStyles();


    return (
        <div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <div >
                    <div>
                        <Avatar
                            src={initialValues.image ? initialValues.image : defaultImg}
                            alt=""
                            className={classes.sizeAvatar}
                            style={{ margin: 'auto' }}>

                        </Avatar>
                    </div>
                    <div className={classes.imageButton}>
                        <input
                            name="image"
                            accept="image/*"
                            className={classes.input}
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                            hidden
                            onChange={onChange}
                        />
                        <h6 style={{ margin: '4px' }}> Cambiar imagen</h6>
                        <label htmlFor="raised-button-file">
                            <Controls.InputButton
                                color="success" text="Cambiar" component="span">
                            </Controls.InputButton>
                        </label>
                    
                        <Controls.Button
                            text="Quitar"
                            color="inherit"
                            name="clearImage"
                            onClick={onChange} />

                    </div>

                </div>

            </Grid>
            <Divider />
            <br />
        </div>
    )
}
