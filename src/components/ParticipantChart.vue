<template>
    <div>
      <Bar :chartData="chartData" :options="options" />
    </div>
  </template>
  
  <script>
  import { defineComponent, computed } from 'vue';
  import { Bar } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  export default defineComponent({
    name: 'ParticipantChart',
    components: {
      Bar,
    },
    props: {
      currentParticipants: {
        type: Number,
        required: true,
      },
      maxParticipants: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const chartData = computed(() => {
        return {
          labels: ['participants'],
          datasets: [
            {
              label: 'Max. Participants',
              data: [props.maxParticipants],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Current Participants',
              data: [props.currentParticipants],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        };
      });
  
      const options = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: props.maxParticipants + 5,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: 'Number of participants',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Participant overview',
          },
        },
      };
  
      return {
        chartData,
        options,
      };
    },
  });
  </script>
  
  <style scoped>
  </style>
  