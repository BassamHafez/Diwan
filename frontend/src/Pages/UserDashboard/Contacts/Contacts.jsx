import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import { useSelector } from "react-redux";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import ContactItem from "./ContactItem";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Row from "react-bootstrap/esm/Row";
import { useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddContactForm from "./ContactForms/AddContactForm";

const Contacts = () => {
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["contacts", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "contacts", token: token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  return (
    <div className="p-2 p-md-5 over" style={{ minHeight: "84vh" }}>
      <h4>{key("contacts")}</h4>
      <div className="d-flex justify-content-between align-items-center flex-wrap my-4">
        <div>
          <SearchField text={key("searchContacts")} />
        </div>

        <div>
          <ButtonOne
            onClick={() => setShowAddContactModal(true)}
            text={key("add")}
          />
        </div>
      </div>
      <Row className="position-relative">
        {isFetching ? (
          <LoadingOne />
        ) : data ? (
          data.data?.map((contact) => (
            <ContactItem key={contact._id} contact={contact} />
          ))
        ) : (
          <NoData text={key("noContacts")} />
        )}
      </Row>

      {showAddContactModal && (
        <ModalForm
          show={showAddContactModal}
          onHide={() => setShowAddContactModal(false)}
          modalSize="lg"
        >
          <AddContactForm
            hideModal={() => setShowAddContactModal(false)}
            refetch={refetch}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default Contacts;
