import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import Row from "react-bootstrap/esm/Row";
import UserItem from "../Users/UserItem";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddAdmin from "./AdminsForm/AddAdmin";

const AllAdmins = () => {
  const [showAddPackModal, setShowAddPackModal] = useState(false);

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

  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {(!users || isFetching) && <LoadingOne />}
        <div className="my-3">
          <MainTitle title={key("admins")} />
        </div>
        <div className="d-flex justify-content-end p-2 pb-3">
          <ButtonOne
            onClick={() => setShowAddPackModal(true)}
            borderd={true}
            text={key("addAdmin")}
          />
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
