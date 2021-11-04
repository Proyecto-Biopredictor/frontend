import React, { useRef, useState, useEffect } from 'react'
import { BoxPlotChart } from '@sgratzl/chartjs-chart-boxplot';

const useCanvas = data => {

    const canvasRef = useRef(null);
    const config = {
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
            data: [data["Humedad"]]
        }, {
            label: 'Temperatura',
            backgroundColor: 'pink',
            borderColor: 'purple',
            borderWidth: 1,
            outlierColor: '#ffffff',
            padding: 10,
            itemRadius: 0,
            data: [data["Temperatura"]]
        }]
    };

    useEffect(() => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let boxplot = new BoxPlotChart(context, { data: config });
        console.log(canvasRef);
    }, []);

    return canvasRef;
}


function ShowBoxplot(props) {
    const { data } = props;
    
    const canvasRef = useCanvas(data);

    return (
        <canvas ref={canvasRef}/>
    )
}

export default ShowBoxplot;