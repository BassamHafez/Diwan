import { useSelector } from "react-redux";
import MemberItem from "./MemberItem";
import Row from "react-bootstrap/esm/Row";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { useTranslation } from "react-i18next";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { useState } from "react";
import AddMemberForm from "./ProfileForms/AddMemberForm";
import { checkAccountFeatures } from "../../../Components/Logic/LogicFun";
import { toast } from "react-toastify";

const Members = () => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const notifyError = (message) => toast.error(message);

  const checkPackage = () => {
    const isAllowed = checkAccountFeatures(
      accountInfo?.account,
      "allowedUsers"
    );
    if (!isAllowed) {
      notifyError(key("featureEnded"));
      return;
    }
    setShowAddMemberModal(true)
  };

  return (
    <div className="p-4">
      <div className={`${isArLang ? "text-start" : "text-end"} mb-4`}>
        <ButtonOne
          borderd={true}
          text={`${key("add")} ${key("member")}`}
          onClick={checkPackage}
        />
      </div>
      <Row>
        {accountInfo?.account?.members?.map((member, index) => (
          <MemberItem
            key={`${member._id}_${index}`}
            accountId={accountInfo?.account?._id}
            allPermissions={profileInfo?.permissions}
            userPermissions={member?.permissions}
            userData={member?.user}
            accountOwner={accountInfo?.account?.owner}
          />
        ))}
      </Row>
      {showAddMemberModal && (
        <ModalForm
          show={showAddMemberModal}
          onHide={() => setShowAddMemberModal(false)}
        >
          <AddMemberForm
            allPermissions={profileInfo?.permissions}
            hideModal={() => setShowAddMemberModal(false)}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default Members;
