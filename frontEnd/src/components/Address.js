import React, { Component } from 'react';

class Address extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.autocompleteService = null;
    this.autocomplete = null;
  }

  componentDidMount() {
    const { apiKey, callback } = this.props;

    if (!apiKey) {
      console.error('Google Maps API key is required');
      return;
    }

    this.initializeAutocomplete();
  }

  initializeAutocomplete() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.autocomplete = new window.google.maps.places.Autocomplete(this.inputRef.current);
    this.autocomplete.addListener('place_changed', this.onPlaceChanged.bind(this));
  }

  onPlaceChanged() {
    const place = this.autocomplete.getPlace();
    if(!place) return;
    if (!place.geometry) {
      // No address selected, handle the error or clear the input field.
      this.inputRef.current.value = '';
      return;
    }

    // Access the address components for the formatted address.
    const addressComponents = place.address_components;
    let formattedAddress = '';
    for (let i = 0; i < addressComponents.length; i++) {
      const addressType = addressComponents[i].types[0];
      if (addressType === 'street_number' || addressType === 'route') {
        formattedAddress += addressComponents[i].long_name + ' ';
      } else if (addressType === 'locality') {
        formattedAddress += addressComponents[i].long_name + ', ';
      } else if (addressType === 'postal_code') {
        formattedAddress += addressComponents[i].long_name + ' ';
      } else if (addressType === 'administrative_area_level_1') {
        formattedAddress += addressComponents[i].short_name + ', ';
      } else if (addressType === 'country') {
        formattedAddress += addressComponents[i].short_name;
      }
    }

    // Set the formatted address in the input field.
    this.inputRef.current.value = formattedAddress;
    this.props.callback(formattedAddress);
  }

  render() {
    return (
      <input
        type="text"
        ref={this.inputRef}
        placeholder="Enter your an address"
      />
    );
  }
}

export default Address;