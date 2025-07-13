-- Add Canadian Dollar (CAD) exchange rate to the exchange_rates table
INSERT INTO exchange_rates (currency_code, rate_to_usd)
VALUES ('CAD', 1.35);

-- Verify the insertion
SELECT * FROM exchange_rates WHERE currency_code = 'CAD'; 