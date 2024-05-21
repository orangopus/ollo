const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const discordToken = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const commands = [
  new SlashCommandBuilder()
    .setName('post')
    .setDescription('Create a new post')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('The content of the post')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for user')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The content of the post')
        .setRequired(true)),
  new SlashCommandBuilder() // This should be a new builder for the 'delete' command
    .setName('delete')
    .setDescription('Delete a post')
    .addIntegerOption(option => // Assuming postId is an integer
      option.setName('post_id')
        .setDescription('The ID of the post to delete')
        .setRequired(true))
].map(command => command.toJSON());

client.once('ready', async () => {
  console.log('Discord bot is ready!');

  const rest = new REST({ version: '10' }).setToken(discordToken);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands('1101246274004590603', '909627161156132914'),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'post') {
    const content = interaction.options.getString('content');
    const discordUserId = interaction.user.id;

    await interaction.deferReply(); 

    try {
      const supabaseUserId = await getSupabaseUserIdFromDiscordId(discordUserId);

      if (!supabaseUserId) {
        await interaction.editReply({ content: 'Failed to retrieve Supabase user ID.' });
        return;
      }

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([{ content, user_id: supabaseUserId }]);

      if (postError) {
        console.error('Supabase error:', postError.message);
        await interaction.editReply({ content: 'Failed to create post: ' + postError.message });
      } else {
        await interaction.editReply({ content: 'Post created successfully!' });
      }
    } catch (error) {
      console.error('Interaction handling error:', error.message);
      await interaction.editReply({ content: 'An error occurred: ' + error.message });
    }
  } else if (commandName === 'delete') {
    const postId = interaction.options.getInteger('post_id'); // Ensure this matches the option name
    const discordUserId = interaction.user.id;

    await interaction.deferReply(); 

    try {
      const supabaseUserId = await getSupabaseUserIdFromDiscordId(discordUserId);

      if (!supabaseUserId) {
        await interaction.editReply({ content: 'Failed to retrieve Supabase user ID.' });
        return;
      }

      const { data: deleteData, error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', supabaseUserId); 

      if (deleteError) {
        console.error('Supabase error:', deleteError.message);
        await interaction.editReply({ content: 'Failed to delete post: ' + deleteError.message });
      } else {
        await interaction.editReply({ content: 'Post deleted successfully!' });
      }
    } catch (error) {
      console.error('Interaction handling error:', error.message);
      await interaction.editReply({ content: 'An error occurred: ' + error.message });
    }
  }
});

// Function to retrieve Supabase user ID from Discord user ID
async function getSupabaseUserIdFromDiscordId(discordUserId) {
  try {
    console.log('Fetching Supabase user ID for Discord user ID:', discordUserId);
    
    // Query Supabase for the user profile associated with the Discord user ID
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('discord_id', discordUserId)
      .single(); // Assuming each Discord user is associated with a single Supabase user

    if (error) {
      console.error('Supabase error:', error.message);
      return null; // Return null if there's an error
    }

    if (!profiles) {
      console.error('User profile not found for the provided Discord user ID.');
      return null; // Return null if user profile is not found
    }

    console.log('Retrieved user profile:', profiles);
    
    // Return the Supabase user ID associated with the Discord user ID
    return profiles.id;
  } catch (error) {
    console.error('Error retrieving Supabase user ID:', error.message);
    return null; // Return null if an error occurs
  }
}

// Function to retrieve Supabase user ID from session ID (Discord user ID)
async function getSupabaseUserIdFromSession(sessionId) {
  try {
    console.log('Fetching Supabase user ID for session ID:', sessionId);
    
    // Query Supabase for the user profile associated with the session ID (Discord user ID)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('discord_id', sessionId)
      .single(); // Assuming each Discord user is associated with a single Supabase user

    if (error) {
      console.error('Supabase error:', error.message);
      return null; // Return null if there's an error
    }

    if (!profiles) {
      console.error('User profile not found for the provided session ID.');
      return null; // Return null if user profile is not found
    }

    console.log('Retrieved user profile:', profiles);
    
    // Return the Supabase user ID associated with the session ID (Discord user ID)
    return profiles.user_id;
  } catch (error) {
    console.error('Error retrieving Supabase user ID:', error.message);
    return null; // Return null if an error occurs
  }
}



client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'search') {
    const searchQuery = interaction.options.getString('query');

    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select("*")
        .eq('username', searchQuery);

      if (error) {
        console.error('Supabase error:', error.message);
        await interaction.reply({ content: 'Error searching for user: ' + error.message });
      } else if (!users || users.length === 0) {
        await interaction.reply({ content: 'User not found.' });
      } else if (users.length === 1) {
        const userId = users[0].id;
        const encodedDisplayname = encodeURI(users[0].displayname);
        const encodedAvatar = encodeURI(users[0].avatar);
        const encodedBio = encodeURI(users[0].bio);
        console.log(users[0].bio)
        await interaction.reply({ content: `https://api.placid.app/u/lf8kbnviy?&bio[text]=${encodeURIComponent(`${users[0].bio}`)}&avatar[image]=${users[0].avatar}&displayname[text]=${users[0].displayname}` });
      } else {
        const userIds = users.map(user => user.id).join(', ');
        await interaction.reply({ content: `Multiple users found with IDs: ${userIds}` });
      }
    } catch (error) {
      console.error('Interaction handling error:', error.message);
      await interaction.reply({ content: 'An error occurred while processing your request.' });
    }
  }
});



function startBot() {
  client.login(discordToken);
}

startBot();
