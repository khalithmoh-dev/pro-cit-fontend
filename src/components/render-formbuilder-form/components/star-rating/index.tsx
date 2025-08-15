import React, { useState } from 'react';
import styles from './start-rating.module.css';

interface PropsIF {
  totalStars?: number;
  initialValue?: number;
  onClick?: (value: number) => void;
  onPointerLeave?: (value: number) => void;
  disabled?: boolean;
  small?: boolean;
}

const StarRating: React.FC<PropsIF> = ({ totalStars = 5, onClick, onPointerLeave, initialValue, disabled, small }) => {
  const [rating, setRating] = useState(initialValue || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (ratingValue: number) => {
    if (disabled) return;
    setRating(ratingValue);
    onClick && onClick(ratingValue);
  };

  const handleMouseEnter = (ratingValue: number) => {
    if (disabled) return;
    setHoverRating(ratingValue);
  };

  const handleMouseLeave = (ratingValue: number) => {
    if (disabled) return;
    setHoverRating(0);
    onPointerLeave && onPointerLeave(ratingValue);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          className={`${styles.star} ${hoverRating >= i || rating >= i ? styles.filled : ''} ${small ? styles.small : ''}`}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
        />,
      );
    }
    return stars;
  };

  return <div className={styles.starRating}>{renderStars()}</div>;
};

export default StarRating;
