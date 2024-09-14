import React from "react";
import { Link } from "react-router-dom";
import { Col, Card, CardBody, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

interface Team {
    _id: string;
    firstName: string;
    lastName?: string;
    designation: string;
    profileImagePath?: string;
    coverImagePath?: string;
    projects?: { id: string; name: string }[];
    projectNumber?: number;
    taskNumber?: number;
}

interface TeamCardProps {
    team: Team;
    onFavouriteClick: (target: EventTarget) => void;
    onEditClick: (team: Team) => void;
    onDeleteClick: (team: Team) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onFavouriteClick, onEditClick, onDeleteClick }) => {
    const bucketUrl = process.env.REACT_APP_STORAGEBUCKET || "";
    return (
        <Col>
            <Card className="team-box">
                <div className="team-cover">
                    <img
                        src={`${bucketUrl}/${team.coverImagePath}`}
                        alt=""
                        className="img-fluid"
                    />
                </div>
                <CardBody className="p-4">
                    <Row className="align-items-center team-row">
                        <Col className="team-settings">
                            <Row>
                                <Col>
                                    <div className="flex-shrink-0 me-2">
                                        <button
                                            type="button"
                                            className="btn btn-light btn-icon rounded-circle btn-sm favourite-btn"
                                            onClick={(e) => onFavouriteClick(e.target)}
                                        >
                                            <i className="ri-star-fill fs-14"></i>
                                        </button>
                                    </div>
                                </Col>

                                <UncontrolledDropdown
                                    direction="start"
                                    className="col text-end"
                                >
                                    <DropdownToggle
                                        tag="a"
                                        id="dropdownMenuLink2"
                                        role="button"
                                    >
                                        <i className="ri-more-fill fs-17"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem
                                            className="dropdown-item edit-list"
                                            href="#addmemberModal"
                                            onClick={() => onEditClick(team)}
                                        >
                                            <i className="ri-pencil-line me-2 align-bottom text-muted"></i>
                                            Edit
                                        </DropdownItem>
                                        <DropdownItem
                                            className="dropdown-item remove-list"
                                            href="#removeMemberModal"
                                            onClick={() => onDeleteClick(team)}
                                        >
                                            <i className="ri-delete-bin-5-line me-2 align-bottom text-muted"></i>
                                            Remove
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Row>
                        </Col>
                        <Col lg={4} className="col">
                            <div className="team-profile-img">
                                <div className="avatar-lg img-thumbnail rounded-circle flex-shrink-0">
                                    {team._id ? (
                                        <img
                                            src={`${bucketUrl}/${team.profileImagePath}`}
                                            alt=""
                                            className="img-fluid d-block rounded-circle"
                                        />
                                    ) : (
                                        <div className="avatar-title text-uppercase border rounded-circle bg-light text-primary">
                                            {team?.firstName?.charAt(0) +
                                                team?.firstName
                                                    ?.split(" ")
                                                    .slice(-1)
                                                    .toString()
                                                    .charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="team-content">
                                    <Link
                                        to="#"
                                        onClick={() => {
                                            // Implement logic to handle sidebar toggle
                                        }}
                                    >
                                        <h5 className="fs-16 mb-1">
                                            {`${team.firstName} ${team.lastName || ""}`}
                                        </h5>
                                    </Link>
                                    <p className="text-muted mb-0">
                                        {team.designation}
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4} className="col">
                            <Row className="text-muted text-center">
                                <Col
                                    xs={6}
                                    className="border-end border-end-dashed"
                                >
                                    <h5 className="mb-1">
                                        {team?.projectNumber || 0}
                                    </h5>
                                    <p className="text-muted mb-0">Projects</p>
                                </Col>
                                <Col xs={6}>
                                    <h5 className="mb-1">{team?.taskNumber || 0}</h5> {/* Hardcoded to 0 */}
                                    <p className="text-muted mb-0">Tasks</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={2} className="col">
                            <div className="text-end">
                                <Link
                                    to={`/pages-profile/${team._id}`}
                                    className="btn btn-light view-btn"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    );
};

export default TeamCard;
