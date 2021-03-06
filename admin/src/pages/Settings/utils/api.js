import { axiosInstance } from '@strapi/admin/admin/src/core/utils';

const fetchMagicLinkSettings = async () => {
  const { data } = await axiosInstance.get('/magiclink/settings');
  return data;
};

const saveSecretKey = async body => {
  await axiosInstance.post('/magiclink/secretkey', body);
};

export { fetchMagicLinkSettings, saveSecretKey };
