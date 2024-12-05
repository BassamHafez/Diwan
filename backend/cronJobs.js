const cron = require("node-cron");
const Contract = require("./models/contractModel");
const Estate = require("./models/estateModel");
const ScheduledTask = require("./models/scheduledTaskModel");

let isTaskRunning = false;

const checkScheduledTasks = async () => {
  console.time("checkScheduledTasks");

  if (isTaskRunning) {
    console.timeEnd("checkScheduledTasks");
    return;
  }

  isTaskRunning = true;
  try {
    const tasks = await ScheduledTask.find({
      isDone: false,
      scheduledAt: { $lte: new Date() },
    }).lean();

    if (tasks.length === 0) {
      console.log("No scheduled tasks to process.");
      return;
    }

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
      }
    });

    const promises = [];

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
  await ScheduledTask.deleteMany({
    scheduledAt: { $lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    isDone: true,
  });

  console.log("Old scheduled tasks deleted");
};

const startCronJobs = () => {
  cron.schedule("*/3 * * * *", checkScheduledTasks); // every 3 minutes
  cron.schedule("0 0 * * 0", deleteOldTasks); // every week
};

module.exports = startCronJobs;
