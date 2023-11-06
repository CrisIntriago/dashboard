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
      let data2 = responseJSON.hourly.precipitation_probability;

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

      let chart2 = new Chart(plotRef2, config);

      console.log(responseJSON);
    })
    .catch(console.error);
};

cargarOpenMeteo();

let parseXML = (responseText) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(responseText, "application/xml");

  // Referencia al elemento `#forecastbody` del documento HTML

  let forecastElement = document.querySelector("#forecastbody");
  forecastElement.innerHTML = "";

  // Procesamiento de los elementos con etiqueta `<time>` del objeto xml
  let timeArr = xml.querySelectorAll("time");

  timeArr.forEach((time) => {
    let from = time.getAttribute("from").replace("T", " ");

    let humidity = time.querySelector("humidity").getAttribute("value");
    let windSpeed = time.querySelector("windSpeed").getAttribute("mps");
    let precipitation = time.querySelector("precipitation").getAttribute("probability");
    let pressure =time.querySelector("pressure").getAttribute("value");
    let cloud = time.querySelector("clouds").getAttribute("value");

    let template = `
            <tr>
                <td>${from}</td>
                <td>${humidity}</td>
                <td>${windSpeed}</td>
                <td>${precipitation}</td>
                <td>${pressure}</td>
                <td>${cloud}</td>
            </tr>
        `;

    //Renderizando la plantilla en el elemento HTML
    forecastElement.innerHTML += template;
  });
};




//Callback
let selectListener = async (event) => {


  let selectedCity = event.target.value;
  // Lea la entrada de almacenamiento local
  let cityStorage = localStorage.getItem(selectedCity);

  if (cityStorage == null) {
    try {
      //API key
      let APIkey = "6b0de6154a69073662610d2e4e40bb30";
      let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${APIkey}`;

      let response = await fetch(url);
      let responseText = await response.text();

      await parseXML(responseText);

      // Guarde la entrada de almacenamiento local
      await localStorage.setItem(selectedCity, responseText);
      
    } catch (error) {
      console.log(error);
    }
  } else {
    // Procese un valor previo
    parseXML(cityStorage);
  }
};








let loadForecastByCity = () => {
  //Handling event
  let selectElement = document.querySelector("select");
  selectElement.addEventListener("change", selectListener);
};





loadForecastByCity();
