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

const cmds = [{
  name: 'askthestars',
  type: 1,
  description: "Ask the Stars for answers and inspiration"
}, {
  name: 'question',
  type: 1,
  description: "Ask the stars a yes/no question",
  options: [
    {
      name: 'question',
      required: true,
      type: 3,
      description: 'Your question'
    },
    {
      name: "yes_is_less_likely",
      description: "Lower chance of yes",
      type: 5,
      required: false
    },
    {
      name: "yes_is_more_likely",
      description: "Higher chance of yes",
      type: 5,
      required: false
    }
  ]
}];

// For authorization, you can use either your bot token
const headers = {
  Authorization: `Bot ${process.env.BOT_TOKEN}`
};

// or a client credentials token for your app with the applications.commands.update scope
// const headers = {
//   Authorization: "Bearer <my_credentials_token>"
// };

for (data of cmds) {
  axios.post(url, data, { headers })
  .then(response => {
    console.log('Command created successfully:', response.data);
  })
  .catch(error => {
    console.error('Error creating command:', error.response?.data || error.message);
  });
}

