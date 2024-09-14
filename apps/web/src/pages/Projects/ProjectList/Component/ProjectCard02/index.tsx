import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Row, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import FeatherIcon from "feather-icons-react";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";

const ProjectCard02 = ({ item }: any) => {

    const activebtn = (ele: any) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };

    const onClickData = (project: any) => {
        // setProject(project);
        // setDeleteModal(true);
    };
    return (
        <Col xxl={3} sm={6} className="project-card">
            <Card>
                <CardBody>
                    <div className={`p-3 mt-n3 mx-n3 bg-${'danger'}-subtle rounded-top`}>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <h5 className="mb-0 fs-14"><Link to="/apps-projects-overview" className="text-body">{item.name}</Link></h5>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="d-flex gap-1 align-items-center my-n2">
                                    <button type="button" className={`btn avatar-xs mt-n1 p-0 favourite-btn ${'active'}`} onClick={(e) => activebtn(e.target)}>
                                        <span className="avatar-title bg-transparent fs-15">
                                            <i className="ri-star-fill"></i>
                                        </span>
                                    </button>
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="button" className="btn btn-link text-muted p-1 mt-n2 py-0 text-decoration-none fs-15">
                                            <FeatherIcon icon="more-horizontal" className="icon-sm" />
                                        </DropdownToggle>

                                        <DropdownMenu className="dropdown-menu-end" end>
                                            <DropdownItem href="apps-projects-overview"><i className="ri-eye-fill align-bottom me-2 text-muted"></i> View</DropdownItem>
                                            <DropdownItem href="apps-projects-create"><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit</DropdownItem>
                                            <div className="dropdown-divider"></div>
                                            <DropdownItem href="#" onClick={() => onClickData(item)} data-bs-toggle="modal" data-bs-target="#removeProjectModal"><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Remove</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-3">
                        <Row className="gy-3">
                            <Col xs={6}>
                                <div>
                                    <p className="text-muted mb-1">Status</p>
                                    <div className={"fs-12 badge bg-" + item.statusClass + "subtle text-" + item.statusClass}>{item.status}</div>
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div>
                                    <p className="text-muted mb-1">Deadline</p>
                                    <h5 className="fs-14">{item?.endDate?.slice(0, 10)}</h5>
                                </div>
                            </Col>
                        </Row>

                        <div className="d-flex align-items-center mt-3">
                            <p className="text-muted mb-0 me-2">Team :</p>
                            <div className="avatar-group">
                                {item?.employees?.slice(0, 5).map((emp: any, key: any) => (
                                    <React.Fragment key={key}>
                                        <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title={`${emp.firstName} ${emp.lastName}`}>
                                            <div className="avatar-xxs">
                                                <img src={`${process.env.REACT_APP_STORAGEBUCKET}/${emp.profileImagePath}` || avatar3} alt={`${emp.firstName} ${emp.lastName}`} className="rounded-circle img-fluid" />
                                            </div>
                                        </Link>
                                    </React.Fragment>
                                ))}
                                <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Add Members">
                                    <div className="avatar-xxs">
                                        <div className="avatar-title rounded-circle bg-light border-dashed border text-primary fs-16">
                                            +
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="d-flex mb-2">
                            <div className="flex-grow-1">
                                <div>Progress</div>
                            </div>
                            <div className="flex-shrink-0">
                                <div>{'50%'}</div>
                            </div>
                        </div>
                        <div className="progress progress-sm animated-progess">
                            <div className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: '50%' }}>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Col>
    )
}

export default ProjectCard02