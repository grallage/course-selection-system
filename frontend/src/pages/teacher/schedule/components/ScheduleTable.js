import React, { useEffect, useState } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-switch";
import { useModal } from "providers/DialogBootstrapProvider";
import ScheduleDeleteAlert from "./ScheduleDeleteAlert";

import {
  Table,
  Container,
  Row,
  Col,
  Form,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import {
  Card,
  SearchContainer,
  Link,
} from "components-teacher/common/CommonElements";

import {
  ScheduleContainer,
  ScheduleThead,
  ScheduleTr,
  ScheduleTh,
  ScheduleBody,
  ScheduleTd,
  AddBtn,
  DelBtn,
  ClassNameText,
  ScheduleTdWrapper,
  SwitchLabel,
} from "./ScheduleElements";

function createCourseData(item) {
  // console.log(item);
  return {
    id: item.id,
    tid: item.course.teacher,
    course_name: item.course.title,
    is_compulsory: item.course.is_compulsory,
    class_name: item.course.class_info ? item.course.class_info.name : "",
    time_span: item.time_span,
    week: item.week,
  };
}

const ScheduleTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refleshPage, setRefleshPage] = useState(0);
  const [showOtherTeacherCourse, setShowOtherTeacherCourse] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [timespans, setTimespans] = useState([]);
  const [courseSchedules, setCourseSchedules] = useState([]);
  const user = useSelector((state) => state.user.user);
  const { createModal } = useModal();

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const addSchedule = (week, timespan) => {
    const weekId = week.split("_")[1];
    const timespanId = timespan.split("_")[1];
    console.log(weeks[weekId - 1], timespans[timespanId - 1]);
    history.push({
      pathname: "/schedule/add",
      search: `?w=${weekId}&t=${timespanId}`,
      state: { week: weeks[weekId - 1], timespan: timespans[timespanId - 1] },
    });
  };

  useEffect(async () => {
    getScheduleSettings();

    const courseScheduleList = (await getCourseScheduleList()).map((item) => {
      return createCourseData(item);
    });

    setCourseSchedules(courseScheduleList);
    setIsLoading(false);
  }, [refleshPage]);

  const getCourseSchedule = (week, timespan) => {
    const courseSchedule = courseSchedules.filter(
      (item) => item.week === week && item.time_span === timespan
    );
    if (courseSchedule.length > 1) {
      console.log(courseSchedule);
    }

    return courseSchedule.length > 0 ? courseSchedule : [];
  };

  const getScheduleSettings = () => {
    let url = process.env.REACT_APP_SETTING_SCHEDULE_API;

    return axios
      .get(url, {})
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        setWeeks(json.week_settings);
        setTimespans(json.timespan_settings);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.data && response.data.detail) {
          enqueueSnackbar(response.data.detail, {
            variant: "error",
          });
        }
      });
  };

  const getCourseScheduleList = async () => {
    let url = process.env.REACT_APP_TEACHER_COURSE_SCHEDULE_API;

    return await axios
      .get(url, {
        params: {
          get_all: true,
          // showOtherTeacherCourse: showOtherTeacherCourse,
          showOtherTeacherCourse: true,
          // ordering: "time_span",
        },
      })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.data && response.data.detail) {
          enqueueSnackbar(response.data.detail, {
            variant: "error",
          });
        }
        return [];
      });
  };

  const handleDelete = async (id) => {
    let url = `${process.env.REACT_APP_TEACHER_COURSE_SCHEDULE_API}${id}/`;

    await axios
      .delete(url, {})
      .then((response) => {
        return response.data;
      })
      .then((json) => {
        enqueueSnackbar("删除成功", {
          variant: "success",
        });
        setRefleshPage(refleshPage + 1);
      })
      .catch((error) => {
        let msg = "操作失败";
        const response = error.response;
        if (response && response.data && response.data.detail) {
          msg = response.data.detail;
        }
        enqueueSnackbar(msg, {
          variant: "error",
        });
      });
  };

  const openDeleteModal = (courseSchedule) => {
    createModal({
      children: (
        <ScheduleDeleteAlert
          handleDelete={handleDelete}
          courseSchedule={courseSchedule}
        />
      ),
    });
  };

  const renderScheduleItem = (courseScheduleList, key, week, time_span) => {
    let showOther =
      courseScheduleList.filter((item) => item.tid === user.id).length === 0;
    let hasShowAddBtn = false;

    return (
      <ScheduleTd key={key}>
        <ScheduleTdWrapper>
          {courseScheduleList.map((courseSchedule, index) => {
            if (
              showOtherTeacherCourse &&
              user.id !== courseSchedule.tid &&
              showOther
            ) {
              // 其他教师课程
              hasShowAddBtn = true;
              return (
                <>
                  <ClassNameText className="other-course">
                    {courseSchedule.course_name} -{" "}
                    {courseSchedule.is_compulsory
                      ? courseSchedule.class_name
                      : ""}
                  </ClassNameText>

                  <ScheduleTdWrapper>
                    <AddBtn
                      onClick={() =>
                        addSchedule(
                          courseSchedule.week,
                          courseSchedule.time_span
                        )
                      }
                    />
                  </ScheduleTdWrapper>
                </>
              );
            } else if (user.id === courseSchedule.tid) {
              return (
                <>
                  <ClassNameText>{courseSchedule.course_name}</ClassNameText>
                  <p>{courseSchedule.is_compulsory ? "必修" : "选修"}</p>
                  <p>
                    {courseSchedule.is_compulsory
                      ? courseSchedule.class_name
                      : ""}
                  </p>
                  <DelBtn
                    className="btn btn-danger"
                    // onClick={() => handleDelete(courseSchedule.id)}
                    onClick={() => openDeleteModal(courseSchedule)}
                  />
                </>
              );
            } else if (!hasShowAddBtn && showOther) {
              return (
                <>
                  <AddBtn onClick={() => addSchedule(week, time_span)} />
                </>
              );
            }
          })}
        </ScheduleTdWrapper>
      </ScheduleTd>
    );
  };

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>课程表</Col>
        </Row>
        <SearchContainer>
          <Row>
            <Col className="d-flex align-middle justify-content-end">
              <SwitchLabel>
                {showOtherTeacherCourse
                  ? "已显示班级其他课程安排"
                  : "已隐藏班级其他课程安排"}
              </SwitchLabel>

              <Switch
                onChange={() =>
                  setShowOtherTeacherCourse(!showOtherTeacherCourse)
                }
                checked={showOtherTeacherCourse}
              />
            </Col>
          </Row>
        </SearchContainer>
      </Card.Header>
      {!isLoading && (
        <Card.Body>
          <ScheduleContainer
            className="table table-bordered text-center"
            responsive
          >
            <ScheduleThead>
              <ScheduleTr className="bg-light-gray ">
                <ScheduleTh>时间</ScheduleTh>
                {weeks.map((item, index) => (
                  <ScheduleTh key={index}>{item[1]}</ScheduleTh>
                ))}
              </ScheduleTr>
            </ScheduleThead>
            <ScheduleBody>
              {timespans.map((timespan, timespanIndex) => (
                <ScheduleTr key={timespanIndex}>
                  <ScheduleTd className="align-middle">
                    {timespan[1]}
                  </ScheduleTd>
                  {weeks.map((week, weekIndex) => {
                    const courseScheduleList = getCourseSchedule(
                      week[0],
                      timespan[0]
                    );
                    if (courseScheduleList.length > 0) {
                      return renderScheduleItem(
                        courseScheduleList,
                        weekIndex,
                        week[0],
                        timespan[0]
                      );
                    } else {
                      return (
                        <ScheduleTd key={weekIndex}>
                          <ScheduleTdWrapper>
                            <AddBtn
                              onClick={() => addSchedule(week[0], timespan[0])}
                            />
                          </ScheduleTdWrapper>
                        </ScheduleTd>
                      );
                    }
                  })}
                </ScheduleTr>
              ))}
            </ScheduleBody>
          </ScheduleContainer>
        </Card.Body>
      )}
    </Card>
  );
};

export default ScheduleTable;
