import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { GiTeacher } from "react-icons/gi";
import { MdPeople } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { IoSchoolOutline } from "react-icons/io5";

export const teacherLinks = [
  {
    name: "教師資訊",
    url: "/",
    icon: <InboxIcon />,
  },
  {
    name: "課程成績",
    url: "/",
    icon: <MailIcon />,
  },
  {
    name: "課程表",
    url: "/",
    icon: <InboxIcon />,
  },
  {
    name: "選修報名",
    url: "/",
    icon: <MailIcon />,
  },
  {
    name: "用戶管理",
    url: "/",
    icon: <InboxIcon />,
  },
];
export const studentLinks = [
  {
    name: "教師資訊",
    url: "/",
    icon: <InboxIcon />,
  },
  {
    name: "課程成績",
    url: "/",
    icon: <MailIcon />,
  },
  {
    name: "課程表",
    url: "/",
    icon: <InboxIcon />,
  },
  {
    name: "選修報名",
    url: "/",
    icon: <MailIcon />,
  },
  {
    name: "用戶管理",
    url: "/",
    icon: <InboxIcon />,
  },
];
export const admininks = [
  {
    name: "专业",
    url: "/major",
    icon: <IoSchoolOutline />,
  },
  {
    name: "班级",
    url: "/class",
    icon: <SiGoogleclassroom />,
  },
  {
    name: "教师",
    url: "/teacher",
    icon: <GiTeacher />,
  },
  {
    name: "学生",
    url: "/student",
    icon: <MdPeople />,
  },
];
