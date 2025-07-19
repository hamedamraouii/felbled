const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Governorat = require('./models/governorat');
const Delegation = require('./models/Delegation');

// Connect to your real database
mongoose.connect('mongodb://localhost:27017/felbled_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Read your JSON file (adjust path if needed)
const governoratsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/Gouvernorats.json'), 'utf-8'));

async function importGovernorats() {
  for (const govObj of governoratsData) {
    const govName = Object.keys(govObj)[0];
    const govData = govObj[govName];

    // Create Governorat
    const govDoc = new Governorat({
      name: govName,
      image_url: govData.image_url
    });
    await govDoc.save();

    // Create Delegations
    let delegationIds = [];
    if (govData.delegations && Array.isArray(govData.delegations)) {
      for (const delName of govData.delegations) {
        const delDoc = new Delegation({
          name: delName,
          gouvernorat: govDoc._id
        });
        await delDoc.save();
        delegationIds.push(delDoc._id);
      }
    }

    // Update Governorat with delegations
    govDoc.delegations = delegationIds;
    await govDoc.save();

    console.log(`Imported governorat: ${govName}`);
  }
  mongoose.disconnect();
}

importGovernorats().catch(err => {
  console.error(err);
  mongoose.disconnect();
});