const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addCADExchangeRate() {
  try {
    console.log('Adding CAD exchange rate to the database...');
    
    const { data, error } = await supabase
      .from('exchange_rates')
      .insert([
        {
          currency_code: 'CAD',
          rate_to_usd: 1.35, // Current approximate rate (1 USD = 1.35 CAD)
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting CAD exchange rate:', error);
      return;
    }

    console.log('✅ Successfully added CAD exchange rate:', data);
    console.log('Currency: CAD');
    console.log('Rate to USD: 1.35');
    
  } catch (error) {
    console.error('Failed to add CAD exchange rate:', error);
  }
}

// Run the function
addCADExchangeRate(); 