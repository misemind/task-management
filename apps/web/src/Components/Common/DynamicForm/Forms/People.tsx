import React from 'react'
import Select from 'react-select';
import { Label } from 'reactstrap'

const People = () => {
  const SingleOptions = [
    { value: 'Choices 1', label: 'Choices 1' },
    { value: 'Choices 2', label: 'Choices 2' },
    { value: 'Choices 3', label: 'Choices 3' },
    { value: 'Choices 4', label: 'Choices 4' }
  ];
  return (
    <div>
      <Label htmlFor="people" className="form-label fs-13 mb-1">Default users</Label>
      <Select
        // id="people"
        className="basic-single"
        classNamePrefix="select"
        // isLoading
        isSearchable
        isClearable
        // isMulti
        options={SingleOptions}
      />
    </div>
  )
}

export default People