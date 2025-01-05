import { convertNumbersToFixedTwo } from "../Components/Logic/LogicFun";
import { useMemo } from "../shared/hooks";

const useCompoundAnlaysis = (compoundData) => {
  const totalRev = Number(compoundData?.totalRevenue) || 0;
  const totalPaidEx = Number(compoundData?.totalPaidExpenses) || 0;
  const totalPaidRev = Number(compoundData?.totalPaidRevenues) || 0;
  const commissionPercentage =
    Number(compoundData?.compound?.commissionPercentage) || 0;

  const theCommissionVal = useMemo(
    () => convertNumbersToFixedTwo(totalRev * (commissionPercentage / 100)),
    [totalRev, commissionPercentage]
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

  return {
    theCommissionVal,
    commissionPercentage,
    netIncomeVal,
    netReturnsVal,
    collectionRatioVal,
    totalPaidRev,
    totalPaidEx,
  };
};

export default useCompoundAnlaysis;
