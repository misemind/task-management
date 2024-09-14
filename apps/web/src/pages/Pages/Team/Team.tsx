import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  Offcanvas,
  OffcanvasBody,
  Row,
  UncontrolledDropdown,
  FormFeedback,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from "react-toastify";

//User Images
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import userdummyimg from "../../../assets/images/users/user-dummy-img.jpg";

//Small Images
import smallImage9 from "../../../assets/images/small/img-9.jpg";
//redux
import { useSelector, useDispatch } from "react-redux";

//import action
import {
  getTeamData as onGetTeamData,
  deleteTeamData as onDeleteTeamData,
  addTeamData as onAddTeamData,
  updateTeamData as onUpdateTeamData,
} from "../../../slices/thunks";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { createSelector } from "reselect";
import useFileUpload from "common/hooks/useFileUpload.hook";
import { selectDocumentList, selectDocumentCount, selectProjectCount } from "slices/projects/selectors";
import { selectTeamList, selectTeamCount, selectTeamError, selectProjectList } from "slices/team/selectors";
import TeamCard from "./components/Team-Cards";

const Team = () => {
  document.title = "Team | Velzon - React Admin & Dashboard Template";

  const dispatch: any = useDispatch();
  const bucketUrl = process.env.REACT_APP_STORAGEBUCKET;

  const { uploadFile, uploading, error } = useFileUpload();

  const teams = useSelector(selectTeamList);
  const teamCount = useSelector(selectTeamCount);
  const teamError = useSelector(selectTeamError);
  const documentList = useSelector(selectDocumentList);
  const documentCount = useSelector(selectDocumentCount);
  const projectList = useSelector(selectProjectList);
  const projectCount = useSelector(selectProjectCount);

  // const employeeData = createSelector(
  //   (state: any) => state.Team,
  //   (teamData) => teamData.teamData
  // );
  // Inside your component
  // const teamData = useSelector(employeeData);
  // console.log("employeeData", teamData);

  const [team, setTeam] = useState<any>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [teamList, setTeamlist] = useState<any>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  //Modal
  const [teamMem, setTeamMem] = useState<any>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = parseInt(process.env.REACT_APP_ITEMS_PER_PAGE!, 10)

  useEffect(() => {
    setTeam(teams);
    setTeamlist(teams);
  }, [teams]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTeamMem(null);
      setSelectedImage("");
      setImgStore("");
    } else {
      setModal(true);
    }
  }, [modal]);

  // Update Team Member
  const handleTeamClick = useCallback(
    (arg: any) => {
      const teamMem = {
        id: arg._id,
        firstName: arg.firstName,
        lastName: arg.lastName,
        emailAddress: arg.emailAddress,
        designation: arg.designation,
        profileImagePath: arg.profileImagePath, // Ensure this is set correctly
        coverImagePath: arg.coverImagePath, // Ensure this is set correctly
        projectNumber: arg.projectNumber,
        taskNumber: arg.taskNumber,
      };

      setTeamMem(teamMem);

      // Set the image preview state if images exist
      setSelectedProfileImage(teamMem.profileImagePath ? `${bucketUrl}/${teamMem.profileImagePath}` : userdummyimg);
      setSelectedCoverImage(teamMem.coverImagePath ? `${bucketUrl}/${teamMem.coverImagePath}` : smallImage9);

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );
  // Add To do
  const handleTeamClicks = () => {
    setTeamMem("");
    setModal(!modal);
    setIsEdit(false);
    toggle();
  };

  // delete
  const onClickData = (team: any) => {
    setTeam(team);
    setDeleteModal(true);
  };

  const handleDeleteTeamData = async (data: any) => {
    if (data) {
      await dispatch(onDeleteTeamData(data._id));
      dispatch(onGetTeamData({ page: 1, limit: itemsPerPage }));
      setDeleteModal(false);
    }
  };

  useEffect(() => {
    const list = document.querySelectorAll(".team-list");
    const buttonGroups = document.querySelectorAll(".filter-button");
    for (let i = 0; i < buttonGroups.length; i++) {
      buttonGroups[i].addEventListener("click", onButtonGroupClick);
    }

    function onButtonGroupClick(event: any) {
      const target = event.target as HTMLButtonElement;
      const targetId = target.id;
      const parentTargetId = target.parentElement?.id;

      if (
        targetId === "list-view-button" ||
        parentTargetId === "list-view-button"
      ) {
        document.getElementById("list-view-button")?.classList.add("active");
        document.getElementById("grid-view-button")?.classList.remove("active");

        list.forEach((el) => {
          el.classList.add("list-view-filter");
          el.classList.remove("grid-view-filter");
        });
      } else {
        document.getElementById("grid-view-button")?.classList.add("active");
        document.getElementById("list-view-button")?.classList.remove("active");

        list.forEach((el) => {
          el.classList.remove("list-view-filter");
          el.classList.add("grid-view-filter");
        });
      }
    }
  }, []);

  const favouriteBtn = (ele: any) => {
    if (ele.closest("button").classList.contains("active")) {
      ele.closest("button").classList.remove("active");
    } else {
      ele.closest("button").classList.add("active");
    }
  };

  const searchList = (e: any) => {
    let inputVal = e.toLowerCase();

    const filterItems = (arr: any, query: any) => {
      return arr.filter((el: any) => {
        return el.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    };

    let filterData = filterItems(teamList, inputVal);
    // setTeamlist(filterData);
    const noResultElement = document.getElementById("noresult");
    const teamListElement = document.getElementById("teamlist");

    if (filterData.length === 0) {
      if (noResultElement) {
        noResultElement.style.display = "block";
      }
      if (teamListElement) {
        teamListElement.style.display = "none";
      }
    } else {
      if (noResultElement) {
        noResultElement.style.display = "none";
      }
      if (teamListElement) {
        teamListElement.style.display = "block";
      }
    }
  };


  //OffCanvas
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sideBar, setSideBar] = useState<any>([]);

  //Dropdown
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggledropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: teamMem?.id || "",
      firstName: teamMem?.firstName || "",
      lastName: teamMem?.lastName || "",
      emailAddress: teamMem?.emailAddress || "",
      userImage: teamMem?.profileImagePath || "", // Use the correct field name
      coverImage: teamMem?.coverImagePath || "", // Use the correct field name
      designation: teamMem?.designation || "",
      projectNumber: teamMem?.projectNumber || "",
      taskNumber: teamMem?.taskNumber || "",
      location: "Delhi",
      joiningDate: "12/02/24",
      profileCompletion: 23,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter first name"),
      lastName: Yup.string().required("Please Enter last name"),
      emailAddress: Yup.string().email("Invalid email format").required("Please Enter email"),
      designation: Yup.string().required("Please Enter Your designation"),
    }),
    onSubmit: async (values: any) => {
      try {
        let profileImageUrl = teamMem?.profileImagePath; // Default to the old image
        let coverImageUrl = teamMem?.coverImagePath; // Default to the old image

        // Check if profile image is a new file and needs to be uploaded
        if (values.userImage && values.userImage instanceof File) {
          const { filePath: profileFilePath } = await uploadFile(values.userImage);
          profileImageUrl = profileFilePath; // Set the uploaded file path
        }

        // Check if cover image is a new file and needs to be uploaded
        if (values.coverImage && values.coverImage instanceof File) {
          const { filePath: coverFilePath } = await uploadFile(values.coverImage);
          coverImageUrl = coverFilePath; // Set the uploaded file path
        }

        // Prepare the payload
        const payload = {
          _id: teamMem ? teamMem.id : new Date().getTime(),
          firstName: values.firstName,
          lastName: values.lastName,
          emailAddress: values.emailAddress,
          designation: values.designation,
          profileImagePath: profileImageUrl, // Use the new or old profile image URL
          coverImagePath: coverImageUrl, // Use the new or old cover image URL
          projectNumber: Number(values.projectNumber),
          taskNumber: Number(values.taskNumber),
        };

        // Dispatch the appropriate action based on edit mode
        if (isEdit) {
          await dispatch(onUpdateTeamData(payload));
        } else {
          await dispatch(onAddTeamData(payload));
        }

        // Fetch the updated team data and reset the form
        dispatch(onGetTeamData({ page: 1, limit: itemsPerPage }));
        validation.resetForm();
        toggle();

      } catch (error) {
        console.error("An error occurred during the upload or submission process:", error);
      }
    }



  });

  // Image Validation
  const [imgStore, setImgStore] = useState<any>();
  const [selectedImage, setSelectedImage] = useState<any>();
  const [selectedProfileImage, setSelectedProfileImage] = useState<any>();
  const [selectedCoverImage, setSelectedCoverImage] = useState<any>();

  const handleClick = (item: any) => {
    const newData = [...imgStore, item];
    setImgStore(newData);
    validation.setFieldValue("userImage", newData);
  };

  useEffect(() => {
    setImgStore((teamMem && teamMem.userImage) || []);
  }, [teamMem]);

  const handleImageChange = (event: any, imageType: "profile" | "cover") => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the image for preview purposes

      if (imageType === "profile") {
        validation.setFieldValue("userImage", file); // Store the file in Formik state
        setSelectedProfileImage(imageUrl); // Update the preview with the in-memory image URL
      } else if (imageType === "cover") {
        validation.setFieldValue("coverImage", file); // Store the file in Formik state
        setSelectedCoverImage(imageUrl); // Update the preview with the in-memory image URL
      }
    }
  };
  useEffect(() => {
    dispatch(onGetTeamData({ page: 1, limit: itemsPerPage }));
  }, [dispatch]);

  useEffect(() => { dispatch(onGetTeamData({ page: currentPage, limit: itemsPerPage })); }, [currentPage])

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTeamData}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Team" pageTitle="Pages" />
          <Card>
            <CardBody>
              <Row className="g-2">
                <Col sm={4}>
                  <div className="search-box">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Search for name or designation..."
                      onChange={(e) => searchList(e.target.value)}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                <Col className="col-sm-auto ms-auto">
                  <div className="list-grid-nav hstack gap-1">
                    <Button
                      color="info"
                      id="grid-view-button"
                      className="btn btn-soft-info nav-link btn-icon fs-14 active filter-button"
                    >
                      <i className="ri-grid-fill"></i>
                    </Button>
                    <Button
                      color="info"
                      id="list-view-button"
                      className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"
                    >
                      <i className="ri-list-unordered"></i>
                    </Button>
                    <Dropdown isOpen={dropdownOpen} toggle={toggledropDown}>
                      <DropdownToggle
                        type="button"
                        className="btn btn-soft-info btn-icon fs-14"
                      >
                        <i className="ri-more-2-fill"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <li>
                          <Link className="dropdown-item" to="#">
                            All
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="#">
                            Last Week
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="#">
                            Last Month
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="#">
                            Last Year
                          </Link>
                        </li>
                      </DropdownMenu>
                    </Dropdown>
                    <Button color="success" onClick={() => handleTeamClicks()}>
                      <i className="ri-add-fill me-1 align-bottom"></i> Add
                      Members
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row>
            <Col lg={12}>
              <div id="teamlist">
                {
                  teamCount !== 0 ? (
                    <>
                      <Row className="team-list grid-view-filter">
                        {(teamList || [])?.map((item: any, key: any) => (
                          <TeamCard
                            key={key}
                            team={item}
                            onFavouriteClick={favouriteBtn}
                            onEditClick={handleTeamClick}
                            onDeleteClick={handleDeleteTeamData}
                          />
                        ))}
                      </Row>
                      {
                        teamCount > itemsPerPage && (
                          <Row className="g-0 text-center text-sm-start align-items-center mb-4">
                            <Col sm={6}>
                              <div>
                                <p className="mb-sm-0 text-muted">
                                  Showing <span className="fw-semibold">
                                    {(teamCount > 0 && itemsPerPage > 0) ? (currentPage - 1) * itemsPerPage + 1 : 0}
                                  </span>
                                  to <span className="fw-semibold">
                                    {Math.min(currentPage * itemsPerPage, teamCount)}
                                  </span>
                                  of <span className="fw-semibold text-decoration-underline">
                                    {teamCount}
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
                                {Array.from({ length: Math.ceil(teamCount / itemsPerPage) }, (_, pageNum) => (
                                  <li key={pageNum + 1} className={`page-item ${currentPage === pageNum + 1 ? 'active' : ''}`}>
                                    <Link to="#" className="page-link" onClick={() => setCurrentPage(pageNum + 1)}>
                                      {pageNum + 1}
                                    </Link>
                                  </li>
                                ))}
                                <li className={`page-item ${currentPage === Math.ceil(teamCount / itemsPerPage) ? 'disabled' : ''}`}>
                                  <Link to="#" className="page-link" onClick={() => currentPage < Math.ceil(teamCount / itemsPerPage) && setCurrentPage(prev => prev + 1)}>
                                    Next
                                  </Link>
                                </li>
                              </ul>
                            </Col>
                          </Row>
                        )
                      }
                    </>
                  ) : (
                    <p className="text-center">No data found</p>
                  )
                }


                <div
                  className="modal fade"
                  id="addmembers"
                  tabIndex={1}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <Modal isOpen={modal} toggle={toggle} centered>
                      <ModalBody>
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <Row>
                            <Col lg={12}>
                              <input
                                type="hidden"
                                id="memberid-input"
                                className="form-control"
                                defaultValue=""
                              />
                              <div className="px-1 pt-1">
                                <div className="modal-team-cover position-relative mb-0 mt-n4 mx-n4 rounded-top overflow-hidden">
                                  <img
                                    src={
                                      selectedCoverImage ||
                                      (validation.values.coverImage
                                        ? `${process.env.REACT_APP_STORAGEBUCKET}/${validation.values.coverImage}`
                                        : smallImage9)
                                    }
                                    alt=""
                                    id="cover-img"
                                    className="img-fluid"
                                  />
                                  <div className="d-flex position-absolute start-0 end-0 top-0 p-3">
                                    <div className="flex-grow-1">
                                      <h5 className="modal-title text-white" id="createMemberLabel">
                                        {!isEdit ? "Add New Members" : "Edit Member"}
                                      </h5>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <div className="d-flex gap-3 align-items-center">
                                        <div>
                                          <label
                                            htmlFor="cover-image-input"
                                            className="mb-0"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="Select Cover Image"
                                          >
                                            <div className="avatar-xs">
                                              <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                                <i className="ri-image-fill"></i>
                                              </div>
                                            </div>
                                          </label>
                                          <input
                                            className="form-control d-none"
                                            defaultValue=""
                                            id="cover-image-input"
                                            type="file"
                                            onChange={(e) => handleImageChange(e, "cover")}
                                            accept="image/png, image/gif, image/jpeg"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          className="btn-close btn-close-white"
                                          id="createMemberBtn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                          onClick={() => setModal(false)}
                                        ></button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center mb-4 mt-n5 pt-2">
                                <div className="position-relative d-inline-block">
                                  <div className="position-absolute bottom-0 end-0">
                                    <label
                                      htmlFor="member-image-input"
                                      className="mb-0"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="right"
                                      title="Select Member Image"
                                    >
                                      <div className="avatar-xs">
                                        <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                          <i className="ri-image-fill"></i>
                                        </div>
                                      </div>
                                    </label>
                                    <Input
                                      firstName="userImage"
                                      className="form-control d-none"
                                      id="member-image-input"
                                      type="file"
                                      accept="image/png, image/gif, image/jpeg"
                                      onChange={(e) => handleImageChange(e, "profile")}
                                      invalid={
                                        validation.touched.userImage &&
                                          validation.errors.userImage
                                          ? true
                                          : false
                                      }
                                    />
                                  </div>
                                  <div className="avatar-lg" onClick={(item: any) => handleClick(item)}>
                                    <div className="avatar-title bg-light rounded-circle">
                                      <img
                                        src={
                                          selectedProfileImage ||
                                          (validation.values.userImage
                                            ? `${process.env.REACT_APP_STORAGEBUCKET}/${validation.values.userImage}`
                                            : userdummyimg)
                                        }
                                        alt=" "
                                        id="member-img"
                                        className="avatar-md rounded-circle h-auto"
                                      />
                                    </div>
                                  </div>
                                </div>
                                {validation.errors.userImage && validation.touched.userImage ? (
                                  <FormFeedback type="invalid" className="d-block">
                                    {validation.errors.userImage}
                                  </FormFeedback>
                                ) : null}
                              </div>

                              <div className="mb-3">
                                <Label htmlFor="emailAddress" className="form-label">
                                  Email
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="emailAddress"
                                  placeholder="Enter email"
                                  name="emailAddress" // Updated to match formik field name
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.emailAddress || ""} // Updated to match formik field name
                                  invalid={
                                    validation.touched.emailAddress &&
                                      validation.errors.emailAddress
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.emailAddress && validation.errors.emailAddress ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.emailAddress}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="firstName" className="form-label">
                                  First Name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="firstName"
                                  placeholder="Enter first name"
                                  name="firstName"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.firstName || ""}
                                  invalid={
                                    validation.touched.firstName &&
                                      validation.errors.firstName
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.firstName && validation.errors.firstName ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.firstName}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="lastName" className="form-label">
                                  Last Name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="lastName"
                                  placeholder="Enter last name"
                                  name="lastName"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.lastName || ""}
                                  invalid={
                                    validation.touched.lastName &&
                                      validation.errors.lastName
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.lastName && validation.errors.lastName ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.lastName}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="mb-3">
                                <Label htmlFor="designation" className="form-label">
                                  Designation
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="designation"
                                  placeholder="Enter designation"
                                  name="designation"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.designation || ""}
                                  invalid={
                                    validation.touched.designation &&
                                      validation.errors.designation
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.designation && validation.errors.designation ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.designation}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="hstack gap-2 justify-content-end">
                                <button
                                  type="button"
                                  className="btn btn-light"
                                  onClick={() => setModal(false)}
                                >
                                  Close
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                  id="addNewMember"
                                >
                                  {!isEdit ? "Add Member" : "Save"}
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </ModalBody>
                    </Modal>
                  </div>


                </div>

                <Offcanvas
                  isOpen={isOpen}
                  direction="end"
                  toggle={() => setIsOpen(!isOpen)}
                  className="offcanvas-end border-0"
                  tabIndex={1}
                >
                  <OffcanvasBody className="profile-offcanvas p-0">
                    <div className="team-cover">
                      <img
                        src={sideBar.coverImagePath || smallImage9}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="p-3">
                      <div className="team-settings">
                        <Row>
                          <Col>
                            <button
                              type="button"
                              className="btn btn-light btn-icon rounded-circle btn-sm favourite-btn "
                            >
                              {" "}
                              <i className="ri-star-fill fs-14"></i>{" "}
                            </button>
                          </Col>
                          <UncontrolledDropdown
                            direction="start"
                            className="col text-end"
                          >
                            <DropdownToggle
                              tag="a"
                              id="dropdownMenuLink14"
                              role="button"
                            >
                              <i className="ri-more-fill fs-17"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem>
                                <i className="ri-star-line me-2 align-middle" />
                                Favorites
                              </DropdownItem>
                              <DropdownItem>
                                <i className="ri-delete-bin-5-line me-2 align-middle" />
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Row>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <img
                        src={sideBar.profileImagePath || avatar2}
                        alt=""
                        className="avatar-lg img-thumbnail rounded-circle mx-auto"
                      />
                      <div className="mt-3">
                        <h5 className="fs-15">
                          <Link to="#" className="link-primary">
                            {sideBar.name || "Nancy Martino"}
                          </Link>
                        </h5>
                        <p className="text-muted">
                          {sideBar.designation || "Team Leader & HR"}
                        </p>
                      </div>
                      <div className="hstack gap-2 justify-content-center mt-4">
                        <div className="avatar-xs">
                          <Link
                            to="#"
                            className="avatar-title bg-secondary-subtle text-secondary rounded fs-16"
                          >
                            <i className="ri-facebook-fill"></i>
                          </Link>
                        </div>
                        <div className="avatar-xs">
                          <Link
                            to="#"
                            className="avatar-title bg-success-subtle text-success rounded fs-16"
                          >
                            <i className="ri-slack-fill"></i>
                          </Link>
                        </div>
                        <div className="avatar-xs">
                          <Link
                            to="#"
                            className="avatar-title bg-info-subtle text-info rounded fs-16"
                          >
                            <i className="ri-linkedin-fill"></i>
                          </Link>
                        </div>
                        <div className="avatar-xs">
                          <Link
                            to="#"
                            className="avatar-title bg-danger-subtle text-danger rounded fs-16"
                          >
                            <i className="ri-dribbble-fill"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Row className="g-0 text-center">
                      <Col xs={6}>
                        <div className="p-3 border border-dashed border-start-0">
                          <h5 className="mb-1">
                            {sideBar.projectNumber || 124}
                          </h5>
                          <p className="text-muted mb-0">Projects</p>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="p-3 border border-dashed border-start-0">
                          <h5 className="mb-1">{sideBar.taskNumber || 81}</h5>
                          <p className="text-muted mb-0">Tasks</p>
                        </div>
                      </Col>
                    </Row>
                    <div className="p-3">
                      <h5 className="fs-15 mb-3">Personal Details</h5>
                      <div className="mb-3">
                        <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">
                          Number
                        </p>
                        <h6>+(256) 2451 8974</h6>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">
                          Email
                        </p>
                        <h6>nancymartino@email.com</h6>
                      </div>
                      <div>
                        <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">
                          Location
                        </p>
                        <h6 className="mb-0">Carson City - USA</h6>
                      </div>
                    </div>
                    <div className="p-3 border-top">
                      <h5 className="fs-15 mb-4">File Manager</h5>
                      <div className="d-flex mb-3">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-danger-subtle text-danger rounded fs-16">
                            <i className="ri-image-2-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">
                            <Link to="#">Images</Link>
                          </h6>
                          <p className="text-muted mb-0">4469 Files</p>
                        </div>
                        <div className="text-muted">12 GB</div>
                      </div>
                      <div className="d-flex mb-3">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-secondary-subtle text-secondary rounded fs-16">
                            <i className="ri-file-zip-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">
                            <Link to="#">Documents</Link>
                          </h6>
                          <p className="text-muted mb-0">46 Files</p>
                        </div>
                        <div className="text-muted">3.46 GB</div>
                      </div>
                      <div className="d-flex mb-3">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-success-subtle text-success rounded fs-16">
                            <i className="ri-live-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">
                            <Link to="#">Media</Link>
                          </h6>
                          <p className="text-muted mb-0">124 Files</p>
                        </div>
                        <div className="text-muted">4.3 GB</div>
                      </div>
                      <div className="d-flex">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-primary-subtle text-primary rounded fs-16">
                            <i className="ri-error-warning-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">
                            <Link to="#">Others</Link>
                          </h6>
                          <p className="text-muted mb-0">18 Files</p>
                        </div>
                        <div className="text-muted">846 MB</div>
                      </div>
                    </div>
                  </OffcanvasBody>
                  <div className="offcanvas-foorter border p-3 hstack gap-3 text-center position-relative">
                    <button className="btn btn-light w-100">
                      <i className="ri-question-answer-fill align-bottom ms-1"></i>{" "}
                      Send Message
                    </button>
                    <Link to="/pages-profile" className="btn btn-primary w-100">
                      <i className="ri-user-3-fill align-bottom ms-1"></i> View
                      Profile
                    </Link>
                  </div>
                </Offcanvas>
              </div>
              <div
                className="py-4 mt-4 text-center"
                id="noresult"
                style={{ display: "none" }}
              >
                <i className="ri-search-line display-5 text-success"></i>
                <h5 className="mt-4">Sorry! No Result Found</h5>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Team;
