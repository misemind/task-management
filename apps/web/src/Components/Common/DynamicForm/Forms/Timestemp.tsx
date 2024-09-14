import React from 'react'
import { Input, Label } from 'reactstrap'

const Timestemp = () => {
  return (
    <div>
      <Label htmlFor="timestemp" className="form-label fs-13 mb-1">Default Timestemp</Label>
      <div className='d-flex gap-2'>
        <Input type="date" className="form-control" id="timestemps" placeholder="" />
        <Input type="time" className="form-control" id="timestemps" placeholder="" />
      </div>
      <div className="form-check form-check-primary mt-2">
        <Input className="form-check-input" type="checkbox" id="currentTime" name='currentTime' />
        <Label className="form-check-label text--50 fs-13" htmlFor="currentTime">
          Set to current time by default
        </Label>
      </div>
    </div>
  )
}

export default Timestemp