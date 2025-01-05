import { convertNumbersToFixedTwo } from "../Components/Logic/LogicFun";
import { useMemo } from "../shared/hooks";

const useCompoundAnlaysis = (compoundData) => {
  const totalRev = Number(compoundData?.totalRevenue) || 0;
  const totalPaidEx = Number(compoundData?.totalPaidExpenses) || 0;
  const totalPaidRev = Number(compoundData?.totalPaidRevenues) || 0;
  const totalMonthRev = Number(compoundData?.totalMonthRevenue);
  const totalMonthPaidRev = Number(compoundData?.totalMonthPaidRevenues);
  const totalEstatesCount =
    compoundData?.estates?.length || compoundData?.compound?.estatesCount || 0;
  const commissionPercentage =
    Number(compoundData?.compound?.commissionPercentage) || 0;

  const theCommissionVal = useMemo(
    () => convertNumbersToFixedTwo(totalPaidRev * (commissionPercentage / 100)),
    [totalPaidRev, commissionPercentage]
  );

  const netIncomeVal = useMemo(
    () =>
      totalPaidRev > 0
        ? convertNumbersToFixedTwo(
            totalPaidRev - totalPaidEx - theCommissionVal
          )
        : 0,
    [totalPaidRev, totalPaidEx, theCommissionVal]
  );

  const collectionRatioVal = useMemo(
    () =>
      totalRev > 0
        ? convertNumbersToFixedTwo((totalPaidRev / totalRev) * 100)
        : 0,
    [totalPaidRev, totalRev]
  );

  const netReturnsVal = useMemo(
    () =>
      totalPaidRev > 0
        ? convertNumbersToFixedTwo((netIncomeVal / totalPaidRev) * 100)
        : 0,
    [totalPaidRev, netIncomeVal]
  );

  const rentedEstateCount = useMemo(() => {
    let rentedEstatesArr = [];

    if (compoundData) {
      rentedEstatesArr = compoundData?.estates.filter(
        (estate) => estate.status === "rented"
      );
      const myrentedEstateCount = rentedEstatesArr?.length || 0;
      return myrentedEstateCount;
    }
  }, [compoundData]);

  return {
    theCommissionVal,
    commissionPercentage,
    netIncomeVal,
    netReturnsVal,
    collectionRatioVal,
    totalRev,
    totalPaidRev,
    totalPaidEx,
    totalMonthRev,
    totalMonthPaidRev,
    totalEstatesCount,
    rentedEstateCount
  };
};

export default useCompoundAnlaysis;
