import { getRandomAvatar } from 'common/utils/utils'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Input, Modal, ModalBody, ModalHeader } from 'reactstrap'
import SimpleBar from 'simplebar-react'
import { addProjectEmployee, getAllProjectEmployeesByProject } from 'slices/projects/thunk'
import { getTeamData } from 'slices/team/thunk'
import Avatar from '../Avatar'
import { selectTeamCount, selectTeamList } from 'slices/team/selectors'
import { selectEmployeeCount, selectEmployeeError, selectEmployeeList } from 'slices/projects/selectors'

const AddTeamMemberModal = ({ isOpen, projectId, handleClose, onSuccess }: { isOpen: boolean, projectId: any, handleClose: () => void,  onSuccess: () => void }) => {
    // const openModal = () => setModal(!isOpen);
    const teamList = useSelector(selectTeamList);
    const teamCount:number = useSelector(selectTeamCount);
    
    const projectEmployeeList = useSelector(selectEmployeeList);
    const projectEmployeeCount = useSelector(selectEmployeeCount);
    const projectEmployeeError = useSelector(selectEmployeeError);

    const dispatch: any = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const avatarPlaceholder = getRandomAvatar();

    useEffect(() => {
        if (isOpen && projectId) {
            dispatch(getTeamData({page:1,limit:1000}));
            dispatch(getAllProjectEmployeesByProject({ projectId, page: 1, limit: 10 }));
        }
    }, [isOpen, dispatch, projectId]);

    const filteredEmployees = teamList?.filter((employee: any) =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddEmployee = (employeeId: string) => {
        if (!selectedEmployees.includes(employeeId)) {
            setSelectedEmployees([...selectedEmployees, employeeId]);
        }
    };

    const handleCancel = () => {
        setSelectedEmployees([]);
        // setModal(false);
        handleClose();
    };

    const handleInvite = async () => {
        try {
            await Promise.all(
                selectedEmployees.map(employeeId =>
                    dispatch(addProjectEmployee({ employeeId, projectId, role: 'role', status: 'active' }))
                )
            );
            dispatch(getAllProjectEmployeesByProject({ projectId, page: 1, limit: 10 }));
            setSelectedEmployees([]);
            onSuccess();
            // setModal(false);
            handleClose();
        } catch (error) {
            console.error("Failed to invite employees:", error);
        }
    };

    const isEmployeeAdded = (employeeId: string) => {
        return projectEmployeeList?.some((projectEmployee: any) => projectEmployee._id === employeeId);
    };

    return (
        <Modal isOpen={isOpen} toggle={handleCancel} centered className="border-0">
            <ModalHeader toggle={handleCancel} className="p-3 ps-4 bg-success-subtle">
                Members
            </ModalHeader>
            <ModalBody className="p-4">
                <div className="search-box mb-3">
                    <Input
                        type="text"
                        className="form-control bg-light border-light"
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="ri-search-line search-icon"></i>
                </div>

                <div className="mb-4 d-flex align-items-center">
                    <div className="me-2">
                        <h5 className="mb-0 fs-13">Members :</h5>
                    </div>
                    <div className="avatar-group justify-content-center">
                        {filteredEmployees.slice(0, 3).map((employee: any) => (
                            <Link to="#" className="avatar-group-item" key={employee._id} data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title={employee.firstName}>
                                {/* <div className="avatar-xs">
                                    <img
                                        src={employee.profileImagePath ? `${process.env.REACT_APP_STORAGEBUCKET}/${employee.profileImagePath}` : avatarPlaceholder}
                                        alt={employee.firstName}
                                        className="rounded-circle img-fluid"
                                    />
                                </div> */}
                                <Avatar
                                    title={employee.firstName?.charAt(0)}
                                    src={`${process.env.REACT_APP_STORAGEBUCKET}/${employee.profileImagePath}`}
                                    size={30}
                                    backgroundColor='#96C9F4'
                                    color='#503BFF'
                                    // shape='semi-round'
                                />
                            </Link>
                        ))}
                    </div>
                </div>

                <SimpleBar className="mx-n4 px-4" data-simplebar="init" style={{ maxHeight: "225px" }}>
                    <div className="vstack gap-3">
                        {filteredEmployees.map((employee: any) => (
                            <div className="d-flex align-items-center" key={employee._id}>
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    {/* <img
                                        src={employee.profileImagePath ? `${process.env.REACT_APP_STORAGEBUCKET}/${employee.profileImagePath}` : avatarPlaceholder}
                                        alt={employee.firstName}
                                        className="img-fluid rounded-circle"
                                    /> */}
                                    <Avatar
                                        title={employee.firstName?.charAt(0)}
                                        src={`${process.env.REACT_APP_STORAGEBUCKET}/${employee.profileImagePath}`}
                                        size={35}
                                        backgroundColor='#96C9F4'
                                        color='#503BFF'
                                        // shape='semi-round'
                                        // radius={15}
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0"><Link to="#" className="text-body d-block">{employee.firstName}</Link></h5>
                                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{employee.designation}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        type="button"
                                        className={`btn btn-light btn-sm ${selectedEmployees.includes(employee._id) ? 'disabled' : ''}`}
                                        onClick={() => handleAddEmployee(employee._id)}
                                        disabled={isEmployeeAdded(employee._id)}
                                    >
                                        {isEmployeeAdded(employee._id) ? 'Added' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </SimpleBar>
            </ModalBody>
            <div className="modal-footer">
                <button type="button" className="btn btn-light w-xs" onClick={handleCancel}>Cancel</button>
                <button type="button" className="btn btn-success w-xs" onClick={handleInvite}>Invite</button>
            </div>
        </Modal>
    )
}

export default AddTeamMemberModal