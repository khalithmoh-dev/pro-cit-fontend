import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { ICON_NAMES } from '../../utils/static-data';
import Icon from '../../components/Icons';

interface CustomButtonProps extends MuiButtonProps {
  icon?: keyof typeof ICON_NAMES;
  variant?: 'contained'
}

const CustomButton: React.FC<CustomButtonProps> = ({
  icon,
  children,
  ...rest
}) => {
  const getIconColor = (type: string): string => {
    switch (type) {
      case 'primary':
        return 'white';
      case 'secondary':
        return 'black';
      default:
        return 'white';
    }
  };

  return (
    <>
      {icon && (
        <Icon
          name={ICON_NAMES[icon]}
          size={20}
          color={getIconColor(rest.type)}
        />
      )}
      <MuiButton {...rest} variant="contained">
        {children}
      </MuiButton>
    </>
  );
};

export default CustomButton;
