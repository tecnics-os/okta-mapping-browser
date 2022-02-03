import React from 'react';
import { useParams } from 'react-router-dom';

const AppUsers = () => {
  let { appId = '' } = {
    ...useParams(),
  };
  console.log(appId);
  return appId;
};

export default AppUsers;
