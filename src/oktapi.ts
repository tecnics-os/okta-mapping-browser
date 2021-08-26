const axios = require('axios');

const authHeader = {
  Authorization: `SSWS `,
};

export default const getApplications = async (): Promise<unknown> => {
  const response = await axios.get({ headers: authHeader });
  return response.data;
};
