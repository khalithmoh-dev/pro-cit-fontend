import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import DynamicForm from '../generic-form';

const STEP_ICON_MAP: Record<string, React.ReactNode> = {
  Personal: <PersonIcon />,
  Contact: <CallIcon />,
  Employment: <WorkIcon />,
  Education: <SchoolIcon />,
  Documents: <DescriptionIcon />,
  Emergency: <WarningIcon />,
  Banking: <AccountBalanceIcon />,
  Additional: <InfoIcon />,
};
function StepIcon(props: StepIconProps & { stepName: string }) {
  const { active, completed, className, stepName } = props;
  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      {STEP_ICON_MAP[stepName]}
    </StepIconRoot>
  );
}

const StepIconRoot = styled('div')<{
  ownerState: { active?: boolean; completed?: boolean };
}>(({ ownerState }) => ({
  width: 'max-content',
  height: 'max-content',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: ownerState.active ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f1f5f9',
  color: ownerState.active ? '#fff' : '#64748b',
  boxShadow: ownerState.active ? '0 8px 20px rgba(37,99,235,.35)' : 'none',
}));

type StepperProps = {
  StepperData: {
    stepName: string;
    formSchema: any;
  }[];
  activeStep: number;
  onFormSubmit: () => void;
};
const StepCard = styled('div')<{
  active?: boolean;
}>(({ active }) => ({
  minWidth: 120,
  height: 90,
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  cursor: 'pointer',
  backgroundColor: active ? '#2563eb' : '#f8fafc',
  color: active ? '#fff' : '#64748b',
  border: '1px solid #e5e7eb',
  transition: 'all 0.2s ease',
  '& svg': {
    fontSize: 28,
  },
  '&:hover': {
    backgroundColor: active ? '#2563eb' : '#eef2ff',
  },
}));
const StepConnectorLine = styled('div')<{
  active?: boolean;
}>(({ active }) => ({
  height: 100,
  backgroundColor: active ? '#0048e3' : '#000000',
  transition: 'background-color 0.3s ease',
}));

const StepperComponet: React.FC<StepperProps> = ({ StepperData, activeStep, onFormSubmit }) => {
  return (
    <>
      {/* ===== STEP SELECTOR (CARD STYLE) ===== */}
      <Box
        display="flex"
        gap={0}
        sx={{
          justifyContent: 'space-around',
          paddingBlock: 4,
          paddingBottom: 1,
        }}
      >
        {StepperData.map((step, index) => (
          <Box key={step.stepName} display="flex" alignItems="center" flexShrink={0}>
            {/* STEP CARD */}
            <StepCard active={activeStep === index}>
              {STEP_ICON_MAP[step.stepName]}
              <Typography variant="body2" fontWeight={500}>
                {step.stepName}
              </Typography>
            </StepCard>

            {/* CONNECTOR (except last step) */}
            {index < StepperData.length - 1 && <StepConnectorLine active={index < activeStep} />}
          </Box>
        ))}
      </Box>

      {/* ===== FORM ===== */}
      <DynamicForm
        schema={StepperData[activeStep].formSchema}
        onSubmit={(values: any) => {
          if (onFormSubmit) {
            onFormSubmit();
          }
        }}
      />
    </>
  );
};

export default StepperComponet;
