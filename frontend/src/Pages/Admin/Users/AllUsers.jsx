import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import UserItem from "./UserItem";
import Row from "react-bootstrap/esm/Row";
import { useCallback, useState } from "react";
import SearchField from "../../../Components/Search/SearchField";

const AllUsers = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const {
    data: users,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "users?role=user",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filteredData =
    users && Array.isArray(users?.data)
      ? users?.data?.filter(
          (user) =>
            !searchFilter ||
            user.name
              .trim()
              .toLowerCase()
              .includes(searchFilter.trim().toLowerCase()) ||
            user.phone.includes(searchFilter)
        )
      : [];

  return (
    <div className="admin_body height_container position-relative p-2">
      {(!users || isFetching) && <LoadingOne />}
      <div className="my-4">
        <MainTitle title={key("users")} />
      </div>
      <div className="d-flex align-items-center position-relative my-3 p-2">
        <div>
          <SearchField onSearch={onSearch} text={key("searchContacts")} />
        </div>
      </div>
      <Row className="g-3">
        {filteredData?.length > 0 ? (
          filteredData?.map((user) => (
            <UserItem key={user._id} userData={user} refetch={refetch} />
          ))
        ) : (
          <NoData text={"noUsers"} />
        )}
      </Row>
    </div>
  );
};

export default AllUsers;
