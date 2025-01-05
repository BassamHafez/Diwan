import { mainFormsHandlerTypeFormData } from "../util/Http";
import { useQuery, useMemo, useTranslation } from "../shared/hooks";
import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";

const useCompoundOptions = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { data: compounds } = useQuery({
    queryKey: ["compounds", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "compounds", token: token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const compoundsOptions = useMemo(() => {
    return convertTpOptionsFormate(compounds?.data?.compounds) || [];
  }, [compounds]);

  const compoundsOptionsWithNot = useMemo(() => {
    return [{ label: key("notSpecified"), value: "not" }, ...compoundsOptions];
  }, [compoundsOptions,key]);

  return {compoundsOptions,compoundsOptionsWithNot};
};

export default useCompoundOptions;
