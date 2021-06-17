export const teacherLinks = [
  {
    name: "用户管理",
    type: "header",
    links: [
      {
        name: "基本信息",
        url: "/personal-info",
        type: "link",
      },
      {
        name: "更改密码",
        url: "/password",
        type: "link",
      },
    ],
  },
  {
    name: "课程管理",
    type: "header",
    links: [
      {
        name: "课程",
        url: "/course",
        type: "link",
      },
      {
        name: "课程表",
        url: "/schedule",
        type: "link",
      },
    ],
  },
  {
    name: "学生管理",
    type: "header",
    links: [
      {
        name: "成绩管理",
        url: "/student-scores",
        type: "link",
      },
      // {
      //   name: "成绩统计",
      //   url: "/student-scores-statistics",
      //   type: "link",
      // },
    ],
  },
];
