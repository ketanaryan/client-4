const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetCache() {
  console.log('Resetting cache for all users...');
  
  // We can't update all rows with anon key easily without RLS bypassing, 
  // but if we are just testing, let's see if it works
  const { data, error } = await supabase
    .from('profiles')
    .update({ cached_course_pathway: null })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // dummy condition to match all
    
  if (error) {
    console.error('Error resetting cache:', error);
  } else {
    console.log('Cache reset successfully.');
  }
}

resetCache();
