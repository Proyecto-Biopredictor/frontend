import React from 'react'
import { Bar } from 'react-chartjs-2'

export default function ShowHistogram(props) {
    const { data } = props;

    const options = {
        scales: {
            x: {
                type: 'linear',
            },
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function() {},
                    label: function(context) {
                        let index = context.dataIndex;
                        let dataset = context.dataset.data;
                        let interval = "Intervalo: [";
                        interval +=  index > 0 ? dataset[index - 1].x : " ";
                        interval += ", " + context.parsed.x + "[";
                        let frequence = "Frecuencia: " + context.parsed.y;
                        return [interval, frequence];
                    }
                }
            }
        }
    };

    let configs = [];

    for (let key in data) {
        if (key === "isFull") {
            break;
        }
        let dataVariable = Array.from(data[key]);
        dataVariable.sort(function (a, b) { return a - b });

        let classes = Math.sqrt(dataVariable.length);
        let amplitude = 0;
        let range = 0;

        let parseData = [];
        if (classes > 0) {
            range = parseFloat(dataVariable.at(-1)) - parseFloat(dataVariable.at(0));
            if (classes !== 0) {
                amplitude = Math.round(range / classes);
            }
            let interval = Math.round(parseFloat(dataVariable.at(0)) + amplitude);
            for (let index = 0; index < dataVariable.length; index++) {
                let frequence = 0;
                while (parseFloat(dataVariable[index]) < interval) {
                    frequence++;
                    index++;
                }
                parseData.push({ x: interval, y: frequence });
                interval += amplitude;
            }
        }

        const config = {
            datasets: [{
                label: key,
                data: parseData,
                backgroundColor: '#8ecae6',
                borderColor: '#219ebc',
                borderWidth: 1,
                categoryPercentage: 1,
                barPercentage: 1
            }]
        };
        configs.push(config);
    }

    return (
        <div>
            {configs.map((config, index) => (
                <Bar data={config} options={options} />
            ))}
        </div>
    )
}
