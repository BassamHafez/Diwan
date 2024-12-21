import { useQuery } from "@tanstack/react-query";
import { getPublicData } from "../../../util/Http";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import Row from "react-bootstrap/esm/Row";
import PackItem from "./PackItem";
import { useTranslation } from "react-i18next";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { useState } from "react";
import CreatePackage from "./PackagesForm/CreatePackage";

const AllPackages = () => {
  const [showAddPackModal, setShowAddPackModal] = useState(false);
  const { t: key } = useTranslation();

  const {
    data: packages,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allPackages"],
    queryFn: () => getPublicData({ type: "packages" }),
    staleTime: Infinity,
  });

  return (
    <>
      <div className="p-2">
        <div className="my-3">
          <MainTitle title={key("packages")} />
        </div>
        <div className="d-flex justify-content-end p-2 pb-3">
          <ButtonOne
            onClick={() => setShowAddPackModal(true)}
            borderd={true}
            text={key("addPackage")}
          />
        </div>

        {!packages || (isFetching && <LoadingOne />)}
        <Row className="g-4">
          {packages?.data?.map((packageData) => (
            <PackItem key={packageData._id} pack={packageData} refetch={refetch} />
          ))}
          {/* <PackItem pack={customPackage} type={"custom"} /> */}
        </Row>
      </div>
      {showAddPackModal && (
        <ModalForm
          show={showAddPackModal}
          onHide={() => setShowAddPackModal(false)}
          modalSize="lg"
        >
          <CreatePackage
            hideModal={() => setShowAddPackModal(false)}
            refetch={refetch}
          />
        </ModalForm>
      )}
    </>
  );
};

export default AllPackages;
