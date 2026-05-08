// src/utils/notify.js
import toast from 'react-hot-toast';

export const notifySuccess = (msg) => toast.success(msg);
export const notifyError = (msg) => toast.error(msg);
export const notifyLoading = (msg) => toast.loading(msg);
export const notifyRemove = (id) => toast.dismiss(id);