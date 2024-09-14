import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
  Form,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
//Import Flatepicker
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";

import {
  getAllProjectEmployeesByProject,
  addProjectList as onAddProjectList,
  getTeamData as onGetTeamData,
  updateProjectList as onUpdateProjectList,
} from "slices/thunks";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useFormik } from "formik";
import * as Yup from "yup";
import { onGetSkills } from "slices/skills/thunk";
import useFileUpload from "common/hooks/useFileUpload.hook";
import { getProjectById } from "slices/projectOverview/thunk";
import {
  getProjectList as onGetProjectList,
  deleteProjectList as onDeleteProjectList,
} from "../../../slices/thunks";
import DeleteModal from "Components/Common/DeleteModal";
import AddTeamMemberModal from "Components/Common/Modal/AddTeamMemberModal";
import Avatar from "Components/Common/Avatar";
import { toast, ToastContainer } from "react-toastify";
import { selectEmployeeCount, selectEmployeeError, selectEmployeeList } from "slices/projects/selectors";
import { selectTeamList } from "slices/team/selectors";
// import CircleFileUpload from "Components/Common/CircleFileUpload";
import './index.scss'
import ProfilePhotoUpload from "Components/Common/ProfilePhotoUpload";
import { resetEmployees } from "slices/projects/reducer";

const categoriesOptions = ["Designing", "Development"];

