import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Controls from "../../components/controls/Controls";
import axios from "axios";
import PlaceIcon from '@material-ui/icons/Place';
import { Link } from 'react-router-dom';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, CssBaseline } from '@material-ui/core'
import { useForm, Form } from '../../components/useForm';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
    cardContainer: {
      width: 800,
      justifyContent: "center",
      alignItems: "center"
    },
    media: {
      height: 300,
    },
    table: {
      width: '90%',
      margin: '50px 0 0 50px'
    },
    thead: {
      '& > *': {
        fontSize: 20,
        background: '#8ade8f',
        color: '#FFFFFF'
      }
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
    pageContent: {
      margin: theme.spacing(5),
      padding: theme.spacing(3),
    },
    center: {
      display: 'flex',
      textAlign: 'center'
    },
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

export default function ViewFactors() {
    return (
        <div>
            <br />
      <br />
      <PageHeader
        title="Lugares asociados al bioproceso"
        subTitle="Acá se muestran todos los lugares relacionados a este bioproceso"
        icon={<PlaceIcon fontSize="large"
        />}
      />

      <div className={classes.root}>
        <div hidden={!isPlacesBio}>
          <CssBaseline />
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
          <Paper className={classes.table}>
            <TableContainer >
              <Table stickyHeader aria-label="sticky table" className={classes.container}>
                <TableHead>
                  <TableRow className={classes.thead}>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Latitud</TableCell>
                    <TableCell>Longitud</TableCell>
                    <TableCell className={classes.placeholder}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {placesBio.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((place) => (
                    <TableRow hover className={classes.row} key={place.id}>
                      <TableCell>{place.name}</TableCell>
                      <TableCell>{place.latitude}</TableCell>
                      <TableCell>{place.longitude}</TableCell>
                      <TableCell>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/place/show/${bioprocess._id}`}>Show</Button>
                          <Button color="primary" variant="contained" style={{ marginRight: 10 }}>Add data</Button>
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
              count={placesBio.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        <div className={classes.placeholder} hidden={isPlacesBio}>
          <br />
          <Typography variant="subtitle1" color="textSecondary" component="p">
            No hay nada qué mostrar en está sección
          </Typography>
        </div>
      </div>
        </div>
    )
}
