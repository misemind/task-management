import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardBody,
  Row,
  Col,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { addComment, getCommentsByProject } from "slices/projects/thunk";
import {
  selectCommentCount,
  selectCommentError,
  selectCommentList,
} from "slices/projects/selectors";
import moment from "moment";
import Avatar from "Components/Common/Avatar";
import useFileUpload from "common/hooks/useFileUpload.hook";
import avatar from "../../../assets/images/small/img-4.jpg";
import formatTimeAgo from "common/utils/formatTimeAgo";
import { toast } from "react-toastify";
import Fileshow from "Components/Common/Fileshow";
import { resetComments } from "slices/projects/reducer";
import FileIconComponent from "Components/Common/FileIconComponent";

const CommentItem = ({ comment, handleReplyClick }: any) => {
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    setIsReplying(!isReplying);
    handleReplyClick(comment);
  };

  return (
    <div className="comment-box d-flex mb-4">
      <div className="flex-shrink-0">
        <Avatar
          src={`${process.env.REACT_APP_STORAGEBUCKET}/${comment?.userId?.profileImagePath}`}
          size={35}
          title={comment?.userId?.firstName.substring(0, 1) + comment?.userId?.lastName.substring(0, 1)}
          backgroundColor="#EBD3F8"
          color="#674188"
        />
      </div>
      <div className="reply-line"></div>
      <div className="flex-grow-1 ms-3">
        <h5 className="fs-13">
          {comment?.userId?.firstName + " " + comment?.userId?.lastName}{" "}
          <small className="text-muted ms-2">
            {moment(comment.createdAt).calendar()}&nbsp; - &nbsp;
            {formatTimeAgo(moment(comment.createdAt).fromNow())}
          </small>
        </h5>
        <p className="text-muted">{comment.content}</p>
        {comment?.files && comment?.files?.length > 0 && (
          <div className="d-flex align-items-center flex-wrap file-box mb-3 gap-2">
            {comment?.files.map((file: any, index: any) => (
              // <img key={index} src={`${process.env.REACT_APP_STORAGEBUCKET}/${file.url}`} alt="" className="img-fluid rounded" width={65} />
              <Fileshow key={index} file={file} />
            ))}
          </div>
        )}
        {/* <img src={avatar} alt="" className="img-fluid rounded" width={65} /> */}
        <Link
          to="#"
          className="badge text-muted bg-light"
          onClick={handleReply}
        >
          <i className="mdi mdi-reply"></i> Reply
        </Link>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply: any) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                handleReplyClick={handleReplyClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsSection = () => {
  const commentsContainerRef = useRef<any>(null);
  const { projectId }: any = useParams();
  const dispatch: any = useDispatch();
  const { uploadFile, uploading, error } = useFileUpload();
  // const comments = useSelector((state: any) => state.Projects.comments || []); // Assuming you have a slice named ProjectsSlice
  const [commentText, setCommentText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [page, setPage] = useState(1); // Current page
  const [hasMore, setHasMore] = useState(true); // Whether there are more comments to load

  const commentList = useSelector(selectCommentList);
  const commentCount = useSelector(selectCommentCount);
  const commentError = useSelector(selectCommentError);

  // useEffect(() => {
  //     if (projectId)
  //         dispatch(getCommentsByProject({ projectId, limit: 10, page: 1 })); // Fetch comments on component mount
  // }, [dispatch, projectId]);

  useEffect(() => {
    // Scroll to the bottom of the comments container when the comments list changes
    if (commentsContainerRef.current) {
      commentsContainerRef.current.getScrollElement().scrollTop =
        commentsContainerRef.current.getScrollElement().scrollHeight;
    }
  }, [commentList]);

  useEffect(() => {
    if (projectId) {
      dispatch(resetComments());  // Clear comments before loading new ones
      loadComments();  // Fetch new comments
    }
  }, [dispatch, projectId]);

  const loadComments = () => {
    if (!hasMore) return; // Prevent loading if there are no more comments

    dispatch(getCommentsByProject({ projectId, limit: 10, page })).then(
      (response: any) => {
        if (response.payload.length < 10) {
          setHasMore(false); // No more comments to load
        }
        setPage(page + 1); // Increment the page number
      }
    );
  };

  const handleFileInputClick = () => {
    document.getElementById("comment-file")?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles([...selectedFiles, ...Array.from(files)]);
    }
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = async () => {
    const trimmedCommentText = commentText.trim();

    if (!trimmedCommentText && selectedFiles.length === 0) {
      toast.info("Please enter a comment or attach a file before submitting.");
      return;
    }

    if (projectId) {
      // 1. Upload all files in parallel if they are provided
      const fileUploadPromises =
        selectedFiles?.length > 0
          ? selectedFiles?.map(async (file: File) => {
            const { filePath, fileName, fileExtension, fileSize } =
              await uploadFile(file);
            // return {
            //     filePath, fileName, fileExtension, fileSize
            // };
            return {
              url: filePath,
              contentType: fileExtension,
              size: fileSize,
            };
          })
          : [];

      try {
        // 2. Wait for all uploads to complete
        const [uploadedFiles] = await Promise.all([
          Promise.all(fileUploadPromises),
        ]);

        console.log("fileUploadPromises", uploadedFiles);

        const newComment = {
          content: commentText,
          files: uploadedFiles,
          parentId: replyingTo?._id || null, // Set this to the parent comment ID if it's a reply
        };

        await dispatch(addComment({ projectId, comment: newComment }));
        setCommentText(""); // Clear the textarea after submission
        setReplyingTo(null);
        setSelectedFiles([]);
        // toast.success('Comment posted successfully!');
      } catch (uploadError) {
        console.error("Failed to upload files:", uploadError);
        toast.error("Failed to post the comment. Please try again.");
      }
    }
  };

  const handleReplyClick = (comment: any) => {
    setReplyingTo(comment);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Prevent the default action of Enter (which would be a newline)
      event.preventDefault();
      // Call the function to submit the comment
      handleCommentSubmit();
    }
  };

  console.log(selectedFiles, "selectedFiles", replyingTo, page);
  return (
    <Card className="comments-section">
      <CardHeader className="align-items-center d-flex">
        <h4 className="card-title mb-0 flex-grow-1">Comments</h4>
        <div className="flex-shrink-0">
          <UncontrolledDropdown className="card-header-dropdown">
            <DropdownToggle
              tag="a"
              className="text-reset dropdown-btn"
              href="#"
            >
              <span className="text-muted">
                Recent<i className="mdi mdi-chevron-down ms-1"></i>
              </span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end" end>
              <DropdownItem>Recent</DropdownItem>
              <DropdownItem>Top Rated</DropdownItem>
              <DropdownItem>Previous</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </CardHeader>

      <CardBody>
        {/* <div className="message-box">
                    <p>Comment posted</p>
                </div> */}
        <div
          id="scrollableDiv"
          style={{
            height: "300px",
            overflow: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <InfiniteScroll
            dataLength={commentList.length}
            next={loadComments}
            hasMore={hasMore}
            loader={<></>}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            scrollableTarget="scrollableDiv"
            inverse={true} // This is the key for loading more items when you reach the top
          >
            {
              !hasMore && commentList?.length === 0 && (
                <div className="d-flex flex-column justify-content-center align-items-center gap-0">
                  <i className="ri-chat-1-line text-muted " style={{ fontSize: "2rem" }}></i>
                  <h4 className="text-muted mb-0">No Comments</h4>
                </div>
              )
            }
            {commentList?.map((comment: any) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                handleReplyClick={handleReplyClick}
              />
            ))}

            {hasMore && (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <Spinner size="sm" type="grow" className="flex-shrink-0">
                  {" "}
                  Loading...{" "}
                </Spinner>
                <h6 className="text-muted mb-0">Loading...</h6>
              </div>
            )}
          </InfiniteScroll>
        </div>
        {/* </SimpleBar> */}
        <form className="mt-4">
          <Row className="g-3">
            <Col xs={12}>
              <div className="mb-2">
                {replyingTo ? (
                  <div className="d-flex align-items-center gap-2">
                    <i className="ri-reply-fill"></i>
                    <label
                      htmlFor="commentTextarea"
                      className="form-label text-body mb-0"
                    >
                      Replying to :&nbsp;{" "}
                      {replyingTo.userId.firstName +
                        " " +
                        replyingTo.userId.lastName}
                    </label>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel Reply
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="commentTextarea"
                    className="form-label text-body mb-0"
                  >
                    Leave a Comment
                  </label>
                )}
              </div>
              {selectedFiles.length > 0 && (
                <div className="d-flex align-items-center gap-3 flex-wrap mb-2 mt-1 ml-2">
                  {selectedFiles.map((file: any, index) => (
                    <div key={index} className="preview-box position-relative">
                      <Avatar
                        shape="semi-round"
                        size={60}
                        src={URL.createObjectURL(file)}
                        icon={<FileIconComponent fileName={file.name} />}
                        color="#3A1078"
                        backgroundColor="#F7F7F8"
                        style={{ border: '1px solid #E9E9E9' }}
                      />
                      <Label
                        className="cross-btn btn btn-soft-danger btn-sm rounded-circle"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileRemove(index);
                        }}
                      >
                        <i
                          className="ri-close-line"
                          style={{ fontSize: "15px" }}
                        ></i>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                className="form-control bg-light border-light"
                id="commentTextarea"
                rows={3}
                placeholder="Enter your comment..."
                value={commentText}
                onChange={handleCommentChange}
                onKeyDown={handleKeyDown}
              ></textarea>
            </Col>
            <Col xs={12} className="text-end">
              <Input
                className="form-control d-none"
                type="file"
                id="comment-file"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btn btn-ghost-secondary btn-icon waves-effect me-1"
                onClick={handleFileInputClick}
              >
                <i className="ri-attachment-line fs-16"></i>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCommentSubmit}
              >
                Post Comment
              </button>
            </Col>
          </Row>
        </form>
      </CardBody>
    </Card>
  );
};

export default CommentsSection;
