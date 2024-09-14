import React from 'react'
import { Input, Label } from 'reactstrap'

const UrlForm = () => {
  return (
    <div>
      <Label htmlFor="urlForm" className="form-label fs-13 mb-1">Default Url</Label>
      <Input type="text" className="form-control" id="urlForm" placeholder="https://example.com" />
    </div>
  )
}

export default UrlForm