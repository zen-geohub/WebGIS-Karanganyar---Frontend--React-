import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import mapboxGlDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  mapboxGlDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
  mapboxGlDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
  mapboxGlDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";
  const draw = new mapboxGlDraw({
    displayControlsDefault: false,
    controls: {
      point: true,
      line_string: true,
      polygon: true,
      trash: true,
    },
  });

  useEffect(() => {
    if (map.current) return;
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?${
        import.meta.env.VITE_BASEMAPKEY
      }`,
      center: [110.94776, -7.58364],
      zoom: 11.5,
      attributionControl: false,
    });

    map.current.on("load", () => {
      map.current.addControl(draw, "top-left");
      map.current.on("draw.update", () => {
        console.log(draw.getAll());
      });

      map.current.addSource("random", {
        type: "vector",
        scheme: "tms",
        tiles: [`${import.meta.env.VITE_GEOSERVER}/gwc/service/tms/1.0.0/ppids:randomizepoint@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf`]
      })
      map.current.addSource("usedDesa", {
        type: "vector",
        scheme: "tms",
        tiles: [`${import.meta.env.VITE_GEOSERVER}/gwc/service/tms/1.0.0/ppids:useddesa@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf`]
      })
      map.current.addSource("usedJalan", {
        type: "vector",
        scheme: "tms",
        tiles: [`${import.meta.env.VITE_GEOSERVER}/gwc/service/tms/1.0.0/ppids:usedjalan@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf`]
      })

      // map.current.addSource("random", {
      //   type: "geojson",
      //   data: `${import.meta.env.VITE_BACKEND}/randomPoint`,
      // });
      
      // map.current.addSource("usedDesa", {
      //   type: "geojson",
      //   data: `${import.meta.env.VITE_BACKEND}/usedDesa`,
      // });
      
      // map.current.addSource("usedJalan", {
      //   type: "geojson",
      //   data: `${import.meta.env.VITE_BACKEND}/usedJalan`,
      // });

      map.current.addLayer({
        id: "randomHeatmap",
        type: "heatmap",
        source: "random",
        "source-layer": "randomizepoint",
        maxzoom: 16,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          // "heatmap-weight": [
          //   "interpolate",
          //   ["linear"],
          //   ["get", "id"],
          //   0,
          //   0,
          //   6,
          //   1,
          // ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          // "heatmap-intensity": [
          //   "interpolate",
          //   ["linear"],
          //   ["zoom"],
          //   0,
          //   1,
          //   9,
          //   3,
          // ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust the heatmap radius by zoom level
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
          // Transition from heatmap to circle layer by zoom level
          // "heatmap-opacity": [
          //   "interpolate",
          //   ["linear"],
          //   ["zoom"],
          //   7,
          //   1,
          //   9,
          //   0,
          // ],
        },
      });

      map.current.addLayer({
        id: "randomPoint",
        type: "circle",
        source: "random",
        "source-layer": "randomizepoint",
        minzoom: 16,
        paint: {
          'circle-radius': 5,
          'circle-color': 'rgb(103,169,207)'
        },
      });

      map.current.addLayer({
        id: "usedDesa",
        type: "line",
        source: "usedDesa",
        "source-layer": "useddesa",
        paint: {
          'line-color': 'yellow',
          'line-width': 1,
          'line-opacity': 0.5,
          'line-dasharray': [2, 2],
        },
      })

      map.current.addLayer({
        id: "usedJalan",
        type: "line",
        source: "usedJalan",
        "source-layer": "usedjalan",
        paint: {
          'line-color': 'white',
          'line-width': 1,
          'line-opacity': 0.5
        },
      })
    });
  });

  return <div ref={mapContainer} className="w-screen h-screen"></div>;
}

export default Map;
