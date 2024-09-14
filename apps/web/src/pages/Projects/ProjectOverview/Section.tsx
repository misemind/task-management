import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

//import images
import slack from '../../../assets/images/brands/slack.png';
import OverviewTab from './OverviewTab';
import DocumentsTab from './DocumentsTab';
import ActivitiesTab from './ActivitiesTab';
import TeamTab from './TeamTab';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectById } from 'slices/projectOverview/thunk';
import { getAllProjectEmployeesByProject, getTeamData } from 'slices/thunks';
import Avatar from 'Components/Common/Avatar';
import { selectEmployeeCount, selectEmployeeError, selectEmployeeList } from 'slices/projects/selectors';
import { selectTeamList } from 'slices/team/selectors';
import { ToastContainer } from 'react-toastify';




const Section = () => {
    const [activeTab, setActiveTab] = useState('1');
    const { projectId }: any = useParams();
    const dispatch: any = useDispatch();
    const { data, loading, error } = useSelector((state: any) => state.ProjectOverview);
    const project = useSelector((state: any) => state.Projects || [])
    // const employees = useSelector((state: any) => state.Team.teamData || []);
    const projectEmployees = useSelector((state: any
    ) => state.Projects.employees);

    const employeeList = useSelector(selectEmployeeList);
    const employeeCount = useSelector(selectEmployeeCount);
    const employeeError = useSelector(selectEmployeeError);

    const teamList = useSelector(selectTeamList);

    useEffect(() => {
        dispatch(getProjectById(projectId));
        // dispatch(listProjectDocuments(projectId));
        dispatch(getAllProjectEmployeesByProject({ projectId, page: 1, limit: 10 }));
        // dispatch(getTeamData({page:1,limit:10000}));
    }, [dispatch, projectId]);

    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            <Row>
                <Col lg={12}>
                    <Card className="mt-n4 mx-n4">
                        <div className="bg-primary-subtle">
                            <CardBody className="pb-0 px-4">
                                <Row className="mb-3">
                                    <div className="col-md">
                                        <Row className="align-items-center g-3">
                                            <div className="col-md-auto">
                                                {/* <div className="avatar-md">
                                                    <div className="avatar-title bg-white rounded-circle">
                                                        <img src={slack} alt="" className="avatar-xs" />
                                                    </div>
                                                </div> */}
                                                <Avatar
                                                    title={data?.title?.substring(0, 1)}
                                                    src={`${process.env.REACT_APP_STORAGEBUCKET}/${data?.thumbnailImage}`}
                                                    size={75}
                                                    backgroundColor='#96C9F4'
                                                    color='#503BFF'
                                                />
                                            </div>
                                            <div className="col-md">
                                                <div>
                                                    <h4 className="fw-bold">{data?.title}</h4>
                                                    <div className="hstack gap-3 flex-wrap">
                                                        <div><i className="ri-building-line align-bottom me-1"></i> Themesbrand</div>
                                                        <div className="vr"></div>
                                                        <div>Create Date : <span className="fw-medium">{new Date(data?.createDate).toLocaleDateString() || "N/A"}</span></div>
                                                        <div className="vr"></div>
                                                        <div>Due Date : <span className="fw-medium">{new Date(data?.endDate).toLocaleDateString() || "N/A"}</span></div>
                                                        <div className="vr"></div>
                                                        <div className="badge rounded-pill bg-info fs-12">New</div>
                                                        <div className="badge rounded-pill bg-danger fs-12">High</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>
                                    </div>
                                    <div className="col-md-auto">
                                        <div className="hstack gap-1 flex-wrap">
                                            <button type="button" className="btn py-0 fs-16 favourite-btn active">
                                                <i className="ri-star-fill"></i>
                                            </button>
                                            <button type="button" className="btn py-0 fs-16 text-body">
                                                <i className="ri-share-line"></i>
                                            </button>
                                            <button type="button" className="btn py-0 fs-16 text-body">
                                                <i className="ri-flag-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                </Row>

                                <div className='position-relative d-flex justify-content-between align-items-center'>
                                    <Nav className="nav-tabs-custom border-bottom-0" role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '1' }, "fw-semibold")}
                                                onClick={() => { toggleTab('1'); }}
                                                href="#">
                                                Overview
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '2' }, "fw-semibold")}
                                                onClick={() => { toggleTab('2'); }}
                                                href="#">
                                                Documents
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '3' }, "fw-semibold")}
                                                onClick={() => { toggleTab('3'); }}
                                                href="#">
                                                Activities
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '4' }, "fw-semibold")}
                                                onClick={() => { toggleTab('4'); }}
                                                href="#">
                                                Team
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <div className="flex-shrink-0 position-absolute end-0" style={{ bottom: '10px' }}>
                                        <Link to={`/apps-projects-create/${projectId}`} className="btn btn-secondary"><i
                                            className="ri-edit-box-line align-bottom"></i> Edit Profile</Link>
                                    </div>
                                </div>
                                {/* animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1 nav nav-pills */}

                            </CardBody>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <div className="d-flex profile-wrapper">
                    </div>
                    <TabContent activeTab={activeTab} className="text-muted">
                        <TabPane tabId="1">
                            {activeTab === '1' && (
                                <OverviewTab project={project} employees={teamList} data={data} setActiveTab={setActiveTab} />
                            )}
                        </TabPane>
                        <TabPane tabId="2">
                            {activeTab === '2' && (
                                <DocumentsTab projectId={projectId} />
                            )}
                        </TabPane>
                        <TabPane tabId="3">
                            {activeTab === '3' && (
                                <ActivitiesTab />
                            )}
                        </TabPane>
                        <TabPane tabId="4">
                            {activeTab === '4' && (
                                <TeamTab />
                            )}
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;