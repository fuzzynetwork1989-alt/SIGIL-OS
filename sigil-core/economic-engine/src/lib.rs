//! Economic Engine - Transactional operations

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Token transaction
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenTransaction {
    pub id: String,
    pub user_id: String,
    pub transaction_type: TransactionType,
    pub amount: f64,
    pub balance_after: f64,
    pub reason: String,
    pub timestamp: DateTime<Utc>,
}

/// Transaction type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TransactionType {
    Mint,
    Burn,
    Transfer,
    Consume,
}

/// Economic engine
pub struct EconomicEngine {
    balances: HashMap<String, f64>,
    transactions: Vec<TokenTransaction>,
}

impl EconomicEngine {
    pub fn new() -> Self {
        Self {
            balances: HashMap::new(),
            transactions: Vec::new(),
        }
    }

    pub fn mint(&mut self, user_id: String, amount: f64, reason: String) -> TokenTransaction {
        let balance = self.balances.entry(user_id.clone()).or_insert(0.0);
        *balance += amount;

        let transaction = TokenTransaction {
            id: Uuid::new_v4().to_string(),
            user_id,
            transaction_type: TransactionType::Mint,
            amount,
            balance_after: *balance,
            reason,
            timestamp: Utc::now(),
        };

        self.transactions.push(transaction.clone());
        transaction
    }

    pub fn burn(&mut self, user_id: String, amount: f64, reason: String) -> Result<TokenTransaction, String> {
        let balance = self.balances.get(&user_id).ok_or("User not found")?;
        
        if *balance < amount {
            return Err("Insufficient balance".to_string());
        }

        let balance = self.balances.get_mut(&user_id).unwrap();
        *balance -= amount;

        let transaction = TokenTransaction {
            id: Uuid::new_v4().to_string(),
            user_id,
            transaction_type: TransactionType::Burn,
            amount,
            balance_after: *balance,
            reason,
            timestamp: Utc::now(),
        };

        self.transactions.push(transaction.clone());
        Ok(transaction)
    }

    pub fn get_balance(&self, user_id: &str) -> Option<f64> {
        self.balances.get(user_id).copied()
    }

    pub fn get_transactions(&self, user_id: &str) -> Vec<&TokenTransaction> {
        self.transactions.iter().filter(|t| t.user_id == user_id).collect()
    }
}

impl Default for EconomicEngine {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_economic_engine() {
        let mut engine = EconomicEngine::new();
        
        let tx = engine.mint("user-1".to_string(), 1000.0, "Initial balance".to_string());
        assert_eq!(tx.amount, 1000.0);
        assert_eq!(tx.balance_after, 1000.0);
        
        let balance = engine.get_balance("user-1");
        assert_eq!(balance, Some(1000.0));
    }
}
