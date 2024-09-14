import React from 'react'
import { Input, Label } from 'reactstrap'

interface IProps {
    className?: string;
    placeholder?: string;
    name: string;
    label: string;
    value: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const SortText = () => {
    return (
        <div>
            <Label htmlFor="sortText" className="form-label fs-13 mb-1">Default text</Label>
            <Input type="text" className="form-control" id="sortText" />
        </div>
    )
}

export default SortText