import React, { useState } from 'react';
import ReactFlow from 'react-flow-renderer';
// import axios from 'axios';
// import logo from '../../assets/okta-logo.png';
// import styles from '../../src/App.global.css'

// import styles from '../App.global.css';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '10000px',
  height: '1500px',
};

const UserProfileMappings = () => {
  const initialElements = [
    {
      id: 'appTitle',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'input',
      data: { label: 'Profile Mappings' },
      position: { x: 20, y: 200 },
    },
    {
      id: 'appToOkta',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: (
          <div id="upStream" className="downStream">
            Application to Okta user
          </div>
        ),
      },
      position: { x: 270, y: 80 },
    },
    {
      id: 'oktaToApp',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: (
          <div id="downStream" className="downStream">
            Okta user to application
          </div>
        ),
      },
      position: { x: 270, y: 320 },
      overflow: 'hidden',
    },
    { id: 'arrow1', source: 'appTitle', target: `appToOkta`, animated: true },
    { id: 'arrow2', source: 'appTitle', target: `oktaToApp`, animated: true },
  ];

  const [attributeMapping, setAttributeMapping] = useState<any>(
    initialElements
  );

  const onElementClick = () => {
    alert('Please select any application for viewing the mapping.');
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

export default UserProfileMappings;
