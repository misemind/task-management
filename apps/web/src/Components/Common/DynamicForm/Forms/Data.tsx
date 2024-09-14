import { Input, Label } from 'reactstrap'

const Date = () => {
    return (
        <div>
            <Label htmlFor="date" className="form-label fs-13 mb-1">Default date</Label>
            <Input type="date" className="form-control" id="date" />
        </div>
    )
}

export default Date