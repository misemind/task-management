import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import FeatherIcon from "feather-icons-react";
import Avatar from 'Components/Common/Avatar';
import moment from 'moment';



const ProjectCard01 = ({ item, setDeleleModalState, setMemberModalState }: any) => {
    const navigate = useNavigate();

    const handleView = (id: string) => {
        navigate(`/apps-projects-overview/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/apps-projects-create/${id}`);
    };

    const handleDelete = (id: string) => {
        setDeleleModalState({
            isOpen: true,
            projectId: id
        })
        console.log(`Deleting project with ID: ${id}`);
    };

    function sanitizeHtml(htmlString: string) {
        // Use a regular expression to remove all HTML tags
        return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
    }

    const activebtn = (ele: any) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };

    return (
        <Col xxl={3} sm={6} className="project-card">
            <Card className="card-height-100">
                <CardBody>
                    <div className="d-flex flex-column h-100">
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <p className="text-muted mb-4">Last Updated: {moment(item.updated).fromNow(true)}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="d-flex gap-1 align-items-center">
                                    <button type="button" className={`btn avatar-xs mt-n1 p-0 favourite-btn ${item.ratingClass}`} onClick={(e) => activebtn(e.target)}>
                                        <span className="avatar-title bg-transparent fs-15">
                                            <i className="ri-star-fill"></i>
                                        </span>
                                    </button>
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            tag="button"
                                            className="btn btn-link text-muted p-1 mt-n2 py-0 text-decoration-none fs-15"
                                        >
                                            <FeatherIcon icon="more-horizontal" className="icon-sm" />
                                        </DropdownToggle>

                                        <DropdownMenu className="dropdown-menu-end" end>
                                            <DropdownItem onClick={() => handleView(item._id)}>
                                                <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
                                            </DropdownItem>
                                            <DropdownItem onClick={() => handleEdit(item._id)}>
                                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit
                                            </DropdownItem>
                                            <div className="dropdown-divider"></div>
                                            <DropdownItem onClick={() => handleDelete(item._id)} data-bs-toggle="modal" data-bs-target="#removeProjectModal">
                                                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Remove
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-2">
                            <div className="flex-shrink-0 me-3">
                                {/* <div className="avatar-sm">
                                    <span className={"avatar-title rounded p-2 bg-" + item.imgbgColor + "-subtle"}>
                                        <img src={`${process.env.REACT_APP_STORAGEBUCKET}/${item?.thumbnailImage}`} alt="" className="img-fluid p-1" />
                                    </span>
                                </div> */}
                                <Avatar
                                    title={item.title.substring(0, 1)}
                                    src={`${process.env.REACT_APP_STORAGEBUCKET}/${item.thumbnailImage}`}
                                    size={50}
                                    backgroundColor='#96C9F4'
                                    color='#503BFF'
                                    shape='semi-round'
                                />
                            </div>
                            <div className="flex-grow-1">
                                <h5 className="mb-1 fs-15"><Link to={`/apps-projects-overview/${item._id}`} className="text-body">{item.title}</Link></h5>
                                <p className="text-muted text-truncate-two-lines mb-3">{item.description && sanitizeHtml(item.description)}</p>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <div className="d-flex mb-2">
                                <div className="flex-grow-1">
                                    <div>Tasks</div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div><i className="ri-list-check align-bottom me-1 text-muted"></i> 22/56</div>
                                </div>
                            </div>
                            <div className="progress progress-sm animated-progess">
                                <div className="progress-bar bg-success"
                                    role="progressbar"
                                    style={{ width: '40%' }}>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <div className="card-footer bg-transparent border-top-dashed py-2">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                            <div className="avatar-group">
                                {item?.employees?.slice(0, 5).map((emp: any, key: any) => (
                                    <React.Fragment key={key}>
                                        <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title={`${emp.firstName} ${emp.lastName}`}>
                                            {/* <div className="avatar-xxs">
                                                                    <img src={`${process.env.REACT_APP_STORAGEBUCKET}/${emp.profileImagePath}` || avatar3} className="rounded-circle img-fluid" />
                                                                </div> */}
                                            <Avatar
                                                title={emp?.firstName?.charAt(0)}
                                                src={`${process.env.REACT_APP_STORAGEBUCKET}/${emp.profileImagePath}`}
                                                size={25}
                                                backgroundColor='#96C9F4'
                                                color='#503BFF'
                                            />
                                        </Link>
                                    </React.Fragment>
                                ))}
                                <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Add Members">
                                    <div className="avatar-xxs">
                                        <div className="avatar-title rounded-circle bg-light border-dashed border text-primary fs-16" onClick={() => {
                                            setMemberModalState({
                                                isOpen: true,
                                                projectId: item._id
                                            })
                                        }}>
                                            +
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="text-muted">
                                <i className="ri-calendar-event-fill me-1 align-bottom"></i>
                                {moment(item.endDate).format('DD MMM, YYYY')}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Col>
    )
}

export default ProjectCard01 