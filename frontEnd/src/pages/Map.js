import React, { useMemo, useState, useEffect } from 'react'
import Address from '../components/Address';
import { useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF, useLoadScript, InfoWindowF } from "@react-google-maps/api";
import axios from 'axios';

const apiKey = 'AIzaSyDs2gO4O1PQyz06a_h0sbd1e2d-ef7Q6AY';
const locationList = {
       Adventure: [ [{lat: 27.9881, lng: 86.9250}, 'Mount Everest Base Camp'],
                    [{lat: 36.1069, lng: -112.1129}, 'Grand Canyon'],
                    [{lat: -51.0379, lng: -72.8278}, 'Torres del Paine National Park'],
                    [{lat: -2.3333, lng: 34.8333}, 'Serengeti National Park'],
                    [{lat: -18.2871, lng: 147.6992}, 'The Great Barrier Reef'],
                    [{lat: -3.0674, lng: 37.3556}, 'Mount Kilimanjaro'],
                    [{lat: -3.4653, lng: -62.2159}, 'Amazon Rainforest'],
                    [{lat: -13.1631, lng: -72.5450}, 'The Inca Trail'],
                    [{lat: 37.8651, lng: -119.5383}, 'Yosemite National Park'],
                    [{lat: 40.4319, lng: 116.5704}, 'Great Wall of China']], 
             City:[ [{lat: 48.8566, lng: 2.3522}, 'Paris'],
                    [{lat: 40.7128, lng: -74.0060}, 'New York City'],
                    [{lat: 35.6895, lng: 139.6917}, 'Tokyo'],
                    [{lat: 51.5074, lng: -0.1278}, 'London'],
                    [{lat: 41.9028, lng: 12.4964}, 'Rome'],
                    [{lat: -33.8651, lng: 151.2099}, 'Sydney'],
                    [{lat: -22.9068, lng: -43.1729}, 'Rio de Janeiro'],
                    [{lat: -33.9249, lng: 18.4241}, 'Cape Town'],
                    [{lat: 25.2048, lng: 55.2708}, 'Dubai'],
                    [{lat: 13.7563, lng: 100.5018}, 'Bangkok']],
         Tropical:[ [{lat: -8.3405, lng: 115.0919}, 'Bali'],
                    [{lat: 3.2028, lng: 73.2207}, 'Maldives'],
                    [{lat: 7.8804, lng: 98.3923}, 'Phuket'],
                    [{lat: 21.1619, lng: -86.8515}, 'Cancun'],
                    [{lat: -16.5004, lng: -151.7415}, 'Bora Bora'],
                    [{lat: -4.6796, lng: 55.4920}, 'Seychelles'],
                    [{lat: -17.7134, lng: 178.0650}, 'Fiji'],
                    [{lat: 9.5120, lng: 100.0136}, 'Koh Samui'],
                    [{lat: 3.2028, lng: 73.2207}, 'The Maldives'],
                    [{lat: 21.3069, lng: -157.8583}, 'Honolulu']],
           Winter:[ [{lat: 64.1466, lng: -21.9426}, 'Reykjavik'],
                    [{lat: 39.1911, lng: -106.8175}, 'Aspen'],
                    [{lat: 69.6496, lng: 18.9560}, 'Tromso'],
                    [{lat: 51.1784, lng: -115.5708}, 'Banff'],
                    [{lat: 59.9343, lng: 30.3351}, 'St. Petersburg'],
                    [{lat: 47.2692, lng: 11.4041}, 'Innsbruck'],
                    [{lat: 43.0621, lng: 141.3544}, 'Sapporo'],
                    [{lat: 45.9237, lng: 6.8694}, 'Chamonix'],
                    [{lat: 50.1163, lng: -122.9574}, 'Whistler'],
                    [{lat: -41.1335, lng: -71.3103}, 'Bariloche']]};
const Map = () => {
  const [address, setAddress] = useState("");
  const [didSet, setDidSet] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    didSet: false,
  });

  const center = useMemo(() => ({lat: 0, lng: 0}), []);
  const get = localStorage.getItem("vacation");
  if(get === 'set this'){
    alert("Please selection a vacation location and home address");
    localStorage.removeItem("vacation");
  }
  useEffect(() => localStorage.setItem("address", JSON.stringify(address)), [address]);
  const vacation = localStorage.getItem("vacType");
  const navigate = useNavigate();
  if(!vacation || vacation === "select"){
    navigate("/");
    localStorage.setItem("vacType", "select");
    return;
  }
  const vacations = locationList[vacation];
  if(navigator.geolocation && !didSet)
    navigator.geolocation.getCurrentPosition((position) => {
    setAddress({lat:position.coords.latitude, lng:position.coords.longitude});
    setDidSet(true);
  });
  return (
    <div className="Map">
      <Address apiKey={apiKey} callback={(loc) => {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(loc)}&key=${apiKey}`)
        .then((response) => {
          if(response.data.results.length > 0){
            setAddress(response.data.results[0].geometry.location);
          }else console.log("Address not found");
        });
      }}/>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={2}
        >
          <MarkerF icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          }}
          position={address}/>
          {vacations.map((item) => <MarkerF position={item[0]} onClick={() => handleMarkerClick(item)}/>)}
          {selectedMarker && (
            <InfoWindowF
              position={selectedMarker[0]}
              onCloseClick={handleInfoWindowClose}
              options={{pixelOffset: {width: 0, height: -35}}}
            >
              <div><h1 className='text-black'>{selectedMarker[1]}</h1>
              <button onClick={() => {
                localStorage.setItem("vacation", JSON.stringify(selectedMarker));
                navigate("/activities");
              }}>Select this location</button></div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;