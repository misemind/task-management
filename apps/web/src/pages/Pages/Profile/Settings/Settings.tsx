import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import Flatpickr from "react-flatpickr";

//import images
import progileBg from '../../../../assets/images/profile-bg.jpg';
import avatar1 from '../../../../assets/images/users/avatar-1.jpg';
import { addExperienceData, deleteExperienceData, getExperienceData, getTeamDataById, updateExperienceData, updateTeamData } from 'slices/team/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { selectTeamDetail } from 'slices/team/selectors';
import Select from "react-select";
import { onGetSkills } from 'slices/skills/thunk';

interface ProfileForm {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    joiningDate: Date | null;
    designation: string;
    skills: (string | null)[];
    website: string;
    city: string;
    country: string;
    zipCode: string;
    description: string;
    profileCompletion: number;
    socialLinks: (string | null)[];
    passwordHash: string;
    projectNumber?: number;
    taskNumber?: number;
    _id?: string;
}
interface Experience {
    jobTitle: string;
    companyName: string;
    startYear: string;
    endYear: string;
    jobDescription: string;
    employee_id?: string;
    _id?: string;
}
interface Portfolio {
    gitUsername: string;
    websiteInput: string;
    dribbleName: string;
    pinterestName: string;
    _id?: string;
}


const Settings = () => {
    const skillsOptions = useSelector((state: any) => state.Skills.skills);
    const skillsStatus = useSelector((state: any) => state.Skills.status);
    const [activeTab, setActiveTab] = useState<any>("1");
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const dispatch: any = useDispatch();
    const teamDetail = useSelector(selectTeamDetail)
    const experienceData: any = useSelector((state: any) => state.Team.experienceData);
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const [profileForm, setProfileForm] = useState<ProfileForm>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: '',
        joiningDate: null,
        skills: [],
        designation: '',
        website: '',
        city: '',
        country: '',
        zipCode: '',
        description: '',
        profileCompletion: 0,
        socialLinks: ['', '', '', ''],  // Initialize with empty strings for social links
        passwordHash: '',
        projectNumber: 0,
        taskNumber: 0,
        _id: ''
    });

    useEffect(() => {
        if (!employeeId) return;
        dispatch(getTeamDataById(employeeId));
        dispatch(getExperienceData(employeeId));
        dispatch(onGetSkills({ limit: 1000, page: 1 }))
    }, [employeeId]);

    useEffect(() => {
        if (experienceData && experienceData.length > 0) {
            setExperiences(experienceData);
        }
    }, [experienceData]);

    useEffect(() => {
        if (teamDetail) {
            const modifiedTeamDetail = {
                ...teamDetail,
                skills: teamDetail.skills.map((skill: any) => ({
                    label: skill,
                    value: skill
                }))
            };
            setProfileForm(modifiedTeamDetail);
        }
    }, [teamDetail]);

    const tabChange = (tab: any) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const handleSocialLinkChange = (index: number, value: string) => {
        setProfileForm((prevForm) => {
            const updatedLinks = [...prevForm.socialLinks];
            updatedLinks[index] = value;
            return { ...prevForm, socialLinks: updatedLinks };
        });
    };

    const handleExperienceChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const updatedExperiences = [...experiences];
        updatedExperiences[index] = {
            ...updatedExperiences[index],
            [name]: value
        };
        setExperiences(updatedExperiences);
    };

    const addExperience = () => {
        setExperiences([...experiences, { jobTitle: '', companyName: '', startYear: '', endYear: '', jobDescription: '' }]);
    };

    const deleteExperience = (index: number) => {
        const experienceToDelete = experiences[index];

        if (experienceToDelete && experienceToDelete._id) {
            dispatch(deleteExperienceData(experienceToDelete._id))
        } else {
            // If there's no _id, simply remove it from the state
            const updatedExperiences = experiences.filter((_, i) => i !== index);
            setExperiences(updatedExperiences);
        }
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        console.log('!!!!!!!!!', { id, value })
        setProfileForm((prevForm) => ({
            ...prevForm,
            [id]: value,
        }));
    };

    const handleProfileDateChange = (date: Date[]) => {
        setProfileForm((prevForm) => ({
            ...prevForm,
            joiningDate: date[0],
        }));
    };

    const handleProfileUpdate = async () => {
        if (profileForm.skills) profileForm.skills = profileForm.skills.map((val: any) => val.value);
        console.log(profileForm.skills, "profileForm");
        const updatedPayload = {

            ...profileForm,
            employee_id: employeeId
            // skills: 
            // Add any additional processing here if needed
        };

        console.log('Updated Payload:', updatedPayload);
        await dispatch(updateTeamData(profileForm));
        navigate(`/pages-profile/${employeeId}`);
        // You can now use this payload to send to an API or any other processing
    };



    const handleExperienceSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        experiences.forEach(experience => {
            if (experience._id) {
                dispatch(updateExperienceData({ ...experience, employee_id: employeeId }));
            } else {
                dispatch(addExperienceData({ ...experience, employee_id: employeeId }));
            }
        });
    };



    document.title = "Profile Settings | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg profile-setting-img">
                            <img src={`${process.env.REACT_APP_STORAGEBUCKET}/${teamDetail?.coverImagePath}`} className="profile-wid-img" alt="" />
                            <div className="overlay-content">
                                <div className="text-end p-3">
                                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                        <Input id="profile-foreground-img-file-input" type="file"
                                            className="profile-foreground-img-file-input" />
                                        <Label htmlFor="profile-foreground-img-file-input"
                                            className="profile-photo-edit btn btn-light">
                                            <i className="ri-image-edit-line align-bottom me-1"></i> Change Cover
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col xxl={3}>
                            <Card className="mt-n5">
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                                            <img src={`${process.env.REACT_APP_STORAGEBUCKET}/${teamDetail?.profileImagePath}`}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="user-profile" />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input id="profile-img-file-input" type="file"
                                                    className="profile-img-file-input" />
                                                <Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        <h5 className="fs-16 mb-1">
                                            {`${teamDetail?.firstName || ''} ${teamDetail?.lastName || ''}`.trim() || 'No Name Available'}
                                        </h5>
                                        <p className="text-muted mb-0">
                                            {teamDetail?.designation || 'No Designation Available'}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="d-flex align-items-center mb-5">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Complete Your Profile</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light text-primary fs-12"><i
                                                className="ri-edit-box-line align-bottom me-1"></i> Edit</Link>
                                        </div>
                                    </div>
                                    <div className="progress animated-progress custom-progress progress-label">
                                        <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "30%" }}
                                        >
                                            <div className="label">30%</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Portfolio</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light text-primary fs-12">
                                                <i className="ri-add-fill align-bottom me-1"></i> Add
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-dark text-light">
                                                <i className="ri-github-fill"></i>
                                            </span>
                                        </div>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            id="gitUsername"
                                            placeholder="Username"
                                            value={profileForm?.socialLinks?.[0] || ''}
                                            onChange={(e) => handleSocialLinkChange(0, e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-primary">
                                                <i className="ri-global-fill"></i>
                                            </span>
                                        </div>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            id="websiteInput"
                                            placeholder="www.example.com"
                                            value={profileForm?.socialLinks?.[1] || ''}
                                            onChange={(e) => handleSocialLinkChange(1, e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-success">
                                                <i className="ri-dribbble-fill"></i>
                                            </span>
                                        </div>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            id="dribbleName"
                                            placeholder="Username"
                                            value={profileForm?.socialLinks?.[2] || ''}
                                            onChange={(e) => handleSocialLinkChange(2, e.target.value)}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-danger">
                                                <i className="ri-pinterest-fill"></i>
                                            </span>
                                        </div>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            id="pinterestName"
                                            placeholder="Username"
                                            value={profileForm?.socialLinks?.[3] || ''}
                                            onChange={(e) => handleSocialLinkChange(3, e.target.value)}
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                        </Col>

                        <Col xxl={9}>
                            <Card className="mt-xxl-n5">
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Personal Details
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button">
                                                <i className="far fa-user"></i>
                                                Change Password
                                            </NavLink>
                                        </NavItem>
                                        <NavItem >
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "3" })}
                                                onClick={() => {
                                                    tabChange("3");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Experience
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "4" })}
                                                onClick={() => {
                                                    tabChange("4");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Privacy Policy
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            {/* <Form>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="firstnameInput" className="form-label">First
                                                                Name</Label>
                                                            <Input type="text" className="form-control" id="firstnameInput"
                                                                placeholder="Enter your firstname" defaultValue="Dave" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="lastnameInput" className="form-label">Last
                                                                Name</Label>
                                                            <Input type="text" className="form-control" id="lastnameInput"
                                                                placeholder="Enter your lastname" defaultValue="Adame" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="phonenumberInput" className="form-label">Phone
                                                                Number</Label>
                                                            <Input type="text" className="form-control"
                                                                id="phonenumberInput"
                                                                placeholder="Enter your phone number"
                                                                defaultValue="+(1) 987 6543" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="emailInput" className="form-label">Email
                                                                Address</Label>
                                                            <Input type="email" className="form-control" id="emailInput"
                                                                placeholder="Enter your email"
                                                                defaultValue="daveadame@velzon.com" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="JoiningdatInput" className="form-label">Joining
                                                                Date</Label>
                                                            <Flatpickr
                                                                className="form-control"
                                                                options={{
                                                                    dateFormat: "d M, Y"
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="skillsInput" className="form-label">Skills</Label>
                                                            <select className="form-select mb-3">
                                                                <option >Select your Skill </option>
                                                                <option value="Choices1">CSS</option>
                                                                <option value="Choices2">HTML</option>
                                                                <option value="Choices3">PYTHON</option>
                                                                <option value="Choices4">JAVA</option>
                                                                <option value="Choices5">ASP.NET</option>
                                                            </select>
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="designationInput"
                                                                className="form-label">Designation</Label>
                                                            <Input type="text" className="form-control"
                                                                id="designationInput" placeholder="Designation"
                                                                defaultValue="Lead Designer / Developer" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="websiteInput1"
                                                                className="form-label">Website</Label>
                                                            <Input type="text" className="form-control" id="websiteInput1"
                                                                placeholder="www.example.com" defaultValue="www.velzon.com" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="cityInput" className="form-label">City</Label>
                                                            <Input type="text" className="form-control" id="cityInput"
                                                                placeholder="City" defaultValue="California" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="countryInput" className="form-label">Country</Label>
                                                            <Input type="text" className="form-control" id="countryInput"
                                                                placeholder="Country" defaultValue="United States" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="zipcodeInput" className="form-label">Zip
                                                                Code</Label>
                                                            <Input type="text" className="form-control" minLength={5}
                                                                maxLength={6} id="zipcodeInput"
                                                                placeholder="Enter zipcode" defaultValue="90011" />
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="mb-3 pb-2">
                                                            <Label htmlFor="exampleFormControlTextarea"
                                                                className="form-label">Description</Label>
                                                            <textarea className="form-control"
                                                                id="exampleFormControlTextarea"
                                                                rows={3} defaultValue="Hi I'm Anna Adame, It will be as simple as Occidental; in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is European languages are members of the same family."></textarea>
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button type="button"
                                                                className="btn btn-secondary">Updates</button>
                                                            <button type="button"
                                                                className="btn btn-soft-danger">Cancel</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form> */}
                                            <Form>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="firstName" className="form-label">First Name</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="firstName"
                                                                placeholder="Enter your firstname"
                                                                value={profileForm.firstName}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="lastName" className="form-label">Last Name</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="lastName"
                                                                placeholder="Enter your lastname"
                                                                value={profileForm.lastName}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="phoneNumber" className="form-label">Phone Number</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="phoneNumber"
                                                                placeholder="Enter your phone number"
                                                                value={profileForm.phoneNumber}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="emailAddress" className="form-label">Email Address</Label>
                                                            <Input
                                                                type="email"
                                                                className="form-control"
                                                                id="emailAddress"
                                                                placeholder="Enter your email"
                                                                value={profileForm.emailAddress}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="JoiningdatInput" className="form-label">Joining
                                                                Date</Label>
                                                            <Flatpickr
                                                                className="form-control"
                                                                value={profileForm.joiningDate || new Date()}
                                                                onChange={handleProfileDateChange}
                                                                options={{ dateFormat: 'd M, Y' }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        {/* <div className="mb-3">
                                                            <Label htmlFor="skills" className="form-label">Skills</Label>
                                                            <select className="form-select mb-3">
                                                                <option>Select your Skill</option>
                                                                <option value="CSS">CSS</option>
                                                                <option value="HTML">HTML</option>
                                                                <option value="PYTHON">PYTHON</option>
                                                                <option value="JAVA">JAVA</option>
                                                                <option value="ASP.NET">ASP.NET</option>
                                                            </select>
                                                        </div> */}
                                                        <div className="mb-3">
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
                                                                    value={profileForm.skills}
                                                                    name="skills"
                                                                    isMulti={true}
                                                                    onChange={(selectedOptions: any) => {
                                                                        console.log(selectedOptions, 'selectedOptions')
                                                                        setProfileForm((prevForm) => ({
                                                                            ...prevForm,
                                                                            skills: selectedOptions
                                                                        }))
                                                                        // formik.setFieldValue("selectedMulti", selectedOptions)
                                                                    }}
                                                                    options={skillsOptions}
                                                                // onBlur={() =>
                                                                //     formik.setFieldTouched("selectedMulti", true)
                                                                // }
                                                                />)}
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="designation" className="form-label">Designation</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="designation"
                                                                placeholder="Designation"
                                                                value={profileForm.designation}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="website" className="form-label">Website</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="website"
                                                                placeholder="www.example.com"
                                                                value={profileForm.website}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="city" className="form-label">City</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="city"
                                                                placeholder="City"
                                                                value={profileForm.city}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="country" className="form-label">Country</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="country"
                                                                placeholder="Country"
                                                                value={profileForm.country}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="zipCode" className="form-label">Zip Code</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="zipCode"
                                                                placeholder="Enter zipcode"
                                                                value={profileForm.zipCode}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="mb-3 pb-2">
                                                            <Label htmlFor="description" className="form-label">Description</Label>
                                                            <textarea
                                                                className="form-control"
                                                                id="description"
                                                                rows={3}
                                                                value={profileForm.description}
                                                                onChange={handleProfileChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button type="button" onClick={handleProfileUpdate}
                                                                className="btn btn-secondary">Updates</button>
                                                            <button type="button"
                                                                className="btn btn-soft-danger">Cancel</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <Form>
                                                <Row className="g-2">
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="oldpasswordInput" className="form-label">Old
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="oldpasswordInput"
                                                                placeholder="Enter current password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="newpasswordInput" className="form-label">New
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="newpasswordInput" placeholder="Enter new password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="confirmpasswordInput" className="form-label">Confirm
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="confirmpasswordInput"
                                                                placeholder="Confirm password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Link to="#"
                                                                className="link-primary text-decoration-underline">Forgot
                                                                Password ?</Link>
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="text-end">
                                                            <button type="button" className="btn btn-secondary">Change
                                                                Password</button>
                                                        </div>
                                                    </Col>

                                                </Row>

                                            </Form>
                                            <div className="mt-4 mb-3 border-bottom pb-2">
                                                <div className="float-end">
                                                    <Link to="#" className="link-primary">All Logout</Link>
                                                </div>
                                                <h5 className="card-title">Login History</h5>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>iPhone 12 Pro</h6>
                                                    <p className="text-muted mb-0">Los Angeles, United States - March 16 at
                                                        2:47PM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-tablet-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Apple iPad Pro</h6>
                                                    <p className="text-muted mb-0">Washington, United States - November 06
                                                        at 10:43AM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Galaxy S21 Ultra 5G</h6>
                                                    <p className="text-muted mb-0">Conneticut, United States - June 12 at
                                                        3:24PM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-macbook-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Dell Inspiron 14</h6>
                                                    <p className="text-muted mb-0">Phoenix, United States - July 26 at
                                                        8:10AM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <form onSubmit={handleExperienceSubmit}>
                                                {experiences.map((experience, index) => (
                                                    <div key={index} id={`experience-${index}`}>
                                                        <Row>
                                                            <Col lg={12}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor={`jobTitle-${index}`} className="form-label">Job Title</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id={`jobTitle-${index}`}
                                                                        name="jobTitle"
                                                                        placeholder="Job title"
                                                                        value={experience.jobTitle}
                                                                        onChange={(event) => handleExperienceChange(index, event)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor={`companyName-${index}`} className="form-label">Company Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id={`companyName-${index}`}
                                                                        name="companyName"
                                                                        placeholder="Company name"
                                                                        value={experience.companyName}
                                                                        onChange={(event) => handleExperienceChange(index, event)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor={`experienceYearFrom-${index}`} className="form-label">Experience Years</Label>
                                                                    <Row>
                                                                        <Col lg={5}>
                                                                            <Input
                                                                                type="select"
                                                                                className="form-control"
                                                                                id={`startYear-${index}`}
                                                                                name="startYear"
                                                                                value={experience.startYear}
                                                                                onChange={(event) => handleExperienceChange(index, event)}
                                                                            >
                                                                                <option defaultValue="">Select year</option>
                                                                                {/* Add year options here */}
                                                                                {Array.from({ length: 22 }, (_, index) => (
                                                                                    <option key={index} value={2001 + index}>{2001 + index}</option>
                                                                                ))}
                                                                            </Input>
                                                                        </Col>

                                                                        <div className="col-auto align-self-center">
                                                                            to
                                                                        </div>

                                                                        <Col lg={5}>
                                                                            <Input
                                                                                type="select"
                                                                                className="form-control"
                                                                                id={`endYear-${index}`}
                                                                                name="endYear"
                                                                                value={experience.endYear}
                                                                                onChange={(event) => handleExperienceChange(index, event)}
                                                                            >
                                                                                <option defaultValue="">Select year</option>
                                                                                {/* Add year options here */}
                                                                                {Array.from({ length: 22 }, (_, index) => (
                                                                                    <option key={index} value={2001 + index}>{2001 + index}</option>
                                                                                ))}
                                                                            </Input>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Col>

                                                            <Col lg={12}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor={`jobDescription-${index}`} className="form-label">Job Description</Label>
                                                                    <Input
                                                                        type="textarea"
                                                                        className="form-control"
                                                                        id={`jobDescription-${index}`}
                                                                        name="jobDescription"
                                                                        rows={3}
                                                                        placeholder="Enter description"
                                                                        value={experience.jobDescription}
                                                                        onChange={(event) => handleExperienceChange(index, event)}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <div className="hstack gap-2 justify-content-end">
                                                                <Link className="btn btn-danger" to="#" onClick={() => deleteExperience(index)}>Delete</Link>
                                                            </div>
                                                        </Row>
                                                    </div>
                                                ))}

                                                <div id="newForm" style={{ "display": "none" }}>
                                                </div>

                                                <Col lg={12}>
                                                    <div className="hstack gap-2">
                                                        <button type="submit" className="btn btn-primary" >Update</button>
                                                        <Link to="#" className="btn btn-secondary" onClick={addExperience}>Add New</Link>
                                                    </div>
                                                </Col>
                                            </form>
                                        </TabPane>

                                        <TabPane tabId="4">
                                            <div className="mb-4 pb-2">
                                                <h5 className="card-title text-decoration-underline mb-3">Security:</h5>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Two-factor Authentication</h6>
                                                        <p className="text-muted">Two-factor authentication is an enhanced
                                                            security meansur. Once enabled, you'll be required to give
                                                            two types of identification when you log into Google
                                                            Authentication and SMS are Supported.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm btn-primary">Enable Two-facor
                                                            Authentication</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Secondary Verification</h6>
                                                        <p className="text-muted">The first factor is a password and the
                                                            second commonly includes a text with a code sent to your
                                                            smartphone, or biometrics using your fingerprint, face, or
                                                            retina.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#" className="btn btn-sm btn-primary">Set
                                                            up secondary method</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Backup Codes</h6>
                                                        <p className="text-muted mb-sm-0">A backup code is automatically
                                                            generated for you when you turn on two-factor authentication
                                                            through your iOS or Android Twitter app. You can also
                                                            generate a backup code on twitter.com.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm btn-primary">Generate backup codes</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h5 className="card-title text-decoration-underline mb-3">Application Notifications:</h5>
                                                <ul className="list-unstyled mb-0">
                                                    <li className="d-flex">
                                                        <div className="flex-grow-1">
                                                            <label htmlFor="directMessage"
                                                                className="form-check-label fs-14">Direct messages</label>
                                                            <p className="text-muted">Messages from people you follow</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="directMessage" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="desktopNotification">
                                                                Show desktop notifications
                                                            </Label>
                                                            <p className="text-muted">Choose the option you want as your
                                                                default setting. Block a site: Next to "Not allowed to
                                                                send notifications," click Add.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="desktopNotification" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="emailNotification">
                                                                Show email notifications
                                                            </Label>
                                                            <p className="text-muted"> Under Settings, choose Notifications.
                                                                Under Select an account, choose the account to enable
                                                                notifications for. </p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="emailNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="chatNotification">
                                                                Show chat notifications
                                                            </Label>
                                                            <p className="text-muted">To prevent duplicate mobile
                                                                notifications from the Gmail and Chat apps, in settings,
                                                                turn off Chat notifications.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="chatNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="purchaesNotification">
                                                                Show purchase notifications
                                                            </Label>
                                                            <p className="text-muted">Get real-time purchase alerts to
                                                                protect yourself from fraudulent charges.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="purchaesNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="card-title text-decoration-underline mb-3">Delete This
                                                    Account:</h5>
                                                <p className="text-muted">Go to the Data & Privacy section of your profile
                                                    Account. Scroll to "Your data & privacy options." Delete your
                                                    Profile Account. Follow the instructions to delete your account :
                                                </p>
                                                <div>
                                                    <Input type="password" className="form-control" id="passwordInput"
                                                        placeholder="Enter your password" defaultValue="make@321654987"
                                                        style={{ maxWidth: "265px" }} />
                                                </div>
                                                <div className="hstack gap-2 mt-3">
                                                    <Link to="#" className="btn btn-soft-danger">Close &
                                                        Delete This Account</Link>
                                                    <Link to="#" className="btn btn-light">Cancel</Link>
                                                </div>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Settings;


