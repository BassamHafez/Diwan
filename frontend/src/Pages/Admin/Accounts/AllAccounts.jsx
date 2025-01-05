import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import AccountItem from "./AccountItem";
import {
  useState,
  useTranslation,
  useCallback,
  useMemo,
  useQuery,
} from "../../../shared/hooks";
import {
  SearchField,
  NoData,
  MainTitle,
  LoadingOne,
} from "../../../shared/components";
import { Row } from "../../../shared/bootstrap";

const AllAccounts = () => {
  const [searchFilter, setSearchFilter] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const {
    data: accounts,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allAccounts", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "accounts",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const cleanAccountData = useMemo(() => {
    if (accounts && Array.isArray(accounts?.data)) {
      return accounts.data.filter((acc) => acc.owner && acc.name);
    }
    return [];
  }, [accounts]);

  const filteredData = useMemo(() => {
    return cleanAccountData.filter(
      (acc) =>
        !searchFilter ||
        acc.name
          .trim()
          .toLowerCase()
          .includes(searchFilter.trim().toLowerCase()) ||
        acc.phone.includes(searchFilter)
    );
  }, [cleanAccountData, searchFilter]);

  return (
    <div className="admin_body height_container p-2 position-relative">
      {(!accounts || isFetching) && <LoadingOne />}
      <div className="my-4">
        <MainTitle title={key("accounts")} />
      </div>
      <div className="d-flex align-items-center">
        <div className="position-relative my-3 p-2">
          <SearchField onSearch={onSearch} text={key("searchContacts")} />
        </div>
      </div>
      <Row className="g-3">
        {filteredData?.length > 0 ? (
          filteredData?.map(
            (acc) =>
              acc.owner &&
              acc.name && (
                <AccountItem key={acc._id} acc={acc} refetch={refetch} />
              )
          )
        ) : (
          <NoData text={key("noAccounts")} />
        )}
      </Row>
    </div>
  );
};

export default AllAccounts;
