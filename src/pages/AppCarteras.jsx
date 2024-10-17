import React from "react";
import Layout, { Content } from "antd/es/layout/layout";

export const AppCarteras = ({ backgroundGradient, children }) => {
  return (
    <>
      <Layout style={{ marginTop: "50px" }}>
        <Content style={{ padding: "20px", background: backgroundGradient }}>
          {children}
        </Content>
      </Layout>
    </>
  );
};
