import axios from 'axios';
import 'dotenv/config';

export const axiosInstance = axios.create({
  headers: {
    'x-service-token': process.env.AUTH_SERVICE_TOKEN,
  },
});

export default axiosInstance;