const CreateProject = () => {
  const { projectId }: any = useParams();
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const teamList = useSelector(selectTeamList);
  const employeeList = useSelector(selectEmployeeList);
  const employeeCount = useSelector(selectEmployeeCount);
  const employeeError = useSelector(selectEmployeeError);
  const { uploadFile, uploading, error } = useFileUpload();

  // Inside your component
  // const teamData = useSelector(employeeData);
  const skillsOptions = useSelector((state: any) => state.Skills.skills);
  const skillsStatus = useSelector((state: any) => state.Skills.status);

  //Dropzone file upload
  const [selectedFiles, setselectedFiles] = useState<any>([]);

  //view proejct data 
  const { data, loading } = useSelector((state: any) => state.ProjectOverview);

  const [selectedMulti, setselectedMulti] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [memberModal, setMemberModal] = useState(false);
  const projectEmployees = useSelector((state: any
  ) => state.Projects.employees || []);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(onGetSkills({ limit: 1000, page: 1 }))
    dispatch(onGetTeamData({ page: 1, limit: 100 }));
    if(projectId === undefined) {
      dispatch(resetEmployees())
    }
    if (projectId) {
      dispatch(getProjectById(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (!memberModal && projectId) {
      dispatch(getAllProjectEmployeesByProject({ projectId, page: 1, limit: 10 }));
    }
  }, [memberModal, projectId]);

  const handleMulti = (selectedMulti: any) => {
    setselectedMulti(selectedMulti);
  };

  /**
   * Formats the size
   */
  const formatBytes = (bytes: any, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleAcceptedFiles = (files: any) => {
    const formattedFiles = files.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles((prevSelectedFiles: any) => [...prevSelectedFiles, ...formattedFiles]);
    formik.setFieldValue("files", formattedFiles);
  };

  const handleRemoveFile = (fileIndex: number) => {
    const updatedFiles = selectedFiles.filter((_: any, index: number) => index !== fileIndex);
    setselectedFiles(updatedFiles);
    formik.setFieldValue("files", updatedFiles);
    toast.success("File removed successfully");
  };

  const formik: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: "",
      projectTitle: "",
      thumbnailImage: null,
      priority: "high",
      status: "inprogress",
      endDate: null,
      selectedMulti: [],
      privacyStatus: "",
      categories: [],
      files: [],
      projectDescription: "<p>Type Your Project Description Here<p/>",
    },
    // validationSchema: Yup.object({
    //   projectTitle: Yup.string().required("Please Enter Your Project Title"),
    //   thumbnailImage: Yup.mixed().required("Please Upload a Thumbnail Image"),
    //   projectDescription: Yup.string().required("Please Enter Project Description"),
    //   files: Yup.array().min(1, "Please upload at least one file"),
    //   priority: Yup.string().required("Please Select Priority"),
    //   endDate: Yup.date().required("Please Enter a Deadline"),
    //   status: Yup.string().required("Please Select Status"),
    //   privacyStatus: Yup.string().required("Please Select Privacy Status"),
    //   categories: Yup.array().min(1, "Please Select At Least One Category"),
    //   selectedMulti: Yup.array().min(1, "Please Select At Least One Skill"),
    // }),
    onSubmit: async (values: any) => {
      try {
        // // Trigger form validation
        // const errors = await formik.validateForm();
        // console.log(errors, 'errors');

        // if (Object.keys(errors).length > 0) {
        //   // If there are validation errors, show a toast error and do not submit
        //   toast.error("Please fill in all required fields correctly", { autoClose: 3000 });
        //   return;
        // }

        // 1. Upload all files in parallel if they are provided
        const fileUploadPromises = selectedFiles?.length > 0
          ? selectedFiles?.map(async (file: File) => {
            const { filePath, fileName, fileExtension, fileSize } = await uploadFile(file);
            return {
              filePath,
              fileName,
              fileExtension,
              fileSize
            };
          })
          : [];

        // 2. Upload the thumbnail image if a new one is provided, otherwise use the existing one
        let thumbnailUploadPromise = null;
        if (values.thumbnailImage && typeof values.thumbnailImage !== 'string') {
          thumbnailUploadPromise = await uploadFile(values.thumbnailImage).then(result => ({
            filePath: result.filePath,
            fileName: result.fileName,
            fileExtension: result.fileExtension,
            fileSize: result.fileSize
          }));
        }

        // 3. Wait for all uploads to complete
        const [uploadedFiles, thumbnailResult] = await Promise.all([
          Promise.all(fileUploadPromises),
          thumbnailUploadPromise
        ]);

        const skills: any = values?.selectedMulti?.map((item: any) => item?.value);
        const tags: any = values?.categories?.map((item: any) => item?.value);

        // 4. Prepare the data for submission, including uploaded file paths and thumbnail path
        const newTeamData = {
          // _id: new Date().getTime(),
          title: values.projectTitle,
          description: values.projectDescription,
          endDate: values.endDate,
          status: values.status,
          lastUpdate: null,
          priority: values.priority,
          privacy: values.privacyStatus || "public",
          skills: skills,
          tags: tags,
          employees: employeeList?.map((employee: any) => employee?._id),
          files: uploadedFiles.length > 0 ? uploadedFiles : values?.files, // Include the uploaded file details or existing files
          thumbnailImage: thumbnailResult ? thumbnailResult?.filePath : values?.thumbnailImage, // Use the new thumbnail path or existing one
        };

        // 5. Determine if we're creating or updating
        let successData;
        if (values.id) {
          // Update operation
          successData = await dispatch(onUpdateProjectList({ id: values?.id, project: newTeamData }));
          console.log(successData, 'successData');
          if (successData?.meta?.requestStatus === "fulfilled") {
            navigate(`/apps-projects-overview/${values.id}`);
          }
        } else {
          // Create operation
          successData = await dispatch(onAddProjectList(newTeamData));
          console.log(successData, 'successData');
          if (successData?.meta?.requestStatus === "fulfilled") {
            navigate("/apps-projects-list");
            toast.success("Project Created Successfully");
          }
        }

        // Optionally reset the form
        formik.resetForm();
      } catch (error) {
        console.error("An error occurred during the upload or submission process:", error);
      }
    },
  });

  document.title = "Create Project | Velzon - React Admin & Dashboard Template";

  const setFormValue = () => {
    const currentDate = new Date();
    const mappedSkills = data?.skills?.map((skill: string) => ({ value: skill, label: skill }));
    const mappedTags = data?.tags?.map((tag: string) => ({ value: tag, label: tag }));

    formik.setFieldValue("id", data?._id || "");
    formik.setFieldValue("projectTitle", data?.title || "");
    formik.setFieldValue("thumbnailImage", data?.thumbnailImage || null);
    formik.setFieldValue("priority", data?.priority || "high");
    formik.setFieldValue("status", data?.status || "inprogress");
    formik.setFieldValue("endDate", data?.endDate || currentDate);
    formik.setFieldValue("selectedMulti", mappedSkills || []);
    formik.setFieldValue("categories", mappedTags || []);
    formik.setFieldValue("privacyStatus", data?.privacy || "public");
    formik.setFieldValue("projectDescription", data?.description || "");
    formik.setFieldValue("files", data?.documents?.documents || []);

    setselectedFiles(data?.documents?.documents || []);
  }

  useEffect(() => {
    if (data !== null && projectId) {
      setFormValue()
    }
  }, [projectId, data])

  const handleDelete = (id: string) => {
    setDeleteModal(true);
  };

  const handleDeleteProjectList = async () => {
    if (projectId) {
      await dispatch(onDeleteProjectList(projectId));
      // await dispatch(onGetProjectList());
      setDeleteModal(false);
      navigate("/apps-projects-list");
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteProjectList()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Create Project" pageTitle="Projects" />
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
              return false;
            }}
            action=""
          >
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="project-title-input"
                      >
                        Project Title
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="project-title-input"
                        placeholder="Enter project title"
                        name="projectTitle"
                        value={formik.values.projectTitle}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        invalid={
                          formik.touched.projectTitle &&
                            formik.errors.projectTitle
                            ? true
                            : false
                        }
                      />
                      {formik.touched.projectTitle &&
                        formik.errors.projectTitle && (
                          <div className="text-danger">
                            {formik.errors.projectTitle}
                          </div>
                        )}
                    </div>
                    {/* <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="project-thumbnail-img"
                      >
                        Thumbnail Image
                      </Label>
                      <div className="d-flex align-items-center gap-2">
                        <Avatar 
                          src={`${process.env.REACT_APP_STORAGEBUCKET}/${formik.values.thumbnailImage}`}
                          onClick={handleAvatarClick}
                        />
                        <Input
                          className="form-control"
                          id="project-thumbnail-img"
                          type="file"
                          accept="image/png, image/gif, image/jpeg"
                          name="thumbnailImage"
                          onChange={(event: any) => {
                            const file = event.currentTarget.files[0];
                            formik.setFieldValue("thumbnailImage", file);
                              const fileUrl = URL.createObjectURL(file);
                              setPreviewUrl(fileUrl); 
                          }}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.thumbnailImage &&
                              formik.errors.thumbnailImage
                              ? true
                              : false
                          }
                        />
                      </div>
                    </div> */}

                    <div className="mb-3">
                      <Label className="form-label">Project Description</Label>
                      <CKEditor
                        editor={ClassicEditor as any}
                        data={formik.values.projectDescription}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          formik.setFieldValue("projectDescription", data);
                        }}
                        onBlur={() =>
                          formik.setFieldTouched("projectDescription", true)
                        }
                      />
                    </div>

                    <Row>
                      <Col lg={4}>
                        <div className="mb-3 mb-lg-0">
                          <Label
                            htmlFor="choices-priority-input"
                            className="form-label"
                          >
                            Priority
                          </Label>
                          <select
                            className="form-select"
                            id="choices-priority-input"
                            name="priority"
                            value={formik.values.priority}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="high">high</option>
                            <option value="medium">medium</option>
                            <option value="low">low</option>
                          </select>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="mb-3 mb-lg-0">
                          <Label
                            htmlFor="choices-status-input"
                            className="form-label"
                          >
                            Status
                          </Label>
                          <select
                            className="form-select"
                            id="choices-privacy-status-input"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value="pending">Pending</option>
                            <option value="inprogress">Inprogress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div>
                          <Label
                            htmlFor="datepicker-deadline-input"
                            className="form-label"
                          >
                            Deadline
                          </Label>
                          <Flatpickr
                            className="form-control"
                            options={{
                              dateFormat: "d M, Y",
                            }}
                            value={formik.values.endDate}
                            onChange={(date) => {
                              // Convert the selected date to ISO 8601 format
                              const isoDate = date[0].toISOString();
                              // Set the ISO 8601 date string in formik
                              formik.setFieldValue("endDate", isoDate);
                            }}
                            placeholder="Enter due date"
                            id="datepicker-deadline-input"
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">Attached files</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col lg={2}>
                        <p className="form-label text-muted mb-3">Thumbnail Image</p>
                        <ProfilePhotoUpload
                          previewUrl={`${process.env.REACT_APP_STORAGEBUCKET}/${formik.values.thumbnailImage}`}
                          onFileChange={(file) => formik.setFieldValue("thumbnailImage", file)}
                        />
                      </Col>
                      <Col lg={10}>
                        <div className="multifile-upload">
                          <p className="text-muted">Add Attached files here.</p>

                          {/* Dropzone component */}
                          <Dropzone onDrop={handleAcceptedFiles} multiple={true}>
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone dz-clickable">
                                <div
                                  {...getRootProps()}
                                  className="dz-message needsclick"
                                >
                                  <input {...getInputProps()} />
                                  <div className="d-flex align-items-center justify-content-center gap-2">
                                    <i className="display-5 text-muted ri-upload-cloud-2-fill" />
                                    <h5 className="mb-0">Drop files here or click to upload.</h5>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Dropzone>

                          {/* Display selected files */}
                          <ul className="list-unstyled mb-0" id="dropzone-preview">
                            {selectedFiles?.map((file: any, index: number) => (
                              <Card
                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={index}
                              >
                                <div className="p-2">
                                  <Row className="align-items-center">
                                    <Col className="col-auto">
                                      <img
                                        data-dz-thumbnail=""
                                        height="80"
                                        className="avatar-sm rounded bg-light"
                                        alt={file.name}
                                        src={file.preview || `${process.env.REACT_APP_STORAGEBUCKET}/${file?.path}`}
                                      // src={`${process.env.REACT_APP_STORAGEBUCKET}/${file?.path}`}
                                      />
                                    </Col>
                                    <Col>
                                      <p className="mb-0">{file.name}</p>
                                      <p className="mb-0">
                                        <strong>{file.formattedSize || file.size}</strong>
                                      </p>
                                    </Col>
                                    <Col className="d-flex align-items-center justify-content-end">

                                      <div
                                        className={`btn rounded-circle bg-light text-danger`}
                                        style={{ width: "30px", height: "30px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                        onClick={() => handleRemoveFile(index)}
                                      >
                                        <i className="ri-delete-bin-5-line fs-16" />
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            ))}
                          </ul>
                        </div>
                      </Col>
                    </Row>

                  </CardBody>
                </Card>

                <div className="text-end mb-4">
                  <button type="button" className="btn btn-danger w-sm me-1" onClick={() => handleDelete(projectId)}>
                    Delete
                  </button>
                  {
                    !projectId && (
                      <button type="button" className="btn btn-secondary w-sm me-1">
                        Draft
                      </button>
                    )
                  }
                  <button
                    type="submit"
                    className="btn btn-success w-sm"
                  // onClick={handleSubmit}
                  >
                    {projectId ? "Update" : "Create"}
                  </button>
                </div>
              </Col>

              <Col lg={4}>
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Privacy</h5>
                  </div>
                  <CardBody>
                    <div>
                      <Label
                        htmlFor="choices-privacy-status-input"
                        className="form-label"
                      >
                        Status
                      </Label>
                      <select
                        className="form-select"
                        id="choices-privacy-status-input"
                        name="privacyStatus"
                        value={formik.values.privacyStatus}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </CardBody>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Tags</h5>
                  </div>
                  <CardBody>
                    <div className="mb-3">
                      <Label
                        htmlFor="choices-categories-input"
                        className="form-label"
                      >
                        Categories
                      </Label>
                      {/* <select
                        className="form-select"
                        id="choices-categories-input"
                        name="categories"
                        value={formik.values.categories}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="Designing">Designing</option>
                        <option value="Development">Development</option>
                      </select> */}

                      <Select
                        value={formik.values.categories}
                        isMulti={true}
                        onChange={(selectedOptions: any) => {
                          formik.setFieldValue("categories", selectedOptions)
                        }}
                        options={[{ value: "Designing", label: "Designing" }, { value: "Development", label: "Development" }]}
                        onBlur={() =>
                          formik.setFieldTouched("categories", true)
                        }
                      />

                    </div>

                    <div>
                      <Label
                        htmlFor="choices-text-input"
                        className="form-label"
                      >
                        Skills
                      </Label>
                      {skillsStatus === "loading" ? (
                        <p>Loading skills...</p>
                      ) : (
                        <Select
                          value={formik.values.selectedMulti}
                          isMulti={true}
                          onChange={(selectedOptions: any) => {
                            formik.setFieldValue("selectedMulti", selectedOptions)
                          }}
                          options={skillsOptions}
                          onBlur={() =>
                            formik.setFieldTouched("selectedMulti", true)
                          }
                        />)}
                    </div>
                  </CardBody>
                </div>

                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">Members</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-3">
                      <Label
                        htmlFor="choices-lead-input"
                        className="form-label"
                      >
                        Team Lead
                      </Label>
                      <select
                        className="form-select"
                        id="choices-lead-input"
                        name="teamLead"
                        value={formik.values.teamLead}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {teamList?.slice(0, 5).map((employee: any) => (
                          <option key={employee._id} value={employee.firstName}>
                            {employee.firstName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="form-label">Team Members</Label>
                      <div className="avatar-group">
                        {employeeList?.slice(0, 5).map((team: any, index: number) => (
                          <Link
                            key={index}
                            to="#"
                            className="avatar-group-item"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            data-bs-placement="top"
                            title={team?.firstName + ' ' + team?.lastName}
                          >
                            {/* <div className="avatar-xs">
                              <img
                                src={`${process.env.REACT_APP_STORAGEBUCKET}/${team?.profileImagePath}`}
                                alt={team?.firstName}
                                className="rounded-circle img-fluid"
                              />
                            </div> */}
                            <Avatar
                              title={team?.firstName?.charAt(0) + team?.lastName?.charAt(0)}
                              src={`${process.env.REACT_APP_STORAGEBUCKET}/${team?.profileImagePath}`}
                              size={30}
                              backgroundColor='#96C9F4'
                              color='#503BFF'
                            />
                          </Link>
                        ))}

                        <Link
                          to="#"
                          className="avatar-group-item"
                          data-bs-toggle="tooltip"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          title="Add Members"
                        >
                          <div
                            className="avatar-xs"
                            data-bs-toggle="modal"
                            data-bs-target="#inviteMembersModal"
                          >
                            <div 
                            className={`avatar-title btn fs-16 rounded-circle bg-light border-dashed border text-primary ${projectId === undefined && 'disabled'}`} 
                            onClick={() => {
                              setMemberModal(true)
                            }}>
                              +
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      {
        memberModal && (
          <AddTeamMemberModal isOpen={memberModal} projectId={projectId} handleClose={() => setMemberModal(false)} onSuccess={() => console.log('')} />
        )
      }
    </React.Fragment>
  );
};

export default CreateProject;
