import React, { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
import { request } from '../Request';
import useAppsData from './ApplicationData';
import useMappingData from './MappingData';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '10000px',
  height: '650px',
};

const displayTextInsideTheNode = (label, imageSource) => {
  return (
    <div
      style={{
        flexWrap: 'wrap',
        overflowWrap: 'break-word',
      }}
    >
      {label}
      <img
        style={{
          position: 'absolute',
          right: '1px',
          top: '1px',
        }}
        className="appLogo"
        height="13px"
        width="auto"
        src={imageSource}
      />
    </div>
  );
};

const ProfileMappings = () => {
  let { id1 = '', id2 = '', label = '', logo = '' } = {
    ...useParams(),
  };
  const appLogo = decodeURIComponent(logo);

  const defaultLabel = 'Okta';

  const [upstreamMappingData, setUpstreamMappingData] = React.useState<any>({});
  const [appMapping, setAppMapping] = useState<any>([]);
  const [disabled, setDisabled] = useState(false);
  const [appsLoaded, appsData] = useAppsData();
  const [mapsLoaded, downstreamMappingData] = useMappingData();
  const [upstreamMapping, setUpstreamMapping] = useState<any>([]);
  const [downstreamMapping, setDownstreamMapping] = useState<any>([]);
  const [appsForMapping, setAppsForMapping] = useState<any>([]);
  let [initialPosition, setInitialPosition] = useState<any>(200);
  const [appNumber, setAppNumber] = useState<any>();

  let initialElements = [
    {
      id: 'appTitle',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'input',
      data: {
        label: displayTextInsideTheNode(label, appLogo),
      },
      position: { x: 200, y: initialPosition },
    },
    {
      id: 'oktaApp',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: displayTextInsideTheNode(defaultLabel, oktaLogo),
      },
      position: { x: 900, y: initialPosition },
    },
    {
      id: 'arrow1',
      source: 'appTitle',
      target: `oktaApp`,
      animated: true,
      label: 'mappings',
    },
  ];

  const [attributeMapping, setAttributeMapping] = useState<any>(
    initialElements
  );

  const sendUrl = (url: string) => {
    return request(url);
  };

  const getUpstreamMappingsData = () => {
    sendUrl(`/api/v1/mappings?sourceId=${id2}&targetId=${id1}`).then(
      (response) => {
        let mappingId = response!.data[0].id;
        sendUrl(`/api/v1/mappings/${mappingId}`).then((response) => {
          const mappingData = response!.data.properties;
          setUpstreamMappingData(mappingData);
        });
      }
    );
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
      console.log(previousNodeTextLength);
      return currentNodeTextLength;
    }
  };

  const showUpstreamMapping = () => {
    console.log(attributeMapping);
    //     let tempNodes: any = [...attributeMapping];
    let tempNodes: any = [];
    //     let permanentNodes: any = [...attributeMapping];
    let yCoordinateOfElement = initialPosition - 150;
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
    });
    setUpstreamMapping(tempNodes);
    setAttributeMapping([...initialElements, ...tempNodes]);
  };

  const mapAllAppsFromOkta = () => {
    let tempNodes: any = [];
    let yCoordinateOfElement = -50;
    [...appsData].forEach((item: any, index: any) => {
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
    getUpstreamMappingsData();
    setAttributeMapping([...initialElements]);
  }, [id2]);

  useEffect(() => {
    console.log(initialPosition);
    showUpstreamMapping();
  }, [initialPosition]);

  useEffect(() => {
    setAttributeMapping([
      ...initialElements,
      ...upstreamMapping,
      ...downstreamMapping,
    ]);
  }, [appNumber]);

  useEffect(() => {
    mapAllAppsFromOkta();
  }, [appsLoaded]);

  const onElementClick = (event: any, element: any) => {
    if (element.id === 'arrow1') {
      showUpstreamMapping();
    } else if (element.id.split('-')[0] === 'app') {
      let appName = event.srcElement.innerText;
      let yCoordinate = element.position.y;
      let appNumber = element.id.split('-')[1];
      showDownstreamMapping(appName, appNumber, yCoordinate);
      setInitialPosition(yCoordinate);
      console.log(initialPosition);
      setAppNumber(appNumber);
    }
  };

  return (
    <div style={customNodeStyles}>
      {mapsLoaded && (
        <ReactFlow
          elements={[...attributeMapping, ...appMapping]}
          onElementClick={onElementClick}
        ></ReactFlow>
      )}
    </div>
  );
};

export default ProfileMappings;
