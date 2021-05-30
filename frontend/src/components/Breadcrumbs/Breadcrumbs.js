import React, { useEffect, useState } from "react";
import { Breadcrumbs as MBreadcrumbs, Typography } from "@material-ui/core/";
import { EmptyToolbar } from "../Toolbar/ToolbarElements";
import {
  useLocation,
  useHistory,
  BrowserRouter as Router,
} from "react-router-dom";
import pathName from "./data";

import {
  BreadcrumbsContainer,
  BreadcrumbsWrapper,
} from "./BreadcrumbsElements";
import { CommonLink } from "../commom/CommonElements";

export default function Breadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    let pathList = location.pathname.split("/");
    let dataList = [];

    pathList.forEach((element, index) => {
      if (element === "" && index != 0) {
        return;
      }
      if (!pathName[element]) {
        return;
      }

      let path = {
        id: index,
        url: index === 0 ? "/" : `${pathList.slice(0, index + 1).join("/")}`,
        name: pathName[element],
        showLink: index !== pathList.length - 1 && element !== "edit",
      };
      dataList.push(path);
    });

    setBreadcrumbs(dataList);
  }, [location.key]);

  return (
    <BreadcrumbsContainer>
      <BreadcrumbsWrapper>
        <EmptyToolbar />
        <MBreadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((data, index) => {
            if (!data.showLink) {
              return (
                <Typography color="textPrimary" key={data.id}>
                  {data.name}
                </Typography>
              );
            }
            return (
              <CommonLink to={data.url} key={data.id}>
                {data.name}
              </CommonLink>
            );
          })}
        </MBreadcrumbs>
      </BreadcrumbsWrapper>
    </BreadcrumbsContainer>
  );
}
