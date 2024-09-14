import { Input, Label } from 'reactstrap'

const Paragraph = () => {
    return (
        <div>
            <Label htmlFor="paragraph" className="form-label fs-13 mb-1">Default Text</Label>
            <Input type="textarea" className="form-control" id="paragraph" multiple rows="6" />
        </div>
    )
}

export default Paragraph