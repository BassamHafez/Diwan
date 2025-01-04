import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import Row from "react-bootstrap/esm/Row";
import UserItem from "../Users/UserItem";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { useCallback, useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddAdmin from "./AdminsForm/AddAdmin";
import SearchField from "../../../Components/Search/SearchField";

const AllAdmins = () => {
  
  const [showAddPackModal, setShowAddPackModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const {
    data: users,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allAdmins", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "users?role=admin",
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
    <>
      <div className="admin_body height_container position-relative p-2">
        {(!users || isFetching) && <LoadingOne />}
        <div className="my-3">
          <MainTitle title={key("admins")} />
        </div>
        <div className="d-flex justify-content-between position-relative my-1 p-2">
          <div className="my-2">
            <SearchField onSearch={onSearch} text={key("searchContacts")} />
          </div>
          <ButtonOne
            onClick={() => setShowAddPackModal(true)}
            borderd={true}
            text={key("addAdmin")}
            classes="my-2"
          />
        </div>
        <Row className="g-3">
          {filteredData?.length > 0 ? (
            filteredData?.map((user) => (
              <UserItem key={user._id} userData={user} refetch={refetch} isAdminPage={true} />
            ))
          ) : (
            <NoData text={"noResults"} />
          )}
        </Row>
      </div>
      {showAddPackModal && (
        <ModalForm
          show={showAddPackModal}
          onHide={() => setShowAddPackModal(false)}
          modalSize="lg"
        >
          <AddAdmin
            hideModal={() => setShowAddPackModal(false)}
            refetch={refetch}
          />
        </ModalForm>
      )}
    </>
  );
};

export default AllAdmins;
