"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(72.5);
  const [lat, setLat] = useState(23.0);
  const [zoom, setZoom] = useState(9);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<{
    temp: number;
    feels_like: number;
    wind_speed: number;
    wind_degrees: number;
    sunrise: number;
    sunset: number;
  }>({
    temp: 0,
    feels_like: 0,
    wind_speed: 0,
    wind_degrees: 0,
    sunrise: 0,
    sunset: 0,
  });
  const [mapData, setMapData] = useState<{ place_name: string }>({
    place_name: "",
  });

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current?.on("click", () => {
      setLng(map.current?.getCenter()?.lng.toFixed(4));
      setLat(map.current?.getCenter().lat.toFixed(4));
      setZoom(map.current?.getZoom().toFixed(2));

      console.log(map.current);
      getMapAndWeather();
    });
  });

  const fetchAPI = async (api: string, methods: any) => {
    try {
      const data = await fetch(api, methods);
      const ans = await data.json();
      return ans;
    } catch (error) {
      //toast error message
    }
  };

  const getMapAndWeather = async () => {
    try {
      const mapAPI = await fetchAPI(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (mapAPI.features.length > 0) {
        setMapData(mapAPI.features[0]);
        const center = mapAPI.features[0].center;
        setLng(center[0].toFixed(4));
        setLat(center[1].toFixed(4));

        const weatherAPI = await fetchAPI(
          `https://api.api-ninjas.com/v1/weather?lat=${center[1].toFixed(
            4
          )}&lon=${center[0].toFixed(4)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJAS_ACCESS_TOKEN,
            },
          }
        );

        setWeather(weatherAPI);

        if (map.current) {
          map.current.flyTo({
            center: center,
            zoom: 12,
          });
        }
      } else {
        console.log("No results found"); //use toast here
      }
    } catch (e) {
      console.log(e); //use toast here
    }
  };

  const handleSubmit = async (e: any) => {
    if (e.code === "Enter" && city != undefined) {
      setCity("");
      getMapAndWeather();
    }
  };

  const dates = (unix: number) => {
    const date = new Date(unix * 1000);
    return date.toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
      <input
        type="text"
        className="search-box"
        placeholder="Search..."
        onKeyDown={handleSubmit}
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <div className="sidebar">
        <ul>
          <li>Location: {mapData.place_name}</li>
          <li>Longitude: {lng}</li>
          <li>Latitude: {lat}</li>
          <li>Temperature: {weather.temp}</li>
          <li>Feels like: {weather.feels_like}</li>
          <li>Wind Speed: {weather.wind_speed}</li>
          <li>Wind Degrees: {weather.wind_degrees}</li>
          <li>Sunrise: {dates(weather.sunrise)}</li>
          <li>Sunset: {dates(weather.sunset)}</li>
        </ul>
      </div>
    </div>
  );
}
