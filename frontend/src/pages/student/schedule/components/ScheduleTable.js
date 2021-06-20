import React, { useEffect, useState } from "react";
import axios from "service/axiosConfig";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import Switch from "react-switch";

import { Row, Col } from "react-bootstrap";
import {
  Card,
  SearchContainer,
} from "components-teacher/common/CommonElements";

import {
  ScheduleContainer,
  ScheduleThead,
  ScheduleTr,
  ScheduleTh,
  ScheduleBody,
  ScheduleTd,
  AddBtn,
  ClassNameText,
  ScheduleTdWrapper,
  SwitchLabel,
} from "./ScheduleElements";

function createCourseData(item) {
  return {
    id: item.id,
    course_name: item.course.title,
    is_compulsory: item.course.is_compulsory,
    time_span: item.time_span,
    week: item.week,
  };
}

const ScheduleTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refleshPage, setRefleshPage] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [timespans, setTimespans] = useState([]);
  const [courseSchedules, setCourseSchedules] = useState([]);
  const user = useSelector((state) => state.user.user);

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

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
    return courseSchedule.length > 0 ? courseSchedule : [];
  };

  const getScheduleSettings = () => {
    let url = process.env.REACT_APP_SETTING_SCHEDULE_API;

    return axios
      .get(url, {})
      .then((response) => {
        // console.log(response.data);
        return response.data;
      })
      .then((json) => {
        setWeeks(json.week_settings);
        setTimespans(json.timespan_settings);
        console.log(json);
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
    let url = process.env.REACT_APP_STUDENT_COURSE_SCHEDULE_API;

    return await axios
      .get(url, {
        params: {
          get_all: true,
          showOtherTeacherCourse: true,
        },
      })
      .then((response) => {
        console.log(response.data);
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

  const renderScheduleItem = (courseScheduleList, key) => {
    return (
      <ScheduleTd key={key}>
        <ScheduleTdWrapper>
          {courseScheduleList.map((courseSchedule, index) => {
            return (
              <>
                <ClassNameText>{courseSchedule.course_name}</ClassNameText>
                <p>{courseSchedule.is_compulsory ? "必修" : "选修"}</p>
              </>
            );
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
                      return <ScheduleTd key={weekIndex}></ScheduleTd>;
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
