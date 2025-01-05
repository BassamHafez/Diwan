import { mainFormsHandlerTypeFormData } from "../util/Http";
import { useQuery, useMemo } from "../shared/hooks";
import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";

const useContactsOptions = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: landlords } = useQuery({
    queryKey: ["landlord", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/landlords",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const { data: brokers } = useQuery({
    queryKey: ["brokers", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "contacts/brokers", token: token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const landlordOptions = useMemo(() => {
    return convertTpOptionsFormate(landlords?.data) || [];
  }, [landlords]);

  const brokersOptions = useMemo(() => {
    return convertTpOptionsFormate(brokers?.data) || [];
  }, [brokers]);

  return { landlordOptions, brokersOptions };
};

export default useContactsOptions;
