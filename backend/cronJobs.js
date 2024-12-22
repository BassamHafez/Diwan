const cron = require("node-cron");
const Contract = require("./models/contractModel");
const Estate = require("./models/estateModel");
const Revenue = require("./models/revenueModel");
const ScheduledTask = require("./models/scheduledTaskModel");
const { sendWAText } = require("./utils/sendWAMessage");

let isTaskRunning = false;

const checkScheduledTasks = async () => {
  console.time("checkScheduledTasks");

  if (isTaskRunning) {
    console.timeEnd("checkScheduledTasks");
    return;
  }

  isTaskRunning = true;
  try {
    const tasks = await ScheduledTask.find({ isDone: false }).lean();

    if (tasks.length === 0) {
      console.log("No scheduled tasks to process.");
      return;
    }

    const promises = [];
    const tasksIds = [];
    const contractBulkUpdates = [];
    const estateBulkUpdates = [];

    tasks.forEach((task) => {
      tasksIds.push(task._id);

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
                    `Hello ${revenue.tenant.name}, reminder for payment of ${
                      revenue.amount
                    } for the estate "${
                      estateName || compoundName || "your property"
                    }".`
                  );
                }

                if (landlordPhone) {
                  await sendWAText(
                    landlordPhone,
                    `Reminder: ${revenue.tenant.name} payment of ${
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
      }
    });

    if (contractBulkUpdates.length > 0) {
      promises.push(Contract.bulkWrite(contractBulkUpdates));
    }

    if (estateBulkUpdates.length > 0) {
      promises.push(Estate.bulkWrite(estateBulkUpdates));
    }

    if (tasksIds.length > 0) {
      promises.push(
        ScheduledTask.bulkWrite(
          tasksIds.map((id) => ({
            updateOne: {
              filter: { _id: id },
              update: { isDone: true },
            },
          }))
        )
      );
    }

    await Promise.all(promises);

    console.log(`Processed ${tasks.length} scheduled tasks successfully.`);
  } catch (error) {
    console.error("Error processing scheduled tasks:", error);
  } finally {
    isTaskRunning = false;
    console.timeEnd("checkScheduledTasks");
  }
};

const deleteOldTasks = async () => {
  await ScheduledTask.deleteMany({ isDone: true });

  console.log("Old scheduled tasks deleted");
};

const startCronJobs = () => {
  cron.schedule("*/3 * * * *", checkScheduledTasks); // every 3 minutes
  cron.schedule("0 0 * * 0", deleteOldTasks); // every week
};

module.exports = startCronJobs;
