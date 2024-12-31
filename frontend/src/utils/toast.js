import toast from 'react-hot-toast';

const showSuccessToast = (message = "Success!") => {
  toast.success(message, {
    position: 'top-right',
    duration: 3000,
  });
};

const showErrorToast = (message = "Something went wrong!") => {
  toast.error(message, {
    position: 'top-right',
    duration: 3000,
  });
}

export { showSuccessToast, showErrorToast };