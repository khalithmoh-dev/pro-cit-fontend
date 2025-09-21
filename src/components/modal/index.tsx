import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import Button from '../../components/Button';
import { Close } from '@mui/icons-material';
import './style.css';


export type ButtonVariant = 'text' | 'outlined' | 'contained';
export type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
export type VariantType = 'button' | 'submit' | 'reset' | 'cancel';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ActionButton {
    label: string;
    onClick: () => void;
    variant: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    type?: VariantType;
    disabled?: boolean;
    secondary?: boolean;
}

interface PopupProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: ActionButton[];
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
}

const Popup: React.FC<PopupProps> = ({
    open,
    onClose,
    title,
    children,
    actions = [],
    maxWidth = 'md',
    fullWidth = true
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            className="custom-popup"
        >
            <DialogTitle className="popup-title">
                <span className="title-text">{title}</span>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    className="close-button"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent className="popup-content">
                {children}
            </DialogContent>

            {actions.length > 0 && (
                <>
                    <div className="popup-divider"></div>
                    <DialogActions className="popup-actions">
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                size={action.size || "medium"}
                                onClick={action.onClick}
                                type={action.type ?? 'button'}
                                disabled={action.disabled}
                                variantType={
                                    action.variant
                                }
                                secondary={action.secondary}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default Popup;