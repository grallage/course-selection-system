import React from "react";
import { GridContainer, PageContainer } from "components/commom/CommonElements";

const index = () => {
  return (
    <main>
      <PageContainer maxWidth="lg">
        <GridContainer>
          <section>
            {/* 此处放置学校新闻，疫情情况，优秀学生新闻，好人好人，寻物等 */}
            欢迎来到管理员后台。
          </section>
        </GridContainer>
      </PageContainer>
    </main>
  );
};

export default index;
