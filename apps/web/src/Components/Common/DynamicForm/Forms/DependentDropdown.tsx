import React, { useState } from 'react';
import { Button, Input, Label } from 'reactstrap';

interface ChildOption {
  id: number;
  value: string;
}

interface ParentOption {
  id: number;
  value: string;
  children: ChildOption[];
}

const DependentDropdown = () => {
  const [parentOptions, setParentOptions] = useState<ParentOption[]>([
    { id: Date.now(), value: 'Option 1', children: [{ id: Date.now(), value: '' }] }
  ]);

  // Handle change for parent input
  const handleParentChange = (parentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    setParentOptions(parentOptions.map(parent =>
      parent.id === parentId ? { ...parent, value: event.target.value } : parent
    ));
  };

  // Handle change for child input
  const handleChildChange = (parentId: number, childId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    setParentOptions(parentOptions.map(parent =>
      parent.id === parentId ? {
        ...parent,
        children: parent.children.map(child =>
          child.id === childId ? { ...child, value: event.target.value } : child
        )
      } : parent
    ));
  };

  // Add a new parent option only if the last parent option is filled
  const handleAddParent = () => {
    const lastParent = parentOptions[parentOptions.length - 1];
    if (lastParent.value.trim() === '' || lastParent.children.some(child => child.value.trim() === '')) {
      alert('Please fill the current parent and all its child options before adding a new parent.');
      return;
    }

    setParentOptions([
      ...parentOptions,
      { id: Date.now(), value: '', children: [{ id: Date.now(), value: '' }] }
    ]);
  };

  // Add a new child option to a specific parent only if the last child is filled
  const handleAddChild = (parentId: number) => {
    const parent = parentOptions.find(parent => parent.id === parentId);
    if (parent && parent.children[parent.children.length - 1].value.trim() === '') {
      alert('Please fill the current child option before adding a new one.');
      return;
    }

    setParentOptions(parentOptions.map(parent =>
      parent.id === parentId
        ? {
          ...parent,
          children: [...parent.children, { id: Date.now(), value: '' }]
        }
        : parent
    ));
  };

  // Remove a parent option
  const handleRemoveParent = (parentId: number) => {
    if (parentOptions.length === 1) {
      alert("At least one parent option is required.");
      return;
    }

    setParentOptions(parentOptions.filter(parent => parent.id !== parentId));
  };

  // Remove a child option from a specific parent
  const handleRemoveChild = (parentId: number, childId: number) => {
    setParentOptions(parentOptions.map(parent =>
      parent.id === parentId
        ? {
          ...parent,
          children: parent.children.length > 1
            ? parent.children.filter(child => child.id !== childId)
            : parent.children // Do not remove the last child
        }
        : parent
    ));
  };

  return (
    <div className='dependent-dropdown'>
      <Label htmlFor="dropDown" className="form-label fs-13 mb-1">Options</Label>
      {parentOptions.map((parent, parentIndex) => (
        <div key={parent.id} className='border p-2 rounded parent-box mb-2'>
          <div className='d-flex align-items-center gap-2 border-bottom'>
            <Input
              type="text"
              className="form-control border-0 mb-2"
              placeholder={`Parent Option ${parentIndex + 1}`}
              value={parent.value}
              onChange={(event) => handleParentChange(parent.id, event)}
            />
            <Button color="light" size='sm' onClick={() => handleRemoveParent(parent.id)}>
              <i className="ri-delete-bin-line"></i>
            </Button>
          </div>
          <div className='child-box px-4 mt-2'>
            {parent.children.map((child, childIndex) => (
              <div className='d-flex align-items-center gap-2'>
                <Input
                  key={child.id}
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Child Option ${childIndex + 1}`}
                  value={child.value}
                  onChange={(event) => handleChildChange(parent.id, child.id, event)}
                />
                <Button color="light" size='sm' onClick={() => handleRemoveChild(parent.id, child.id)} disabled={parent.children.length === 1}>
                  <i className="ri-delete-bin-line"></i>
                </Button>
              </div>
            ))}
            <Button
              color='light'
              className='add-btn'
              size='sm'
              onClick={() => handleAddChild(parent.id)}
            >
              <i className="ri-add-line" /> Add Child Option
            </Button>
          </div>
        </div>
      ))}
      <Button
        color='light'
        className='add-btn'
        size='sm'
        onClick={handleAddParent}
      >
        <i className="ri-add-line" /> Add Parent Option
      </Button>
    </div>
  );
};

export default DependentDropdown;