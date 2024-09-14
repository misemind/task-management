import React, { useState } from 'react'
import { Button, Input, Label } from 'reactstrap';

interface Option {
    id: number;
    value: string;
}

const Checkbox = () => {
    const [options, setOptions] = useState<Option[]>([
        { id: 0, value: 'Option 1' }
    ]);

    const handleAddOption = () => {
        // Check if the last input is filled
        if (options[options.length - 1].value.trim() === '') {
            alert('Please fill the current input before adding a new one.');
            return;
        }
        setOptions([...options, { id: options.length, value: '' }]);
    };

    const handleOptionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newOptions = [...options];
        newOptions[index].value = event.target.value;
        setOptions(newOptions);
    };
    return (
        <div>
            <Label htmlFor="dropDown" className="form-label fs-13 mb-1">Options</Label>
            {options.map((option, index) => (
                <div key={option.id} className="mb-3">
                    <Input
                        type="text"
                        className="form-control"
                        value={option.value}
                        onChange={(event) => handleOptionChange(index, event)}
                        placeholder={`Option ${index + 1}`}
                    />
                </div>
            ))}

            <Button color="primary" className="btn-label" onClick={handleAddOption}>
                <i className="ri-add-line label-icon align-middle fs-16 me-2"></i> Add Option
            </Button>
        </div>
    )
}

export default Checkbox