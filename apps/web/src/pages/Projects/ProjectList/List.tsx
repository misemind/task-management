import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Input, Row } from 'reactstrap';
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';

//import action
import {
    getProjectList as onGetProjectList,
    deleteProjectList as onDeleteProjectList,
} from "../../../slices/thunks";
import AddTeamMemberModal from 'Components/Common/Modal/AddTeamMemberModal';
import {
    selectCommentCount, selectCommentError, selectCommentList, selectCurrentDocument, selectDocumentCount,
    selectDocumentError, selectDocumentList, selectEmployeeCount, selectEmployeeError, selectEmployeeList,
    selectProjectCount, selectProjectError, selectProjectLists
} from 'slices/projects/selectors';
import { clearProjectOverview } from 'slices/projectOverview/reducer';
import ProjectCard01 from './Component/ProjectCard01';

const List = () => {
    const dispatch: any = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [dateFilter, setDateFilter] = useState("All");
    const [selectedDesign] = useState<"isDesign1" | "isDesign2" | "isDesign3">("isDesign1");
    const [noSearchResults, setNoSearchResults] = useState<boolean>(false);

    const projectLists = useSelector(selectProjectLists);
    const projectCount: number = useSelector(selectProjectCount);
    const projectError = useSelector(selectProjectError);

    const documentList = useSelector(selectDocumentList);
    const documentCount = useSelector(selectDocumentCount);
    const currentDocument = useSelector(selectCurrentDocument);
    const documentError = useSelector(selectDocumentError);

    const employeeList = useSelector(selectEmployeeList);
    const employeeCount = useSelector(selectEmployeeCount);
    const employeeError = useSelector(selectEmployeeError);

    const commentList = useSelector(selectCommentList);
    const commentCount = useSelector(selectCommentCount);
    const commentError = useSelector(selectCommentError);

    const [projects, setProjects] = useState<any[]>([]);
    const [deleleModalState, setDeleleModalState] = useState({
        isOpen: false,
        projectId: null,
    });
    const [memberModalState, setMemberModalState] = useState({
        isOpen: false,
        projectId: null,
    })

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = parseInt(process.env.REACT_APP_ITEMS_PER_PAGE!, 10)

    useEffect(() => {
        // Only dispatch when currentPage and itemsPerPage are valid
        if (currentPage > 0 && itemsPerPage > 0) {
            dispatch(onGetProjectList({ page: currentPage, limit: itemsPerPage }));
        }
    }, [dispatch, currentPage, itemsPerPage]);

    useEffect(() => {
        const filterByDate = (projects: any[]) => {
            const now = new Date();
            return projects.filter((project) => {
                const createdDate = new Date(project.createDate); // Assuming createdDate is in a proper date format
                switch (dateFilter) {
                    case "Last 7 Days":
                        return createdDate >= new Date(now.setDate(now.getDate() - 7));
                    case "Last 30 Days":
                        return createdDate >= new Date(now.setDate(now.getDate() - 30));
                    case "Last Year":
                        return createdDate >= new Date(now.setFullYear(now.getFullYear() - 1));
                    case "This Month":
                        return createdDate.getMonth() === new Date().getMonth() &&
                            createdDate.getFullYear() === new Date().getFullYear();
                    case "Today":
                        return createdDate.toDateString() === new Date().toDateString();
                    case "Yesterday":
                        const yesterday = new Date(now.setDate(now.getDate() - 1));
                        return createdDate.toDateString() === yesterday.toDateString();
                    default:
                        return true; // "All" case, no filtering
                }
            });
        };

        const filteredProjects = filterByDate(projectLists)
            .filter((project) =>
                project?.title?.toLowerCase()?.includes(searchTerm.toLowerCase())
            )
            .map((project) => {
                // Apply selected design to each project
                return {
                    ...project,
                    isDesign1: selectedDesign === "isDesign1",
                    isDesign2: selectedDesign === "isDesign2",
                    isDesign3: selectedDesign === "isDesign3",
                };
            });

        setProjects(filteredProjects);
    }, [projectLists, searchTerm, dateFilter]);

    useEffect(() => {
        const filteredEmployees = projects.filter((project: any) =>
            project?.title?.toLowerCase()?.includes(searchTerm.toLowerCase())
        );

        // Check if there are no search results
        setNoSearchResults(filteredEmployees.length === 0 && searchTerm.trim() !== '');

        // Reset search results if searchTerm is empty
        if (searchTerm.trim() === '') {
            setNoSearchResults(false);
        }
    }, [searchTerm, employeeList]);

    const handleDeleteProjectList = async () => {
        const { projectId } = deleleModalState;
        if (projectId) {
            await dispatch(onDeleteProjectList(projectId));
            // Check if the current page is now empty after deletion
            const remainingItems = projects.length - 1; // because one item was deleted
            const totalPages = Math.ceil((projectCount - 1) / itemsPerPage);

            // If the current page is empty and we're not on the first page, decrease the page number
            if (remainingItems === 0 && currentPage > 1) {
                setCurrentPage(prevPage => prevPage - 1);
            } else {
                // Re-fetch the projects for the current page
                await dispatch(onGetProjectList({ page: currentPage, limit: itemsPerPage }));
            }

            dispatch(clearProjectOverview());
            setDeleleModalState({
                isOpen: false,
                projectId: null
            })
        }
    };

    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            <DeleteModal
                show={deleleModalState.isOpen}
                onDeleteClick={() => handleDeleteProjectList()}
                onCloseClick={() => {
                    setDeleleModalState({
                        isOpen: false,
                        projectId: null
                    })
                }}
            />
            <Row className="g-4 mb-3">
                <div className="col-sm-auto">
                    <div>
                        <Link to="/apps-projects-create" className="btn btn-primary"><i
                            className="ri-add-line align-bottom me-1"></i> Add New</Link>
                    </div>
                </div>
                <div className="col-sm-3 ms-auto">
                    <div className="d-flex justify-content-sm-end gap-2">
                        <div className="search-box ms-2 col-sm-7">
                            <Input type="text" className="form-control" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
                            <i className="ri-search-line search-icon"></i>
                        </div>

                        <select
                            className="form-control w-md"
                            data-choices data-choices-search-false
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            {["All", "Last 7 Days", "Last 30 Days", "Last Year", "This Month", "Today", "Yesterday"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Row>

            <Row>

                {
                    projects.length === 0 && !noSearchResults ? (
                        <Col lg={12} className='p-3'>
                            <h4 className="text-center text-muted">Teams data not found.</h4>
                        </Col>
                    ) : noSearchResults ? (
                        <Col lg={12} className='p-3'>
                            <h4 className="text-center text-muted">Searching result is not matched.</h4>
                        </Col>
                    ) : (
                            (projects || []).map((item: any, index: number) => (
                                <ProjectCard01
                                    key={index}
                                    item={item}
                                    setDeleleModalState={setDeleleModalState}
                                    setMemberModalState={setMemberModalState}
                                />
                            ))
                    )
                }
                
            </Row>
            {
                projectCount > itemsPerPage && (
                    <Row className="g-0 text-center text-sm-start align-items-center mb-4">
                        <Col sm={6}>
                            <div>
                                <p className="mb-sm-0 text-muted">
                                    Showing <span className="fw-semibold">
                                        {(projectCount > 0 && itemsPerPage > 0) ? (currentPage - 1) * itemsPerPage + 1 : 0}
                                    </span>
                                    to <span className="fw-semibold">
                                        {Math.min(currentPage * itemsPerPage, projectCount)}
                                    </span>
                                    of <span className="fw-semibold text-decoration-underline">
                                        {projectCount}
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
                                {Array.from({ length: Math.ceil(projectCount / itemsPerPage) }, (_, pageNum) => (
                                    <li key={pageNum + 1} className={`page-item ${currentPage === pageNum + 1 ? 'active' : ''}`}>
                                        <Link to="#" className="page-link" onClick={() => setCurrentPage(pageNum + 1)}>
                                            {pageNum + 1}
                                        </Link>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === Math.ceil(projectCount / itemsPerPage) ? 'disabled' : ''}`}>
                                    <Link to="#" className="page-link" onClick={() => currentPage < Math.ceil(projectCount / itemsPerPage) && setCurrentPage(prev => prev + 1)}>
                                        Next
                                    </Link>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                )
            }


            {/* Add Team Member */}
            {
                memberModalState.isOpen && (
                    <AddTeamMemberModal
                        isOpen={memberModalState.isOpen}
                        projectId={memberModalState.projectId}
                        handleClose={() => setMemberModalState({ isOpen: false, projectId: null })}
                        onSuccess={() => dispatch(onGetProjectList({ page: currentPage, limit: itemsPerPage }))}
                    />
                )
            }
        </React.Fragment>
    );
};

export default List;
