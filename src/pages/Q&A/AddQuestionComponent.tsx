import { useState, useRef, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PublishIcon from "@mui/icons-material/Publish";
import CancelIcon from "@mui/icons-material/Cancel";
import { LoadingButton } from "@mui/lab";
import { ActiveContext } from "../../components/Auth/UserInfo";
import axios from "axios";
import Cookies from "js-cookie";
import { question, serverResponseType } from "./QuestionsAndAnswers";

type propsType = {
  chapterId?: number;
  operation: "add question" | "edit question";
  addQuestion?: (props: question) => void;
  editQuestion?: (props: {
    questionId: number;
    questionContent: string;
    imageURL: string;
    whereToEditQuestion: "search" | "normal";
  }) => void;
  questionFrom?: "search" | "normal";
  questionId?: number;
  questionContent?: string;
  imageURL?: string | null;
  onClose: () => void;
  setisSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setsnackbarContent: React.Dispatch<React.SetStateAction<serverResponseType>>;
};

export const AddQuestionComponent = (props: propsType) => {
  const {
    chapterId,
    operation,
    addQuestion,
    editQuestion,
    questionFrom,
    questionId,
    questionContent,
    imageURL,
    onClose,
    setisSnackbarOpen,
    setsnackbarContent,
  } = props;

  const [droppedImage, setdroppedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loadingPostingQuestion, setloadingPostingQuestion] =
    useState<boolean>(false);

  const [loadingUpdatingQuestion, setloadingUpdatingQuestion] =
    useState<boolean>(false);

  const [value, setvalue] = useState<string>("");

  const textFieldRef = useRef<HTMLTextAreaElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null!);

  const { userName, profileUrl } = useContext(ActiveContext);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;

    if (imageURL) {
      // Make an API call to remove the previous image
      try {
        axios.post("http://localhost:/Ma-rifah/remove_image.php", {
          imageURL: imageURL,
        });
      } catch (error) {
        console.error("Error removing previous image", error);
      }
    }

    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = () => {
        setdroppedImage(reader.result as string | null);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setvalue(e.currentTarget.value);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      // Display the dropped image
      const reader = new FileReader();
      reader.onload = () => {
        setdroppedImage(reader.result as string | null);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("fileInput", file);

    try {
      const response = await axios.post(
        "http://localhost:/Ma-rifah/upload_image.php",
        formData
      );

      return response;
    } catch (error) {
      console.error("Error during file upload:", error);
      setisSnackbarOpen(true);
      setsnackbarContent({
        status: "error",
        message: "Error during file upload:",
      });
    }
  };

  const handlePostQuestion = async () => {
    if (textFieldRef.current.value === "" && droppedImage === null) return;

    setloadingPostingQuestion(true);

    const inputs = {
      chapterId,
      questionContent: textFieldRef.current.value,
      imageURL: imageURL || null,
      studentId: Number(Cookies.get("id")),
    };

    if (selectedFile) {
      const response = await uploadFile(selectedFile);
      if (response?.data.status === "success") {
        const imageURL = response?.data.filePath;
        inputs.imageURL = imageURL;
      } else {
        console.error("Failed to upload file.");
        setisSnackbarOpen(true);
        setsnackbarContent({
          status: "error",
          message: "Error during file upload",
        });
        setloadingPostingQuestion(false);
        return;
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:/Ma-rifah/add_question.php",
        inputs
      );

      if (res.data.status === "success") {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        const seconds = String(currentDate.getSeconds()).padStart(2, "0");

        const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        let stdName, stdAvatar;

        if (
          userName === undefined ||
          userName === "" ||
          profileUrl === undefined ||
          profileUrl === ""
        ) {
          const stdId = Cookies.get("id");
          const response = await axios.post(
            "http://localhost/Ma-rifah/get_main_student_info.php",
            stdId
          );

          if (response.data.status === "success") {
            stdName = response.data.message.studentName;
            stdAvatar = response.data.message.avatar;
          } else {
            return;
          }
        } else {
          stdName = userName;
          stdAvatar = profileUrl;
        }

        const newQuestion = {
          questionId: res.data.questionId,
          questionContent: textFieldRef.current.value,
          questionDate: formattedDatetime,
          imageURL: inputs.imageURL,
          isModified: 0,
          studentId: Number(Cookies.get("id")),
          studentName: stdName,
          studentAvatar: stdAvatar,
          questionAnswers: [],
        };

        if (addQuestion !== undefined) addQuestion(newQuestion);

        setdroppedImage(null);
        setSelectedFile(null);
        textFieldRef.current.value = "";
        setloadingPostingQuestion(false);
        onClose();

        setisSnackbarOpen(true);
        setsnackbarContent({
          status: "success",
          message: "Question has been added successfully!",
        });
      } else {
        setisSnackbarOpen(true);
        setsnackbarContent({
          status: "error",
          message: "Error during adding question!",
        });
        setloadingPostingQuestion(false);
      }
    } catch (error) {
      setisSnackbarOpen(true);
      setsnackbarContent({
        status: "error",
        message: "Error during adding question!",
      });
      setloadingPostingQuestion(false);
    }
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setdroppedImage(null);
  };

  const handleEditQuestion = async () => {
    if (editQuestion !== undefined && questionId !== undefined) {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("fileInput", selectedFile);

        setloadingUpdatingQuestion(true);

        try {
          const response = await axios.post(
            "http://localhost:/Ma-rifah/upload_image.php",
            formData
          );

          if (response.data.status === "success") {
            const imageURL = response.data.filePath;

            const inputs = {
              questionId,
              questionContent: value,
              imageURL,
            };

            try {
              const res = await axios.post(
                "http://localhost:/Ma-rifah/update_question.php",
                inputs
              );

              if (res.data.status === "success") {
                editQuestion({
                  questionId,
                  questionContent: value,
                  imageURL,
                  whereToEditQuestion:
                    questionFrom !== undefined ? questionFrom : "normal",
                });

                setsnackbarContent({
                  status: "success",
                  message: "Question has been edited successfully!",
                });
                setisSnackbarOpen(true);

                setdroppedImage(null);
                setSelectedFile(null);
                textFieldRef.current.value = "";

                setloadingUpdatingQuestion(false);

                onClose();
              } else {
                setisSnackbarOpen(true);
                setsnackbarContent({
                  status: "error",
                  message: "Error during editing question!",
                });
                setloadingUpdatingQuestion(false);
              }
            } catch (error) {
              setisSnackbarOpen(true);
              setsnackbarContent({
                status: "error",
                message: "Error during editing question!",
              });
              setloadingUpdatingQuestion(false);
            }
          } else {
            setisSnackbarOpen(true);
            setsnackbarContent({
              status: "error",
              message: "Error during file upload",
            });
            setloadingUpdatingQuestion(false);
          }
        } catch (error) {
          setisSnackbarOpen(true);
          setsnackbarContent({
            status: "error",
            message: "Error during file upload:",
          });
          setloadingUpdatingQuestion(false);
        }
      } else {
        const inputs = {
          questionId,
          questionContent: value,

          imageURL: imageURL || null,
        };

        setloadingUpdatingQuestion(true);

        try {
          const res = await axios.post(
            "http://localhost:/Ma-rifah/update_question.php",
            inputs
          );

          if (res.data.status === "success") {
            editQuestion({
              questionId,
              questionContent: value,
              imageURL: inputs.imageURL as string,
              whereToEditQuestion:
                questionFrom !== undefined ? questionFrom : "normal",
            });

            setsnackbarContent({
              status: "success",
              message: "Question has been edited successfully!",
            });
            setisSnackbarOpen(true);

            setdroppedImage(null);
            setSelectedFile(null);
            textFieldRef.current.value = "";

            setloadingUpdatingQuestion(false);

            onClose();
          } else {
            setisSnackbarOpen(true);
            setsnackbarContent({
              status: "error",
              message: "Error during editing question!",
            });
            setloadingUpdatingQuestion(false);
          }
        } catch (error) {
          setisSnackbarOpen(true);
          setsnackbarContent({
            status: "error",
            message: "Error during editing question!",
          });
          setloadingUpdatingQuestion(false);
        }
      }
    }
  };

  useEffect(() => {
    if (imageURL !== undefined) {
      setdroppedImage(imageURL);
    }
    if (questionContent !== undefined) setvalue(questionContent);
  }, [imageURL, questionContent]);

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: "1300",
        right: "0",
        bottom: "0",
        top: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          right: "0",
          bottom: "0",
          top: "0",
          left: "0",
          opacity: "0.6",
          backgroundColor: "black",
          zIndex: "-1",
        }}
      />
      <Stack
        sx={{
          backgroundColor: "#fff",
          color: "rgba(0, 0, 0, 0.87)",
          borderRadius: "5px",
          margin: "32px",
          padding: "20px",
          position: "relative",
          boxShadow:
            "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
          width: {
            xs: "400px",
            sm: "500px",
            md: "700px",
            lg: "900px",
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{
            xs: 2,
            md: 4,
          }}
          sx={{
            "& textarea:focus": {
              outline: "none",
            },
          }}
          mb={3}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            minWidth="180px"
            textAlign={{
              xs: "center",
              md: "start",
            }}
          >
            Question Content:
          </Typography>
          <textarea
            value={value}
            onChange={handleTextAreaChange}
            placeholder="Add Your Question Here..."
            className="add-question-input"
            ref={textFieldRef}
            rows={8}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px 20px",
              fontWeight: "600",
              color: "var(--dark-blue)",
              resize: "none",
              flex: "1",
            }}
          />
        </Stack>

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{
            xs: 2,
            md: 4,
          }}
          mb={5}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            minWidth="180px"
            textAlign={{
              xs: "center",
              md: "start",
            }}
          >
            Question Image:
          </Typography>
          <Stack
            justifyContent="center"
            alignItems="center"
            flex="1"
            sx={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              overflow: "hidden",
            }}
            height="300px"
            onClick={handleClick}
          >
            <Stack
              spacing={2}
              alignItems="center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                position: "relative",
                overflow: "hidden",
                objectFit: "contain",
              }}
            >
              {droppedImage ? (
                <>
                  <img
                    src={droppedImage === null ? "" : droppedImage}
                    alt="dropped"
                    style={{ width: "100%" }}
                  />
                  <CancelIcon
                    onClick={handleResetImage}
                    sx={{
                      color: "white",
                      position: "absolute",
                      zIndex: "10",
                      top: "0",
                      right: "10px",
                    }}
                  />
                </>
              ) : (
                <>
                  <CloudUploadIcon
                    color="secondary"
                    sx={{ fontSize: "40px" }}
                  />
                  <Typography variant="subtitle1" color="grey">
                    Drag Your Image Here Or Click To Upload!
                  </Typography>
                </>
              )}

              <input
                ref={inputRef}
                type="file"
                style={{ visibility: "hidden", position: "absolute" }}
                onChange={handleFileInputChange}
              ></input>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing={{
            xs: 3,
            md: 17,
          }}
          justifyContent="center"
        >
          <Button
            startIcon={<CancelIcon />}
            disabled={loadingPostingQuestion}
            color="secondary"
            variant="contained"
            onClick={onClose}
            sx={{ color: "white" }}
          >
            Cancel
          </Button>
          {operation === "add question" ? (
            <LoadingButton
              loading={loadingPostingQuestion}
              startIcon={<PublishIcon />}
              onClick={handlePostQuestion}
              color="secondary"
              variant="contained"
              sx={{ color: "white" }}
            >
              Post Question
            </LoadingButton>
          ) : (
            <LoadingButton
              loading={loadingUpdatingQuestion}
              startIcon={<PublishIcon />}
              onClick={handleEditQuestion}
              color="secondary"
              variant="contained"
              sx={{ color: "white" }}
            >
              Update Question
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

// This componet plays 2 roles. It can either post a question or edit it. I used this component for both
// of these operation because the UI is the same between posting a question and editing a question.

// After pressing on the edit question , This component will mounts and if the question has an image it will be displayed
// automatically
