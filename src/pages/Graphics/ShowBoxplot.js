import React, { useRef, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import Container from '@material-ui/core/Container';
import { BoxPlotChart } from '@sgratzl/chartjs-chart-boxplot';

export default function ShowBoxplot() {

    let json = {humedad: [], temperatura: []}//require('../../test.json');

    const data = {
        // define label tree
        labels: ["Variables"],
        datasets: [{
            label: 'Humedad 1',
            backgroundColor: 'rgba(255,0,0,0.5)',
            borderColor: 'red',
            borderWidth: 1,
            outlierColor: '#ffffff',
            padding: 10,
            itemRadius: 0,
            data: [json.humedad]
        }, {
            label: 'Temperatura',
            backgroundColor: 'pink',
            borderColor: 'purple',
            borderWidth: 1,
            outlierColor: '#ffffff',
            padding: 10,
            itemRadius: 0,
            data: [json.temperatura]
        }, {
            label: 'Viento',
            backgroundColor: 'grey',
            borderColor: 'black',
            borderWidth: 1,
            outlierColor: '#ffffff',
            padding: 10,
            itemRadius: 0,
            data: [json.viento]
        }, {
            label: 'Hojas',
            backgroundColor: 'rgba(0,0,255,0.5)',
            borderColor: 'blue',
            borderWidth: 1,
            outlierColor: '#ffffff',
            padding: 10,
            itemRadius: 0,
            data: [json.hojas]
        }]
    };

    let options = {
        responsive: true,
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Box Plot Chart'
        }
    }

    const canvasRef = useRef(null)

    let boxplot;
    useEffect(() => {
        let unmounted = false;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        boxplot = new BoxPlotChart(context, { data: data });

        return () => { unmounted = true; };
    }, []);

    let componentBar = <Bar
        data={data}
        options={options}
    />;


    const labels = ["red"];
    const data2 = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: [
                { x: 1, y: 10 },
                { x: 3, y: 20 },
                { x: 5, y: 30 },
                { x: 7, y: 25 },
                { x: 8, y: 15 }
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const options_2 = {
        scales: {
            x: {
                type: 'linear'
            },
            y: {
                beginAtZero: true
            }
        }
    };
    let componentBar2 = <Bar
        data={data2}
        options={options_2}
    />;
    return (
        <Container>
            <canvas ref={canvasRef} />
            {componentBar2}
        </Container>
    )
}
