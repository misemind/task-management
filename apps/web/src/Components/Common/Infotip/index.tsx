import React, { useState, ReactNode, useEffect } from 'react';
import { Tooltip, TooltipProps } from 'reactstrap';

// Define an interface for the props
interface InfotipProps {
  children: ReactNode;
  title: string;
  placement?: TooltipProps['placement'];
  id?: string;
}

const Infotip: React.FC<InfotipProps> = ({
  children,
  title,
  placement = 'top',
  id,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [generatedId, setGeneratedId] = useState(id || '');

  // Generate a unique id if none is provided
  useEffect(() => {
    if (!id) {
      setGeneratedId(`tooltip-${Math.random().toString(36).substring(2, 15)}`);
    }
  }, [id]);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  // Ensure the child element gets the correct id for the tooltip target
  const childWithProps = React.cloneElement(children as React.ReactElement<any>, { id: generatedId });

  return (
    <div>
      {childWithProps}

      {/* Render Tooltip only if generatedId exists */}
      {generatedId && (
        <Tooltip
          placement={placement}
          isOpen={tooltipOpen}
          target={generatedId} // Use the generated or passed id
          toggle={toggle}
        >
          {title}
        </Tooltip>
      )}
    </div>
  );
};

export default Infotip;
