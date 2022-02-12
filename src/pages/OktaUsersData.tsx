import React, { useEffect } from 'react';
import { request } from '../Request';

const sendUrl = (url: string) => {
  return request(url);
};

const useOktaUsers = () => {
  const [listOfUsers, setListOfUsers] = React.useState<any>([]);

  const getUsersList = () => {
    sendUrl(`/api/v1/users`).then((response) => {
      const usersList = response!.data;
      console.log(response!.data);
      setListOfUsers(usersList);
    });
  };

  useEffect(() => {
    getUsersList();
  }, []);

  return [listOfUsers];
};

export default useOktaUsers;
