import { useState } from 'react'
import { Button, Input, Label } from 'reactstrap'

interface Option {
    id: number;
    value: string;
}

const DropDown = () => {
    const [options, setOptions] = useState<Option[]>([
        { id: Date.now(), value: 'Option 1' }
    ]);

    const handleAddOption = () => {
        // Check if the last input is filled
        if (options[options.length - 1].value.trim() === '') {
            alert('Please fill the current input before adding a new one.');
            return;
        }
        setOptions([...options, { id: Date.now(), value: '' }]);
    };

    const handleOptionChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, value: event.target.value } : option
        ));
    };

    const handleRemoveOption = (id: number) => {
        if (options.length === 1) {
            alert("At least one option is required.");
            return;
        }
        setOptions(options.filter(option => option.id !== id));
    };

    return (
        <div>
            <Label htmlFor="dropDown" className="form-label fs-13 mb-1">Options</Label>
            {options.map((option, index) => (
                <div key={option.id} className="mb-2 d-flex align-items-center gap-2">
                    <Input
                        type="text"
                        className="form-control"
                        value={option.value}
                        onChange={(event) => handleOptionChange(index, event)}
                        placeholder={`Option ${index + 1}`}
                    />
                    {
                        options.length > 1 && (
                            <Button color="danger" outline size='sm' onClick={() => handleRemoveOption(option.id)}>
                                <i className="ri-delete-bin-line"></i>
                            </Button>
                        )
                    }
                </div>
            ))}
            <Button
                color='light'
                className='add-btn'
                size='sm'
                onClick={handleAddOption}
            >
                <i className="ri-add-line" /> Add Option
            </Button>
        </div>
    )
}

export default DropDown