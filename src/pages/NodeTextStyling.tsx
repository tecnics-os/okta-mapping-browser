import React from 'react';

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

export default displayTextInsideTheNode;
