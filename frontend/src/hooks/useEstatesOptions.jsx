import { mainFormsHandlerTypeFormData } from "../util/Http";
import { useQuery, useMemo } from "../shared/hooks";
import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";

const useEstatesOptions = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: estates } = useQuery({
    queryKey: ["estates", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "estates", token: token }),
    enabled: !!token,
    staleTime: Infinity,
  });
  
  const estatesOptions = useMemo(() => {
    return convertTpOptionsFormate(estates?.data) || [];
  }, [estates]);
  
  return estatesOptions;
};

export default useEstatesOptions;
