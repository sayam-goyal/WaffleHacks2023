import React, { useState } from 'react';
import {Link} from 'react-router-dom';

const Button = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const imageStyle = {
    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    filter: isHovered ? 'brightness(100%)' : 'brightness(80%)',
    transition: 'transform 0.3s ease-in-out, filter 0.3s ease-in-out',
  };

  return (
    <Link to="/details">
      <img
        src={props.image}
        alt="Button"
        style={imageStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => localStorage.setItem('vacType', props.name)}
      />
    </Link>
  );
};

export default Button;