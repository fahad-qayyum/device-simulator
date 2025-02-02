import React from 'react';
import {Alert, Snackbar} from '@mui/material';

/**
 * SnackbarNotification component for displaying a snackbar notification with an alert.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.open - Whether the snackbar is open.
 * @param {string} props.message - The message to display in the alert.
 * @param {string} props.severity - The severity level of the alert ('error', 'warning', 'info', 'success').
 * @param {Function} props.onClose - The function to call when the snackbar is closed.
 * @returns {JSX.Element} The SnackbarNotification component.
 */
function SnackbarNotification({open, message, severity, onClose}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        >
            <Alert onClose={onClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default SnackbarNotification;