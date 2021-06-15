import React, { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "../common/CommonElements";
import {
  SidebarContainer,
  SidebarCard,
  SidebarItemGroup,
  SidebarItem,
  SidebarCardHeader,
  SidebarBody,
  SidebarHeader,
} from "./SidebarElement";
import { BiAtom } from "react-icons/bi";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  Show as showSidebar,
  Hidden as hiddenSidebar,
} from "../../redux/actions/sidebarAction";

// data
import { teacherLinks } from "./data";

const Sidebar = () => {
  const sidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  const handleHiddenSidebar = () => {
    dispatch(hiddenSidebar());
  };

  const renderSidebarItems = (items) => {
    if (!items) {
      return <></>;
    }

    return items.map((item, index) => {
      return (
        <SidebarItem key={index}>
          <Link to={item.url}>{item.name}</Link>
        </SidebarItem>
      );
    });
  };

  const renderSidebarItemContent = () => {
    return teacherLinks.map((item, index) => {
      if (item.type === "header") {
        const children = renderSidebarItems(item.links);
        return (
          <SidebarItemGroup variant="flush" key={index}>
            <SidebarHeader>{item.name}</SidebarHeader>
            {children}
          </SidebarItemGroup>
        );
      } else {
        return (
          <SidebarItem key={index}>
            <Link to={item.url}>{item.name}</Link>
          </SidebarItem>
        );
      }
    });
  };

  return (
    <SidebarContainer showsidebar={sidebar.display ? 1 : 0}>
      <SidebarCard>
        <SidebarCardHeader onClick={handleHiddenSidebar}>
          <BiAtom />
          教师管理后台
        </SidebarCardHeader>
        <SidebarBody>
          {renderSidebarItemContent()}

          {/* <SidebarItemGroup variant="flush">
            <SidebarHeader>用户信息</SidebarHeader>
            <SidebarItem>Lynn</SidebarItem>
          </SidebarItemGroup>
          <SidebarItemGroup variant="flush">
            <SidebarHeader>基本</SidebarHeader>
            <SidebarItem>Cras justo odio</SidebarItem>
            <SidebarItem>Dapibus ac facilisis in</SidebarItem>
            <SidebarItem>Vestibulum at eros</SidebarItem>
          </SidebarItemGroup> */}
        </SidebarBody>
      </SidebarCard>
    </SidebarContainer>
  );
};

export default Sidebar;
