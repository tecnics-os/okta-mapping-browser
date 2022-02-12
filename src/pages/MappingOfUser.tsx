import React, { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
import profileSourceLogo from '../../assets/ad-logo.png';
import initialElement from './InitialElements';
import { useProfileSourceLabel } from './ProfileMappings4';
import { request } from '../Request';
import displayTextInsideTheNode from './NodeTextStyling';
import axios from 'axios';

const sendUrl = (url: string) => {
  return request(url);
};

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '2000px',
  height: '650px',
};

const mappingOfUser = () => {
  const [appLabel, defaultId, appId, data] = useProfileSourceLabel();
  let initialElements = initialElement(profileSourceLogo, appLabel, 300);
  const [attributeMapping, setAttributeMapping] = useState<any>(
    initialElements
  );
  const [userAssignedApps, setUserAssignedApps] = useState<any>([]);
  const [userMappingData, setUserMappingData] = useState<any>([]);
  const [loadedMappingData, setLoadedMappingData] = useState(false);
  const [mappingFromOkta, setMappingFromOkta] = useState<any>([]);
  const [
    listOfUsersFromProfileSource,
    setListOfUsersFromProfileSource,
  ] = useState<any>([]);
  const [loadedUsersList, setLoadedUsersList] = React.useState<boolean>(false);
  const [userProfileTemplateId, setUserProfileTemplateId] = useState<any>('');
  const [
    mappingDataFromProfileSource,
    setMappingDataFromProfileSource,
  ] = useState<any>([]);
  const [
    mappingFromProfileSourceToOkta,
    setMappingFromProfileSourceToOkta,
  ] = useState<any>([]);

  let { userId = '' } = {
    ...useParams(),
  };

  const [
    listOfAppsAssignedToUser,
    setListOfAppsAssignedToUser,
  ] = React.useState<any>([]);

  const getListOfAppsAssignedToUser = () => {
    sendUrl(
      `/api/v1/apps?filter=user.id+eq+"${userId}"&expand=user/${userId}`
    ).then((response) => {
      const appsList = response!.data;
      //       console.log(response!.data);
      setListOfAppsAssignedToUser(appsList);
    });
  };

  const getDataForMappingFromOkta = () => {
    sendUrl(`/api/v1/users/${userId}`)
      .then((response) => {
        const mappingData = response!.data;
        // console.log(response!.data);
        setUserMappingData(mappingData);
      })
      .then(() => {
        setLoadedMappingData(true);
      });
  };

  const getUsersList = () => {
    sendUrl(`/api/v1/apps/${appId}/users?expand=skinny-user%2Ctask`).then(
      (response) => {
        const userData = response!.data;
        if (userData.length === 50) {
          loadMoreUsers(userData);
        } else {
          //   console.log(userData);
          setListOfUsersFromProfileSource(userData);
          setLoadedUsersList(true);
        }
      }
    );
  };

  const loadMoreUsers = (data: any) => {
    let allAppsLoaded = false;
    if (data.length % 50 === 0) {
      sendUrl(
        `/api/v1/apps/${appId}/users?expand=skinny-user%2Ctask&after=${
          data[data.length - 1].id
        }&limit=50`
      ).then((response) => {
        data = [...data, ...(response!.data ? response!.data : [])];
        loadMoreUsers(data);
      });
    } else {
      allAppsLoaded = true;
    }
    if (allAppsLoaded) {
      setListOfUsersFromProfileSource(data);
      setLoadedUsersList(true);
    }
  };

  //   const getDataForProfileSourceToOktaMapping = () => {
  //     sendUrl(`/api/v1/user/types`)
  //       .then((response) => {
  //         const defaultUserId = response!.data[0].id;
  //         // console.log(defaultUserId);
  //         return defaultUserId;
  //       })
  //       .then((defaultUserId) => {
  //         return sendUrl(
  //           `/api/v1/mappings?sourceId=${appId}&targetId=${defaultUserId}`
  //         );
  //       })
  //       .then((response) => {
  //         const mappingId = response!.data[0].id;
  //         return sendUrl(`/api/v1/mappings/${mappingId}`);
  //       })
  //       .then((response) => {
  //         const mappingData = response!.data.properties;
  //         // console.log(response!.data);
  //         setMappingDataFromProfileSource(mappingData);
  //       });
  //   };

  const checkForUserInSelectedProfileSource = () => {
    let userFound = false;
    const errorMessage = 'User not found in this profile source.';
    console.log(listOfUsersFromProfileSource);
    console.log(userId);
    [...listOfUsersFromProfileSource].map((item) => {
      //       item.id === userId ? alert('User found!') : alert(errorMessage);
      item.id === userId ? (userFound = true) : userFound;
    });
    userFound ? '' : alert(errorMessage);
    return userFound;
  };

  const getMappingNodeTextLength = (node: number, data: any) => {
    let previousNodeTextLength = 0;
    if (node == 0) {
      return previousNodeTextLength;
    } else {
      let previousNode = node - 1;
      previousNodeTextLength = Object.values<any>(data)[previousNode].expression
        .length;
      let currentNodeTextLength = previousNodeTextLength / 0.8;
      // console.log(previousNodeTextLength);
      return currentNodeTextLength;
    }
  };

  //   console.log(mappingDataFromProfileSource);
  const showMappingFromProfileSourceToOkta = () => {
    let initialPosition = 0;
    let tempNodes: any = [];
    let yCoordinateOfElement = initialPosition - 50;
    let mappingData = { ...data };
    [...listOfUsersFromProfileSource].map((item) => {
      if (item.id === userId) {
        Object.keys(mappingData).forEach((element, index) => {
          Object.keys(item._embedded.user.profile).forEach((attribute) => {
            if (element === attribute) {
              tempNodes.push(
                {
                  id: `userAttr-${index + 1}`,
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  type: 'default',
                  data: {
                    label: displayTextInsideTheNode(
                      mappingData[element].expression,
                      oktaLogo
                    ),
                  },
                  position: {
                    x: 420,
                    y: yCoordinateOfElement += getMappingNodeTextLength(
                      index,
                      data
                    ),
                  },
                },
                {
                  id: `appAttr-${index + 1}`,
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  type: 'default',
                  data: {
                    label: displayTextInsideTheNode(
                      item._embedded.user.profile[attribute],
                      oktaLogo
                    ),
                  },
                  position: {
                    x: 650,
                    y: yCoordinateOfElement += 50,
                  },
                  style: { borderColor: '#009CDD' },
                },
                {
                  id: `pmToApp-${index + 1}`,
                  source: 'appTitle',
                  target: `userAttr-${index + 1}`,
                  animated: true,
                },
                {
                  id: `app-${index + 1}`,
                  arrowHeadType: 'arrowclosed',
                  source: `userAttr-${index + 1}`,
                  target: `appAttr-${index + 1}`,
                  animated: false,
                },
                {
                  id: `appToOkta-${index + 1}`,
                  source: `appAttr-${index + 1}`,
                  target: `oktaApp`,
                  animated: true,
                }
              );
            }
          });
        });
      }
    });
    setMappingFromProfileSourceToOkta(tempNodes);
  };

  const showMappingOfUserFromOkta = () => {
    let yCoordinateOfElement = -50;
    const tempNodes: any = [];
    let mappingData: any = { ...userMappingData };
    //     console.log(mappingData.profile);
    Object.keys(mappingData.profile).forEach((item, index) => {
      //       console.log(item);
      if (mappingData.profile[item] !== null) {
        tempNodes.push(
          {
            id: `okta-${index + 1}`,
            sourcePosition: 'right',
            targetPosition: 'left',
            type: 'default',
            data: {
              label: displayTextInsideTheNode(item, oktaLogo),
            },
            position: {
              x: 1120,
              y: yCoordinateOfElement += 50,
            },
            style: { borderColor: '#009CDD' },
          },
          {
            id: `oktaToMap-${index + 1}`,
            sourcePosition: 'right',
            targetPosition: 'left',
            type: 'output',
            data: {
              label: displayTextInsideTheNode(
                mappingData.profile[item],
                oktaLogo
              ),
            },
            position: {
              x: 1370,
              y: yCoordinateOfElement += 50,
            },
            style: { borderColor: '#009CDD' },
          },
          {
            id: `oktaTo-${index + 1}`,
            source: `oktaApp`,
            target: `okta-${index + 1}`,
            animated: true,
          },
          {
            id: `oktaToApp-${index + 1}`,
            source: `okta-${index + 1}`,
            target: `oktaToMap-${index + 1}`,
            animated: false,
            arrowHeadType: 'arrowclosed',
          }
        );
      }
    });
    setMappingFromOkta(tempNodes);
  };

  const showAppsAssignedToSelectedUser = () => {
    let tempNodes: any = [];
    let yCoordinateOfElement = -50;
    [...listOfAppsAssignedToUser].forEach((item: any, index: any) => {
      // console.log(item._embedded.app.id);
      tempNodes.push({
        id: `userApp-${index + 1}`,
        sourcePosition: 'right',
        targetPosition: 'left',
        type: 'output',
        data: {
          label: displayTextInsideTheNode(item.label, item._links.logo.href),
        },
        position: {
          x: 1600,
          y: yCoordinateOfElement += 70,
        },
      });
    });
    setUserAssignedApps(tempNodes);
  };

  useEffect(() => {
    getListOfAppsAssignedToUser();
    getDataForMappingFromOkta();
    checkForUserInSelectedProfileSource();
    showMappingFromProfileSourceToOkta();
    //     getDefaultUserId();
  }, [userId]);

  useEffect(() => {
    if (!loadedUsersList) {
      getUsersList();
      //       getDataForProfileSourceToOktaMapping();
      //   console.log(listOfUsersFromProfileSource);
    }
  }, [appId]);

  useEffect(() => {
    showAppsAssignedToSelectedUser();
    if (loadedMappingData) {
      showMappingOfUserFromOkta();
    }
  }, [listOfAppsAssignedToUser]);

  useEffect(() => {
    //     showMappingOfUserFromOkta();
    //     console.log(appId);
  }, []);

  return (
    <div style={customNodeStyles}>
      <ReactFlow
        elements={[
          ...attributeMapping,
          ...mappingFromProfileSourceToOkta,
          ...userAssignedApps,
          ...mappingFromOkta,
        ]}
      ></ReactFlow>
    </div>
  );
};

export default mappingOfUser;
