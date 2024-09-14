import React from 'react'
import { Input, Label } from 'reactstrap'

const Labels = () => {
  return (
    <div>
      <Label htmlFor="label" className="form-label fs-13 mb-1">Default labels</Label>
      <Input type="select" className="form-control" id="label" placeholder='Select labels' >
        <option>Select labels</option>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </Input>
    </div>
  )
}

export default Labels