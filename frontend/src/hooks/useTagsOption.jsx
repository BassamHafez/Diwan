import { mainFormsHandlerTypeRaw } from "../util/Http";
import { useQuery, useMemo } from "../shared/hooks";

const useTagsOption = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: tags, refetch: refetchTags } = useQuery({
    queryKey: ["tags", token],
    queryFn: () => mainFormsHandlerTypeRaw({ token: token, type: "tags" }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const tagsOptions = useMemo(() => {
    return (
      tags?.data?.map((tag) => ({
        label: tag,
        value: tag,
      })) || []
    );
  }, [tags]);

  return { tagsOptions, refetchTags };
};

export default useTagsOption;
