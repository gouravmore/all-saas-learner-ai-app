import React from "react";
import MainLayout from "../../components/Layouts.jsx/MainLayout";
import { Box } from "@mui/material";
import { MilestoneFormDialog } from "../../components/MilestoneForm";
import { getLocalData } from "../../utils/constants";

const MilestoneFormPage = () => {
  const language = getLocalData("lang") || "en";

  return (
    <MainLayout pageName="milestone-form" showProgress={false} loading={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          padding: 3,
        }}
      >
        {/* The form dialog will auto-open when on /Reset route */}
      </Box>
      <MilestoneFormDialog
        language={language}
        onSuccess={() => {}}
        onError={() => {}}
      />
    </MainLayout>
  );
};

export default MilestoneFormPage;
