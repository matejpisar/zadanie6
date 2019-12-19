const Map = ol.Map;
const View = ol.View;
const ImageLayer = ol.layer.Image;
const TileLayer = ol.layer.Tile;
const ImageWMS = ol.source.ImageWMS;
const OSM = ol.source.OSM;
const WMSCapabilities = ol.format.WMSCapabilities;
let parser = new ol.format.WMSCapabilities();
var layers = [];

var view = new View({
  center: [17.889477, 48.749152],
  zoom: 13,
  projection: "EPSG:4326",
})



var OSM_layer = [
  new TileLayer({
    source: new OSM()
  }),
];

let map = new Map(
  {
  layers: OSM_layer,
  target: 'map',
  view: view
});

function funkcia_pre_url() {
  const x = document.getElementById("url").value;
  alert("Vložil si url");
}

function tabulka() {
  const url = document.getElementById("url").value;
  if (!url) {
      alert('Nie je vložená žiadna url adresa')
      return;
    }
  fetch(url).then(function (response) {
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
            url: url,
            params: { LAYERS: [objekty[riadky].Name] },
            ratio: 1,
            serverType: 'geoserver'
          }),
        })
        OSM_layer.push(layer)


        table += '<tr>';
        for (let stlpce = 1; stlpce <= 1; stlpce++) {
          table += '<tr>' + '<td>' + `<input class="checkbox-class" center id="checkbox-${riadky}"  type = "checkbox"/>` +  '</td>' + '<td>' + objekty[riadky].Name + '</td>' + '<td>' + objekty[riadky].queryable +'</td>' + '</tr>';
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
    const layer = OSM_layer[index];
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

function skryvanie_vloz_url() {
  let x = document.getElementById("url");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function pridanie_vloz_url() {
  let x = document.getElementById("url_button");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


function zhluk_funkcii2() {
  skryvanie_tlacitka1();
  skryvanie_tlacitka2();
}

function zhluk_funkcii3() {
  skryvanie_vloz_url();
  pridanie_vloz_url()
}

map.on('singleclick', function (evt) {
  const sources = [];
  map.getLayers().forEach(layer => sources.push(layer.getSource()));
  document.getElementById('info').innerHTML = '';
  var viewResolution = view.getResolution();
  sources.forEach((wmsSource) => {
      var url = wmsSource.getFeatureInfoUrl && wmsSource.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326',
      { 'INFO_FORMAT': 'text/html' });
      if (url) {
          fetch(url)
          .then(function (response) { return response.text(); })
          .then(function (html) {
                  document.getElementById('info').insertAdjacentHTML( 'beforeend', html );
              });
      }

  })


});
map.on('pointermove', function(evt) 
  {
    if (evt.dragging) 
    {
      return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.forEachLayerAtPixel(pixel, function() 
    {
      return true;
    });
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  }
);




function openNav() {
  document.getElementById("mySidebar").style.width = "300px";
  document.getElementById("main").style.marginLeft = "300px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}


