import React, { useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const Activities = () => {
  const [restaurants, setRestaurants] = useState([]);
  const get = JSON.parse(localStorage.getItem('vacation'));
  const home = JSON.parse(localStorage.getItem("address"));
  let navigate = useNavigate();
  if(!get || !home || get === 'set this'){
    navigate("/map");
    localStorage.setItem('vacation', 'set this');
    return;
  }
  const location = get[0];
  const address =  get[1];
  const handleSearch = () => {
    // Use the Google Maps Places API to find nearby restaurants based on address

    const geocoder = new window.google.maps.Geocoder();

    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    console.log(location);
    const request = {
      location: location,
      radius : 2000,
      type: 'restaurant',
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Fetch photo URL for each result
        const resultsWithPhotoUrlPromises = results.map((result) => {
          return new Promise((resolve) => {
            getPhotoUrl(result.place_id, 400, (photoUrl) => {
              resolve({
                ...result,
                photoUrl: photoUrl,
              });
            });
          });
        });

        Promise.all(resultsWithPhotoUrlPromises).then((resultsWithPhotoUrl) => {
          setRestaurants(resultsWithPhotoUrl);
        });
      } else {
        console.log('Error fetching nearby restaurants:', status);
      }
    });
  };

  const getPhotoUrl = (placeId, maxWidth, callback) => {
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      placeId: placeId,
      fields: ['photos'],
    };

    placesService.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place.photos && place.photos.length > 0) {
        const photoReference = place.photos[0].getUrl({ maxWidth: maxWidth });
        callback(photoReference);
      } else {
        callback('');
      }
    });
  };


  return (
    <div>
      <button onClick={handleSearch}>Search</button>
      <ul>
        {restaurants.map((restaurant) => (
          <div>
          <li key={restaurant.place_id}>
            {restaurant.name}
            
          </li>
          <img src={restaurant.photoUrl} alt={restaurant.name} />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Activities;
