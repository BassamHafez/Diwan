import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";
import { useQuery, useMemo } from "../shared/hooks";
import { mainFormsHandlerTypeFormData } from "../util/Http";

const useTenantsOptions = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: tenants, refetch: refetchTenants } = useQuery({
    queryKey: ["tenant", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/tenants",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const tenantsOptions = useMemo(() => {
    return convertTpOptionsFormate(tenants?.data) || [];
  }, [tenants]);

  return { tenantsOptions, refetchTenants };
};

export default useTenantsOptions;
