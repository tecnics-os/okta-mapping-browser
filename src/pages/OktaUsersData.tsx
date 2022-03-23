import React, { useEffect } from 'react';
import { request } from '../Request';

const sendUrl = (url: string) => {
  return request(url);
};

const useOktaUsers = () => {
  const [listOfUsers, setListOfUsers] = React.useState<any>([]);
  const [usersLoaded, setUsersLoaded] = React.useState<Boolean>(false);

  const getUsersList = () => {
    sendUrl(`/api/v1/users`)
      .then((response) => {
        const usersList = response!.data;
        setListOfUsers(usersList);
        setUsersLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUsersList();
  }, []);

  return [listOfUsers, usersLoaded];
};

export default useOktaUsers;
