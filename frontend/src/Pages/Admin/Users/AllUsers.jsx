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
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import SendMessaagesForm from "./SendMessaagesForm";

const AllUsers = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showMessagesModel, setShowMessagesModel] = useState(false);
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

  const selectUserHandler = (userId) => {
    const currentUsersIds = [...selectedUsers];
    const isIdExist = currentUsersIds.find((id) => id === userId);
    let updatedUsersIds = [];
    if (isIdExist) {
      updatedUsersIds = currentUsersIds.filter((id) => id !== userId);
    } else {
      updatedUsersIds = [...currentUsersIds, userId];
    }

    setSelectedUsers(updatedUsersIds);
  };

  const clearSelectedUsersIds = () => {
    setSelectedUsers([]);
  };
  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {(!users || isFetching) && <LoadingOne />}
        <div className="my-4">
          <MainTitle title={key("users")} />
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap position-relative my-3 p-2">
          <div>
            <SearchField onSearch={onSearch} text={key("searchContacts")} />
          </div>
          <div>
            <ButtonOne
              onClick={() => setShowMessagesModel(true)}
              borderd={true}
              text={key("sendMessages")}
              classes="my-2"
              disabled={selectedUsers?.length>0?false:true}
            />
          </div>
        </div>
        <Row className="g-3">
          {filteredData?.length > 0 ? (
            filteredData?.map((user) => (
              <UserItem
                key={user._id}
                userData={user}
                refetch={refetch}
                selectUserHandler={selectUserHandler}
                selectedUsers={selectedUsers}
              />
            ))
          ) : (
            <NoData text={"noUsers"} />
          )}
        </Row>
      </div>
      {showMessagesModel && (
        <ModalForm
          show={showMessagesModel}
          onHide={() => setShowMessagesModel(false)}
        >
          <SendMessaagesForm
            clearSelectedUsersIds={clearSelectedUsersIds}
            selectedUsers={selectedUsers}
            hideModal={() => setShowMessagesModel(false)}
          />
        </ModalForm>
      )}
    </>
  );
};

export default AllUsers;
