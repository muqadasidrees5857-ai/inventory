const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase URL ya Key .env file me nahi mili!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };