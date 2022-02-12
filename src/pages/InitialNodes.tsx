import React, { useState } from 'react';
import ReactFlow from 'react-flow-renderer';
import initialElement from './InitialElements';
import adLogo from '../../assets/ad-logo.png';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '10000px',
  height: '650px',
};

const InitialNodes = () => {
  const adLabel = 'Profile Master';

  const initialElements = initialElement(adLogo, adLabel, 300);

  const [attributeMapping, setAttributeMapping] = useState<any>(
    initialElements
  );

  const onElementClick = () => {
    alert('Goto Settings and enter Base URL and API Key.');
  };

  return (
    <div style={customNodeStyles}>
      {
        <ReactFlow
          elements={attributeMapping}
          onElementClick={onElementClick}
        />
      }
    </div>
  );
};

export default InitialNodes;
