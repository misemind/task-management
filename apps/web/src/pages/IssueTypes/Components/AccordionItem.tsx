import DynamicForm from 'Components/Common/DynamicForm';
import FeatherIcon from 'feather-icons-react';
import React from 'react'
import { AccordionBody, AccordionItem, Button, Input, Label } from 'reactstrap';

interface IProps {
    accordionId: string     // for accordion body
    toggleAccordion: (id: string) => void    // for toggling accordion
    activeAccordion: string      // active accordion id
    field: any         // accordion item data
    onChange?: (id: string, key: string, value: any) => void;
    onRemove?: (id: string) => void;
}

const AccordionItem1: React.FC<IProps> = ({ accordionId, toggleAccordion, activeAccordion, field, onChange, onRemove, ...rest }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(field.id, e.target.name, e.target.value);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(field.id, e.target.name, e.target.checked);
    };

    const handleRemoveClick = () => {
        onRemove?.(field.id);
    };
    // console.log(field, 'field');
    return (
        <>
            <AccordionItem key={field.id} {...rest} >
                <div className='accordion-header p-2 px-3 d-flex align-items-center justify-content-between'>
                    <div>
                        <i className={`${field.icon} me-2`}></i>
                        <span className={activeAccordion === accordionId ? 'text-muted' : ''}>{field.label}</span>
                    </div>
                    <div className='d-flex align-items-center gap-2'>
                        {
                            field.isRequired && <p className='m-0 text-muted fs-13 bg-light px-2 rounded-4'>Required</p>
                        }
                        <Button color='light' className="btn-icon bg-gradient rounded" size='sm'>
                            <FeatherIcon icon="more-vertical" size={16} />
                        </Button>
                        <Button color='light' className="btn-icon bg-gradient rounded" size='sm' onClick={(e) => {
                            e.stopPropagation();
                            toggleAccordion(accordionId);
                        }}>
                            <FeatherIcon style={{ transform: activeAccordion === accordionId ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'all 0.2s ease-in' }} icon="chevron-right" size={16} />
                        </Button>
                    </div>
                </div>
                <AccordionBody accordionId={accordionId}>
                    <div className='accordion-body-2 d-flex flex-column gap-2'>
                        <div>
                            <Label htmlFor="fieldName" className="form-label text-dark fs-13 mb-1">Field Name</Label>
                            <Input type="text" className="form-control" id="fieldName" placeholder="Field Name" required name='label' value={field.label ?? ''} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="displayDescription" className="form-label text-dark fs-13 mb-1">Display description</Label>
                            <Input type="text" className="form-control" id="displayDescription" placeholder="Display description" name='description' value={field.description ?? ''} onChange={handleInputChange} />
                        </div>
                        <div>
                            <DynamicForm type={field.fromSchema} />
                        </div>
                    </div>
                    <div className='accordion-footer pt-1 mt-2 border-top d-flex align-items-center justify-content-end gap-3'>
                        <div className="form-check form-check-dark">
                            <Input className="form-check-input" type="checkbox" id="isRequired" name='isRequired' checked={field.isRequired ?? false} onChange={handleCheckboxChange} />
                            <Label className="form-check-label text--50 fs-13" htmlFor="isRequired">
                                Required
                            </Label>
                        </div>
                        <Button color="light" size="sm" onClick={handleRemoveClick}> Remove </Button>
                    </div>
                </AccordionBody>
            </AccordionItem>
        </>
    )
}

export default AccordionItem1