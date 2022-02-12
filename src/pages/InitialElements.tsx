import React from 'react';
import oktaLogo from '../../assets/okta-logo.png';
import { useProfileSourceLabel } from './ProfileMappings4';

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

const defaultLabel = 'Okta';
// const [profileSourceLogo] = useProfileSourceLabel();

const initialElement = (appLogo, label, initialPosition) => {
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
  return initialElements;
};

export default initialElement;
