const checkForUpdate = require("update-check")
const { store } = require('@blixai/core')
const debug = require("debug")("blix:cli:checkForUpdate")

const checkIfUpdate = async (pjson) => {
    try {
        const update = await checkForUpdate(pjson);
        if (update) {
            store.blixNeedsUpdate = true
            store.blixLatestVersion = update.latest
        }
    } catch (err) {
        debug("Failed checking for updates to Blix package.")
    }
};

module.exports = checkIfUpdate