import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import { getBioprocesses } from '../../services/bioprocessService';
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab/';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Controls from "../../components/controls/Controls";

const useStyles = makeStyles({
  cardContainer: {
    width: 800,
    justifyContent: "center",
    alignItems: "center"
  },
  media: {
    height: 300,
  },
});

const initialValue = {
  name: '',
  description: '',
  isTimeSeries: true,
  image: '',
  type: '',
}


export default function ShowBioprocesses() {
  const [bioprocess, setBioprocess] = useState(initialValue);
  const { name, description, isTimeSeries, image, type } = bioprocess;
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = React.useState(true);


  const classes = useStyles();
  const { id } = useParams();
  useEffect(() => {
    getBioprocess();
  }, []);

  const getBioprocess = async () => {
    try {
      let response = await getBioprocesses(id);
      setBioprocess(response.data.bioprocess);
      setLoading(false);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      setLoading(false);
      return setError("Authentication failed!");
    }
  }


  return (

    <div className={classes.root}>
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
          <AlertTitle>{error ? "Error!" : "Success!"}</AlertTitle>
          {error}
        </Alert>
      </Collapse>

      <PageHeader
        title="Información detallada sobre un bioproceso"
        subTitle="Los datos contenidos no son modificables"
        icon={<InfoIcon fontSize="large"
        />}
      />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card className={classes.cardContainer}>

          <CardMedia
            className={classes.media}
            image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              {description}
            </Typography>
          </CardContent>

          <CardActions disableSpacing>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              ¿Es serie temporal?
            </Typography>
            <Controls.Checkbox
              name="isTimeSeries"
              label=""
              value={isTimeSeries}
              disabled={true}
            />
            <Typography variant="subtitle1" color="textSecondary" component="p">
              Tipo: {type==='clasificacion'?'Clasificación':'Regresión'}
            </Typography>
          </CardActions>
        </Card>
      </Grid>
      <br/>
      <PageHeader
        title="Asociar lugar a bioproceso"
        subTitle="Si el lugar no existe, rellene los campos para crear uno nuevo"
        icon={<InfoIcon fontSize="large"
        />}
      />
    </div>
  );
}
