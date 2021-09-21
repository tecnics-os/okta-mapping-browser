import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
// import { getApplications } from '../api/oktapi';
// import { getApplications } from './oktapi';

export default function Apps() {
  const initialElements: {
    id: string;
    type: string;
    data?: { label: any } | { label: string };
    position?: { x: number; y: number } | { x: number; y: number };
    sourcePosition?: string;
    targetPosition?: string;
    source?: string;
    target?: string;
    animated?: boolean;
    arrowHeadType?: string;
  }[] = [];

  const [elements, setElements] = useState();

  const onLoad = (reactFlowInstance: any) => reactFlowInstance.fitView();

  const sourceTargetPosition = { source: 'right', target: 'left' };
  const edgeType = 'straight';
  let id = 0;

  const getNodeId = () => `node-${(id += 1).toString()}`;

  function createElements(data) {
    const displayNames = Object.keys(data);
    for (
      let displayNamesIndex = 0;
      displayNamesIndex < displayNames.length;
      displayNamesIndex += 1
    ) {
      const sourcePosition = {
        x: 100,
        y: 100 * (displayNamesIndex + 1),
      };

      const targetPosition = {
        x: 500,
        y: 100 * (displayNamesIndex + 1),
      };

      const sourceId = getNodeId();
      const okatFieldName = displayNames[displayNamesIndex];
      const sourceData = { label: data[okatFieldName].expression };

      const sourceNode = {
        id: sourceId,
        type: 'input',
        data: sourceData,
        position: sourcePosition,
        sourcePosition: sourceTargetPosition.source,
      };

      const targetId = getNodeId();
      const targetData = { label: displayNames[displayNamesIndex] };

      const targetNode = {
        id: targetId,
        type: 'output',
        data: targetData,
        position: targetPosition,
        targetPosition: sourceTargetPosition.target,
      };

      initialElements.push(sourceNode);
      initialElements.push(targetNode);

      initialElements.push({
        id: `${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        animated: true,
        type: edgeType,
        arrowHeadType: 'arrowclosed',
      });
    }
    setElements(initialElements);
  }

  useEffect(() => {
    const headers = {
      Accept: 'application/json',
      Authorization: 'SSWS 00vo6XdAbMND1xRwvvoADFIHeaoJh-_CoeNOTS1zXD',
    };

    axios
      .get('https://dev-67150963.okta.com/api/v1/mappings', {
        params: {
          sourceId: '0oa1sq07cdQQzbXbE5d7',
        },
        headers,
      })
      .then((response) => {
        const mappingId = response.data[0].id;
        axios
          .get(`https://dev-67150963.okta.com/api/v1/mappings/${mappingId}`, {
            headers,
          })
          .then((mappingResponse) => {
            const rawData = mappingResponse.data;
            const { properties } = rawData;
            const data = properties;
            createElements(data);
          })
          .catch((error) => {
          });
      })
      });
  }, []);

  return (
    <div style={{ width: '200vh', height: '182vh', display: 'flex' }}>
      <ReactFlow elements={elements} onLoad={onLoad} />
    </div>
  );
}
