const cron = require("node-cron");
const Contract = require("./models/contractModel");
const Estate = require("./models/estateModel");
const Revenue = require("./models/revenueModel");
const Expense = require("./models/expenseModel");
const ScheduledMission = require("./models/scheduledMissionModel");
const { sendWAText } = require("./utils/sendWAMessage");

let isTaskRunning = false;

const checkScheduledMissions = async () => {
  console.time("checkScheduledMissions");

  if (isTaskRunning) {
    console.timeEnd("checkScheduledMissions");
    return;
  }

  isTaskRunning = true;
  try {
    const missions = await ScheduledMission.find({
      isDone: false,
      scheduledAt: { $lte: new Date() },
    }).lean();

    if (missions.length === 0) {
      console.log("No scheduled missions to process.");
      return;
    }

    const promises = [];
    const missionsIds = [];
    const contractBulkUpdates = [];
    const estateBulkUpdates = [];

    missions.forEach((task) => {
      missionsIds.push(task._id);

      if (task.type === "CONTRACT_EXPIRATION") {
        contractBulkUpdates.push({
          updateOne: {
            filter: { _id: task.contract },
            update: { status: "completed" },
          },
        });

        estateBulkUpdates.push({
          updateOne: {
            filter: { _id: task.estate },
            update: { status: "available" },
          },
        });
      } else if (task.type === "CONTRACT_ACTIVATION") {
        contractBulkUpdates.push({
          updateOne: {
            filter: { _id: task.contract },
            update: { status: "active" },
          },
        });

        estateBulkUpdates.push({
          updateOne: {
            filter: { _id: task.estate },
            update: { status: "rented" },
          },
        });

        // promises.push(
        //   ScheduledMission.create({
        //     type: "CONTRACT_EXPIRATION",
        //     scheduledAt: new Date(task.scheduledAt).setHours(23, 59, 59, 999),
        //     contract: task.contract,
        //     estate: task.estate,
        //   })
        // );
      } else if (task.type === "REVENUE_REMINDER") {
        const revenuePopOptions = [
          {
            path: "tenant",
            select: "name phone",
          },
          {
            path: "landlord",
            select: "name phone",
          },
          {
            path: "estate",
            select: "name",
          },
          {
            path: "compound",
            select: "name",
          },
        ];

        promises.push(
          Revenue.findById(task.revenue)
            .populate(revenuePopOptions)
            .then(async (revenue) => {
              if (revenue) {
                const tenantPhone = revenue.tenant?.phone;
                const landlordPhone = revenue.landlord?.phone;
                const estateName = revenue.estate?.name;
                const compoundName = revenue.compound?.name;

                if (tenantPhone) {
                  await sendWAText(
                    tenantPhone,
                    `Hello ${
                      revenue.tenant.name
                    }, diwan reminder for payment of ${
                      revenue.amount
                    } for the estate "${
                      estateName || compoundName || "your property"
                    }".`
                  );
                }

                if (landlordPhone) {
                  await sendWAText(
                    landlordPhone,
                    `Diwan Reminder: ${revenue.tenant.name} payment of ${
                      revenue.amount
                    } is due for the estate "${
                      estateName || compoundName || "your property"
                    }".`
                  );
                }
              }
            })
            .catch((err) =>
              console.error(`Error fetching revenue for reminder: ${err}`)
            )
        );
      } else if (task.type === "EXPENSE_REMINDER") {
        const expensePopOptions = [
          {
            path: "contact",
            select: "name phone",
          },
          {
            path: "landlord",
            select: "name phone",
          },
          {
            path: "estate",
            select: "name",
          },
          {
            path: "compound",
            select: "name",
          },
        ];

        promises.push(
          Expense.findById(task.expense)
            .populate(expensePopOptions)
            .then(async (expense) => {
              if (expense) {
                const contactName = expense.contact?.name;
                const landlordPhone = expense.landlord?.phone;
                const estateName = expense.estate?.name;
                const compoundName = expense.compound?.name;

                if (landlordPhone) {
                  await sendWAText(
                    landlordPhone,
                    `Diwan Reminder: ${
                      contactName || "contact"
                    } should receive payment of ${
                      expense.amount
                    } for the estate "${
                      estateName || compoundName || "your property"
                    }".`
                  );
                }
              }
            })
            .catch((err) =>
              console.error(`Error fetching expense for reminder: ${err}`)
            )
        );
      }
    });

    if (contractBulkUpdates.length > 0) {
      promises.push(Contract.bulkWrite(contractBulkUpdates));
    }

    if (estateBulkUpdates.length > 0) {
      promises.push(Estate.bulkWrite(estateBulkUpdates));
    }

    if (missionsIds.length > 0) {
      promises.push(
        ScheduledMission.bulkWrite(
          missionsIds.map((id) => ({
            updateOne: {
              filter: { _id: id },
              update: { isDone: true },
            },
          }))
        )
      );
    }

    await Promise.all(promises);

    console.log(
      `Processed ${missions.length} scheduled missions successfully.`
    );
  } catch (error) {
    console.error("Error processing scheduled missions:", error);
  } finally {
    isTaskRunning = false;
    console.timeEnd("checkScheduledMissions");
  }
};

const clearFinishedMissions = async () => {
  await ScheduledMission.deleteMany({ isDone: true });

  console.log("Old scheduled missions deleted");
};

const startCronJobs = () => {
  cron.schedule("*/3 * * * *", checkScheduledMissions); // every 3 minutes
  cron.schedule("0 17 * * 0", clearFinishedMissions); // every Sunday at 5 PM
};

module.exports = startCronJobs;
