import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import SimpleBar from "simplebar-react";
import { useDispatch, useSelector } from 'react-redux';
import { deleteProjectEmployee, getAllProjectEmployeesByProject } from './../../../slices/projects/thunk';
import AddTeamMemberModal from 'Components/Common/Modal/AddTeamMemberModal';
import Avatar from 'Components/Common/Avatar';
import { selectEmployeeCount, selectEmployeeError, selectEmployeeList } from 'slices/projects/selectors';

const DashboardTeam = ({ project, employees, setActiveTab }: any) => {
    const dispatch: any = useDispatch();
    const projectEmployees = project?.employees || [];
    const { projectId }: any = useParams();
    const [memberModal, setMemberModal] = useState(false);

    const employeeList = useSelector(selectEmployeeList);
    const employeeCount = useSelector(selectEmployeeCount);
    const employeeError = useSelector(selectEmployeeError);

    useEffect(() => {
        dispatch(getAllProjectEmployeesByProject({ projectId, page: 1, limit: 1000 }));
    }, [])

    const handleDelete = async (employeeId: string) => {
        await dispatch(deleteProjectEmployee({ projectId, employeeId }));
        dispatch(getAllProjectEmployeesByProject({ projectId, page: 1, limit: 10 }));
    };

    return (
        <>
            <Card>
                <CardHeader className="align-items-center d-flex border-bottom-dashed">
                    <h4 className="card-title mb-0 flex-grow-1">Members</h4>
                    <div className="flex-shrink-0">
                        <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => setMemberModal(true)}>
                            <i className="ri-share-line me-1 align-bottom"></i> Invite Member
                        </button>
                    </div>
                </CardHeader>
                {employeeList?.length > 0 ? (
                    <CardBody>
                        {/* <SimpleBar data-simplebar style={{ height: "235px" }} className="mx-n3 px-3"> */}
                            <div className="vstack gap-3">
                                {employeeList?.slice(0, 5)?.map((employee: any) => (
                                    <div key={employee._id} className="d-flex align-items-start gap-2">
                                        {/* <div className="avatar-xs flex-shrink-0 me-3">
                                        <img
                                            src={employee.profileImagePath ? `${process.env.REACT_APP_STORAGEBUCKET}/${employee.profileImagePath}` : 'default-avatar.png'}
                                            alt={`${employee.firstName} ${employee.lastName}`}
                                            className="img-fluid rounded-circle"
                                        />
                                    </div> */}
                                        <Avatar
                                            title={`${employee?.firstName?.charAt(0)}`}
                                            src={`${process.env.REACT_APP_STORAGEBUCKET}/${employee.profileImagePath}`}
                                            size={35}
                                            backgroundColor='#96C9F4'
                                            color='#503BFF'
                                        />
                                        <div className="flex-grow-1">
                                            <h5 className="fs-13 mb-0">
                                                <Link to="#" className="text-body d-block">
                                                    {employee.firstName} {employee.lastName}
                                                </Link>
                                            </h5>
                                            <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{employee.designation}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="d-flex align-items-center gap-1">
                                                <button type="button" className="btn btn-light btn-sm">Message</button>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle type="button" className="btn btn-icon btn-sm fs-16 text-muted dropdown" tag="button">
                                                        <i className="ri-more-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu>

                                                        <li><DropdownItem tag={Link} to={`/pages-profile/${employee._id}`}>
                                                            <i className="ri-eye-fill text-muted me-2 align-bottom"></i>View
                                                        </DropdownItem></li>
                                                        <li><DropdownItem><i className="ri-star-fill text-muted me-2 align-bottom"></i>Favourite</DropdownItem></li>
                                                        <li><DropdownItem onClick={() => handleDelete(employee._id)}><i className="ri-delete-bin-5-fill text-muted me-2 align-bottom"></i>Delete</DropdownItem></li>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        {/* </SimpleBar> */}
                        {
                            employeeList?.length > 5 && (
                                <div className='d-flex justify-content-center mt-3'>
                                    <button className="btn btn-soft-secondary btn-sm" onClick={() => {
                                        setActiveTab('4')
                                    }}>
                                        View more <i className="ri-arrow-right-s-line me-1 align-bottom"></i>
                                    </button>
                                </div>
                            )
                        }
                    </CardBody>
                ) : (
                    <CardBody>
                        <p className="text-center text-muted">No team members found</p>
                    </CardBody>
                )}

            </Card>

            <AddTeamMemberModal isOpen={memberModal} projectId={projectId} handleClose={() => setMemberModal(false)} onSuccess={() => dispatch(getAllProjectEmployeesByProject({ projectId, page: 1, limit: 10 }))} />
        </>
    );
};

export default DashboardTeam;
