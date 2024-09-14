import { Input, Label } from 'reactstrap'

const Number = () => {
    return (
        <div>
            <Label htmlFor="number" className="form-label fs-13 mb-1">Default Number</Label>
            <Input type="number" className="form-control" id="number" />
        </div>
    )
}

export default Number