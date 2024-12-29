import { useQuery } from "@tanstack/react-query";
import { getPublicData } from "../../../util/Http";
import { useTranslation } from "react-i18next";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { useState } from "react";
import CreatePackage from "./PackagesForm/CreatePackage";
import Tabs from "react-bootstrap/Tabs";
import PackageTab from "./PackageTab";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import Tab from "react-bootstrap/Tab";

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

  const packagesData = packages?.data;

  const filterPackagesByDuration = (packages, duration) =>
    packages?.filter((pack) => pack.duration === duration);

  const monthlyPackages = filterPackagesByDuration(packagesData, 1);
  const threeMonthsPackage = filterPackagesByDuration(packagesData, 3);
  const sixMonthsPackage = filterPackagesByDuration(packagesData, 6);
  const yearlyPackage = filterPackagesByDuration(packagesData, 12);

  return (
    <>
      <div className="admin_body height_container p-2 position-relative">
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
        {(!packages || isFetching) && <LoadingOne />}
        <Tabs defaultActiveKey="month" className="mb-5" fill>
          <Tab eventKey="month" title={key("month")}>
            <PackageTab packages={monthlyPackages} refetch={refetch} />
          </Tab>
          <Tab eventKey="3month" title={key("3month")}>
            <PackageTab packages={threeMonthsPackage} refetch={refetch} />
          </Tab>
          <Tab eventKey="6month" title={key("6month")}>
            <PackageTab packages={sixMonthsPackage} refetch={refetch} />
          </Tab>
          <Tab eventKey="year" title={key("year")}>
            <PackageTab
              title="year"
              packages={yearlyPackage}
              refetch={refetch}
            />
          </Tab>
        </Tabs>
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
