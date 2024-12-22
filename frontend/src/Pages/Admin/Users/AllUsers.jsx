import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import UserItem from "./UserItem";
import Row from "react-bootstrap/esm/Row";

const AllUsers = () => {
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

  return (
    <div className="admin_body height_container position-relative p-2">
      {(!users || isFetching) && <LoadingOne />}
      <div className="my-4">
        <MainTitle title={key("users")} />
      </div>

      <Row className="g-3">
        {users?.data?.length > 0 ? (
          users?.data?.map((user) => (
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
