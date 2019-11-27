const Map = ol.Map;
const View = ol.View;
const ImageLayer = ol.layer.Image;
const TileLayer = ol.layer.Tile;
const ImageWMS = ol.source.ImageWMS;
const OSM = ol.source.OSM;
const WMSCapabilities = ol.format.WMSCapabilities;
let parser = new ol.format.WMSCapabilities();
const olLayers = [];


let layers = [
  new TileLayer({
    source: new OSM()
  }),
];
let map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [17.889477, 48.749152],
    zoom: 13,
    projection: 'EPSG:4326'
  })
});

function getcapabilities() {
  fetch('http://localhost:8080/geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities', { mode: 'cors' }).then(function (response) {
    return response.text();
  }).then(function (text) {

    let parser2 = new DOMParser();
    XMLDocument = parser2.parseFromString(text, 'text/xml');
    document.getElementById('Capabilities_xml').textContent = text;

  })
};






function tabulka() {
  fetch('http://localhost:8080/geoserver/WMS_Kocovce/wms?service=WMS&version=1.3.0&request=GetCapabilities', { mode: 'cors' }).then(function (response) {
    return response.text();
  }).then(function (text) {

    let x = document.getElementById("tabulka");
    if (x.style.display === "none") {
      x.style.display = "block"


      let data = parser.read(text);
      let objekty = data.Capability.Layer.Layer;

      let table = "<tr><th>Označenie vrstvy</th><th>Možnosť dopytovania</th><th>Vloženie vrstvy</th></tr>";
      for (let riadky = 1; riadky < objekty.length; riadky++) {
        const layer = new ImageLayer({
          extent: [17.79569523402574, 48.71936026587261, 17.957725778672316, 48.79917418319719],
          source: new ImageWMS({
            url: 'http://localhost:8080/geoserver/WMS_Kocovce/wms',
            params: { LAYERS: [objekty[riadky].Name] },
            ratio: 1,
            serverType: 'geoserver'
          }),
        })
        olLayers.push(layer)


        table += '<tr>';
        for (let stlpce = 1; stlpce <= 1; stlpce++) {
          table += '<tr>' + '<td>' + objekty[riadky].Name + '</td>' + '<td>' + objekty[riadky].queryable + '</td>' + '<td>' + `<input class="checkbox-class" center id="checkbox-${riadky - 1}"  type = "checkbox"/>` + '</td>' + '</tr>';
        }
        table += '</tr>';
      }

      document.getElementById("tabulka").innerHTML = table;
    } else {
      x.style.display = "none";

    }


  })
}




function pridanie_vrstiev() {
  const checkboxes = document.getElementsByClassName("checkbox-class");
  const checboxArray = Array.from(checkboxes);
  console.log(checboxArray)
  checboxArray.forEach(function (checkbox) {
    const index = checkbox.id.split('-')[1];
    const layer = olLayers[index];
    if (checkbox.checked) {

      try {
        map.addLayer(layer)

      } catch (error) {
        console.log(error)
      }
    } else {
      map.removeLayer(layer)
    }
  })
}




function skryvanie_tlacitka1() {
  let x = document.getElementById("ukazat");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


function skryvanie_tlacitka2() {
  let x = document.getElementById("vrstvy");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function skryvanie_capa() {
  let x = document.getElementById("getcapa");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function zhluk_funkcii2() {
  skryvanie_tlacitka1();
  skryvanie_tlacitka2();
  skryvanie_capa();
}



function zmena_rozlozenia() {
  document.getElementById("map").style.height = "calc((2*100vh)/3)";
  document.getElementById("xml").style.height = "calc((1*100vh)/3)";
  document.getElementById("skryt").style.value = "Skryt polozky";
}

function zhluk_funkcii() {
  zmena_rozlozenia();
  getcapabilities();
}