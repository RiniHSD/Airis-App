import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const dmsToDecimal = (dms, isLatitude = false) => {
  let isNegative = false;
  if (dms.startsWith('-')) {
    isNegative = true;  
    dms = dms.substring(1);
  }

  const parts = dms.replace(/[^\d\w\.°'"]+/g, ' ').trim().split(/\s+/);
  
  const degrees = parseFloat(parts[0].replace('°', ''));
  const minutes = parseFloat(parts[1].replace('\'', ''));
  const seconds = parseFloat(parts[2].replace('\"', ''));

  let decimal = degrees + minutes / 60 + seconds / 3600;
  
  if (isLatitude && isNegative) {
    decimal = -decimal; 
  }

  console.log(`DMS: ${dms} | Degrees: ${degrees}, Minutes: ${minutes}, Seconds: ${seconds}`);
  console.log(`Decimal: ${decimal}`);

  return decimal;
};

const Titiklokasi = ({ route }) => {
  const { point } = route.params; 

  const longitude = dmsToDecimal(point.koordinat_bujur);  
  const latitude = dmsToDecimal(point.koordinat_lintang, true);
  
  useEffect(() => {
    console.log('Converted Longitude:', longitude);
    console.log('Converted Latitude:', latitude);
  }, [longitude, latitude]);

  const generateMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OpenLayers Map</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v10.2.1/ol.css" />
          <style>
            #map { height: 100vh; width: 100%; }
            
            /* Layer switcher dropdown */
            .layer-switcher {
              position: absolute;
              top: 10px;
              right: 10px;
              background-color: white;
              padding: 8px;
              border-radius: 4px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              z-index: 1000;  /* Ensure dropdown is above the map */
            }
            
            /* Reset button styles */
            .reset-orientation {
              position: absolute;
              bottom: 20px;
              right: 20px;
              background-color: white;
              padding: 10px 15px;
              border-radius: 4px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              cursor: pointer;
              font-size: 14px;
              z-index: 1000;  /* Ensure button is above the map */
              text-align: center;
              font-weight: bold;
            }
  
            .reset-orientation:hover {
              background-color: #f0f0f0; /* Slight hover effect */
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <div class="layer-switcher">
            <select id="basemap-select">
              <option value="osm">OpenStreetMap</option>
              <option value="esriStreet">Esri Street</option>
              <option value="esriImagery">Esri Imagery</option>
              <option value="rbi">Rupa Bumi Indonesia</option>
            </select>
          </div>
          <div class="reset-orientation" id="reset-button">.</div>
          <script src="https://cdn.jsdelivr.net/npm/ol@v10.2.1/dist/ol.js"></script>
          <script>
            // Basemap layers
            const basemaps = {
              'osm': new ol.layer.Tile({
                source: new ol.source.OSM()
              }),
              'esriStreet': new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
                })
              }),
              'esriImagery': new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                })
              }),
              'rbi': new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: 'https://geoservices.big.go.id/rbi/rest/services/BASEMAP/Rupabumi_Indonesia/MapServer/tile/{z}/{y}/{x}'
                })
              })
            };
  
            // Create map and add default basemap
            const map = new ol.Map({
              target: 'map',
              layers: [basemaps['osm']],  // Default basemap
              view: new ol.View({
                center: ol.proj.fromLonLat([${longitude}, ${latitude}]),
                zoom: 18,
                rotation: 0  // Default rotation (north up)
              })
            });
  
            // Add point feature
            const pointFeature = new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.fromLonLat([${longitude}, ${latitude}])),
              name: '${point.nama_titik}'
            });
  
            const vectorLayer = new ol.layer.Vector({
              source: new ol.source.Vector({
                features: [pointFeature]
              }),
              style: new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 6,
                  fill: new ol.style.Fill({ color: 'blue' }),
                  stroke: new ol.style.Stroke({ color: 'white', width: 2 })
                }),
                text: new ol.style.Text({
                  text: pointFeature.get('name'),
                  font: 'bold 12px sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  offsetY: -20
                })
              })
            });
            map.addLayer(vectorLayer);
  
            // Layer switcher logic
            const basemapSelect = document.getElementById('basemap-select');
            basemapSelect.addEventListener('change', function() {
              const selectedBasemap = basemapSelect.value;
              map.getLayers().setAt(0, basemaps[selectedBasemap]);
            });
  
            // Reset orientation function
            document.getElementById('reset-button').addEventListener('click', () => {
              const view = map.getView();
              view.setRotation(0);  // Set rotation to 0 (north up)
            });
          </script>
        </body>
      </html>
    `;
  };
  

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: generateMapHTML() }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 0,
  },
  webview: {
    flex: 1,
  },
});

export default Titiklokasi;
