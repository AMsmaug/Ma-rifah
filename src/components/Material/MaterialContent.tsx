import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React, { useContext, useEffect, useState } from "react";
import { CoursesContext } from "../Courses progress/CoursesContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

type chapterIntroType = {
  chapterName: string;
  chapterNumber: number;
  videoUrl: string;
  description: string;
};

type chapterContentType = {
  contentId: number;
  type: string;
  content: string;
  order: string;
};

export const MaterialContent = () => {
  const location = useLocation();
  const { currentCourseId, currentChapterId, studentInfo } =
    useContext(CoursesContext);
  const navigate = useNavigate();
  const [chapterTitle, setChapterTitle] = useState(
    {} as { name: string; number: number }
  );
  const [chapterDesc, setChapterDesc] = useState(``);
  const [chapterUrl, setChapterUrl] = useState(``);
  const [chapterContent, setChapterContent] = useState<chapterContentType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const currentPath = location.pathname;
  const courseName = currentPath.substring(currentPath.lastIndexOf(`/`) + 1);

  const isMobile = window.innerWidth <= 960;

  const handleStartAssignment = () => {
    navigate(`Assignment`, {
      state: {
        chapterTitle,
        currentChapterId,
        fromPage: true,
        currentCourseId,
      },
    });
  };

  useEffect(() => {
    if (currentChapterId) {
      axios
        .post(
          `http://localhost/Ma-rifah/courses_content/get_chapter_content.php`,
          currentChapterId
        )
        .then(
          (response: {
            data: { intro: chapterIntroType; content: chapterContentType[] };
          }) => {
            console.log(response.data);
            setChapterTitle({
              name: response.data.intro.chapterName,
              number: response.data.intro.chapterNumber,
            });
            setChapterDesc(response.data.intro.description);
            setChapterUrl(response.data.intro.videoUrl);
            setChapterContent(response.data.content);
            setIsLoading(false);
          }
        );
    }
  }, [currentChapterId]);

  let grade;
  let fullMark;

  studentInfo.forEach((student) => {
    if (student.courseId === currentCourseId) {
      grade = student.studentGrade;
      fullMark = student.fullMark;
    }
  });

  return isLoading ? (
    <Stack
      flex={1}
      justifyContent={`center`}
      alignContent={`center`}
      direction={`row`}
      flexBasis={`100px`}
      paddingTop={`150px`}
    >
      <CircularProgress size={`60px`} />
    </Stack>
  ) : (
    <Box sx={{ flex: 1, padding: `0 30px` }}>
      <Stack
        sx={{ margin: "15px 10px" }}
        direction={`row`}
        alignItems={`center`}
        justifyContent={"space-between"}
      >
        <Typography
          variant="h3"
          component={`h1`}
          color="secondary.main"
          className="main-title"
          width={`fit-content`}
          // fontWeight={{ xs: `bold` }}
          fontSize={{
            xs: `32px`,
            sm: `40px`,
            md: `46px`,
            lg: `46px`,
          }}
        >
          {courseName}
        </Typography>
        <Typography
          bgcolor={`primary.main`}
          padding={{
            xs: `8px 10px`,
            sm: `10px 20px`,
            md: `10px 20px`,
            lg: `10px 20px`,
          }}
          borderRadius={`12px`}
          fontSize={{
            xs: `16px`,
            md: `18px`,
            lg: `18px`,
          }}
        >
          Course grade: {Math.round(grade as unknown as number)} / {fullMark}
        </Typography>
      </Stack>
      <Typography
        variant="h5"
        component={`h3`}
        fontWeight={`bold`}
        fontSize={{
          xs: `21px`,
          md: `28px`,
          lg: `28px`,
        }}
        color={`secondary`}
        sx={{ margin: `50px 0 0` }}
      >
        Chapter {chapterTitle.number}: {chapterTitle.name}
      </Typography>
      <Typography margin={`15px 0`}>{chapterDesc}</Typography>
      <Box mt={`20px`}>
        <iframe
          width={isMobile ? `100%` : `560`}
          height="315"
          src={`${chapterUrl}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </Box>
      {chapterContent.map((section) => {
        switch (section.type) {
          case "paragraph":
            return (
              <Typography key={section.contentId} mt={`30px`} mb={`30px`}>
                {section.content}
              </Typography>
            );
          case "title":
            return (
              <Typography
                key={section.contentId}
                variant="h6"
                fontWeight={`bold`}
                margin={`20px 0`}
              >
                {section.content}
              </Typography>
            );
          case "example":
            return (
              <Typography
                key={section.contentId}
                bgcolor={`secondary.dark`}
                color={`white`}
                padding={`16px 16px 16px 30px`}
                borderRadius={`16px`}
                mb={`20px`}
                mt={`20px`}
                lineHeight={2}
              >
                {section.content.split("\n").map((item, index) => (
                  <React.Fragment key={index}>
                    {item[item.length - 2] === "n"
                      ? item.slice(0, item.length - 3)
                      : item}
                    {index < section.content.split("\n").length - 1 && <br />}
                    {/* Add <br /> except for the last element */}
                  </React.Fragment>
                ))}
              </Typography>
            );
          case "list":
            // eslint-disable-next-line no-case-declarations
            const items = section.content.split(`;`);
            return (
              <List key={section.contentId}>
                {items.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      <CircleIcon sx={{ width: `10px` }} color="primary" />
                    </ListItemIcon>
                    <ListItemText sx={{ marginLeft: `-25px` }}>
                      {item}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            );
        }
      })}
      <Button
        sx={{
          color: `white`,
          backgroundColor: `primary.main`,
          margin: `30px 0 100px`,
          borderRadius: `16px`,
          padding: `10px`,
          "&:hover": {
            backgroundColor: `primary.dark`,
          },
        }}
        onClick={handleStartAssignment}
      >
        Start Assignments
      </Button>
    </Box>
  );
};
