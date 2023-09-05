"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";
import { toast } from "react-toastify";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(72.5);
  const [lat, setLat] = useState(23);
  const [zoom, setZoom] = useState(9);
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [isInitialRender, setIsInitialRender] = useState(true);
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
    try {
      map.current?.on("click", async (e: any) => {
        setLng(e.lngLat.lng.toFixed(4));
        setLat(e.lngLat.lat.toFixed(4));
        setZoom(map.current?.getZoom().toFixed(2));

        const data = await fetchAPI(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng.toFixed(
            4
          )},${e.lngLat.lat.toFixed(4)}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          }`,
          {
            method: "GET",
          }
        );
        setLocation(data.features[0]?.place_name);
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  });

  useEffect(() => {
    if (isInitialRender) {
      getMapAndWeather("Ahmedabad");
      setIsInitialRender(false);
      return;
    }

    getMapAndWeather(location);
  }, [location]);

  const fetchAPI = async (api: string, methods: any) => {
    setLoading(true);
    try {
      const data = await fetch(api, methods);
      const ans = await data.json();
      setLoading(false);
      return ans;
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const selectGif = (temp: Number) => {
    const main = document.querySelector("body");
    while (main?.classList.length! > 0) {
      main?.classList.remove(main.classList.item(0)!);
    }
    if (temp.valueOf() < 5) {
      main?.classList.add("ice");
    } else if (temp.valueOf() < 20) {
      main?.classList.add("cold");
    } else if (temp.valueOf() < 35) {
      main?.classList.add("warm");
    } else {
      main?.classList.add("hot");
    }
  };

  const getMapAndWeather = async (placeName: string) => {
    try {
      if (placeName === undefined || placeName === "") {
        throw new Error("placeName is undefined");
      }
      const mapAPI = await fetchAPI(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeName}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
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
        selectGif(weatherAPI.temp);
        if (map.current) {
          map.current.flyTo({
            center: center,
            zoom: 12,
          });
        }
      } else {
        toast.error("No Results Found");
      }
    } catch (e) {
      setLoading(false);
      toast.error("Place Name cannot be undefined");
    }
  };

  const handleSubmit = async (e: any) => {
    if (e.code === "Enter" && city != undefined) {
      setCity("");
      getMapAndWeather(city);
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
    <div className="home">
      <div className={loading ? "spinner" : ""}></div>
      <div className={loading ? "opaque" : "map-container"}>
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
            <br />
            <li className="container">
              <input type="checkbox" id="check_id" style={{ display: "none" }} />
              <label htmlFor="check_id"></label>
              <ul>
                <li>Longitude: {lng}</li>
                <li>Latitude: {lat}</li>
                {weather.temp ? <li>Temperature: {weather.temp}&deg;C</li> : <></>}
                {weather.feels_like ? <li>Feels like: {weather.feels_like}&deg;C</li> : <></>}
                {weather.wind_speed ? <li>Wind Speed: {weather.wind_speed}</li> : <></>}
                {weather.wind_degrees ? <li>Wind Degrees: {weather.wind_degrees}</li> : <></>}
                {weather.sunrise ? <li>Sunrise: {dates(weather.sunrise)}</li> : <></>}
                {weather.sunset ? <li>Sunset: {dates(weather.sunset)}</li> : <></>}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
