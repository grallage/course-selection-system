import React, { useEffect, useState } from "react";
import { Breadcrumb } from "components-teacher/common/CommonElements";
import { useLocation } from "react-router-dom";
import pathName from "./data";

export default function Breadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  let location = useLocation();

  useEffect(() => {
    let pathList = location.pathname.split("/");
    let dataList = [];

    pathList.forEach((element, index) => {
      if (element === "" && index !== 0) {
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
  }, [location.key, location.pathname]);

  return (
    <Breadcrumb>
      {breadcrumbs.map((data, index) => {
        if (!data.showLink) {
          return (
            <Breadcrumb.Item active key={data.id}>
              {data.name}
            </Breadcrumb.Item>
          );
        }
        return (
          <Breadcrumb.Item href={data.url} key={data.id}>
            {data.name}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
