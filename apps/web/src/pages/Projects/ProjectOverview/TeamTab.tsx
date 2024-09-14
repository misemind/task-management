import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown, ModalBody, ModalHeader } from 'reactstrap';

import { useDispatch, useSelector } from 'react-redux';
import { addProjectEmployee, deleteProjectEmployee, getAllProjectEmployeesByProject } from './../../../slices/projects/thunk';
import { getTeamData } from 'slices/team/thunk';
import { selectEmployeeCount, selectEmployeeError, selectEmployeeList } from 'slices/projects/selectors';
import AddTeamMemberModal from 'Components/Common/Modal/AddTeamMemberModal';

const TeamTab = () => {
    const { projectId }: any = useParams();
    const dispatch: any = useDispatch();

    const [modal, setModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [memberModal, setMemberModal] = useState(false);
    const [noSearchResults, setNoSearchResults] = useState<boolean>(false);

    const employeeList = useSelector(selectEmployeeList);
    const employeeCount = useSelector(selectEmployeeCount);
    const employeeError = useSelector(selectEmployeeError);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = parseInt(process.env.REACT_APP_ITEMS_PER_PAGE!, 10)

    useEffect(() => {
        // Only dispatch when currentPage and itemsPerPage are valid
        if (currentPage > 0 && itemsPerPage > 0) {
            // dispatch(getTeamData({ page: currentPage, limit: itemsPerPage }));
            dispatch(getAllProjectEmployeesByProject({ projectId, page: currentPage, limit: itemsPerPage }));
        }
    }, [dispatch, currentPage, itemsPerPage, projectId]);

    useEffect(() => {
        const filteredEmployees = employeeList.filter((employee: any) =>
            employee?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase())
        );

        // Check if there are no search results
        setNoSearchResults(filteredEmployees.length === 0 && searchTerm.trim() !== '');

        // Reset search results if searchTerm is empty
        if (searchTerm.trim() === '') {
            setNoSearchResults(false);
        }
    }, [searchTerm, employeeList]);

    const filteredEmployees = employeeList.filter((employee: any) =>
        employee?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (employeeId: string) => {
        await dispatch(deleteProjectEmployee({ projectId, employeeId }));
        // Check if the current page is now empty
        const remainingItems = employeeList.length - 1; // because we deleted one item
        const totalPages = Math.ceil((employeeCount - 1) / itemsPerPage);

        // If the current page is empty and we're not on the first page, decrease the page number
        if (remainingItems === 0 && currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        } else {
            // Re-fetch the data for the current page
            dispatch(getAllProjectEmployeesByProject({ projectId, page: currentPage, limit: itemsPerPage }));
        }
    };

    return (
        <React.Fragment>
            <Row className="g-4 mb-3">
                <div className="col-sm">
                    <div className="d-flex">
                        <div className="search-box me-2">
                            <input type="text" className="form-control" placeholder="Search member..." onChange={(e) => setSearchTerm(e.target.value)} />
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                </div>
                <div className="col-sm-auto">
                    <div>
                        <button type="button" className="btn btn-danger" onClick={() => setMemberModal(true)}><i className="ri-share-line me-1 align-bottom"></i> Invite Member</button>
                    </div>
                </div>
            </Row>

            {
                employeeList.length === 0 && !noSearchResults ? (
                    <Col lg={12} className='p-3'>
                        <h4 className="text-center text-muted">Teams data not found.</h4>
                    </Col>
                ) : noSearchResults ? (
                    <Col lg={12} className='p-3'>
                        <h4 className="text-center text-muted">Searching result is not matched.</h4>
                    </Col>
                ) : (
                    <div>
                        <div className="team-list list-view-filter">
                            {filteredEmployees.map((employee: any, index: number) => (
                                <Card className="team-box" key={index}>
                                    <CardBody className="px-4">
                                        <Row className="align-items-center team-row">
                                            <div className="col team-settings">
                                                <Row className="align-items-center">
                                                    <div className="col">
                                                        <div className="flex-shrink-0 me-2">
                                                            <button type="button" className="btn fs-16 p-0 favourite-btn">
                                                                <i className="ri-star-fill"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <UncontrolledDropdown className="col text-end">
                                                        <DropdownToggle tag="a" role="button">
                                                            <i className="ri-more-fill fs-17"></i>
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-end">
                                                            <li>
                                                                <DropdownItem tag={Link} to={`/pages-profile/${employee._id}`}>
                                                                    <i className="ri-eye-fill text-muted me-2 align-bottom"></i>View
                                                                </DropdownItem>
                                                            </li>
                                                            <li><DropdownItem><i className="ri-star-fill text-muted me-2 align-bottom"></i>Favourite</DropdownItem></li>
                                                            <li><DropdownItem onClick={() => handleDelete(employee._id)}><i className="ri-delete-bin-5-fill text-muted me-2 align-bottom"></i>Delete</DropdownItem></li>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </Row>
                                            </div>
                                            <Col lg={4}>
                                                <div className="team-profile-img">
                                                    <div className="avatar-lg img-thumbnail rounded-circle">
                                                        <img src={`${process.env.REACT_APP_STORAGEBUCKET}/${employee.profileImagePath}`} alt="" className="img-fluid d-block rounded-circle" />
                                                    </div>
                                                    <div className="team-content">
                                                        <Link to="#" className="d-block"><h5 className="fs-16 mb-1">{employee.firstName}</h5></Link>
                                                        <p className="text-muted mb-0">{employee.designation}</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={4}>
                                                <Row className="text-muted text-center">
                                                    <Col xs={6} className="border-end border-end-dashed">
                                                        <h5 className="mb-1">{employee.projectNumber}</h5>
                                                        <p className="text-muted mb-0">Projects</p>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <h5 className="mb-1">{employee.taskNumber}</h5>
                                                        <p className="text-muted mb-0">Tasks</p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col lg={2} className="col">
                                                <div className="text-end">
                                                    <Link to={`/pages-profile/${employee._id}`} className="btn btn-light view-btn">View Profile</Link>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>

                        {
                            employeeCount > itemsPerPage && (
                                <Row className="g-0 text-center text-sm-start align-items-center mb-4">
                                    <Col sm={6}>
                                        <div>
                                            <p className="mb-sm-0 text-muted">
                                                Showing <span className="fw-semibold">
                                                    {(employeeCount > 0 && itemsPerPage > 0) ? (currentPage - 1) * itemsPerPage + 1 : 0}
                                                </span>
                                                to <span className="fw-semibold">
                                                    {Math.min(currentPage * itemsPerPage, employeeCount)}
                                                </span>
                                                of <span className="fw-semibold text-decoration-underline">
                                                    {employeeCount}
                                                </span> entries
                                            </p>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <Link to="#" className="page-link" onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}>
                                                    Previous
                                                </Link>
                                            </li>
                                            {Array.from({ length: Math.ceil(employeeCount / itemsPerPage) }, (_, pageNum) => (
                                                <li key={pageNum + 1} className={`page-item ${currentPage === pageNum + 1 ? 'active' : ''}`}>
                                                    <Link to="#" className="page-link" onClick={() => setCurrentPage(pageNum + 1)}>
                                                        {pageNum + 1}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === Math.ceil(employeeCount / itemsPerPage) ? 'disabled' : ''}`}>
                                                <Link to="#" className="page-link" onClick={() => currentPage < Math.ceil(employeeCount / itemsPerPage) && setCurrentPage(prev => prev + 1)}>
                                                    Next
                                                </Link>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                            )
                        }

                    </div>
                )
            }

            <AddTeamMemberModal
                isOpen={memberModal}
                projectId={projectId}
                handleClose={() => setMemberModal(false)}
                onSuccess={() => dispatch(getAllProjectEmployeesByProject({ projectId, page: 1, limit: 10 }))}
            />

        </React.Fragment>
    );
};

export default TeamTab;