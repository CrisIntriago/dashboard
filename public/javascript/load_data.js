let cargarOpenMeteo = () => {
  //URL que responde con la respuesta a cargar
  let URL =
    "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,precipitation_probability";

  fetch(URL)
    .then((responseText) => responseText.json())
    .then((responseJSON) => {
      //Respuesta en formato JSON

      //Referencia al elemento con el identificador plot
      let plotRef1 = document.getElementById("plot1");
      let plotRef2 = document.getElementById("plot2");
      //Etiquetas del gráfico
      let labels = responseJSON.hourly.time;

      //Etiquetas de los datos
      let data = responseJSON.hourly.temperature_2m;
      let data2= responseJSON.hourly.precipitation_probability;

      //Objeto de configuración del gráfico
      let config = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Temperature [2m]",
              data: data,
            },
          ],
        },
      };


      let chart1 = new Chart(plotRef1, config);


      config = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Precipitation %",
              data: data2,
            },
          ],
        },
      };

      let chart2= new Chart(plotRef2, config);

      console.log(responseJSON);
    })
    .catch(console.error);
};

cargarOpenMeteo();
