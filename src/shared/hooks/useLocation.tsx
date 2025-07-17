import React from "react";
import { useLocation, useParams } from "react-router-dom";

const useLocationHook = () => {
  const location = useLocation();
  const { id } = useParams();

  return {location, id};
};

export default useLocationHook;
