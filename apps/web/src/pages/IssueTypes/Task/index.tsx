import { useRef, useState } from 'react'
import { Accordion, AccordionBody, AccordionItem, Breadcrumb, BreadcrumbItem, Button, Container, FormGroup, Input, Label, Offcanvas } from 'reactstrap'
import './index.scss'
import FeatherIcon from 'feather-icons-react';
import Infotip from 'Components/Common/Infotip';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { draggableItems, fieldsData } from '../Data';
import AccordionItem1 from '../Components/AccordionItem';
import { generateUniqueId } from 'common/utils/generateUniqueId';

const Task = () => {
    const offcanvasRef = useRef<HTMLDivElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [activeAccordion, setActiveAccordion] = useState<string>('0');
    const [descriptionFields, setDescriptionFields] = useState(fieldsData.description);
    const [contextFields, setContextFields] = useState(fieldsData.context);
    const [hideWithEmptyFields, setHideWithEmptyFields] = useState(fieldsData.hideWithEmpty);
    const [draggables, setDraggables] = useState(draggableItems);

    // Track dragging state
    const [isDraggingFromRight, setIsDraggingFromRight] = useState(false);
    const [isDraggingFromAccordion, setIsDraggingFromAccordion] = useState(false);

    const [isDraggable, setIsDraggable] = useState(true);

    const toggleAccordion = (id: any) => {
        setActiveAccordion(prevId => (prevId === id ? null : id));
    }
    const handleToggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const toggle = () => setIsDrawerOpen(!isDrawerOpen);

    const handleOnDragEnd = (result: any) => {
        setIsDraggingFromRight(false);  // Reset dragging state from right
        setIsDraggingFromAccordion(false);  // Reset dragging state from accordion
        if (!result.destination) return;

        const { source, destination } = result;

        // Case 1: Reordering within the same accordion (same droppableId)
        if (source.droppableId === destination.droppableId) {
            const fieldList = getFieldsList(source.droppableId);
            const reorderedList = reorder(fieldList, source.index, destination.index);
            setFieldsList(source.droppableId, reorderedList);
        }

        // Case 2: Moving from draggables to any accordion (should not remove from draggables)
        else if (source.droppableId === 'draggables' && ['description', 'context', 'hideWithEmpty'].includes(destination.droppableId)) {
            // Copy the item (don't remove it from the draggables list)
            const sourceList = [...draggables];
            const movedItem = { ...sourceList[source.index], id: generateUniqueId() }; // Copy the item and generate a unique ID

            // Add the item to the destination accordion
            const destinationList = getFieldsList(destination.droppableId);
            destinationList.splice(destination.index, 0, movedItem); // Insert with unique ID
            setFieldsList(destination.droppableId, destinationList);
            setActiveAccordion(movedItem.id);
        }

        // Case 3: Moving between accordions (remove from one, add to another)
        else if (['description', 'context', 'hideWithEmpty'].includes(source.droppableId) && ['description', 'context', 'hideWithEmpty'].includes(destination.droppableId)) {
            // Remove item from the source accordion
            const sourceList = getFieldsList(source.droppableId);
            const [movedItem] = sourceList.splice(source.index, 1);

            // Add a unique ID if moving to a different accordion
            movedItem.id = generateUniqueId(); // Generate a new unique ID

            // Add item to the destination accordion
            const destinationList = getFieldsList(destination.droppableId);
            destinationList.splice(destination.index, 0, movedItem);

            // Update both accordions
            setFieldsList(source.droppableId, sourceList);
            setFieldsList(destination.droppableId, destinationList);
            setActiveAccordion(movedItem.id);
        }

        // Case 4: Dragging from an accordion to the right panel (remove from accordion, add to draggables)
        else if (['description', 'context', 'hideWithEmpty'].includes(source.droppableId) && destination.droppableId === 'draggables') {
            // Remove the item from the accordion
            const sourceList = getFieldsList(source.droppableId);
            const [removedItem] = sourceList.splice(source.index, 1);  // Remove the item
            setFieldsList(source.droppableId, sourceList);

            // Add the removed item to the right panel (draggables)
            const destinationList = [...draggables];
            destinationList.splice(destination.index, 0, { ...removedItem, id: generateUniqueId() }); // Generate a new unique ID for the right panel
            setDraggables(destinationList); // Update the right panel list
        }
    };

    // Utility function for reordering lists
    const reorder = (list: any[], startIndex: number, endIndex: number) => {
        const result = Array.from(list); // Clone the array
        const [removed] = result.splice(startIndex, 1); // Remove the item from the original position
        result.splice(endIndex, 0, removed); // Insert the item in the new position
        return result;
    };



    // Handle drag start
    const handleOnDragStart = (result: any) => {
        const { source } = result;

        // Dragging from right-side list
        if (source.droppableId === 'draggables') {
            setIsDraggingFromRight(true);
        }

        // Dragging from accordion sections
        if (source.droppableId === 'description' || source.droppableId === 'context' || source.droppableId === 'hideWithEmpty') {
            setIsDraggingFromAccordion(true);
        }
    };

    const getFieldsList = (id: any) => {
        switch (id) {
            case 'draggables': return draggables;
            case 'description': return descriptionFields;
            case 'context': return contextFields;
            case 'hideWithEmpty': return hideWithEmptyFields;
            default: return [];
        }
    };

    const setFieldsList = (id: any, list: any) => {
        switch (id) {
            case 'draggables': setDraggables(list); break;
            case 'description': setDescriptionFields(list); break;
            case 'context': setContextFields(list); break;
            case 'hideWithEmpty': setHideWithEmptyFields(list); break;
            default: break;
        }
    };

    // Styles for active Droppable areas
    const getDroppableStyle = (isDraggingOver: boolean, isDragging: boolean) => ({
        // border: isDragging ? '2px dashed lightblue' : '2px solid transparent',
        border: isDraggingOver ? '2px dashed lightblue' : isDragging ? '2px dashed lightblue' : '2px solid transparent',
        backgroundColor: isDraggingOver ? '#f0f8ff' : isDragging ? '#f0f8ff' : '#faf7f3',
        padding: '5px',
        borderRadius: '5px',
        minHeight: '50px',
        transition: 'background-color 0.3s ease, border 0.3s ease',
    });

    const handleFieldChange = (sectionId: string, fieldId: string, key: string, value: any) => {
        // Get the fields for the relevant section
        const fields = getFieldsList(sectionId);

        // Update the specific field by ID
        const updatedFields = fields.map((field: any) => {
            if (field.id === fieldId) {
                return { ...field, [key]: value };  // Update the relevant field
            }
            return field;
        });

        // Update the state with the modified fields
        setFieldsList(sectionId, updatedFields);
    };

    const handleFieldRemove = (sectionId: string, fieldId: string) => {
        const fields = getFieldsList(sectionId);
        const updatedFields = fields.filter((field: any) => field.id !== fieldId);  // Filter out the removed field

        setFieldsList(sectionId, updatedFields);  // Update the state
    };

    return (
        <>
            <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
                <div className='content-box' style={{
                    width: isDrawerOpen ? 'calc(100% - 350px)' : '100%',
                    height: '100vh',
                    paddingTop: 70,
                    overflowY: 'auto',
                    transition: 'all 0.2s ease-in',
                    transitionDelay: isDrawerOpen ? '0.3s' : '0s',
                    position: 'relative'
                }}
                >
                    <Container className='container-lg relative'>
                        <div className='mt-3'>
                            <Breadcrumb>
                                <BreadcrumbItem>
                                    <a href="#">
                                        Project
                                    </a>
                                </BreadcrumbItem>
                                <BreadcrumbItem>
                                    <a href="#">
                                        Project settings
                                    </a>
                                </BreadcrumbItem>
                                <BreadcrumbItem active>
                                    Issue types
                                </BreadcrumbItem>
                            </Breadcrumb>


                            <div className='mb-4'>
                                <div className='d-flex align-items-center gap-2 mb-2'>
                                    <div className='card avatar-xs mb-0'></div>
                                    <h1 className='text-primary mb-0'>Task</h1>
                                </div>
                                <p className='text-muted mb-0'>Tasks track small, distinct pieces of work.</p>
                            </div>
                        </div>

                        <div className='description-fields-box'>
                            <div className='d-flex align-items-center gap-1 mb-2'>
                                <h5 className='mb-0'>Description fields</h5>
                                <Infotip title='this is tooltip'>
                                    <Button id="TooltipExample" color='dark' className="btn-icon btn-ghost-dark rounded-circle" size='sm'>
                                        <FeatherIcon icon="info" size={15} />
                                    </Button>
                                </Infotip>
                            </div>
                            <Droppable droppableId="description">
                                {(provided: any, snapshot: any) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} style={getDroppableStyle(snapshot.isDraggingOver, isDraggingFromRight)}>
                                        <Accordion
                                            className="custom-accordionwithicon accordion-border-box"
                                            id="accordionlefticon"
                                            open={activeAccordion}
                                            toggle={toggleAccordion}
                                        >
                                            {
                                                descriptionFields.map((field: any, index: number) => {
                                                    const accordionId = field.id;
                                                    return (
                                                        <Draggable key={field.id} draggableId={field.id} index={index}>
                                                            {(provided: any) => (
                                                                <AccordionItem1
                                                                    key={field.id}
                                                                    field={field}
                                                                    accordionId={accordionId}
                                                                    activeAccordion={activeAccordion}
                                                                    toggleAccordion={toggleAccordion}
                                                                    innerRef={provided.innerRef}
                                                                    // {...provided.draggableProps} 
                                                                    {...(isDraggable ? { ...provided.draggableProps } : {})}
                                                                    {...provided.dragHandleProps}
                                                                    // {...(isDraggable ? { innerRef: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps } : {})}
                                                                    onChange={(id, key, value) => handleFieldChange('description', id, key, value)}
                                                                    onRemove={(id) => handleFieldRemove('description', id)}
                                                                />
                                                            )}
                                                        </Draggable>
                                                    )
                                                })}

                                        </Accordion>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        <div className='context-fields-box mt-4'>
                            <div className='d-flex align-items-center gap-1 mb-2'>
                                <h5 className='mb-0'>Context fields</h5>
                                <Infotip title='this is tooltip2'>
                                    <Button color='dark' className="btn-icon btn-ghost-dark rounded-circle" size='sm'>
                                        <FeatherIcon icon="info" size={15} />
                                    </Button>
                                </Infotip>
                            </div>
                            <Droppable droppableId="context">
                                {(provided: any, snapshot: any) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} style={getDroppableStyle(snapshot.isDraggingOver, isDraggingFromRight)}>
                                        {
                                            contextFields.length !== 0 ? (
                                                <Accordion className="custom-accordionwithicon accordion-border-box" id="accordionlefticon" open={activeAccordion} toggle={toggleAccordion}>
                                                    {
                                                        contextFields.map((field: any, index: number) => {
                                                            const accordionId = field.id;
                                                            return (
                                                                <Draggable key={field.id} draggableId={field.id} index={index}>
                                                                    {(provided: any) => (
                                                                        <AccordionItem1
                                                                            key={field.id}
                                                                            field={field}
                                                                            accordionId={accordionId}
                                                                            activeAccordion={activeAccordion}
                                                                            toggleAccordion={toggleAccordion}
                                                                            innerRef={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            onChange={(id, key, value) => handleFieldChange('context', id, key, value)}
                                                                            onRemove={(id) => handleFieldRemove('context', id)}
                                                                        />
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        })}

                                                </Accordion>
                                            ) : (
                                                <div className='d-flex justify-content-center align-items-center p-3 rounded bg-light' style={{ height: '100px' }}>
                                                    <p className='text-muted mb-0'>Drag and drop fields here</p>
                                                </div>
                                            )
                                        }

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                        </div>

                        {/* Hide with Empty */}
                        <div className='hide-with-empty'>
                            <div className='dotteted-divider'>
                                <span className='text-muted'>Hide with empty</span>
                            </div>

                            <div className='context-fields-box '>
                                <Droppable droppableId="hideWithEmpty">
                                    {(provided: any, snapshot: any) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} style={getDroppableStyle(snapshot.isDraggingOver, isDraggingFromRight)}>
                                            <Accordion className="custom-accordionwithicon accordion-border-box" id="accordionlefticon" open={activeAccordion} toggle={toggleAccordion}>
                                                {
                                                    hideWithEmptyFields.map((field: any, index: number) => {
                                                        const accordionId = field.id;
                                                        return (
                                                            <Draggable key={field.id} draggableId={field.id} index={index}>
                                                                {(provided: any) => (
                                                                    <AccordionItem1
                                                                        key={field.id}
                                                                        field={field}
                                                                        accordionId={accordionId}
                                                                        activeAccordion={activeAccordion}
                                                                        toggleAccordion={toggleAccordion}
                                                                        innerRef={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        onChange={(id, key, value) => handleFieldChange('hideWithEmpty', id, key, value)}
                                                                        onRemove={(id) => handleFieldRemove('hideWithEmpty', id)}
                                                                    />
                                                                )}
                                                            </Draggable>
                                                        )
                                                    })}

                                            </Accordion>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className='d-flex align-items-center justify-content-between position-sticky bottom-0 bg-white p-3 rounded-3 shadow' style={{ position: 'fixed', bottom: 0, zIndex: 50 }}>
                            <Button onClick={handleToggleDrawer}>Click me</Button>
                            <div className='d-flex align-items-center gap-2'>
                                <Button color="link" className="bg-gradient"> Discard </Button>
                                <Button color="light" className="bg-gradient"> Save Changes </Button>
                            </div>
                        </div>

                    </Container>

                </div>

                {/* Message if drop occurs in invalid area */}

                <div className='offcanvas-box'>
                    <Offcanvas isOpen={isDrawerOpen} backdrop={false} innerRef={offcanvasRef} toggle={toggle} direction='end' id="rightSideFields" zIndex={2}
                        style={{ width: 350, paddingTop: 70, overflowY: 'auto', backgroundColor: '#f7f8f9' }}
                    >
                        <Droppable droppableId="draggables">
                            {(provided: any, snapshot: any) => (
                                <div
                                    className='offcanvas-body'
                                    ref={provided.innerRef} {...provided.droppableProps}
                                    style={getDroppableStyle(snapshot.isDraggingOver, isDraggingFromAccordion)}
                                >
                                    {
                                        isDraggingFromAccordion ? (
                                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                                <h4>Drop Here</h4>
                                                <p className='text-muted mb-0'>Remove</p>
                                            </div>
                                        ) : (
                                            <div className='content-box'>
                                                <div>
                                                    <div className='d-flex align-items-center gap-1 mb-2'>
                                                        <h5 className='mb-0'>Field</h5>
                                                        <Button color='dark' className="btn-icon btn-ghost-dark rounded-circle" size='sm'>
                                                            <FeatherIcon icon="info" size={15} />
                                                        </Button>
                                                    </div>

                                                    <div>
                                                        <p className='mb-0'>Create a field</p>
                                                        <p className='text-muted mb-0 fs-12'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, consectetur?</p>
                                                    </div>
                                                    <div className='d-flex flex-wrap gap-2 mt-2'>
                                                        {
                                                            draggables.map((item, index) => (
                                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                    {(provided: any) => (
                                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='card avatar-lg rounded-3 mb-0 border d-flex align-items-center justify-content-center'>
                                                                            <i className={`${item.icon} fs-4`}></i>
                                                                            <p className='m-0 text-center fs-12'>{item.label}</p>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))
                                                        }
                                                    </div>
                                                </div>

                                                {/* Search Box */}
                                                <div className='mt-3'>
                                                    {/* <Form> */}
                                                    <FormGroup>
                                                        <Label htmlFor="iconrightInput" className="form-label fs-12 mb-0 text-muted">Search all fields</Label>
                                                        <div className="form-icon right">
                                                            <Input
                                                                id="exampleEmail"
                                                                name="search"
                                                                placeholder="Type to search all fields"
                                                                type="search"
                                                            />
                                                            <i className="ri-search-line"></i>
                                                        </div>
                                                    </FormGroup>
                                                    {/* </Form> */}
                                                </div>

                                                <div className='mt-3'>
                                                    <p className='mb-0 text-muted fs-12'>Other fields</p>
                                                    <div className='d-flex flex-column flex-wrap gap-1 mt-2'>
                                                        {
                                                            draggableItems.map((item, index) => (
                                                                <Draggable key={item.id} draggableId={item.id + 400} index={index}>
                                                                    {(provided: any) => (
                                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index} className='p-2 rounded-3 mb-0 border d-flex gap-2 align-items-center bg-white shadow'>
                                                                            <span>< i className={item.icon}></i></span>
                                                                            <p className='m-0'>Sort text</p>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                    </Offcanvas>
                </div>
            </DragDropContext>
        </>
    )
}

export default Task