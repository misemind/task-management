import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table, UncontrolledDropdown } from 'reactstrap';
import { getIconDetailsByType } from './../../../common/utils/utils';
import { addProjectDocument, deleteProjectDocument, downloadProjectDocument, getProjectDocumentsList } from './../../../slices/projects/thunk';
import { selectCurrentDocument, selectDocumentCount, selectDocumentError, selectDocumentList } from 'slices/projects/selectors';
import { getProjectById } from 'slices/projectOverview/thunk';
import useFileUpload from 'common/hooks/useFileUpload.hook';

const DocumentsTab = ({ project, projectId, activeTab }: any) => {
    const dispatch: any = useDispatch();
    const { uploadFile } = useFileUpload();

    const documentList = useSelector(selectDocumentList);
    const documentCount = useSelector(selectDocumentCount);
    const currentDocument = useSelector(selectCurrentDocument);
    const documentError = useSelector(selectDocumentError);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = parseInt(process.env.REACT_APP_ITEMS_PER_PAGE!, 10);

    const handleDownload = (document: any) => {
        dispatch(downloadProjectDocument({
            projectId,
            documentId: document._id,
            name: document.name,
            type: document.type,
        }));
    };

    const handleDelete = async (documentId: string) => {
        await dispatch(deleteProjectDocument({ projectId, documentId }));

        // Check if the current page is now empty after deletion
        const remainingItems = documentList.length - 1; // because one item was deleted
        const totalPages = Math.ceil((documentCount - 1) / itemsPerPage);

        // If the current page is empty and we're not on the first page, decrease the page number
        if (remainingItems === 0 && currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        } else {
            // Re-fetch the documents for the current page
            dispatch(getProjectDocumentsList({ projectId, page: currentPage, limit: itemsPerPage }));
        }
        dispatch(getProjectById(projectId));
    };

    useEffect(() => {
        if (currentPage > 0 && itemsPerPage > 0) {
            dispatch(getProjectDocumentsList({ projectId, page: currentPage, limit: itemsPerPage }));
        }
    }, [dispatch, projectId, currentPage, itemsPerPage]);

    const handleFileUpload = async (event: any) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const { fileName, filePath, fileExtension, fileSize } = await uploadFile(file);

                await dispatch(addProjectDocument({
                    projectId: projectId || '',  // Assuming projectId is available
                    document: {
                        name: fileName,
                        type: file.type,
                        path: filePath,
                        size: fileSize,
                    }
                }));
                await dispatch(getProjectDocumentsList({ projectId, page: currentPage, limit: itemsPerPage }));
            } catch (err) {
                console.error("File upload failed:", err);
            }
        }
    };


    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="d-flex align-items-center mb-4">
                        <h5 className="card-title flex-grow-1">Documents</h5>
                        <div className="flex-shrink-0">
                            <Input className="form-control d-none" type="file" id="formFile" onChange={handleFileUpload} />
                            <Label htmlFor="formFile" className="btn btn-danger"><i className="ri-upload-2-fill me-1 align-bottom"></i> Upload
                                File</Label>
                        </div>
                    </div>
                    <Row>
                        {
                            documentList?.length !== 0 ? (
                                <Col lg={12}>
                                    <div
                                    // className="table-responsive"
                                    >
                                        <Table className="table-borderless align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col">File Name</th>
                                                    <th scope="col">Type</th>
                                                    <th scope="col">Size</th>
                                                    <th scope="col">Upload Date</th>
                                                    <th scope="col" style={{ width: "120px" }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documentList?.map((document: any) => {
                                                    const { icon, iconBackgroundClass } = getIconDetailsByType(document.type);
                                                    return (
                                                        <tr key={document._id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="avatar-sm">
                                                                        <div className={`avatar-title bg-light text-${iconBackgroundClass} rounded fs-24`}>
                                                                            <i className={icon}></i>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ms-3 flex-grow-1">
                                                                        <h5 className="fs-14 mb-0"><Link to="#" className="text-body">{document.name}</Link></h5>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{document.type.toUpperCase()} File</td>
                                                            <td>{document.size} MB</td>
                                                            <td>{new Date(document.uploadDate).toLocaleDateString()}</td>
                                                            <td>
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle tag="a" href="#" className="btn btn-soft-secondary btn-sm btn-icon">
                                                                        <i className="ri-more-fill"></i>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu className="dropdown-menu-end">
                                                                        <li><DropdownItem onClick={() => handleDownload(document)}><i className="ri-download-2-fill me-2 align-bottom text-muted"></i>Download</DropdownItem></li>
                                                                        <li className="dropdown-divider"></li>
                                                                        <li><DropdownItem onClick={() => handleDelete(document._id)}><i className="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>Delete</DropdownItem></li>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                    {/* <div className="text-center mt-3">
                                <Link to="#" className="text-success "><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i> Load more </Link>
                            </div> */}
                                </Col>
                            ) : (
                                <Col lg={12} className='p-3'>
                                    <h4 className="text-center text-muted">No documents found</h4>
                                </Col>
                            )
                        }

                    </Row>

                    {/* Pagination */}
                    {
                        documentCount > itemsPerPage && (
                            <Row className="g-0 text-center text-sm-start align-items-center mb-3 mt-4">
                                <Col sm={6}>
                                    <div>
                                        <p className="mb-sm-0 text-muted">
                                            Showing <span className="fw-semibold">
                                                {(documentCount > 0 && itemsPerPage > 0) ? (currentPage - 1) * itemsPerPage + 1 : 0}
                                            </span>
                                            to <span className="fw-semibold">
                                                {Math.min(currentPage * itemsPerPage, documentCount)}
                                            </span>
                                            of <span className="fw-semibold text-decoration-underline">
                                                {documentCount}
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
                                        {Array.from({ length: Math.ceil(documentCount / itemsPerPage) }, (_, pageNum) => (
                                            <li key={pageNum + 1} className={`page-item ${currentPage === pageNum + 1 ? 'active' : ''}`}>
                                                <Link to="#" className="page-link" onClick={() => setCurrentPage(pageNum + 1)}>
                                                    {pageNum + 1}
                                                </Link>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === Math.ceil(documentCount / itemsPerPage) ? 'disabled' : ''}`}>
                                            <Link to="#" className="page-link" onClick={() => currentPage < Math.ceil(documentCount / itemsPerPage) && setCurrentPage(prev => prev + 1)}>
                                                Next
                                            </Link>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        )
                    }

                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default DocumentsTab;
