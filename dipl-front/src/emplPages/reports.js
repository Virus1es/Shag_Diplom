import {useEffect, useState} from "react";
import { Chart } from 'primereact/chart';
import { TabView, TabPanel } from 'primereact/tabview';

export default function ShowReports(){
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Продажи',
                    data: [540, 325, 702, 620],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return(
        <TabView className="m-2">
            <TabPanel header="Header I">
                <Chart type="bar" data={chartData} options={chartOptions} />
            </TabPanel>
            <TabPanel header="Header II">
                <Chart type="bar" data={chartData} options={chartOptions} />
            </TabPanel>
            <TabPanel header="Header III">
                <Chart type="bar" data={chartData} options={chartOptions} />
            </TabPanel>
        </TabView>
    )
}