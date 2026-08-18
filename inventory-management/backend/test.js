const { supabase } = require("./config/supabase");

async function testConnection() {
  const { data, error } = await supabase.from("products").select("*").limit(1);

  if (error) {
    console.error("Connection Error:", error.message);
  } else {
    console.log("Supabase connected successfully! Data:", data);
  }
}

testConnection();