import React from "react";
import { PageContainer, GridContainer } from "components/commom/CommonElements";
import PasswordForm from "./components/PasswordForm";

function PasswordPage() {
  return (
    <main>
      <PageContainer maxWidth="lg">
        <GridContainer>
          <PasswordForm />
        </GridContainer>
      </PageContainer>
    </main>
  );
}

export default PasswordPage;
