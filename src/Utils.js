import { toast } from 'react-toastify';

export function handleError(error) {
    if (error) {
        console.log(error);
        toast(error.message + ": " + error.status, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            progress: undefined,
        });
    }
}

export function message(message) {
    if (message) {
        toast(message, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            progress: undefined,
        });
    }
}