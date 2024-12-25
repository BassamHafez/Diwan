import { useTranslation } from "react-i18next";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import Row from "react-bootstrap/esm/Row";

import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";

import { useCallback, useState } from "react";
import SearchField from "../../../Components/Search/SearchField";
import AccountItem from "./AccountItem";

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

  const cleanAccountData =
    accounts && Array.isArray(accounts?.data)
      ? accounts?.data?.filter((acc) => acc.owner && acc.name)
      : [];

  const filteredData =
    cleanAccountData && Array.isArray(cleanAccountData)
      ? cleanAccountData?.filter(
          (acc) =>
            !searchFilter ||
            acc?.name
              .trim()
              .toLowerCase()
              .includes(searchFilter.trim().toLowerCase()) ||
            acc?.phone.includes(searchFilter)
        )
      : [];

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
