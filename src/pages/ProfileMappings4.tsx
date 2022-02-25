import React, { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
import { request } from '../Request';
import useAppsData from './ApplicationData';
import useMappingData from './MappingData';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import initialElement from './InitialElements';
import displayTextInsideTheNode from './NodeTextStyling';
import ProfileSources from './ProfileSources';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '2000px',
  height: '650px',
};

let profileSourceLabel;
let appId;
let defaultId;
let upstreamData;
let profileSourceLogo;
let nodeId;

const sendUrl = (url: string) => {
  return request(url);
};

const ProfileMappings = () => {
  let { defaultUserId = '', id2 = '', label = '', logo = '', nodeId = '' } = {
    ...useParams(),
  };

  // console.log(defaultUserId);

  profileSourceLabel = label;
  appId = id2;

  const appLogo = decodeURIComponent(logo);
  profileSourceLogo = appLogo;

  const [upstreamMappingData, setUpstreamMappingData] = React.useState<any>({});
  const [appMapping, setAppMapping] = useState<any>([]);
  const [clicked, setClicked] = useState(false);
  const [appsLoaded, appsData] = useAppsData();
  const [mapsLoaded, downstreamMappingData] = useMappingData();
  const [upstreamMapping, setUpstreamMapping] = useState<any>([]);
  const [downstreamMapping, setDownstreamMapping] = useState<any>([]);
  // const [appsForMapping, setAppsForMapping] = useState<any>([]);
  const [appNumber, setAppNumber] = useState<any>();
  const [profileSourceId, setProfileSourceId] = useState<any>('');
  let [initialPosition, setInitialPosition] = useState<any>(100);

  const [
    profileSources,
    loadedProfileSources,
    profileSourcesData,
  ] = ProfileSources(initialPosition - 150);

  let initialElements = [
    // {
    //   id: 'arrow1',
    //   source: `${profileSourceId}` === '' ? `${nodeId}` : `${profileSourceId}`,
    //   target: `oktaApp`,
    //   animated: true,
    //   label: 'mappings',
    // },
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

  const [attributeMapping, setAttributeMapping] = useState<any>(
    initialElements
  );

  const getUpstreamMappingsData = (appId) => {
    // console.log(defaultUserId);
    sendUrl(
      `/api/v1/mappings?sourceId=${appId}&targetId=${defaultUserId}`
    ).then((response) => {
      let mappingId = response!.data[0].id;
      sendUrl(`/api/v1/mappings/${mappingId}`).then((response) => {
        const mappingData = response!.data.properties;
        setUpstreamMappingData(mappingData);
      });
    });
  };

  const getMappingNodeTextLength = (node: number, data: any) => {
    let previousNodeTextLength = 0;
    if (node == 0) {
      return previousNodeTextLength;
    } else {
      let previousNode = node - 1;
      previousNodeTextLength = Object.values<any>(data)[previousNode].expression
        .length;
      let currentNodeTextLength = previousNodeTextLength / 1.1;
      // console.log(previousNodeTextLength);
      return currentNodeTextLength;
    }
  };

  upstreamData = upstreamMappingData;

  const showUpstreamMapping = () => {
    let tempNodes: any = [];
    let yCoordinateOfElement = initialPosition - 50;
    let mappingData = { ...upstreamMappingData };
    Object.keys(mappingData).forEach((item: any, index: any) => {
      tempNodes.push(
        {
          id: `userAttr-${index + 1}`,
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'default',
          data: {
            label: displayTextInsideTheNode(
              mappingData[item].expression,
              appLogo
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
            label: displayTextInsideTheNode(item, oktaLogo),
          },
          position: {
            x: 650,
            y: yCoordinateOfElement += 50,
          },
          style: { borderColor: '#009CDD' },
        },
        {
          id: `pmToApp-${index + 1}`,
          // source: 'appTitle',
          source:
            `${profileSourceId}` === '' ? `${nodeId}` : `${profileSourceId}`,
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
    });
    setUpstreamMapping(tempNodes);
    setAttributeMapping([...initialElements, ...tempNodes]);
  };

  const mapAllAppsFromOkta = () => {
    let tempNodes: any = [];
    let yCoordinateOfElement = -50;
    [...appsData].forEach((item: any, index: any) => {
      // console.log(item._embedded.app.id);
      tempNodes.push({
        id: `app-${index + 1}`,
        sourcePosition: 'right',
        targetPosition: 'left',
        type: 'output',
        data: {
          label: displayTextInsideTheNode(
            item._embedded.app.label,
            item._embedded.appLogo.href
          ),
        },
        position: {
          x: 1600,
          y: yCoordinateOfElement += 70,
        },
      });
    });
    setAppMapping(tempNodes);
  };

  const showDownstreamMapping = (
    appName: any,
    appNumber: number,
    yCoordinate: number
  ) => {
    let yCoordinateOfElement = yCoordinate - 200;
    let tempNodes: any = [];
    let mappingData = [...downstreamMappingData];
    mappingData.map((item, position) => {
      let singleAppMappingData = Object.values(mappingData[position])[3];
      [...appsData].map((app) => {
        if (
          item.target.id === app._embedded.app.id &&
          appName === app._embedded.app.label
        ) {
          if (Object.keys(item.properties).length === 0) {
            alert('There are no attributes for mapping.');
          } else {
            Object.keys(item.properties).map((key, index) => {
              tempNodes.push(
                {
                  id: `okta-${index + 1}`,
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  type: 'default',
                  data: {
                    label: displayTextInsideTheNode(
                      item.properties[key].expression,
                      oktaLogo
                    ),
                  },
                  position: {
                    x: 1120,
                    y: yCoordinateOfElement += getMappingNodeTextLength(
                      index,
                      singleAppMappingData
                    ),
                  },
                  style: { borderColor: '#009CDD' },
                },
                {
                  id: `oktaToMap-${index + 1}`,
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  type: 'default',
                  data: {
                    label: displayTextInsideTheNode(
                      key,
                      app._embedded.appLogo.href
                    ),
                  },
                  position: {
                    x: 1370,
                    y: yCoordinateOfElement += 50,
                  },
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
                },
                {
                  id: `appToMap-${index + 1}`,
                  source: `oktaToMap-${index + 1}`,
                  target: `app-${appNumber}`,
                  animated: true,
                }
              );
            });
          }
        }
      });
    });
    setDownstreamMapping(tempNodes);
    setAttributeMapping([...initialElements, ...upstreamMapping, ...tempNodes]);
  };

  useEffect(() => {
    showUpstreamMapping();
  }, [upstreamMappingData, initialPosition]);

  useEffect(() => {
    setAttributeMapping([...initialElements]);
    getUpstreamMappingsData(id2);
    showUpstreamMapping();
  }, [id2]);

  // useEffect(() => {
  //   getInitialNodes(profileSourceId);
  // }, [profileSourceId]);

  useEffect(() => {
    setAttributeMapping([
      ...initialElements,
      ...upstreamMapping,
      ...downstreamMapping,
    ]);
  }, [appNumber]);

  useEffect(() => {
    mapAllAppsFromOkta();
  }, [appsLoaded, clicked]);

  // console.log(mapsLoaded);

  const onElementClick = (event: any, element: any) => {
    if (element.id === 'arrow1') {
      showUpstreamMapping();
    } else if (element.id.split('-')[0] === 'app') {
      let appName = event.srcElement.innerText;
      let yCoordinate = element.position.y;
      let appNumber = element.id.split('-')[1];
      showDownstreamMapping(appName, appNumber, yCoordinate);
      setInitialPosition(yCoordinate);
      setAppNumber(appNumber);
      setClicked(true);
    } else if (element.id.split('-')[0] === 'profileSource') {
      let id = element.id;
      gotoUpstreamMapping(event.srcElement.innerText);
      setProfileSourceId(id);
    }
  };

  const gotoUpstreamMapping = (appName) => {
    [...profileSourcesData].map((item) => {
      if (appName === item._embedded.app.label) {
        console.log(item._embedded.app.id);
        getUpstreamMappingsData(item._embedded.app.id);
      }
    });
  };

  return (
    <div style={customNodeStyles}>
      {mapsLoaded && loadedProfileSources && (
        <ReactFlow
          elements={[...attributeMapping, ...appMapping, ...profileSources]}
          onElementClick={onElementClick}
        ></ReactFlow>
      )}
    </div>
  );
};

const useProfileSourceLabel = () => {
  // console.log(profileSourceLabel);
  // console.log(appId);

  useEffect(() => console.log(profileSourceLabel), [appId]);

  return [
    profileSourceLabel,
    defaultId,
    appId,
    upstreamData,
    profileSourceLogo,
    nodeId,
  ];
};

export { ProfileMappings, useProfileSourceLabel };
