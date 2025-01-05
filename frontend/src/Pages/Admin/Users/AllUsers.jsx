import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import UserItem from "./UserItem";
import SendMessaagesForm from "./SendMessaagesForm";
import {
  useState,
  useTranslation,
  useCallback,
  useMemo,
  useQuery,
} from "../../../shared/hooks";
import {
  MainTitle,
  LoadingOne,
  NoData,
  SearchField,
  ButtonOne,
  ModalForm,
} from "../../../shared/components";
import { Row } from "../../../shared/bootstrap";

const AllUsers = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
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

  const filteredData = useMemo(() => {
    if (!users || !Array.isArray(users?.data)) return [];
    return users.data.filter(
      (user) =>
        !searchFilter ||
        user.name
          .trim()
          .toLowerCase()
          .includes(searchFilter.trim().toLowerCase()) ||
        user.phone.includes(searchFilter)
    );
  }, [users, searchFilter]);

  const selectUserHandler = useCallback((userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  }, []);

  const handleShowAddModal = useCallback(() => setShowMessagesModal(true), []);
  const handleHideAddModal = useCallback(() => setShowMessagesModal(false), []);

  const clearSelectedUsers = useCallback(() => {
    setSelectedUsers([]);
  }, []);

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
              onClick={handleShowAddModal}
              borderd={true}
              text={key("sendMessages")}
              classes="my-2"
              disabled={selectedUsers?.length > 0 ? false : true}
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
      {showMessagesModal && (
        <ModalForm show={showMessagesModal} onHide={handleHideAddModal}>
          <SendMessaagesForm
            clearSelectedUsersIds={clearSelectedUsers}
            selectedUsers={selectedUsers}
            hideModal={handleHideAddModal}
          />
        </ModalForm>
      )}
    </>
  );
};

export default AllUsers;
