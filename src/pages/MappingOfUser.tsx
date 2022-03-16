import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap } from 'react-flow-renderer';
import { useParams, useHistory } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
// import profileSourceLogo from '../../assets/ad-logo.png';
// import initialElement from './InitialElements';
import { useProfileSourceLabel } from './ProfileMappings4';
import { request } from '../Request';
import displayTextInsideTheNode from './NodeTextStyling';
import axios from 'axios';
import ProfileSources from './ProfileSources';
// import { profile } from 'console';
import { CSVLink } from 'react-csv';
// import { useFormControl } from '@material-ui/core';
import { Circles } from 'react-loading-icons';
import noLogo from '../../assets/white.png';

const sendUrl = (url: string) => {
  return request(url);
};

// const history = useHistory();

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '2000px',
  height: '650px',
};

const oktaColour = '#009CDD';
const defaultColour = 'white';

const mappingOfUser = () => {
  // console.log();
  // let dataFromProfileSource: any;
  let dataFromOkta: any;
  let assignedApps: any;

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
      position: { x: 750, y: initialPosition },
    },
  ];

  let { userId = '', userName = '', nodeId = '' } = {
    ...useParams(),
  };

  // console.log(userId);

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
  const [profileSourceNumber, setProfileSourceNumber] = useState<any>(
    nodeId.split('-')[1]
  );
  const [profileSourceName, setProfileSourceName] = useState<any>('');
  const [sourceFound, setSourceFound] = useState<boolean>(false);
  const [loadedUpstreamData, setLoadedUpstreamData] = useState<boolean>(false);

  // const [dataFromProfileSource, setDataFromProfileSource] = useState<any>([]);

  const [
    profileSourceToOktaKeysArray,
    setProfileSourceToOktaKeysArray,
  ] = useState<any>([]);
  const [
    profileSourceToOktaValuesArray,
    setProfileSourceToOktaValuesArray,
  ] = useState<any>([]);
  const [oktaKeysArray, setOktaKeysArray] = useState<any>([]);
  const [oktaValuesArray, setOktaValuesArray] = useState<any>([]);
  const [appsArray, setAppsArray] = useState<any>([]);

  const [
    profileSources,
    loadedProfileSources,
    listOfProfileSources,
  ] = ProfileSources(0, profileSourceNumber);

  const [sources, setSources] = useState<any>(profileSources);

  // console.log(profileSourceToOktaKeysArray);

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
    // window.location.reload();
    // console.log('starting');
    // console.log(userId);
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
        if (loadedProfileSources) {
          // console.log(profileSources);
          checkForProfileSourceAssignedToUser(response);
        }
        // checkForProfileSourceAssignedToUser(response, profileSources);
      });
  };

  useEffect(() => {
    checkForProfileSourceAssignedToUser(listOfAppsAssignedToUser);
  }, [listOfProfileSources]);

  // console.log(listOfProfileSources);
  const checkForProfileSourceAssignedToUser = (response) => {
    // let nodeId = '';
    // console.log('starting3');
    let counter = 0;
    let profileSourceFound: boolean = false;
    let listOfApps = response;
    // console.log(listOfApps);
    // console.log(profileSources);
    [...listOfApps].map((item) => {
      [...profileSources].map((ps) => {
        if (item.label === ps.data.label.props.children[0]) {
          // console.log('starting4');
          let nodeId = ps.id;
          profileSourceFound = true;
          setSourceFound(true);
          setProfileSourceName(ps.data.label.props.children[0]);
          setAppNodeId(ps.id);
          getListOfUsersAssignedToProfileSource(item.id, nodeId);
          // setSource(ps.data.label.props.children[0]);
          // profileSource = ps.data.label.props.children[0];

          // console.log(ps.id);
          // getUpstreamMappingsData(item.id, ps.id);
          // showMappingFromProfileSourceToOkta(ps.id);
          return;
        }
      });
      counter++;
      // console.log(counter);
    });
    // console.log(listOfApps.length);
    if (!profileSourceFound && listOfApps.length === counter) {
      // alert('The selected user is not assigned to any profile source.');
      setMappingFromProfileSourceToOkta([]);
    }
    // if (!profileSourceFound && listOfApps.length === counter) {
    //   console.log(counter);
    //   setMappingFromProfileSourceToOkta([]);
    //   alert('fine!');
    // }
  };

  // console.log(profileSource);

  const getListOfUsersAssignedToProfileSource = (appId, nodeId) => {
    // setLoadedUsersList(false);
    // setDataLoaded(false);
    // let appId = profileSourceId;
    // console.log('yes!');
    sendUrl(`/api/v1/apps/${appId}/users?expand=skinny-user%2Ctask&limit=5000`)
      .then((response) => {
        const userData = response!.data;
        // console.log(userData);
        setListOfUsersFromProfileSource(userData);
        // showMappingFromProfileSourceToOkta(nodeId);
        return userData;
      })
      .then((response) => {
        // console.log(response);
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
    // console.log(response);
    sendUrl(`/api/v1/mappings?sourceId=${appId}&targetId=${defaultUserId}`)
      .then((response) => {
        let mappingId = response!.data[0].id;
        sendUrl(`/api/v1/mappings/${mappingId}`).then((response) => {
          const mappingData = response!.data.properties;
          setUpstreamMappingData(mappingData);
          // console.log(mappingData);
        });
      })
      .then(() => {
        setDataLoaded(true);
        // console.log(response);
      })
      .then(() => {
        showMappingFromProfileSourceToOkta(nodeId, response);
      });
  };

  useEffect(() => {
    getListOfAppsAssignedToUser();
  }, [loadedProfileSources]);

  useEffect(() => {}, [sources]);

  useEffect(() => {
    getDefaultUserId();
  }, []);

  useEffect(() => {
    getDataForMappingFromOkta();
    getListOfAppsAssignedToUser();
  }, [userId]);

  useEffect(() => {
    showMappingFromProfileSourceToOkta(appNodeId, listOfUsersFromProfileSource);
  }, [upstreamMappingData]);

  useEffect(() => {
    // checkForProfileSourceAssignedToUser(listOfAppsAssignedToUser, nodeId);
    // showMappingFromProfileSourceToOkta(nodeId, listOfUsersFromProfileSource);
  }, [listOfUsersFromProfileSource]);

  useEffect(() => {
    // console.log(profileSource);
    getAllDataForCsv();
  }, [dataFromOkta]);

  useEffect(() => {
    showAppsAssignedToSelectedUser();
    if (loadedMappingData) {
      showMappingOfUserFromOkta();
    }
    // getDataForMappingFromOkta();
  }, [listOfAppsAssignedToUser]);

  useEffect(() => {
    showAppsAssignedToSelectedUser();
  }, [nodeIdForUserAssignedApp]);

  useEffect(() => {
    getAllDataForCsv();
    prepareDataForCsvExport();
  }, [mappingFromProfileSourceToOkta, mappingFromOkta, userAssignedApps]);

  useEffect(() => {
    prepareDataForCsvExport();
  }, [
    mappingFromProfileSourceToOkta,
    mappingFromOkta,
    userAssignedApps,
    profileSourceToOktaKeysArray,
  ]);

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
    if (loadedUsersList) {
      setProfileSourceNumber(appNodeId.split('-')[1]);
      let listOfUsersFromPs = response;
      // let nodeId = appNodeId;
      // console.log(nodeId);
      // console.log(response);
      let initialPosition = 0;
      // console.log(data);
      let tempNodes: any = [];
      let yCoordinateOfElement = initialPosition - 20;
      let mappingData = { ...upstreamMappingData };
      // console.log(mappingData);
      // console.log(listOfUsersFromPs);
      // nodeId = 'profileSource-4';
      // console.log(nodeId);
      // console.log(mappingData);
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
                        noLogo
                      ),
                    },
                    position: {
                      x: 250,
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
                        noLogo
                      ),
                    },
                    position: {
                      x: 500,
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
      setLoadedUpstreamData(true);
      // dataFromProfileSource = tempNodes;
    }
  };
  // console.log(dataFromProfileSource);

  const getAllDataForCsv = () => {
    // console.log(mappingFromProfileSourceToOkta);
    // setProfileSourceToOktaKeysArray([]);
    // profileSource;
    // console.log('Hi');
    // console.log(dataFromOkta);
    // profileSource = source;
    let data: any = [];
    let data1: any = [];
    let data2: any = [];
    let map: any = [];
    let map1: any = [];
    let map2: any = [];
    let apps: any = [];
    if (mappingFromProfileSourceToOkta !== undefined) {
      mappingFromProfileSourceToOkta.filter((item) => {
        if (
          item.id.split('-')[0] === 'userAttr' ||
          item.id.split('-')[0] === 'appAttr'
        ) {
          // console.log(item.data.label.props.children[0]);
          data.push(item.data.label.props.children[0]);
        }
      });
    }

    // console.log(data);

    data.forEach((item, index) => {
      if (index % 2 === 0) {
        data1.push(item);
      } else if ((index + 1) % 2 === 0) {
        data2.push(item);
      }
    });
    // console.log(data1);

    setProfileSourceToOktaKeysArray(data1);
    setProfileSourceToOktaValuesArray(data2);

    if (mappingFromOkta !== undefined) {
      mappingFromOkta.filter((item) => {
        if (
          item.id.split('-')[0] === 'okta' ||
          item.id.split('-')[0] === 'oktaToMap'
        ) {
          map.push(item.data.label.props.children[0]);
        }
      });
    }

    map.forEach((item, index) => {
      if (index % 2 == 0) {
        map1.push(item);
      } else if ((index + 1) % 2 == 0) {
        map2.push(item);
      }
    });

    setOktaKeysArray(map1);
    setOktaValuesArray(map2);

    if (userAssignedApps !== undefined) {
      // console.log('Hello');
      userAssignedApps.forEach((item) => {
        apps.push(item.data.label.props.children[0]);
      });
    }

    setAppsArray(apps);
  };

  const prepareDataForCsvExport = () => {
    let maxIndexLength: any = Math.max(
      profileSourceToOktaKeysArray.length,
      oktaKeysArray.length,
      appsArray.length
    );

    let output: any = [];
    for (let index = 0; index < maxIndexLength; index++) {
      // for (const index of maxIndexLength) {
      let output1 = [
        {
          profileSource: profileSourceName ?? '',
          key1: profileSourceToOktaKeysArray[index] ?? '',
          value1: profileSourceToOktaValuesArray[index] ?? '',
          Okta: 'Okta',
          key2: oktaKeysArray[index] ?? '',
          value2: oktaValuesArray[index] ?? '',
          appsAssigned: appsArray[index] ?? '',
        },
      ];
      output = output.concat(output1);
    }
    // console.log(output);
    return output;
  };

  const showMappingOfUserFromOkta = () => {
    // console.log(profileSourceToOktaKeysArray);
    let yCoordinateOfElement = -50;
    let tempNodes: any = [];
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
                noLogo
              ),
            },
            position: {
              x: 1000,
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
              label: displayTextInsideTheNode(item, noLogo),
            },
            position: {
              x: 1250,
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
    dataFromOkta = tempNodes;
    // console.log(dataFromOkta);
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
          x: 1500,
          y: yCoordinateOfElement += 70,
        },
        style: {
          background:
            `userApp-${index + 1}` === nodeIdForUserAssignedApp
              ? oktaColour
              : defaultColour,
        },
      });
    });
    setUserAssignedApps(tempNodes);
    // assignedApps = tempNodes;
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
          setNodeIdForUserAssignedApp(id);
          // matchUserFromAppAndSearchBar(element.id);
        }
      });
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
              label: displayTextInsideTheNode(item.profile[key], noLogo),
            },
            position: {
              x: 1000,
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
              label: displayTextInsideTheNode(key, noLogo),
            },
            position: {
              x: 1250,
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

  const headers = [
    { label: 'Profile Source', key: 'profileSource' },
    { label: 'Key-1', key: 'key1' },
    { label: 'Value-1', key: 'value1' },
    { label: 'Okta', key: 'Okta' },
    { label: 'Key-2', key: 'key2' },
    { label: 'Value-2', key: 'value2' },
    { label: 'Apps Assigned', key: 'appsAssigned' },
  ];

  const history = useHistory();

  return (
    <div style={customNodeStyles}>
      {/* <CSVLink
        data={prepareDataForCsvExport()}
        headers={headers}
        filename={`${userName}Mapping.csv`}
      >
        <div>
          <button
            style={{
              position: 'relative',
              left: '585px',
              backgroundColor: '#c32148',
              color: 'white',
            }}
          >
            Download User Data
          </button>
        </div>
      </CSVLink> */}
      {/* <>
        <button
          onClick={() => {
            history.goBack();
          }}
        >
          Go Back
        </button>
      </> */}

      {/* {loadedProfileSources && loadedUsersList && (
        <ReactFlow
          elements={[
            ...profileSources,
            ...attributeMapping,
            ...mappingFromProfileSourceToOkta,
            ...userAssignedApps,
            ...mappingFromOkta,
          ]}
          onElementClick={onElementClick}
          defaultZoom={0.8}
        ></ReactFlow>
      )} */}

      {loadedProfileSources && loadedUsersList && loadedUpstreamData ? (
        <ReactFlow
          elements={[
            ...profileSources,
            ...attributeMapping,
            ...mappingFromProfileSourceToOkta,
            ...userAssignedApps,
            ...mappingFromOkta,
          ]}
          onElementClick={onElementClick}
          defaultZoom={0.8}
        ></ReactFlow>
      ) : (
        <Circles
          width={'50px'}
          height={'50px'}
          fill="dodgerBlue"
          strokeOpacity={0.125}
          speed={2}
        />
      )}
    </div>
  );
};

{
  /* <Circles
            width={'30px'}
            height={'30px'}
            stroke="#98ff98"
            strokeOpacity={0.125}
            speed={2}
          /> */
}

export default mappingOfUser;
