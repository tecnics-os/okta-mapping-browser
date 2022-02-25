import React, { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
// import profileSourceLogo from '../../assets/ad-logo.png';
import initialElement from './InitialElements';
import { useProfileSourceLabel } from './ProfileMappings4';
import { request } from '../Request';
import displayTextInsideTheNode from './NodeTextStyling';
import axios from 'axios';
import ProfileSources from './ProfileSources';
import { profile } from 'console';

const sendUrl = (url: string) => {
  return request(url);
};

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '2000px',
  height: '650px',
};

const mappingOfUser = () => {
  const [
    profileSources,
    loadedProfileSources,
    // listOfProfileSources,
  ] = ProfileSources(0);

  console.log();
  const [
    appLabel,
    defaultId,
    appId,
    data,
    profileSourceLogo,
  ] = useProfileSourceLabel();
  let [initialPosition, setInitialPosition] = useState<any>(100);

  let initialElements = [
    {
      id: 'oktaApp',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: displayTextInsideTheNode('Okta', oktaLogo),
      },
      position: { x: 900, y: initialPosition },
    },
  ];

  let { userId = '' } = {
    ...useParams(),
  };

  const [attributeMapping, setAttributeMapping] = useState<any>(
    initialElements
  );
  const [profileSourceId, setProfileSourceId] = useState<any>('');
  const [userAssignedApps, setUserAssignedApps] = useState<any>([]);
  const [userMappingData, setUserMappingData] = useState<any>([]);
  const [loadedMappingData, setLoadedMappingData] = useState(false);
  const [mappingFromOkta, setMappingFromOkta] = useState<any>([]);
  const [listOfUsersFromApp, setListOfUsersFromApp] = useState<any>([]);
  const [
    listOfUsersFromProfileSource,
    setListOfUsersFromProfileSource,
  ] = useState<any>([]);
  const [loadedUsersList, setLoadedUsersList] = React.useState<boolean>(true);
  const [
    mappingFromProfileSourceToOkta,
    setMappingFromProfileSourceToOkta,
  ] = useState<any>([]);
  // const [sourceId, setSourceId] = useState<any>(appId);
  const [appNodeId, setAppNodeId] = useState<any>('');
  const [oktaToAppMappingData, setOktaToAppMappingData] = useState<any>([]);
  const [idForUserAssignedApp, setIdForUserAssignedApp] = useState<any>();
  const [clickedApp, setClickedApp] = useState<boolean>(true);
  const [upstreamMappingData, setUpstreamMappingData] = useState<any>([]);
  const [defaultUserId, setDefaultUserId] = useState<any>();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [
    listOfAppsAssignedToUser,
    setListOfAppsAssignedToUser,
  ] = React.useState<any>([]);
  const [appsLoaded, setAppsLoaded] = useState<any>(false);
  const [nodeIdForUserAssignedApp, setNodeIdForUserAssignedApp] = useState<any>(
    ''
  );

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

  const getDefaultUserId = () => {
    sendUrl(`/api/v1/user/types`).then((response) => {
      const defaultId = response!.data[1].id;
      setDefaultUserId(defaultId);
      // setLoadedData(true);
    });
  };

  // console.log(profileSources);

  const getListOfAppsAssignedToUser = () => {
    console.log(userId);
    sendUrl(`/api/v1/apps?filter=user.id+eq+"${userId}"&expand=user/${userId}`)
      .then((response) => {
        const appsList = response!.data;
        //       console.log(response!.data);
        setListOfAppsAssignedToUser(appsList);
        setAppsLoaded(true);
        return response!.data;
      })
      .then((response) => {
        setDataLoaded(false);
        checkForProfileSourceAssignedToUser(response, profileSources);
      });
  };

  // const checkForProfileSourceAssignedToUser = () => {
  //   [...listOfAppsAssignedToUser].map((app) => {
  //     [...listOfProfileSources].map((ps) => {
  //       if (ps._embedded.app.id === app.id) {
  //         // alert('Yes!');
  //         [...profileSources].map((item) => {
  //           if (item.data.label.props.children[0] === ps._embedded.app.label) {
  //             setAppNodeId(item.id);
  //             console.log(item.data.label.props.children[0]);
  //           }
  //         });
  //         setProfileSourceId(app.id);
  //         getListOfUsersAssignedToProfileSource(app.id);
  //         getUpstreamMappingsData(app.id);
  //         console.log('Hello!');
  //         // console.log(profileSources);
  //         // getUpstreamMappingsData(app.id);
  //       }
  //     });
  //   });
  // };

  const checkForProfileSourceAssignedToUser = (response, profileSources) => {
    // let nodeId = '';
    let listOfApps = response;
    console.log(listOfApps);
    console.log(profileSources);
    let profileSourceFound = false;
    [...listOfApps].map((item) => {
      [...profileSources].map((ps) => {
        if (item.label === ps.data.label.props.children[0]) {
          // console.log('Yes!');
          let nodeId = ps.id;
          profileSourceFound = true;
          console.log(ps.id);
          setAppNodeId(ps.id);
          getListOfUsersAssignedToProfileSource(item.id, nodeId);
          // getUpstreamMappingsData(item.id, ps.id);
          // showMappingFromProfileSourceToOkta(ps.id);
        }
      });
    });
    if (!profileSourceFound) {
      alert('The selected user is not assigned to any profile source.');
      setMappingFromProfileSourceToOkta([]);
    }
  };

  const getListOfUsersAssignedToProfileSource = (appId, nodeId) => {
    // setLoadedUsersList(false);
    // setDataLoaded(false);
    // let appId = profileSourceId;
    // console.log('yes!');
    sendUrl(`/api/v1/apps/${appId}/users?expand=skinny-user%2Ctask&limit=5000`)
      .then((response) => {
        const userData = response!.data;
        setListOfUsersFromProfileSource(userData);
        // showMappingFromProfileSourceToOkta(nodeId);
        return response!.data;
      })
      .then((response) => {
        setLoadedUsersList(true);
        getUpstreamMappingsData(appId, nodeId, response);
        // setDataLoaded(true);
      });
    // .then(() => {
    //   setDataLoaded(true);
    //   showMappingFromProfileSourceToOkta(nodeId);
    // });
  };

  const getUpstreamMappingsData = (appId, nodeId, response) => {
    // setDataLoaded(false);
    // console.log(defaultUserId);
    // let appId = profileSourceId;
    sendUrl(`/api/v1/mappings?sourceId=${appId}&targetId=${defaultUserId}`)
      .then((response) => {
        let mappingId = response!.data[0].id;
        sendUrl(`/api/v1/mappings/${mappingId}`).then((response) => {
          const mappingData = response!.data.properties;
          setUpstreamMappingData(mappingData);
        });
      })
      .then(() => {
        setDataLoaded(true);
        showMappingFromProfileSourceToOkta(nodeId, response);
      });
  };

  // useEffect(() => {
  //   // checkForProfileSourceAssignedToUser();
  //   showMappingFromProfileSourceToOkta();
  // }, [upstreamMappingData, listOfUsersFromProfileSource]);

  // useEffect(() => {
  //   showMappingFromProfileSourceToOkta();
  // }, [appNodeId]);

  useEffect(() => {
    getDefaultUserId();
    // checkForProfileSourceAssignedToUser();
  }, []);

  useEffect(() => {
    getListOfAppsAssignedToUser();
  }, []);

  useEffect(() => {
    getDataForMappingFromOkta();
    getListOfAppsAssignedToUser();
    // checkForProfileSourceAssignedToUser();
    // showMappingFromProfileSourceToOkta();
    //     getDefaultUserId();
  }, [userId]);

  // useEffect(() => {
  //   showMappingFromProfileSourceToOkta();
  // }, [sourceId]);

  // useEffect(() => {
  //   // if (dataLoaded) {
  //   showMappingFromProfileSourceToOkta();
  //   // }
  // }, [listOfUsersFromProfileSource, appNodeId]);

  useEffect(() => {
    showAppsAssignedToSelectedUser();
    if (loadedMappingData) {
      showMappingOfUserFromOkta();
    }
  }, [listOfAppsAssignedToUser]);

  useEffect(() => {
    showAppsAssignedToSelectedUser();
  }, [nodeIdForUserAssignedApp]);

  // console.log(listOfAppsAssignedToUser);
  // console.log(listOfProfileSources);

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
  const showMappingFromProfileSourceToOkta = (nodeId, response) => {
    if (dataLoaded && loadedUsersList) {
      let listOfUsersFromPs = response;
      // let nodeId = appNodeId;
      // console.log(appNodeId);
      let initialPosition = 0;
      // console.log(data);
      let tempNodes: any = [];
      let yCoordinateOfElement = initialPosition - 50;
      let mappingData = { ...upstreamMappingData };
      // console.log(mappingData);
      console.log(listOfUsersFromProfileSource);
      console.log(nodeId);
      [...listOfUsersFromPs].map((item) => {
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
                        profileSourceLogo
                      ),
                    },
                    position: {
                      x: 420,
                      y: yCoordinateOfElement += getMappingNodeTextLength(
                        index,
                        upstreamMappingData
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
                        profileSourceLogo
                      ),
                    },
                    position: {
                      x: 650,
                      y: yCoordinateOfElement += 50,
                    },
                    style: { borderColor: '#009CDD' },
                  },
                  {
                    id: `psToAppuser-${index + 1}`,
                    // source: 'appTitle',
                    source: nodeId,
                    target: `userAttr-${index + 1}`,
                    animated: true,
                  },
                  {
                    id: `appuserToValue-${index + 1}`,
                    arrowHeadType: 'arrowclosed',
                    source: `userAttr-${index + 1}`,
                    target: `appAttr-${index + 1}`,
                    animated: false,
                  },
                  {
                    id: `valueToOkta-${index + 1}`,
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
    }
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
              label: displayTextInsideTheNode(
                mappingData.profile[item],
                oktaLogo
              ),
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
              label: displayTextInsideTheNode(item, oktaLogo),
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
      // console.log(item);
      tempNodes.push({
        id: `userApp-${index + 1}`,
        sourcePosition: 'right',
        targetPosition: 'left',
        type: 'output',
        data: {
          label: displayTextInsideTheNode(item.label, item._links.logo[0].href),
        },
        position: {
          x: 1600,
          y: yCoordinateOfElement += 70,
        },
        style: {
          background:
            `userApp-${index + 1}` === nodeIdForUserAssignedApp
              ? '#009CDD'
              : 'white',
        },
      });
    });
    setUserAssignedApps(tempNodes);
  };

  const onElementClick = (event: any, element: any) => {
    if (element.id.split('-')[0] === 'userApp') {
      let id = element.id;
      let appNumber = element.id.split('-')[1];
      let appName = event.srcElement.innerText;
      // console.log(listOfAppsAssignedToUser);
      [...listOfAppsAssignedToUser].map((item) => {
        if (item.label === appName) {
          // console.log(item.id);
          setIdForUserAssignedApp(item.id);
          getListOfUsersAssignedToApp(item.id, id);
          setClickedApp(true);
          putBackgroundColour(id);
          setNodeIdForUserAssignedApp(id);
          // matchUserFromAppAndSearchBar(element.id);
        }
      });
    }
  };

  const putBackgroundColour = (nodeId) => {
    const backgroundColour = 'blue';
    if (nodeId === 'userApp-3') {
      return backgroundColour;
    } else {
      return 'white';
    }
  };

  const getListOfUsersAssignedToApp = (idForUserAssignedApp, nodeId) => {
    setLoadedUsersList(false);
    sendUrl(
      `/api/v1/apps/${idForUserAssignedApp}/users?expand=skinny-user%2Ctask&limit=5000`
    ).then((response) => {
      const userData = response!.data;
      setListOfUsersFromApp(userData);
      setLoadedUsersList(true);
      matchUserFromAppAndSearchBar(userData, nodeId);
    });
  };

  const matchUserFromAppAndSearchBar = (userData, nodeId) => {
    [...userData].forEach((item) => {
      if (item.id === userId) {
        setOktaToAppMappingData(item);
        showMappingFromOktaToApp(item, nodeId);
      }
    });
  };

  const showMappingFromOktaToApp = (items, nodeId) => {
    // let item: any = oktaToAppMappingData;
    let item = items;
    // let nodeId = appNodeId;
    let tempNodes: any = [];
    let yCoordinateOfElement = 0;
    let errorMessage = `There are no user mappings for this app.`;
    // console.log('item', item.profile);
    Object.keys(item.profile).length === 0 ? alert(errorMessage) : '';
    Object.keys(item.profile).forEach((key, index) => {
      // console.log(key);
      // console.log(item.profile[key]);
      if (item.profile[key] !== null) {
        // console.log(key, item.profile[key]);
        tempNodes.push(
          {
            id: `key-${index + 1}`,
            sourcePosition: 'right',
            targetPosition: 'left',
            type: 'default',
            data: {
              label: displayTextInsideTheNode(item.profile[key], oktaLogo),
            },
            position: {
              x: 1120,
              y: yCoordinateOfElement += 50,
            },
            style: { borderColor: '#009CDD' },
          },
          {
            id: `value-${index + 1}`,
            sourcePosition: 'right',
            targetPosition: 'left',
            type: 'default',
            data: {
              label: displayTextInsideTheNode(key, oktaLogo),
            },
            position: {
              x: 1370,
              y: yCoordinateOfElement += 50,
            },
            style: { borderColor: '#009CDD' },
          },
          {
            id: `oktaToKey-${index + 1}`,
            source: `oktaApp`,
            target: `key-${index + 1}`,
            animated: true,
          },
          {
            id: `KeyToValue-${index + 1}`,
            source: `key-${index + 1}`,
            target: `value-${index + 1}`,
            animated: false,
            arrowHeadType: 'arrowclosed',
          },
          {
            id: `valueToApp-${index + 1}`,
            source: `value-${index + 1}`,
            target: nodeId,
            animated: true,
          }
        );
      }
    });
    // console.log(tempNodes);
    setMappingFromOkta(tempNodes);
    // }
  };

  // const matchNamesOfProfileSources = (appName) => {
  //   [...listOfProfileSources].map((item) => {
  //     if (appName === item._embedded.app.label) {
  //       setSourceId(item._embedded.app.id);
  //       console.log(item._embedded.app.label);
  //       console.log(appName);
  //       getListOfUsersAssignedToApp(item._embedded.app.id);
  //     }
  //   });
  // };

  return (
    <div style={customNodeStyles}>
      {loadedProfileSources && loadedUsersList && (
        <ReactFlow
          elements={[
            ...attributeMapping,
            ...mappingFromProfileSourceToOkta,
            ...userAssignedApps,
            ...mappingFromOkta,
            ...profileSources,
          ]}
          onElementClick={onElementClick}
        ></ReactFlow>
      )}
    </div>
  );
};

export default mappingOfUser;
