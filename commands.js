const axios = require('axios');
require('dotenv').config()

const url = `https://discord.com/api/v10/applications/${process.env.APPLICATION_ID}/commands`;

// This is an example CHAT_INPUT or Slash Command, with a type of 1
// const data = {
//   name: "blep",
//   type: 1,
//   description: "Send a random adorable animal photo",
//   options: [
//     {
//       name: "animal",
//       description: "The type of animal",
//       type: 3,
//       required: true,
//       choices: [
//         {
//           name: "Dog",
//           value: "animal_dog"
//         },
//         {
//           name: "Cat",
//           value: "animal_cat"
//         },
//         {
//           name: "Penguin",
//           value: "animal_penguin"
//         }
//       ]
//     },
//     {
//       name: "only_smol",
//       description: "Whether to show only baby animals",
//       type: 5,
//       required: false
//     }
//   ]
// };

const data = {
  name: 'askthestars',
  type: 1,
  description: "Ask the Stars for answers and inspiration"
};

// For authorization, you can use either your bot token
const headers = {
  Authorization: `Bot ${process.env.BOT_TOKEN}`
};

// or a client credentials token for your app with the applications.commands.update scope
// const headers = {
//   Authorization: "Bearer <my_credentials_token>"
// };
axios.post(url, data, { headers })
  .then(response => {
    console.log('Command created successfully:', response.data);
  })
  .catch(error => {
    console.error('Error creating command:', error.response?.data || error.message);
  });
