import Row from "react-bootstrap/Row";
import styles from "./Packages.module.css";
import PackageItem from "./PackageItem";
import { package3 } from "../../Components/Logic/StaticLists";
import { useQuery } from "@tanstack/react-query";
import { getPublicData } from "../../util/Http";
import LoadingOne from "../../Components/UI/Loading/LoadingOne";

const Packages = () => {
  
  const { data: packages, isFetching } = useQuery({
    queryKey: ["allPackages"],
    queryFn: () => getPublicData({ type: "packages" }),
    staleTime: Infinity,
  });

  return (
    <div
      style={{ backgroundColor: "#F7F7FC", overflowX: "hidden" }}
      className="py-4"
    >
      <div className={styles.container}>
        {(!packages || isFetching) && <LoadingOne />}

        <Row>
          {packages?.data?.map((packageData, index) => (
            <PackageItem
              key={packageData._id}
              pack={packageData}
              type={index % 2 === 0 ? "pack1" : "pack2"}
            />
          ))}
          <PackageItem pack={package3} type={"custom"} />
        </Row>
      </div>
    </div>
  );
};

export default Packages;
