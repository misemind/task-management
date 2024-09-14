import { Link, useParams } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    Label,
    UncontrolledDropdown
} from 'reactstrap';
import { useDispatch } from 'react-redux';

import useFileUpload from 'common/hooks/useFileUpload.hook';
import { getIconDetailsByType } from 'common/utils/utils';
import { addProjectDocument, downloadProjectDocument, deleteProjectDocument } from 'slices/projects/thunk';
import { getProjectById } from 'slices/projectOverview/thunk';

const ProjectDocuments = ({ activeTab, data, setActiveTab }: any) => {
    const dispatch: any = useDispatch();
    const { projectId }: any = useParams();
    const { uploadFile } = useFileUpload();

    const handleFileUpload = async (event: any) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const { fileName, filePath, fileExtension, fileSize } = await uploadFile(file);

                dispatch(addProjectDocument({
                    projectId: projectId || '',  // Assuming projectId is available
                    document: {
                        name: fileName,
                        type: file.type,
                        path: filePath,
                        size: fileSize,
                    }
                })).then(() => {
                    dispatch(getProjectById(projectId));
                });
            } catch (err) {
                console.error("File upload failed:", err);
            }
        }
    };

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
        <Card>
            <CardHeader className="align-items-center d-flex border-bottom-dashed">
                <h4 className="card-title mb-0 flex-grow-1">Attachments</h4>
                <div className="flex-shrink-0">
                    <Input className="form-control d-none" type="file" id="formFile" onChange={handleFileUpload} />
                    <Label htmlFor="formFile" className="btn btn-soft-success btn-sm">
                        <i className="ri-upload-2-fill me-1 align-bottom"></i> Upload
                    </Label>
                </div>
            </CardHeader>
            {
                data?.documents?.documents?.length > 0 ? (
                    <CardBody>
                        <div className="vstack gap-2">
                            {(data?.documents?.documents?.slice(0, 4) || []).map((document: any, key: number) => {
                                const { icon, iconBackgroundClass } = getIconDetailsByType(document.type);
                                return (
                                    <div key={key} className="border rounded border-dashed p-2">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 me-3">
                                                <div className="avatar-sm">
                                                    <div className={`avatar-title bg-${iconBackgroundClass}-subtle text-${iconBackgroundClass} rounded fs-24`}>
                                                        <i className={icon}></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="fs-13 mb-1">
                                                    <Link to="#" className="text-body text-truncate d-block">{document.name}</Link>
                                                </h5>
                                                <div>{document.size} KB</div>
                                            </div>
                                            <div className="flex-shrink-0 ms-2">
                                                <div className="d-flex gap-1">
                                                    <button type="button" className="btn btn-icon text-muted btn-sm fs-18" onClick={() => handleDownload(document)}>
                                                        <i className="ri-download-2-line"></i>
                                                    </button>
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown" type="button">
                                                            <i className="ri-more-fill"></i>
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem>
                                                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename
                                                            </DropdownItem>
                                                            <DropdownItem onClick={() => handleDelete(document._id)}>
                                                                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {
                            data?.documents?.documents?.length > 4 && (
                                <div className='d-flex justify-content-center mt-3'>
                                    <button className="btn btn-soft-secondary btn-sm" onClick={() => {
                                        setActiveTab('2')
                                        // dispatch(setActive)
                                    }}>
                                        View more <i className="ri-arrow-right-s-line me-1 align-bottom"></i>
                                    </button>
                                </div>
                            )
                        }

                    </CardBody>
                ) : (
                    <CardBody>
                        <p className="text-center">No documents found</p>
                    </CardBody>
                )
            }
        </Card>
    );
};

export default ProjectDocuments;
