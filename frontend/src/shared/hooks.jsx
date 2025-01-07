import useFileHandler from "../hooks/useFileHandler";
import useTagsOption from "../hooks/useTagsOption";
import useContactsOptions from "../hooks/useContactsOptions";
import useServicesContact from "../hooks/useServicesContact";
import useTenantsOptions from "../hooks/useTenantsOptions";
import useCompoundOptions from "../hooks/useCompoundOptions";
import useEstatesOptions from "../hooks/useEstatesOptions";
import useFilterPackagesDuration from "../hooks/useFilterPackagesDuration";
import useCompoundAnlaysis from "../hooks/useCompoundAnlaysis";
import useDeleteItem from "../hooks/useDeleteItem";
import useEstateAnalysis from "../hooks/useEstateAnalysis";
import useCurrentFeatures from "../hooks/useCurrentFeatures";
export {
  useFileHandler,
  useTagsOption,
  useContactsOptions,
  useServicesContact,
  useTenantsOptions,
  useCompoundOptions,
  useEstatesOptions,
  useFilterPackagesDuration,
  useCompoundAnlaysis,
  useDeleteItem,
  useEstateAnalysis,
  useCurrentFeatures
};

export { useDispatch, useSelector } from "react-redux";
export { useEffect, useState, useMemo, useCallback } from "react";
export { useParams, useNavigate } from "react-router-dom";
export { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export { useTranslation } from "react-i18next";
