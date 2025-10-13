import React from 'react';
import MuiSwitch from '@mui/material/Switch';
import Label from '../Label';

const Switch: React.FC<SwitchPropsIF> = ({ checked, onChange, label="" }) => {


  return (
    // @ts-ignore
    <div className='d-flex gap-2'>
      <Label labelName={label} />
      <MuiSwitch
        sx={{
          width: 40,
          height: 20,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            transform: 'translateX(0)',
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              '& + .MuiSwitch-track': {
                backgroundColor: '#4cd964',
                opacity: 1,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 18,
            height: 18,
            boxSizing: 'border-box'
          },
          '& .MuiSwitch-track': {
            borderRadius: 10,
            backgroundColor: '#e5e5ea',
            opacity: 1,
          },
        }}
        defaultChecked = {checked}
        onChange = {onChange}
      />
    </div>
  );
};

export default Switch;