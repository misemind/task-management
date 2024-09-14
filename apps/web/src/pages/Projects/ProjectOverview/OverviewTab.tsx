import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';

//SimpleBar
import SimpleBar from "simplebar-react";
import ProjectDocuments from './ProjectDocuments';
import DashboardTeam from './DashboardTeam';
import CommentsSection from './CommentsSection';
import { useDispatch } from 'react-redux';
import { addProjectDocument, downloadProjectDocument, deleteProjectDocument } from 'slices/projects/thunk';
import { getProjectById } from 'slices/projectOverview/thunk';
import FileIconComponent from 'Components/Common/FileIconComponent';

const OverviewTab = ({ project, employees, data, activeTab, setActiveTab }: any) => {
    const { projectId }: any = useParams();
    const dispatch: any = useDispatch();

    console.log(data?.documents?.documents?.slice(0, 3), 'data');

    const handleDownload = async (document: any) => {
        if (projectId) {
            dispatch(downloadProjectDocument({ projectId, documentId: document._id, name: document.name, type: document.type }));
        }
    };

    const handleDelete = async (documentId: any) => {
        if (projectId) {
            await dispatch(deleteProjectDocument({ projectId, documentId })).then(() => {
                dispatch(getProjectById(projectId));
            });
        }
    };
    return (
        <React.Fragment>
            <Row>
                <Col xl={9} lg={8}>
                    <Card>
                        <CardBody>
                            <div className="text-muted">
                                <h6 className="mb-3 fw-semibold text-uppercase">Summary</h6>
                                <div dangerouslySetInnerHTML={{ __html: data?.description || "" }} />

                                <div className="pt-3 border-top border-top-dashed mt-4">
                                    <Row className="gy-3">
                                        <Col lg={3} sm={6}>
                                            <div>
                                                <p className="mb-2 text-uppercase fw-medium">Create Date :</p>
                                                <h5 className="fs-15 mb-0">{new Date(data?.createDate).toLocaleDateString() || "N/A"}</h5>
                                            </div>
                                        </Col>
                                        <Col lg={3} sm={6}>
                                            <div>
                                                <p className="mb-2 text-uppercase fw-medium">Due Date :</p>
                                                <h5 className="fs-15 mb-0">{new Date(data?.endDate).toLocaleDateString() || "N/A"}</h5>
                                            </div>
                                        </Col>
                                        <Col lg={3} sm={6}>
                                            <div>
                                                <p className="mb-2 text-uppercase fw-medium">Priority :</p>
                                                <div className={`badge ${data?.priority === "high" ? "bg-danger" : data?.priority === "medium" ? "bg-warning" : "bg-success"} fs-12 text-capitalize`}>
                                                    {data?.priority || "N/A"}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={3} sm={6}>
                                            <div>
                                                <p className="mb-2 text-uppercase fw-medium">Status :</p>
                                                <div className={`badge ${data?.status === "completed" ? "bg-success" : data?.status === "inprogress" ? "bg-warning" : "bg-secondary"} fs-12 text-capitalize`}>
                                                    {data?.status || "N/A"}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="pt-3 border-top border-top-dashed mt-4">
                                    <h6 className="mb-3 fw-semibold text-uppercase">Resources</h6>

                                    <Row className="g-3">
                                        {
                                            (data?.documents?.documents?.slice(0, 3) || [])?.map((item: any, index: number) => (
                                                <Col key={index} xxl={4} lg={6}>
                                                    <div className="border rounded border-dashed p-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-3">
                                                                <div className="avatar-sm">
                                                                    <div className="avatar-title bg-light text-secondary rounded fs-24">
                                                                        <FileIconComponent fileName={item?.name} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex-grow-1 overflow-hidden">
                                                                <h5 className="fs-13 mb-1">
                                                                    <Link to="#" className="text-body text-truncate d-block">{item?.name}</Link>
                                                                </h5>
                                                                <div>{item.size} KB</div>
                                                            </div>
                                                            <div className="flex-shrink-0 ms-2">
                                                                <div className="d-flex gap-1">
                                                                    <button type="button" className="btn btn-icon text-muted btn-sm fs-18" onClick={() => handleDownload(item)}>
                                                                        <i className="ri-download-2-line"></i>
                                                                    </button>
                                                                    <UncontrolledDropdown>
                                                                        <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown">
                                                                            <i className="ri-more-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename</DropdownItem>
                                                                            <DropdownItem onClick={() => handleDelete(item._id)}><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            ))
                                        }


                                        {/* <Col xxl={4} lg={6}>
                                            <div className="border rounded border-dashed p-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <div className="avatar-sm">
                                                            <div className="avatar-title bg-light text-secondary rounded fs-24">
                                                                <i className="ri-file-ppt-2-line"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="fs-13 mb-1">
                                                            <Link to="#" className="text-body text-truncate d-block">Velzon admin.ppt</Link>
                                                        </h5>
                                                        <div>2.4MB</div>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-2">
                                                        <div className="d-flex gap-1">
                                                            <button type="button" className="btn btn-icon text-muted btn-sm fs-18">
                                                                <i className="ri-download-2-line"></i>
                                                            </button>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown">
                                                                    <i className="ri-more-fill"></i>
                                                                </DropdownToggle>
                                                                <DropdownMenu>
                                                                    <DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename</DropdownItem>
                                                                    <DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col> */}
                                    </Row>
                                </div>
                            </div>
                        </CardBody>


                    </Card>
                    {/* <Card>
                        <CardHeader className="align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">Comments</h4>
                            <div className="flex-shrink-0">
                                <UncontrolledDropdown className="card-header-dropdown">
                                    <DropdownToggle tag="a" className="text-reset dropdown-btn" href="#">
                                        <span className="text-muted">Recent<i className="mdi mdi-chevron-down ms-1"></i></span>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end" end>
                                        <DropdownItem>Recent</DropdownItem>
                                        <DropdownItem>Top Rated</DropdownItem>
                                        <DropdownItem>Previous</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        </CardHeader>

                        <CardBody>

                            <SimpleBar style={{ height: "300px" }} className="px-3 mx-n3 mb-2">
                                <div className="d-flex mb-4">
                                    <div className="flex-shrink-0">
                                        <img src={avatar8} alt="" className="avatar-xs rounded-circle" />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h5 className="fs-13">Joseph Parker <small className="text-muted ms-2">20 Dec 2021 - 05:47AM</small></h5>
                                        <p className="text-muted">I am getting message from customers that when they place order always get error message .</p>
                                        <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                        <div className="d-flex mt-4">
                                            <div className="flex-shrink-0">
                                                <img src={avatar10} alt="" className="avatar-xs rounded-circle" />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h5 className="fs-13">Alexis Clarke <small className="text-muted ms-2">22 Dec 2021 - 02:32PM</small></h5>
                                                <p className="text-muted">Please be sure to check your Spam mailbox to see if your email filters have identified the email from Dell as spam.</p>
                                                <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex mb-4">
                                    <div className="flex-shrink-0">
                                        <img src={avatar6} alt="" className="avatar-xs rounded-circle" />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h5 className="fs-13">Donald Palmer <small className="text-muted ms-2">24 Dec 2021 - 05:20PM</small></h5>
                                        <p className="text-muted">If you have further questions, please contact Customer Support from the “Action Menu” on your <Link to="#" className="text-decoration-underline">Online Order Support</Link>.</p>
                                        <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="flex-shrink-0">
                                        <img src={avatar10} alt="" className="avatar-xs rounded-circle" />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h5 className="fs-13">Alexis Clarke <small className="text-muted ms-2">26 min ago</small></h5>
                                        <p className="text-muted">Your <Link to="#" className="text-decoration-underline">Online Order Support</Link> provides you with the most current status of your order. To help manage your order refer to the “Action Menu” to initiate return, contact Customer Support and more.</p>
                                        <Row className="g-2 mb-3">
                                            <div className="col-lg-1 col-sm-2 col-6">
                                                <img src={image4} alt="" className="img-fluid rounded" />
                                            </div>
                                            <div className="col-lg-1 col-sm-2 col-6">
                                                <img src={image5} alt="" className="img-fluid rounded" />
                                            </div>
                                        </Row>
                                        <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                        <div className="d-flex mt-4">
                                            <div className="flex-shrink-0">
                                                <img src={avatar6} alt="" className="avatar-xs rounded-circle" />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h5 className="fs-13">Donald Palmer <small className="text-muted ms-2">8 sec ago</small></h5>
                                                <p className="text-muted">Other shipping methods are available at checkout if you want your purchase delivered faster.</p>
                                                <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SimpleBar>
                            <form className="mt-4">
                                <Row className="g-3">
                                    <Col xs={12} >
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label text-body">Leave a Comments</label>
                                        <textarea className="form-control bg-light border-light" id="exampleFormControlTextarea1" rows={3} placeholder="Enter your comment..."></textarea>
                                    </Col>
                                    <Col xs={12} className="text-end">
                                        <button type="button" className="btn btn-ghost-secondary btn-icon waves-effect me-1"><i className="ri-attachment-line fs-16"></i></button>
                                        <Link to="#" className="btn btn-primary">Post Comments</Link>
                                    </Col>
                                </Row>
                            </form>
                        </CardBody>

                    </Card> */}
                    <CommentsSection />
                </Col>

                <Col xl={3} lg={4}>
                    <Card>
                        <CardBody>
                            <h5 className="card-title mb-4">Skills</h5>
                            {
                                data?.skills.length > 0 ? (
                                    <div className="d-flex flex-wrap gap-2 fs-16">
                                        {data?.skills.map((skill: any, index: any) => (
                                            <div key={index} className="badge fw-medium bg-secondary-subtle text-secondary">{skill}</div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <p className='text-muted text-center'>No skills added</p>
                                    </div>
                                )
                            }
                        </CardBody>

                    </Card>


                    <DashboardTeam project={project} employees={employees} setActiveTab={setActiveTab} />
                    <ProjectDocuments activeTab={activeTab} data={data} setActiveTab={setActiveTab} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default OverviewTab;