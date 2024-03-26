/*
 *
 * HomePage
 *
 */
// import PropTypes from 'prop-types';

import pluginId from "../../pluginId";
import React, { memo, useCallback } from "react";
import { request } from "@strapi/helper-plugin";
import StartButton from "../../components/StartButton";

const HomePage = () => {
  const handleStartClick = useCallback(async () => {
    try {
      await request("/ai-filler/fill-data", { method: "GET" });
      strapi.notification.toggle({
        type: "success",
        message: "Data filling started!",
      });
    } catch (error) {
      strapi.notification.toggle({
        type: "warning",
        message: "An error occurred",
      });
    }
  }, []);
  return (
    <div>
      <StartButton onStart={handleStartClick} />
    </div>
  );
};

export default memo(HomePage);
