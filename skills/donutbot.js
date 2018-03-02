/*

    This is a sample bot that provides a simple todo list function
    and demonstrates the Botkit storage system.

    Botkit comes with a generic storage system that can be used to
    store arbitrary information about a user or channel. Storage
    can be backed by a built in JSON file system, or one of many
    popular database systems.

    See:

        botkit-storage-mongo
        botkit-storage-firebase
        botkit-storage-redis
        botkit-storage-dynamodb
        botkit-storage-mysql

*/

module.exports = function(controller) {

    controller.hears([':doughnut:', ':donut:', ':donuttime:', ':donut2:'], 'ambient', function(bot, message) {
        console.log('message', message);
        const dailyDonutsDonated = 2;

        if (dailyDonutsDonated >= 6 ) {

            bot.reply(message, "You've given your last donut for the day. You've truly shown there's no I in donut. Donut worry be happy! You'll have a fresh box of donuts tomorrow.");

        } else {
            const recipientsArr = message.text.match(/\<@(.*?)\>/g);
            const count = message.text.match(/\:d(.*?)\:/g).length;
            const total = recipientsArr.length * count;
            const remain = 6 - dailyDonutsDonated;

            if (total > remain) {
                bot.reply(message, "Your generosity knows no bounds! Unfortunately your donut box does know bounds. You don't have enough in there to send all of those donuts.");
            } else {
                recipientsArr.forEach(recipient => {
                    let getter = recipient.replace(/[<@>]/g, '');
                    let sender = message.user.replace(/[<@>]/g, '');
                    notifyRecipeintOfDonutGiven(getter, sender, count);
                    notifySenderOfDonutsSent(getter, sender, count);
                });
            }
        }

    });

    function notifyRecipeintOfDonutGiven(recipient, sender, count) {
        let message = {
          text: `You received ${count} donut :donuttime: from <@${sender}>!`,
          channel: recipient // a valid slack channel, group, mpim, or im ID
        };
        bot.say(message, function(res, err) {
            console.log(res, err, 'Notified reciever');
        });
        // TODO: increment lifetimeDonuts
    }

    function notifySenderOfDonutsSent(recipient, sender, count) {
        // TODO: increment in the database
        // return current db count
        let message = {
          text: `<@${recipient}> received ${count} donuts from you. You have ${6 - count} donuts remaining donuts left to give out today.`,
          channel: sender // a valid slack channel, group, mpim, or im ID
        };
        bot.say(message, function(res, err) {
            console.log(res, err, 'Notified sender');
        });
    }
}
