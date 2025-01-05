import { mainFormsHandlerTypeFormData } from "../util/Http";
import { useQuery, useMemo, useTranslation, useSelector } from "../shared/hooks";
import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";

const useCompoundOptions = () => {
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();

  const {
    data: compounds,
    refetch: refetchCompound,
    isFetching: fetchingCompounds,
  } = useQuery({
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
  }, [compoundsOptions, key]);

  return {
    compoundsOptions,
    compoundsOptionsWithNot,
    compounds,
    refetchCompound,
    fetchingCompounds,
  };
};

export default useCompoundOptions;
